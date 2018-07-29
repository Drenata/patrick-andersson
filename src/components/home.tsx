import * as React from "react";
import { Link, Route } from 'react-router-dom';
import { HomeBackground } from './homeBackground';
import { LSystemContainer } from './LSystem';

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
        <Route exact={true}  path="/" component={HomeBackground} />
        <Route path="/lsystem" component={LSystemContainer} />
      </div>,
      <div className="projects">
        <div><Link to="/">Start</Link></div>
        <div><a href="/mandelbrot-webgl">Mandelbrot</a></div>
        <div><Link to="/lsystem">L-system</Link></div>
      </div>
    ];
  }
}