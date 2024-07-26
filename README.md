# Getting started

This repository contains the monorepo for the following TypeScript packages:

- `@4bitlabs/quadtree` - A simple 2D [**quadtree**][quadtree] (2×2 spatial division) for fast, efficient spatial queries
- `@4bitlabs/ennetree` - A simple 2D **ennetree** (3×3 spatial division) for fast, efficient spatial queries.
- `@4bitlabs/vector` - A simple, TypedArray-backed resizable vector data-structure.

## [Quadtree](/libs/quadtree/README.md)

![Quadtree split illustration][quadtree-split-img]

```ts
import { quadtree } from '@4bitlabs/quadtree';

class Entity {
  bounds(): Bounds {
    /* determine bounds */
    return [0, 0, 0, 0];
  }
}

const space = quadtree<Entity>([0, 0, 1000, 1000], Entity.prototype.getBounds);
```

## [Ennetree](/libs/ennetree/README.md)

Similar to a [**quadtree**][quadtree] but instead of _binary_ recursive subdivisions, an **ennetree** uses trinary (3&times;3) subdivisions.

![Ennetree split illustration][ennetree-split-img]

Depending on the use-case, this can sometimes yield _more_ efficient spatial queries.

```ts
import { ennetree, type Bounds } from '@4bitlabs/ennetree';

class Entity {
  bounds(): Bounds {
    /* determine bounds */
    return [0, 0, 0, 0];
  }
}

const space = ennetree<Entity>([0, 0, 1000, 1000], Entity.prototype.getBounds);
```

## Quadtree/Ennetree Options

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
