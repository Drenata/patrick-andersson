import React, { useCallback, useEffect, useRef, useState } from "react";
import { Line, Material, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { ConfigButton, FullscreenButton, NextButton, ResetButton } from "../../components/buttons";
import useScreenSize from "../../components/hooks/screensize";
import { LSystem } from "./LSystem";
import { LSystemModal } from "./LSystemModal";

export function LSystemContainer() {
    const camera = useRef(new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000000));
    const renderer = useRef(new WebGLRenderer());
    const scene = useRef(new Scene());
    const mountRef = useRef<HTMLDivElement>(null);
    const panZoom = useRef<any>();
    const lines = useRef<Line[]>([]);
    const animationRef = useRef<number>();

    useScreenSize((width, height) => {
        camera.current.aspect = width / height;
        camera.current.updateProjectionMatrix();
        renderer.current.setSize(width, height);
    });

    const [isConfigOpen, setIsConfigOpen] = useState(true);

    //const [isActive, setIsActibe] = useState(true);
    const lSystemRef = useRef(new LSystem({}, "", {}));

    const update = useCallback(() => {
        if (true /*isActive*/) {
            animationRef.current = requestAnimationFrame(update);
            renderer.current.render(scene.current, camera.current);
        }
    }, []);

    const clearScene = () => {
        scene.current.remove(...lines.current);
        lines.current.map((l) => l.geometry.dispose());
        lines.current.map((l) => (l.material as Material).dispose());
    };

    const resetLevel = () => {
        clearScene();
        lSystemRef.current.evolveTo(0);
        lines.current = lSystemRef.current.getLine();
        lines.current.map((l) => scene.current!.add(l));
    };

    const loadLSystem = (lSystem: LSystem) => {
        lSystemRef.current = lSystem;
        resetLevel();
        setIsConfigOpen(false);
    };

    const nextLevel = () => {
        clearScene();
        lSystemRef.current.produce();
        lines.current = lSystemRef.current.getLine();
        lines.current.map((l) => scene.current.add(l));
    };

    useEffect(() => {
        panZoom.current = require("three.map.control")(camera.current, mountRef.current);
        renderer.current.setSize(window.innerWidth, window.innerHeight);
        mountRef.current?.appendChild(renderer.current.domElement);

        camera.current.position.z = 5;
        update();
        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            mountRef.current?.removeChild(renderer.current.domElement);
            panZoom.current.dispose();
            cancelAnimationFrame(animationRef.current!);
            //this.active = false;
        };
    }, [update]);

    return (
        <>
            <div id="canvas-div" ref={mountRef} />
            <LSystemModal isOpen={isConfigOpen} onLoad={loadLSystem} />
            <div id="controls-container">
                <NextButton onClick={nextLevel} />
                <ResetButton onClick={resetLevel} />
                <ConfigButton onClick={() => setIsConfigOpen(true)} />
                <FullscreenButton />
            </div>
        </>
    );
}
