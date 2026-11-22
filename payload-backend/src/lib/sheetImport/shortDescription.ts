// First sentence of a description, at most `max` characters, never cut mid-word (an ellipsis marks a cut).
// A "." only ends a sentence before whitespace, so versions like "v1.5" stay whole.
export function shortDescription(text: string, max = 160): string {
  const flat = text.replace(/\s+/g, ' ').trim()
  const end = flat.search(/[.!?؟](\s|$)/)
  const sentence = end === -1 ? flat : flat.slice(0, end + 1)
  if (sentence.length <= max) return sentence
  const room = sentence.slice(0, max - 1)
  const space = room.lastIndexOf(' ')
  // ponytail: a single word longer than max is hard-cut; nothing in the sheet needs better.
  return `${(space > 0 ? room.slice(0, space) : room).trimEnd()}…`
}
