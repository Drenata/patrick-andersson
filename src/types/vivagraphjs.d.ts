export namespace Graph {
    const BrowserInfo: {
        browser: string;
        version: string;
    };
    namespace Input {
        function domInputManager(graph: any, graphics: any): any;
        function webglInputManager(graph: any, graphics: any): any;
    }
    namespace Layout {
        function constant(graph: any, userSettings: any): any;
        function forceDirected(graph: any, physicsSettings: any): any;
        namespace forceDirected {
            function simulator(settings: any): any;
        }
    }
    class Rect {
        constructor(x1: any, y1: any, x2: any, y2: any);
        x1: any;
        y1: any;
        x2: any;
        y2: any;
    }
    namespace Utils {
        function dragndrop(element: any): any;
        function events(g: any): any;
        function findElementPosition(obj: any): any;
        function getDimension(container: any): any;
        function timer(callback: any): any;
    }
    namespace View {
        class Texture {
            constructor(size: any);
            canvas: any;
            ctx: any;
            isDirty: any;
        }
        function community(): void;
        function cssGraphics(): void;
        function renderer(graph: any, settings: any): any;
        function svgGraphics(): any;
        function svgNodeFactory(): void;
        function webglAtlas(tilesPerTexture: any): any;
        function webglGraphics(options: any): any;
        function webglImage(size: any, src: any): any;
        function webglImageNodeProgram(): any;
        function webglLine(color: any): any;
        function webglLinkProgram(): any;
        function webglNodeProgram(): any;
        function webglSquare(size: any, color: any): any;
    }
    function centrality(): any;
    function generator(): any;
    function geom(): any;
    function graph(options?: any): any;
    function operations(): any;
    function serializer(): any;
    function svg(element: any, attrBag?: any): any;
    namespace svg {
        function compile(svgText: any): any;
        function compileTemplate(domNode: any): any;
    }
    const version: string;
    function webgl(gl: any): any;
    function webglInputEvents(webglGraphics: any): any;
}
export function events(subject: any): any;
export function lazyExtend(...args: any[]): any;
export function random(...args: any[]): any;
export function randomIterator(...args: any[]): any;
