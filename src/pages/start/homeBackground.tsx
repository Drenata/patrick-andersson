import React, { useEffect, useRef, useState } from "react";
import { ConfigButton, FullscreenButton, NextButton, PreviousButton } from "../../components/buttons";
import useScreenSize from "../../components/hooks/screensize";
import { HeightmapLines } from "./backgrounds/HeightmapLines";
import { Background } from "./backgrounds/IBackground";
import { Rain } from "./backgrounds/Rain";
import { Sphere } from "./backgrounds/Sphere";
import { ThirdPolynomialBars } from "./backgrounds/ThirdPolynomialBars";

function useBackground(canvas: React.RefObject<HTMLCanvasElement>) {
    const numBGs = 4;

    function getNewBackground(index: number): [number, Background] {
        canvas.current?.getContext("2d")!.setTransform(1, 0, 0, 1, 0, 0);
        let bg: Background;
        switch (index) {
            case 0:
                bg = new ThirdPolynomialBars(40);
                break;
            case 1:
                bg = new HeightmapLines();
                break;
            case 2:
                bg = new Sphere();
                break;
            case 3:
                bg = new Rain();
                break;
            default:
                bg = new ThirdPolynomialBars(40);
        }
        return [index, bg];
    }
    const [[index, background], setBackground] = useState(getNewBackground(Math.floor(Math.random() * numBGs)));
    const next = () => setBackground(getNewBackground((index + 1) % numBGs));
    const prev = () => setBackground(getNewBackground(index === 0 ? numBGs - 1 : index - 1));
    return { background, next, prev };
}

export function HomeBackground() {
    const canvas = useRef<HTMLCanvasElement>(null);
    const { width, height } = useScreenSize();

    const accum = useRef(0);
    const requestRef = useRef<number>();
    const { background, next, prev } = useBackground(canvas);
    const [drawOptions, setDrawOptions] = useState(false);

    function update(time: number) {
        // do not use real time, use accumulated time.
        // E.g. slow down the simulation if we are lagging
        // instead of actually lagging
        accum.current += 1 / 60;
        if (canvas.current) {
            background.draw(
                accum.current,
                canvas.current.getContext("2d")!,
                canvas.current.width,
                canvas.current.height
            );
            requestRef.current = requestAnimationFrame(update);
        }
    }

    useEffect(() => {
        requestRef.current = requestAnimationFrame(update);
        return () => cancelAnimationFrame(requestRef.current!);
    });

    const optionControls =
        background && drawOptions ? (
            <div className="bg-controller">
                <background.optionControls />
            </div>
        ) : undefined;
    return (
        <React.Fragment>
            <div className="content">
                <div className="z-one">
                    <a href="https://github.com/Drenata">Github</a>
                </div>
                <div className="z-one">
                    <a href="https://www.linkedin.com/in/patrick-andersson-8755bab4/">LinkedIn</a>
                </div>
            </div>
            <div id="canvas-div">
                <canvas ref={canvas} width={width} height={height} />
            </div>
            <div id="controls-container">
                <PreviousButton onClick={prev} />
                <NextButton onClick={next} />
                <ConfigButton onClick={() => setDrawOptions((x) => !x)} />
                <FullscreenButton />
            </div>
            {optionControls}
        </React.Fragment>
    );
}
