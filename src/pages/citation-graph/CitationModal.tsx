import * as React from "react";
import { Modal } from "../../components/Modal";

export function CitationModal(props: {
    showModal: boolean;
    selectArticle: (id: string) => void;
    includeCommonEdges: boolean;
    onIncludeCommonEdgesChanged: () => void;
    query: string;
    onQueryInput: (newQuery: string) => void;
}) {
    return (
        <Modal show={props.showModal}>
            <h1>Citation graph</h1>
            <p>Displays the connections between articles as a graph.
                Mouseover to highlight connections. Click on an article to expand the graph.
                See the sidebar for more options after selecting an article.
            </p>
            <p>To specify an article, enter an identifier</p>
            <ul>
                <li>Semantic sholar id, e.g.
                    <a onClick={() => props.selectArticle("56aec6894f829ca642fd0f045c5ee9ef278c546d")}>
                        56aec6894f829ca642fd0f045c5ee9ef278c546d
                    </a>
                </li>
                <li>Digital Object Identifier (DOI), e.g.
                    <a onClick={() => props.selectArticle("10.1145/2461912.2462024")}>
                        10.1145/2461912.2462024
                    </a>
                </li>
                <li>ArXiv Identifier, e.g.
                    <a onClick={() => props.selectArticle("arXiv:1803.03453")}>
                        arXiv:1803.03453
                    </a>
                </li>
            </ul>
            <h2>Options</h2>
            <p>
                <label>
                    <input
                        type="checkbox"
                        id="includeCommonEdges"
                        checked={props.includeCommonEdges}
                        onChange={props.onIncludeCommonEdgesChanged}
                    />
                    &nbsp;&nbsp;Load common edges
                </label>
            </p>
            <div style={{ margin: "0 auto", width: "288px" }}>
                <input
                    className="text-input"
                    placeholder="Identifier"
                    onChange={e => props.onQueryInput(e.currentTarget.value)}
                    value={props.query}
                    onKeyPress={event => { if (event.key === "Enter") { props.selectArticle(props.query); } }}
                />
                <a
                    className="a-text-btn"
                    onClick={() => props.selectArticle(props.query)}
                >
                    Select
                </a>
            </div>
        </Modal>
    );
}
