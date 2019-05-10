import { MathNode } from "mathjs";

enum Operator {
    "+" = "+",
    "-" = "-",
    "*" = "*",
    "/" = "/",
    "^" = "^"
}

enum Function {
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
    "log" = "log"
}

enum Symbol {
    "i" = "i",
    "PI" = "PI",
    "pi" = "pi",
    "e" = "e",
    "E" = "e"
}

function toOp(op: string | undefined): Operator {
    if (!Object.values(Operator).includes(op)) throw "Unsupported operator " + op;
    return Operator[op as keyof typeof Operator];
}

function toFunction(func: string | undefined): Function {
    if (!Object.values(Function).includes(func)) throw "Unsupported function " + func;
    return Function[func as keyof typeof Function];
}

function toSymbol(symb: string | undefined): Symbol | undefined {
    if (!Object.values(Symbol).includes(symb)) return undefined;
    return Symbol[symb as keyof typeof Symbol];
}

export function getDependantVariable(expr: MathNode) {
    const variables = Array.from(new Set(expr.filter((n, path) =>
        n.isSymbolNode && path !== "fn"
    ).map(n => n.name!)))
    .filter(c => !Object.values(Symbol).includes(c));

    if (variables.length < 1) throw "No variable in expression";
    if (variables.length > 1) throw "Too many variables in expression";

    return variables[0];
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

function mathToGLSL(node: MathNode): string {
    switch (node.type) {
        case 'OperatorNode':
            return operatorAsGLSL(node.args, toOp(node.op));
        case 'ConstantNode':
            return constantAsGLSL(node.value);
        case 'SymbolNode':
            const symb = toSymbol(node.name);
            if (symb) return symbolAsGLSL(symb);
            else return "" + node.name;
        case 'FunctionNode':
            return functionAsGLSL(node.args, toFunction(node.name));
        case 'ParenthesisNode':
            return `(${mathToGLSL((node as any).content)})`;
        default: throw "Unsupported node type " + node.type;
    }
}


function operatorAsGLSL(
    args: MathNode[] | undefined,
    op: Operator
): string {

    if (args == undefined)
        throw "Invalid arguments for op " + op;

    if (args.length == 1) {
        const arg = args[0];
        switch (op) {
            case Operator["-"]:
                return `-${mathToGLSL(arg)}`;
            default:
                throw "Unimplemented operation " + op + " with 1 argument " + arg;
        }
    } else if (args.length == 2) {
        const [arg1, arg2] = args;
        switch (op) {
            case Operator["+"]:
                return `(${mathToGLSL(arg1)} + ${mathToGLSL(arg2)})`;
            case Operator["-"]:
                return `(${mathToGLSL(arg1)} - ${mathToGLSL(arg2)})`
            case Operator["*"]:
                return `cmul(${mathToGLSL(arg1)}, ${mathToGLSL(arg2)})`;
            case Operator["/"]:
                return `cdiv(${mathToGLSL(arg1)}, ${mathToGLSL(arg2)})`;
            case Operator["^"]:
                return `cpow(${mathToGLSL(arg1)}, ${mathToGLSL(arg2)})`;
            default:
                throw "Unimplemented operator " + op + " with 2 arguments " + arg1 + " " + arg2;
        }
    } else {
        throw "Too many arguments for operator " + args.join(", ");
    }
}

function functionAsGLSL(
    args: MathNode[] | undefined,
    func: Function
): string {

    if (args == undefined)
        throw "Invalid arguments " + args;

    switch (func) {
        case Function.sin:
            if (args.length !== 1) throw "Wrong number of arguments for sin";
            return `csin(${mathToGLSL(args[0])})`;
        case Function.asin:
            if (args.length !== 1) throw "Wrong number of arguments for asin";
            return `casin(${mathToGLSL(args[0])})`;
        case Function.sinh:
            if (args.length !== 1) throw "Wrong number of arguments for sinh";
            return `csinh(${mathToGLSL(args[0])})`;

        case Function.cos:
            if (args.length !== 1) throw "Wrong number of arguments for cos";
            return `ccos(${mathToGLSL(args[0])})`;
        case Function.acos:
            if (args.length !== 1) throw "Wrong number of arguments for acos";
            return `cacos(${mathToGLSL(args[0])})`;
        case Function.cosh:
            if (args.length !== 1) throw "Wrong number of arguments for cosh";
            return `ccosh(${mathToGLSL(args[0])})`;

        case Function.tan:
            if (args.length !== 1) throw "Wrong number of arguments for tan";
            return `ctan(${mathToGLSL(args[0])})`;
        case Function.tanh:
            if (args.length !== 1) throw "Wrong number of arguments for tanh";
            return `ctanh(${mathToGLSL(args[0])})`;
        case Function.atan:
            if (args.length !== 1) throw "Wrong number of arguments for atan";
            return `catan(${mathToGLSL(args[0])})`;

        case Function.cot:
            if (args.length !== 1) throw "Wrong number of arguments for cot";
            return `ccot(${mathToGLSL(args[0])})`;
        case Function.acot:
            if (args.length !== 1) throw "Wrong number of arguments for acot";
            return `cacot(${mathToGLSL(args[0])})`;

        case Function.sec:
            if (args.length !== 1) throw "Wrong number of arguments for sec";
            return `csec(${mathToGLSL(args[0])})`;
        case Function.acot:
            if (args.length !== 1) throw "Wrong number of arguments for asec";
            return `casec(${mathToGLSL(args[0])})`;

        case Function.csc:
            if (args.length !== 1) throw "Wrong number of arguments for csc";
            return `ccot(${mathToGLSL(args[0])})`;
        case Function.acsc:
            if (args.length !== 1) throw "Wrong number of arguments for acsc";
            return `cacsc(${mathToGLSL(args[0])})`;


        case Function.sqrt:
            if (args.length !== 1) throw "Wrong number of arguments for sqrt";
            return `csqrt(${mathToGLSL(args[0])})`;
        case Function.abs:
            if (args.length !== 1) throw "Wrong number of arguments for abs";
            return `cabs(${mathToGLSL(args[0])})`;
        case Function.exp:
            if (args.length !== 1) throw "Wrong number of arguments for exp";
            return `cexp(${mathToGLSL(args[0])})`;
        case Function.ln:
        case Function.log:
            if (args.length !== 1) throw "Wrong number of arguments for log";
            return `cln(${mathToGLSL(args[0])})`;

        default:
            throw "Unimplemented function " + func;
    }
}

function symbolAsGLSL(
    symbol: Symbol
) {
    switch (symbol) {
        case Symbol.i:
            return "i";

        case Symbol.PI:
        case Symbol.pi:
            return "pi";

        case Symbol.e:
        case Symbol.E:
            return "e";

        default:
            throw "Unsupported symbol " + symbol;
    }
}

function constantAsGLSL(
    val: any | undefined
) {
    // Most likely not needed
    const floatFormatted = Math.floor(val) === val ? val.toFixed(1) : val;
    // Normal values are simply 3 <number>
    return `vec2(${floatFormatted}, 0.0)`;
}