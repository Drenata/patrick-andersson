class ThirdPolynomialBars {
  constructor(numberOfBoxes) {
    this.numberOfBoxes = numberOfBoxes;
    this.name = "Third polynomial bars";
    this.color1 = new Color(0, 201, 255, 0.55);
    this.color2 = new Color(46, 254, 157, 0.55)
  }

  setNumBoxes(value) {
    this.numberOfBoxes = value;
  }

  draw(t) {
    cx.clearRect(0, 0, c.width, c.height);

    const boxWidth = c.width / (this.numberOfBoxes + 5);
    const boxheight = boxWidth * 4;
  
    for (let i = 0; i < this.numberOfBoxes; i++) {
      let y = Interval.sample(t, -5, 5, 10 * i / this.numberOfBoxes);
      y = Math.pow(y, 3) * -((boxheight/2) - (c.height/2)) / 50;
      cx.fillStyle = Color.linearInterpolate(this.color1, this.color2, i / this.numberOfBoxes);
      cx.fillRect(i * c.width / this.numberOfBoxes, y + (c.height / 2) - boxheight/2, boxWidth, boxheight);
    }
  }
}