/**
 * Options for controlling the behavior of a {@link Quadtree}.
 * @see {@link quadtree}
 */
export interface qTreeOptions {
  /**
   * Maximum depth of the tree, after which all elements will be added to leaf-nodes.
   *
   * @defaultValue `7`
   */
  maxDepth?: number;

  /**
   * The maximum children that a node can contain, before it gets _split_ into quads.
   *
   * @defaultValue `10`
   */
  maxChildren?: number;
}
