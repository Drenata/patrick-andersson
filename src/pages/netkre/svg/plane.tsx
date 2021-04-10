import * as React from "react";

interface PlaneProps {
    cellsX: number;
    cellsY: number;
    cellSize: number;
    strokeWidth: number;
    strokeColor?: string;
    fillColor?: string;
}
export const Plane = ({ cellsX, cellsY, cellSize, strokeWidth, strokeColor = "black", fillColor = "none" }: PlaneProps) => (
    <svg
        width={cellSize * cellsX + 1}
        height={cellSize * cellsY + 1}
        xmlns="http://www.w3.org/2000/svg"
        style={{ backgroundColor: fillColor }}
    >
        <defs>
            <pattern
                id="smallGrid"
                width={cellSize}
                height={cellSize}
                patternUnits="userSpaceOnUse"
            >
                <path
                    d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`}
                    stroke={strokeColor}
                    fill="none"
                    strokeWidth={strokeWidth} />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#smallGrid)" />
    </svg>
);