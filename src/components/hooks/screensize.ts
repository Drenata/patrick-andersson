import { useState, useEffect } from "react";

export default function useScreenSize() {
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    useEffect(() => {
        function onResize() {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        }

        window.addEventListener("resize", onResize);
        window.addEventListener("load", onResize);
        return function () {
            window.removeEventListener("resize", onResize);
            window.removeEventListener("load", onResize);
        };
    });
    return { height, width };
}
