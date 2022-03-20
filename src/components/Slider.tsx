import * as React from "react";

export interface SliderProps {
    min: number;
    max: number;
    step?: number;
    initialValue: number;
    id?: string;
    onInput: (event: React.FormEvent<HTMLInputElement>) => void;
}

export interface SliderState {
    value: number;
}

export function Slider({ id, min, max, step, initialValue, onInput }: SliderProps) {
    const [value, setValue] = React.useState(initialValue);

    const onChange = (event: React.FormEvent<HTMLInputElement>) => {
        setValue(parseFloat(event.currentTarget.value));
    };

    return (
        <input
            key={id}
            type="range"
            min={min}
            max={max}
            step={step || 1}
            value={value}
            className="slider"
            id={id}
            onInput={onInput}
            onChange={onChange}
        />
    );
}
