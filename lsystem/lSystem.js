class LSystem {
    constructor() {
      this.grammar = {
        '0': '1[0]0',
        '1': '11',
        '[': '[',
        ']': ']'
      };
      this.turtleCommands = {
        '0': (turtle) => {
          turtle.move(5);
        },
        '1': (turtle) => {
          turtle.move(0.5);
        },
        '[': (turtle) => {
          turtle.pushState();
          turtle.rotate(Math.PI * .25);
        },
        ']': (turtle) => {
          turtle.popState();
          turtle.rotate(Math.PI * -.25);
        }
      };
      this.axiom = '0';
      this.currentRecursion = this.axiom;
      this.turtle = new TurtleGraphics();
      this.zoom = 1;
      this.pan = [0, 0];
      this.turtleLoc = [0, 0];
      this.turtleZoom = 1;
      window.addEventListener('resize', () => { this.turtleDraw(); });
      const con = document.getElementsByClassName('content')[0];
      const mc = new Hammer(con);
      mc.get("pinch").set({enable: true});
      mc.on("pinchin pinchout pinchend", (ev) => {
        if (ev.type == "pinchend") {
          this.turtleZoom *= this.zoom;
          this.zoom = 1;
        } else {
          this.zoom = ev.scale;
        }
        console.log(this.turtleZoom, this.zoom, this.turtleZoom * this.zoom);
        this.turtleDraw();
      });
      mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });
      mc.on('panright panleft panup pandown panend', e => {
        this.pan[0] = e.deltaX * (1 / this.turtleZoom);
        this.pan[1] = e.deltaY * (1 / this.turtleZoom);
        if (e.type == "panend") {
          this.turtleLoc[0] = this.turtleLoc[0] + this.pan[0];
          this.turtleLoc[1] = this.turtleLoc[1] + this.pan[1];
          this.pan = [0, 0];
        }
        this.turtleDraw();
      });
      window.onwheel = (e) => {
        e.preventDefault();

        this.turtleZoom += e.deltaY;
        this.turtleDraw();
      };
    }

    evolveTo(n) {
      this.currentRecursion = this.axiom;
      for (let i = 0; i < n; i++) {
        this.produce();
      }
      this.turtleDraw();
    }

    zoom(magnitude) {
      this.zoom += magnitude;
    }

    /**
     * Apply production rules to current recursion
     * and update the current recursion
     */
    produce() {
        let nextRecursion = '';
        for (let i = 0; i < this.currentRecursion.length; i++) {
            const symbol = this.currentRecursion[i];
            const product = this.grammar[symbol];
            nextRecursion += product;
        }
        this.currentRecursion = nextRecursion;
    }

    turtleDraw() {
      this.turtle.reset();
      cx.scale(this.zoom * this.turtleZoom, this.zoom * this.turtleZoom);
      this.turtle.location[0] = this.turtleLoc[0] + this.pan[0];
      this.turtle.location[1] = this.turtleLoc[1] + this.pan[1];
      for (let i = 0; i < this.currentRecursion.length; i++) {
        const symbol = this.currentRecursion[i];
        this.turtleCommands[symbol](this.turtle);
      }
    }

  }