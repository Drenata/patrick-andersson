import * as React from "react";
import { Slider } from "../../../components/Slider";
import { Color } from "../../../util/color";
import { Interval, linearInterpolate } from "../../../util/util";
import { Background } from "./IBackground";

export class Sphere implements Background {
    numPoints: number;
    speed: number;
    color1: Color;
    color2: Color;
    rotate: number;

    constructor() {
        this.numPoints = 51;
        this.speed = 0.025;
        this.color1 = new Color(196, 35, 233, 0.1);
        this.color2 = new Color(255, 255, 255, 1.00);
        this.rotate = 0;
    }

    setNumPoints = (event: React.FormEvent<HTMLInputElement>) => {
        const value = parseInt(event.currentTarget.value);
        this.numPoints = value;
    }

    setRotate = (event: React.FormEvent<HTMLInputElement>) => {
        const value = parseInt(event.currentTarget.value);
        this.rotate = value;
    }

    optionControls = () => {
        return (
            <div className="slidercontainer" key="sphere">
                <div className="vertical-slider">
                    <Slider
                        min={20}
                        max={130}
                        step={1}
                        initialValue={this.numPoints}
                        id="number-of-points"
                        onInput={this.setNumPoints}
                    />
                </div>
                <div className="vertical-slider">
                    <Slider
                        min={0}
                        max={1}
                        step={1}
                        initialValue={this.rotate}
                        id="rotate-sphere"
                        onInput={this.setRotate}
                    />
                </div>
            </div>
        );
    }

    draw(t: number, context: CanvasRenderingContext2D, width: number, height: number) {
        context.fillStyle = "rgba(255, 255, 255, 0.55)";
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, width, height);
        context.translate(width / 2, + height / 2);

        if (this.rotate) {
            context.rotate(t / 5 % (Math.PI * 2));
        }

        const r = 250 + 60 * (Math.sin(t / 4) - 1);

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
                const mapped = 1 / (1 + Math.exp((1 / 100) * (dist - 450)));

                if (bx ** 2 + by ** 2 < width ** 2 + height ** 2) {
                    context.fillStyle = Color.linearInterpolate(this.color2, this.color1, mapped).toString();
                    context.fillRect(bx, by, 15, 15);
                }
            }
        }

    }
}
