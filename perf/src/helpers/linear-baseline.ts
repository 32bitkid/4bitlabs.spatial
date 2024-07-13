import { Bounds, overlaps } from './geom';

export class LinearBaseline<T extends object> {
  private readonly items: Set<T> = new Set();
  private readonly bounds: WeakMap<T, Bounds> = new WeakMap();
  private readonly boundsFn: (item: T) => Bounds;

  constructor(boundsFn: (item: T) => Bounds) {
    this.boundsFn = boundsFn;
  }

  insert(item: T) {
    this.items.add(item);
    this.bounds.set(item, this.boundsFn(item));
  }

  collect(area: Bounds): T[] {
    const result = [];
    for (const item of this.items) {
      const r = this.bounds.get(item) ?? this.boundsFn(item);
      if (overlaps(area, r)) result.push(item);
    }
    return result;
  }

  remove(item: T) {
    this.items.delete(item);
    this.bounds.delete(item);
  }
}
