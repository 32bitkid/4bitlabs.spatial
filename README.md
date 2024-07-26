# Getting started

This repository contains TypeScript implementations for a [**quadtree**][quadtree] and **ennetree**.

## [Quadtree](/libs/quadtree/README.md)

![Quadtree split illustration][quadtree-split-img]

```ts
import { quadtree } from '@4bitlabs/quadtree';

interface Entity {
  /* whatever you like */
}

type Bounds = [left: number, top: number, right: number, bottom: number];

function getBounds(it: Entity): Bounds {
  /* determine bounds for entity, specified in  */
}

const space = quadtree<Entity>([0, 0, 1000, 1000], Entity.prototype.getBounds);
```

## [Ennetree](/libs/ennetree/README.md)

Similar to a [**quadtree**][quadtree] but instead of _binary_ recursive subdivisions, an **ennetree** uses trinary (3&times;3) subdivisions.

![Ennetree split illustration][ennetree-split-img]

Depending on the use-case, this can sometimes yield _more_ efficient spatial queries.

```ts
import { ennetree } from '@4bitlabs/ennetree';

interface Entity {
  /* whatever you like */
}

type Bounds = [left: number, top: number, right: number, bottom: number];

function getBounds(
  it: Entity,
): [x0: number, y0: number, x1: number, y1: number] {
  /* determine bounds for entity */
}

const space = ennetree<Entity>([0, 0, 1000, 1000], Entity.prototype.getBounds);
```

## Options

Both `quadtree()` and `ennetree()` accept a third argument of `options`:

| option        | Description                                                  | Defaults                       |
| ------------- | :----------------------------------------------------------- | ------------------------------ |
| `maxDepth`    | The maximum depth/subdivisions that the graph will divide.   | quadtree = `7`, ennetree = `4` |
| `maxChildren` | The maximum number of objects in a node before it will split | quadtree,ennetree = `10`       |

```ts
const space = quadtree<Entity>([0, 0, 1000, 1000], Entity.prototype.getBounds, {
  maxDepth: 5,
  maxChildren: 50,
});
```

[quadtree]: https://en.wikipedia.org/wiki/Quadtree
[quadtree-split-img]: https://github.com/32bitkid/4bitlabs.spatial/blob/main/quadtree-split.png?raw=true
[ennetree-split-img]: https://github.com/32bitkid/4bitlabs.spatial/blob/main/ennetree-split.png?raw=true