import { GPU, IKernelFunctionThis } from "gpu.js";

function manbelbrotKernelCode(
    this: IKernelFunctionThis,
    ww: number,
    wh: number,
    offsetX: number,
    offsetY: number,
    scaleX: number,
    scaleY: number,
    maxIterations: number,
    colorScheme: number
) {
    let x0 = this.thread.x;
    let y0 = this.thread.y! - wh;
    x0 *= scaleX;
    y0 *= scaleY;
    x0 += offsetX;
    y0 += offsetY;
    let x = 0;
    let y = 0;

    let iteration = 0;
    for (let i = 0; i < 999999; i++) {
        if (x * x + y * y > 4 || i >= maxIterations) {
            break;
        }

        const temp = x * x - y * y + x0;
        y = 2 * x * y + y0;
        x = temp;
        iteration++;
    }

    const q = iteration / maxIterations;
    if (colorScheme == 0) {
        if (q >= 1) {
            this.color(0, 0, 0);
        } else if (q > 0.5) {
            this.color(q, 1, q);
        } else {
            this.color(0.1, q, 0.1);
        }
    } else if (colorScheme === 1) {
        const i = iteration - 16 * Math.floor(iteration / 16);
        // prettier-ignore
        if (q >= 0.99) { this.color(0, 0, 0); } else
        if (i < 1.0) { this.color(66 / 255, 30 / 255, 15 / 255); } else
        if (i < 2.0) { this.color(25 / 255, 7 / 255, 26 / 255); } else
        if (i < 3.0) { this.color(9 / 255, 1 / 255, 47 / 255); } else
        if (i < 4.0) { this.color(4 / 255, 4 / 255, 73 / 255); } else
        if (i < 5.0) { this.color(0 / 255, 7 / 255, 100 / 255); } else
        if (i < 6.0) { this.color(12 / 255, 44 / 255, 138 / 255); } else
        if (i < 7.0) { this.color(24 / 255, 82 / 255, 177 / 255); } else
        if (i < 8.0) { this.color(57 / 255, 125 / 255, 209 / 255); } else
        if (i < 9.0) { this.color(134 / 255, 181 / 255, 229 / 255); } else
        if (i < 10.0) { this.color(211 / 255, 236 / 255, 248 / 255); } else
        if (i < 11.0) { this.color(241 / 255, 233 / 255, 191 / 255); } else
        if (i < 12.0) { this.color(248 / 255, 201 / 255, 95 / 255); } else
        if (i < 13.0) { this.color(255 / 255, 170 / 255, 0 / 255); } else
        if (i < 14.0) { this.color(204 / 255, 128 / 255, 0 / 255); } else
        if (i < 15.0) { this.color(153 / 255, 87 / 255, 0 / 255); } else
        if (i < 16.0) { this.color(106 / 255, 52 / 255, 3 / 255); } else
        { this.color(0, 0, 0); }
    } else {
        this.color(1 - q, 1 - q, 1 - q);
    }
}

export function createMandelbrotKernel(gpu: GPU, resolution: [number, number]) {
    return gpu.createKernel(manbelbrotKernelCode, {
        graphical: true,
        dynamicOutput: true,
        output: resolution,
    });
}
