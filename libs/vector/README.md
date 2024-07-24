# `@4bitlabs/vector`

A simple, TypedArray-backed resizable vector data-structure.

## Installing

Using npm:

```shell
$ npm install --save @4bitlabs/vector
```

Using yarn:

```shell
$ yarn add @4bitlabs/vector
```

Using pnpm:

```shell
$ pnpm add @4bitlabs/vector
```

## Usage

```ts
import { Vector } from '@4bitlabs/typed-vector';

/* Create a resizable vector of float64s */
const floats = new Vector(Float64Array, { initialCapacity: 10 });
floats.push(Math.random());
console.log(floats.pop());

/* Create a resizable vector of bytes */
const bytes = new Vector(Uint8ClampedArray, { initialCapacity: 255 });
bytes.push(0x10);
console.log(bytes.pop());
```
