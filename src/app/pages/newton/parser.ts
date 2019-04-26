import { parse as llParse, derivative, parser } from "mathjs";

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
    "sqrt" = "sqrt",
}

enum Symbol {
    "i" = "i",
    "PI" = "PI",
    "pi" = "pi"
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

export function compileToHLSL(expr: string): [string, string] {
    const f = llParse(expr);

    const variables = Array.from(new Set(f.filter((n, path, parent) =>
        n.isSymbolNode && path !== "fn"
    ).map(n => n.name!)));

    if (variables.length < 1) throw "No variable in expression";
    if (variables.length > 1) throw "Too many variables in expression";

    const df = derivative(f, variables[0]);


    return [mathToHLSL(f), mathToHLSL(df)];
}

function mathToHLSL(node: math.MathNode): string {
    switch (node.type) {
        case 'OperatorNode':
            return operatorAsHLSL(node.args, toOp(node.op));
        case 'ConstantNode':
            return constantAsHLSL(node.value);
        case 'SymbolNode':
            const symb = toSymbol(node.name);
            if (symb) return symbolAsHLSL(symb);
            else return "" + node.name;
        case 'FunctionNode':
            return functionAsHLSL(node.args, toFunction(node.name));
        case 'ParenthesisNode':
            return `(${mathToHLSL((node as any).content)})`;
        default: throw "Unsupported node type " + node.type;
    }
}


function operatorAsHLSL(
    args: math.MathNode[] | undefined,
    op: Operator
): string {

    if (args == undefined)
        throw "Invalid arguments for op " + op;

    if (args.length == 1) {
        const arg = args[0];
        switch (op) {
            case Operator["-"]:
                return `-${mathToHLSL(arg)}`;
            default:
                throw "Unimplemented operation " + op + " with 1 argument " + arg;
        }
    } else if (args.length == 2) {
        const [arg1, arg2] = args;
        switch (op) {
            case Operator["+"]:
                return `(${mathToHLSL(arg1)} + ${mathToHLSL(arg2)})`;
            case Operator["-"]:
                return `(${mathToHLSL(arg1)} - ${mathToHLSL(arg2)})`
            case Operator["*"]:
                return `cmul(${mathToHLSL(arg1)}, ${mathToHLSL(arg2)})`;
            case Operator["/"]:
                return `cdiv(${mathToHLSL(arg1)}, ${mathToHLSL(arg2)})`;
            case Operator["^"]:
                return `cpow(${mathToHLSL(arg1)}, ${mathToHLSL(arg2)})`;
            default:
                throw "Unimplemented operator " + op + " with 2 arguments " + arg1 + " " + arg2;
        }
    } else {
        throw "Too many arguments for operator " + args.join(", ");
    }
}

function functionAsHLSL(
    args: math.MathNode[] | undefined,
    func: Function
): string {

    if (args == undefined)
        throw "Invalid arguments " + args;

    switch (func) {
        case Function.sin:
            if (args.length !== 1) throw "More than one argument for sin";
            return `csin(${mathToHLSL(args[0])})`;
        case Function.cos:
            if (args.length !== 1) throw "More than one argument for cos";
            return `ccos(${mathToHLSL(args[0])})`;
        case Function.sqrt:
            if (args.length !== 1) throw "More than one argument for sqrt";
            return `csqrt(${mathToHLSL(args[0])})`;

        default:
            throw "Unimplemented function " + func;
    }
}

function symbolAsHLSL(
    symbol: Symbol
) {
    switch (symbol) {
        case Symbol.i:
            return "vec2(0, 1.0)";

        case Symbol.PI:
        case Symbol.pi:
            return "vec2(PI, 0.0)";
        default:
            throw "Unsupported symbol " + symbol;
    }
}

function constantAsHLSL(
    val: any | undefined
) {
    // Most likely not needed
    const floatFormatted = Math.floor(val) === val ? val.toFixed(1) : val;
    // Normal values are simply 3 <number>
    return `vec2(${floatFormatted}, 0.0)`;
}