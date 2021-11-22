export type SortPair<T> = {
  left: T;
  right: T;
}

type Comparator<T> = (left: T, right: T) => Promise<number>

async function merge <T> (left: T[], right: T[], comparator: Comparator<T>): Promise<T[]> {
  const arr = []
  // Break out of loop if any one of the array gets empty
  while (left.length && right.length) {
    // Pick the larger among the largest element of left and right sub arrays
    if (await comparator(left[0], right[0]) < 0) {
      arr.push(left.shift())
    } else {
      arr.push(right.shift())
    }
  }

  // Concatenating the leftover elements
  // (in case we didn't go through the entire left or right array)
  return [...arr, ...left, ...right] as T[]
}

export async function mergeSort <T> (array: T[], comparator: Comparator<T>): Promise<T[]> {
  const half = array.length / 2

  // Base case or terminating case
  if (array.length < 2) {
    return array
  }

  const left = array.splice(0, half)
  const e = await Promise.all([mergeSort(left, comparator), mergeSort(array, comparator)])
  return await merge(e[0], e[1], comparator)
}
