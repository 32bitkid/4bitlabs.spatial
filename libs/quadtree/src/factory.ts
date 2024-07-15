import { qTree, qTreeOptions } from './q-tree';
import { Bounds } from './bounds';
import { Quadtree } from './quadtree';

export function quadtree<T extends object>(
  area: Readonly<Bounds>,
  boundsFn: (it: T) => Bounds,
  options: qTreeOptions = {},
): Quadtree<T> {
  const quadCache = new WeakMap<T, qTree<T>>();
  return new qTree<T>(area, options, boundsFn, quadCache);
}
