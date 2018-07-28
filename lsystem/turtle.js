class TurtleGraphics {
    constructor() {
      this.reset();
    }

    move(distance) {
      cx.beginPath();
      cx.moveTo(this.location[0], this.location[1]);
      this.location = [
        this.location[0] + Math.cos(this.orientation) * distance,
        this.location[1] + Math.sin(this.orientation) * distance
      ];
      cx.lineTo(this.location[0], this.location[1]);
      cx.stroke();
    }

    rotate(degrees) {
      this.orientation += degrees;
    }

    changeDrawState(enabled) {
      this.on = enabled;
    }

    pushState() {
      this.stateStack.push([this.location, this.orientation]);
    }

    popState() {
      [this.location, this.orientation] = this.stateStack.pop();
    }

    reset() {
      cx.setTransform(1, 0, 0, 1, 0, 0);
      cx.clearRect(0, 0, c.width, c.height);
      cx.translate(c.width / 2, + c.height / 2);
      cx.strokeStyle = 'white';
      this.location = [0, 0];
      this.orientation = 0;
      this.color = new Color(255, 0, 0, 1);
      this.width = 1;
      this.on = true;
      this.stateStack = [];
    }
  }