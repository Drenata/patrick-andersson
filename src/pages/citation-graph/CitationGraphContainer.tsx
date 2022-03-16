import * as React from "react";
import { RouteComponentProps } from "react-router";
import * as viva from "vivagraphjs";
import { FullscreenButton } from "../../components/buttons";
import { saveSVG } from "../../util/util";
// tslint:disable-next-line: max-line-length
import {
    Article,
    citationGraphLink,
    createMarker,
    getArticle,
    getNodeSVG,
    highlightRelatedNodes,
    triangleSVG,
} from "./citationGraph";
import { CitationGraphMenu } from "./CitationGraphMenu";
import { CitationModal } from "./CitationModal";
import { settings, Settings } from "./Settings";

type CitationGraphProps = RouteComponentProps<{ "0"?: string }>;

interface CitationGraphState {
    showModal: boolean;
    query: string;
    height: number;
    width: number;
    isDrawerOpen: boolean;
    springLength: number;
    springCoeff: number;
    dragCoeff: number;
    gravity: number;
    theta: number;
    includeCommonEdges: boolean;
    numNodes: number;
    numEdges: number;
}

export class CitationGraphContainer extends React.Component<CitationGraphProps, CitationGraphState> {
    g: any;
    graphics: any;
    layout: any;
    renderer: any;
    args: string[] = [];

    articles: { [key: string]: Article } = {};

    constructor(props: CitationGraphProps) {
        super(props);

        const arg = props.match.params[0];
        if (arg) {
            this.args = arg.split("$$").filter((w) => w.length);
        }

        this.state = {
            showModal: true,
            height: window.innerHeight,
            width: window.innerWidth,
            query: "",
            isDrawerOpen: false,
            springLength: settings.springLength.initialValue,
            springCoeff: settings.springCoeff.initialValue,
            dragCoeff: settings.dragCoeff.initialValue,
            gravity: settings.gravity.initialValue,
            theta: settings.theta.initialValue,
            includeCommonEdges: false,
            numNodes: 0,
            numEdges: 0,
        };
    }

    onWindowResize() {
        this.setState({
            height: window.innerHeight,
            width: window.innerWidth,
        });
    }

    componentDidMount() {
        this.g = viva.Graph.graph();

        this.graphics = viva.Graph.View.svgGraphics();

        this.graphics
            .node((node: any) => {
                const title = this.articles[node.id].title;
                const container = getNodeSVG(title);

                container.addEventListener("mouseenter", () => {
                    highlightRelatedNodes(this.g, this.graphics, node.id, true);
                });
                container.addEventListener("mouseleave", () => {
                    highlightRelatedNodes(this.g, this.graphics, node.id, false);
                });

                const firstClick = () => {
                    container.removeEventListener("click", firstClick);
                    this.expandArticle(node.id);
                };
                container.addEventListener("click", firstClick);

                return container;
            })
            .placeNode((nodeUI: any, pos: any) => {
                nodeUI.attr("transform", `translate(${pos.x},${pos.y})`);
            });

        const marker = createMarker("Triangle");
        marker.append(triangleSVG());

        const defs = this.graphics.getSvgRoot().append("defs");
        defs.append(marker);

        this.graphics.link(citationGraphLink).placeLink((linkUI: any, from: any, to: any) => {
            const p1 = `${from.x},${from.y}`;
            const p2 = `${from.x + (to.x - from.x) / 2},${from.y + (to.y - from.y) / 2}`;
            const p3 = `${to.x},${to.y}`;
            linkUI.attr("d", `M${p1}L${p2}L${p3}`);
        });

        this.layout = viva.Graph.Layout.forceDirected(this.g, {
            springLength: this.state.springLength,
            springCoeff: this.state.springCoeff,
            dragCoeff: this.state.dragCoeff,
            gravity: this.state.gravity,
        });

        this.renderer = viva.Graph.View.renderer(this.g, {
            container: document.getElementById("canvas-div"),
            graphics: this.graphics,
            layout: this.layout,
        });

        this.renderer.run();

        // Load URL parameters
        if (this.args.length) {
            const p = this.selectArticle(this.args[0]);
            for (let i = 1; i < this.args.length; i++) {
                p.then(() => this.addArticle(this.args[i]));
            }
        }

        window.addEventListener("resize", this.onWindowResize.bind(this, false));
        window.addEventListener("orientationchange", this.onWindowResize.bind(this, false));
        window.addEventListener("load", this.onWindowResize.bind(this, false));
    }

    selectArticle(id: string) {
        this.setState({
            showModal: false,
        });
        return this.addArticle(id);
    }

