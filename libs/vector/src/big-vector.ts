import { BigTypedArray, BigTypedArrayConstructor } from './typed-array';
import { isBigTypedArray } from './is-typed-array';
import { isIterable } from './is-iterable';
import { VectorFromOptions, VectorOptions } from './vector-options';

const DEFAULT_GROWTH_FN = (current: number) => Math.ceil(current * 1.5);

/**
 * The {@link BigVector} is a resizable data-structure for storing `int64` and `uint64` entries.
 *
 * @example 64-bit integer vectors.
 *
 * ```ts
 * const signedVector = new BigVector(BigInt64Array);
 * const unsignedVector = new BigVector(BigUint64Array);
 * ```
 *
 * Then, you can {@link push | `push()`} and {@link pop | `pop()`} entries from the {@link BigVector}.
 *
 * ```ts
 * signedVector.push(1n);
 * signedVector.push(-1n);
 * unsignedVector.push(1n);
 * unsignedVector.push(0xFFFF_FFFF_FFFF_FFFFn);
 * ```
 */
export class BigVector<T extends BigTypedArray> {
  private readonly Type: BigTypedArrayConstructor<T>;
  private readonly growthFn: (current: number) => number;

  private _array: T;
  private _capacity: number;
  private _length: number;

  /**
   * Current the current length of the backing {@link BigTypedArray}. This is the maximum number of elements this
   * {@link BigVector} can hold before it will be resized.
   */
  get capacity(): number {
    return this._capacity;
  }

  /**
   * Get the current length of the {@link BigVector}, will always been _less-than-or-equal_ to {@link BigVector.capacity}.
   */
  get length(): number {
    return this._length;
  }

  /**
   * Create an empty {@link BigVector} with a given capacity, the default is `0`.
   *
   * @param Type The constructor of the underlying backing {@link BigTypedArray} type.
   * @param initialCapacity The initial capacity of the {@link BigVector}. Defaults to `0`.
   */
  constructor(Type: BigTypedArrayConstructor<T>, initialCapacity?: number);
  /**
   * You can also customize more options, by using {@link VectorOptions} in the second argument.
   *
   * @param Type The constructor of the underlying backing {@link BigTypedArray} type.
   * @param options Initial options
   */
  constructor(Type: BigTypedArrayConstructor<T>, options: VectorOptions);
  constructor(
    Type: BigTypedArrayConstructor<T>,
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
   * Create a {@link BigVector} from an existing {@link !Array} or {@link !Iterable}
   *
   * @param source The source {@link !Array} or {@link !Iterable} of {@link !BigInt}s
   * @param Type The constructor of the underlying backing {@link BigTypedArray} type.
   * @param initialCapacity The initial capacity of the constructed {@link BigVector}
   */
  static from<T extends BigTypedArray>(
    source: ArrayLike<bigint> | Iterable<bigint>,
    Type: BigTypedArrayConstructor<T>,
    initialCapacity?: number,
  ): BigVector<T>;
  /**
   * Create a {@link BigVector} from an existing {@link !Array} or {@link !Iterable}
   *
   * @param source The source {@link !Array} or {@link !Iterable} of {@link !BigInt}s
   * @param Type The constructor of the underlying backing {@link BigTypedArray} type.
   * @param options The options of constructed {@link BigVector}
   */
  static from<T extends BigTypedArray>(
    source: ArrayLike<bigint> | Iterable<bigint>,
    Type: BigTypedArrayConstructor<T>,
    options: VectorFromOptions,
  ): BigVector<T>;
  static from<T extends BigTypedArray>(
    source: ArrayLike<bigint> | Iterable<bigint>,
    Type: BigTypedArrayConstructor<T>,
    _options: VectorFromOptions | number = {},
  ): BigVector<T> {
    const options =
      typeof _options === 'number' ? { initialCapacity: _options } : _options;

    if (Array.isArray(source) || isBigTypedArray(source)) {
      const vec = new BigVector<T>(Type, {
        ...options,
        initialCapacity: options.initialCapacity ?? source.length,
      });
      vec.pushN(source);
      return vec;
    }

    if (isIterable(source)) {
      const vec = new BigVector<T>(Type, options);
      for (const val of source) vec.push(val);
      return vec;
    }

    throw new Error(`BigVector.from() source is not a valid type`);
  }

  /**
   * Set the value at the given index.
   *
   * @param index The index of the element to set.
   * @param value The value of the element.
   * @throws {@link !Error} if the index is out of range.
   */
  set(index: number, value: bigint): void {
    if (index > this._length || index < 0)
      throw this.#error('set', 'out of bounds');
    this._array[index] = value;
  }

  /**
   * Retrieves the element at the given index.
   *
   * @param index The index of the element to get.
   * @throws {@link !Error} if the index is out of range.
   */
  get(index: number): bigint {
    if (index > this._length || index < 0)
      throw this.#error('get', 'out of bounds');
    return this._array[index];
  }

  /**
   * Set multiple values starting at begin.
   *
   * @param begin The index to start at.
   * @param values The values to set.
   */
  setN(begin: number, values: ArrayLike<bigint>): void {
    if (begin < 0 || begin + values.length > this._length)
      throw this.#error('setN', 'out of bounds');
    this._array.set(values, begin);
  }

  /**
   * Push elements onto the end of the {@link BigVector}, resizing if needed.
   *
   * @param args The values to push to the end of the vector.
   * @returns The new length of the vector.
   */
  push(...args: bigint[]): number {
    while (this._length + args.length > this._capacity) this.grow();
    this._array.set(args, this._length);
    this._length += args.length;
    return this._length;
  }

  /**
   * Push multiple elements onto the end of the {@link BigVector}, resizing _multiple-times_ if needed.
   *
   * @param values
   */
  pushN(values: ArrayLike<bigint>): number {
    while (this._length + values.length > this._capacity) this.grow();
    this._array.set(values, this._length);
    this._length += values.length;
    return this._length;
  }

  /**
   * Remove and return a single element from the end of the {@link BigVector}.
   *
   * @returns The removed value, unless the {@link BigVector} is empty, then `undefined`.
   */
  pop(): bigint | undefined {
    if (this._length === 0) return undefined;
    return this._array[--this._length];
  }

  /**
   * Remove and return a multiple elements from the end of the {@link BigVector}.
   *
   * @param count
   * @returns A {@link BigTypedArray} of the removed values.
   *
   * @example
   * const vec = BigVector.from([1, 2, 3, 4, 5], Uint8Array);
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
   * Manually trigger the {@link BigVector} to grow in size, using the growth behavior.
   */
  grow(): this {
    const capacity = Math.max(this.growthFn(this._capacity), 1);
    this.reallocate(capacity);
    return this;
  }

  /**
   * Reallocate the underlying {@link BigTypedArray}.
   *
   * If the capacity is _less-than_ the current length, then the extra values are discarded.
   *
   * @param capacity The desired capacity of the {@link BigVector}. Defaults to the current length of the {@link BigVector}.
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
   * Clear all entries from the {@link BigVector}
   */
  clear(): this {
    this._length = 0;
    return this;
  }

  /**
   * Iterate through the vector from the tail-end, consuming each entry. Essentially, the same as
   * running {@link BigVector.pop} in a loop until {@link BigVector.length} is zero.
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
  *consume(): IterableIterator<bigint> {
    while (this._length > 0) {
      yield this._array[--this._length];
    }
  }

  #error = (method: string, message: string): Error =>
    new Error(`BigVector[${this.Type.name}].${method}(): ${message}`);
}
