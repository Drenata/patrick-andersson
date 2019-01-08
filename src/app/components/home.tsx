import * as React from "react";
import { Link, Route } from 'react-router-dom';
import { HomeBackground } from './homeBackground';
import { LSystemContainer } from './LSystemContainer';
import { MandelbrotContainer } from './MandelbrotContainer';
import { BoidContainer } from "./BoidContainer";
import { CitationGraphContainer } from "./CitationGraphContainer";

interface HomeProps {};
interface HomeState {};

export class Home extends React.Component<HomeProps, HomeState> {

  constructor(props: HomeProps) {
    super(props);
    this.state = {};
  }

  render() {
    return [
      <Route exact={true}  path="/" component={HomeBackground} />,
      <Route path="/mandelbrot" component={MandelbrotContainer} />,
      <Route path="/lsystem" component={LSystemContainer} />,
      <Route path="/boids" component={BoidContainer} />,
      <Route path="/citation-graph" component={CitationGraphContainer} />,
      <div className="projects">
        <div><Link to="/">Start</Link></div>
        <div><Link to="/mandelbrot">Mandelbrot</Link></div>
        <div><Link to="/lsystem">L-system</Link></div>
        <div><Link to="/boids">Boids</Link></div>
        <div><Link to="/citation-graph">Citation graph</Link></div>
      </div>
    ];
  }
}