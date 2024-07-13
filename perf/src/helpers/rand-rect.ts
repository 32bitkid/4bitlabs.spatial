import { sfc32 } from './rand';
import type { Rect } from './geom';

const rand = sfc32([0x41a1322b, 0xc9204145, 0x43a617d1, 0x2c947fba]).float;

export const randRect = (
  [ww, wh]: [number, number],
  [ow, oh]: [number, number],
): Rect => {
  return {
    x: rand() * (ww - ow * 2) + ow,
    y: rand() * (wh - oh * 2) + oh,
    w: rand() * ow,
    h: rand() * oh,
  };
};
