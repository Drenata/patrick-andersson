import * as React from "react";
import { slide as Menu } from "react-burger-menu";
import { highlightRelatedNodes, getNodeSVG, createMarker, triangleSVG, citationGraphLink } from "../network-graph/citationGraph";
import { SliderWithDisplay } from "./Slider";
import { saveSVG } from "../util";
import { Modal } from "./Modal";
const viva: any = require("vivagraphjs");

/* TODO
 * 1. URL, authors?
 * 4. Cycle / accumulate. REMOVE/PRUNE?
 * 6. Warn many references/citations?
 * 9. After adding new articles from citations and references,
 *    why not fetch ALL of them and see if they have any links to
 *    already existing graph nodes? Requires that we mark the
 *    non-expanded articles in some way
 * 
 * EXTRA:
 * 1. Other layouts
 *   a. https://github.com/dagrejs/dagre/wiki
 *   b. Self-implement various DAG layouts (e.g. engines from graphviz)
 *   c. https://github.com/mdaines/viz.js
 */


interface Author {
  name: string;
  url: string;
}

interface Article {
  title: string;
  authors: Author[];
  year: string;
  url: string;
  paperId: string; // Semantic scholar internal id
  citations: Article[];
  references: Article[];
}

interface CitationGraphProps { };
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
};

interface Setting {
  initialValue: number;
  min: number;
  max: number;
  step: number;
  name: string;
}

interface Settings {
  [key: string]: Setting;
}

export class CitationGraphContainer extends React.Component<CitationGraphProps, CitationGraphState> {

  g: any;
  graphics: any;
  layout: any;
  renderer: any;

  articles: { [key: string]: Article } = {};

  readonly settings: Settings = {
    springLength: {
      initialValue: 10,
      min: 1,
      max: 100,
      step: 1,
      name: "Spring length"
    },
    springCoeff: {
      initialValue: 0.00005,
      min: 0.0000001,
      max: 0.001,
      step: 0.0000001,
      name: "Spring coefficient"
    },
    dragCoeff: {
      initialValue: 0.1,
      min: 0.001,
      max: 0.2,
      step: 0.001,
      name: "Drag coefficient"
    },
    gravity: {
      initialValue: -100,
      min: -200,
      max: 0,
      step: 1,
      name: "Gravity"
    },
    theta: {
      initialValue: 0.5,
      min: 0,
      max: 1,
      step: 0.01,
      name: "Theta"
    },
  }

  constructor(props: CitationGraphProps) {
    super(props);

    this.state = {
      showModal: true,
      height: window.innerHeight,
      width: window.innerWidth,
      query: "",
      isDrawerOpen: false,
      springLength: this.settings.springLength.initialValue,
      springCoeff: this.settings.springCoeff.initialValue,
      dragCoeff: this.settings.dragCoeff.initialValue,
      gravity: this.settings.gravity.initialValue,
      theta: this.settings.theta.initialValue,
    }
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

    this.graphics.node((node: any) => {

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
      }
      container.addEventListener("click", firstClick)

      return container;
    }).placeNode((nodeUI: any, pos: any) => {
      nodeUI.attr('transform', `translate(${pos.x},${pos.y})`);
    });

    const marker = createMarker("Triangle");
    marker.append(triangleSVG());

    const defs = this.graphics.getSvgRoot().append('defs');
    defs.append(marker);

    this.graphics.link(citationGraphLink)
      .placeLink((linkUI: any, from: any, to: any) => {
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
      container: document.getElementById('canvas-div'),
      graphics: this.graphics,
      layout: this.layout
    });

    this.renderer.run();

