/**
 * Maps a continously growing value onto a fixed interval
 */
class Interval {
  constructor(a, b, displacement) {
    this.a = a;
    this.b = b;
    this.intervalLength = b - a;
    this.displacement = displacement;
  }

  sample(t) {
    return ((t + this.displacement) % this.intervalLength) + this.a;
  }

  static sample(t, a, b, displacement) {
    return ((t + displacement) % (b - a)) + a;
  }

  static sampleReverse(t, a, b, displacement) {
    return b - this.sample(t, a, b, displacement);
  }

}

/**
 * @param a
 * @param b
 * @param x [0, 1]
 */
function linearInterpolate(a, b, x) {
  return a + (b - a) * x;
}