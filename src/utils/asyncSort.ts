export type SortPair<T> = {
  left: T;
  right: T;
}

type Comparator<T> = (left: T, right: T) => Promise<number>

async function merge <T> (left: T[], right: T[], comparator: Comparator<T>): Promise<T[]> {
  const arr = []
  while (left.length && right.length) {
    if (await comparator(left[0], right[0]) < 0) {
      arr.push(left.shift())
    } else {
      arr.push(right.shift())
    }
  }
  return [...arr, ...left, ...right] as T[]
}

export async function mergeSort <T> (array: T[], comparator: Comparator<T>): Promise<T[]> {
  return mergeSortDestructive(array.slice(), comparator)
}

async function mergeSortDestructive <T> (array: T[], comparator: Comparator<T>): Promise<T[]> {
  const half = array.length / 2

  // Base case or terminating case
  if (array.length < 2) {
    return array
  }

  const left = array.splice(0, half)
  const e = await Promise.all([mergeSort(left, comparator), mergeSort(array, comparator)])
  return await merge(e[0], e[1], comparator)
}
