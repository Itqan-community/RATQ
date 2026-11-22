import { readFileSync } from 'node:fs'
import type { Payload } from 'payload'
import { describe, expect, it } from 'vitest'
import { importSheet, rollbackImport } from './importSheet'
import { parseSheet, type SheetRow } from './parse'

type Doc = Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
type Tables = Record<string, Doc[]>

// In-memory stand-in for the Payload local API. Strict on purpose: every call must carry the open
// transaction id, and rollbackTransaction restores the snapshot taken at begin, so "zero writes"
// is observable as "tables unchanged".
function makeFake(seed: Tables = {}, failCreate?: (collection: string, data: Doc) => boolean) {
  let tables: Tables = { users: [], resources: [], comments: [], 'access-requests': [], reports: [], 'api-keys': [], ...structuredClone(seed) }
  let snapshot: Tables | null = null
  let activeTx: string | null = null
  let nextId = 1000
  const calls: { op: string; collection: string; id?: unknown; data?: Doc; user?: Doc; overrideAccess?: boolean }[] = []
  const log: string[] = []

  const match = (doc: Doc, where: Record<string, Doc> = {}) =>
    Object.entries(where).every(([key, cond]) => {
      if ('equals' in cond) return doc[key] === cond.equals
      if ('in' in cond) return cond.in.includes(doc[key])
      if ('exists' in cond) return (doc[key] != null) === cond.exists
      throw new Error(`fake: unsupported where ${JSON.stringify(cond)}`)
    })
  const inTx = (op: string, args: Doc) => {
    if (activeTx === null || args.req?.transactionID !== activeTx) throw new Error(`${op} ${args.collection} outside the transaction`)
  }

  const payload = {
    db: {
      beginTransaction: async () => {
        activeTx = 'tx1'
        snapshot = structuredClone(tables)
        log.push('begin')
        return activeTx
      },
      commitTransaction: async () => {
        activeTx = null
        snapshot = null
        log.push('commit')
      },
      rollbackTransaction: async () => {
        tables = snapshot!
        activeTx = null
        snapshot = null
        log.push('rollback')
      },
    },
    find: async (args: Doc) => {
      inTx('find', args)
      return { docs: tables[args.collection].filter((d) => match(d, args.where)).map((d) => ({ ...d })) }
    },
    count: async (args: Doc) => {
      inTx('count', args)
      return { totalDocs: tables[args.collection].filter((d) => match(d, args.where)).length }
    },
    create: async (args: Doc) => {
      inTx('create', args)
      calls.push({ op: 'create', collection: args.collection, data: args.data, user: args.user, overrideAccess: args.overrideAccess })
      if (failCreate?.(args.collection, args.data)) throw new Error('validation failed')
      const doc = { id: nextId++, ...structuredClone(args.data) }
      tables[args.collection].push(doc)
      return { ...doc }
    },
    update: async (args: Doc) => {
      inTx('update', args)
      calls.push({ op: 'update', collection: args.collection, id: args.id, data: args.data, overrideAccess: args.overrideAccess })
      const doc = tables[args.collection].find((d) => d.id === args.id)!
      Object.assign(doc, structuredClone(args.data))
      return { ...doc }
    },
    delete: async (args: Doc) => {
      inTx('delete', args)
      calls.push({ op: 'delete', collection: args.collection, id: args.id })
      tables[args.collection] = tables[args.collection].filter((d) => d.id !== args.id)
      return {}
    },
  }

  return {
    payload: payload as unknown as Payload,
    calls,
    log,
    get tables() {
      return tables
    },
    resource: (sheetId: string) => tables.resources.find((r) => r.sheet_id === sheetId)!,
  }
}

