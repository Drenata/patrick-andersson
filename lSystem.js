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
      this.pan = [0, 0];
      this.turtleLoc = [0, 0];
      window.addEventListener('resize', () => { this.turtleDraw(); });
      mc.on('panright panleft panup pandown', e => {
        this.pan[0] = e.deltaX;
        this.pan[1] = e.deltaY;
        if (e.isFinal) {
          this.turtleLoc[0] = this.turtleLoc[0] + this.pan[0];
          this.turtleLoc[1] = this.turtleLoc[1] + this.pan[1];
          this.pan = [0, 0];
        }
        this.turtleDraw();
      });
      window.onwheel = function (e) {
        e.preventDefault();
      
        if (e.ctrlKey) {
          // Your zoom/scale factor
          console.log(e.deltaY, '1');
        } else {
          // Your trackpad X and Y positions
          console.log(e.deltaX, e.deltaY, '2');
        }
      };
    }

    evolveTo(n) {
      this.currentRecursion = this.axiom;
      for (let i = 0; i < n; i++) {
        this.produce();
      }
      this.turtleDraw();
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
      this.turtle.location[0] = this.turtleLoc[0] + this.pan[0];
      this.turtle.location[1] = this.turtleLoc[1] + this.pan[1];
      for (let i = 0; i < this.currentRecursion.length; i++) {
        const symbol = this.currentRecursion[i];
        this.turtleCommands[symbol](this.turtle);
      }
    }

    // Only need to draw when updates happen, not continously
    draw(t) {
    }
  }