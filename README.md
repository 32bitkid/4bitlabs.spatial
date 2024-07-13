# `@4bitlabs/quadtree` and `@4bitlabs/ennetree` 

This repository contains TypeScript implementations for a [**quadtree**][quadtree] and **ennetree**. 

## [Quadtree](./libs/quadtree/README.md)

<img alt="Quadtree split illustration" src="data:image/*;base64,iVBORw0KGgoAAAANSUhEUgAAAh0AAAD4BAMAAAC6WEnMAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAwUExURf///9TU1Jqbml9dW62trcS+wAcHB/Xy8v8rDm5sat7d3BE3//92dBCRDHmB/7SJXSrq9yIAAAWaSURBVHja7d0/axRBGMfxPS/HaYzJFiJCmiNIaiH2CrlWCCFvwATW9jAW9im8wkJikTYQEEFSWxxISl+AYHVwvU1egpE7788yu84zz7OZjX6Ha25h9oYP3mN+PDO3ScJgMBgMRhWj1d3rdu9Heu11e4aL2esqp/9eTPN4d2Mj2mszXfBQLmbzWL+YZhrzX2fu05WLsZiOBx54+E+/E9Uj9+nKxVhMX+7F9Mh9unIxFtP5vlA/8MADDzzwwAMPPPAgz5HnyHPUDzzwwAMPPPDAAw888CDPkefIc9QPPPDAAw888MADDzzwIM+R58hz1A88YnnY1l+lx9ppdI/NlzXy2D6J7dHKDurj0dh6GtvjY5a9r43H2dHRZWSPZpbt1MZjbWsrjezRzvbr831pf3gSvZ4+eFyjenp2Gd2j1auRR6NHniPPkefIL3jggQceeOCBBx544EGeI8+R56gfeOCBBx544IEHHniQ58hz5DnqBx54mHpIK1qlHrdOo3tId2NW6vH8R2yPJeluzCo9GsNhL7KHeDdmlR7nw+GzyB6H0t2YVXrcGw7TyB7i3ZhVerSH36PXU+luzErr6Xknuod0N2alHo2QxZDnyHPkOfILHtV6iGpTcCHz9Fg7FdxNGuP8PETJLPhQnadH7pxc+d2kMc7LQ3ROLvxQnZ9H/pxc6d2uYlwFHqJkFn6ozs8jf06u9G5XMa5j7yE6Jxd+qM7PI39OrvRu4hjn5SFKZuGH6vw88ufkSu8mjnF+9VSUzIIP1XnW07NLwd3OO1V4iJJZ8KE6Tw/PZDae3lAthjxHniPPkV/w+Mc8lvFY+PRbL/C4+vTXfx7nvZudJM1HqgeCbyun18Hj1fRx3lmW8jzxue9Ltt/j+zLncZBSP+Y9OtRT9luS58hz/L2OBx7GxcvWYzWN7mHyQ5dWHj+/xPaw+aFLI4/WYBDbw+aHLo08Pg8Go8geNj90aeRxdzDYiexh80OXRh7twdfo9dTkhy6t6un6KLqHyQ9dWnmMF0OeI8+R58gveOCBBx544IEHHnj8vx7kOfIceY76gQceeOCBBx544IEHeY48R56jfuCBRxWlyqdWhnmspmKPlbTsrdwjYHdlborzDmEe492VIo9vb8veij2W5Lsrc1PcdwjymOyulHi0+v1e8Vu5R8DuytwU9x2CPCa7KyUen/r9i+K3co9D+e7K3BT3HYI8JrsrJR63+/2d4rdyj4Ddlbkp7jsEeUx2V0o82v13JW8D6mnA7srcFOcdwurp+khcTx9elL2VewTsrsxNcd4hzKNoMSXTvRdDniPPkefIL3hck0cVNW56Ueqxmqo8nDFuJRV5KM/JOadPL0o9ipKc53RnjJte9PJQnpNzTp9dFHoUJjnP6a4YN7vo5aE8J+ecPrso9ChMcn7TnTFudtHLQ3lOzjl9dlHoUZjk/Ka/ccW42UUvD+U5Oef02UWhR2GS85zuinGzi371VHlOzjl9elFaT9dHqnrqjHHTi34eynNyzunTi1KP8sWETV9cDHmOPEeeI7/gccM8DPtzeg91f04/DPtzeg9tf04/DPtzeg91f04/DPtzeg91f04/DPtzeg91f04/DPtzeg99f04/DPtz+nqq7s/ph2F/Tu9Bf448R54jv+Bxoz2KClxwf07jsZL+5Xr1HkW9veD+nMbDmeESaX9O9SdHQW8vuD+n8XBnOHF/zj7DKfpzGg93hhP351TrK+jtBffnNB7O5lwi7s/ZZzhFf07j4c5w8v6ceYZLFP05TT11ZrhE3J8zz3CJoj+n8fBbDHmOPEeeI7/gQX8u3IP+nEe2oz8X0YP+3OKgP+eT7ejP1aOe0p/zXQx5jjxHniO/4IEHHtfgoXoGt/I1foT33IriP0+8taF6Brf2tfg/ZK0Ww2AwGAyG1fgFZwJ4xWcUQroAAAAASUVORK5CYII=">

```ts
import { quadtree } from "@4bitlabs/quadtree";

interface Entity {
  /* whatever you like */
}

type Bounds = [
  left: number, 
  top: number, 
  right: number, 
  bottom: number,
];

function getBounds(it: Entity): Bounds {
  /* determine bounds for entity, specified in  */
}

const space = quadtree<Entity>([0, 0, 1000, 1000], Entity.prototype.getBounds);
```


## [Ennetree](./libs/ennetree/README.md)

Similar to a [**quadtree**][quadtree] but instead of *binary* recursive subdivisions, an **ennetree** uses trinary (3&times;3) subdivisions.

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

Both `quadtree()` and `ennetree()` accept a third argument of `options`:

| option        | Description                                                  | Defaults                       |
|---------------|:-------------------------------------------------------------|--------------------------------|
| `maxDepth`    | The maximum depth/subdivisions that the graph will divide.   | quadtree = `7`, ennetree = `4` |
| `maxChildren` | The maximum number of objects in a node before it will split | quadtree,ennetree = `10`       | 

```ts
const space = quadtree<Entity>(
  [0, 0, 1000, 1000], 
  Entity.prototype.getBounds,
  { maxDepth: 5, maxChildren: 50 }
);
```


[quadtree]: https://en.wikipedia.org/wiki/Quadtree