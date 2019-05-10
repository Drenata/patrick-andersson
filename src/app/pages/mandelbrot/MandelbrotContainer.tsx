import { GPU, Kernel } from "gpu.js";
import * as React from "react";
import { slide as Menu } from "react-burger-menu";
import { FullscreenButton } from "../../components/buttons";
import { CameraState, panzoomWrapper } from "../../util/panzoomWrapper";
import { resizeGraphicalKernel } from "../../webgl/gpujs";
import { createMandelbrotKernel } from "./mandelbrotKernel";

interface MandelbrotState extends CameraState {
    isDrawerOpen: boolean;
    maxIterations: number;
    colorScheme: number;
}

export class MandelbrotContainer extends React.Component<{}, MandelbrotState, any> {
    canvas: HTMLCanvasElement;

    colorSchemes: [number, string][] = [[0, "Green"], [1, "Wikipedia"], [2, "Greyscale"]];
    active = true;
    invalidated = true;
    gpu: GPU;
    kernel: Kernel;
    cleanup: (() => void)[] = [];

    constructor(props: {}) {
        super(props);

        const initialScale = 0.003;

        this.state = {
            height: window.innerHeight,
            width: window.innerWidth,
            isDrawerOpen: false,
            colorScheme: 0,
            maxIterations: 700,
            offsetX: 1.2 * initialScale * -window.innerWidth / 2,
            offsetY: initialScale * window.innerHeight / 2,
            scaleX: initialScale,
            scaleY: initialScale,
        };
    }

    onWindowResize() {
        this.setState({
            height: window.innerHeight,
            width: window.innerWidth,
        }, () => {
            this.invalidated = true;

            this.canvas.width = this.state.width;
            this.canvas.height = this.state.height;
            resizeGraphicalKernel(this.kernel, this.state.width, this.state.height);
        });
    }

    componentDidMount() {
        window.addEventListener("resize", this.onWindowResize.bind(this, false));
        window.addEventListener("orientationchange", this.onWindowResize.bind(this, false));
        window.addEventListener("load", this.onWindowResize.bind(this, false));

        this.canvas = document.getElementById("canvas-div")!
            .appendChild(
                document.createElement("canvas"),
            );

        this.cleanup.push(
            panzoomWrapper(this, this.canvas, () => this.invalidated = true),
        );

        this.gpu = new GPU({
            canvas: this.canvas,
            mode: "webgl",
            format: "Float32Array",
        });
        this.kernel = createMandelbrotKernel(this.gpu,
            {
                x: window.screen.availWidth,
                y: window.screen.availHeight,
            });

        // @ts-ignore
        this.cleanup.push(() => this.kernel.destroy());
        this.cleanup.push(() => this.gpu.destroy());

        requestAnimationFrame(() => this.update());
    }

    update() {
        if (this.active && this.canvas) {
            if (this.invalidated) {
                this.kernel.run(
                    this.state.width, this.state.height,
                    this.state.offsetX, this.state.offsetY,
                    this.state.scaleX, this.state.scaleY,
                    this.state.maxIterations, this.state.colorScheme);
                this.invalidated = false;
            }
            requestAnimationFrame(() => this.update());
        }
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onWindowResize);
        window.removeEventListener("orientationchange", this.onWindowResize);
        window.removeEventListener("load", this.onWindowResize);
        this.cleanup.map(c => c());
        this.active = false;
    }

    updateUniforms(colorScheme: number, maxIterations: number) {
        this.setState({
            colorScheme,
            maxIterations,
        }, () => this.invalidated = true);
    }

    render() {
        const radioButtons = this.colorSchemes.map(([v, n]) => (
            <label key={v}>
                <input
                    type="radio"
                    name="color-scheme"
                    value={v}
                    checked={this.state.colorScheme === v}
                    onChange={() => this.updateUniforms(v, this.state.maxIterations)}
                />
                {" "}{n}
            </label>
        ));
        return (
            <React.Fragment>
                <Menu
                    width={this.state.width >= 400 ? "400px" : "85%"}
                    isOpen={this.state.isDrawerOpen}
                    onStateChange={state => { this.setState({ isDrawerOpen: state.isOpen }); }}
                >
                    <h1>Mandelbrot</h1>
                    <div>
                        <h2>Iterations</h2>
                        <input
                            type="range"
                            className="slider"
                            min="1"
                            max="3000"
                            value={this.state.maxIterations}
                            onChange={e => this.updateUniforms(this.state.colorScheme, parseInt(e.currentTarget.value))}
                        />
                    </div>
                    <div>
                        <h2>Color scheme</h2>
                        {radioButtons}
                    </div>
                </Menu>
                <div id="canvas-div" />
                <div id="controls-container">
                    <FullscreenButton />
                </div>
            </React.Fragment>
        );
    }
}
