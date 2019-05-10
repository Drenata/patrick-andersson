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

export const examples: {
  name: string;
  alphabet: string[];
  productionRules: IProductionRules;
  axiom: string;
  visualization: ITurtleCommands;
}[] = [
    {
      name: "Fractal (binary) tree",
      alphabet: ['0', '1', '[', ']'],
      productionRules: {
        '0': '1[0]0',
        '1': '11',
        '[': '[',
        ']': ']'
      },
      axiom: '0',
      visualization: {
        '0': [{ command: TurtleCommandTypes.MOVE, argument: '1' }],
        '1': [{ command: TurtleCommandTypes.MOVE, argument: '1' }],
        '[': [
          { command: TurtleCommandTypes.PUSH, argument: '' },
          { command: TurtleCommandTypes.ROTATE, argument: '45' }
        ],
        ']': [
          { command: TurtleCommandTypes.POP, argument: '' },
          { command: TurtleCommandTypes.ROTATE, argument: '-45' }
        ],
      }
    },
    {
      name: "Koch snowflake",
      alphabet: ['F', '+', '-'],
      productionRules: {
        'F': 'F+F--F+F',
        '+': '+',
        '-': '-',
      },
      axiom: 'F--F--F',
      visualization: {
        'F': [{ command: TurtleCommandTypes.MOVE, argument: '1' }],
        '+': [{ command: TurtleCommandTypes.ROTATE, argument: '60' }],
        '-': [{ command: TurtleCommandTypes.ROTATE, argument: '-60' }],
      }
    },
    {
      name: "Koch curve",
      alphabet: ['F', '+', '-'],
      productionRules: {
        'F': 'F+F-F-F+F',
        '+': '+',
        '-': '-',
      },
      axiom: 'F',
      visualization: {
        'F': [{ command: TurtleCommandTypes.MOVE, argument: '1' }],
        '+': [{ command: TurtleCommandTypes.ROTATE, argument: '90' }],
        '-': [{ command: TurtleCommandTypes.ROTATE, argument: '-90' }],
      }
    },
    {
      name: "Cesàro fractal",
      alphabet: ['F', '+', '-'],
      productionRules: {
        'F': 'F+F--F+F',
        '+': '+',
        '-': '-',
      },
      axiom: 'F--F',
      visualization: {
        'F': [{ command: TurtleCommandTypes.MOVE, argument: '1' }],
        '+': [{ command: TurtleCommandTypes.ROTATE, argument: '85' }],
        '-': [{ command: TurtleCommandTypes.ROTATE, argument: '-85' }],
      }
    },
    {
      name: "Sierpinski triangle",
      alphabet: ['F', 'G', '+', '-', 'R'],
      productionRules: {
        'F': 'F-G+F+G-F',
        'G': 'GG',
        '+': '+',
        '-': '-',
        'R': 'R'
      },
      axiom: 'RF-G-G',
      visualization: {
        'F': [{ command: TurtleCommandTypes.MOVE, argument: '1' }],
        'G': [{ command: TurtleCommandTypes.MOVE, argument: '1' }],
        '+': [{ command: TurtleCommandTypes.ROTATE, argument: '120' }],
        '-': [{ command: TurtleCommandTypes.ROTATE, argument: '-120' }],
        'R': [{ command: TurtleCommandTypes.ROTATE, argument: '-30' }],
      }
    },
    {
      name: "Sierpinski triangle (approx)",
      alphabet: ['A', 'B', '+', '-'],
      productionRules: {
        'A': 'B-A-B',
        'B': 'A+B+A',
        '+': '+',
        '-': '-',
      },
      axiom: 'A',
      visualization: {
        'A': [{ command: TurtleCommandTypes.MOVE, argument: '1' }],
        'B': [{ command: TurtleCommandTypes.MOVE, argument: '1' }],
        '+': [{ command: TurtleCommandTypes.ROTATE, argument: '60' }],
        '-': [{ command: TurtleCommandTypes.ROTATE, argument: '-60' }],
      }
    },
    {
      name: "Gosper curve",
      alphabet: ['A', 'B', '+', '-'],
      productionRules: {
        'A': 'A-B--B+A++AA+B-',
        'B': '+A-BB--B-A++A+B',
        '+': '+',
        '-': '-',
      },
      axiom: 'A',
      visualization: {
        'A': [{ command: TurtleCommandTypes.MOVE, argument: '1' }],
        'B': [{ command: TurtleCommandTypes.MOVE, argument: '1' }],
        '+': [{ command: TurtleCommandTypes.ROTATE, argument: '60' }],
        '-': [{ command: TurtleCommandTypes.ROTATE, argument: '-60' }],
      }
    },
    {
      name: "Dragon curve",
      alphabet: ['X', 'Y', 'F', '+', '-'],
      productionRules: {
        'X': 'X+YF+',
        'Y': '-FX-Y',
        'F': 'F',
        '+': '+',
        '-': '-',
      },
      axiom: 'FX',
      visualization: {
        'X': [{ command: TurtleCommandTypes.MOVE, argument: '0' }],
        'Y': [{ command: TurtleCommandTypes.MOVE, argument: '0' }],
        'F': [{ command: TurtleCommandTypes.MOVE, argument: '1' }],
        '+': [{ command: TurtleCommandTypes.ROTATE, argument: '90' }],
        '-': [{ command: TurtleCommandTypes.ROTATE, argument: '-90' }],
      }
    },
    {
      name: "Lévy C curve",
      alphabet: ['F', '+', '-'],
      productionRules: {
        'F': '+F--F+',
        '+': '+',
        '-': '-',
      },
      axiom: 'F',
      visualization: {
        'F': [{ command: TurtleCommandTypes.MOVE, argument: '1' }],
        '+': [{ command: TurtleCommandTypes.ROTATE, argument: '45' }],
        '-': [{ command: TurtleCommandTypes.ROTATE, argument: '-45' }],
      }
    },
    {
      name: "Fractal plant",
      alphabet: ['X', 'F', '+', '-', '[', ']'],
      productionRules: {
        'X': 'F+[[X]-X]-F[-FX]+X',
        'F': 'FF',
        '+': '+',
        '-': '-',
        '[': '[',
        ']': ']',
      },
      axiom: 'X',
      visualization: {
        'F': [{ command: TurtleCommandTypes.MOVE, argument: '1' }],
        'X': [{ command: TurtleCommandTypes.MOVE, argument: '0' }],
        '+': [{ command: TurtleCommandTypes.ROTATE, argument: '25' }],
        '-': [{ command: TurtleCommandTypes.ROTATE, argument: '-25' }],
        '[': [{ command: TurtleCommandTypes.PUSH, argument: '' }],
        ']': [{ command: TurtleCommandTypes.POP, argument: '' }],
      }
    }
  ];