export type Rect = { x: number; y: number; w: number; h: number };
export type Bounds = [x0: number, y0: number, x1: number, y1: number];

export const contains = (
  [ax0, ay0, ax1, ay1]: Readonly<Bounds>,
  [bx0, by0, bx1, by1]: Readonly<Bounds>,
): boolean => bx0 >= ax0 && by1 < ay1 && by0 >= ay0 && bx1 < ax1;

export const overlaps = (
  [ax0, ay0, ax1, ay1]: Readonly<Bounds>,
  [bx0, by0, bx1, by1]: Readonly<Bounds>,
): boolean => ax0 < bx1 && ax1 >= bx0 && ay0 < by1 && ay1 >= by0;
