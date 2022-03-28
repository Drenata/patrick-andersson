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
        name: "Gosper curve",
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
        name: "Fractal plant",
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
