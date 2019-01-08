import * as React from "react";
import { slide as Menu } from "react-burger-menu";
import { Mesh, PerspectiveCamera, PlaneGeometry, Scene, ShaderMaterial, WebGLRenderer } from 'three';

interface MandelbrotProps { };
interface MandelbrotState {
  height: number;
  width: number;
  isDrawerOpen: boolean;
  maxIterations: number;
  colorScheme: number;
};

export class MandelbrotContainer extends React.Component<MandelbrotProps, MandelbrotState> {
  scene: THREE.Scene;
  camera: PerspectiveCamera;
  renderer: THREE.Renderer;
  canvas: HTMLCanvasElement;
  panZoom: any;
  colorSchemes: [number, string][] = [[0, "Green"], [1, "Wikipedia"], [2, "Boring"]];
  mesh: Mesh;
  active = true;

  constructor(props: MandelbrotProps) {
    super(props);

    this.state = {
      height: window.innerHeight,
      width: window.innerWidth,
      isDrawerOpen: false,
      colorScheme: 0,
      maxIterations: 700,
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
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000000);
    this.panZoom = require('three.map.control')({ position:{ x: 0, y: 0, z: 5 }, fov: this.camera.fov}, document.getElementById("canvas-div"));

    // the panZoom api fires events when something happens,
    // so that you can react to user actions:
    this.panZoom.on('panstart', function() {
      // fired when users begins panning (dragging) the surface
      console.log('panstart fired');
    });

    this.panZoom.on('panend', function() {
      // fired when user stpos panning (dragging) the surface
      console.log('panend fired');
    });

    this.panZoom.on('beforepan', (panPayload: any) => {
      (this.mesh.material as ShaderMaterial).uniforms.offsetX.value += panPayload.dx;
      (this.mesh.material as ShaderMaterial).uniforms.offsetY.value += panPayload.dy;
    });

    this.panZoom.on('beforezoom', (panPayload: any) => {
      (this.mesh.material as ShaderMaterial).uniforms.offsetX.value += panPayload.dx;
      (this.mesh.material as ShaderMaterial).uniforms.offsetY.value += panPayload.dy;
      (this.mesh.material as ShaderMaterial).uniforms.zoom.value =
        /* Math.max(Number.EPSILON, */ (this.mesh.material as ShaderMaterial).uniforms.zoom.value + panPayload.dz/* ) */;
      // fired when befor zoom in/zoom out
    });

    if (!fetch) {
      throw "Get a real browser";
    }

    // Load shaders from server and load them into the application
    const port = (location.port ? ':' + location.port : '');
    const requests = ["shaders/mandelbrot/vertex.glsl", "shaders/mandelbrot/fragment.glsl"].map(file =>
      fetch(
        `${window.location.protocol}//${window.location.hostname}${port}/${file}`,
        { mode: "no-cors" }
      )
    );
    Promise.all(requests)
      .then(([vertexShader, fragmentShader]) => Promise.all([vertexShader.text(), fragmentShader.text()]))
      .then(([vertexShader, fragmentShader]) => this.loadShaders(vertexShader, fragmentShader));

    this.renderer = new WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.canvas = document
      .getElementById("canvas-div")!
      .appendChild(this.renderer.domElement);

    window.addEventListener('resize', this.onWindowResize.bind(this, false));
    window.addEventListener('orientationchange', this.onWindowResize.bind(this, false));
    window.addEventListener('load', this.onWindowResize.bind(this, false));
  }

  loadShaders(vertexShader: string, fragmentShader: string) {
    const m = new ShaderMaterial({
      uniforms: {
        maxIterations: { value: this.state.maxIterations },
        colorScheme: { value: this.state.colorScheme },
        ww: { value: this.state.width },
        wh: { value: this.state.height },
        offsetX: { value: 0 },
        offsetY: { value: 0 },
        zoom: { value: 5 },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });

    this.mesh = new Mesh(new PlaneGeometry(2, 2), m);
    this.scene.add(this.mesh);
    this.update();
  }

  update() {
    if (this.active && this.canvas) {
      (this.mesh.material as ShaderMaterial).uniforms.colorScheme.value = this.state.colorScheme;
      (this.mesh.material as ShaderMaterial).uniforms.maxIterations.value = this.state.maxIterations;
      (this.mesh.material as ShaderMaterial).uniforms.ww.value = this.state.width;
      (this.mesh.material as ShaderMaterial).uniforms.wh.value = this.state.height;
      requestAnimationFrame(() => this.update());
      this.renderer.render(this.scene, this.camera);
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
    this.panZoom.dispose();
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
      <div id="canvas-div" />,
    ];
  }
}