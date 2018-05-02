class Rain {
    constructor() {
      this.name = "sphere";
      this.random = new Random(1552323);
      this.drops = [];
      for (let i = 0; i < 30; i++) {
        this.drops.push(this.drop());
      }
      this.beginningColor = new Color(4, 57, 142, 1.0);
      this.endColor = new Color(4, 57, 142, 0.0);
    }

    setNumRainDrops(value) {
      const diff = value - this.drops.length;
      if (diff < 0) {
        this.drops.splice(0, Math.abs(diff));
      } else {
        for (let i = 0; i < value; i++) {
          this.drops.push(this.drop());
        }
      }
    }

    *drop() {
      const waitIter = this.random.nextFloat() * 1000;

      for (let i = 0; i < waitIter; i++) yield;

      const x = this.random.nextFloat() * c.width;
      const y = this.random.nextFloat() * c.height;

      for (let i = 0; i < y; i+= 10) {
        cx.fillRect(x, i, 1, c.height / 5);
        yield;
      }

      const size = this.random.nextFloat() * 450 + 50;
      for (let i = 0; i < size; i++) {
        cx.strokeStyle = Color.linearInterpolate(this.beginningColor, this.endColor, i / size);
        cx.beginPath();
        cx.arc(x, y, i / 2, 0, 2 * Math.PI);
        cx.stroke();
        yield;
      }
    }

    draw(t) {
      cx.fillStyle = "rgba(4, 57, 142, 0.7)";
      cx.setTransform(1, 0, 0, 1, 0, 0);
      cx.clearRect(0, 0, c.width, c.height);

      for (let i = 0; i < this.drops.length; i++) {
        const v = this.drops[i].next();
        if (v.done) {
          this.drops.splice(i, 1);
          this.drops.push(this.drop());
        }
      }
    }
  }