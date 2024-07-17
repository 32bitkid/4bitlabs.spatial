import { Bounds, contains, overlaps } from './bounds';
import { Quadtree } from './quadtree';

export interface qTreeOptions {
  maxDepth?: number;
  maxChildren?: number;
}

export class qTree<T extends object> implements Quadtree<T> {
  private readonly depth: number;
  private readonly maxChildren: number;
  private readonly maxDepth: number;
  private readonly items: Set<T>;
  private readonly boundsFn: (item: T) => Bounds;
  private readonly quadCache: WeakMap<T, qTree<T>>;
  private readonly childAreas: [
    tl: Readonly<Bounds>,
    tr: Readonly<Bounds>,
    bl: Readonly<Bounds>,
    br: Readonly<Bounds>,
  ];
  private readonly children: [
    qTree<T> | null,
    qTree<T> | null,
    qTree<T> | null,
    qTree<T> | null,
  ];
  private isSplit: boolean;

  constructor(
    [x0, y0, x1, y1]: Readonly<Bounds>,
    options: qTreeOptions,
    boundFn: (item: T) => Bounds,
    quadCache: WeakMap<T, qTree<T>>,
    depth: number = 0,
  ) {
    const { maxDepth = 7, maxChildren = 10 } = options;
    this.maxDepth = maxDepth;
    this.maxChildren = maxChildren;
    this.boundsFn = boundFn;
    this.quadCache = quadCache;
    this.depth = depth;

    const midX = (x0 + x1) / 2;
    const midY = (y0 + y1) / 2;
    this.childAreas = [
      [x0, y0, midX, midY],
      [midX, y0, x1, midY],
      [x0, midY, midX, y1],
      [midX, midY, x1, y1],
    ];
    this.isSplit = false;
    this.children = [null, null, null, null];
    this.items = new Set();
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
    for (let i = 0; i < 4; i++) {
      const childRect = this.childAreas[i];
      const rect = this.boundsFn(item);
      if (contains(childRect, rect)) {
        let child = this.children[i];
        if (!child) {
          this.children[i] = child = new qTree<T>(
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

  collectAll(result: Readonly<T>[] = []): Readonly<T>[] {
    for (const r of this.items) result.push(r);
    for (let i = 0; i < 4; i++) {
      const child = this.children[i];
      if (!child) continue;
      child.collectAll(result);
    }
    return result;
  }

  collect(area: Readonly<Bounds>, result: Readonly<T>[] = []): Readonly<T>[] {
    for (const item of this.items) {
      const rect = this.boundsFn(item);
      if (overlaps(area, rect)) result.push(item);
    }

    for (let i = 0; i < 4; i++) {
      const child = this.children[i];
      if (!child) continue;

      const childArea = this.childAreas[i];
      if (contains(area, childArea)) child.collectAll(result);
      else if (overlaps(area, childArea)) child.collect(area, result);
    }

    return result;
  }

  *all(): Generator<Readonly<T>, void, undefined> {
    yield* this.items;
    for (let i = 0; i < 4; i++) {
      const child = this.children[i];
      if (!child) continue;
      yield* child.all();
    }
  }

  *search(area: Readonly<Bounds>): Generator<Readonly<T>, void, undefined> {
    for (const item of this.items) {
      const rect = this.boundsFn(item);
      if (overlaps(area, rect)) yield item;
    }

    for (let i = 0; i < 4; i++) {
      const child = this.children[i];
      if (!child) continue;

      const childArea = this.childAreas[i];
      if (contains(area, childArea)) yield* child.all();
      else if (overlaps(area, childArea)) yield* child.search(area);
    }
  }

  size(): number {
    let count = this.items.size;
    for (let i = 0; i < 4; i++) {
      const child = this.children[i];
      if (child) count += child.size();
    }
    return count;
  }
}
