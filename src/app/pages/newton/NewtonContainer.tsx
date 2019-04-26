import * as React from "react";
import { slide as Menu } from "react-burger-menu";
import { Mesh, PerspectiveCamera, PlaneGeometry, Scene, ShaderMaterial, WebGLRenderer, Texture, TextureFilter, WebGLRenderTarget, UnsignedByteType, RGBAFormat, NearestFilter, ClampToEdgeWrapping, FloatType } from 'three';
import { FullscreenButton } from '../../components/buttons';
import { fragmentShader, vertexShader, rootsFS, createShaderMaterial, readFS } from "./shader";
import { Modal } from "../../components/Modal";
import * as TeX from '@matejmazur/react-katex';
import { parse as mathParse, derivative } from "mathjs";
import { GPUComputationRenderer } from "gpucomputationrender-three";
import { TexList } from "../../components/TexList";
// @ts-ignore
import * as panzoom from "pan-zoom";

interface NewtonProps { };
interface NewtonState {
  height: number;
  width: number;
  isDrawerOpen: boolean;
  showModal: boolean;
  errorText: string;
  expr: string;
  texExpr: string;
  dTexExpr: string;
  roots: string[];
  colors: string[];
  maxIterations: number;
  colorScheme: number;
  isLoading: boolean;
};

type State = NewtonState & panzoom.CameraParams;

export class NewtonContainer extends React.Component<NewtonProps, State> {
  scene: THREE.Scene;
  camera: PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  canvas: HTMLCanvasElement;
  colorSchemes: [number, string][] = [[0, "Green"], [1, "Wikipedia"], [2, "Boring"]];
  mesh: Mesh;
  active = true;
  invalidated = false;
  tolerance = 1 / (10 ** 30);

