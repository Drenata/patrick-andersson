import * as TeX from '@matejmazur/react-katex';
import { GPU, Kernel } from 'gpu.js';
import { derivative, parse as mathParse } from "mathjs";
import * as React from "react";
import { slide as Menu } from "react-burger-menu";
import { FullscreenButton, ResetButton } from '../../components/buttons';
import { Modal } from "../../components/Modal";
import { CameraState, panzoomWrapper } from '../../util/panzoomWrapper';
import { resizeGraphicalKernel } from '../../webgl/gpujs';
import { newtonKernel } from './newtonKernel';

interface NewtonProps { };
interface NewtonState extends CameraState {
  isDrawerOpen: boolean;
  showModal: boolean;
  errorText: string;
  expr: string;
  texExpr: string;
  dTexExpr: string;
  maxIterations: number;
  isLoading: boolean;
};

export class NewtonContainer extends React.Component<NewtonProps, NewtonState> {
  canvas: HTMLCanvasElement;
  active = true;
  invalidated = true;
  cleanup: (() => void)[] = [];
  gpu: GPU;
  kernel: Kernel;

  constructor(props: NewtonProps) {
    super(props);

    const initialScale = 0.003;
    this.state = {
      height: window.innerHeight,
      width: window.innerWidth,
      showModal: true,
      isDrawerOpen: false,
      errorText: "",
      expr: "z^3 - 1",
      texExpr: "z^3 - 1",
      dTexExpr: "3 \\cdot z^2",
      isLoading: false,
      maxIterations: 100,
      offsetX: 1.2 * initialScale * -window.innerWidth / 2,
      offsetY: initialScale * window.innerHeight / 2,
      scaleX: initialScale,
      scaleY: initialScale,
    };
  }

  onWindowResize() {
    this.setState({
      height: window.innerHeight,
      width: window.innerWidth,
    }, () => {
      this.invalidated = true;

      this.canvas.width = this.state.width;
      this.canvas.height = this.state.height;
      resizeGraphicalKernel(this.kernel, this.state.width, this.state.height);
    });
  }

  componentDidMount() {
    this.canvas = document
      .getElementById("canvas-div")!
      .appendChild(
        document.createElement("canvas")
      );

    this.cleanup.push(
      panzoomWrapper(this, this.canvas, () => this.invalidated = true)
    );

    this.gpu = new GPU({
      canvas: this.canvas,
      mode: "webgl",
      format: "Float32Array",
    });

    window.addEventListener('resize', this.onWindowResize.bind(this, false));
    window.addEventListener('orientationchange', this.onWindowResize.bind(this, false));
    window.addEventListener('load', this.onWindowResize.bind(this, false));

    //@ts-ignore
    this.cleanup.push(() => this.kernel.destroy());
    this.cleanup.push(() => this.gpu.destroy());

    this.updateExpressionAndDerivative()
    requestAnimationFrame(() => this.update());
  }

  update() {
    if (this.active && this.canvas) {
      if (this.invalidated && this.kernel) {
        this.kernel.run(
          this.state.width, this.state.height,
          this.state.offsetX, this.state.offsetY,
          this.state.scaleX, this.state.scaleY,
          this.state.maxIterations);
        this.invalidated = false;
      }
      requestAnimationFrame(() => this.update());
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('orientationchange', this.onWindowResize);
    window.removeEventListener('load', this.onWindowResize);
    this.cleanup.map(c => c());
    this.active = false;
  }

  updateUniforms(maxIterations: number) {
    this.setState({
      maxIterations: maxIterations,
    });
    this.invalidated = true;
  }

  updateExpressionAndDerivative() {
    try {
      const expr = mathParse(this.state.expr);

      const variable = Array.from(new Set(expr.filter((n, path, parent) =>
        n.isSymbolNode && path !== "fn"
      ).map(n => n.name!)))[0];

      const texExpr = expr.toTex();
      const dTexExpr = derivative(expr, variable).toTex();
      this.setState({
        texExpr: texExpr,
        dTexExpr: dTexExpr
      });

      if (this.kernel) {
        // This is also a hack.
        // @ts-ignore
        this.kernel.destroy();
        delete this.kernel;
        // @ts-ignore
        this.gpu.kernels = [];
        this.gpu.nativeFunctions = [];
      }

      this.kernel = newtonKernel(this.gpu, this.state.expr, {
        x: this.state.width,
        y: this.state.height
      });
      this.kernel.run(
        this.state.width, this.state.height,
        this.state.offsetX, this.state.offsetY,
        this.state.scaleX, this.state.scaleY,
        this.state.maxIterations);
    } catch (err) {
      this.setState({ errorText: err.message || err });
      return;
    }
    this.setState({ errorText: "" });
  }

  render() {

    return (
      <React.Fragment>
        <Menu
          width={this.state.width >= 400 ? "400px" : "85%"}
          isOpen={this.state.isDrawerOpen}
          onStateChange={(state) => { this.setState({ isDrawerOpen: state.isOpen }); }}
        >
          <h1>Newton Fractal</h1>
          <div>
            <h2>Iterations</h2>
            <input
              type="range"
              className="slider"
              min="1"
              max="3000"
              value={this.state.maxIterations}
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                this.updateUniforms(parseInt(e.currentTarget.value))}
            />
          </div>
        </Menu>
        <div id="canvas-div" />
        <Modal show={this.state.showModal}>
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
              value={this.state.expr}
              onChange={e => {
                this.setState({
                  expr: e.currentTarget.value,
                }, this.updateExpressionAndDerivative);
              }}
            />
          </div>
          <p style={{ color: "red" }}>{this.state.errorText}</p>
          <p>Your currently selected formula is</p>
          <TeX math={this.state.texExpr} block />
          <p>and its derivative is</p>
          <TeX math={this.state.dTexExpr} block />
          <a
            className="a-text-btn"
            style={{
              float: "right"
            }}
            onClick={() => {
              this.setState({
                showModal: false,
              });
            }}>Explore</a>
        </Modal>
        <div id="controls-container">
          <FullscreenButton />
          {!this.state.showModal && <ResetButton onClick={() => this.setState({ showModal: true })} />}
        </div>
      </React.Fragment>
    );
  }
}