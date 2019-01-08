import { linearInterpolate } from './util';

export class Color {
  r: number;
  g: number;
  b: number;
  a: number;

  constructor(r: number, g: number, b: number, a: number) {
    this.r = Math.floor(r);
    this.g = Math.floor(g);
    this.b = Math.floor(b);
    this.a = a;
  }

  static linearInterpolate(fromColor: Color, toColor: Color, x: number) {
    return new Color(
      Math.floor(linearInterpolate(fromColor.r, toColor.r, x)),
      Math.floor(linearInterpolate(fromColor.g, toColor.g, x)),
      Math.floor(linearInterpolate(fromColor.b, toColor.b, x)),
      linearInterpolate(fromColor.a, toColor.a, x)
    )
  }

  toString(): string {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }

}