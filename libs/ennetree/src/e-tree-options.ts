/**
 * Options for controlling the behavior of an ennetree
 */
export interface eTreeOptions {
  /**
   * Maximum depth of the tree, after which all elements will be added to leaf-nodes.
   *
   * @defaultValue `4`
   */
  maxDepth?: number;

  /**
   * The maximum children that a node can contain, before it gets _split_ into 3&times;3 areas.
   *
   * @defaultValue `10`
   */
  maxChildren?: number;
}