const row = (o: SheetRow = {}): SheetRow => ({
  id: 'r1',
  source_ar: 'مصدر',
  source_en: 'Source One',
  name_ar: 'اسم',
  name_en: 'Name One',
  description_ar: 'وصف أول. وصف ثان.',
  description_en: 'First. Second.',
  main_url: 'https://example.org',
  content_domain_en: 'Tafsir',
  resource_type_en: 'API (REST)',
  has_api_en: 'Yes',
  status_en: 'Active',
  license_ar: 'مفتوح',
  license_en: 'Open',
  ...o,
})
const three = () => [row({ id: 'r1', name_en: 'A' }), row({ id: 'r2', name_en: 'B' }), row({ id: 'r3', name_en: 'C', source_en: 'Source Two' })]

describe('importSheet', () => {
  it('creates a published resource owned by a per-source system user', async () => {
    const fake = makeFake()
    const result = await importSheet(fake.payload, [row()])

    expect(result).toMatchObject({ created: 1, updated: 0, unchanged: 0, usersCreated: 1 })
    const user = fake.tables.users[0]
    expect(user).toMatchObject({ email: 'source-one@sources.quran.tech.invalid', display_name: 'Source One', role: 'publisher' })
    expect(typeof user.password).toBe('string')
    expect(fake.resource('r1')).toMatchObject({
      name: 'اسم',
      name_en: 'Name One',
      description: 'وصف أول. وصف ثان.',
      description_en: 'First. Second.',
      short_description: 'وصف أول.',
      short_description_en: 'First.',
      slug: 'name-one',
      status: 'published',
      type: 'tafsir',
      has_api: 'yes',
      owner: user.id,
      license: 'مفتوح',
      license_en: 'Open',
      website_url: 'https://example.org',
      source_type: 'API (REST)',
      source_status: 'Active',
    })
    expect(fake.calls.find((c) => c.collection === 'resources')!.user!.id).toBe(user.id)
    expect(fake.log).toEqual(['begin', 'commit'])
  })

  it('cleans placeholders, empties non-http URLs, splits arrays and falls back so required fields are never empty', async () => {
    const fake = makeFake()
    await importSheet(fake.payload, [
      row({
        name_ar: '',
        description_ar: '',
        license_ar: 'Not stated',
        license_en: 'Not stated',
        rate_limits_en: 'Not available',
        base_url_en: 'Not available',
        docs_url_en: 'https://d.org/x (usage guide on the page)',
        repository_en: 'ftp://x.org',
        playground_url_en: 'javascript:alert(1)',
        languages_en: 'Arabic, English',
        has_api_en: 'No (planned: Coming soon)',
      }),
    ])
    expect(fake.resource('r1')).toMatchObject({
      name: 'Name One',
      description: 'First. Second.',
      short_description: 'First.',
      license: null,
      license_en: null,
      rate_limits_en: null,
      base_url: null,
      documentation_url: 'https://d.org/x',
      repository: null,
      playground_url: null,
      languages: ['Arabic', 'English'],
      has_api: 'planned',
    })
  })

  it('is idempotent: a second run creates and changes nothing', async () => {
    const fake = makeFake()
    await importSheet(fake.payload, three())
    const before = structuredClone(fake.tables)
    const result = await importSheet(fake.payload, three())

    expect(result).toMatchObject({ created: 0, updated: 0, unchanged: 3, usersCreated: 0 })
    expect(fake.tables).toEqual(before)
  })

  it('updates only the edited row, sending only the changed fields', async () => {
    const fake = makeFake()
    await importSheet(fake.payload, three())
    const before = structuredClone(fake.tables.resources)
    const rows = three()
    rows[1].description_en = 'Changed. Tail.'

    const result = await importSheet(fake.payload, rows)

    expect(result).toMatchObject({ created: 0, updated: 1, unchanged: 2 })
    expect(fake.resource('r2').description_en).toBe('Changed. Tail.')
    expect(fake.resource('r1')).toEqual(before.find((r) => r.sheet_id === 'r1'))
    expect(fake.resource('r3')).toEqual(before.find((r) => r.sheet_id === 'r3'))
    const updates = fake.calls.filter((c) => c.op === 'update')
    expect(updates).toHaveLength(1)
    expect(Object.keys(updates[0].data!).sort()).toEqual(['description_en', 'short_description_en'])
  })

  it('aborts with zero writes when a row is invalid and names the sheet id', async () => {
    const fake = makeFake({}, (_c, data) => data.sheet_id === 'r2')
    const before = structuredClone(fake.tables)

    await expect(importSheet(fake.payload, three())).rejects.toThrow(/r2/)

    expect(fake.tables).toEqual(before)
    expect(fake.log).toEqual(['begin', 'rollback'])
  })

  it('rejects an unmapped type before writing anything, naming the sheet id', async () => {
    const fake = makeFake()
    await expect(importSheet(fake.payload, [row(), row({ id: 'r9', content_domain_en: 'Nope' })])).rejects.toThrow(/r9/)
    expect(fake.tables.resources).toHaveLength(0)
    expect(fake.tables.users).toHaveLength(0)
  })

  it('rejects a duplicate sheet id', async () => {
    const fake = makeFake()
    await expect(importSheet(fake.payload, [row(), row()])).rejects.toThrow(/r1/)
    expect(fake.tables.resources).toHaveLength(0)
  })

  it('dry run reports the counts but writes nothing', async () => {
    const fake = makeFake()
    const result = await importSheet(fake.payload, three(), { dryRun: true })

    expect(result).toMatchObject({ created: 3, usersCreated: 2 })
    expect(fake.tables.resources).toHaveLength(0)
    expect(fake.tables.users).toHaveLength(0)
    expect(fake.log).toEqual(['begin', 'rollback'])
  })

  it('suffixes colliding slugs without touching existing resources', async () => {
    const existing = { id: 1, slug: 'name-one', name: 'old', sheet_id: null }
    const fake = makeFake({ resources: [existing] })

    await importSheet(fake.payload, [row({ id: 'r1' }), row({ id: 'r2' })])

    expect(fake.resource('r1').slug).toBe('name-one-1')
    expect(fake.resource('r2').slug).toBe('name-one-2')
    expect(fake.tables.resources.find((r) => r.id === 1)).toEqual(existing)
  })

  it('does not re-slug an existing row on update', async () => {
    const fake = makeFake()
    await importSheet(fake.payload, [row()])
    const rows = [row({ name_en: 'Renamed' })]
    await importSheet(fake.payload, rows)
    expect(fake.resource('r1')).toMatchObject({ name_en: 'Renamed', slug: 'name-one' })
  })

  it('finds or creates exactly one system user per source', async () => {
    const reuse = { id: 7, email: 'source-one@sources.quran.tech.invalid', display_name: 'Source One', system_account: true }
    const fake = makeFake({ users: [reuse] })

    const result = await importSheet(fake.payload, three())

    expect(result.usersCreated).toBe(1)
    expect(fake.tables.users.map((u) => u.email).sort()).toEqual([
      'source-one@sources.quran.tech.invalid',
      'source-two@sources.quran.tech.invalid',
    ])
    expect(fake.resource('r1').owner).toBe(7)
  })

  it('creates system users flagged system_account, with access overridden', async () => {
    const fake = makeFake()
    await importSheet(fake.payload, [row()])
    expect(fake.tables.users[0].system_account).toBe(true)
    for (const c of fake.calls.filter((c) => c.collection === 'users' || c.collection === 'resources')) expect(c.overrideAccess).toBe(true)
  })

  it('importSheet_PreRegisteredEmailWithoutFlag_AbortsWithoutReusingIt', async () => {
    const squatter = { id: 7, email: 'source-one@sources.quran.tech.invalid', display_name: 'Source One', role: 'publisher' }
    const fake = makeFake({ users: [squatter] })
    const before = structuredClone(fake.tables)

    await expect(importSheet(fake.payload, [row()])).rejects.toThrow(/system_account/)

    expect(fake.tables).toEqual(before)
    expect(fake.log).toEqual(['begin', 'rollback'])
  })

  it('maps has_api by exact token: placeholders and "Not planned" stay empty', async () => {
    const values: [string, string | null][] = [
      ['Yes', 'yes'],
      ['No', 'no'],
      ['No (planned: Coming soon)', 'planned'],
      ['No (iframe embedding only)', 'iframe'],
      ['Not planned', null],
      ['Not available', null],
      ['Not stated', null],
      ['', null],
    ]
    const fake = makeFake()
    await importSheet(fake.payload, values.map(([v], i) => row({ id: `h${i}`, name_en: `H${i}`, has_api_en: v })))
    expect(values.map(([, want], i) => [fake.resource(`h${i}`).has_api ?? null, want])).toEqual(values.map(([, want]) => [want, want]))
  })

  it('imports every fixture row once, under 6 publishers, and a rerun changes nothing', async () => {
    const rows = parseSheet(readFileSync(new URL('./__fixtures__/sheet.csv', import.meta.url), 'utf8'))
    const fake = makeFake()

    const first = await importSheet(fake.payload, rows)
    const second = await importSheet(fake.payload, rows)

    expect(first).toMatchObject({ created: 246, usersCreated: 6 })
    expect(second).toMatchObject({ created: 0, updated: 0, unchanged: 246, usersCreated: 0 })
    expect(new Set(fake.tables.resources.map((r) => r.slug)).size).toBe(246)
    const apis: Record<string, number> = {}
    for (const r of fake.tables.resources) apis[r.has_api] = (apis[r.has_api] ?? 0) + 1
    expect(apis).toEqual({ yes: 202, no: 22, planned: 21, iframe: 1 })
  })
})

