import * as React from "react";
import { HomeBackground } from './homeBackground';

interface HomeProps {};
interface HomeState {};

export class Home extends React.Component<HomeProps, HomeState> {
  interval: number;

  constructor(props: HomeProps) {
    super(props);

    this.state = {};
  }

  render() {
    return [
      <div className="content">
        <HomeBackground />
        <div><a href="https://github.com/Drenata">Github</a></div>
        <div><a href="https://www.linkedin.com/in/patrick-andersson-8755bab4/">LinkedIn</a></div>
      </div>,
      <div className="projects">
        <div><a href="/mandelbrot-webgl">Mandelbrot</a></div>
        <div><a href="/lsystem">L-system</a></div>
      </div>
    ];
  }
}