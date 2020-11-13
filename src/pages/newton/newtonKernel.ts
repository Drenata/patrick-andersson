import { GPU, IKernelFunctionThis } from "gpu.js";
import { derivative, parse } from "mathjs";
import { HSV2RGB } from "../../webgl/color";
import { compileToGLSL, getDependantVariable } from "../../webgl/complexmath/compile";
import { getAll } from "../../webgl/complexmath/functions";

function mainFunc() {
    return `
    vec2 newtonIteration(vec2 z) {
        vec2 y = f(z);
        vec2 dy = df(z);

        return -cdiv(y, dy);
    }

    vec2 halleyIteration(vec2 z) {
        vec2 y = f(z);
        vec2 dy = df(z);
        vec2 d2y = d2f(z);

        return -cdiv(
            2.0 * cmul(y, dy),
            2.0 * cmul(dy, dy) - cmul(y, d2y)
        );
    }

    vec2 householderIteration(vec2 z) {
        vec2 y = f(z);
        vec2 dy = df(z);
        vec2 d2y = d2f(z);

        vec2 com = cdiv(y, dy);
        vec2 bod = one + cdiv(cmul(y, d2y), 2.0 * cmul(dy, dy));
        return -cmul(com, bod);
    }

    vec2 Abbasbandy1(vec2 z) {
        vec2 y = f(z);
        vec2 dy = df(z);
        vec2 d2y = d2f(z);

        vec2 y2 = cmul(y, y);
        vec2 dy3 = cmul(dy, cmul(dy, dy));

        vec2 first = cdiv(y, dy);
        vec2 secon = cdiv(cmul(y2, d2y), 2.0 * dy3);
        vec2 third = cdiv(cmul(cmul(y2, y), cmul(d2y, d2y)), 2.0 * cmul(cmul(dy, dy), dy3));
        return -first - secon - third;
    }

    vec2 Abbasbandy2(vec2 z) {
        vec2 y = f(z);
        vec2 dy = df(z);
        vec2 d2y = d2f(z);
        vec2 d3y = d3f(z);

        vec2 y2 = cmul(y, y);
        vec2 dy3 = cmul(dy, cmul(dy, dy));

        vec2 first = cdiv(y, dy);
        vec2 secon = cdiv(cmul(y2, d2y), 2.0 * dy3);
        vec2 third = cdiv(cmul(cmul(y2, y), d3y), 6.0 * cmul(dy, dy3));
        return -first - secon + third;
    }

    vec3 findRootColor(vec2 coord, int maxIter, int method, vec2 a, vec2 c) {

        vec2 z = coord;
        vec2 z1 = vec2(0.0, 0.0);

        int steps = 0;
        for (int i = 0; i < 999999; i++) {
            if (i > maxIter)
                break;

            steps++;

            vec2 h = vec2(0.0);
            if (method == 1) h = newtonIteration(z);
            if (method == 2) h = halleyIteration(z);
            if (method == 3) h = householderIteration(z);
            if (method == 4) h = Abbasbandy1(z);
            if (method == 5) h = Abbasbandy2(z);

            z1 = z + cmul(a, h) + c;

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

        if (cabs(a) - 1.0 > 0.001) v = 0.8;

        if (cabs(z) < 0.1) s = 0.0;
        if (cabs(z) > 100.0) v = 0.0;

        return hsv2rgb(vec3(h, s, v));
    }`;
}

function findRoots(
    this: IKernelFunctionThis,
    wh: number,
    offsetX: number,
    offsetY: number,
    scaleX: number,
    scaleY: number,
    maxIterations: number,
    method: number,
    a1: number,
    a2: number,
    c1: number,
    c2: number,
) {

    const i = this.thread.x;
    const j = this.thread.y!;

    let x = i;
    let y = j - wh;
    x *= scaleX;
    y *= scaleY;
    x += offsetX;
    y += offsetY;

    // @ts-ignore
    const color = findRootColor([x, y], maxIterations, method, [a1, a2], [c1, c2]); // eslint-disable-line
    this.color(color[0], color[1], color[2], 1);
}

export function newtonKernel(gpu: GPU, expr: string, output: number[]) {

    const fExpr = parse(expr);

    const dependantVariable = getDependantVariable(fExpr);
    const dfExpr = derivative(fExpr, dependantVariable);
    const d2fExpr = derivative(dfExpr, dependantVariable);
    const d3fExpr = derivative(d2fExpr, dependantVariable);

    const f = compileToGLSL(fExpr, `vec2 f(vec2 ${dependantVariable})`);
    const df = compileToGLSL(dfExpr, `vec2 df(vec2 ${dependantVariable})`);
    const d2f = compileToGLSL(d2fExpr, `vec2 d2f(vec2 ${dependantVariable})`);
    const d3f = compileToGLSL(d3fExpr, `vec2 d3f(vec2 ${dependantVariable})`);

    const customCode = `
    // This line is to trick gpu.js type inference (because native functions are 2 aggresively pruned)
    vec3 wopieurweoiruweoru(vec2 coord, int iter, int method, vec2 a, vec2 c){ return vec3(0, 0, 0); }
    ${Object.values(getAll()).join("\n")}
    ${f}
    ${df}
    ${d2f}
    ${d3f}
    ${HSV2RGB}
    ${mainFunc()}`;

    gpu.addNativeFunction("findRootColor", customCode);

    return gpu.createKernel(findRoots, {
        output: output
    })
        .setGraphical(true)
        .setDynamicOutput(true)
        // @ts-ignore
        .setArgumentTypes(["Integer", "Float", "Float", "Float", "Float", "Integer", "Integer", "Float", "Float", "Float", "Float"]);
}
