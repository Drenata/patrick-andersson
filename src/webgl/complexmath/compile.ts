import { MathNode } from "mathjs";

enum Operator {
    "+" = "+",
    "-" = "-",
    "*" = "*",
    "/" = "/",
    "^" = "^",
}

enum MathFunction {
    "sin" = "sin",
    "cos" = "cos",
    "tan" = "tan",
    "sqrt" = "sqrt",
    "cosh" = "cosh",
    "sinh" = "sinh",
    "tanh" = "tanh",
    "asin" = "asin",
    "acos" = "acos",
    "atan" = "atan",
    "cot" = "cot",
    "sec" = "sec",
    "csc" = "csc",
    "acot" = "acot",
    "asec" = "asec",
    "acsc" = "acsc",
    "abs" = "abs",
    "exp" = "exp",
    "ln" = "ln",
    "log" = "log",
}

enum MathSymbol {
    "i" = "i",
    "PI" = "PI",
    "pi" = "pi",
    "e" = "e",
    "E" = "e",
}

function toOp(op: string | undefined): Operator {
    if (!Object.values(Operator).includes(op as Operator)) { throw new Error("Unsupported operator " + op); }
    return Operator[op as Operator];
}

function toFunction(func: string | undefined): MathFunction {
    if (!Object.values(MathFunction).includes(func as MathFunction)) { throw new Error("Unsupported function " + func); }
    return MathFunction[func as MathFunction];
}

function toSymbol(symb: string | undefined): MathSymbol | undefined {
    if (!Object.values(MathSymbol).includes(symb as MathSymbol)) { return undefined; }
    return MathSymbol[symb as MathSymbol];
}

export function getDependantVariable(expr: MathNode) {
    const variables = Array.from(new Set(expr.filter((n, path) =>
        n.isSymbolNode && path !== "fn",
    )
        .map(n => n.name!)))
        .filter(c => !Object.values(MathSymbol).includes(c as MathSymbol));

    if (variables.length < 1) { throw new Error("No variable in expression"); }
    if (variables.length > 1) { throw new Error("Too many variables in expression"); }

    return variables[0];
}

function operatorAsGLSL(
    args: MathNode[] | undefined,
    op: Operator,
): string {

    if (args === undefined) {
        throw new Error("Invalid arguments for op " + op);
    }

    if (args.length === 1) {
        const arg = args[0];
        switch (op) {
            case Operator["-"]:
                return `-${mathToGLSL(arg)}`;
            default:
                throw new Error("Unimplemented operation " + op + " with 1 argument " + arg);
        }
    } else if (args.length === 2) {
        const [arg1, arg2] = args;
        switch (op) {
            case Operator["+"]:
                return `(${mathToGLSL(arg1)} + ${mathToGLSL(arg2)})`;
            case Operator["-"]:
                return `(${mathToGLSL(arg1)} - ${mathToGLSL(arg2)})`;
            case Operator["*"]:
                return `cmul(${mathToGLSL(arg1)}, ${mathToGLSL(arg2)})`;
            case Operator["/"]:
                return `cdiv(${mathToGLSL(arg1)}, ${mathToGLSL(arg2)})`;
            case Operator["^"]:
                return `cpow(${mathToGLSL(arg1)}, ${mathToGLSL(arg2)})`;
            default:
                throw new Error("Unimplemented operator " + op + " with 2 arguments " + arg1 + " " + arg2);
        }
    } else {
        throw new Error("Too many arguments for operator " + args.join(", "));
    }
}

function symbolAsGLSL(
    symbol: MathSymbol,
) {
    switch (symbol) {
        case MathSymbol.i:
            return "i";

        case MathSymbol.PI:
        case MathSymbol.pi:
            return "pi";

        case MathSymbol.e:
        case MathSymbol.E:
            return "e";

        default:
            throw new Error("Unsupported symbol " + symbol);
    }
}

function constantAsGLSL(
    val: any | undefined,
) {
    // Most likely not needed
    const floatFormatted = Math.floor(val) === val ? val.toFixed(1) : val;
    // Normal values are simply 3 <number>
    return `vec2(${floatFormatted}, 0.0)`;
}

