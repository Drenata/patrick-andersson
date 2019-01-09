import * as React from "react";
import { HeightmapLines } from '../backgrounds/HeightmapLines';
import { IBackground } from '../backgrounds/IBackground';
import { Rain } from '../backgrounds/Rain';
import { Sphere } from '../backgrounds/Sphere';
import { ThirdPolynomialBars } from '../backgrounds/ThirdPolynomialBars';
import { ConfigButton, FullscreenButton, NextButton, PreviousButton } from './buttons';

interface HomeBackgroundProps { };
interface HomeBackgroundState {
  acc: number,
  lastTime: number
  width: number,
  height: number,
  background: IBackground,
  backgroundIndex: number,
  drawOptions: boolean;
};

export class HomeBackground extends React.Component<HomeBackgroundProps, HomeBackgroundState> {
  canvas: React.RefObject<HTMLCanvasElement>;
  numBGs = 4;
  accum = 0;

  constructor(props: HomeBackgroundProps) {
    super(props);

    this.canvas = React.createRef();

    this.state = {
      acc: 0,
      lastTime: Date.now(),
      height: window.innerHeight,
      width: window.innerWidth,
      background: undefined as any,
      backgroundIndex: 0,
      drawOptions: false
    };

    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
  }

  onReszize() {
    this.setState({
      height: window.innerHeight,
      width: window.innerWidth
    });
  }

  update(time: number) {
    // do not use real time, use accumulated time.
    // E.g. slow down the simulation if we are lagging
    // instead of actually lagging
    this.accum += 1 / 60;
    const canvas = this.canvas.current;
    if (canvas) {
      this.state.background.draw(
        this.accum,
        canvas.getContext('2d')!,
        this.canvas.current!.width,
        this.canvas.current!.height
      );
      requestAnimationFrame(t => this.update(t));
    }
  }

  next() {
    this.switchBackground((this.state.backgroundIndex + 1) % this.numBGs)
  }

  prev() {
    this.switchBackground(
      this.state.backgroundIndex == 0
        ? this.numBGs - 1
        : this.state.backgroundIndex - 1
    );
  }

  switchBackground(newBackgroundIndex: number) {
    this.canvas.current!.getContext('2d')!.setTransform(1, 0, 0, 1, 0, 0);
    let newBackground;
    switch (newBackgroundIndex) {
      case 0: newBackground = new ThirdPolynomialBars(40); break;
      case 1: newBackground = new HeightmapLines(); break;
      case 2: newBackground = new Sphere(); break;
      case 3: newBackground = new Rain(); break;
      default: newBackground = new ThirdPolynomialBars(40);
    }
    this.setState({
      background: newBackground,
      backgroundIndex: newBackgroundIndex
    });
  }

  componentDidMount() {
    window.addEventListener('resize', this.onReszize.bind(this, false));
    window.addEventListener('load', this.onReszize.bind(this, false));
    this.switchBackground(Math.floor(Math.random() * this.numBGs));
    requestAnimationFrame(t => this.update(t));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onReszize);
    window.removeEventListener('load', this.onReszize);
  }

  render() {
    return [
      <div className="content">
        <div className="z-one"><a href="https://github.com/Drenata">Github</a></div>
        <div className="z-one"><a href="https://www.linkedin.com/in/patrick-andersson-8755bab4/">LinkedIn</a></div>
      </div>,
      <div id="canvas-div">
      <canvas
        ref={this.canvas}
        width={this.state.width}
        height={this.state.height}
      /></div>,
      <div id="controls-container">
        <PreviousButton onClick={this.prev} />
        <NextButton onClick={this.next} />
        <ConfigButton onClick={() => this.setState({ drawOptions: !this.state.drawOptions })} />
        <FullscreenButton />
      </div>,
      (this.state.background && this.state.drawOptions &&
        <div className="bg-controller">
          <this.state.background.optionControls />
        </div>
      )
    ];
  }

}