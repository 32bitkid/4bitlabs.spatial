import { type Bounds } from './bounds';
import { BoundsCache } from './bounds-cache';
import { qTree, type qTreeOptions } from './q-tree';

export function quadtree<T extends object>(
  area: Readonly<Bounds>,
  boundsFn: (it: T) => Bounds,
  options: qTreeOptions = {},
): qTree<T> {
  const boundsCache = new BoundsCache<T>(boundsFn);
  const quadCache = new WeakMap<T, qTree<T>>();
  return new qTree<T>(area, options, boundsCache, quadCache);
}
