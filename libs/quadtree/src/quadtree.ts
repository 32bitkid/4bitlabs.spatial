import { type Bounds } from './bounds';
import { qTree, type qTreeOptions } from './q-tree';

export function quadtree<T extends object>(
  area: Readonly<Bounds>,
  boundsFn: (it: T) => Bounds,
  options: qTreeOptions = {},
): qTree<T> {
  const quadCache = new WeakMap<T, qTree<T>>();
  return new qTree<T>(area, options, boundsFn, quadCache);
}
