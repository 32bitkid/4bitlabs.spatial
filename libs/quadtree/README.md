# `@4bitlabs/quadtree` [![License][license]][npm] [![NPM Version][version]][npm] [![NPM Downloads][dl]][npm]

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

## Usage

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

## Options

`quadtree()` accept a third argument of `options`:

| option        | Description                                                  | Defaults |
| ------------- | :----------------------------------------------------------- | -------- |
| `maxDepth`    | The maximum depth/subdivisions that the graph will divide.   | `7`      |
| `maxChildren` | The maximum number of objects in a node before it will split | `10`     |

```ts
const space = quadtree<Entity>([0, 0, 1000, 1000], Entity.prototype.getBounds, {
  maxDepth: 5,
  maxChildren: 50,
});
```

[quadtree]: https://en.wikipedia.org/wiki/Quadtree
[npm]: https://www.npmjs.com/package/@4bitlabs/quadtree
[version]: https://img.shields.io/npm/v/%404bitlabs%2Fquadtree
[license]: https://img.shields.io/npm/l/%404bitlabs%2Fquadtree
[dl]: https://img.shields.io/npm/dy/%404bitlabs%2Fquadtree
[quadtree-split-img]: https://github.com/32bitkid/4bitlabs.spatial/blob/main/quadtree-split.png?raw=true