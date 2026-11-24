import { randomUUID } from 'node:crypto'
import type { Payload, PayloadRequest } from 'payload'
import { bilingual, slugify } from '../../collections/Resources'
import type { Resource } from '../../payload-types'
import { CMS_OWNED_SHEET_IDS } from './cmsOwned'
import { cleanCell, splitMulti, type SheetRow } from './parse'
import { shortDescription } from './shortDescription'
import { mapResourceType } from './typeMap'

// Not routable, so a system account can never receive mail or be reached by a password reset.
const SYSTEM_EMAIL_DOMAIN = 'sources.quran.tech.invalid'

export type ImportResult = { created: number; updated: number; unchanged: number; usersCreated: number }

const cell = (row: SheetRow, key: string) => cleanCell(row[key] ?? '')

// Keeps the first whitespace-delimited token ("https://x.org/ (usage guide)" -> the link); anything that is not http(s) is dropped.
function httpUrl(value: string | null): string | null {
  const token = value?.split(/\s/)[0]
  if (!token) return null
  try {
    const { protocol } = new URL(token)
    return protocol === 'http:' || protocol === 'https:' ? token : null
  } catch {
    return null
  }
}

// URL columns are language-neutral: prefer the _en cell, fall back to _ar.
const urlCell = (row: SheetRow, key: string) => httpUrl(cell(row, `${key}_en`) ?? cell(row, `${key}_ar`))

// Exact leading token only, so "Not planned" never reads as "no" or "planned"; "No (planned: ...)" and "No (iframe ...)" keep their qualifier.
function hasApi(value: string | undefined): Resource['has_api'] {
  const m = /^(yes|no|planned|iframe)\b(?:\s*\((planned|iframe)\b)?/.exec(cleanCell(value ?? '')?.toLowerCase() ?? '')
  if (!m) return null
  return (m[1] === 'no' && m[2] ? m[2] : m[1]) as Resource['has_api']
}

// The sheet writes "Turkish (tr), left-to-right": drop the direction tokens and the ISO suffix so "Urdu (ur)" and "Urdu" merge.
const languagesOf = (value: string): string[] => [
  ...new Set(splitMulti(value).filter((t) => !/^(left|right)-to-(left|right)$/i.test(t)).map((t) => t.replace(/\s*\([a-z]{2,3}\)$/i, ''))),
]

function prepare(row: SheetRow) {
  const id = cell(row, 'id')
  const fail = (msg: string) => new Error(`Sheet row ${id ?? '(no id)'}: ${msg}`)
  if (!id) throw fail('missing id')

  const name = cell(row, 'name_ar') ?? cell(row, 'name_en')
  const description = cell(row, 'description_ar') ?? cell(row, 'description_en')
  const descriptionEn = cell(row, 'description_en')
  const source = cell(row, 'source_en') ?? cell(row, 'source_ar')
  if (!name || !description) throw fail('name and description are both empty')
  if (!source || !slugify(source)) throw fail('source is empty')

  const fields = {
    sheet_id: id,
    name,
    name_en: cell(row, 'name_en'),
    description,
    description_en: descriptionEn,
    short_description: shortDescription(description),
    short_description_en: descriptionEn && shortDescription(descriptionEn),
    type: mapResourceType(row),
    license: cell(row, 'license_ar') ?? cell(row, 'license_en'),
    license_en: cell(row, 'license_en'),
    version: cell(row, 'version_en') ?? cell(row, 'version_ar'),
    website_url: httpUrl(cell(row, 'main_url')),
    documentation_url: urlCell(row, 'docs_url'),
    base_url: urlCell(row, 'base_url'),
    api_key_url: urlCell(row, 'api_key_url'),
    playground_url: urlCell(row, 'playground_url'),
    download_url: urlCell(row, 'download_url'),
    repository: urlCell(row, 'repository'),
    sample_request: cell(row, 'sample_request_en') ?? cell(row, 'sample_request_ar'),
    source_type: cell(row, 'resource_type_en'),
    source_status: cell(row, 'status_en'),
    source_last_updated: cell(row, 'source_last_updated_en'),
    verified_on: cell(row, 'verified_on'),
    languages: languagesOf(row.languages_en ?? ''),
    tags: splitMulti(row.tags_en ?? ''),
    data_formats: splitMulti(row.data_formats_en ?? ''),
    has_api: hasApi(row.has_api_en),
    ...(CMS_OWNED_SHEET_IDS.has(id) && { status: 'draft' as const }),
    ...Object.fromEntries(bilingual.flatMap((n) => [[n, cell(row, `${n}_ar`)], [`${n}_en`, cell(row, `${n}_en`)]])),
  }
  return { id, fields, source, slugBase: slugify(cell(row, 'name_en') ?? name) || 'resource' }
}

// Every write of an import or rollback shares one transaction, so any failure leaves the database untouched.
async function inTransaction<T>(payload: Payload, commit: boolean, run: (req: Partial<PayloadRequest>) => Promise<T>): Promise<T> {
  const txId = await payload.db.beginTransaction()
  if (txId === null) throw new Error('The database adapter does not support transactions; refusing to write without one')
  try {
    const out = await run({ transactionID: txId })
    await (commit ? payload.db.commitTransaction(txId) : payload.db.rollbackTransaction(txId))
    return out
  } catch (error) {
    await payload.db.rollbackTransaction(txId).catch(() => {})
    throw error
  }
}

export async function importSheet(payload: Payload, rows: SheetRow[], { dryRun = false } = {}): Promise<ImportResult> {
  const prepared = rows.map(prepare)
  const dup = prepared.find((p, i) => prepared.findIndex((q) => q.id === p.id) !== i)
  if (dup) throw new Error(`Sheet row ${dup.id}: id appears more than once`)

  // A dry run does every write for real (so validation is real) and then rolls the transaction back.
  return inTransaction(payload, !dryRun, async (req) => {
    const result: ImportResult = { created: 0, updated: 0, unchanged: 0, usersCreated: 0 }
    const owners = new Map<string, { id: number }>()

    async function systemUser(displayName: string) {
      const email = `${slugify(displayName)}@${SYSTEM_EMAIL_DOMAIN}`
      let user = owners.get(email)
      if (!user) {
        const { docs } = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1, depth: 0, req })
        // Sign-up is public, so anyone could have pre-registered this address; only an importer-made (admin-only flag) account may own imported rows.
        if (docs[0] && !docs[0].system_account) {
          throw new Error(`User ${email} already exists but is not an importer account (system_account is not set); refusing to reuse it`)
        }
        user =
          docs[0] ??
          (await payload.create({
            collection: 'users',
            // Random, never shown: system accounts cannot log in.
            data: { email, password: randomUUID(), display_name: displayName, role: 'publisher', system_account: true },
            depth: 0,
            overrideAccess: true,
            req,
          }))
        if (!docs[0]) result.usersCreated++
        owners.set(email, user)
      }
      return user
    }

    async function freeSlug(base: string) {
      let slug = base
      for (let n = 1; (await payload.count({ collection: 'resources', where: { slug: { equals: slug } }, req })).totalDocs > 0; n++) {
        slug = `${base}-${n}`
      }
      return slug
    }

    const { docs } = await payload.find({
      collection: 'resources',
      where: { sheet_id: { in: prepared.map((p) => p.id) } },
      pagination: false,
      depth: 0,
      req,
    })
    const existing = new Map(docs.map((d) => [d.sheet_id, d as unknown as Record<string, unknown> & { id: number }]))

    for (const { id, fields, source, slugBase } of prepared) {
      try {
        const current = existing.get(id)
        if (current) {
          // Only the fields the sheet changed are written; slug, owner and status stay as they are (admins may have moderated them).
          const changed = Object.fromEntries(
            Object.entries(fields).filter(([k, v]) => JSON.stringify(current[k] ?? null) !== JSON.stringify(v ?? null)),
          )
          if (Object.keys(changed).length === 0) result.unchanged++
          else {
            await payload.update({ collection: 'resources', id: current.id, data: changed, depth: 0, overrideAccess: true, req })
            result.updated++
          }
          continue
        }
        const owner = await systemUser(source)
        await payload.create({
          collection: 'resources',
          data: { status: 'published', ...fields, slug: await freeSlug(slugBase), owner: owner.id },
          // `user` makes the collection's beforeChange hook stamp the owner; keepSlug stops the slug hook overwriting ours.
          user: { ...owner, collection: 'users' } as never,
          context: { keepSlug: true },
          depth: 0,
          overrideAccess: true,
          req,
        })
        result.created++
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        throw message.startsWith(`Sheet row ${id}`) ? error : new Error(`Sheet row ${id}: ${message}`)
      }
    }
    return result
  })
}

