import * as React from "react";
import * as Simplex from "simplex-noise";
import { Slider } from "../../../components/Slider";
import { Color } from "../../../util/color";
import { rangeToRange } from "../../../util/util";
import { Background } from "./IBackground";

export class HeightmapLines implements Background {
    simplex: Simplex;
    beginningColor: Color;
    endColor: Color;
    numLines: number;
    scaleZ: number;
    dissonance: number;
    speed: number;
    pointSeparation: number;

    constructor() {
        this.simplex = new Simplex();
        this.beginningColor = new Color(4, 57, 142, 1.0);
        this.endColor = new Color(4, 57, 142, 0.0);
        this.numLines = 215;
        this.scaleZ = 40;
        this.dissonance = 0.015;
        this.speed = 0.2;
        this.pointSeparation = 75;
    }

    setNumLines = (event: React.FormEvent<HTMLInputElement>) => {
        const value = parseInt(event.currentTarget.value);
        this.numLines = value;
    }

    setScaleZ = (event: React.FormEvent<HTMLInputElement>) => {
        const value = parseFloat(event.currentTarget.value);
        this.scaleZ = value;
    }

    setDissonance = (event: React.FormEvent<HTMLInputElement>) => {
        const value = parseFloat(event.currentTarget.value);
        this.dissonance = value;
    }

    setSpeed = (event: React.FormEvent<HTMLInputElement>) => {
        const value = parseFloat(event.currentTarget.value);
        this.speed = value;
    }

    setPointSeparation = (event: React.FormEvent<HTMLInputElement>) => {
        const value = parseFloat(event.currentTarget.value);
        this.pointSeparation = value;
    }

    optionControls = () => (
        <div className="slidercontainer" key="rain">
            <div className="vertical-slider">
                <Slider
                    min={30}
                    max={500}
                    step={1}
                    initialValue={this.numLines}
                    id="num-lines-heightmap"
                    onInput={this.setNumLines}
                />
            </div>
            <div className="vertical-slider">
                <Slider
                    min={1}
                    max={100}
                    step={1}
                    initialValue={this.scaleZ}
                    id="scale-heightmap-y"
                    onInput={this.setScaleZ}
                />
            </div>
            <div className="vertical-slider">
                <Slider
                    min={0.0001}
                    max={0.1}
                    step={0.0001}
                    initialValue={this.dissonance}
                    id="dissonance-heightmap"
                    onInput={this.setDissonance}
                />
            </div>
            <div className="vertical-slider">
                <Slider
                    min={0.01}
                    max={1}
                    step={0.01}
                    initialValue={this.speed}
                    id="speed-heightmap"
                    onInput={this.setSpeed}
                />
            </div>
            <div className="vertical-slider">
                <Slider
                    min={1}
                    max={100}
                    step={1}
                    initialValue={this.pointSeparation}
                    id="pointseparation-heightmap"
                    onInput={this.setPointSeparation}
                />
            </div>
        </div>
    )

    draw(t: number, context: CanvasRenderingContext2D, width: number, height: number) {
        context.clearRect(0, 0, width, height);
        const lineSpacing = height / (this.numLines - 20);

        const offset = t * this.speed;
        const fallofFuncX = (x: number) => 1 - Math.abs(rangeToRange(0, width, -1, 1)(x));
        const fallofFuncY = (y: number) => 1 - Math.abs(rangeToRange(0, height, -1, 1)(y));

        for (let line = 0; line < this.numLines; line++) {
            context.beginPath();
            const lineY = (line - 10) * lineSpacing;
            let from = [0, lineY];
            context.strokeStyle = Color
                .linearInterpolate(this.beginningColor, this.endColor, line / this.numLines)
                .toString();
            context.moveTo(from[0], from[1]);

            for (let x = this.pointSeparation; x <= width + this.pointSeparation * 2; x += this.pointSeparation) {
                const fallof = fallofFuncX(x) * fallofFuncY(lineY);
                const to = [x, lineY + this.scaleZ * fallof * this.simplex.noise2D(x, lineY * this.dissonance + offset)];
                const cp = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2];
                context.quadraticCurveTo(from[0], from[1], cp[0], cp[1]);
                from = to;
            }

            context.stroke();
        }
    }
}