describe('rollbackImport', () => {
  const setup = async () => {
    const existing = { id: 1, slug: 'mine', name: 'mine', sheet_id: null }
    const fake = makeFake({ resources: [existing] })
    await importSheet(fake.payload, [...three(), row({ id: 'r4', name_en: 'D' })])
    fake.log.length = 0
    return { fake, existing }
  }

  it('deletes exactly the imported rows and leaves other resources alone', async () => {
    const { fake, existing } = await setup()

    const result = await rollbackImport(fake.payload)

    expect(result).toEqual({ deleted: 4, archived: [] })
    expect(fake.tables.resources).toEqual([existing])
    expect(fake.log).toEqual(['begin', 'commit'])
  })

  it('archives instead of deleting rows that comments, access requests or reports point at', async () => {
    const { fake } = await setup()
    fake.tables.comments.push({ id: 1, resource: fake.resource('r1').id })
    fake.tables['access-requests'].push({ id: 1, resource: fake.resource('r2').id })
    fake.tables.reports.push({ id: 1, resource: fake.resource('r3').id })

    const result = await rollbackImport(fake.payload)

    expect(result).toEqual({
      deleted: 1,
      archived: [
        { id: expect.any(Number), sheet_id: 'r1' },
        { id: expect.any(Number), sheet_id: 'r2' },
        { id: expect.any(Number), sheet_id: 'r3' },
      ],
    })
    expect(fake.tables.resources.filter((r) => r.status === 'archived').map((r) => r.sheet_id)).toEqual([null, null, null])
  })

  it('archives rows that an API key points at', async () => {
    const { fake } = await setup()
    fake.tables['api-keys'].push({ id: 1, resource: fake.resource('r4').id })

    const result = await rollbackImport(fake.payload)

    expect(result).toMatchObject({ deleted: 3, archived: [{ sheet_id: 'r4' }] })
  })

  it('clears sheet_id on archived rows so a re-import creates fresh published rows', async () => {
    const { fake } = await setup()
    const id = fake.resource('r1').id
    fake.tables.comments.push({ id: 1, resource: id })

    const { archived } = await rollbackImport(fake.payload)
    expect(archived).toEqual([{ id, sheet_id: 'r1' }])
    expect(fake.tables.resources.find((r) => r.id === id)).toMatchObject({ status: 'archived', sheet_id: null })

    const again = await importSheet(fake.payload, [row({ id: 'r1', name_en: 'A' })])
    expect(again).toMatchObject({ created: 1, updated: 0 })
    expect(fake.resource('r1')).toMatchObject({ status: 'published' })
    expect(fake.resource('r1').id).not.toBe(id)
  })
})
