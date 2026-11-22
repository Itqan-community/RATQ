import { parseArgs } from 'node:util'

export function parseCliArgs(args: string[]) {
  const { values } = parseArgs({
    args,
    options: { file: { type: 'string' }, 'dry-run': { type: 'boolean' }, rollback: { type: 'boolean' } },
  })
  // A rollback has no preview mode: silently running it for real would delete data.
  if (values.rollback && values['dry-run']) throw new Error('--rollback cannot be combined with --dry-run (rollback has no dry run)')
  return values
}
