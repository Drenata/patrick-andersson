import { compileToHLSL } from "./parser";
import { ShaderMaterial } from "three";
import { Color } from "../../util/color";
import { complex } from "mathjs";

export function vertexShader() {
    return `void main(void) {
        gl_Position = vec4(position, 1.0);
    }`;
}

export function fragmentShader(expr: string, roots: string[], colors: string[]) {
    // TODO dependent variable
    const [f, df] = compileToHLSL(expr);
    const compiledRoots = roots.map((r, i) => {
        const c = complex(r);
        return `roots[${i}] = vec2(float(${c.re}), float(${c.im}));`;
    }).join("\n");
    const compiledColors = colors.map((c, i) => {
        const [r, g, b] = Color.hexToRgb(c);
        return `colors[${i}] = vec3(${r/255}, ${g/255}, ${b/255});`;
    }).join("\n");

    return `precision highp float;
    precision highp int;
    uniform float offsetX;
    uniform float offsetY;
    uniform float scaleX;
    uniform float scaleY;
    uniform float ww;
    uniform float wh;
    uniform int maxIterations;

    ${helperFunctions()}

    vec2 f(vec2 z) {
        return ${f};
    }

    vec2 df(vec2 z) {
        return ${df};
    }

    void main(void) {
        float tolerance = 0.000001;

        float x1 = gl_FragCoord.x;
        float y1 = gl_FragCoord.y - wh;
        x1 *= scaleX;
        y1 *= scaleY;
        x1 += offsetX; // Hmmm
        y1 += offsetY; // hmmm

        vec2 z = vec2(x1, y1);

        vec2 roots[${roots.length}];
        ${compiledRoots}

        vec3 colors[${colors.length}];
        ${compiledColors}

        int iteration = 0;
        for (int i = 0; i < 999999; i++) {
            if (i > maxIterations)
                break;

            z -= cdiv(f(z), df(z));

            // Check if is root
            for (int j = 0; j < ${roots.length}; j++) {
                vec2 diff = z - roots[j];
                if (abs(diff.x) < tolerance && abs(diff.y) < tolerance) {
                    float q = float(i)/float(maxIterations);
                    gl_FragColor = vec4(colors[j] * (1.0 - q), 1.0);
                    return;
                }
          }
      }

      gl_FragColor = vec4(0.0, 0.0, 0, 1.0);
    }`;
}

export function rootsFS(params: any) {
    const [f, df] = compileToHLSL(params);
    return `precision highp float;
    precision highp int;
    uniform float xMin;
    uniform float xMax;
    uniform int xRes;
    uniform float iMin;
    uniform float iMax;
    uniform int yRes;
    uniform int maxIterations;
    uniform float tolerance;

    ${helperFunctions()}

    vec2 f(vec2 z) {
        return ${f};
    }

    vec2 df(vec2 z) {
        return ${df};
    }

    void main(void) {
        float epsilon = 0.0000000000001;

        // [0, xRes] => [xMin, xMax]
        float x1 = xMin + (float(xRes) - gl_FragCoord.x) * (xMax - xMin) / float(xRes);

        // [0, yRes] => [iMin, iMax]
        float y1 = iMin + (float(yRes) - gl_FragCoord.y) * (iMax - iMin) / float(yRes);

        vec2 z = vec2(x1, y1);
        for (int i = 0; i < 999999; i++) {
            if (i > maxIterations)
                break;

            vec2 y = f(z);
            vec2 dy = df(z);

            // No convergence - dividing by too small number
            if (cabs(dy) < epsilon) {
                gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
                return;
            }

            vec2 z1 = z - cdiv(y, dy);

            // Convergence
            if (cabs(z - z1) <= tolerance * cabs(z1)) {
                gl_FragColor = vec4(z1.x, z1.y, float(i), 1.0);
                return;
            }

            z = z1;
      }

      // No convergence - iteration limit reached
      gl_FragColor = vec4(0.0, 0.0, float(maxIterations), 0.0);
    }`;
}

export function readFS(dim: "x" | "y" | "z" | "w") {
    return `
    uniform sampler2D data;
    uniform float xRes;
    uniform float yRes;

    float shift_right (float v, float amt) { 
        v = floor(v) + 0.5; 
        return floor(v / exp2(amt)); 
    }
    float shift_left (float v, float amt) { 
        return floor(v * exp2(amt) + 0.5); 
    }
    float mask_last (float v, float bits) { 
        return mod(v, shift_left(1.0, bits)); 
    }
    float extract_bits (float num, float from, float to) { 
        from = floor(from + 0.5); to = floor(to + 0.5); 
        return mask_last(shift_right(num, from), to - from); 
    }
    vec4 encode_float (float val) { 
        if (val == 0.0) return vec4(0, 0, 0, 0); 
        float sign = val > 0.0 ? 0.0 : 1.0; 
        val = abs(val); 
        float exponent = floor(log2(val)); 
        float biased_exponent = exponent + 127.0; 
        float fraction = ((val / exp2(exponent)) - 1.0) * 8388608.0; 
        float t = biased_exponent / 2.0; 
        float last_bit_of_biased_exponent = fract(t) * 2.0; 
        float remaining_bits_of_biased_exponent = floor(t); 
        float byte4 = extract_bits(fraction, 0.0, 8.0) / 255.0; 
        float byte3 = extract_bits(fraction, 8.0, 16.0) / 255.0; 
        float byte2 = (last_bit_of_biased_exponent * 128.0 + extract_bits(fraction, 16.0, 23.0)) / 255.0; 
        float byte1 = (sign * 128.0 + remaining_bits_of_biased_exponent) / 255.0; 
        return vec4(byte4, byte3, byte2, byte1); 
    }

    void main(void) {
        vec2 coord = vec2(gl_FragCoord.x / xRes, gl_FragCoord.y / yRes);
        vec4 d = texture2D(data, coord);
        gl_FragColor = encode_float(d.${dim});
    }`;
}

function helperFunctions() {
    return `vec2 cconj(vec2 a) {
        return vec2(a.x, -a.y);
    }

    float cabs(vec2 a) {
        return sqrt(a.x * a.x + a.y * a.y);
    }

    vec2 cmul(vec2 a, vec2 b) {
        return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
    }

    vec2 cdiv(vec2 a, vec2 b) {
        float divisor = b.x * b.x + b.y * b.y;
        return vec2(
            (a.x * b.x + a.y * b.y),
            (a.y * b.x - a.x * b.y)
        ) / divisor;
    }

    vec2 cpow3(vec2 a) {
        return cmul(a, cmul(a, a));
    }

    vec2 cpow4(vec2 a) {
        return cmul(a, cpow3(a));
    }

    vec2 cpow5(vec2 a) {
        return cmul(a, cpow4(a));
    }

    vec2 cpow6(vec2 a) {
        return cmul(a, cpow5(a));
    }

    vec2 cpow(vec2 a, vec2 exp) {
        if (exp.y != 0.0) return vec2(0.0, 0.0); // TODO implement
        
        if (exp.x == 2.0) return cmul(a, a);
        if (exp.x == 3.0) return cpow3(a);
        if (exp.x == 4.0) return cpow4(a);
        if (exp.x == 5.0) return cpow5(a);
        if (exp.x == 6.0) return cpow6(a);
    }`;
}

export function createShaderMaterial(
    computeFragmentShader: string,
    uniforms: any = {}
) {
    let material = new ShaderMaterial({
        uniforms,
        vertexShader: vertexShader(),
        fragmentShader: computeFragmentShader
    });
    return material;
}