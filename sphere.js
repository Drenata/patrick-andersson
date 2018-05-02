class Sphere {
  constructor() {
    this.name = "sphere";
    this.numPoints = 51;
    this.speed = 0.025;
    this.color1 = new Color(196, 35, 233, 0.1);
    this.color2 = new Color(255, 255, 255, 1.00);
    this.rotate = 0;
  }

  setNumPoints(value) {
    this.numPoints = value;
  }

  setRotate(value) {
    this.rotate = value;
  }

  draw(t) {
    cx.fillStyle = "rgba(255, 255, 255, 0.55)";
    cx.setTransform(1, 0, 0, 1, 0, 0);
    cx.clearRect(0, 0, c.width, c.height);
    cx.translate(c.width / 2, + c.height / 2);
    if (this.rotate)
      cx.rotate(t/5 % (Math.PI * 2));

    const r = 250 + 60 *(Math.sin(t / 4) - 1);

    for (let i = 0; i <= this.numPoints; i++) {
      for (let j = 0; j < this.numPoints; j++) {

        const theta = linearInterpolate(0, Math.PI, i / (this.numPoints));

        const phi = i % 2
          ? Interval.sample(t * this.speed, 0, Math.PI * 2, (j * 2 * Math.PI) / this.numPoints)
          : Interval.sampleReverse(t * this.speed, 0, Math.PI * 2, (j * 2 * Math.PI) / this.numPoints);

        const x = r * Math.sin(theta) * Math.cos(phi);
        const y = r * Math.sin(theta) * Math.sin(phi);
        const z = r * Math.cos(theta);


        const bx = 256 * (x + 250) / y;
        const by = 512 * z / y;

        const dist = Math.abs(bx);
        const mapped = 1 / (1 + Math.exp( (1/100) * (dist - 450) ));

        if (bx **2 + by**2 < c.width**2 + c.height**2) {
          cx.fillStyle = Color.linearInterpolate(this.color2, this.color1, mapped);
          cx.fillRect(bx, by, 15, 15);
        }
      }
    }

  }
}