// Imported rows that users have already commented on, requested access to, reported or issued an API key for are archived, not deleted.
export async function rollbackImport(payload: Payload): Promise<{ deleted: number; archived: { id: number; sheet_id: string }[] }> {
  return inTransaction(payload, true, async (req) => {
    const { docs } = await payload.find({
      collection: 'resources',
      where: { sheet_id: { exists: true } },
      pagination: false,
      depth: 0,
      req,
    })
    let deleted = 0
    const archived: { id: number; sheet_id: string }[] = []
    for (const doc of docs) {
      const where = { resource: { equals: doc.id } }
      const counts = await Promise.all([
        payload.count({ collection: 'comments', where, req }),
        payload.count({ collection: 'access-requests', where, req }),
        payload.count({ collection: 'reports', where, req }),
        payload.count({ collection: 'api-keys', where, req }),
      ])
      if (counts.some((c) => c.totalDocs > 0)) {
        // sheet_id is cleared so a later re-import creates fresh published rows instead of matching this archived one.
        await payload.update({ collection: 'resources', id: doc.id, data: { status: 'archived', sheet_id: null }, depth: 0, overrideAccess: true, req })
        archived.push({ id: doc.id, sheet_id: doc.sheet_id as string })
      } else {
        await payload.delete({ collection: 'resources', id: doc.id, depth: 0, req })
        deleted++
      }
    }
    return { deleted, archived }
  })
}
