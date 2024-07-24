import { TypedArray, TypedArrayConstructor } from './typed-array';
import {
  DEFAULT_GROWTH_FN,
  VectorOptions,
  VectorFromOptions,
} from './vector-options';
import { isTypedArray } from './is-typed-array';
import { isIterable } from './is-iterable';

/**
 * The {@link Vector} is a resizable data-structure that is backed by a {@link TypedArray}. Unlike a
 * {@link TypedArray}&mdash;which are constructed with a _fixed_ size&mdash;and JavaScript's built-in {@link !Array}
 * type&mdash;which are dynamically sized but are not as memory-efficient&mdash;the {@link Vector} strikes a balance
 * between those two. However, this added functionality doesn't come without cost; depending on the use-case, the
 * {@link Vector} _can_ be outperformed by either a {@link TypedArray} or traditional a JavaScript {@link !Array}.
 * However, there are cases where using a {@link Vector} is preferable.
 *
 * @example A 64-bit floating point vector.
 *
 * ```ts
 * const vec = new Vector(Float64Array);
 * ```
 *
 * Then, you can {@link push | `push()`} and {@link pop | `pop()`} entries from the {@link Vector}.
 *
 * ```ts
 * vec.push(1/5);
 * vec.push(2/5);
 * vec.push(3/5);
 *
 * let top = vec.pop();
 * console.log(top); // 0.6
 * ```
 *
 * @example Using other TypedArray types
 *
 * You can use any of the {@link TypedArray} types for the backing store of the {@link Vector}:
 *
 * ```ts
 * const octetVector = new Vector(Uint8Array, 128);
 * const clamedOctetVector = new Vector(Uint8ClampedArray, 128);
 * const shortVector = new Vector(Int16Array, 128);
 * const ushortVector = new Vector(Uint16Array, 128);
 * const longVector = new Vector(Int32Array, 128);
 * const ulongVector = new Vector(Uint32Array, 128);
 * const float32Vector = new Vector(Float32Array, 128);
 * ```
 */
export class Vector<T extends TypedArray> {
  private readonly Type: TypedArrayConstructor<T>;
  private readonly growthFn: (current: number) => number;

  private _array: T;
  private _capacity: number;
  private _length: number;

  /**
   * Current the current length of the backing {@link TypedArray}. This is the maximum number of elements this
   * {@link Vector} can hold before it will be resized.
   */
  get capacity(): number {
    return this._capacity;
  }

  /**
   * Get the current length of the {@link Vector}, will always been _less-than-or-equal_ to {@link Vector.capacity}.
   */
  get length(): number {
    return this._length;
  }

  /**
   * Create an empty {@link Vector} with a given capacity, the default is `0`.
   *
   * @param Type The constructor of the underlying backing {@link TypedArray} type.
   * @param initialCapacity The initial capacity of the {@link Vector}. Defaults to `0`.
   */
  constructor(Type: TypedArrayConstructor<T>, initialCapacity?: number);
  /**
   * You can also customize more options, by using {@link VectorOptions} in the second argument.
   *
   * @param Type The constructor of the underlying backing {@link TypedArray} type.
   * @param options Initial options
   *
   * @example
   * For instance, create a {@link Vector} that has an initial size of `10`, and a capacity of `100`:
   * ```ts
   * const vec = new Vector(
   *   Float32Array,
   *   {
   *     initialLength: 10,
   *     initialCapacity: 100,
   *   },
   * );
   * ```
   *
   * @example Defining the growth behavior, allocating in chunks of 100 elements at a time.
   * ```ts
   * const vec = new Vector(
   *   Uint32Array,
   *   { growthFn: (prev) => prev + 100 },
   * );
   * ```
   */
  constructor(Type: TypedArrayConstructor<T>, options: VectorOptions);
  constructor(
    Type: TypedArrayConstructor<T>,
    options: VectorOptions | number = 0,
  ) {
    const {
      initialCapacity = 0,
      initialLength = 0,
      growthFn = DEFAULT_GROWTH_FN,
    } = typeof options === 'number' ? { initialCapacity: options } : options;
    this.Type = Type;
    this.growthFn = growthFn;
    this._length = Math.ceil(initialLength);
    this._capacity = Math.ceil(Math.max(initialCapacity, this._length));
    this._array = new Type(this._capacity);
  }

  /**
   * Create a {@link Vector} from an existing {@link !Array} or {@link !Iterable}
   *
   * @param source The source {@link !Array} or {@link !Iterable} of {@link !Number}s
   * @param ArrayType The constructor of the underlying backing {@link TypedArray} type.
   * @param initialCapacity The initial capacity of the constructed {@link Vector}
   */
  static from<T extends TypedArray>(
    source: ArrayLike<number> | Iterable<number>,
    ArrayType: TypedArrayConstructor<T>,
    initialCapacity?: number,
  ): Vector<T>;
  /**
   * Create a {@link Vector} from an existing {@link !Array} or {@link !Iterable}
   *
   * @param source The source {@link !Array} or {@link !Iterable} of {@link !Number}s
   * @param ArrayType he constructor of the underlying backing {@link TypedArray} type.
   * @param options he options of constructed {@link Vector}
   */
  static from<T extends TypedArray>(
    source: ArrayLike<number> | Iterable<number>,
    ArrayType: TypedArrayConstructor<T>,
    options: VectorFromOptions,
  ): Vector<T>;
  static from<T extends TypedArray>(
    source: ArrayLike<number> | Iterable<number>,
    ArrayType: TypedArrayConstructor<T>,
    _options: VectorFromOptions | number = {},
  ): Vector<T> {
    const options =
      typeof _options === 'number' ? { initialCapacity: _options } : _options;

    if (Array.isArray(source) || isTypedArray(source)) {
      const vec = new Vector<T>(ArrayType, {
        ...options,
        initialCapacity: options.initialCapacity ?? source.length,
      });
      vec.pushN(source);
      return vec;
    }

    if (isIterable(source)) {
      const vec = new Vector<T>(ArrayType, options);
      for (const val of source) vec.push(val);
      return vec;
    }

    throw new Error(`Vector.from() source is not a valid type`);
  }

