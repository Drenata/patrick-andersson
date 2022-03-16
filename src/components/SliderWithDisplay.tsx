import * as React from "react";
import { Slider } from "./Slider";

export class SliderWithDisplay extends Slider {
    private style = {
        display: "inline-block",
        paddingLeft: "1em",
        verticalAlign: "super",
        width: "20%",
    };

    render() {
        return (
            <React.Fragment>
                {super.render()}
                <div style={this.style}>{this.state.value}</div>
            </React.Fragment>
        );
    }
}
