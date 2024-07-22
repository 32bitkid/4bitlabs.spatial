/**
 * All the available TypedArray types, see {@link !TypedArray | MDN documentation} for more details.
 */
export type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array;

/**
 * A constructor of a {@link !TypedArray} class.
 */
export interface TypedArrayConstructor<T extends TypedArray> {
  new (length: number | ArrayLike<number> | ArrayBufferLike): T;
}
