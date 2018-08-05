import { Line } from 'three';
import { ITurtleCommands, TurtleCommandTypes, TurtleGraphics } from './turtle';


export interface IProductionRules {
  [symbol: string]: string;
}

export class LSystem {
  grammar: IProductionRules;
  turtleCommands: ITurtleCommands;
  axiom: string;
  currentRecursion: string;
  turtle: TurtleGraphics;

  constructor(grammar: IProductionRules, axiom: string, turtleCommands: ITurtleCommands) {
    this.grammar = grammar;
    this.turtleCommands = turtleCommands;
    this.axiom = axiom;
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

export function createExample(example: number): [string[], IProductionRules, string, ITurtleCommands] {
  switch (example) {
    case 1:
      return [
        ['F', '+', '-'],
        {
          'F': 'F+F-F-F+F',
          '+': '+',
          '-': '-',
        },
        'F',{
          'F': [{command: TurtleCommandTypes.MOVE, argument: '1'}],
          '+': [{command: TurtleCommandTypes.ROTATE, argument: '90'}],
          '-': [{command: TurtleCommandTypes.ROTATE, argument: '-90'}],
        }
      ];
    case 2:
      return [
        ['F', 'G', '+', '-'],
        {
          'F': 'F-G+F+G-F',
          'G': 'GG',
          '+': '+',
          '-': '-',
        },
        'F-G-G',{
          'F': [{command: TurtleCommandTypes.MOVE, argument: '1'}],
          'G': [{command: TurtleCommandTypes.MOVE, argument: '1'}],
          '+': [{command: TurtleCommandTypes.ROTATE, argument: '120'}],
          '-': [{command: TurtleCommandTypes.ROTATE, argument: '-120'}],
        }
      ];
    case 3:
      return [
        ['A', 'B', '+', '-'],
        {
          'A': 'B-A-B',
          'B': 'A+B+A',
          '+': '+',
          '-': '-',
        },
        'A',{
          'A': [{command: TurtleCommandTypes.MOVE, argument: '1'}],
          'B': [{command: TurtleCommandTypes.MOVE, argument: '1'}],
          '+': [{command: TurtleCommandTypes.ROTATE, argument: '60'}],
          '-': [{command: TurtleCommandTypes.ROTATE, argument: '-60'}],
        }
      ];
    case 4:
      return [
        ['X', 'Y', 'F', '+', '-'],
        {
          'X': 'X+YF+',
          'Y': '-FX-Y',
          'F': 'F',
          '+': '+',
          '-': '-',
        },
        'FX',{
          'X': [{command: TurtleCommandTypes.MOVE, argument: '0'}],
          'Y': [{command: TurtleCommandTypes.MOVE, argument: '0'}],
          'F': [{command: TurtleCommandTypes.MOVE, argument: '1'}],
          '+': [{command: TurtleCommandTypes.ROTATE, argument: '90'}],
          '-': [{command: TurtleCommandTypes.ROTATE, argument: '-90'}],
        }
      ];
    case 5:
      return [
        ['F', '+', '-'],
        {
          'F': '+F--F+',
          '+': '+',
          '-': '-',
        },
        'F',{
          'F': [{command: TurtleCommandTypes.MOVE, argument: '1'}],
          '+': [{command: TurtleCommandTypes.ROTATE, argument: '45'}],
          '-': [{command: TurtleCommandTypes.ROTATE, argument: '-45'}],
        }
      ];
    case 6:
      return [
        ['X', 'F', '+', '-', '[', ']'],
        {
          'X': 'F+[[X]-X]-F[-FX]+X',
          'F': 'FF',
          '+': '+',
          '-': '-',
          '[': '[',
          ']': ']',
        },
        'X',{
          'F': [{command: TurtleCommandTypes.MOVE, argument: '1'}],
          'X': [{command: TurtleCommandTypes.MOVE, argument: '0'}],
          '+': [{command: TurtleCommandTypes.ROTATE, argument: '25'}],
          '-': [{command: TurtleCommandTypes.ROTATE, argument: '-25'}],
          '[': [{command: TurtleCommandTypes.PUSH, argument: ''}],
          ']': [{command: TurtleCommandTypes.POP, argument: ''}],
        }
      ];
    default:
      return [
        ['0', '1', '[', ']'],
        {
          '0': '1[0]0',
          '1': '11',
          '[': '[',
          ']': ']'
        },
        '0',{
          '0': [{command: TurtleCommandTypes.MOVE, argument: '1'}],
          '1': [{command: TurtleCommandTypes.MOVE, argument: '1'}],
          '[': [
            {command: TurtleCommandTypes.PUSH, argument: ''},
            {command: TurtleCommandTypes.ROTATE, argument: '45'}
          ],
          ']': [
            {command: TurtleCommandTypes.POP, argument: ''},
            {command: TurtleCommandTypes.ROTATE, argument: '-45'}
          ],
        }
      ];
  }
}