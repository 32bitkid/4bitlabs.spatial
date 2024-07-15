import { Bounds } from './bounds';

export interface Ennetree<T> {
  clear(): void;
  insert(item: Readonly<T>): void;
  remove(item: Readonly<T>): boolean;
  size(): number;

  all(): Generator<Readonly<T>, void, undefined>;
  collect(area: Readonly<Bounds>, result?: Readonly<T>[]): Readonly<T>[];
  collectAll(result?: Readonly<T>[]): Readonly<T>[];
  search(area: Readonly<Bounds>): Generator<Readonly<T>, void, undefined>;
}