  /**
   * Set the value at the given index.
   *
   * @param index The index of the element to set.
   * @param value The value of the element.
   * @throws {@link !Error} if the index is out of range.
   */
  set(index: number, value: number): void {
    if (index > this._length || index < 0)
      throw this.#error('mustSet', 'out of bounds');
    this._array[index] = value;
  }

  /**
   * Retrieves the element at the given index.
   *
   * @param index The index of the element to get.
   * @throws {@link !Error} if the index is out of range.
   */
  get(index: number): number {
    if (index > this._length || index < 0)
      throw this.#error('mustGet', 'out of bounds');
    return this._array[index];
  }

  /**
   * Set multiple values starting at begin.
   *
   * @param begin The index to start at.
   * @param values The values to set.
   */
  setN(begin: number, values: ArrayLike<number>): void {
    if (begin < 0 || begin + values.length > this._length)
      throw this.#error('setN', 'out of bounds');
    this._array.set(values, begin);
  }

  /**
   * @hidden
   */
  copy(index: number, countOrDest: number | T): T {
    const dest =
      typeof countOrDest === 'number'
        ? new this.Type(countOrDest)
        : countOrDest;
    dest.set(this.subarray(index, index + dest.length));
    return dest;
  }

  /**
   * @hidden Get a subarray of the underlying backing {@link TypedArray}.
   * This can be _dangerous_ when mutating the Vector, which may cause
   * the {@link Vector} to be resized, causing the subarray reference to
   * possibly be invalid.
   */
  subarray(start: number = 0, end: number = this._length): T {
    if (end > this._length) throw this.#error('subarray', 'out of bounds');
    return this._array.subarray(start, end) as T;
  }

  /**
   * Push a single element onto the end of the {@link Vector}, resizing if needed.
   *
   * @param value
   */
  push(value: number): number {
    if (this._capacity === this._length) this.grow();
    this._array[this._length++] = value;
    return this._length;
  }

  /**
   * Push multiple elements onto the end of the {@link Vector}, resizing _multiple-times_ if needed.
   *
   * @param values
   */
  pushN(values: ArrayLike<number>): void {
    while (this._length + values.length > this._capacity) this.grow();
    this._array.set(values, this._length);
    this._length += values.length;
  }

  /**
   * Remove and return a single element from the end of the {@link Vector}.
   *
   * @returns The removed value, unless the {@link Vector} is empty, then `undefined`.
   */
  pop(): number | undefined {
    if (this._length === 0) return undefined;
    return this._array[--this._length];
  }

  /**
   * Remove and return a multiple elements from the end of the {@link Vector}.
   *
   * @param count
   * @returns A {@link TypedArray} of the removed values.
   *
   * @example
   * const vec = Vector.from([1, 2, 3, 4, 5], Uint8Array);
   * const three = vec.popN(3);
   */
  popN(count: number): T;
  popN(count: number, dest: T): T;
  popN(count: number, dest: T = new this.Type(count)): T {
    if (this._length < count) throw this.#error('popN', 'out of bounds');
    dest.set(this._array.subarray(this._length - count, this._length));
    this._length -= count;
    return dest;
  }

  /**
   * Manually trigger the {@link Vector} to grow in size, using the growth behavior.
   */
  grow(): this {
    const capacity = Math.max(this.growthFn(this._capacity), 1);
    this.reallocate(capacity);
    return this;
  }

  /**
   * Reallocate the underlying {@link TypedArray}.
   *
   * If the capacity is _less-than_ the current length, then the extra values are discarded.
   *
   * @param capacity The desired capacity of the {@link Vector}. Defaults to the current length of the {@link Vector}.
   */
  reallocate(capacity: number = this._length): this {
    if (this._capacity === capacity) return this;
    const newLength = Math.min(this.length, capacity);
    const array = new this.Type(capacity);
    array.set(this._array.subarray(0, newLength), 0);
    this._capacity = capacity;
    this._length = newLength;
    this._array = array;
    return this;
  }

  /**
   * Clear all entries from the {@link Vector}
   */
  clear(): this {
    this._length = 0;
    return this;
  }

  /**
   * Iterate through the vector from the tail-end, consuming each entry. Essentially, the same as
   * running {@link Vector.pop} in a loop until {@link Vector.length} is zero.
   *
   * @example
   * ```ts
   * const vec = Vector.from([1, 2, 3], Uint8Array);
   * for (const value of vec.consume()) {
   *   console.log(value); // 3, 2, 1
   * }
   *
   * console.log(vec.length); // 0.
   * ```
   */
  *consume(): IterableIterator<number> {
    while (this._length > 0) {
      yield this._array[--this._length];
    }
  }

  #error = (method: string, message: string): Error =>
    new Error(`Vector[${this.Type.name}].${method}(): ${message}`);
}
