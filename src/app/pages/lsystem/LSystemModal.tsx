import * as React from "react";
import { Modal } from "../../components/Modal";
import { ProductionRules } from "./LSystem";
import { Example, LSystemExamples } from "./LSystemExamples";
import { LSystemProductionRulesInput } from "./LSystemProductionRulesInput";
import { LSystemVisualizationInput } from "./LSystemVisualizationInput";
import { TurtleCommands, TurtleCommandTypes } from "./turtle";

export const LSystemModal = (props: {
    isOpen: boolean;
    alphabet: string[];
    onAlphabetChange: (e: React.FormEvent<HTMLInputElement>) => void;
    axiom: string;
    onAxiomChange: (e: React.FormEvent<HTMLInputElement>) => void;
    onLoad: () => void;
    onSelectExample: (example: Example) => void;
    productionRules: ProductionRules;
    onProductionRuleChange: (symbol: string, value: string) => void;
    visualizations: TurtleCommands;
    onAddVisualizaitionRule: (symbol: string) => void;
    onRemoveVisualizationRule: (symbol: string) => void;
    onVisualizationRuleChange: (symbol: string, value: string) => void;
    onSetArgument: (symbol: string, i: number, argument: string) => void;
    onSetCommand: (symbol: string, i: number, command: TurtleCommandTypes) => void;
}) => (
    <Modal
        show={props.isOpen}
    >
        <h1>L-system</h1>
        <p>Give an alphabet, axiom and production rules or choose one of the examples.</p>
        <div style={{ display: "grid", gridTemplateColumns: "15% 64%" }}>
            <label style={{ alignSelf: "center" }} htmlFor="alphabet-input">Alphabet</label>
            <input
                type="text"
                name="alphabet"
                className="text-input"
                id="alphabet-input"
                placeholder="Space separated symbols"
                title="Space separated symbols"
                value={props.alphabet.join(" ") + " "}
                onChange={props.onAlphabetChange}
            />
            <label style={{ alignSelf: "center" }} htmlFor="axiom-input">Axiom</label>
            <input
                type="text"
                className="text-input"
                name="axiom"
                title="Starting token"
                id="axiom-input"
                value={props.axiom}
                onChange={props.onAxiomChange}
            />
        </div>
        <br />
        <div>
            <h3>Production rules</h3>
            <LSystemProductionRulesInput
                alphabet={props.alphabet}
                onRuleChange={props.onProductionRuleChange}
                productionRules={props.productionRules}
            />
        </div>
        <br />
        <div>
            <h3>Visualization</h3>
            <LSystemVisualizationInput
                alphabet={props.alphabet}
                productionRules={props.productionRules}
                onRuleChange={props.onVisualizationRuleChange}
                visualizations={props.visualizations}
                onAddRule={props.onAddVisualizaitionRule}
                onRemoveRule={props.onRemoveVisualizationRule}
                onSetArgument={props.onSetArgument}
                onSetCommand={props.onSetCommand}
            />
        </div>
        <a
            className="a-text-btn"
            style={{ fontSize: "1.5em", display: "block", margin: "1em 0em 0.3em 0em" }}
            onClick={props.onLoad}
        >
            Display
        </a>
        <div>
            <br />
            <h2>Examples</h2>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
            <LSystemExamples
                onSelectExample={props.onSelectExample}
            />
        </div>
    </Modal>
);
