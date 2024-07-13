import { type Bounds } from './bounds';
import { BoundsCache } from './bounds-cache';
import { eTree, type eTreeOptions } from './e-tree';

export function ennetree<T extends object>(
  area: Readonly<Bounds>,
  boundsFn: (it: T) => Bounds,
  options: eTreeOptions = {},
): eTree<T> {
  const boundsCache = new BoundsCache<T>(boundsFn);
  const quadCache = new WeakMap<T, eTree<T>>();
  return new eTree<T>(area, options, boundsCache, quadCache);
}
