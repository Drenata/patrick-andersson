import * as React from "react";
import { Line, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { ConfigButton, FullscreenButton, NextButton, ResetButton } from "../../components/buttons";
import { removeWhitespaceAndFilter } from "../../util/util";
import { LSystem, ProductionRules } from "./LSystem";
import { examples } from "./LSystemExamples";
import { LSystemModal } from "./LSystemModal";
import { TurtleCommands, TurtleCommandTypes } from "./turtle";

interface LSystemState {
    height: number;
    width: number;
    isConfigOpen: boolean;
    alphabet: string[];
    productionRules: ProductionRules;
    axiom: string;
    visualization: TurtleCommands;
}

export class LSystemContainer extends React.Component<{}, LSystemState> {
    scene?: THREE.Scene;
    camera?: PerspectiveCamera;
    renderer?: THREE.Renderer;
    canvas?: HTMLCanvasElement;
    panZoom: any;
    level: number;
    line?: Line;
    lSystem?: LSystem;
    active = true;

    constructor(props: {}) {
        super(props);

        this.level = 0;

        this.state = {
            height: window.innerHeight,
            width: window.innerWidth,
            isConfigOpen: true,
            alphabet: examples[0].alphabet,
            axiom: examples[0].axiom,
            productionRules: examples[0].productionRules,
            visualization: examples[0].visualization,
        };
        this.resetLevel = this.resetLevel.bind(this);
        this.nextLevel = this.nextLevel.bind(this);
        this.onAlphabetChange = this.onAlphabetChange.bind(this);
        this.onAxiomChange = this.onAxiomChange.bind(this);
        this.onProductionRuleChange = this.onProductionRuleChange.bind(this);
        this.onAddVisualizationRule = this.onAddVisualizationRule.bind(this);
        this.onRemoveVisualizationRule = this.onRemoveVisualizationRule.bind(this);
        this.onVisualizationRuleChange = this.onVisualizationRuleChange.bind(this);
        this.onSetArgument = this.onSetArgument.bind(this);
        this.onSetCommand = this.onSetCommand.bind(this);
    }

    /**
     * Make sure references are in order and remove
     * production rules and visualisations for which there
     * are no symbols any more
     */
    deepCopyState(oldState: LSystemState, newAlphabet?: string[]): LSystemState {
        const alphabet = newAlphabet || oldState.alphabet.slice();

        const productionRules: ProductionRules = {};
        for (const key of alphabet) {
            productionRules[key] = oldState.productionRules[key] || "";
        }

        const defaultVisualization = [{ command: TurtleCommandTypes.MOVE, argument: "0" }];
        const visualization: TurtleCommands = {};
        for (const key of alphabet) {
            visualization[key] = (oldState.visualization[key] || defaultVisualization)
                .map(cmd => ({ command: cmd.command, argument: cmd.argument }));
        }

        return {
            isConfigOpen: oldState.isConfigOpen,
            height: oldState.height,
            width: oldState.width,
            alphabet,
            axiom: oldState.axiom,
            productionRules,
            visualization,
        };
    }

    onWindowResize() {
        this.setState({
            height: window.innerHeight,
            width: window.innerWidth,
        }, () => {
            this.camera!.aspect = this.state.width / this.state.height;
            this.camera!.updateProjectionMatrix();
            this.renderer!.setSize(this.state.width, this.state.height);
        });

    }

    componentDidMount() {
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000000);

        // @ts-ignore
        this.panZoom = require("three.map.control")(this.camera, document.getElementById("canvas-div")); // eslint-disable-line

        this.renderer = new WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.canvas = document
            .getElementById("canvas-div")!
            .appendChild(this.renderer.domElement);

        this.camera.position.z = 5;
        this.update();
        window.addEventListener("resize", this.onWindowResize.bind(this, false));
        window.addEventListener("orientationchange", this.onWindowResize.bind(this, false));
        window.addEventListener("load", this.onWindowResize.bind(this, false));
    }

    update() {
        if (this.active && this.canvas) {
            requestAnimationFrame(() => this.update());
            this.renderer!.render(this.scene!, this.camera!);
        }
    }

    resetLevel() {
        if (this.line) {
            this.scene!.remove(this.line);
            this.line.geometry.dispose();
            this.line.material.dispose();
        }
        this.lSystem!.evolveTo(0);
        this.line = this.lSystem!.getLine();
        this.scene!.add(this.line);
    }

    nextLevel() {
        this.scene!.remove(this.line!);
        this.line!.geometry.dispose();
        this.line!.material.dispose();
        this.lSystem!.produce();
        this.line = this.lSystem!.getLine();
        this.scene!.add(this.line);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onWindowResize);
        window.removeEventListener("orientationchange", this.onWindowResize);
        window.removeEventListener("load", this.onWindowResize);
        this.canvas!.remove();
        this.panZoom.dispose();
        this.active = false;
    }

    selectExample(example: {
        alphabet: string[];
        productionRules: ProductionRules;
        axiom: string;
        visualization: TurtleCommands;
    }) {
        this.setState(example);
    }

    loadLSystem = () => {
        this.lSystem = new LSystem(
            this.state.productionRules,
            this.state.axiom,
            this.state.visualization);
        this.resetLevel();
        this.setState({ isConfigOpen: false });
    }

    onAlphabetChange(e: React.FormEvent<HTMLInputElement>) {
        const v = e.currentTarget.value.match(/\S+/g) || [];
        this.setState(prevState => this.deepCopyState(prevState, v));
    }

    onAxiomChange(e: React.FormEvent<HTMLInputElement>) {
        const v = removeWhitespaceAndFilter(e.currentTarget.value, this.state.alphabet);
        this.setState({ axiom: v });
    }

    onProductionRuleChange(symbol: string, value: string) {
        this.setState(prevState => {
            const newState = this.deepCopyState(prevState);
            newState.productionRules[symbol] = value;
            return newState;
        });
    }

    onRemoveVisualizationRule(symbol: string) {
        this.setState(prevState => {
            const newState = this.deepCopyState(prevState);
            newState.visualization[symbol].pop();
            return newState;
        });
    }

    onAddVisualizationRule(symbol: string) {
        this.setState(prevState => {
            const newState = this.deepCopyState(prevState);
            newState.visualization[symbol].push({
                argument: "0",
                command: TurtleCommandTypes.MOVE,
            });
            return newState;
        });
    }

    onVisualizationRuleChange(symbol: string, value: string) {
        this.setState(prevState => {
            const newState = this.deepCopyState(prevState);
            newState.productionRules[symbol] = value;
            return newState;
        });
    }

    onSetArgument(symbol: string, i: number, argument: string) {
        this.setState(prevState => {
            const newState = this.deepCopyState(prevState);
            newState.visualization[symbol][i].argument = argument;
            return newState;
        });
    }

    onSetCommand(symbol: string, i: number, command: TurtleCommandTypes) {
        this.setState(prevState => {
            const newState = this.deepCopyState(prevState);
            newState.visualization[symbol][i].command = command;
            return newState;
        });
    }

    render() {
        return (
            <React.Fragment>
                <div id="canvas-div" />
                <LSystemModal
                    isOpen={this.state.isConfigOpen}
                    alphabet={this.state.alphabet}
                    onAlphabetChange={this.onAlphabetChange}
                    axiom={this.state.axiom}
                    onAxiomChange={this.onAxiomChange}
                    onLoad={this.loadLSystem}
                    onSelectExample={example => this.selectExample(example)}
                    productionRules={this.state.productionRules}
                    onProductionRuleChange={this.onProductionRuleChange}
                    visualizations={this.state.visualization}
                    onAddVisualizaitionRule={this.onAddVisualizationRule}
                    onRemoveVisualizationRule={this.onRemoveVisualizationRule}
                    onVisualizationRuleChange={this.onVisualizationRuleChange}
                    onSetArgument={this.onSetArgument}
                    onSetCommand={this.onSetCommand}
                />
                <div id="controls-container">
                    <NextButton onClick={this.nextLevel} />
                    <ResetButton onClick={this.resetLevel} />
                    <ConfigButton onClick={() => this.setState({ isConfigOpen: true }) }/>
                    <FullscreenButton />
                </div>
            </React.Fragment>
        );
    }
}
