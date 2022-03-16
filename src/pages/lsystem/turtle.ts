import { BufferAttribute, BufferGeometry, LineBasicMaterial, Line } from "three";
import { Color } from "../../util/color";

export enum TurtleCommandTypes {
    MOVE,
    ROTATE,
    PUSH,
    POP,
}

export interface TurtleCommand {
    command: TurtleCommandTypes;
    argument: number;
}

export interface TurtleCommandMap {
    [symbol: string]: TurtleCommand[];
}
export interface CompiledTurtleCommandMap {
    [symbol: number]: TurtleCommand[];
}

type TurtlePosition = [number, number, number];
type TurtleOrientation = number;
type TurtleState = [TurtlePosition, TurtleOrientation];

export class TurtleGraphics {
    static getLine(input: Uint8Array, commandMap: CompiledTurtleCommandMap) {
        const turtle = new TurtleGraphics();
        turtle.act(input, commandMap);

        if (turtle.positions.length) {
            turtle.lines.push(turtle.positions.slice(0, turtle.l));
        }

        // TODO you could probably compact the lines if you filtered out on points
        // on a line to only include corners
        const geometries = turtle.lines.map((line) =>
            new BufferGeometry().setAttribute("position", new BufferAttribute(line, 3))
        );

        const material = new LineBasicMaterial({ color: 0xffffff });
        return geometries.map((geometry) => new Line(geometry, material));
    }

    location: TurtlePosition;
    orientation: TurtleOrientation;
    color: Color;
    width: number;
    stateStack: TurtleState[];
    lines: Float32Array[];
    positions: Float32Array;
    l: number;

    constructor() {
        this.location = [0, 0, 0];
        this.orientation = 90 * 0.0174532925;
        this.color = new Color(255, 0, 0, 1);
        this.width = 1;
        this.stateStack = [];
        this.lines = [];
        this.positions = new Float32Array(2 ** 28);
        this.l = 0;
        this.positions[this.l++] = 0;
        this.positions[this.l++] = 0;
        this.positions[this.l++] = 0;
    }

    act(input: Uint8Array, commandMap: CompiledTurtleCommandMap) {
        for (let i = 0; i < input.length; i++) {
            const symbol = input[i];
            for (const command of commandMap[symbol]) {
                switch (command.command) {
                    case TurtleCommandTypes.MOVE:
                        this.location = [
                            this.location[0] + Math.cos(this.orientation) * command.argument,
                            this.location[1] + Math.sin(this.orientation) * command.argument,
                            0,
                        ];

                        this.positions[this.l++] = this.location[0];
                        this.positions[this.l++] = this.location[1];
                        this.positions[this.l++] = this.location[2];
                        break;

                    case TurtleCommandTypes.ROTATE:
                        this.orientation += command.argument * 0.0174532925;
                        break;

                    case TurtleCommandTypes.PUSH:
                        this.stateStack.push([this.location, this.orientation]);
                        break;

                    case TurtleCommandTypes.POP:
                        if (this.positions.length) {
                            this.lines.push(this.positions.slice(0, this.l));
                            this.l = 0;
                        }
                        const state = this.stateStack.pop();
                        if (state) {
                            this.location = state[0];
                            this.orientation = state[1];
                            this.positions[this.l++] = this.location[0];
                            this.positions[this.l++] = this.location[1];
                            this.positions[this.l++] = this.location[2];
                        }
                        break;
                }
            }
        }
    }
}
