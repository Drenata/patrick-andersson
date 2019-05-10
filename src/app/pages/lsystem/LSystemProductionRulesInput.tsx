import * as React from "react";
import { removeWhitespaceAndFilter } from "../../util/util";
import { ProductionRules } from "./LSystem";

/**
 * Get one input for each symbol of the alphabet
 */
export const LSystemProductionRulesInput = (props: {
    alphabet: string[];
    productionRules: ProductionRules;
    onRuleChange: (symbol: string, value: string) => void;
}) => {

    const onRuleChange = (e: React.FormEvent<HTMLInputElement>, symbol: string) => {
        const value = removeWhitespaceAndFilter(e.currentTarget.value, props.alphabet);
        props.onRuleChange(symbol, value);
    };

    const productionRuleElements = props.alphabet.map(symbol => (
        <div
            key={symbol}
            className="production-rule"
        >
            {symbol} → <input
                key={symbol + "-product"}
                type="text"
                name={symbol + "-product"}
                className="text-input"
                value={props.productionRules[symbol]}
                onChange={e => onRuleChange(e, symbol)}
            />
        </div>
    ));
    return (<div id="production-rules">{productionRuleElements}</div>);
};
