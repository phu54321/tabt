/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
export function shuffle <T> (a: T[]) {
  const ret = a.slice()
  for (let i = ret.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const x = ret[i]
    ret[i] = ret[j]
    ret[j] = x
  }
  return ret
}
