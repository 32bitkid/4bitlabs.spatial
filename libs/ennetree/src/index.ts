/**
 * A simple 2D ennetree (3×3 spatial division) for fast, efficient spatial queries.
 *
 * ![Ennetree split illustration][ennetree-split-img]
 *
 * [ennetree-split-img]: https://github.com/32bitkid/4bitlabs.spatial/blob/main/ennetree-split.png?raw=true
 *
 * @example
 *
 * An _easy_ way to use this within a browser is to use the built-in {@link !DOMRect} class, consider:
 *
 * ```ts
 * import { ennetree, type Bounds } from '@4bitlabs/ennetree';
 *
 * const rectBounds = (r: DOMRect) => [r.left, r.top, r.right, r.bottom];
 *
 * const space = ennetree<DOMRect>([0, 0, 1000, 1000], rectBounds);
 * space.insert(new DOMRect(25, 25, 50, 50));
 *
 * const matches = space.search([20, 20, 80, 80]);
 * ```
 *
 * @see {@link ennetree}
 *
 * @module
 */
export type { Ennetree } from './ennetree';
export type { Bounds } from './bounds';
export type { eTreeOptions } from './e-tree-options';
export { ennetree } from './factory';
