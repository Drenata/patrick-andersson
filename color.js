class Color {
  constructor(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  static linearInterpolate(fromColor, toColor, x) {
    return new Color(
      Math.floor(linearInterpolate(fromColor.r, toColor.r, x)),
      Math.floor(linearInterpolate(fromColor.g, toColor.g, x)),
      Math.floor(linearInterpolate(fromColor.b, toColor.b, x)),
      linearInterpolate(fromColor.a, toColor.a, x)
    )
  }

  toString() {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }

}