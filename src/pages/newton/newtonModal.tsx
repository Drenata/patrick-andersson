import TeX from "@matejmazur/react-katex";
import * as React from "react";
import { Modal } from "../../components/Modal";

export function NewtonModal(props: {
    showModal: boolean;
    expression: string;
    onExpressionChanged: (newExpression: string) => void;
    texExpression: string;
    differentiatedTexExpression: string;
    errorText: string;
    onClose: () => void;
}) {
    return (
        <Modal show={props.showModal}>
            <h1>Newton fractal</h1>
            <p>This page performs the Newton&apos;s method root-finding procedure</p>
            <TeX
                math="z_{t+1} \gets z_t - \frac{f(z)}{f^\prime(z)}"
                block={true}
            />
            <p>to points in the complex plane <TeX math="z_0" />.
            By coloring each point according to the root found and number of iterations required,
            interesting images emerge.
            Enter some function, press compile and then go!</p>
            <div style={{ margin: "0 auto", width: "288px" }}>
                <input
                    className="text-input"
                    placeholder=""
                    value={props.expression}
                    onChange={e => props.onExpressionChanged(e.currentTarget.value)}
                />
            </div>
            <p style={{ color: "red" }}>{props.errorText}</p>
            <p>Your currently selected formula is</p>
            <TeX
                math={props.texExpression}
                block={true}
            />
            <p>and its derivative is</p>
            <TeX
                math={props.differentiatedTexExpression}
                block={true}
            />
            <a
                className="a-text-btn"
                style={{ float: "right" }}
                onClick={props.onClose}
            >
                Explore
            </a>
        </Modal>
    );
}
