import { useState, useEffect } from "react";

export default function useScreenSize(onResize?: (width: number, heigth: number) => void) {
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    useEffect(() => {
        function _onResize() {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
            if (onResize) onResize(window.innerWidth, window.innerHeight);
        }

        window.addEventListener("resize", _onResize);
        window.addEventListener("load", _onResize);
        window.addEventListener("orientationchange", _onResize);
        return function () {
            window.removeEventListener("resize", _onResize);
            window.removeEventListener("load", _onResize);
            window.removeEventListener("orientationchange", _onResize);
        };
    });
    return { height, width };
}
