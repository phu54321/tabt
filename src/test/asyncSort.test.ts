import { expect, test } from 'vitest';
import { mergeSort } from '../utils/asyncSort';
import { shuffle } from '../utils/shuffle';

test('Proper async merge sorting', async () => {
  const expected = new Array(100).fill(0).map((_, i) => i)
  const shuffled = shuffle(expected.slice())
  const sortedArray = await mergeSort(shuffled, function (lhs: number, rhs: number): Promise<number> {
    return new Promise(resolve => {
      setTimeout(() => resolve(lhs - rhs), Math.random() * 1)
    })
  })
  expect(sortedArray).toEqual(expected)
});
