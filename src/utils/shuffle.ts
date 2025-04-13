/**
 * Shuffles array in-place
 * @param {Array} a items An array containing the items.
 */
export function shuffle <T> (a: T[]) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const x = a[i]
    a[i] = a[j]
    a[j] = x
  }
  return a
}
