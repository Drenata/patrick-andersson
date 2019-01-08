import * as React from "react";
import { slide as Menu } from "react-burger-menu";
import { Mesh, PerspectiveCamera, Scene, ShaderMaterial, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Vector3, ArrowHelper } from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';

interface BoidContainerProps { };
interface BoidContainerState {
  height: number;
  width: number;
  isDrawerOpen: boolean;
  numBoids: number;
  boidOuterRadius: number;
  boidInnerRadius: number;
  cohesionWeight: number;
  separationWeight: number;
  alignmentWeight: number;
  centerWeight: number;
  speed: number;
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

  constructor(props: BoidContainerProps) {
    super(props);

    this.state = {
      height: window.innerHeight,
      width: window.innerWidth,
      numBoids: 10,
      boidOuterRadius: 80,
      boidInnerRadius: 1.5,
      isDrawerOpen: false,
      cohesionWeight: 100,
      separationWeight: 10,
      alignmentWeight: 8,
      centerWeight: 1000,
      speed: 0.01,
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

    this.update();
  }

  update() {
    if (this.active && this.canvas) {
      this.boidUpdate();
      requestAnimationFrame(() => this.update());
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    }
  }

  resetBoids() {
    const material = new MeshBasicMaterial({ color: 0x00ff00 });
    this.boids = [];
    this.meshes.forEach(m => {
      this.scene.remove(m);
      m.remove()
    });
    this.meshes = [];

    for (let i = 0; i < this.state.numBoids; i++) {

      let geometry = new BoxGeometry(.1, .1, .3);
      let cube = new Mesh(geometry, material);
      cube.position.x = -4 + Math.random() * 8;
      cube.position.y = -2 + Math.random() * 4;
      cube.position.z = -4 + Math.random() * 8;
      this.boids.push({
        position: cube.position,
        velocity: new Vector3(0, 0, 0)
      });
      this.meshes.push(cube);
      this.scene.add(cube);
    }
  }

  boidUpdate() {
    this.arrowMeshes.forEach(m => this.scene.remove(m));
    this.boids.forEach(boid => {

      const velocityUpdate = new Vector3(0, 0, 0);
      const cohesion = new Vector3(0, 0, 0);
      const separation = new Vector3(0, 0, 0);
      const alignment = new Vector3(0, 0, 0);

      let n = 0;
      this.boids.forEach(b => {
        const d2 = b.position.distanceToSquared(boid.position);
        if (b != boid && d2 < this.state.boidOuterRadius) {
          cohesion.add(b.position);
          alignment.add(b.velocity);
          n++;
          if (d2 < this.state.boidInnerRadius) {
            separation.sub(b.position.clone().sub(boid.position));
          }
        }
      });

      if (n) {
        cohesion.divideScalar(n);
        alignment.divideScalar(n);

        cohesion.sub(boid.position);
        //alignment.sub(boid.velocity)
  
        cohesion.divideScalar(this.state.cohesionWeight);
        alignment.divideScalar(this.state.alignmentWeight);

        velocityUpdate.add(cohesion);
        velocityUpdate.add(alignment);
      }

      separation.divideScalar(this.state.separationWeight)
      velocityUpdate.add(separation);

/*       const centerDrag = boid.position.clone();
      centerDrag.divideScalar(-this.state.centerWeight);
      boid.velocity.add(centerDrag); */

      if (boid.position.x > 40)
        boid.velocity.x = -10;
      if (boid.position.y > 40)
        boid.velocity.y = -10;
      if (boid.position.z > 40)
        boid.velocity.z = -10;


      if (boid.position.x < -40)
        boid.velocity.x = 10;
      if (boid.position.y < -40)
        boid.velocity.y = 10;
      if (boid.position.z < -40)
        boid.velocity.z = 10;

        const ar = new ArrowHelper(
          velocityUpdate.clone().normalize(), 
          boid.position,
          velocityUpdate.length()
        );
        this.scene.add(ar);
        this.arrowMeshes.push(ar);
        boid.velocity.add(velocityUpdate);
    });


    this.meshes.forEach((mesh, i) => {
      // Update speed
      this.boids[i].position.addScaledVector(this.boids[i].velocity, this.state.speed);
      //this.boids[i].velocity.multiplyScalar(0.9);
      // Update mesh
      mesh.position.copy(this.boids[i].position);
      // Rotate mesh
      mesh.lookAt(this.boids[i].velocity.clone().add(this.boids[i].position));
    });

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
    this.setState({
    })
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
              this.setState({ numBoids: parseFloat(e.currentTarget.value) })
            }
          />
        </div>
        <div>
          <h2>Speed</h2>
          <input
            value={this.state.speed}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              this.setState({ speed: parseFloat(e.currentTarget.value) })
            }
          />
        </div>
        <div>
          <h2>Outer radius</h2>
          <input
            value={this.state.boidOuterRadius}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              this.setState({ boidOuterRadius: parseFloat(e.currentTarget.value) })
            }
          />
        </div>
        <div>
          <h2>Inner radius</h2>
          <input
            value={this.state.boidInnerRadius}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              this.setState({ boidInnerRadius: parseFloat(e.currentTarget.value) })
            }
          />
        </div>
        <div>
          <h2>Cohesion</h2>
          <input
            type="input"
            value={this.state.cohesionWeight}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              this.setState({ cohesionWeight: parseInt(e.currentTarget.value) })
            }
          />
        </div>
        <div>
          <h2>Separation</h2>
          <input
            type="input"
            value={this.state.separationWeight}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              this.setState({ separationWeight: parseFloat(e.currentTarget.value) })
            }
          />
        </div>
        <div>
          <h2>Alignment</h2>
          <input
            type="input"
            value={this.state.alignmentWeight}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              this.setState({ alignmentWeight: parseFloat(e.currentTarget.value) })
            }
          />
        </div>
        <div>
          <h2>Center drag</h2>
          <input
            type="input"
            value={this.state.centerWeight}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              this.setState({ centerWeight: parseFloat(e.currentTarget.value) })
            }
          />
        </div>
        <a className={"a-btn"} onClick={() => this.resetBoids()}>Reset</a>
      </Menu>,
      <div id="canvas-div" />,
    ];
  }
}