import * as React from "react";
import { ProductionRules } from "./LSystem";
import { TurtleCommandMap, TurtleCommandTypes } from "./turtle";

const TurtleCommandNames = {
    [TurtleCommandTypes.MOVE]: "Move",
    [TurtleCommandTypes.MOVE_WITHOUT_DRAWING]: "Move without drawing",
    [TurtleCommandTypes.ROTATE]: "Rotate",
    [TurtleCommandTypes.PUSH]: "Push state",
    [TurtleCommandTypes.POP]: "Pop state",
    [TurtleCommandTypes.NOOP]: "Do nothing",
};

/**
 * Get one input for each symbol of the alphabet
 */
export const LSystemVisualizationInput = (props: {
    alphabet: string[];
    productionRules: ProductionRules;
    visualizations: TurtleCommandMap;
    onAddRule: (symbol: string) => void;
    onRemoveRule: (symbol: string) => void;
    onSetArgument: (symbol: string, i: number, argument: string) => void;
    onSetCommand: (symbol: string, i: number, command: TurtleCommandTypes) => void;
}) => {
    const visualizationRuleElements = [];

    for (const symbol of props.alphabet) {
        visualizationRuleElements.push(
            <VisualizationRule
                key={symbol}
                symbol={symbol}
                visualization={props.visualizations}
                onAddRule={props.onAddRule}
                onRemoveRule={props.onRemoveRule}
                onSetArgument={props.onSetArgument}
                onSetCommand={props.onSetCommand}
            />
        );
    }

    return <div id="visualization-rules">{visualizationRuleElements}</div>;
};

const VisualizationRule = (props: {
    symbol: string;
    visualization: TurtleCommandMap;
    onAddRule: (symbol: string) => void;
    onRemoveRule: (symbol: string) => void;
    onSetArgument: (symbol: string, i: number, argument: string) => void;
    onSetCommand: (symbol: string, i: number, command: TurtleCommandTypes) => void;
}) => {
    const commands = [];

    for (let i = 0; i < props.visualization[props.symbol].length; i++) {
        commands.push(<React.Fragment key={"f" + i}>{" → "}</React.Fragment>);
        commands.push(
            <VisualizationCommand
                key={i}
                symbol={props.symbol}
                i={i}
                onSetArgument={props.onSetArgument}
                onSetCommand={props.onSetCommand}
                visualization={props.visualization}
            />
        );
    }

    const displayRemove = props.visualization[props.symbol].length > 1;

    return (
        <div key={props.symbol} className="visualization-rule">
            {props.symbol}
            {commands}
            <div className={"visualization-rule-controls"}>
                {displayRemove && <a onClick={() => props.onRemoveRule(props.symbol)}>-</a>}
                <a onClick={() => props.onAddRule(props.symbol)}>+</a>
            </div>
        </div>
    );
};

const VisualizationCommand = (props: {
    symbol: string;
    i: number;
    visualization: TurtleCommandMap;
    onSetArgument: (symbol: string, i: number, argument: string) => void;
    onSetCommand: (symbol: string, i: number, command: TurtleCommandTypes) => void;
}) => {
    const command = props.visualization[props.symbol][props.i];
    let argument: JSX.Element | undefined;

    const setArgument = (e: React.FormEvent<HTMLInputElement>) =>
        props.onSetArgument(props.symbol, props.i, e.currentTarget.value);

    const setCommand = (e: React.FormEvent<HTMLSelectElement>) =>
        props.onSetCommand(props.symbol, props.i, parseInt(e.currentTarget.value));

    if (
        command.command === TurtleCommandTypes.MOVE ||
        command.command === TurtleCommandTypes.MOVE_WITHOUT_DRAWING ||
        command.command === TurtleCommandTypes.ROTATE
    ) {
        argument = (
            <input
                key={props.symbol + "-visualization-argument"}
                className="text-input"
                type="text"
                value={command.argument}
                onChange={setArgument}
            />
        );
    }

    return (
        <div className={"visualization-command"}>
            <select key={command.command + command.argument} value={command.command} onChange={setCommand}>
                <option key={TurtleCommandTypes.MOVE} value={TurtleCommandTypes.MOVE}>
                    {TurtleCommandNames[TurtleCommandTypes.MOVE]}
                </option>
                <option key={TurtleCommandTypes.MOVE_WITHOUT_DRAWING} value={TurtleCommandTypes.MOVE_WITHOUT_DRAWING}>
                    {TurtleCommandNames[TurtleCommandTypes.MOVE_WITHOUT_DRAWING]}
                </option>
                <option key={TurtleCommandTypes.ROTATE} value={TurtleCommandTypes.ROTATE}>
                    {TurtleCommandNames[TurtleCommandTypes.ROTATE]}
                </option>
                <option key={TurtleCommandTypes.PUSH} value={TurtleCommandTypes.PUSH}>
                    {TurtleCommandNames[TurtleCommandTypes.PUSH]}
                </option>
                <option key={TurtleCommandTypes.POP} value={TurtleCommandTypes.POP}>
                    {TurtleCommandNames[TurtleCommandTypes.POP]}
                </option>
                <option key={TurtleCommandTypes.NOOP} value={TurtleCommandTypes.NOOP}>
                    {TurtleCommandNames[TurtleCommandTypes.NOOP]}
                </option>
            </select>
            {argument}
        </div>
    );
};
