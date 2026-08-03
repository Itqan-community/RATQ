// Mirrors payload-backend/src/collections/Resources.ts's slugify - Unicode-aware
// so Arabic (and any other script) names produce a real slug instead of
// collapsing to '' under an ASCII-only \w filter (issue #170).
export class Slug {
  private constructor(public readonly value: string) {}

  static fromName(name: string): Slug {
    const value = name
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-+|-+$/g, '');
    return new Slug(value);
  }

  toString(): string {
    return this.value;
  }
}
