export const DEFAULT_GROWTH_FN = (current: number): number =>
  Math.ceil(current * 1.5);

/**
 * The advanced options that can be used to control the construction of a {@link Vector} or {@link BigVector}
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
 * The advanced options that can be used to control the construction with {@link Vector.from} or {@link BigVector.from}
 */
export interface VectorFromOptions {
  /**
   * The initial capacity of the {@link Vector}.
   *
   * @defaultValue `0`, unless {@link VectorOptions.initialLength | initialLength} is greater.
   */
  initialCapacity?: number;

  /**
   * This method is called when the Vector needs to be resized to determine how much more memory should be allocated.
   * The default behavior is to grow by a rate of _1.5_.
   *
   * @defaultValue `(current: number) => Math.ceil(current * 1.5)`
   */
  growthFn?: (current: number) => number;
}
