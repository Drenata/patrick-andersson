import * as React from "react";
import { LSystemState } from "./LSystemModal";
import { TurtleCommandTypes } from "./turtle";

interface Example extends LSystemState {
    name: string;
}

export const examples: Example[] = [
    {
        name: "Fractal (binary) tree",
        alphabet: ["0", "1", "[", "]"],
        productionRules: {
            "0": "1[0]0",
            "1": "11",
            "[": "[",
            "]": "]",
        },
        axiom: "0",
        visualization: {
            "0": [{ command: TurtleCommandTypes.MOVE, argument: 1 }],
            "1": [{ command: TurtleCommandTypes.MOVE, argument: 1 }],
            "[": [
                { command: TurtleCommandTypes.PUSH, argument: 0 },
                { command: TurtleCommandTypes.ROTATE, argument: 45 },
            ],
            "]": [
                { command: TurtleCommandTypes.POP, argument: 0 },
                { command: TurtleCommandTypes.ROTATE, argument: -45 },
            ],
        },
    },
    {
        name: "Koch snowflake",
        alphabet: ["F", "+", "-"],
        productionRules: {
            F: "F+F--F+F",
            "+": "+",
            "-": "-",
        },
        axiom: "F--F--F",
        visualization: {
            F: [{ command: TurtleCommandTypes.MOVE, argument: 1 }],
            "+": [{ command: TurtleCommandTypes.ROTATE, argument: 60 }],
            "-": [{ command: TurtleCommandTypes.ROTATE, argument: -60 }],
        },
    },
    {
        name: "Quadratic Koch snowflake",
        alphabet: ["F", "+", "-"],
        productionRules: {
            F: "F+FF-FF-F-F+F+FF-F-F+F+FF+FF-F",
            "+": "+",
            "-": "-",
        },
        axiom: "F-F-F-F",
        visualization: {
            F: [{ command: TurtleCommandTypes.MOVE, argument: 1 }],
            "+": [{ command: TurtleCommandTypes.ROTATE, argument: 90 }],
            "-": [{ command: TurtleCommandTypes.ROTATE, argument: -90 }],
        },
    },
    {
        name: "Koch curve",
        alphabet: ["F", "+", "-"],
        productionRules: {
            F: "F+F-F-F+F",
            "+": "+",
            "-": "-",
        },
        axiom: "F",
        visualization: {
            F: [{ command: TurtleCommandTypes.MOVE, argument: 1 }],
            "+": [{ command: TurtleCommandTypes.ROTATE, argument: 90 }],
            "-": [{ command: TurtleCommandTypes.ROTATE, argument: -90 }],
        },
    },
    {
        name: "Koch curve 1",
        alphabet: ["F", "+", "-"],
        axiom: "F-F-F-F",
        productionRules: {
            F: "FF-F-F-F-F-F+F",
            "+": "+",
            "-": "-",
        },
        visualization: {
            F: [{ command: TurtleCommandTypes.MOVE, argument: 1 }],
            "+": [{ command: TurtleCommandTypes.ROTATE, argument: 90 }],
            "-": [{ command: TurtleCommandTypes.ROTATE, argument: -90 }],
        },
    },
    {
        name: "Koch curve 2",
        alphabet: ["F", "+", "-"],
        axiom: "F-F-F-F",
        productionRules: {
            F: "FF-F-F-F-FF",
            "+": "+",
            "-": "-",
        },
        visualization: {
            F: [{ command: TurtleCommandTypes.MOVE, argument: 1 }],
            "+": [{ command: TurtleCommandTypes.ROTATE, argument: 90 }],
            "-": [{ command: TurtleCommandTypes.ROTATE, argument: -90 }],
        },
    },
    {
        name: "Koch curve 3",
        alphabet: ["F", "+", "-"],
        axiom: "F-F-F-F",
        productionRules: {
            F: "FF-F+F-F-FF",
            "+": "+",
            "-": "-",
        },
        visualization: {
            F: [{ command: TurtleCommandTypes.MOVE, argument: 1 }],
            "+": [{ command: TurtleCommandTypes.ROTATE, argument: 90 }],
            "-": [{ command: TurtleCommandTypes.ROTATE, argument: -90 }],
        },
    },
    {
        name: "Koch curve 4",
        alphabet: ["F", "+", "-"],
        axiom: "F-F-F-F",
        productionRules: {
            F: "FF-F--F-F",
            "+": "+",
            "-": "-",
        },
        visualization: {
            F: [{ command: TurtleCommandTypes.MOVE, argument: 1 }],
            "+": [{ command: TurtleCommandTypes.ROTATE, argument: 90 }],
            "-": [{ command: TurtleCommandTypes.ROTATE, argument: -90 }],
        },
    },
    {
        name: "Koch curve 5",
        alphabet: ["F", "+", "-"],
        axiom: "F-F-F-F",
        productionRules: {
            F: "F-FF-F-F",
            "+": "+",
            "-": "-",
        },
        visualization: {
            F: [{ command: TurtleCommandTypes.MOVE, argument: 1 }],
            "+": [{ command: TurtleCommandTypes.ROTATE, argument: 90 }],
            "-": [{ command: TurtleCommandTypes.ROTATE, argument: -90 }],
        },
    },
    {
        name: "Koch curve 6",
        alphabet: ["F", "+", "-"],
        axiom: "F-F-F-F",
        productionRules: {
            F: "F-F+F-F-F",
            "+": "+",
            "-": "-",
        },
        visualization: {
            F: [{ command: TurtleCommandTypes.MOVE, argument: 1 }],
            "+": [{ command: TurtleCommandTypes.ROTATE, argument: 90 }],
            "-": [{ command: TurtleCommandTypes.ROTATE, argument: -90 }],
        },
    },
    {
        name: "Islands and lakes",
        alphabet: ["F", "f", "+", "-"],
        axiom: "F+F+F+F",
        productionRules: {
            F: "F+f-FF+F+FF+Ff+FF-f+FF-F-FF-Ff-FFF",
            f: "ffffff",
            "+": "+",
            "-": "-",
        },
        visualization: {
            F: [{ command: TurtleCommandTypes.MOVE, argument: 1 }],
            f: [{ command: TurtleCommandTypes.MOVE_WITHOUT_DRAWING, argument: 1 }],
            "+": [{ command: TurtleCommandTypes.ROTATE, argument: 90 }],
            "-": [{ command: TurtleCommandTypes.ROTATE, argument: -90 }],
        },
    },
    {
        name: "Cesàro fractal",
        alphabet: ["F", "+", "-"],
        productionRules: {
            F: "F+F--F+F",
            "+": "+",
            "-": "-",
        },
        axiom: "F--F",
        visualization: {
            F: [{ command: TurtleCommandTypes.MOVE, argument: 1 }],
            "+": [{ command: TurtleCommandTypes.ROTATE, argument: 85 }],
            "-": [{ command: TurtleCommandTypes.ROTATE, argument: -85 }],
        },
    },
    {
        name: "Sierpinski triangle",
        alphabet: ["F", "G", "+", "-", "R"],
        productionRules: {
            F: "F-G+F+G-F",
            G: "GG",
            "+": "+",
            "-": "-",
            R: "R",
        },
        axiom: "RF-G-G",
        visualization: {
            F: [{ command: TurtleCommandTypes.MOVE, argument: 1 }],
            G: [{ command: TurtleCommandTypes.MOVE, argument: 1 }],
            "+": [{ command: TurtleCommandTypes.ROTATE, argument: 120 }],
            "-": [{ command: TurtleCommandTypes.ROTATE, argument: -120 }],
            R: [{ command: TurtleCommandTypes.ROTATE, argument: -30 }],
        },
    },
    {
        name: "Sierpinski triangle (approx)",
        alphabet: ["A", "B", "+", "-"],
        productionRules: {
            A: "B-A-B",
            B: "A+B+A",
            "+": "+",
            "-": "-",
        },
        axiom: "A",
        visualization: {
            A: [{ command: TurtleCommandTypes.MOVE, argument: 1 }],
            B: [{ command: TurtleCommandTypes.MOVE, argument: 1 }],
            "+": [{ command: TurtleCommandTypes.ROTATE, argument: 60 }],
            "-": [{ command: TurtleCommandTypes.ROTATE, argument: -60 }],
        },
    },
    {
        name: "Hexagonal Gosper curve",
        alphabet: ["A", "B", "+", "-"],
        productionRules: {
            A: "A-B--B+A++AA+B-",
            B: "+A-BB--B-A++A+B",
            "+": "+",
            "-": "-",
        },
        axiom: "A",
        visualization: {
            A: [{ command: TurtleCommandTypes.MOVE, argument: 1 }],
            B: [{ command: TurtleCommandTypes.MOVE, argument: 1 }],
            "+": [{ command: TurtleCommandTypes.ROTATE, argument: 60 }],
            "-": [{ command: TurtleCommandTypes.ROTATE, argument: -60 }],
        },
    },
    {
        name: "Quadratic Gosper curve",
        alphabet: ["A", "B", "+", "-"],
        productionRules: {
            A: "AA-B-B+A+A-B-BA+B+AAB-A+B+AA+B-AB-B-A+A+BB-",
            B: "+AA-B-B+A+AB+A-BB-A-B+ABB-A-BA+A+B-B-A+A+BB",
            "+": "+",
            "-": "-",
        },
        axiom: "-B",
        visualization: {
            A: [{ command: TurtleCommandTypes.MOVE, argument: 1 }],
            B: [{ command: TurtleCommandTypes.MOVE, argument: 1 }],
            "+": [{ command: TurtleCommandTypes.ROTATE, argument: 90 }],
            "-": [{ command: TurtleCommandTypes.ROTATE, argument: -90 }],
        },
    },
    {
        name: "FASS 1",
        alphabet: ["L", "R", "F", "+", "-"],
        productionRules: {
            L: "LF+RFR+FL-F-LFLFL-FRFR+",
            R: "-LFLF+RFRFR+F+RF-LFL-FR",
            F: "F",
            "+": "+",
            "-": "-",
        },
        axiom: "-L",
        visualization: {
            F: [{ command: TurtleCommandTypes.MOVE, argument: 1 }],
            L: [{ command: TurtleCommandTypes.NOOP, argument: 0 }],
            R: [{ command: TurtleCommandTypes.NOOP, argument: 0 }],
            "+": [{ command: TurtleCommandTypes.ROTATE, argument: 90 }],
            "-": [{ command: TurtleCommandTypes.ROTATE, argument: -90 }],
        },
    },
    {
        name: "FASS 2",
        alphabet: ["L", "R", "F", "+", "-"],
        productionRules: {
            L: "LFLF+RFR+FLFL-FRF-LFL-FR+F+RF-LFL-FRFRFR+",
            R: "-LFLFLF+RFR+FL-F-LF+RFR+FLF+RFRF-LFL-FRFR",
            F: "F",
            "+": "+",
            "-": "-",
        },
        axiom: "-L",
        visualization: {
            F: [{ command: TurtleCommandTypes.MOVE, argument: 1 }],
            L: [{ command: TurtleCommandTypes.NOOP, argument: 0 }],
            R: [{ command: TurtleCommandTypes.NOOP, argument: 0 }],
            "+": [{ command: TurtleCommandTypes.ROTATE, argument: 90 }],
            "-": [{ command: TurtleCommandTypes.ROTATE, argument: -90 }],
        },
    },
    {
        name: "FASS 3 (PEANO CURVE)",
        alphabet: ["L", "R", "F", "+", "-"],
        productionRules: {
            L: "LFRFL-F-RFLFR+F+LFRFL",
            R: "RFLFR+F+LFRFL-F-RFLFR",
            F: "F",
            "+": "+",
            "-": "-",
        },
        axiom: "L",
        visualization: {
            F: [{ command: TurtleCommandTypes.MOVE, argument: 1 }],
            L: [{ command: TurtleCommandTypes.NOOP, argument: 0 }],
            R: [{ command: TurtleCommandTypes.NOOP, argument: 0 }],
            "+": [{ command: TurtleCommandTypes.ROTATE, argument: 90 }],
            "-": [{ command: TurtleCommandTypes.ROTATE, argument: -90 }],
        },
    },
    {
        name: "Dragon curve",
        alphabet: ["X", "Y", "F", "+", "-"],
        productionRules: {
            X: "X+YF+",
            Y: "-FX-Y",
            F: "F",
            "+": "+",
            "-": "-",
        },
        axiom: "FX",
        visualization: {
            X: [{ command: TurtleCommandTypes.MOVE, argument: 0 }],
            Y: [{ command: TurtleCommandTypes.MOVE, argument: 0 }],
            F: [{ command: TurtleCommandTypes.MOVE, argument: 1 }],
            "+": [{ command: TurtleCommandTypes.ROTATE, argument: 90 }],
            "-": [{ command: TurtleCommandTypes.ROTATE, argument: -90 }],
        },
    },
    {
        name: "Lévy C curve",
        alphabet: ["F", "+", "-"],
        productionRules: {
            F: "+F--F+",
            "+": "+",
            "-": "-",
        },
        axiom: "F",
        visualization: {
            F: [{ command: TurtleCommandTypes.MOVE, argument: 1 }],
            "+": [{ command: TurtleCommandTypes.ROTATE, argument: 45 }],
            "-": [{ command: TurtleCommandTypes.ROTATE, argument: -45 }],
        },
    },
    {
        name: "Fractal plant 1",
        alphabet: ["F", "+", "-", "[", "]"],
        productionRules: {
            F: "F[+F]F[-F]F",
            "+": "+",
            "-": "-",
            "[": "[",
            "]": "]",
        },
        axiom: "F",
        visualization: {
            F: [{ command: TurtleCommandTypes.MOVE, argument: 1 }],
            X: [{ command: TurtleCommandTypes.MOVE, argument: 0 }],
            "+": [{ command: TurtleCommandTypes.ROTATE, argument: 25.7 }],
            "-": [{ command: TurtleCommandTypes.ROTATE, argument: -25.7 }],
            "[": [{ command: TurtleCommandTypes.PUSH, argument: 0 }],
            "]": [{ command: TurtleCommandTypes.POP, argument: 0 }],
        },
    },
    {
        name: "Fractal plant 2",
        alphabet: ["F", "+", "-", "[", "]"],
        productionRules: {
            F: "F[+F]F[-F][F]",
            "+": "+",
            "-": "-",
            "[": "[",
            "]": "]",
        },
        axiom: "F",
        visualization: {
            F: [{ command: TurtleCommandTypes.MOVE, argument: 1 }],
            X: [{ command: TurtleCommandTypes.MOVE, argument: 0 }],
            "+": [{ command: TurtleCommandTypes.ROTATE, argument: 20 }],
            "-": [{ command: TurtleCommandTypes.ROTATE, argument: -20 }],
            "[": [{ command: TurtleCommandTypes.PUSH, argument: 0 }],
            "]": [{ command: TurtleCommandTypes.POP, argument: 0 }],
        },
    },
    {
        name: "Fractal plant 3",
        alphabet: ["F", "+", "-", "[", "]"],
        productionRules: {
            F: "FF-[-F+F+F]+[+F-F-F]",
            "+": "+",
            "-": "-",
            "[": "[",
            "]": "]",
        },
        axiom: "F",
        visualization: {
            F: [{ command: TurtleCommandTypes.MOVE, argument: 1 }],
            X: [{ command: TurtleCommandTypes.MOVE, argument: 0 }],
            "+": [{ command: TurtleCommandTypes.ROTATE, argument: 22.5 }],
            "-": [{ command: TurtleCommandTypes.ROTATE, argument: -22.5 }],
            "[": [{ command: TurtleCommandTypes.PUSH, argument: 0 }],
            "]": [{ command: TurtleCommandTypes.POP, argument: 0 }],
        },
    },
    {
        name: "Fractal plant 4",
        alphabet: ["X", "F", "+", "-", "[", "]"],
        productionRules: {
            X: "F[+X]F[-X]+X",
            F: "FF",
            "+": "+",
            "-": "-",
            "[": "[",
            "]": "]",
        },
        axiom: "X",
        visualization: {
            F: [{ command: TurtleCommandTypes.MOVE, argument: 1 }],
            X: [{ command: TurtleCommandTypes.MOVE, argument: 0 }],
            "+": [{ command: TurtleCommandTypes.ROTATE, argument: 20 }],
            "-": [{ command: TurtleCommandTypes.ROTATE, argument: -20 }],
            "[": [{ command: TurtleCommandTypes.PUSH, argument: 0 }],
            "]": [{ command: TurtleCommandTypes.POP, argument: 0 }],
        },
    },
    {
        name: "Fractal plant 5",
        alphabet: ["X", "F", "+", "-", "[", "]"],
        productionRules: {
            X: "F[+X][-X]FX",
            F: "FF",
            "+": "+",
            "-": "-",
            "[": "[",
            "]": "]",
        },
        axiom: "X",
        visualization: {
            F: [{ command: TurtleCommandTypes.MOVE, argument: 1 }],
            X: [{ command: TurtleCommandTypes.MOVE, argument: 0 }],
            "+": [{ command: TurtleCommandTypes.ROTATE, argument: 25.7 }],
            "-": [{ command: TurtleCommandTypes.ROTATE, argument: -25.7 }],
            "[": [{ command: TurtleCommandTypes.PUSH, argument: 0 }],
            "]": [{ command: TurtleCommandTypes.POP, argument: 0 }],
        },
    },
    {
        name: "Fractal plant 6",
        alphabet: ["X", "F", "+", "-", "[", "]"],
        productionRules: {
            X: "F+[[X]-X]-F[-FX]+X",
            F: "FF",
            "+": "+",
            "-": "-",
            "[": "[",
            "]": "]",
        },
        axiom: "X",
        visualization: {
            F: [{ command: TurtleCommandTypes.MOVE, argument: 1 }],
            X: [{ command: TurtleCommandTypes.MOVE, argument: 0 }],
            "+": [{ command: TurtleCommandTypes.ROTATE, argument: 25 }],
            "-": [{ command: TurtleCommandTypes.ROTATE, argument: -25 }],
            "[": [{ command: TurtleCommandTypes.PUSH, argument: 0 }],
            "]": [{ command: TurtleCommandTypes.POP, argument: 0 }],
        },
    },
];

export const LSystemExamples = (props: { onSelectExample: (example: Example) => void }) => {
    const examplesComponents = examples.map((example) => (
        <a
            key={example.name}
            className={"a-text-btn"}
            style={{ margin: "0.2em" }}
            onClick={() => props.onSelectExample(example)}
        >
            {example.name}
        </a>
    ));

    return <React.Fragment>{examplesComponents}</React.Fragment>;
};
