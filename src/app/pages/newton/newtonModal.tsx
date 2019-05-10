import * as TeX from '@matejmazur/react-katex';
import * as React from "react";
import { Modal } from '../../components/Modal';

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
            <p>This page performs the Newton's method root-finding procedure</p>
            <TeX math="z_{t+1} \gets z_t - \frac{f(z)}{f^\prime(z)}" block />
            <p>to points in the complex plane <TeX math="z_0" />.
            By coloring each point according to which root was found and shading by number of iterations required, interesting images emerge.
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
            <TeX math={props.texExpression} block />
            <p>and its derivative is</p>
            <TeX math={props.differentiatedTexExpression} block />
            <a
                className="a-text-btn"
                style={{ float: "right" }}
                onClick={props.onClose}>Explore</a>
        </Modal>
    );
}