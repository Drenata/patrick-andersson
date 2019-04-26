import * as React from "react";
import { slide as Menu } from "react-burger-menu";
import { FullscreenButton } from '../../components/buttons';
import { GPU, Kernel } from "gpu.js";
import * as panzoom from "pan-zoom";

interface MandelbrotProps { };
interface MandelbrotState {
  height: number;
  width: number;
  isDrawerOpen: boolean;
  maxIterations: number;
  colorScheme: number;
};

type State = MandelbrotState & panzoom.CameraParams;

export class MandelbrotContainer extends React.Component<MandelbrotProps, State> {
  canvas: React.RefObject<HTMLCanvasElement>;

  colorSchemes: [number, string][] = [[0, "Green"], [1, "Wikipedia"], [2, "Boring"]];
  active = true;
  invalidated = false;
  gpu: GPU;
  kernel: Kernel;

  constructor(props: MandelbrotProps) {
    super(props);

    this.canvas = React.createRef();

    this.state = {
      height: window.innerHeight,
      width: window.innerWidth,
      isDrawerOpen: false,
      colorScheme: 0,
      maxIterations: 700,
      offsetX: -1,
      offsetY: 2,
      scaleX: 0.003,
      scaleY: 0.003,
    };
  }

  onWindowResize() {
    this.setState({
      height: window.innerHeight,
      width: window.innerWidth,
    }, () => this.invalidated = true);
  }

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize.bind(this, false));
    window.addEventListener('orientationchange', this.onWindowResize.bind(this, false));
    window.addEventListener('load', this.onWindowResize.bind(this, false));

    //@ts-ignore
    panzoom(this.canvas.current, (e: any) => {

      const clamp = (x: number, min: number, max: number) => {
        return x < min
          ? min
          : x > max
            ? max
            : x;
      }

      this.setState(oldState => {
        var left = 0;
        var top = 0;
        var width = oldState.width;
        var height = oldState.height;

        const zoom = clamp(-e.dz, -height * .75, height * .75) / height;

        let x = { offset: oldState.offsetX, scale: oldState.scaleX },
          y = { offset: oldState.offsetY, scale: oldState.scaleY };

        var oX = 0;
        x.offset -= oldState.scaleX * e.dx;

        var tx = (e.x - left) / width - oX;
        var prevScale = x.scale;
        x.scale *= (1 - zoom);
        x.scale = clamp(x.scale, 0.000000000000001, 100000000000000);
        x.offset -= width * (x.scale - prevScale) * tx;

        var oY = 0;
        y.offset += y.scale * e.dy;
        var ty = oY - (e.y - top) / height;
        var prevScale$1 = y.scale;
        y.scale *= (1 - zoom);
        y.scale = clamp(y.scale, 0.000000000000001, 100000000000000);
        y.offset -= height * (y.scale - prevScale$1) * ty;

        return ({
          offsetX: x.offset,
          offsetY: y.offset,
          scaleX: x.scale,
          scaleY: y.scale,
        })
      }, () => this.invalidated = true);

    });

    this.gpu = new GPU({
      canvas: this.canvas.current!,
      mode: "webgl",
      format: "Float32Array",
    });

    this.kernel = this.gpu.createKernel(
      function mandelbrot(
        ww: number,
        wh: number,
        offsetX: number,
        offsetY: number,
        scaleX: number,
        scaleY: number
      ) {
        const maxIterations = 600;

        let i = this.thread.x;
        let j = this.thread.y!;
        
        let x0 = i;
        let y0 = j - wh;
        x0 *= scaleX;
        y0 *= scaleY;
        x0 += offsetX;
        y0 += offsetY;

        let x = 0;
        let y = 0;

        let iteration = 0;
        for (let i = 0; i < 999999; i++) {
          if (x * x + y * y > 4 || i >= maxIterations) {
            break;
          }

          const temp = x * x - y * y + x0;
          y = 2 * x * y + y0;
          x = temp;
          iteration++;
        }

        const q = iteration / maxIterations;
        if (q >= 1)
          // @ts-ignore
          this.color(0, 0, 0);
        else if (q > 0.5)
          // @ts-ignore
          this.color(q, 1, q);
        else
          // @ts-ignore
          this.color(0.1, q, 0.1);
      }, {
        output: {
          x: this.state.width,
          y: this.state.height
        }, precision: "single",
        graphical: true,
        immutable: true
      });

      requestAnimationFrame(() => this.update());
  }

  update() {
    if (this.active && this.canvas.current) {
      if (this.invalidated) {
        this.kernel.run(this.state.width, this.state.height, this.state.offsetX, this.state.offsetY, this.state.scaleX, this.state.scaleY);
        this.invalidated = false;
      }
      console.log(this.state.offsetX, this.state.offsetY, this.state.scaleX)
      requestAnimationFrame(() => this.update());
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('orientationchange', this.onWindowResize);
    window.removeEventListener('load', this.onWindowResize);
    this.active = false;
  }

  updateUniforms(colorScheme: number, maxIterations: number) {
    this.setState({
      colorScheme: colorScheme,
      maxIterations: maxIterations,
    })
  }

  render() {
    const radioButtons = this.colorSchemes.map(([v, n]) => (
      <label>
        <input
          type="radio"
          name="color-scheme"
          value={v}
          checked={this.state.colorScheme === v}
          onChange={() => this.updateUniforms(v, this.state.maxIterations)}
        />
        {' '}{n}
      </label>
    ));
    return [
      <Menu
        width={this.state.width >= 400 ? "400px" : "85%"}
        isOpen={this.state.isDrawerOpen}
        onStateChange={(state) => { this.setState({ isDrawerOpen: state.isOpen }); }}
      >
        <h1>Mandelbrot</h1>
        <div>
          <h2>Iterations</h2>
          <input
            type="range"
            className="slider"
            min="1"
            max="3000"
            value={this.state.maxIterations}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              this.updateUniforms(this.state.colorScheme, parseInt(e.currentTarget.value))}
          />
        </div>
        <div>
          <h2>Color scheme</h2>
          {radioButtons}
        </div>
      </Menu>,
      <div id="canvas-div">
        <canvas
          ref={this.canvas}
          width={this.state.width}
          height={this.state.height}
        />
      </div>,
      <div id="controls-container">
        <FullscreenButton />

      </div>
    ];
  }
}