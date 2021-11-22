declare module 'quickselect' {
  export default function quickselect<T>(arr: Iterable<T>, k: number, left?: number, right?: number, compare?: (a: T, b: T) => number): void
}