function mathToGLSL(node: MathNode): string {
    switch (node.type) {
        case "OperatorNode":
            return operatorAsGLSL(node.args, toOp(node.op));
        case "ConstantNode":
            return constantAsGLSL(node.value);
        case "SymbolNode":
            const symb = toSymbol(node.name);
            if (symb) { return symbolAsGLSL(symb); } else { return "" + node.name; }
        case "FunctionNode":
            return functionAsGLSL(node.args, toFunction(node.name));
        case "ParenthesisNode":
            // Math types incomplete
            return `(${mathToGLSL((node as any).content)})`; // eslint-disable-line
        default: throw new Error("Unsupported node type " + node.type);
    }
}

function functionAsGLSL(
    args: MathNode[] | undefined,
    func: MathFunction,
): string {

    if (args === undefined) {
        throw new Error("Invalid arguments " + args);
    }

    switch (func) {
        case MathFunction.sin:
            if (args.length !== 1) { throw new Error("Wrong number of arguments for sin"); }
            return `csin(${mathToGLSL(args[0])})`;
        case MathFunction.asin:
            if (args.length !== 1) { throw new Error("Wrong number of arguments for asin"); }
            return `casin(${mathToGLSL(args[0])})`;
        case MathFunction.sinh:
            if (args.length !== 1) { throw new Error("Wrong number of arguments for sinh"); }
            return `csinh(${mathToGLSL(args[0])})`;

        case MathFunction.cos:
            if (args.length !== 1) { throw new Error("Wrong number of arguments for cos"); }
            return `ccos(${mathToGLSL(args[0])})`;
        case MathFunction.acos:
            if (args.length !== 1) { throw new Error("Wrong number of arguments for acos"); }
            return `cacos(${mathToGLSL(args[0])})`;
        case MathFunction.cosh:
            if (args.length !== 1) { throw new Error("Wrong number of arguments for cosh"); }
            return `ccosh(${mathToGLSL(args[0])})`;

        case MathFunction.tan:
            if (args.length !== 1) { throw new Error("Wrong number of arguments for tan"); }
            return `ctan(${mathToGLSL(args[0])})`;
        case MathFunction.tanh:
            if (args.length !== 1) { throw new Error("Wrong number of arguments for tanh"); }
            return `ctanh(${mathToGLSL(args[0])})`;
        case MathFunction.atan:
            if (args.length !== 1) { throw new Error("Wrong number of arguments for atan"); }
            return `catan(${mathToGLSL(args[0])})`;

        case MathFunction.cot:
            if (args.length !== 1) { throw new Error("Wrong number of arguments for cot"); }
            return `ccot(${mathToGLSL(args[0])})`;
        case MathFunction.acot:
            if (args.length !== 1) { throw new Error("Wrong number of arguments for acot"); }
            return `cacot(${mathToGLSL(args[0])})`;

        case MathFunction.sec:
            if (args.length !== 1) { throw new Error("Wrong number of arguments for sec"); }
            return `csec(${mathToGLSL(args[0])})`;
        case MathFunction.asec:
            if (args.length !== 1) { throw new Error("Wrong number of arguments for asec"); }
            return `casec(${mathToGLSL(args[0])})`;

        case MathFunction.csc:
            if (args.length !== 1) { throw new Error("Wrong number of arguments for csc"); }
            return `ccot(${mathToGLSL(args[0])})`;
        case MathFunction.acsc:
            if (args.length !== 1) { throw new Error("Wrong number of arguments for acsc"); }
            return `cacsc(${mathToGLSL(args[0])})`;

        case MathFunction.sqrt:
            if (args.length !== 1) { throw new Error("Wrong number of arguments for sqrt"); }
            return `csqrt(${mathToGLSL(args[0])})`;
        case MathFunction.abs:
            if (args.length !== 1) { throw new Error("Wrong number of arguments for abs"); }
            return `cabs(${mathToGLSL(args[0])})`;
        case MathFunction.exp:
            if (args.length !== 1) { throw new Error("Wrong number of arguments for exp"); }
            return `cexp(${mathToGLSL(args[0])})`;
        case MathFunction.ln:
        case MathFunction.log:
            if (args.length !== 1) { throw new Error("Wrong number of arguments for log"); }
            return `cln(${mathToGLSL(args[0])})`;

        default:
            throw new Error("Unimplemented function " + func);
    }
}

/**
 * Compile a math.js readable string into a GLSL function
 *
 * @param expr Expression to compile into GLSL code
 * @param functionHeader Function header, e.g. `vec4 myFunc(vec3 var)`
 */
export function compileToGLSL(expr: MathNode, functionHeader: string): string {
    return `${functionHeader} {
        return ${mathToGLSL(expr)};
    }`;
}