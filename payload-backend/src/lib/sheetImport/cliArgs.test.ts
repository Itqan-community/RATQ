import { describe, expect, it } from 'vitest'
import { parseCliArgs } from './cliArgs'

describe('parseCliArgs', () => {
  it('parseCliArgs_RollbackWithDryRun_Throws', () => {
    expect(() => parseCliArgs(['--rollback', '--dry-run'])).toThrow(/--rollback.*--dry-run/)
  })

  it('parseCliArgs_RollbackAlone_Parses', () => {
    expect(parseCliArgs(['--rollback']).rollback).toBe(true)
  })

  it('parseCliArgs_FileWithDryRun_Parses', () => {
    expect(parseCliArgs(['--file', 'a.csv', '--dry-run'])).toMatchObject({ file: 'a.csv', 'dry-run': true })
  })
})
