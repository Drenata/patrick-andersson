import { BoxGeometry, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import { Random } from '../../util/random';

export interface SimulationProperties {
  boidOuterRadius: number;
  boidMatchingRadius: number;
  boidInnerRadius: number;
  cohesionWeight: number;
  separationWeight: number;
  alignmentWeight: number;
  centerWeight: number;
  speed: number;
}

export class Simulation {

  t: number;
  simulationProperties: SimulationProperties;
  swarm: Boid[];
  random: Random;
  last: number;

  constructor(numBoids: number,
    simulationProperties: SimulationProperties) {

    this.simulationProperties = simulationProperties;
    this.random = new Random(42);

    this.swarm = [];
    for (let i = 0; i < numBoids; i++) {
      const x = this.random.nextFloat() * 10;
      const y = this.random.nextFloat() * 10;
      const z = this.random.nextFloat() * 10;
      this.swarm.push(new Boid(i, x, y, z));
    }
    this.last = performance.now();
  }

  step(timestamp: number) {
    this.t++;

    const dt = this.simulationProperties.speed * (timestamp - this.last) / 1000;
    this.last = timestamp;

    for (const boid of this.swarm) {
      const v1 = this.cohesion(boid);
      const v3 = this.separation(boid);
      const v2 = this.alignment(boid);

      const a = (new Vector3(0, 0, 0)).add(v1).add(v2).add(v3);
      const dv = a.multiplyScalar(dt)

      boid.velocity.add(dv);
      const dx = boid.velocity.clone().multiplyScalar(dt);
      boid.mesh.position.add(dx);

    }

  }

  draw() {

  }

  cohesion(boid: Boid): Vector3 {
    let n = 0;
    let averagePosition = new Vector3(0, 0, 0);
    for (const b of this.swarm) {
      if (b == boid) continue;

      const d2 = b.mesh.position.distanceToSquared(boid.mesh.position);
      if (d2 < this.simulationProperties.boidOuterRadius) {
        averagePosition.add(b.mesh.position);
        n++;
      }
    }

    if (n) {
      averagePosition.divideScalar(n);
    }

    return averagePosition.sub(boid.mesh.position).divideScalar(this.simulationProperties.cohesionWeight);
  }

  separation(boid: Boid): Vector3 {

    let n = 0;
    let c = new Vector3(0, 0, 0);

    for (const b of this.swarm) {
      if (b == boid) continue;

      const d2 = b.mesh.position.distanceToSquared(boid.mesh.position);
      if (d2 < this.simulationProperties.boidInnerRadius) {
        c.sub(b.mesh.position.clone().sub(boid.mesh.position)); // TODO test other way around
        n++;
      }
    }

    if (n) {
      c.divideScalar(n);
    }

    return c.divideScalar(this.simulationProperties.separationWeight);
  }

  alignment(boid: Boid): Vector3 {

    let n = 0;
    let averageVelocity = new Vector3(0, 0, 0);

    for (const b of this.swarm) {
      if (b == boid) continue;

      const d2 = b.mesh.position.distanceToSquared(boid.mesh.position);
      if (d2 < this.simulationProperties.boidMatchingRadius) {
        averageVelocity.add(b.velocity);
        n++;
      }
    }

    if (n) {
      averageVelocity.divideScalar(n);
    }

    return averageVelocity.sub(boid.mesh.position).divideScalar(this.simulationProperties.alignmentWeight);
  }

}

class Boid {

  index: number;
  velocity: Vector3;
  size: number;
  mesh: Mesh;

  constructor(index: number, x: number, y: number, z: number) {

    this.index = index;
    this.velocity = new Vector3(0, 0, 0);
    this.size = 1;
    let geometry = new BoxGeometry(.1, .1, .3);
    const material = new MeshBasicMaterial({ color: 0x00ff00 });
    this.mesh = new Mesh(geometry, material);
    this.mesh.translateX(x);
    this.mesh.translateY(y);
    this.mesh.translateZ(z);
  }

  limitVelocity(maxVelocity: number) {
    const currentVelocity = norm(this.velocity);
    if (currentVelocity > maxVelocity) {
      this.velocity
        .divideScalar(currentVelocity)
        .multiplyScalar(maxVelocity);
    }
  }

}



function norm(vec: Vector3): number {
  return Math.sqrt(vec.dot(vec));
}