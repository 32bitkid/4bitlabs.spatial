import { quadtree } from '@4bitlabs/quadtree';
import { ennetree } from '@4bitlabs/ennetree';
import type { Rect, Bounds } from './helpers/geom';
import { randRect } from './helpers/rand-rect';
import { LinearBaseline } from './helpers/linear-baseline';
import { sfc32 } from './helpers/rand';

const boundsFn = ({ x, y, w, h }: Rect): Bounds => [x, y, x + w, y + h];

const rand = sfc32([0x41a1322b, 0xc9204145, 0x43a617d1, 0x2c947fba]).float;

async function runBench(count: number) {
  const linear = new LinearBaseline(boundsFn);
  const qt = quadtree<Rect>([0, 0, 1_000_000, 1_000_000], boundsFn);
  const et = ennetree<Rect>([0, 0, 1_000_000, 1_000_000], boundsFn);

  for (let i = 0; i < count; i++) {
    const r = randRect([1_000_000, 1_000_000], [500, 500]);
    linear.insert(r);
    qt.insert(r);
    et.insert(r);
  }

  const { Bench } = await import('tinybench');
  const benchmark = new Bench();

  const windows = Array.from({ length: 10 }, (): Bounds => {
    // const w = rand() * (1024 * 4) + 512,
    //   h = rand() * (1024 * 4) + 512,
    //   x = rand() * (1_000_000 - w),
    //   y = rand() * (1_000_000 - h);

    const w = rand() * (1024 * 5) + 512,
      h = rand() * (1024 * 5) + 512,
      x = 500_000 - rand() * w,
      y = 500_000 - rand() * h;
    return [x, y, x + w, w + h];
  });

  console.log();

  benchmark
    .add(`linear (${count.toLocaleString()})`, () => {
      windows.forEach((win) => linear.collect(win));
    })
    .add(`quadtree (${count.toLocaleString()})`, () => {
      windows.forEach((win) => qt.collect(win));
    })
    .add(`nontree (${count.toLocaleString()})`, () => {
      windows.forEach((win) => et.collect(win));
    });

  console.log('warming up…');
  await benchmark.warmup();
  console.log('running');
  await benchmark.run();
  console.table(benchmark.table());
}

async function runSuite() {
  runBench(250_000);
}

runSuite().catch((err) => console.error(err));
