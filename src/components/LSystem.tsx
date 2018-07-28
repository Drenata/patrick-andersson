import * as React from "react";

interface LSystemProps {};
interface LSystemState {};

export class LSystem extends React.Component<LSystemProps, LSystemState> {
  interval: number;

  constructor(props: LSystemProps) {
    super(props);

    this.state = {};
  }

  render() {
    return <h1>LSystem</h1>;
  }
}