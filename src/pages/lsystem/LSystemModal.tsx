import React, { useState } from "react";
import { Modal } from "../../components/Modal";
import { removeWhitespaceAndFilter } from "../../util/util";
import { LSystem, ProductionRules } from "./LSystem";
import { examples, LSystemExamples } from "./LSystemExamples";
import { LSystemProductionRulesInput } from "./LSystemProductionRulesInput";
import { LSystemVisualizationInput } from "./LSystemVisualizationInput";
import { TurtleCommandMap, TurtleCommandTypes } from "./turtle";

export interface LSystemState {
    alphabet: string[];
    productionRules: ProductionRules;
    axiom: string;
    visualization: TurtleCommandMap;
}

function useLSystemState(initialState: LSystemState) {
    const [s, setLSystem] = useState(initialState);

    /**
     * Make sure references are in order and remove
     * production rules and visualisations for which there
     * are no symbols any more
     */
    const deepCopyState = (oldState: LSystemState, newAlphabet?: string[]) => {
        const alphabetCopy = newAlphabet || oldState.alphabet.slice();

        const productionRulesCopy: ProductionRules = {};
        for (const key of alphabetCopy) {
            productionRulesCopy[key] = oldState.productionRules[key] || "";
        }

        const defaultVisualization = [{ command: TurtleCommandTypes.MOVE, argument: "0" }];
        const visualizationCopy: TurtleCommandMap = {};
        for (const key of alphabetCopy) {
            visualizationCopy[key] = (oldState.visualization[key] || defaultVisualization).map((cmd) => ({
                command: cmd.command,
                argument: cmd.argument,
            }));
        }

        return {
            axiom: oldState.axiom,
            alphabet: alphabetCopy,
            productionRules: productionRulesCopy,
            visualization: visualizationCopy,
        };
    };

    const setAlphabetAndFilterRules = (v: string) =>
        setLSystem((oldState) => deepCopyState(oldState, v.match(/\S+/g) || []));

    const setAxiomSafe = (v: string) =>
        setLSystem((oldState) => {
            const newState = deepCopyState(oldState);
            newState.axiom = removeWhitespaceAndFilter(v, newState.alphabet);
            return newState;
        });

    const setProductionRule = (symbol: string, value: string) =>
        setLSystem((oldState) => {
            const newState = deepCopyState(oldState);
            newState.productionRules[symbol] = value;
            return newState;
        });

    const removeVisualizationRule = (symbol: string) =>
        setLSystem((oldState) => {
            const newState = deepCopyState(oldState);
            newState.visualization[symbol].pop();
            return newState;
        });

    const addVisualizationRule = (symbol: string) =>
        setLSystem((oldState) => {
            const newState = deepCopyState(oldState);
            newState.visualization[symbol].push({
                argument: 0,
                command: TurtleCommandTypes.MOVE,
            });
            return newState;
        });

    const setVisualizationRuleArgument = (symbol: string, i: number, argument: string) =>
        setLSystem((oldState) => {
            const newState = deepCopyState(oldState);
            newState.visualization[symbol][i].argument = parseFloat(argument);
            return newState;
        });

    const setVisualizationRuleCommand = (symbol: string, i: number, command: TurtleCommandTypes) =>
        setLSystem((oldSystem) => {
            const newState = deepCopyState(oldSystem);
            newState.visualization[symbol][i].command = command;
            return newState;
        });

    return {
        alphabet: s.alphabet,
        axiom: s.axiom,
        productionRules: s.productionRules,
        visualization: s.visualization,
        setLSystem,
        setAlphabetAndFilterRules,
        setAxiomSafe,
        setProductionRule,
        removeVisualizationRule,
        addVisualizationRule,
        setVisualizationRuleArgument,
        setVisualizationRuleCommand,
    };
}

export const LSystemModal = ({ isOpen, onLoad }: { isOpen: boolean; onLoad: (newLSystem: LSystem) => void }) => {
    const {
        alphabet,
        axiom,
        productionRules,
        visualization,
        setLSystem,
        addVisualizationRule,
        removeVisualizationRule,
        setAlphabetAndFilterRules,
        setAxiomSafe,
        setProductionRule,
        setVisualizationRuleArgument,
        setVisualizationRuleCommand,
    } = useLSystemState(examples[0]);

    const selectExample = (example: LSystemState) => setLSystem(example);
    return (
        <Modal show={isOpen}>
            <h1>L-system</h1>
            <p>Give an alphabet, axiom and production rules or choose one of the examples.</p>
            <div style={{ display: "grid", gridTemplateColumns: "15% 64%" }}>
                <label style={{ alignSelf: "center" }} htmlFor="alphabet-input">
                    Alphabet
                </label>
                <input
                    type="text"
                    name="alphabet"
                    className="text-input"
                    id="alphabet-input"
                    placeholder="Space separated symbols"
                    title="Space separated symbols"
                    value={alphabet.join(" ") + " "}
                    onChange={(e) => setAlphabetAndFilterRules(e.currentTarget.value)}
                />
                <label style={{ alignSelf: "center" }} htmlFor="axiom-input">
                    Axiom
                </label>
                <input
                    type="text"
                    className="text-input"
                    name="axiom"
                    title="Starting token"
                    id="axiom-input"
                    value={axiom}
                    onChange={(e) => setAxiomSafe(e.currentTarget.value)}
                />
            </div>
            <br />
            <div>
                <h3>Production rules</h3>
                <LSystemProductionRulesInput
                    alphabet={alphabet}
                    onRuleChange={setProductionRule}
                    productionRules={productionRules}
                />
            </div>
            <br />
            <div>
                <h3>Visualization</h3>
                <LSystemVisualizationInput
                    alphabet={alphabet}
                    productionRules={productionRules}
                    visualizations={visualization}
                    onAddRule={addVisualizationRule}
                    onRemoveRule={removeVisualizationRule}
                    onSetArgument={setVisualizationRuleArgument}
                    onSetCommand={setVisualizationRuleCommand}
                />
            </div>
            <a
                className="a-text-btn"
                style={{
                    fontSize: "1.5em",
                    display: "block",
                    margin: "1em 0em 0.3em 0em",
                }}
                onClick={() => onLoad(new LSystem(productionRules, axiom, visualization))}
            >
                Display
            </a>
            <div>
                <br />
                <h2>Examples</h2>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
                <LSystemExamples onSelectExample={selectExample} />
            </div>
        </Modal>
    );
};
