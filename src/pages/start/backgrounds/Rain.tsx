import * as React from "react";
import { Slider } from "../../../components/Slider";
import { Color } from "../../../util/color";
import { Random } from "../../../util/random";
import { Background } from "./IBackground";

export class Rain implements Background {
    random: Random;
    drops: any[];
    beginningColor: Color;
    endColor: Color;
    context?: CanvasRenderingContext2D;
    width?: number;
    height?: number;

    constructor() {
        this.random = new Random(1552323);
        this.drops = [];
        for (let i = 0; i < 30; i++) {
            this.drops.push(this.drop());
        }
        this.beginningColor = new Color(4, 57, 142, 1.0);
        this.endColor = new Color(4, 57, 142, 0.0);
    }

    setNumRainDrops = (event: React.FormEvent<HTMLInputElement>) => {
        const value = parseInt(event.currentTarget.value);
        const diff = value - this.drops.length;
        if (diff < 0) {
            this.drops.splice(0, Math.abs(diff));
        } else {
            for (let i = 0; i < value; i++) {
                this.drops.push(this.drop());
            }
        }
    }

    optionControls = () => {
        return (
            <div className="slidercontainer" key="rain">
                <div className="vertical-slider">
                    <Slider
                        min={1}
                        max={500}
                        step={1}
                        initialValue={15}
                        id="number-of-raindrops"
                        onInput={this.setNumRainDrops}
                    />
                </div>
            </div>
        );
    }

    *drop() {
        const waitIter = this.random.nextFloat() * 500;

        for (let i = 0; i < waitIter; i++) { yield; }

        const x = this.random.nextFloat() * this.width!;
        const y = this.random.nextFloat() * this.height!;

        const dropSpeed = 30;
        for (let i = -10; i < y; i += dropSpeed) {
            this.context!.fillRect(x, i, 2, Math.min(this.height! / 10, y - i));
            yield;
        }

        const size = this.random.nextFloat() * (0.000125558 * this.width! * this.height!) + 50;
        const speed = size / 60;
        for (let i = 0; i < size; i += speed) {
            this.context!.strokeStyle = Color.linearInterpolate(this.beginningColor, this.endColor, i / size).toString();
            this.context!.lineWidth = 2;
            this.context!.beginPath();
            this.context!.arc(x, y, i / 2, 0, 2 * Math.PI);
            this.context!.stroke();
            yield;
        }
    }

    draw(t: number, context: CanvasRenderingContext2D, width: number, height: number) {
        this.width = width;
        this.height = height;
        this.context = context;
        this.context.fillStyle = "rgba(4, 57, 142, 1.0)";
        this.context.clearRect(0, 0, width, height);

        for (let i = 0; i < this.drops.length; i++) {
            const v = this.drops[i].next();
            if (v.done) {
                this.drops.splice(i, 1);
                this.drops.push(this.drop());
            }
        }
    }
}
