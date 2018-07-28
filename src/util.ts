/**
 * Maps a continously growing value onto a fixed interval
 */
export class Interval {
  a: number;
  b: number;
  intervalLength: number;
  displacement: number;

  constructor(a: number, b: number, displacement: number) {
    this.a = a;
    this.b = b;
    this.intervalLength = b - a;
    this.displacement = displacement;
  }

  sample(t: number): number {
    return ((t + this.displacement) % this.intervalLength) + this.a;
  }

  static sample(t: number, a: number, b: number, displacement: number): number {
    return ((t + displacement) % (b - a)) + a;
  }

  static sampleReverse(t: number, a: number, b: number, displacement: number): number {
    return b - this.sample(t, a, b, displacement);
  }

}

/**
 * @param a
 * @param b
 * @param x [0, 1]
 */
export function linearInterpolate(a: number, b: number, x: number) {
  return a + (b - a) * x;
}