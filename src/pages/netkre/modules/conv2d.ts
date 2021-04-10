import { Module, PaddingMode, Shape } from "../modules/module";



export class Conv2D implements Module {

    private inputShape: Shape;
    private numKernels: number;
    private kernelSize: [number, number];
    private stride: [number, number];
    private padding: [number, number];
    private dilation: [number, number];
    private groups: number;
    private paddingMode: PaddingMode;
    private bias: boolean;

    constructor(
        inputShape: Shape,
        numKernels: number,
        kernelSize: [number, number],
        stride: [number, number],
        padding: [number, number],
        dilation: [number, number],
        groups: number,
        paddingMode: PaddingMode,
        bias: boolean
    ) {
        this.inputShape = inputShape;
        this.numKernels = numKernels;
        this.kernelSize = kernelSize;
        this.stride = stride;
        this.padding = padding;
        this.dilation = dilation;
        this.groups = groups;
        this.paddingMode = paddingMode;
        this.bias = bias;
    }

    shape(): Shape {
        const [N, _, H, W] = this.inputShape;

        const h = 1 + (H + 2 * this.padding[0] - this.dilation[0] * (this.kernelSize[0] - 1) - 1) / this.stride[0];
        const w = 1 + (W + 2 * this.padding[1] - this.dilation[1] * (this.kernelSize[1] - 1) - 1) / this.stride[1];

        return [N, this.numKernels, h, w];
    }

    numParameters(): number {
        const [_, C, __, ___] = this.inputShape;
        const kernelShape = [
            this.numKernels,
            C / this.groups,
            this.kernelSize[0],
            this.kernelSize[1]
        ];
        const biasShape = [this.bias ? this.numKernels : 0]
        return kernelShape[0] * kernelShape[1] * kernelShape[2] * kernelShape[3]
            + biasShape[0];
    }



}