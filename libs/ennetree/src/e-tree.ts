import { Bounds, contains, overlaps } from './bounds';
import { Ennetree } from './ennetree';
import { eTreeOptions } from './e-tree-options';

export class eTree<T extends object> implements Ennetree<T> {
  private readonly _bounds: Readonly<Bounds>;
  private readonly depth: number;
  private readonly maxChildren: number;
  private readonly maxDepth: number;
  private readonly items: Set<T>;
  private readonly boundsFn: (item: T) => Bounds;
  private readonly quadCache: WeakMap<T, eTree<T>>;
  private readonly childAreas: [
    mid: Readonly<Bounds>,
    t: Readonly<Bounds>,
    r: Readonly<Bounds>,
    b: Readonly<Bounds>,
    l: Readonly<Bounds>,
    tl: Readonly<Bounds>,
    tr: Readonly<Bounds>,
    br: Readonly<Bounds>,
    bl: Readonly<Bounds>,
  ];
  private readonly children: [
    eTree<T> | null,
    eTree<T> | null,
    eTree<T> | null,
    eTree<T> | null,
    eTree<T> | null,
    eTree<T> | null,
    eTree<T> | null,
    eTree<T> | null,
    eTree<T> | null,
  ];
  private isSplit: boolean;

  constructor(
    bounds: Readonly<Bounds>,
    options: eTreeOptions,
    boundsFn: (item: T) => Bounds,
    quadCache: WeakMap<T, eTree<T>>,
    depth = 0,
  ) {
    const { maxDepth = 4, maxChildren = 10 } = options;
    this.maxDepth = maxDepth;
    this.maxChildren = maxChildren;
    this.boundsFn = boundsFn;
    this.quadCache = quadCache;
    this._bounds = bounds;
    this.depth = depth;

    const [x0, y0, x3, y3] = bounds;
    const x1 = (2 / 3) * x0 + (1 / 3) * x3;
    const x2 = (1 / 3) * x0 + (2 / 3) * x3;
    const y1 = (2 / 3) * y0 + (1 / 3) * y3;
    const y2 = (1 / 3) * y0 + (2 / 3) * y3;

    this.childAreas = [
      [x1, y1, x2, y2],

      [x1, y0, x2, y1],
      [x2, y1, x3, y2],
      [x1, y2, x2, y3],
      [x0, y1, x1, y2],

      [x0, y0, x1, y1],
      [x2, y0, x3, y1],
      [x0, y2, x1, y3],
      [x2, y2, x3, y3],
    ];
    this.isSplit = false;
    this.children = [null, null, null, null, null, null, null, null, null];
    this.items = new Set();
  }

  get size(): number {
    let count = this.items.size;
    for (let i = 0; i < 9; i++) {
      const child = this.children[i];
      if (child) count += child.size;
    }
    return count;
  }

  get bounds(): Readonly<Bounds> {
    return this._bounds;
  }

  insert(item: Readonly<T>): void {
    if (!this.isSplit && this.items.size + 1 > this.maxChildren) {
      this.isSplit = true;
      for (const i of this.items)
        if (this.tryChildInsert(i)) this.items.delete(i);
    }

    if (this.isSplit && this.depth + 1 < this.maxDepth) {
      if (this.tryChildInsert(item)) return;
    }

    this.items.add(item);
    this.quadCache.set(item, this);
  }

  private tryChildInsert(item: Readonly<T>): boolean {
    for (let i = 0; i < 9; i++) {
      const childRect = this.childAreas[i];
      const rect = this.boundsFn.call(item, item);
      if (contains(childRect, rect)) {
        let child = this.children[i];
        if (!child) {
          this.children[i] = child = new eTree<T>(
            childRect,
            { maxDepth: this.maxDepth },
            this.boundsFn,
            this.quadCache,
            this.depth + 1,
          );
        }

        child.insert(item);
        return true;
      }
    }
    return false;
  }

  collectAll(result: Readonly<T>[] = []): Readonly<T>[] {
    for (const r of this.items) result.push(r);
    for (let i = 0; i < 9; i++) {
      const child = this.children[i];
      if (!child) continue;
      child.collectAll(result);
    }
    return result;
  }

  collect(area: Readonly<Bounds>, result: Readonly<T>[] = []): Readonly<T>[] {
    for (const item of this.items) {
      const rect = this.boundsFn.call(item, item);
      if (overlaps(area, rect)) result.push(item);
    }

    for (let i = 0; i < 9; i++) {
      const child = this.children[i];
      if (!child) continue;

      const childArea = this.childAreas[i];
      if (contains(area, childArea)) child.collectAll(result);
      else if (overlaps(area, childArea)) {
        child.collect(area, result);
        if (contains(childArea, area)) break;
      }
    }

    return result;
  }

  *all(): Generator<Readonly<T>, void, undefined> {
    yield* this.items;
    for (let i = 0; i < 9; i++) {
      const child = this.children[i];
      if (!child) continue;
      yield* child.all();
    }
  }

  *search(area: Readonly<Bounds>): Generator<Readonly<T>, void, undefined> {
    for (const item of this.items) {
      const rect = this.boundsFn.call(item, item);
      if (overlaps(area, rect)) yield item;
    }

    for (let i = 0; i < 9; i++) {
      const child = this.children[i];
      if (!child) continue;

      const childArea = this.childAreas[i];
      if (contains(area, childArea)) yield* child.all();
      else if (overlaps(area, childArea)) {
        yield* child.search(area);
        if (contains(childArea, area)) break;
      }
    }
  }

  remove(item: Readonly<T>): boolean {
    if (this.items.has(item)) {
      this.items.delete(item);
      this.quadCache.delete(item);
      // TODO handle cleanup
      return true;
    }

    const quad = this.quadCache.get(item);
    if (!quad) return false;
    return quad.remove(item);
  }

  clear(): void {
    this.items.clear();
    for (let i = 0; i < 4; i++) {
      const child = this.children[i];
      if (!child) continue;
      child.clear();
      this.children[i] = null;
    }
  }
}
