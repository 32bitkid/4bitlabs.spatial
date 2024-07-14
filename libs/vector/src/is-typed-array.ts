import { TypedArray } from './typed-array';

export function isTypedArray(it: unknown): it is TypedArray {
  if (typeof it !== 'object') return false;
  if (it === null) return false;
  return (
    it instanceof Int8Array ||
    it instanceof Uint8Array ||
    it instanceof Uint8ClampedArray ||
    it instanceof Int16Array ||
    it instanceof Uint16Array ||
    it instanceof Int32Array ||
    it instanceof Uint32Array ||
    it instanceof Float32Array ||
    it instanceof Float64Array
  );
}
