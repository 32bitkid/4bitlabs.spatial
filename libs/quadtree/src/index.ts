/**
 * A simple 2D quadtree (2×2 spatial division) for fast, efficient spatial queries.
 *
 * ![Quadtree split illustration][quadtree-split-img]
 *
 * [quadtree-split-img]: https://github.com/32bitkid/4bitlabs.spatial/blob/main/quadtree-split.png?raw=true

 *
 * @example
 *
 * An _easy_ way to use this within a browser is to use the built-in {@link !DOMRect} class, consider:
 *
 * ```ts
 * import { quadtree, type Bounds } from '@4bitlabs/quadtree';
 *
 * const rectBounds = (r: DOMRect) => [r.left, r.top, r.right, r.bottom];
 *
 * const space = quadtree<DOMRect>([0, 0, 1000, 1000], rectBounds);
 * space.insert(new DOMRect(25, 25, 50, 50));
 *
 * const matches = space.search([20, 20, 80, 80]);
 * ```
 *
 * @see {@link quadtree}
 *
 * @module
 */
export type { Quadtree } from './quadtree';
export type { Bounds } from './bounds';
export type { qTreeOptions } from './q-tree-options';
export { quadtree } from './factory';
