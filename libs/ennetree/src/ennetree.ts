import { type Bounds } from './bounds';
import { eTree, type eTreeOptions } from './e-tree';

export function ennetree<T extends object>(
  area: Readonly<Bounds>,
  boundsFn: (it: T) => Bounds,
  options: eTreeOptions = {},
): eTree<T> {
  const quadCache = new WeakMap<T, eTree<T>>();
  return new eTree<T>(area, options, boundsFn, quadCache);
}
