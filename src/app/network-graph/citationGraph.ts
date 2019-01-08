import { chunk } from "../util";
const Viva: any = require("vivagraphjs");

export function highlightRelatedNodes(
  graph: any, graphics: any,
  nodeID: string, isOn: boolean) {
  graph.forEachLinkedNode(nodeID, (node: any, link: any) => {
    const linkUI = graphics.getLinkUI(link.id);
    if (linkUI) {
      const linkColor = isOn
        ? link.fromId === nodeID
          ? "red"
          : "green"
        : "gray";
      const nodeColor = isOn
        ? link.fromId === nodeID
          ? "red"
          : "green"
        : "white";

      // linkUI is a UI object created by graphics below
      linkUI.attr("stroke", linkColor);
      graphics
        .getNodeUI(node.id)
        .childNodes
        .forEach((c: HTMLElement) => c.setAttribute("fill", nodeColor))
    }
  });
};

export function getNodeSVG(title: string): SVGElement {
  const container: SVGElement = Viva.Graph.svg("g");
  const titleParts = chunk(title, 25); // 25 seems pretty enough

  titleParts.forEach((titlePart, i) => {
    const e = Viva.Graph.svg("text")
      .text(titlePart)
      .attr("class", "svg-graph-text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("style", "font-size: 0.8em;")
      .attr("fill", "white")
      // Magic constanst to center text vertically
      .attr("y", -15 * (titleParts.length - 1) / 2 + 15 * i);
    container.append(e);
  });

  return container;
}

export function citationGraphLink(link: any) {
  return Viva.Graph.svg("path")
    .attr("stroke", "gray")
    .attr("marker-mid", "url(#Triangle)");
}

export function createMarker(id: string) {
  return Viva.Graph.svg("marker")
    .attr("id", id)
    .attr("viewBox", "0 0 10 10")
    .attr("refX", "10")
    .attr("refY", "5")
    .attr("markerUnits", "strokeWidth")
    .attr("markerWidth", "20")
    .attr("markerHeight", "10")
    .attr("orient", "auto");
}

export function triangleSVG() {
  return Viva.Graph.svg("path")
    .attr("d", "M 0 0 L 10 5 L 0 10 z")
    .attr("stroke", "gray")
    .attr("fill", "gray");
}