export interface Setting {
    initialValue: number;
    min: number;
    max: number;
    step: number;
    name: string;
}

export interface Settings {
    springLength: Setting;
    springCoeff: Setting;
    dragCoeff: Setting;
    gravity: Setting;
    theta: Setting;
    // [key: string]: Setting;
}

export const settings: Settings = {
    springLength: {
        initialValue: 10,
        min: 1,
        max: 100,
        step: 1,
        name: "Spring length",
    },
    springCoeff: {
        initialValue: 0.00005,
        min: 0.0000001,
        max: 0.001,
        step: 0.0000001,
        name: "Spring coefficient",
    },
    dragCoeff: {
        initialValue: 0.1,
        min: 0.001,
        max: 0.2,
        step: 0.001,
        name: "Drag coefficient",
    },
    gravity: {
        initialValue: -100,
        min: -200,
        max: 0,
        step: 1,
        name: "Gravity",
    },
    theta: {
        initialValue: 0.5,
        min: 0,
        max: 1,
        step: 0.01,
        name: "Theta",
    },
};
