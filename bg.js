const c = document.getElementById("c");
const cx = c.getContext('2d');

window.addEventListener('resize', onResize);
window.addEventListener('load', onResize);
function onResize(event) {
  c.width = window.innerWidth;
  c.height = window.innerHeight;
}

const con = document.getElementsByClassName('content')[0];

const mc = new Hammer(con);
mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });

// listen to events...
mc.on("panleft panright panup pandown tap press", function(ev) {
    console.log(ev);
});
class BGController {
  constructor() {
    this.numBGs = 4;
    this.bg = Math.floor(Math.random() * this.numBGs);
  }

  addSlider(min, max, value, id, onInput) {
    var sliderContainer = document.getElementsByClassName("slidecontainer")[0];
    const slider = `<input type="range" min="${min}" max="${max}" value="${value}" class="slider" id="${id}">`;
    var t = document.createElement("template");
    t.innerHTML = slider;
    if (onInput)
      t.content.firstChild.addEventListener('input', onInput);
    sliderContainer.appendChild(t.content.firstChild);
  }

  clearBGControl() {
    var sliderContainer = document.getElementsByClassName("slidecontainer")[0];
    sliderContainer.innerHTML = '';
  }

  next() {
    this.bg = (this.bg + 1) % this.numBGs;
    return this.switch()
  }

  prev() {
    this.bg = this.bg == 0 ? this.numBGs - 1: this.bg - 1;
    return this.switch();
  }


  switch() {
    this.clearBGControl();
    cx.setTransform(1, 0, 0, 1, 0, 0);
    
    switch (this.bg) {
      case 0:
        const poly = new ThirdPolynomialBars(40);
        this.addSlider(14, 200, poly.numberOfBoxes, "number-of-boxes", (e) => poly.setNumBoxes(parseInt(e.srcElement.value)));
        return poly;
      case 1:
        const sphere = new Sphere();
        this.addSlider(20, 130, sphere.numPoints, "number-of-points", e => sphere.setNumPoints(parseInt(e.srcElement.value)));
        this.addSlider(0, 1, sphere.rotate, "rotate-sphere", e => sphere.setRotate(parseInt(e.srcElement.value)));
        return sphere;
      case 2:
        const newC = new Rain();
        this.addSlider(1, 500, 15, "number-of-raindrops", e => newC.setNumRainDrops(parseInt(e.srcElement.value)));
        return newC;
      case 3:
        const lSystem = new LSystem();
        this.addSlider(1, 30, 1, "evolution-step", e => lSystem.evolveTo(parseInt(e.srcElement.value)));
        return lSystem;
      default: this.bg = 0;
    }
  }

}

let now = Date.now();
let last = Date.now();
let acc = 0;

const bgController = new BGController();
let bg = bgController.next();

document
  .getElementById("next-bg")
  .addEventListener('click', event => bg = bgController.next());

document
  .getElementById("prev-bg")
  .addEventListener('click', event => bg = bgController.prev());

window.setInterval(main, 1 / 60);
function main() {

  now = Date.now();
  acc += (now - last) / 1000;
  last = now;

  bg.draw(acc)
}

