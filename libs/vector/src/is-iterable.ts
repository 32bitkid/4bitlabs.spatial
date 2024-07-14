export function isIterable<T>(it: unknown): it is Iterable<T> {
  if (typeof it !== 'object') return false;
  if (it === null) return false;
  if (!(Symbol.iterator in it)) return false;
  return typeof it[Symbol.iterator] === 'function';
}
