export interface Background {
    draw(t: number, context: CanvasRenderingContext2D, width: number, height: number): void;
    optionControls(): JSX.Element;
}
