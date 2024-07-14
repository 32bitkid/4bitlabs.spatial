import { TypedArray, TypedArrayConstructor } from './typed-array';
import { isTypedArray } from './is-typed-array';
import { isIterable } from './is-iterable';

export interface VectorOptions {
  initialCapacity?: number;
  initialLength?: number;
}

export class Vector<T extends TypedArray> {
  private readonly ArrayClass: TypedArrayConstructor<T>;
  private array: TypedArray;
  private _capacity: number;
  private _length: number;

  get capacity(): number {
    return this._capacity;
  }

  get length(): number {
    return this._length;
  }

  constructor(
    ArrayClass: TypedArrayConstructor<T>,
    options: VectorOptions | number = {},
  ) {
    const { initialCapacity = 0, initialLength = 0 } =
      typeof options === 'number' ? { initialCapacity: options } : options;
    this.ArrayClass = ArrayClass;
    this._length = initialLength;
    this._capacity = Math.max(initialCapacity, initialLength);
    this.array = new ArrayClass(this._capacity);
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

  set(index: number, value: number): void {
    if (index > this._length) return;
    this.array[index] = value;
  }

  get(index: number): number | undefined {
    if (index > this._length) return undefined;
    return this.array[index];
  }

  setN(start: number, values: ArrayLike<number>): void {
    if (start + values.length > this._length)
      throw this.#error('setN', 'out of bounds');
    this.array.set(values, start);
  }

  copy(index: number, countOrDest: number | T): T {
    const dest =
      typeof countOrDest === 'number'
        ? new this.ArrayClass(countOrDest)
        : countOrDest;
    dest.set(this.subarray(index, index + dest.length));
    return dest;
  }

  subarray(start: number = 0, end: number = this._length): T {
    if (end > this._length) throw this.#error('subarray', 'out of bounds');
    return this.array.subarray(start, end) as T;
  }

  mustSet(index: number, value: number): void {
    if (index > this._length || index < 0)
      throw this.#error('mustSet', 'out of bounds');
    this.array[index] = value;
  }

  mustGet(index: number): number | undefined {
    if (index > this._length || index < 0)
      throw this.#error('mustGet', 'out of bounds');
    return this.array[index];
  }

  push(value: number): number {
    if (this._capacity === this._length) this.grow();
    this.array[this._length++] = value;
    return this._length;
  }

  pushN(values: ArrayLike<number>): void {
    while (this._length + values.length > this._capacity) this.grow();
    this.array.set(values, this._length);
    this._length += values.length;
  }

  pop(): number | undefined {
    if (this._length === 0) return undefined;
    return this.array[--this._length];
  }

  popN(count: number, dest: T = new this.ArrayClass(count)): T {
    if (this._length < count) throw this.#error('popN', 'out of bounds');
    dest.set(this.array.subarray(this._length - count, this._length));
    this._length -= count;
    return dest;
  }

  grow(): this {
    const capacity = Math.max(Math.ceil(this._capacity * 1.5), 1);
    this.reallocate(capacity);
    return this;
  }

  reallocate(capacity: number = this._length): this {
    if (this._capacity === capacity) return this;

    const array = new this.ArrayClass(capacity);
    array.set(this.array, 0);
    this._capacity = capacity;
    this._length = Math.min(this.length, capacity);
    this.array = array;
    return this;
  }

  *values(): IterableIterator<number> {
    const len = this._length;
    for (let i = 0; i < len; i++) yield this.array[i];
  }

  *entries(): IterableIterator<[number, number]> {
    const len = this._length;
    for (let i = 0; i < len; i++) yield [i, this.array[i]];
  }

  *consume(): IterableIterator<number> {
    while (this._length > 0) {
      const value = this.pop();
      if (value === undefined) break;
      yield value;
    }
  }

  #error = (method: string, message: string): Error =>
    new Error(`Vector[${this.ArrayClass.name}].${method}(): ${message}`);
}
