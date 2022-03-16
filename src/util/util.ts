/**
 * Maps a continously growing value onto a fixed interval
 */
export class Interval {
    static sample(t: number, a: number, b: number, displacement: number): number {
        return ((t + displacement) % (b - a)) + a;
    }

    static sampleReverse(t: number, a: number, b: number, displacement: number): number {
        return b - this.sample(t, a, b, displacement);
    }

    a: number;
    b: number;
    intervalLength: number;
    displacement: number;

    constructor(a: number, b: number, displacement: number) {
        this.a = a;
        this.b = b;
        this.intervalLength = b - a;
        this.displacement = displacement;
    }

    sample(t: number): number {
        return ((t + this.displacement) % this.intervalLength) + this.a;
    }
}

/**
 * @param a
 * @param b
 * @param x [0, 1]
 */
export function linearInterpolate(a: number, b: number, x: number) {
    return a + (b - a) * x;
}

/**
 * Return a function that maps linearly from one interval to another
 * @param a - Start of first interval
 * @param b - End of first interval
 * @param c - Start of second interval
 * @param d - End of second interval
 */
export function rangeToRange(a: number, b: number, c: number, d: number) {
    return (x: number) => linearInterpolate(c, d, (x - a) / (b - a));
}

/**
 * Chunk a string into sizes of max w length.
 * A word may not be split.
 *
 * @param s string to chunk
 * @param w max amount of characters
 */
export function chunk(s: string, w: number) {
    return s.replace(new RegExp(`(?![^\\n]{1,${w}}$)([^\\n]{1,${w}})\\s`, "g"), "$1\n").split("\n");
}

/**
 * Saves an SVG element to the users computer
 * https://stackoverflow.com/a/38019175
 *
 * @param e <svg> element
 */
export function saveSVG(svg: HTMLElement) {
    let source = svg.outerHTML;
    // add name spaces.
    if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
        // eslint-disable-line
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!source.match(/^<svg[^>]+"http:\/\/www\.w3\.org\/1999\/xlink"/)) {
        // eslint-disable-line
        source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }

    // add xml declaration
    source = '<?xml version="1.0" standalone="yes"?>\r\n' + source;
    const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "image.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

export const removeWhitespaceAndFilter = (str: string, allowed: string[]) =>
    str
        .replace(/\s/g, "")
        .split("")
        .filter((char) => allowed.join().indexOf(char) !== -1)
        .join("");
