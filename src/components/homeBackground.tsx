import * as React from "react";
import { IBackground } from '../backgrounds/IBackground';
import { Rain } from '../backgrounds/Rain';
import { Sphere } from '../backgrounds/Sphere';
import { ThirdPolynomialBars } from '../backgrounds/ThirdPolynomialBars';

interface HomeBackgroundProps {};
interface HomeBackgroundState {
  acc: number,
  lastTime: number
  width: number,
  height: number,
  background: IBackground,
  backgroundIndex: number,
};

export class HomeBackground extends React.Component<HomeBackgroundProps, HomeBackgroundState> {
  canvas: React.RefObject<HTMLCanvasElement>;
  numBGs = 3;
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
    this.accum += 1/60;
    const canvas = this.canvas.current;
    if (canvas) {
      this.state.background.draw(
        this.accum,
        canvas.getContext('2d')!,
        this.canvas.current!.width,
        this.canvas.current!.height
      );
    }
    requestAnimationFrame(t => this.update(t));
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
    switch(newBackgroundIndex) {
      case 0: newBackground = new ThirdPolynomialBars(40); break;
      case 1: newBackground = new Sphere(); break;
      case 2: newBackground = new Rain(); break;
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
      <div><a href="https://github.com/Drenata">Github</a></div>,
      <div><a href="https://www.linkedin.com/in/patrick-andersson-8755bab4/">LinkedIn</a></div>,
      <canvas
        id="c"
        ref={this.canvas}
        width={this.state.width}
        height={this.state.height}
      />,
      <div
        id="next-bg"
        onClick={this.next}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="48" viewBox="0 0 24 24" width="48">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          <path d="M0 0h24v24H0z" fill="none"/>
        </svg>
      </div>,
      <div
        id="prev-bg"
        onClick={this.prev}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="48" viewBox="0 0 24 24" width="48">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          <path d="M0 0h24v24H0z" fill="none"/>
        </svg>
      </div>,
      ( this.state.background &&
        <div className="bg-controller">
          { this.state.background.optionControls() }
        </div>
      )
    ];
  }

}