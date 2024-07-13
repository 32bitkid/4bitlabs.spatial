# `@4bitlabs/quadtree` [![License][license]][npm] [![NPM Version][version]][npm] [![NPM Downloads][dl]][npm]

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

<img alt="Quadtree split illustration" src="data:image/*;base64,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">

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
