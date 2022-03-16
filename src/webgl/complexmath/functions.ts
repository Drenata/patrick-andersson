/**
 * This file contains source GLSL complex math functions
 */

export const constants = `
    #define PI ${Math.PI}
    #define E ${Math.E}
    const vec2 pi = vec2(PI, 0.0);
    const vec2 e = vec2(E, 0.0);
    const vec2 i = vec2(0.0, 1.0);
    const vec2 one = vec2(1.0, 0.0);
 `;

export const cpol = `vec2 cpol(float rho, float theta) {
    return vec2(
        rho * cos(theta),
        rho * sin(theta)
    );
}`;

export const carg = `float carg(vec2 a) {
    return atan(a.y, a.x);
}`;

export const cconj = `vec2 cconj(vec2 a) {
    return vec2(a.x, -a.y);
}`;

export const cabs = `float cabs(vec2 a) {
    return length(a);
}`;

export const cmul = `vec2 cmul(vec2 a, vec2 b) {
    return vec2(
        a.x * b.x - a.y * b.y,
        a.x * b.y + a.y * b.x
    );
}`;

export const cdiv = `vec2 cdiv(vec2 a, vec2 b) {
    float divisor = dot(b, b);
    if (divisor == 0.0) return vec2(99999999, 99999999);
    return vec2(
        dot(a, b),
        (a.y * b.x - a.x * b.y)
    ) / divisor;
}`;

export const cexp = `vec2 cexp(vec2 a) {
    return cpol(
        exp(a.x),
        a.y
    );
}`;

export const cln = `vec2 cln(vec2 a) {
    return vec2(
        log(cabs(a)),
        carg(a)
    );
}`;

export const csqrt = `vec2 csqrt(vec2 z) {

    float r = cabs(z);

    float a = sqrt((r + z.x) / 2.0);
    float b = sqrt((r - z.x) / 2.0);

    return z.y > 0.0
        ? vec2(a, b)
        : vec2(a, -b);
}`;

export const csin = `vec2 csin(vec2 a) {
    return vec2(
        sin(a.x) * cosh(a.y),
        cos(a.x) * sinh(a.y)
    );
}`;

export const casin = `vec2 casin(vec2 a) {
    return cmul(
        -i,
        cln(
            cmul(i, a) + csqrt(one - cmul(a, a))
        )
    );
}`;

export const csinh = `vec2 csinh(vec2 a) {
    return vec2(
        sinh(a.x) * cos(a.y),
        cosh(a.x) * sin(a.y)
    );
}`;

export const ccos = `vec2 ccos(vec2 a) {
    return vec2(
        cos(a.x) * cosh(a.y),
        -sin(a.x) * sinh(a.y)
    );
}`;

export const cacos = `vec2 cacos(vec2 a) {
    return vec2(PI / 2.0, 0.0) - casin(a);
}`;

export const ccosh = `vec2 ccosh(vec2 a) {
    return vec2(
        cosh(a.x) * cos(a.y),
        sinh(a.x) * sin(a.y)
    );
}`;

export const ctan = `vec2 ctan(vec2 a) {
    return cdiv(csin(a), ccos(a));
}`;

export const catan = `vec2 catan(vec2 a) {
    return cmul(
        vec2(0.0, 0.5),
        cln(one - cmul(i, a)) -
        cln(one + cmul(i, a))
    );
}`;

export const ctanh = `vec2 ctanh(vec2 a) {
    return cdiv(csinh(a), ccosh(a));
}`;

export const ccot = `vec2 ccot(vec2 a) {
    return cdiv(one, ctan(a));
}`;

export const cacot = `vec2 cacot(vec2 a) {
    return catan(cdiv(one, a));
}`;

export const csec = `vec2 csec(vec2 a) {
    return cdiv(one, ccos(a));
}`;

export const casec = `vec2 casec(vec2 a) {
    return cacos(cdiv(one, a));
}`;

export const ccsc = `vec2 ccsc(vec2 a) {
    return cdiv(one, csin(a));
}`;

export const cacsc = `vec2 cacsc(vec2 a) {
    return casin(cdiv(one, a));
}`;

export const cpow = `vec2 cpow(vec2 a, vec2 exp) {
    return cexp(cmul(exp, cln(a)));
}`;

export function getAll() {
    return {
        constants,

        cpol,
        carg,
        cconj,
        cabs,

        cmul,
        cdiv,

        cexp,
        cln,

        csqrt,
        cpow,

        csin,
        casin,
        csinh,

        ccos,
        cacos,
        ccosh,

        ctan,
        catan,
        ctanh,

        ccot,
        cacot,

        csec,
        casec,

        ccsc,
        cacsc,
    };
}
