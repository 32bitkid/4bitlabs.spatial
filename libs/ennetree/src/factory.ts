import { type Bounds } from './bounds';
import { eTree } from './e-tree';
import { Ennetree } from './ennetree';
import { eTreeOptions } from './e-tree-options';

/**
 * Create an ennetree for a given area.
 *
 * @param area The region-bounds of this ennetree.
 * @param boundsFn A function to calculate the bounds for the child type `T`.
 * @param options
 * @typeParam T The type of children of this ennetree contains.
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
 * const qt = ennetree<Rectangle>([0,0,1000,1000], rectBounds);
 *
 * // Add a rectangle
 * qt.insert({ x: 20, y: 20, width: 50, height: 50 });
 *
 * // Collect items
 * const results = qt.collect([0, 0, 100, 100]);
 * ```
 *
 * @example Using advanced options
 *
 * ```ts
 * const qt = ennetree<Rectangle>(
 *   [0,0,1000,1000],
 *   rectBounds,
 *   {
 *     maxDepth: 4,
 *     maxChildren: 50
 *   }
 * );
 * ```
 *
 * @example Using DOMRect with ennetree
 *
 * ```ts
 * const qt = ennetree<DOMRect>(
 *   [0, 0, 1000, 1000],
 *   ({ left, top, right, bottom }) => [left, top, right, bottom],
 * );
 * ```
 */
export function ennetree<T extends object>(
  area: Readonly<Bounds>,
  boundsFn: (it: T) => Bounds,
  options: eTreeOptions = {},
): Ennetree<T> {
  const quadCache = new WeakMap<T, eTree<T>>();
  return new eTree<T>(area, options, boundsFn, quadCache);
}
