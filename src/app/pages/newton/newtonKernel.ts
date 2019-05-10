import { GPU, IKernelFunctionThis } from "gpu.js";
import { derivative, parse } from "mathjs";
import { HSV2RGB } from "../../webgl/color";
import { compileToGLSL, getDependantVariable } from "../../webgl/complexmath/compile";
import { getAll } from "../../webgl/complexmath/functions";

function mainFunc() {
    return `vec3 findRootColor(vec2 coord, int maxIter) {

        vec2 z = coord;
        vec2 z1 = vec2(0.0, 0.0);

        int steps = 0;
        for (int i = 0; i < 999999; i++) {
            if (i > maxIter)
                break;

            steps++;

            vec2 y = f(z);
            vec2 dy = df(z);

            z1 = z - cdiv(y, dy);

            // Convergence
            if (cabs(z - z1) <= 0.00001) {
                break;
            }

            z = z1;
        }

        float h, s, v;

        h = 0.5 + carg(z) / (PI * 2.0);
        s = 1.0 / sqrt(cabs(z));
        v = 0.95 * max(1.0 - float(steps) / float(maxIter), 0.0);

        if (cabs(z) < 0.1) s = 0.0;
        if (cabs(z) > 100.0) v = 0.0;

        return hsv2rgb(vec3(h, s, v));
    }`;
}

function findRoots(
    this: IKernelFunctionThis,
    ww: number,
    wh: number,
    offsetX: number,
    offsetY: number,
    scaleX: number,
    scaleY: number,
    maxIterations: number) {

    const i = this.thread.x;
    const j = this.thread.y!;

    let x = i;
    let y = j - wh;
    x *= scaleX;
    y *= scaleY;
    x += offsetX;
    y += offsetY;

    // @ts-ignore
    const color = findRootColor([x, y], maxIterations); // eslint-disable-line
    this.color(color[0], color[1], color[2], 1);
}

export function newtonKernel(gpu: GPU, expr: string, output: { x: number; y: number }) {

    const fExpr = parse(expr);

    const dependantVariable = getDependantVariable(fExpr);
    const dfExpr = derivative(fExpr, dependantVariable);

    const f  = compileToGLSL(fExpr, `vec2 f(vec2 ${dependantVariable})`);
    const df = compileToGLSL(dfExpr, `vec2 df(vec2 ${dependantVariable})`);

    const customCode = `
    // This line is to trick gpu.js type inference (because native functions are 2 aggresively pruned)
    vec3 wopieurweoiruweoru(vec2 a, int b){ return vec3(0, 0, 0); }
    ${Object.values(getAll()).join("\n")}
    ${f}
    ${df}
    ${HSV2RGB}
    ${mainFunc()}`;

    gpu.addNativeFunction("findRootColor", customCode);

    return gpu.createKernel(findRoots)
        .setOutput(output)
        .setGraphical(true)
        .setArgumentTypes(["Number", "Number", "Number", "Number", "Number", "Number", "Integer"]);
}
