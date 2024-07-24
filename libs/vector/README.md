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

Also included is `BigVector` for usage with `int64` and `uint64` sized integers:

```ts
import { BigVector } from '@4bitlabs/vector/dist';

const uint64s = new BigVector(BigUint64Array);
uint64s.push(0xffff_ffff_ffff_ffffn);
```
