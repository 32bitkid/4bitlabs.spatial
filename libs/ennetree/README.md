# `@4bitlabs/ennetree` [![License][license]][npm] [![NPM Version][version]][npm] [![NPM Downloads][dl]][npm]

A simple 2D ennetree (3×3 spatial division) for fast, efficient spatial queries.

![Ennetree split illustration][ennetree-split-img]

## Installing

```shell
$ npm install --save @4bitlabs/ennetree
```

```shell
$ yarn add @4bitlabs/ennetree
```

```shell
$ pnpm add @4bitlabs/ennetree
```

## Documentation

Full documentation for the library can be found [here](https://32bitkid.github.io/4bitlabs.spatial/modules/_4bitlabs_ennetree.html)

## Usage

Similar to a [**quadtree**][quadtree], but instead of _binary_ recursive subdivisions, an **ennetree** uses trinary (3&times;3) subdivisions. Depending on the use-case, this can sometimes yield _more_ efficient spatial queries.

An _easy_ way to use this within a browser is to use the built-in `DOMRect` class, consider:

```ts
import { ennetree, type Bounds } from '@4bitlabs/ennetree';

const rectBounds = (r: DOMRect) => [r.left, r.top, r.right, r.bottom];

const space = ennetree<DOMRect>([0, 0, 1000, 1000], rectBounds);
space.insert(new DOMRect(25, 25, 50, 50));

const matches = space.search([20, 20, 80, 80]);
```

Or with custom objects:

```ts
import { ennetree, type Bounds } from '@4bitlabs/ennetree';

class Shape {
  bounds(): Bounds {
    /* TODO implement return bounds */
    return [0, 0, 0, 0];
  }
}

const space = ennetree<Shape>([0, 0, 1000, 1000], Shape.prototype.bounds);
space.insert(new Shape());
const matches = space.search([20, 20, 80, 80]);
```

## Options

`ennetree()` accept a third argument of `options`:

| option        | Description                                                  | Defaults |
| ------------- | :----------------------------------------------------------- | -------- |
| `maxDepth`    | The maximum depth/subdivisions that the graph will divide.   | `4`      |
| `maxChildren` | The maximum number of objects in a node before it will split | `10`     |

```ts
const space = ennetree<DOMRect>([0, 0, 1000, 1000], rectBounds, {
  maxDepth: 5,
  maxChildren: 50,
});
```

## License

[ISC](https://github.com/32bitkid/4bitlabs.spatial/blob/HEAD/libs/ennetree/LICENSE.txt)

[quadtree]: https://en.wikipedia.org/wiki/Quadtree
[npm]: https://www.npmjs.com/package/@4bitlabs/ennetree
[version]: https://img.shields.io/npm/v/%404bitlabs%2Fennetree
[license]: https://img.shields.io/npm/l/%404bitlabs%2Fennetree
[dl]: https://img.shields.io/npm/dy/%404bitlabs%2Fennetree
[ennetree-split-img]: https://github.com/32bitkid/4bitlabs.spatial/blob/main/ennetree-split.png?raw=true
