class NewC {
    constructor() {
      this.name = "sphere";
      this.random = new Random(1552323);
      this.drops = [];
      for (let i = 0; i < 30; i++) {
        this.drops.push(this.drop());
      }
    }

    *drop() {
      const waitIter = this.random.nextFloat() * 1000;

      for (let i = 0; i < waitIter; i++) yield;

      const x = this.random.nextFloat() * c.width;
      const y = this.random.nextFloat() * c.height;

      for (let i = 0; i < 500; i++) {
        cx.beginPath();
        cx.arc(x, y, i, 0, 2 * Math.PI);
        cx.stroke();
        yield;
      }
    }

    draw(t) {
      cx.strokeStyle = "blue";
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