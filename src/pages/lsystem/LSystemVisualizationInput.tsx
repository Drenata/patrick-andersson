import * as React from "react";
import { ProductionRules } from "./LSystem";
import { TurtleCommandMap, TurtleCommandTypes } from "./turtle";

const TurtleCommandNames = {
    Move: TurtleCommandTypes.MOVE,
    Rotate: TurtleCommandTypes.ROTATE,
    "Push state": TurtleCommandTypes.PUSH,
    "Pop state": TurtleCommandTypes.POP,
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

    const setArgument = (e: React.FormEvent<HTMLInputElement>) => {
        const v = e.currentTarget.value;
        props.onSetArgument(props.symbol, props.i, v);
    };

    const setCommand = (e: React.FormEvent<HTMLSelectElement>) => {
        const s = e.currentTarget.value;
        if (s in TurtleCommandNames) {
            const v = TurtleCommandNames[s as keyof typeof TurtleCommandNames];
            props.onSetCommand(props.symbol, props.i, v);
        }
    };

    const options = (Object.keys(TurtleCommandTypes) as Array<keyof typeof TurtleCommandTypes>).map((type) => (
        <option key={type} value={TurtleCommandTypes[type]}>
            {TurtleCommandTypes[type]}
        </option>
    ));

    if (command.command === TurtleCommandTypes.MOVE || command.command === TurtleCommandTypes.ROTATE) {
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
                {options}
            </select>
            {argument}
        </div>
    );
};