    window.addEventListener('resize', this.onWindowResize.bind(this, false));
    window.addEventListener('orientationchange', this.onWindowResize.bind(this, false));
    window.addEventListener('load', this.onWindowResize.bind(this, false));
  }

  selectArticle(id: string) {
    this.expandArticle(id);
    this.setState({
      showModal: false
    });
  }

  expandArticle(id: string) {
    // ID is expected to be in [S2PaperId | DOI | ArXivId]
    fetch(`https://api.semanticscholar.org/v1/paper/${id}?include_unknown_references=true`)
      .then(t => t.text())
      .then(t => JSON.parse(t))
      .then(t => this.addNode(t))
      .catch(err => alert(err));
  }

  addNode(article: Article) {
    // Make sure we do not add duplicates
    const addNodeToGraph = (article: Article) => {
      if (!this.articles[article.paperId]) {
        this.articles[article.paperId] = {
          authors: article.authors,
          paperId: article.paperId,
          title: article.title,
          url: article.url,
          year: article.year,
          citations: [],
          references: [],
        };
        this.g.addNode(article.paperId);
      }
    }
    addNodeToGraph(article);
    article.references.forEach(art => {
      addNodeToGraph(art);
      this.g.addLink(article.paperId, art.paperId);
    });
    article.citations.forEach(art => {
      addNodeToGraph(art);
      this.g.addLink(art.paperId, article.paperId);
    });
  }

  reset() {
    this.g.clear();
    this.articles = {};
    this.setState({ query: "", showModal: true, isDrawerOpen: false });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('orientationchange', this.onWindowResize);
    window.removeEventListener('load', this.onWindowResize);
  }

  updateGraph(newState: any) {
    this.setState(newState, () => {
      this.layout.simulator.springLength(this.state.springLength);
      this.layout.simulator.springCoeff(this.state.springCoeff);
      this.layout.simulator.dragCoeff(this.state.dragCoeff);
      this.layout.simulator.gravity(this.state.gravity);
      this.layout.simulator.theta(this.state.theta);
    });
  }

  renderSetting(key: string) {
    const setting = this.settings[key];
    return (
      <div>
        <h2>{setting.name}</h2>
        <SliderWithDisplay
          min={setting.min}
          max={setting.max}
          step={setting.step}
          initialValue={setting.initialValue}
          onInput={(e: React.FormEvent<HTMLInputElement>) =>
            this.updateGraph({ [key]: parseFloat(e.currentTarget.value) })
          }
        />
      </div>)
  }

  render() {
    return [
      <Menu
        width={this.state.width >= 400 ? "400px" : "85%"}
        isOpen={this.state.isDrawerOpen}
        onStateChange={(state) => { this.setState({ isDrawerOpen: state.isOpen && !this.state.showModal }); }}
      >
        {Object.keys(this.settings).map(key => this.renderSetting(key))}
        <div id="spacer" style={{ flexGrow: 1 }} />
        <a
          className="a-btn"
          onClick={() => this.reset()}>
          Restart
        </a>
        <a
          className="a-btn"
          onClick={() => { saveSVG(this.graphics.getGraphicsRoot()) }}>
          Download SVG
        </a>
        <div>
          The data used in this graph is from <a href="http://semanticscholar.org">Semantic Scholar</a>.
          The graph library used is <a href="https://github.com/anvaka/VivaGraphJS">VivaGraphJS</a>.
        </div>
      </Menu>,
      <div id="canvas-div" />,
      <Modal show={this.state.showModal}>
        <h1>Citation graph</h1>
        <p>Displays the connections between articles as a graph. Mouseover to highlight connections. Click on an article to expand the graph. See the sidebar for more options after selecting an article.</p>
        <p>To specify an article, enter an identifier</p>
        <ul>
          <li>Semantic sholar id, e.g. <a onClick={() => this.selectArticle("56aec6894f829ca642fd0f045c5ee9ef278c546d")}>56aec6894f829ca642fd0f045c5ee9ef278c546d</a></li>
          <li>Digital Object Identifier (DOI), e.g. <a onClick={() => this.selectArticle("10.1145/2461912.2462024")}>10.1145/2461912.2462024</a></li>
          <li>ArXiv Identifier, e.g. <a onClick={() => this.selectArticle("arXiv:1803.03453")}>arXiv:1803.03453</a></li>
        </ul>
        <div style={{ margin: "0 auto", width: "288px" }}>
          <input
            className="text-input"
            placeholder="Identifier"
            onInput={e => this.setState({ query: e.currentTarget.value })}
            onKeyPress={(event) => {
              if (event.key === "Enter")
                this.selectArticle(this.state.query);
            }}
          />
          <a
            className="a-text-btn"
            onClick={() => this.selectArticle(this.state.query)}>Select</a>
        </div>
      </Modal>
    ];
  }
}