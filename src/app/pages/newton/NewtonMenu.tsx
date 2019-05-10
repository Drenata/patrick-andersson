import * as React from "react";
import { slide as Menu, State } from "react-burger-menu";

export function NewtonMenu(props: {
    width: number;
    isOpen: boolean;
    onMenuStateChange: (state: State) => void;
    maxIterations: number;
    onMaxIterationsChange: (e: React.FormEvent<HTMLInputElement>) => void;
}) {
    return (
        <Menu
            width={props.width >= 400 ? "400px" : "85%"}
            isOpen={props.isOpen}
            onStateChange={props.onMenuStateChange}
        >
            <h1>Newton Fractal</h1>
            <div>
                <h2>Iterations</h2>
                <input
                    type="range"
                    className="slider"
                    min="1"
                    max="3000"
                    value={props.maxIterations}
                    onChange={props.onMaxIterationsChange}
                />
            </div>
        </Menu>
    );
}