import { describe, expect, it, vi } from 'vitest'
import { Resources } from './Resources'

type SlugHook = (args: {
  req: { payload: { count: unknown } }
  data: Record<string, unknown>
  operation: string
  context: Record<string, unknown>
}) => Promise<Record<string, unknown>>

const hook = Resources.hooks!.beforeValidate![0] as unknown as SlugHook

describe('Resources slug hook', () => {
  it('derives the slug from the name on create', async () => {
    const count = vi.fn().mockResolvedValue({ totalDocs: 0 })
    const out = await hook({ req: { payload: { count } }, data: { name: 'My Tool' }, operation: 'create', context: {} })
    expect(out.slug).toBe('my-tool')
  })

  it('keeps a caller-chosen slug when the importer flags it via context.keepSlug', async () => {
    const count = vi.fn()
    const out = await hook({
      req: { payload: { count } },
      data: { name: 'اسم', slug: 'chosen-slug' },
      operation: 'create',
      context: { keepSlug: true },
    })
    expect(out.slug).toBe('chosen-slug')
    expect(count).not.toHaveBeenCalled()
  })
})
