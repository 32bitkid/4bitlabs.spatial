import { type Bounds } from './bounds';
import { ennetree } from './factory';

describe('nontree', () => {
  it('should do something', () => {
    const area = [0, 0, 90, 90] as const;
    const space = ennetree<Bounds>(area, (it) => it);
    space.insert([10, 10, 20, 20]);
    space.insert([60, 10, 70, 20]);
    space.insert([10, 60, 20, 70]);
    space.insert([60, 60, 70, 70]);

    const result = space.collect([10, 10, 40, 40]);
    expect(result).toStrictEqual([[10, 10, 20, 20]]);
  });

  it('should return objects', () => {
    const area = [0, 0, 100, 100] as const;

    type Rect = {
      x: number;
      y: number;
      w: number;
      h: number;
      color: string;
    };

    const boundsOfRect = (r: Rect): Bounds => {
      return [r.x, r.y, r.x + r.w, r.y + r.h];
    };

    const space = ennetree<Rect>(area, boundsOfRect);
    const r1: Rect = { x: 10, y: 10, h: 10, w: 10, color: 'red' };
    const r2: Rect = { x: 60, y: 10, h: 10, w: 10, color: 'green' };
    const r3: Rect = { x: 10, y: 60, h: 10, w: 10, color: 'blue' };
    const r4: Rect = { x: 60, y: 60, h: 10, w: 10, color: 'orange' };

    space.insert(r1);
    space.insert(r2);
    space.insert(r3);
    space.insert(r4);

    const results = space.collect([10, 10, 40, 40]);
    expect(results).toHaveLength(1);
    expect(results[0]).toBe(r1);
  });

  it('should handle a class method', () => {
    class Item {
      private readonly x: number;
      private readonly y: number;
      private readonly w: number;
      private readonly h: number;

      constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.w = width;
        this.h = height;
      }
      bounds(): Bounds {
        const { x, y, w, h } = this;
        return [x, y, x + w, y + h];
      }
    }

    const space = ennetree([0, 0, 1000, 1000], Item.prototype.bounds);
    space.insert(new Item(10, 10, 40, 40));
    space.insert(new Item(150, 150, 10, 10));
    expect(space.collect([0, 0, 100, 100]).length).toBe(1);
    expect(space.collect([100, 100, 200, 200]).length).toBe(1);
    expect(space.collect([200, 200, 300, 300]).length).toBe(0);
  });
});
