import { qTree } from './q-tree';
import { Bounds } from './bounds';
import { Quadtree } from './quadtree';
import { qTreeOptions } from './q-tree-options';

/**
 * Create a quadtree for a given area.
 *
 * @param area The region-bounds of this quadtree.
 * @param boundsFn Child bounds predicate.
 * @param options
 * @typeParam T The type of children of this quadtree contains.
 *
 * @example A simple quadtree
 *
 * ```ts
 * interface Rectangle {
 *   x: number;
 *   y: number;
 *   width: number;
 *   height: number;
 * }
 *
 * const rectBounds = ({ x, y, width, height }: Rectangle) =>
 *   [x, y, x + width, r.y + height];
 *
 * const qt = quadtree([0,0,1000,1000], rectBounds);
 *
 * // Add a rectangle
 * qt.insert([20, 20, 50, 50]);
 *
 * // Collect items
 * const results = qt.collect([0, 0, 100, 100]);
 * ```
 *
 * @example Using advanced options
 *
 * ```ts
 * const qt = quadtree(
 *   [0,0,1000,1000],
 *   rectBounds,
 *   {
 *     maxDepth: 4,
 *     maxChildren: 50
 *   }
 * );
 * ```
 *
 * @example Using DOMRect with quadtree
 *
 * ```ts
 * const qt = quadtree<DOMRect>(
 *   [0, 0, 1000, 1000],
 *   ({ left, top, right, bottom }) => [left, top, right, bottom],
 * );
 * ```
 */
export function quadtree<T extends object>(
  area: Readonly<Bounds>,
  boundsFn: (it: T) => Bounds,
  options: qTreeOptions = {},
): Quadtree<T> {
  const quadCache = new WeakMap<T, qTree<T>>();
  return new qTree<T>(area, options, boundsFn, quadCache);
}
