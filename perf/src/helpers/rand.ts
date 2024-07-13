export interface RNG {
  int32(): number;
  float(): number;
  int(min: number, max: number): number;
}

export function sfc32([a, b, c, d]: [number, number, number, number]): RNG {
  a >>>= 0;
  b >>>= 0;
  c >>>= 0;
  d >>>= 0;

  const int32 = () => {
    const t = (((a + b) | 0) + d) | 0;
    d = (d + 1) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    c = (c + t) | 0;
    return t >>> 0;
  };

  const float = () => int32() / 4294967296;

  const int = (min: number, max: number) =>
    Math.floor(float() * (max - min + 1) + min);

  return { int32, float, int };
}
