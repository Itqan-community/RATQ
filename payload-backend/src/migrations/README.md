# Migrations

Each migration is a `.ts` file (raw SQL in `up()`/`down()`) normally paired with a `.json` snapshot of the full target schema at that point, both written by `payload migrate:create`.

## How `migrate:create` actually picks its baseline

`migrate:create` does **not** walk the `id`/`prevId` fields inside the `.json` files to find the previous schema state. It reads whichever `.json` file sorts last alphabetically in this directory (filenames are timestamp-prefixed, so that's normally the most recent one) and diffs it against the live Payload config. `id`/`prevId` are write-only bookkeeping from drizzle-kit - Payload's wrapper never threads a previous id through, so every freshly generated snapshot gets `prevId: 00000000-0000-0000-0000-000000000000` regardless of history. Don't hand-edit `prevId` expecting it to matter; the next `migrate:create` run will zero it out again anyway.

## The one rule that matters

**If you hand-write a migration's SQL instead of generating it with `migrate:create`, hand-write its `.json` snapshot too**, reflecting the true schema after your change (see an existing `.json` for the shape - it's a full `drizzle-kit` schema dump, not a diff). Skipping this leaves the next `migrate:create` run diffing against a stale baseline that doesn't include your change, producing a wrong or bloated migration for whoever runs it next.

Always run `payload migrate:create` from a local DB that's fully caught up via `payload migrate` first - a behind-DB doesn't affect this baseline selection (it's file-based, not DB-based), but keeping the DB in sync avoids confusing yourself about what's actually applied.
