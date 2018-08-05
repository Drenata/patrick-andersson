import * as React from "react";
import { slide as Menu } from "react-burger-menu";
import { Line, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { createExample, IProductionRules, LSystem } from '../lsystem/lSystem';
import { ITurtleCommands, TurtleCommandTypes } from '../lsystem/turtle';
import { NextButton, ResetButton } from './buttons';


interface LSystemProps {};
interface LSystemState {
  height: number;
  width: number;
  isDrawerOpen: boolean;
  alphabet: string[];
  productionRules: IProductionRules;
  axiom: string;
  visualization: ITurtleCommands;
};

export class LSystemContainer extends React.Component<LSystemProps, LSystemState> {
  scene: THREE.Scene;
  camera: PerspectiveCamera;
  renderer: THREE.Renderer;
  canvas: HTMLCanvasElement;
  cube: THREE.Mesh;
  panZoom: any;
  level: number;
  line: Line;
  lSystem: LSystem;

  constructor(props: LSystemProps) {
    super(props);

    this.state = {
      height: window.innerHeight,
      width: window.innerWidth,
      isDrawerOpen: false,
      alphabet: [],
      axiom: '',
      productionRules: {},
      visualization: {}
    };
    this.resetLevel = this.resetLevel.bind(this);
    this.nextLevel = this.nextLevel.bind(this);
    this.getProductionRulesInput = this.getProductionRulesInput.bind(this);
    this.getVisualizationInput = this.getVisualizationInput.bind(this);
    this.onAlphabetChange = this.onAlphabetChange.bind(this);
    this.onAxiomChange = this.onAxiomChange.bind(this);
  }

  /**
   * Make sure references are in order and remove
   * production rules and visualisations for which there
   * are no symbols any more
   */
  deepCopyState(oldState: LSystemState, newAlphabet?: string[]): LSystemState {
    const alphabet = newAlphabet || oldState.alphabet.slice();

    const productionRules: IProductionRules = {};
    for (const key of alphabet) {
      productionRules[key] = oldState.productionRules[key] || "";
    }

    const defaultVisualization = [{command: TurtleCommandTypes.MOVE, argument: '0'}];
    const visualization: ITurtleCommands = {};
    for (const key of alphabet) {
      visualization[key] = (oldState.visualization[key] || defaultVisualization)
        .map(cmd => ({ command: cmd.command, argument: cmd.argument }));
    }

    return {
      isDrawerOpen: oldState.isDrawerOpen,
      height: oldState.height,
      width: oldState.width,
      alphabet: alphabet,
      axiom: oldState.axiom,
      productionRules: productionRules,
      visualization: visualization,
    };
  }

  onWindowResize() {
    this.setState({
      height: window.innerHeight,
      width: window.innerWidth,
    }, () => {
      this.camera.aspect = this.state.width / this.state.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.state.width, this.state.height);
    });

  }

  componentDidMount() {
    this.level = 0;
    this.scene = new Scene();
    this.camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100000000 );

    this.panZoom = require('three.map.control')(this.camera, document.getElementById("canvas-div"));

    this.renderer = new WebGLRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.canvas = document
      .getElementById("canvas-div")!
      .appendChild( this.renderer.domElement );

    this.selectExample(0);
    this.camera.position.z = 5;
    this.update();
    window.addEventListener('resize', this.onWindowResize.bind(this, false));
    window.addEventListener('orientationchange', this.onWindowResize.bind(this, false));
    window.addEventListener('load', this.onWindowResize.bind(this, false));
  }

  update() {
    if (this.canvas) {
      requestAnimationFrame(() => this.update());
      this.renderer.render( this.scene, this.camera );
    }
  }

  resetLevel() {
    if (this.line) {
      this.scene.remove(this.line);
      this.line.geometry.dispose();
      this.line.material.dispose();
    }
    this.lSystem.evolveTo(0);
    this.line = this.lSystem.getLine();
    this.scene.add(this.line);
  }

  nextLevel() {
    this.scene.remove(this.line);
    this.line.geometry.dispose();
    this.line.material.dispose();
    this.lSystem.produce();
    this.line = this.lSystem.getLine();
    this.scene.add(this.line);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('orientationchange', this.onWindowResize);
    window.removeEventListener('load', this.onWindowResize);
    this.canvas.remove();
    this.panZoom.dispose();
  }

  selectExample(example: number) {
    const ex = createExample(example);
    this.setState({
      alphabet: ex['0'],
      productionRules: ex['1'],
      axiom: ex['2'],
      visualization: ex['3']
    }, () => this.loadLSystem());
  }

  loadLSystem = () => {
    this.lSystem = new LSystem(
      this.state.productionRules,
      this.state.axiom,
      this.state.visualization);
    this.resetLevel();
    this.setState({isDrawerOpen: false});
  }

  removeWhitespaceAndFilter = (string: string, allowed: string[]) =>
    string
    .replace(/\s/g, "")
    .split("")
    .filter(char => allowed.join().indexOf(char) !== -1)
    .join("");

  /**
   * Get one input for each symbol of the alphabet
   */
  getProductionRulesInput(): JSX.Element {
    const productionRuleElements = this.state.alphabet.map(symbol => (
      <div
        className="production-rule"
      >
      {symbol} → <input
                  key={symbol + '-product'}
                  type="text"
                  name={symbol + "-product"}
                  value={this.state.productionRules[symbol]}
                  // Remove whitespace and update state
                  onChange={(e: React.FormEvent<HTMLInputElement>) => {
                    const v = this.removeWhitespaceAndFilter(e.currentTarget.value, this.state.alphabet);
                    this.setState(prevState => {
                      const newState = this.deepCopyState(prevState);
                      newState.productionRules[symbol] = v;
                      return newState;
                    }
                    );
                  }}
                />
      </div>
    ));
    return (<div id="production-rules">{productionRuleElements}</div>);
  }

  /**
   * Get one input for each symbol of the alphabet
   */
  getVisualizationInput(): JSX.Element {
    const productionRuleElements =  [];

    for (const symbol of this.state.alphabet) {
      productionRuleElements.push(this.getVisualizationRule(symbol));
    }

    return (<div id="visualization-rules">{productionRuleElements}</div>);
  }

  getVisualizationRule(symbol: string): JSX.Element {

    const commands = [];

    for (let i = 0; i < this.state.visualization[symbol].length; i++) {
      commands.push(this.getVisualizationCommand(symbol, i));
    }

    return (
      <div
        key={symbol}
        className="visualization-rule"
      >
        {symbol}
        {commands}
        <div className={"visualization-rule-controls"}>
          {this.state.visualization[symbol].length > 1 &&
            <a
              onClick={() => {
                this.setState(prevState => {
                  const newState = this.deepCopyState(prevState);
                  newState.visualization[symbol].pop();
                  return newState;
                });
              }}
            >➖</a>
          }
          <a onClick={() => {
            this.setState(prevState => {
              const newState = this.deepCopyState(prevState);
              newState.visualization[symbol].push({
                argument: '0',
                command: TurtleCommandTypes.MOVE
              });
              return newState;
            });
          }}>➕</a>
        </div>
      </div>
    );
  }

  getVisualizationCommand(symbol: string, i: number): JSX.Element {
    const command = this.state.visualization[symbol][i];
    let argument: JSX.Element | undefined;
    if (command.command === TurtleCommandTypes.MOVE
      || command.command === TurtleCommandTypes.ROTATE) {
        argument = (<input
          key={symbol + '-visualization-argument'}
          type="text"
          value={command.argument}
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            const v = e.currentTarget.value;
            this.setState(prevState => {
              const newState = this.deepCopyState(prevState);
              newState.visualization[symbol][i].argument = v;
              return newState;
            });
          }}
        />);
      }
    return (
    <div className={"visualization-command"}>
      <select
        key={command.command + command.argument}
        value={command.command}
        onChange={(e: React.FormEvent<HTMLSelectElement>) => {
          const v = e.currentTarget.value as TurtleCommandTypes;
          this.setState(prevState => {
            const newState = this.deepCopyState(prevState);
            newState.visualization[symbol][i].command = v;
            return newState;
          });
        }}
      >
        {Object
          .keys(TurtleCommandTypes)
          .map((type: keyof typeof TurtleCommandTypes) => (
            <option value={TurtleCommandTypes[type]} >{TurtleCommandTypes[type]}</option>
          ))}
      </select>
      {argument}
    </div>);
  }

  onAlphabetChange(e: React.FormEvent<HTMLInputElement>) {
    const v = e.currentTarget.value.match(/\S+/g) || [];
    this.setState(prevState => this.deepCopyState(prevState, v));
  }

  onAxiomChange(e: React.FormEvent<HTMLInputElement>) {
    const v = this.removeWhitespaceAndFilter(e.currentTarget.value, this.state.alphabet);
    this.setState({axiom: v});
  }

  render() {
    return [
      <Menu
        width={this.state.width >= 450 ? "450px" : "85%"}
        isOpen={this.state.isDrawerOpen}
        onStateChange={(state) => {this.setState({isDrawerOpen: state.isOpen});}}
      >
        <p>Give an alphabet, axiom and production rules or choose one of the examples</p>
        <div>
        <label htmlFor="alphabet-input">Alphabet</label>
          <input
            type="text"
            name="alphabet"
            id="alphabet-input"
            placeholder="Space separated symbols"
            value={this.state.alphabet.join(' ') + ' '}
            onChange={this.onAlphabetChange}
          />
        </div>
        <div>
          <label htmlFor="axiom-input">Axiom</label>
          <input
            type="text"
            name="axiom"
            id="axiom-input"
            value={this.state.axiom}
            onChange={this.onAxiomChange}
          />
        </div>
        <div>
          <label>Production rules</label>
          <this.getProductionRulesInput />
        </div>
        <div>
          <label>Visualization</label>
          <this.getVisualizationInput />
        </div>
        <a onClick={() => this.loadLSystem()}>Load</a>
        <label>Examples</label>
        <a className={"example-l-system"} onClick={() => this.selectExample(0)}>Fractal (binary) tree</a>
        <a className={"example-l-system"} onClick={() => this.selectExample(1)}>Koch curve</a>
        <a className={"example-l-system"} onClick={() => this.selectExample(2)}>Sierpinski triangle</a>
        <a className={"example-l-system"} onClick={() => this.selectExample(3)}>Sierpinski triangle (approx)</a>
        <a className={"example-l-system"} onClick={() => this.selectExample(4)}>Dragon curve</a>
        <a className={"example-l-system"} onClick={() => this.selectExample(5)}>Lévy C curve</a>
        <a className={"example-l-system"} onClick={() => this.selectExample(6)}>Fractal plant</a>
      </Menu>,
      <div id="canvas-div" />,
      <NextButton onClick={this.nextLevel} />,
      <ResetButton onClick={this.resetLevel} />,
    ];
  }
}