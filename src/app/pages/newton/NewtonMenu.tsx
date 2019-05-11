import * as TeX from "@matejmazur/react-katex";
import * as React from "react";
import { slide as Menu, State } from "react-burger-menu";


export function NewtonMenu(props: {
    width: number;
    isOpen: boolean;
    onMenuStateChange: (state: State) => void;
    maxIterations: number;
    onMaxIterationsChange: (e: React.FormEvent<HTMLInputElement>) => void;
    method: number;
    onMethodChange: (method: string) => void;
    a: [string, string];
    onaChange: (a: [string, string]) => void;
    c: [string, string];
    oncChange: (c: [string, string]) => void;
}) {
    return (
        <Menu
            width={props.width >= 400 ? "400px" : "85%"}
            isOpen={props.isOpen}
            onStateChange={props.onMenuStateChange}
        >
            <h1>Newton Fractal</h1>
            <div>
                <h2>Max iterations</h2>
                <input
                    value={props.maxIterations}
                    onChange={props.onMaxIterationsChange}
                />
            </div>
            <div>
                <h2>Method</h2>
                <select
                    value={props.method}
                    onChange={e => props.onMethodChange(e.currentTarget.value)}
                >
                    <option value="1">Newton Iteration</option>
                    <option value="2">Halley Iteration</option>
                    <option value="3">Householder Iteration</option>
                    <option value="4">Abbasbandy 1</option>
                    <option value="5">Abbasbandy 2</option>
                </select>
            </div>
            <div>
                <h2>Generalization</h2>
                <TeX
                    math="z_{t+1} \gets z_t - a h + c"
                    block={true}
                />
                <div style={{ display: "grid", gridTemplateColumns: "10% 15% 5% 15% 5%" }}>
                    <span style={{ alignSelf: "center" }}>a:</span>
                    <input
                        style={{ width: "1.8em" }}
                        value={props.a[0]}
                        onChange={e => props.onaChange([e.currentTarget.value, props.a[1]])}
                    />
                    <TeX math="+" style={{ alignSelf: "center" }}/>
                    <input
                        style={{ width: "1.8em" }}
                        value={props.a[1]}
                        onChange={e => props.onaChange([props.a[0], e.currentTarget.value])}
                    />
                    <TeX math="i" style={{ alignSelf: "center" }}/>
                    <span style={{ alignSelf: "center" }}>c:</span>
                    <input
                        style={{ width: "1.8em" }}
                        value={props.c[0]}
                        onChange={e => props.oncChange([e.currentTarget.value, props.c[1]])}
                    />
                    <TeX math="+" style={{ alignSelf: "center" }}/>
                    <input
                        style={{ width: "1.8em" }}
                        value={props.c[1]}
                        onChange={e => props.oncChange([props.c[0], e.currentTarget.value])}
                    />
                    <TeX math="i" style={{ alignSelf: "center" }}/>
                </div>
            </div>
        </Menu>
    );
}
