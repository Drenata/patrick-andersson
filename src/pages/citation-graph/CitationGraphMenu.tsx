import * as React from "react";
import { slide as Menu, State } from "react-burger-menu";
import { SliderWithDisplay } from "../../components/SliderWithDisplay";
import { Setting, settings, Settings } from "./Settings";

const SettingComponent = (props: {
    setting: Setting;
    onInput: (v: number) => void;
}) => (
        <div>
            <h2>{props.setting.name}</h2>
            <SliderWithDisplay
                min={props.setting.min}
                max={props.setting.max}
                step={props.setting.step}
                initialValue={props.setting.initialValue}
                onInput={e => props.onInput(parseFloat(e.currentTarget.value))}
            />
        </div>
    );

const RenderSettings = (props: {
    onInput: (key: keyof Settings, v: number) => void;
}) =>
    <React.Fragment>
        {(Object.keys(settings) as Array<keyof Settings>)
            .map((key) => (
                <SettingComponent
                    key={key}
                    setting={settings[key]}
                    onInput={v => props.onInput(key, v)}
                />
            ))}
    </React.Fragment>
    ;

export const CitationGraphMenu = (props: {
    width: number;
    isMenuOpen: boolean;
    onStateChange: (state: State) => void;
    numNodes: number;
    numEdges: number;
    onRestart: () => void;
    onDownloadSVG: () => void;
    onSettingInput: (key: keyof Settings, v: number) => void;
}) => (
        <Menu
            width={props.width >= 400 ? "400px" : "85%"}
            isOpen={props.isMenuOpen}
            onStateChange={props.onStateChange}
        >
            <RenderSettings
                onInput={props.onSettingInput}
            />
            <div id="spacer" style={{ flexGrow: 1 }} />
            <p>Nodes: {props.numNodes}<br />
            Edges: {props.numEdges}
            </p>
            <a
                className="a-btn"
                onClick={props.onRestart}
            >
                Restart
        </a>
            <a
                className="a-btn"
                onClick={props.onDownloadSVG}
            >
                Download SVG
        </a>
            <div>
                The data used in this graph is from <a href="http://semanticscholar.org">Semantic Scholar</a>.
            The graph library used is <a href="https://github.com/anvaka/VivaGraphJS">VivaGraphJS</a>.
        </div>
        </Menu>
    );
