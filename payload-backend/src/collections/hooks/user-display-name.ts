import type { FieldHook } from 'payload'

type NameSource = { display_name?: string | null; email?: string | null }

// display_name, else the email local part - never the full address. Same
// fallback Comments.author_name stores, so every place that shows another
// person's name agrees on what is safe to display.
export function publicDisplayName(user: NameSource): string | null {
  if (user.display_name) return user.display_name
  if (user.email) return user.email.split('@')[0]
  return null
}

// Users.read is self-or-admin, so a publisher reading access requests (or an
// owner reading reports) on their resource gets the applicant/reporter back as
// a bare id. This resolves a safe display name for them instead, with
// overrideAccess because only the name leaves this hook, not the user doc.
// Virtual field: nothing is stored, so no migration and existing rows work.
export const userNameAfterRead =
  (source: 'applicant' | 'reporter'): FieldHook =>
  async ({ data, req }) => {
    const value = data?.[source] as number | string | (NameSource & { id: number | string }) | undefined
    if (value == null) return null
    if (typeof value === 'object') return publicDisplayName(value)

    // Payload runs afterRead for every doc of a find() concurrently, so the
    // cache holds the in-flight promise: caching the finished name would let
    // all of a page's docs miss before any lookup returns.
    const cache = ((req.context as Record<string, unknown>).userDisplayNames ??=
      new Map<number | string, Promise<string | null>>()) as Map<
      number | string,
      Promise<string | null>
    >
    let pending = cache.get(value)
    if (!pending) {
      pending = req.payload
        .findByID({ collection: 'users', id: value, depth: 0, overrideAccess: true, req })
        .then((user) => publicDisplayName(user))
        // Deleted account: show nothing rather than failing the whole read.
        .catch(() => null)
      cache.set(value, pending)
    }
    return pending
  }
