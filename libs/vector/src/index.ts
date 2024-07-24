/**
 * A TypedArray-backed resizable vector data-structure.
 *
 * Comes in two flavors: {@link Vector} and {@link BigVector}. Use {@link Vector} for {@link !Number} arrays, and
 * use {@link BigVector} for {@link !BigInt} arrays.
 *
 * @module
 */
export type {
  TypedArray,
  TypedArrayConstructor,
} from './typed-array';
export type { VectorOptions, VectorFromOptions } from './vector-options';
export { Vector } from './vector';
