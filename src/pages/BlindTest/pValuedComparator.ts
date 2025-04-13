const maxComparison = 15
const maxPValue = 0.05

/// --------------------

// P value calculator

const table = [
  [1],
  [1, 1],
  [1, 2, 1],
  [1, 3, 3, 1],
  [1, 4, 6, 4, 1],
  [1, 5, 10, 10, 5, 1],
  [1, 6, 15, 20, 15, 6, 1],
  [1, 7, 21, 35, 35, 21, 7, 1],
  [1, 8, 28, 56, 70, 56, 28, 8, 1],
  [1, 9, 36, 84, 126, 126, 84, 36, 9, 1],
  [1, 10, 45, 120, 210, 252, 210, 120, 45, 10, 1],
  [1, 11, 55, 165, 330, 462, 462, 330, 165, 55, 11, 1],
  [1, 12, 66, 220, 495, 792, 924, 792, 495, 220, 66, 12, 1],
  [1, 13, 78, 286, 715, 1287, 1716, 1716, 1287, 715, 286, 78, 13, 1],
  [1, 14, 91, 364, 1001, 2002, 3003, 3432, 3003, 2002, 1001, 364, 91, 14, 1],
  [1, 15, 105, 455, 1365, 3003, 5005, 6435, 6435, 5005, 3003, 1365, 455, 105, 15, 1]
]

export function binomialPValue (n: number, k: number): number {
  if (n > maxComparison) throw Error('Too high N')
  if (k >= n / 2) k = n - k

  let partialSum = 0
  for (let i = 0; i <= k; i++) partialSum += table[n][i]
  return partialSum * 2.0 / Math.pow(2, n)
}

/// -----------------------

export interface PValuedComparatorResult<T> {
  lhs: T
  rhs: T
  leftLower: number,
  rightLower: number,
  signedPValue: number
  comparisonCount: number
}

export async function pValuedComparator<T> (left: T, right: T, comparatorSingle: (left: T, right: T) => Promise<number>): Promise<PValuedComparatorResult<T>> {
  let leftLower = 0
  let rightLower = 0
  for (let n = 1; n <= maxComparison; n++) {
    if (await comparatorSingle(left, right) < 0) leftLower++
    else rightLower++

    const pValue = binomialPValue(n, leftLower)
    if (pValue <= maxPValue) {
      return {
        lhs: left,
        rhs: right,
        leftLower,
        rightLower,
        signedPValue: (leftLower > rightLower) ? -pValue : pValue,
        comparisonCount: leftLower + rightLower
      }
    }
  }

  const pValue = binomialPValue(maxComparison, leftLower)
  return {
    lhs: left,
    rhs: right,
    leftLower,
    rightLower,
    signedPValue: (leftLower > rightLower) ? -pValue : pValue,
    comparisonCount: leftLower + rightLower
  }
}
