import { BufferAttribute, BufferGeometry, LineBasicMaterial, LineSegments, Path } from 'three';
import { Color } from '../color';

export class TurtleGraphics {
  location: [number, number];
  orientation: number;
  color: Color;
  width: number;
  on: boolean;
  stateStack: [[number, number], number][];
  positions: number[];
  path: Path;

  constructor() {
    this.location = [0, 0];
    this.orientation = 0;
    this.color = new Color(255, 0, 0, 1);
    this.width = 1;
    this.on = true;
    this.stateStack = [];
    this.positions = [];
  }

  move(distance: number) {
    this.positions.push(this.location[0], this.location[1], 0);
    this.location = [
      this.location[0] + Math.cos(this.orientation) * distance,
      this.location[1] + Math.sin(this.orientation) * distance
    ];
    this.positions.push(this.location[0], this.location[1], 0);
  }

  rotate(degrees: number) {
    this.orientation += degrees;
  }

  changeDrawState(enabled: boolean) {
    this.on = enabled;
  }

  pushState() {
    this.stateStack.push([this.location, this.orientation]);
  }

  popState() {
    const state = this.stateStack.pop();
    if (state) {
      this.location = state[0];
      this.orientation = state[1];
    }
  }

  static getLine(command: string, commandMap: any) {
    const turtle = new TurtleGraphics();
    for (let i = 0; i < command.length; i++) {
      const symbol = command[i];
      commandMap[symbol](turtle);
    }

    const geometry = new BufferGeometry().addAttribute("position", new BufferAttribute(new Float32Array(turtle.positions), 3));
    const material = new LineBasicMaterial( { color: 0xffffff } );
    return new LineSegments( geometry, material );
  }
}