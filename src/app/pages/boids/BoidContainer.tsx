import * as React from "react";
import { slide as Menu } from "react-burger-menu";
import { ArrowHelper, AxesHelper, Mesh, PerspectiveCamera, Scene, ShaderMaterial, Vector3, WebGLRenderer } from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { Simulation } from './boids';

interface BoidContainerProps { };
interface BoidContainerState {
  height: number;
  width: number;
  isDrawerOpen: boolean;
  numBoids: string;
  boidOuterRadius: string;
  boidMatchingRadius: string;
  boidInnerRadius: string;
  cohesionWeight: string;
  separationWeight: string;
  alignmentWeight: string;
  centerWeight: string;
  speed: string;
};

interface Boid {
  position: Vector3;
  velocity: Vector3;
}

export class BoidContainer extends React.Component<BoidContainerProps, BoidContainerState> {
  scene: THREE.Scene;
  camera: PerspectiveCamera;
  controls: OrbitControls;
  renderer: THREE.Renderer;
  canvas: HTMLCanvasElement;
  panZoom: any;
  meshes: Mesh[] = [];
  active = true;
  boids: Boid[] = [];
  arrowMeshes: ArrowHelper[] = [];
  simulation: Simulation;

  constructor(props: BoidContainerProps) {
    super(props);

    this.state = {
      height: window.innerHeight,
      width: window.innerWidth,
      isDrawerOpen: false,
      numBoids: "10",
      boidOuterRadius: "80",
      boidMatchingRadius: "80",
      boidInnerRadius: "1.5",
      cohesionWeight: "100",
      separationWeight: "1",
      alignmentWeight: "8",
      centerWeight: "1000",
      speed: "1",
    };
    this.resetBoids = this.resetBoids.bind(this);
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
    this.controls = new OrbitControls(this.camera, document.getElementById("canvas-div")!);

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

    this.camera.position.z = 5;

    this.resetBoids();

    this.scene.add(
      new AxesHelper(5)
    );

    window.addEventListener('resize', this.onWindowResize.bind(this, false));
    window.addEventListener('orientationchange', this.onWindowResize.bind(this, false));
    window.addEventListener('load', this.onWindowResize.bind(this, false));
  }

  loadShaders(vertexShader: string, fragmentShader: string) {
    const m = new ShaderMaterial({
      uniforms: {
        ww: { value: this.state.width },
        wh: { value: this.state.height },
        offsetX: { value: 0 },
        offsetY: { value: 0 },
        zoom: { value: 5 },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });

    requestAnimationFrame((ts) => this.update(ts));
  }

  update(timestamp: number) {
    if (this.active && this.canvas) {
      this.boidUpdate(timestamp);
      requestAnimationFrame((ts) => this.update(ts));
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    }
  }

  resetBoids() {
    if (this.simulation) {
      for (const b of this.simulation.swarm) {
        this.scene.remove(b.mesh);
      }
    }

    this.simulation = new Simulation(parseInt(this.state.numBoids), {
      boidOuterRadius: parseFloat(this.state.boidOuterRadius),
      boidMatchingRadius: parseFloat(this.state.boidMatchingRadius),
      boidInnerRadius: parseFloat(this.state.boidInnerRadius),
      cohesionWeight: parseFloat(this.state.cohesionWeight),
      separationWeight: parseFloat(this.state.separationWeight),
      alignmentWeight: parseFloat(this.state.alignmentWeight),
      centerWeight: parseFloat(this.state.centerWeight),
      speed: parseFloat(this.state.speed),
    });

    for (const boid of this.simulation.swarm) {
      this.scene.add(boid.mesh)
    }
  }

  boidUpdate(timestamp: number) {
    this.simulation.step(timestamp);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('orientationchange', this.onWindowResize);
    window.removeEventListener('load', this.onWindowResize);
    this.canvas.remove();
    this.canvas = undefined as any;
    this.meshes.forEach(m => m.remove());
    this.active = false;
  }

  updateUniforms(maxIterations: number) {
    /* this.setState({
    }); */
  }

  render() {
    return [
      <Menu
        width={this.state.width >= 400 ? "400px" : "85%"}
        isOpen={this.state.isDrawerOpen}
        onStateChange={(state) => { this.setState({ isDrawerOpen: state.isOpen }); }}
      >
        <h1>Boids</h1>
        <div>
          <h2>Count</h2>
          <input
            value={this.state.numBoids}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              this.setState({ numBoids: e.currentTarget.value })
            }
          />
        </div>
        <div>
          <h2>Speed</h2>
          <input
            value={this.state.speed}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              this.setState({ speed: e.currentTarget.value })
            }
          />
        </div>
        <div>
          <h2>Outer radius</h2>
          <input
            value={this.state.boidOuterRadius}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              this.setState({ boidOuterRadius: e.currentTarget.value })
            }
          />
        </div>
        <div>
          <h2>Inner radius</h2>
          <input
            value={this.state.boidInnerRadius}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              this.setState({ boidInnerRadius: e.currentTarget.value })
            }
          />
        </div>
        <div>
          <h2>Cohesion</h2>
          <input
            type="input"
            value={this.state.cohesionWeight}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              this.setState({ cohesionWeight: e.currentTarget.value })
            }
          />
        </div>
        <div>
          <h2>Separation</h2>
          <input
            type="input"
            value={this.state.separationWeight}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              this.setState({ separationWeight: e.currentTarget.value })
            }
          />
        </div>
        <div>
          <h2>Alignment</h2>
          <input
            type="input"
            value={this.state.alignmentWeight}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              this.setState({ alignmentWeight: e.currentTarget.value })
            }
          />
        </div>
        <div>
          <h2>Center drag</h2>
          <input
            type="input"
            value={this.state.centerWeight}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              this.setState({ centerWeight: e.currentTarget.value })
            }
          />
        </div>
        <a className={"a-btn"} onClick={() => this.resetBoids()}>Reset</a>
      </Menu>,
      <div id="canvas-div" />,
    ];
  }
}