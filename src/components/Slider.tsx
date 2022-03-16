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

export class Slider extends React.Component<SliderProps, SliderState> {
    constructor(props: SliderProps) {
        super(props);

        this.state = {
            value: this.props.initialValue,
        };

        this.onChange = this.onChange.bind(this);
    }

    onChange(event: React.FormEvent<HTMLInputElement>) {
        this.setState({ value: parseFloat(event.currentTarget.value) });
    }

    render() {
        return (
            <input
                key={this.props.id}
                type="range"
                min={this.props.min}
                max={this.props.max}
                step={this.props.step || 1}
                value={this.state.value}
                className="slider"
                id={this.props.id}
                onInput={this.props.onInput}
                onChange={this.onChange}
            />
        );
    }
}
