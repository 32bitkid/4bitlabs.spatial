import { TypedArray, TypedArrayConstructor } from './typed-array';
import { isTypedArray } from './is-typed-array';
import { isIterable } from './is-iterable';

const DEFAULT_GROWTH_FN = (current: number) => Math.ceil(current * 1.5);

/**
 * The advanced options that can be used to control the construction of a {@link Vector}
 */
export interface VectorOptions {
  /**
   * The initial capacity of the {@link Vector}.
   *
   * @defaultValue `0`, unless {@link VectorOptions.initialLength | initialLength} is greater.
   */
  initialCapacity?: number;
  /**
   * The initial length of the {@link Vector}. The initial values are initialized to `0`.
   *
   * @defaultValue `0`
   */
  initialLength?: number;
  /**
   * This method is called when the Vector needs to be resized to determine how much more memory should be allocated.
   * The default behavior is to grow by a rate of _1.5_.
   *
   * @defaultValue `(current: number) => Math.ceil(current * 1.5)`
   */
  growthFn?: (current: number) => number;
}

/**
 * The {@link Vector} is a resizable data-structure that is backed by a {@link !TypedArray}. Unlike a {@link !TypedArray}, which
 * are constructed with a _fixed_ size, and JavaScript's built-in {@link !Array} type, which are dynamically sized but are not
 * as memory-efficient, the {@link Vector} strikes a balance between those two. However, this added
 * functionality doesn't come without cost. The {@link Vector} can be outperformed by either a {@link !TypedArray} or
 * traditional a JavaScript {@link !Array}, depending on the use-case. However, there are cases where using a
 * {@link Vector} is preferable.
 *
 * @example
 * Create an empty Vector of 64-bit floating point numbers and add some numbers:
 *
 * ```ts
 * const vec = new Vector(Float64Array);
 * vec.push(1/3);
 * vec.push(2/3);
 * vec.push(1);
 * ```
 */
export class Vector<T extends TypedArray> {
  private readonly Type: TypedArrayConstructor<T>;
  private readonly growthFn: (current: number) => number;

  private _array: T;
  private _capacity: number;
  private _length: number;

  /**
   * Current the current length of the backing {@link !TypedArray}. This is the maximum number of elements this
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
   * @param Type The constructor of the underlying backing {@link !TypedArray} type.
   * @param initialCapacity The initial capacity of the vector. Defaults to `0`.
   *
   * @example
   * For instance, to create a `Vector` that holds bytes, with an initial capacity of `16`:
   * ```ts
   * const vec = new Vector(Uint8Array, 16);
   * ```
   */
  constructor(Type: TypedArrayConstructor<T>, initialCapacity?: number);
  /**
   * You can also customize more options, by using {@link VectorOptions} in the second argument.
   *
   * @param Type The constructor of the underlying backing {@link !TypedArray} type.
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
   * @example Changing the default growth behavior.
   *
   * ```ts
   * const vec = new Vector(
   *   Uint32Array,
   *   {
   *     initialCapacity: 500,
   *     growthFn: (current) => current + 100,
   *   },
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

  static from<T extends TypedArray>(
    source: ArrayLike<number> | Iterable<number>,
    ArrayType: TypedArrayConstructor<T>,
    initialCapacity?: number,
  ): Vector<T> {
    if (Array.isArray(source) || isTypedArray(source)) {
      const vec = new Vector<T>(ArrayType, {
        initialCapacity: initialCapacity ?? source.length,
      });
      vec.pushN(source);
      return vec;
    }

    if (isIterable(source)) {
      const vec = new Vector<T>(ArrayType, { initialCapacity });
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
   * @hidden Get a subarray of the underlying backing {@link !TypedArray}.
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
   * @returns A {@link !TypedArray} of the removed values.
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
   * Reallocate the underlying {@link !TypedArray}.
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

  *values(): IterableIterator<number> {
    const len = this._length;
    for (let i = 0; i < len; i++) yield this._array[i];
  }

  *entries(): IterableIterator<[number, number]> {
    const len = this._length;
    for (let i = 0; i < len; i++) yield [i, this._array[i]];
  }

  *consume(): IterableIterator<number> {
    while (this._length > 0) {
      const value = this.pop();
      if (value === undefined) break;
      yield value;
    }
  }

  #error = (method: string, message: string): Error =>
    new Error(`Vector[${this.Type.name}].${method}(): ${message}`);
}
