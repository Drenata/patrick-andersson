import { Line } from "three";
import { CompiledTurtleCommandMap, TurtleCommandMap, TurtleGraphics } from "./turtle";

export interface ProductionRules {
    [symbol: string]: string;
}

export class LSystem {
    private axiom: number[];
    private currentRecursion: Uint8Array;
    private compiledTurtleCommandMap: CompiledTurtleCommandMap;
    private compiledSymbolMap: { [char: string]: number };
    private compiledProductionRules: { [key: number]: number[] };

    constructor(grammar: ProductionRules, axiom: string, turtleCommands: TurtleCommandMap) {
        this.compiledSymbolMap = Object.fromEntries(Object.keys(grammar).map((symbol, i) => [symbol, i]));

        if (Object.keys(this.compiledSymbolMap).length > 255) throw new Error("Only 255 symbols supported");

        this.compiledTurtleCommandMap = Object.fromEntries(
            Object.entries(turtleCommands).map(([symbol, commands]) => [this.compiledSymbolMap[symbol], commands])
        );

        this.axiom = axiom.split("").map((v) => this.compiledSymbolMap[v]);

        this.compiledProductionRules = Object.fromEntries(
            Object.entries(grammar).map(([symbol, product]) => [
                this.compiledSymbolMap[symbol],
                product.split("").map((symbol) => this.compiledSymbolMap[symbol]),
            ])
        );

        this.currentRecursion = new Uint8Array(this.axiom);
    }

    evolveTo(n: number) {
        this.currentRecursion = new Uint8Array(this.axiom);
        for (let i = 0; i < n; i++) {
            this.produce();
        }
    }

    /**
     * Apply production rules to current recursion
     * and update the current recursion
     */
    produce() {
        const nextRecursion = new Uint8Array(2 ** 30);
        let nextRecursionLength = 0;

        for (let i = 0; i < this.currentRecursion.length; i++) {
            const product = this.compiledProductionRules[this.currentRecursion[i]];

            for (const symbol of product) {
                nextRecursion[nextRecursionLength++] = symbol;
            }
        }

        this.currentRecursion = nextRecursion.slice(0, nextRecursionLength);
    }

    getLine(): Line[] {
        return TurtleGraphics.getLine(this.currentRecursion, this.compiledTurtleCommandMap);
    }
}
