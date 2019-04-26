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

  static componentToHex(c: number) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  static rgbToHex(r: number, g: number, b: number) {
    return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
  }

  static hexToRgb(hex: string): [number, number, number] {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) throw "Invalid hex " + hex;
    return [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ];
  }

  toString(): string {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }

}