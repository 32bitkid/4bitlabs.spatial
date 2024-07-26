import { Bounds } from './bounds';

/**
 * @typeParam T The type of children of this {@link Quadtree} contains.
 */
export interface Quadtree<T> {
  /**
   * Count the total number of items in the {@link Quadtree}.
   */
  readonly size: number;

  /**
   * Insert an item into the {@link Quadtree}.
   *
   * @param item The item to insert.
   */
  insert(item: Readonly<T>): void;

  /**
   * Search the {@link Quadtree} for all items that intersect with the search area.
   *
   * @param area The search area of the query.
   * @returns An iterator of matched items.
   */
  search(area: Readonly<Bounds>): IterableIterator<Readonly<T>>;

  /**
   * Return all the items within the {@link Quadtree}.
   *
   * @returns An iterator of all items.
   */
  all(): IterableIterator<Readonly<T>>;

  /**
   * Collect items in the {@link Quadtree} that intersect with the search area into result.
   *
   * @param area The search area of the query.
   * @param result An optional array to collect items. Defaults to an empty array.
   * @returns A reference to the collection array.
   */
  collect(area: Readonly<Bounds>, result?: Readonly<T>[]): Readonly<T>[];

  /**
   * Collect all items in the {@link Quadtree} into result.
   *
   * @param result An optional array to collect items. Defaults to an empty array.
   * @returns A reference to the collection array.
   */
  collectAll(result?: Readonly<T>[]): Readonly<T>[];

  /**
   * Remove an item from the {@link Quadtree}.
   *
   * @param item The item to remove.
   */
  remove(item: Readonly<T>): boolean;

  /**
   * Clear all items from the {@link Quadtree} and reset the tree back to its initial state.
   */
  clear(): void;
}
