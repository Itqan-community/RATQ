// First sentence of a description, at most `max` characters, never cut mid-word (an ellipsis marks a cut).
// A terminator only ends a sentence outside parentheses, before whitespace plus an uppercase or Arabic letter (or the
// end), and not after a common abbreviation: versions like "v1.5" and "Dr. X" stay whole.
const ABBREVIATIONS = new Set(['dr', 'mr', 'mrs', 'ms', 'st', 'prof', 'ed', 'e.g', 'i.e', 'vs', 'etc', 'أ.د'])

// A single letter is an initial ("Sofian S.", Arabic "د.").
const isAbbreviation = (token: string) => ABBREVIATIONS.has(token) || /^\p{L}$/u.test(token)

function sentenceEnd(flat: string): number {
  let depth = 0
  for (let i = 0; i < flat.length; i++) {
    const ch = flat[i]
    if (ch === '(') depth++
    else if (ch === ')') depth = Math.max(0, depth - 1)
    else if (depth === 0 && /[.!?؟]/.test(ch) && /^(\s*$|\s[\p{Lu}؀-ۿ])/u.test(flat.slice(i + 1, i + 3))) {
      if (ch === '.' && isAbbreviation(/[\p{L}.]*$/u.exec(flat.slice(0, i))![0].toLowerCase())) continue
      return i
    }
  }
  return -1
}

export function shortDescription(text: string, max = 160): string {
  const flat = text.replace(/\s+/g, ' ').trim()
  const end = sentenceEnd(flat)
  const sentence = end === -1 ? flat : flat.slice(0, end + 1)
  if (sentence.length <= max) return sentence
  const room = sentence.slice(0, max - 1)
  const space = room.lastIndexOf(' ')
  // ponytail: a single word longer than max is hard-cut; nothing in the sheet needs better.
  let body = (space > 0 ? room.slice(0, space) : room).trimEnd()
  // A cut must not leave an open parenthesis: drop back to before it.
  while ((body.match(/\(/g) ?? []).length > (body.match(/\)/g) ?? []).length) body = body.slice(0, body.lastIndexOf('(')).trimEnd()
  return `${body}…`
}
