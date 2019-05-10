import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import { CitationGraphContainer } from "./pages/citation-graph/CitationGraphContainer";
import { LSystemContainer } from "./pages/lsystem/LSystemContainer";
import { MandelbrotContainer } from "./pages/mandelbrot/MandelbrotContainer";
import { NewtonContainer } from "./pages/newton/NewtonContainer";
import { HomeBackground } from "./pages/start/homeBackground";

ReactDOM.render((
    <BrowserRouter>
        <div style={{ height: "100%" }}>
            <Switch>
                <Route path="/mandelbrot" component={MandelbrotContainer} />,
                <Route path="/lsystem" component={LSystemContainer} />,
                <Route path="/citation-graph($$.*)*" component={CitationGraphContainer} />,
                <Route path="/newton" component={NewtonContainer} />,
                <Route component={HomeBackground} />,
            </Switch>
            <div className="projects">
                <div><Link to="/">Start</Link></div>
                <div><Link to="/mandelbrot">Mandelbrot</Link></div>
                <div><Link to="/lsystem">L-system</Link></div>
                <div><Link to="/citation-graph">Citation graph</Link></div>
                <div><Link to="/newton">Newton</Link></div>
            </div>
        </div>
    </BrowserRouter>
),
document.getElementById("root"),
);
