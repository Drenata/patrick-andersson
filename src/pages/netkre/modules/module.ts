export type Shape = [number, number, number, number];

export enum PaddingMode {
    "zeros",
    "reflect",
    "replicate",
    "circular"
}

export interface Module {
    shape(): Shape;
    numParameters(): number;
}