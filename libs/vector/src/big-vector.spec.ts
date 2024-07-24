import { BigVector } from './big-vector';

describe('BigVector', () => {
  it('should handle unsigned bigints', () => {
    const vec = new BigVector(BigUint64Array);
    vec.push(BigInt('0xffffffffffffffff'));
    expect(vec.pop()).toBe(BigInt('0xffffffffffffffff'));
  });

  it('should handle signed bigints', () => {
    const vec = new BigVector(BigInt64Array);
    vec.push(BigInt('0xffffffffffffffff'));
    expect(vec.pop()).toBe(BigInt('-1'));
  });

  it('should be able to push multiple bigints', () => {
    const vec = new BigVector(BigUint64Array);
    vec.push(BigInt('1'), BigInt('2'), BigInt('3'));
    expect(vec.length).toBe(3);
    expect(vec.pop()).toBe(BigInt('3'));
    expect(vec.pop()).toBe(BigInt('2'));
    expect(vec.pop()).toBe(BigInt('1'));
  });

  it('should be consumable', () => {
    const source = Array.from({ length: 32 }, (_, i) => BigInt(i));
    const vec = BigVector.from(source, BigUint64Array);

    let expected = BigInt(32);
    for (const value of vec.consume()) {
      expect(value).toBe(--expected);
    }
    expect(vec.length).toBe(0);
  });

  it('should be clearable', () => {
    const vec = BigVector.from(
      [-2, -1, 0, 1, 2].map((it) => BigInt(it)),
      BigInt64Array,
    );
    expect(vec.length).toBe(5);
    vec.clear();
    expect(vec.length).toBe(0);
  });

  it('should support different growth strategies', () => {
    const vec = new BigVector(BigInt64Array, { growthFn: (prev) => prev + 4 });
    expect(vec.capacity).toBe(0);
    vec.pushN(Array.from({ length: 3 }, () => BigInt(0)));
    expect(vec.capacity).toBe(4);
    vec.push(BigInt(4));
    expect(vec.capacity).toBe(4);
    vec.push(BigInt(0));
    expect(vec.capacity).toBe(8);
    vec.pushN(Array.from({ length: 4 }, () => BigInt(0)));
    expect(vec.capacity).toBe(12);
  });

  it('should force growing', () => {
    const vec = new BigVector(BigInt64Array, { growthFn: (prev) => prev + 4 });
    expect(vec.capacity).toBe(0);
    vec.grow();
    expect(vec.capacity).toBe(4);
  });

  it('should support getting/setting a specific index', () => {
    const vec = new BigVector(BigInt64Array, { initialLength: 10 });
    expect(vec.get(5)).toBe(BigInt(0));
    vec.set(5, BigInt(-10));
    expect(vec.get(5)).toBe(BigInt(-10));
  });

  it('should throw on out-of-bounds when using get() and set()', () => {
    const vec = new BigVector(BigInt64Array, {
      initialCapacity: 10,
      initialLength: 5,
    });
    expect(() => vec.get(5)).not.toThrow('out of bounds');
    expect(() => vec.set(5, BigInt(42))).not.toThrow('out of bounds');

    expect(() => vec.get(10)).toThrow('out of bounds');
    expect(() => vec.set(10, BigInt(42))).toThrow('out of bounds');

    expect(() => vec.get(-5)).toThrow('out of bounds');
    expect(() => vec.set(-5, BigInt(42))).toThrow('out of bounds');
  });

  it('should support creating a vector from an iterable', () => {
    function* count(max: number) {
      let i = BigInt(0);
      while (i < max) {
        yield i++;
      }
    }

    const vec = BigVector.from(count(10), BigInt64Array);
    expect([...vec.consume()]).toStrictEqual([
      BigInt(9),
      BigInt(8),
      BigInt(7),
      BigInt(6),
      BigInt(5),
      BigInt(4),
      BigInt(3),
      BigInt(2),
      BigInt(1),
      BigInt(0),
    ]);
  });
});
