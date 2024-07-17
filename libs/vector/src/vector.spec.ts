import { Vector } from './vector';

describe('Vector', () => {
  it('should create a dynamic vector', () => {
    const vec = new Vector(Uint8Array, 20);
    expect(vec.length).toBe(0);
    expect(vec.capacity).toBe(20);
  });

  it('should get and set values', () => {
    const vec = new Vector(Uint8Array, { initialLength: 20 });
    vec.set(10, 42);
    expect(vec.length).toBe(20);
    expect(vec.get(10)).toBe(42);
  });

  it('should return undefined on out-of-bounds', () => {
    const vec = new Vector(Uint8Array, 5);
    expect(vec.get(10)).toBe(undefined);
    expect(() => vec.set(10, 42)).not.toThrow();
  });

  it('should throw on out-of-bounds when using mustGet and mustSet', () => {
    const vec = new Vector(Uint8Array, {
      initialCapacity: 10,
      initialLength: 5,
    });
    expect(() => vec.mustGet(5)).not.toThrow('out of bounds');
    expect(() => vec.mustSet(5, 42)).not.toThrow('out of bounds');

    expect(() => vec.mustGet(10)).toThrow('out of bounds');
    expect(() => vec.mustSet(10, 42)).toThrow('out of bounds');
  });

  it('should push values', () => {
    const vec = new Vector(Uint8Array, 5);
    for (let i = 0; i < 100; i++) vec.push(i);
    expect(vec.length).toBe(100);
    expect(vec.capacity).toBe(140);
    expect(vec.get(42)).toBe(42);
  });

  it('should push multiple values at once', () => {
    const vec = new Vector(Uint8Array, 10);
    vec.pushN([1, 2, 3, 4, 5]);
  });

  it('should grow multiple times before pushing multiple values', () => {
    const vec = new Vector(Uint8Array, 8);
    vec.pushN(Array.from({ length: 32 }, (_, i) => i));
    expect(vec.length).toBe(32);
    expect(vec.capacity).toBe(41);
    expect(vec.get(13)).toBe(13);
  });

  it('should pop values', () => {
    const vec = new Vector(Uint8Array, 10);
    vec.pushN([1, 2, 3, 4, 5]);
    expect(vec.pop()).toBe(5);
    expect(vec.length).toBe(4);

    expect(vec.pop()).toBe(4);
    expect(vec.length).toBe(3);

    expect(vec.pop()).toBe(3);
    expect(vec.length).toBe(2);

    expect(vec.pop()).toBe(2);
    expect(vec.length).toBe(1);

    expect(vec.pop()).toBe(1);
    expect(vec.length).toBe(0);

    expect(vec.pop()).toBe(undefined);
  });

  it('should pop multiple values at once', () => {
    const vec = Vector.from(
      Array.from({ length: 32 }, (_, i) => i),
      Uint8Array,
    );

    let result = vec.popN(8);
    expect(result).toStrictEqual(Uint8Array.of(24, 25, 26, 27, 28, 29, 30, 31));
    result = vec.popN(8);
    expect(result).toStrictEqual(Uint8Array.of(16, 17, 18, 19, 20, 21, 22, 23));
    result = vec.popN(8);
    expect(result).toStrictEqual(Uint8Array.of(8, 9, 10, 11, 12, 13, 14, 15));
  });

  it('should pop multiple into a destination array', () => {
    const vec = Vector.from(
      Array.from({ length: 32 }, (_, i) => i),
      Uint8Array,
    );

    const dest = new Uint8Array(8);
    vec.popN(8, dest);
    expect(dest).toStrictEqual(Uint8Array.of(24, 25, 26, 27, 28, 29, 30, 31));
    vec.popN(8, dest);
    expect(dest).toStrictEqual(Uint8Array.of(16, 17, 18, 19, 20, 21, 22, 23));
    vec.popN(8, dest);
    expect(dest).toStrictEqual(Uint8Array.of(8, 9, 10, 11, 12, 13, 14, 15));
  });

  it('should throw if popping too many multiple values', () => {
    const vec = Vector.from(
      Array.from({ length: 8 }, (_, i) => i),
      Uint8Array,
    );
    expect(() => vec.popN(4)).not.toThrow();
    expect(() => vec.popN(4)).not.toThrow();
    expect(() => vec.popN(4)).toThrow('out of bounds');
  });

  it('should be able to make a vector from an array', () => {
    const source = Array.from({ length: 32 }, (_, i) => i);
    const vec = Vector.from(source, Float64Array);
    expect(vec.length).toBe(32);
    expect(vec.capacity).toBe(32);
    for (let i = 0; i < 32; i++) expect(vec.get(i)).toBe(i);
  });

  it('should be able to make a vector from an iterable', () => {
    function* source(min: number, max: number) {
      for (let i = min; i < max; i++) yield i;
    }

    const vec = Vector.from(source(0, 32), Float64Array);
    expect(vec.length).toBe(32);
    expect(vec.capacity).toBe(41);
    for (let i = 0; i < 32; i++) expect(vec.get(i)).toBe(i);
  });

  it('should throw if Vector.from() given something weird', () => {
    expect(() =>
      Vector.from({} as unknown as ArrayLike<number>, Float64Array),
    ).toThrow('source is not a valid type');
  });

  it('should iterate items', () => {
    const source = Array.from({ length: 32 }, (_, i) => i);
    const vec = Vector.from(source, Float64Array);

    let expected = 0;
    for (const value of vec.values()) expect(value).toBe(expected++);
    expect(vec.length).toBe(32);
  });

  it('should iterate entries', () => {
    const source = Array.from({ length: 32 }, (_, i) => i);
    const vec = Vector.from(source, Float64Array);

    let i = 0;
    for (const [idx, value] of vec.entries()) {
      expect(idx).toBe(idx);
      expect(value).toBe(source[i]);
      i++;
    }
    expect(vec.length).toBe(32);
  });

  it('should be consumable', () => {
    const source = Array.from({ length: 32 }, (_, i) => i);
    const vec = Vector.from(source, Float64Array);

    let expected = 32;
    for (const value of vec.consume()) expect(value).toBe(--expected);
    expect(vec.length).toBe(0);
  });

  it('should be subarray-able', () => {
    const vec = new Vector(Float64Array, 128);
    vec.pushN([0, 0, 100, 100]);
    vec.pushN([500, 500, 75, 25]);
    vec.pushN([200, 200, 93, 10]);
    vec.pushN([950, 950, 50, 50]);

    expect(vec.subarray(0, 4)).toStrictEqual(Float64Array.of(0, 0, 100, 100));
    expect(vec.subarray(12, 16)).toStrictEqual(
      Float64Array.of(950, 950, 50, 50),
    );
  });

  it('should allow setting multiple values at once', () => {
    const source = Array.from({ length: 8 }, (_, i) => i);
    const vec = Vector.from(source, Uint8ClampedArray);
    vec.setN(2, [255, 254, 253, 252]);
    expect([...vec.values()]).toStrictEqual([0, 1, 255, 254, 253, 252, 6, 7]);
  });

  it('should let you copy multiple values', () => {
    const source = Array.from({ length: 8 }, (_, i) => i);
    const vec = Vector.from(source, Uint8Array);
    const actual = vec.copy(2, 4);
    expect(actual).toStrictEqual(Uint8Array.of(2, 3, 4, 5));
  });

  it('should let you fill an existing array with copy()', () => {
    const source = Array.from({ length: 8 }, (_, i) => i);
    const vec = Vector.from(source, Uint8Array);

    const dest = new Uint8Array(3);
    vec.copy(2, dest);
    expect(dest).toStrictEqual(Uint8Array.of(2, 3, 4));
  });

  it('should be clearable', () => {
    const vec = Vector.from([1, 2, 3, 4], Float64Array);
    expect(vec.pop()).toBe(4);
    vec.clear();
    expect(vec.length).toBe(0);
  });
});