  constructor(props: NewtonProps) {
    super(props);

    this.state = {
      height: window.innerHeight,
      width: window.innerWidth,
      showModal: true,
      isDrawerOpen: false,
      errorText: "",
      expr: "z^3 - 1",
      roots: ["1+0i", "-0.5+0.8660253882408142i", "-0.5+-0.8660253882408142i"],
      colors: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928'],
      texExpr: "z^3 - 1",
      dTexExpr: "3 \\cdot z^2",
      isLoading: false,
      colorScheme: 0,
      maxIterations: 100,
      offsetX: -window.innerWidth / 2,
      offsetY: +window.innerHeight / 2,
      scaleX: 1,
      scaleY: 1
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
      // TODO this.setupGPURenderer();
    });
    this.invalidated = true;

  }

  componentDidMount() {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000000);

    this.renderer = new WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.canvas = document
      .getElementById("canvas-div")!
      .appendChild(this.renderer.domElement);

    //@ts-ignore
    panzoom(this.canvas, (e: any) => {

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


    window.addEventListener('resize', this.onWindowResize.bind(this, false));
    window.addEventListener('orientationchange', this.onWindowResize.bind(this, false));
    window.addEventListener('load', this.onWindowResize.bind(this, false));
  }

  getRootsAndIterations(params: {
    xMin: number,
    xMax: number,
    xRes: number,
    iMin: number,
    iMax: number,
    yRes: number,
    maxIterations: number,
    tolerance: number,
  }): [{ [root: string]: number }, number, number] {

    const data = new WebGLRenderTarget(params.xRes, params.yRes, {
      wrapS: ClampToEdgeWrapping,
      wrapT: ClampToEdgeWrapping,
      minFilter: NearestFilter,
      magFilter: NearestFilter,
      format: RGBAFormat,
      type: FloatType,
      stencilBuffer: false,
      depthBuffer: false
    });
    const gpu = new GPUComputationRenderer(params.xRes, params.yRes, this.renderer);
    const sh = createShaderMaterial(rootsFS(this.state.expr), {
      xMin: { value: params.xMin },
      xMax: { value: params.xMax },
      xRes: { value: params.xRes },
      iMin: { value: params.iMin },
      iMax: { value: params.iMax },
      yRes: { value: params.yRes },
      maxIterations: { value: params.maxIterations },
      tolerance: { value: params.tolerance },
    });

    gpu.doRenderTarget(sh, data);

    const output = [];

    const variables: ("x" | "y" | "z" | "w")[] = ["x", "y", "z", "w"];
    for (const variable of variables) {
      const target = new WebGLRenderTarget(params.xRes, params.yRes, {
        wrapS: ClampToEdgeWrapping,
        wrapT: ClampToEdgeWrapping,
        minFilter: NearestFilter,
        magFilter: NearestFilter,
        format: RGBAFormat,
        type: UnsignedByteType,
        stencilBuffer: false,
        depthBuffer: false
      });

      const readSh = createShaderMaterial(readFS(variable), {
        data: { value: data.texture },
        xRes: { value: params.xRes },
        yRes: { value: params.yRes }
      });

      gpu.doRenderTarget(readSh, target);
      const pixels = new Uint8Array(params.xRes * params.yRes * 4);
      this.renderer.context.readPixels(0, 0, params.xRes, params.yRes,
        this.renderer.context.RGBA,
        this.renderer.context.UNSIGNED_BYTE,
        pixels);
      output.push(new Float32Array(pixels.buffer));
    }
    let [x, y, i, b] = output;

    const roots: { [number: string]: number } = {};
    let failed = 0, maxIter = 0;
    const decimals = -Math.log10(this.tolerance) - 5;
    for (let j = 0; j < params.xRes * params.yRes; j++) {
      // Skip points that did not converge
      if (b[j] < 1.0) {
        failed++;
      }

      maxIter = maxIter > i[j] ? maxIter : i[j];

      const key = Number(x[j].toFixed(decimals)) + "+" + Number(y[j].toFixed(decimals)) + "i";
      if (key in roots) roots[key]++;
      else roots[key] = 1;
    }
    return [roots, failed, maxIter];
  }

  loadShaders(expr: string) {
    const fs = fragmentShader(expr, this.state.roots, this.state.colors);

    const m = new ShaderMaterial({
      uniforms: {
        maxIterations: { value: this.state.maxIterations },
        ww: { value: this.state.width },
        wh: { value: this.state.height },
        offsetX: { value: this.state.offsetX },
        offsetY: { value: this.state.offsetY },
        scaleX: { value: this.state.scaleX },
        scaleY: { value: this.state.scaleY },
      },
      vertexShader: vertexShader(),
      fragmentShader: fs,
    });

    this.mesh = new Mesh(new PlaneGeometry(2, 2), m);
    this.scene.add(this.mesh);
    this.invalidated = true;
    this.update();
  }

  start() {
    const expr = this.state.expr;
    try {
      this.loadShaders(expr);
    } catch (e) {
      this.setState({ errorText: e.message });
      return;
    }
    this.setState({ showModal: false });
  }

  update() {
    if (this.active && this.canvas) {
      if (this.invalidated) {
        (this.mesh.material as ShaderMaterial).uniforms.maxIterations.value = this.state.maxIterations;
        (this.mesh.material as ShaderMaterial).uniforms.ww.value = this.state.width;
        (this.mesh.material as ShaderMaterial).uniforms.wh.value = this.state.height;
        (this.mesh.material as ShaderMaterial).uniforms.offsetX.value = this.state.offsetX;
        (this.mesh.material as ShaderMaterial).uniforms.offsetY.value = this.state.offsetY;
        (this.mesh.material as ShaderMaterial).uniforms.scaleX.value = this.state.scaleX;
        (this.mesh.material as ShaderMaterial).uniforms.scaleY.value = this.state.scaleY;
        this.renderer.render(this.scene, this.camera);
        this.invalidated = false;
      }
      requestAnimationFrame(() => this.update());
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('orientationchange', this.onWindowResize);
    window.removeEventListener('load', this.onWindowResize);
    this.canvas.remove();
    this.canvas = undefined as any;
    (this.mesh.material as ShaderMaterial).dispose();
    this.mesh.remove();
    this.active = false;
  }

  updateUniforms(colorScheme: number, maxIterations: number) {
    this.setState({
      colorScheme: colorScheme,
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
    } catch (err) {
      this.setState({ errorText: err.message || err });
      return;
    }
    this.setState({ errorText: "" });
  }

  compile() {
    try {

      const det = this.getRootsAndIterations({
        iMin: -4,
        iMax: 4,
        maxIterations: 1000,
        tolerance: this.tolerance,
        xMax: -4,
        xMin: 4,
        xRes: 2000,
        yRes: 2000,
      });
      const [roots, fails, maxIter] = det;
      console.log(roots, fails, maxIter);
      const realRoots: string[] = [];
      Object.entries(roots).forEach(
        ([key, value]) => {
          if (value > 1) realRoots.push(key);
        }
      );
      this.setState({
        roots: realRoots,
        maxIterations: maxIter,
      });

    } catch (err) {
      this.setState({ errorText: err.message || err });
      return;
    }
    this.setState({
      isLoading: false,
      errorText: ""
    });
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
              this.updateUniforms(this.state.colorScheme, parseInt(e.currentTarget.value))}
          />
        </div>
        <div>
          <h2>Color scheme</h2>
          {radioButtons}
        </div>
      </Menu>,
      <div id="canvas-div" />,
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
            onInput={e => {
              this.setState({
                expr: e.currentTarget.value,
                roots: []
              }, this.updateExpressionAndDerivative);
            }}
          />
        </div>
        <p style={{ color: "red" }}>{this.state.errorText}</p>
        <p>Your currently selected formula is</p>
        <TeX math={this.state.texExpr} block />
        <p>and its derivative is</p>
        <TeX math={this.state.dTexExpr} block />
        {this.state.roots.length ?
          <React.Fragment>
            <p>The roots are</p>
            <TexList maths={this.state.roots} />
          </React.Fragment>
          : <a
            className="a-text-btn"
            title="This isn't automatic as calculating roots can take a long time."
            onClick={() => {
              this.compile()
            }}>Calculate roots</a>}
        {this.state.roots.length &&
          <a
            className="a-text-btn"
            onClick={() => {
              this.start();
            }}>Visualize!</a>
        }
      </Modal>,
      <div id="controls-container">
        <FullscreenButton />

      </div>
    ];
  }
}