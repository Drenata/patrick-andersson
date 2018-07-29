import { Line } from 'three';
import { TurtleGraphics } from './turtle';

export class LSystem {
  grammar: any;
  turtleCommands: any;
  axiom: string;
  currentRecursion: string;
  turtle: TurtleGraphics;

  constructor() {
    this.grammar = {
      '0': '1[0]0',
      '1': '11',
      '[': '[',
      ']': ']'
    };
    this.turtleCommands = {
      '0': (turtle: TurtleGraphics) => {
        turtle.move(1);
      },
      '1': (turtle: TurtleGraphics) => {
        turtle.move(1);
      },
      '[': (turtle: TurtleGraphics) => {
        turtle.pushState();
        turtle.rotate(Math.PI * .25);
      },
      ']': (turtle: TurtleGraphics) => {
        turtle.popState();
        turtle.rotate(Math.PI * -.25);
      }
    };
    this.axiom = '0';
    this.currentRecursion = this.axiom;
  }

  evolveTo(n: number) {
    this.currentRecursion = this.axiom;
    for (let i = 0; i < n; i++) {
      this.produce();
      console.log(this.currentRecursion.length);
    }
  }

  /**
   * Apply production rules to current recursion
   * and update the current recursion
   */
  produce() {
    let nextRecursion = '';
    for (let i = 0; i < this.currentRecursion.length; i++) {
      const symbol = this.currentRecursion[i];
      const product = this.grammar[symbol];
      nextRecursion += product;
    }
    this.currentRecursion = nextRecursion;
  }

  getLine(): Line {
    return TurtleGraphics.getLine(this.currentRecursion, this.turtleCommands);
  }

}