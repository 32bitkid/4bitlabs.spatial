import type { Bounds } from './bounds';

export class BoundsCache<T extends object> {
  private boundsCache: WeakMap<T, Bounds>;
  private readonly boundsFn: (it: T) => Bounds;

  constructor(boundsFn: (it: T) => Bounds) {
    this.boundsFn = boundsFn;
    this.boundsCache = new WeakMap();
  }

  get(item: T): Readonly<Bounds> {
    const cached = this.boundsCache.get(item);
    if (cached) return cached;
    const bounds = this.boundsFn(item);
    this.boundsCache.set(item, bounds);
    return bounds;
  }

  delete(item: T) {
    this.boundsCache.delete(item);
  }

  clear() {
    this.boundsCache = new WeakMap();
  }
}
