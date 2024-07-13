# `@4bitlabs/ennetree` [![License][license]][npm] [![NPM Version][version]][npm] [![NPM Downloads][dl]][npm]

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

Similar to a [**quadtree**][quadtree], but instead of *binary* recursive subdivisions, an **ennetree** uses trinary (3&times;3) subdivisions.

<img alt="Ennetree Illustration" src="data:image/*;base64,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">

Depending on the use-case, this can sometimes yield _more_ efficient spatial queries.

```ts
import { ennetree } from "@4bitlabs/ennetree";

interface Entity {
  /* whatever you like */
}

type Bounds = [
  left: number,
  top: number,
  right: number,
  bottom: number,
];

function getBounds(it: Entity): [x0: number, y0: number, x1: number, y1: number] {
  /* determine bounds for entity */
}

const space = ennetree<Entity>([0, 0, 1000, 1000], Entity.prototype.getBounds)
```

## Options

`ennetree()` accept a third argument of `options`:

| option        | Description                                                  | Defaults |
|---------------|:-------------------------------------------------------------|----------|
| `maxDepth`    | The maximum depth/subdivisions that the graph will divide.   | `4`      |
| `maxChildren` | The maximum number of objects in a node before it will split | `10`     | 

```ts
const space = ennetree<Entity>(
  [0, 0, 1000, 1000], 
  Entity.prototype.getBounds,
  { maxDepth: 5, maxChildren: 50 }
);
```


[quadtree]: https://en.wikipedia.org/wiki/Quadtree
[npm]: https://www.npmjs.com/package/@4bitlabs/ennetree
[version]: https://img.shields.io/npm/v/%404bitlabs%2Fennetree
[license]: https://img.shields.io/npm/l/%404bitlabs%2Fennetree
[dl]: https://img.shields.io/npm/dy/%404bitlabs%2Fennetree
