import * as React from "react";
import { Slider, SliderProps } from "./Slider";

export function SliderWithDisplay(sliderProps: SliderProps) {
    const [value, setValue] = React.useState(sliderProps.initialValue);
    return (
        <>
            <Slider
                {...sliderProps}
                onInput={(x) => {
                    sliderProps.onInput(x);
                    setValue(parseFloat(x.currentTarget.value));
                }}
            ></Slider>
            <div
                style={{
                    display: "inline-block",
                    paddingLeft: "1em",
                    verticalAlign: "super",
                    width: "20%",
                }}
            >
                {value}
            </div>
        </>
    );
}