    async expandArticle(title: string) {
        const article = this.articles[title];

        if (!article || !article.paperId) {
            return alert("Sorry, Semantic scholar doesn't have any information on that entry.");
        }

        await this.addArticle(article.paperId);
    }

    async addArticle(id: string) {
        try {
            const article = await getArticle(id);
            const wasAdded = this.addNode(article);
            if (!wasAdded) {
                return;
            }
            this.setState({
                numNodes: this.g.getNodesCount(),
                numEdges: this.g.getLinksCount(),
            });
            this.props.history.replace(`${this.props.location.pathname}$$${id}`);
        } catch (err) {
            return alert(err);
        }
    }

    async includeEdges(id: string) {
        // ID is expected to be in [S2PaperId | DOI | ArXivId]
        await fetch(`https://api.semanticscholar.org/v1/paper/${id}?include_unknown_references=true`)
            .then((t) => t.text())
            .then((t) => JSON.parse(t))
            .then((t) => this.addEdges(t))
            .then(() =>
                this.setState({
                    numNodes: this.g.getNodesCount(),
                    numEdges: this.g.getLinksCount(),
                })
            )
            .catch((err) => console.error(err));
    }

    addNode(article: Article): boolean {
        const edges = article.references.length + article.citations.length;
        if (edges > 150) {
            if (!window.confirm(`"${article.title}" contains ${edges} edges. Are you sure you want to add it?`)) {
                return false;
            }
        }

        // Make sure we do not add duplicates
        const addNodeToGraph = (a: Article) => {
            if (!this.articles[a.title]) {
                this.articles[a.title] = {
                    authors: a.authors,
                    paperId: a.paperId,
                    title: a.title,
                    url: a.url,
                    year: a.year,
                    citations: [],
                    references: [],
                };
                this.g.addNode(a.title);
            }
        };
        addNodeToGraph(article);
        article.references.forEach((art) => {
            addNodeToGraph(art);
            this.g.addLink(article.title, art.title);
            if (this.state.includeCommonEdges) {
                this.includeEdges(art.paperId);
            }
        });
        article.citations.forEach((art) => {
            addNodeToGraph(art);
            this.g.addLink(art.title, article.title);
            if (this.state.includeCommonEdges) {
                this.includeEdges(art.paperId);
            }
        });
        return true;
    }

    addEdges(article: Article) {
        article.references.forEach((art) => {
            if (this.articles[art.title] && !this.g.hasLink(article.title, art.title)) {
                this.g.addLink(article.title, art.title);
            }
        });
        article.citations.forEach((art) => {
            if (this.articles[art.title] && !this.g.hasLink(article.title, art.title)) {
                this.g.addLink(art.title, article.title);
            }
        });
    }

    reset() {
        this.g.clear();
        this.articles = {};
        this.setState({ query: "", showModal: true, isDrawerOpen: false });
        this.props.history.replace("/citation-graph");
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onWindowResize);
        window.removeEventListener("orientationchange", this.onWindowResize);
        window.removeEventListener("load", this.onWindowResize);
    }

    updateGraph(setting: keyof Settings, value: number) {
        const newState = {
            [setting]: value,
        } as { [key in keyof Settings]: number };
        this.setState(newState, () => {
            this.layout.simulator.springLength(this.state.springLength);
            this.layout.simulator.springCoeff(this.state.springCoeff);
            this.layout.simulator.dragCoeff(this.state.dragCoeff);
            this.layout.simulator.gravity(this.state.gravity);
            this.layout.simulator.theta(this.state.theta);
        });
    }

    render() {
        return (
            <React.Fragment>
                <CitationGraphMenu
                    onStateChange={(state) => {
                        this.setState({
                            isDrawerOpen: state.isOpen && !this.state.showModal,
                        });
                    }}
                    isMenuOpen={this.state.isDrawerOpen}
                    width={this.state.width}
                    numEdges={this.state.numEdges}
                    numNodes={this.state.numNodes}
                    onRestart={() => this.reset()}
                    onDownloadSVG={() => {
                        saveSVG(this.graphics.getGraphicsRoot());
                    }}
                    onSettingInput={this.updateGraph}
                />
                <div id="canvas-div" />
                <CitationModal
                    showModal={this.state.showModal}
                    selectArticle={(id: string) => this.selectArticle(id)}
                    includeCommonEdges={this.state.includeCommonEdges}
                    onIncludeCommonEdgesChanged={() =>
                        this.setState({
                            includeCommonEdges: !this.state.includeCommonEdges,
                        })
                    }
                    query={this.state.query}
                    onQueryInput={(newQuery) => this.setState({ query: newQuery })}
                />
                <div id="controls-container">
                    <FullscreenButton />
                </div>
            </React.Fragment>
        );
    }
}
