import { Bounds } from './bounds';

/**
 * @typeParam T The type of children of this {@link Ennetree} contains.
 */
export interface Ennetree<T> {
  /**
   * Count the total number of items in the {@link Ennetree}.
   */
  readonly size: number;

  /**
   * Insert an item into the {@link Ennetree}.
   *
   * @param item The item to insert.
   */
  insert(item: Readonly<T>): void;

  /**
   * Search the {@link Ennetree} for all items that intersect with the search area.
   *
   * @param area The search area of the query.
   * @returns An iterator of matched items.
   */
  search(area: Readonly<Bounds>): IterableIterator<Readonly<T>>;

  /**
   * Return all the items within the {@link Ennetree}.
   *
   * @returns An iterator of all items.
   */
  all(): IterableIterator<Readonly<T>>;

  /**
   * Collect items in the {@link Ennetree} that intersect with the search area into result.
   *
   * @param area The search area of the query.
   * @param result An optional array to collect items. Defaults to an empty array.
   * @returns A reference to the collection array.
   */
  collect(area: Readonly<Bounds>, result?: Readonly<T>[]): Readonly<T>[];

  /**
   * Collect all items in the {@link Ennetree} into result.
   *
   * @param result An optional array to collect items. Defaults to an empty array.
   * @returns A reference to the collection array.
   */
  collectAll(result?: Readonly<T>[]): Readonly<T>[];

  /**
   * Remove an item from the {@link Ennetree}.
   *
   * @param item The item to remove.
   */
  remove(item: Readonly<T>): boolean;

  /**
   * Clear all items from the {@link Ennetree} and reset the tree back to its initial state.
   */
  clear(): void;
}
