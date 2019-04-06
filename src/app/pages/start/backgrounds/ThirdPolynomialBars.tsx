import * as React from "react";
import { Slider } from '../../../components/Slider';
import { Color } from '../../../util/color';
import { Interval } from '../../../util/util';
import { IBackground } from './IBackground';

export class ThirdPolynomialBars implements IBackground {
  numberOfBoxes: number;
  color1: Color;
  color2: Color;

  constructor(numberOfBoxes: number) {
    this.numberOfBoxes = numberOfBoxes;
    this.color1 = new Color(0, 201, 255, 0.55);
    this.color2 = new Color(46, 254, 157, 0.55);
  }

  setNumBoxes = (event: React.FormEvent<HTMLInputElement>) => {
    const value = parseInt(event.currentTarget.value);
    this.numberOfBoxes = value;
  }

  optionControls = () => {
    return (
      <div className="slidercontainer" key="third-polynomial-bars">
        <div className="vertical-slider">
          <Slider
            min={14}
            max={200}
            step={1}
            initialValue={40}
            id="number-of-boxes"
            onInput={this.setNumBoxes}
          />
        </div>
      </div>);
  }

  draw(t: number, context: CanvasRenderingContext2D, width: number, height: number) {
    context.clearRect(0, 0, width, height);

    const boxWidth = width / (this.numberOfBoxes + 5);
    const boxheight = boxWidth * 4;

    for (let i = 0; i < this.numberOfBoxes; i++) {
      let y = Interval.sample(t, -5, 5, 10 * i / this.numberOfBoxes);
      y = Math.pow(y, 3) * -((boxheight / 2) - (height / 2)) / 50;
      context.fillStyle = Color.linearInterpolate(this.color1, this.color2, i / this.numberOfBoxes).toString();
      context.fillRect(i * width / this.numberOfBoxes, y + (height / 2) - boxheight / 2, boxWidth, boxheight);
    }
  }
}