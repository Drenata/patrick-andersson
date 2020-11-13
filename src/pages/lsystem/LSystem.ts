import { Line } from "three";
import { TurtleCommands, TurtleGraphics } from "./turtle";

export interface ProductionRules {
    [symbol: string]: string;
}

export class LSystem {
    grammar: ProductionRules;
    turtleCommands: TurtleCommands;
    axiom: string;
    currentRecursion: string;

    constructor(grammar: ProductionRules, axiom: string, turtleCommands: TurtleCommands) {
        this.grammar = grammar;
        this.turtleCommands = turtleCommands;
        this.axiom = axiom;
        this.currentRecursion = this.axiom;
    }

    evolveTo(n: number) {
        this.currentRecursion = this.axiom;
        for (let i = 0; i < n; i++) {
            this.produce();
        }
    }

    /**
     * Apply production rules to current recursion
     * and update the current recursion
     */
    produce() {
        let nextRecursion = "";
        for (const symbol of this.currentRecursion) {
            const product = this.grammar[symbol];
            nextRecursion += product;
        }
        this.currentRecursion = nextRecursion;
    }

    getLine(): Line {
        return TurtleGraphics.getLine(this.currentRecursion, this.turtleCommands);
    }

}
