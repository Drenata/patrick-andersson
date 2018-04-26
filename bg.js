const c = document.getElementById("c");
const x = c.getContext('2d');

window.addEventListener('resize', onResize);
window.addEventListener('load', onResize);
function onResize(event) {
  c.width = window.innerWidth;
  c.height = window.innerHeight;
}

function clearBGControl() {
  var sliderContainer = document.getElementsByClassName("slidecontainer")[0];
  sliderContainer.innerHTML = '';
}

function addSlider(min, max, value, id, onInput) {
  var sliderContainer = document.getElementsByClassName("slidecontainer")[0];
  const slider = `<input type="range" min="${min}" max="${max}" value="${value}" class="slider" id="${id}">`;
  var t = document.createElement("template");
  t.innerHTML = slider;
  if (onInput)
    t.content.firstChild.addEventListener('input', onInput);
  sliderContainer.appendChild(t.content.firstChild);
}


let now = Date.now();
let last = Date.now();
let acc = 0;
const bg = new ThirdPolynomialBars(40);
bg.setup();

window.setInterval(main, 1 / 60);
function main() {

  now = Date.now();
  acc += (now - last) / 1000;
  last = now;

  bg.draw(acc)
}
