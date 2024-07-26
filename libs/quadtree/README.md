# `@4bitlabs/quadtree` [![License][license]][npm] [![NPM Version][version]][npm] [![NPM Downloads][dl]][npm]

A simple 2D quadtree (2×2 spatial division) for fast, efficient spatial queries.

![Quadtree split illustration][quadtree-split-img]

## Installing

```shell
$ npm install --save @4bitlabs/quadtree
```

```shell
$ yarn add @4bitlabs/quadtree
```

```shell
$ pnpm add @4bitlabs/quadtree
```

## Documentation

Full documentation for the library can be found [here](https://32bitkid.github.io/4bitlabs.spatial/modules/_4bitlabs_quadtree.html)

## Usage

An _easy_ way to use this within a browser is to use the built-in `DOMRect` class, consider:

```ts
import { quadtree, type Bounds } from '@4bitlabs/quadtree';

const rectBounds = (r: DOMRect) => [r.left, r.top, r.right, r.bottom];

const space = quadtree<DOMRect>([0, 0, 1000, 1000], rectBounds);
space.insert(new DOMRect(25, 25, 50, 50));

const matches = space.search([20, 20, 80, 80]);
```

Or with custom objects:

```ts
import { quadtree, type Bounds } from '@4bitlabs/quadtree';

class Shape {
  bounds(): Bounds {
    /* TODO implement return bounds */
    return [0, 0, 0, 0];
  }
}

const space = quadtree<Shape>([0, 0, 1000, 1000], Shape.prototype.bounds);
space.insert(new Shape());
const matches = space.search([20, 20, 80, 80]);
```

## Options

`quadtree()` accept a third argument of `options`:

| option        | Description                                                  | Defaults |
| ------------- | :----------------------------------------------------------- | -------- |
| `maxDepth`    | The maximum depth/subdivisions that the graph will divide.   | `7`      |
| `maxChildren` | The maximum number of objects in a node before it will split | `10`     |

```ts
const space = quadtree<DOMRect>([0, 0, 1000, 1000], rectBounds, {
  maxDepth: 5,
  maxChildren: 50,
});
```

## License

[ISC](https://github.com/32bitkid/4bitlabs.spatial/blob/HEAD/libs/vector/LICENSE.txt)

[quadtree]: https://en.wikipedia.org/wiki/Quadtree
[npm]: https://www.npmjs.com/package/@4bitlabs/quadtree
[version]: https://img.shields.io/npm/v/%404bitlabs%2Fquadtree
[license]: https://img.shields.io/npm/l/%404bitlabs%2Fquadtree
[dl]: https://img.shields.io/npm/dy/%404bitlabs%2Fquadtree
[quadtree-split-img]: https://github.com/32bitkid/4bitlabs.spatial/blob/main/quadtree-split.png?raw=true
