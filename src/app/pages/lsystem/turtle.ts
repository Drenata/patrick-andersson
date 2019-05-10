import { BufferAttribute, BufferGeometry, LineBasicMaterial, LineSegments, Path } from "three";
import { Color } from "../../util/color";

export enum TurtleCommandTypes {
    MOVE = "Move",
    ROTATE = "Rotate",
    PUSH = "Push state",
    POP = "Pop state",
}

export interface TurtleCommand {
    command: TurtleCommandTypes;
    argument: string;
}

export interface TurtleCommands {
    [symbol: string]: TurtleCommand[];
}

export class TurtleGraphics {

    static getLine(input: string, commandMap: TurtleCommands) {
        const turtle = new TurtleGraphics();
        for (const symbol of input) {
            for (const command of commandMap[symbol]) {
                turtle.act(command);
            }
        }

        const geometry = new BufferGeometry()
            .addAttribute("position", new BufferAttribute(new Float32Array(turtle.positions), 3));
        const material = new LineBasicMaterial({ color: 0xffffff });
        return new LineSegments(geometry, material);
    }

    location: [number, number];
    orientation: number;
    color: Color;
    width: number;
    on: boolean;
    stateStack: [[number, number], number][];
    positions: number[];
    path: Path;

    constructor() {
        this.location = [0, 0];
        this.orientation = 90 * 0.0174532925;
        this.color = new Color(255, 0, 0, 1);
        this.width = 1;
        this.on = true;
        this.stateStack = [];
        this.positions = [];
    }

    move(distance: number) {
        this.positions.push(this.location[0], this.location[1], 0);
        this.location = [
            this.location[0] + Math.cos(this.orientation) * distance,
            this.location[1] + Math.sin(this.orientation) * distance,
        ];
        this.positions.push(this.location[0], this.location[1], 0);
    }

    rotate(degrees: number) {
        this.orientation += degrees * 0.0174532925;
    }

    changeDrawState(enabled: boolean) {
        this.on = enabled;
    }

    pushState() {
        this.stateStack.push([this.location, this.orientation]);
    }

    popState() {
        const state = this.stateStack.pop();
        if (state) {
            this.location = state[0];
            this.orientation = state[1];
        }
    }

    act(command: TurtleCommand) {
        switch (command.command) {
            case TurtleCommandTypes.MOVE: return this.move(parseFloat(command.argument));
            case TurtleCommandTypes.ROTATE: return this.rotate(parseFloat(command.argument));
            case TurtleCommandTypes.PUSH: return this.pushState();
            case TurtleCommandTypes.POP: return this.popState();
        }
    }
}
