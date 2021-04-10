import React, { useCallback, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Module } from 'webpack';
import { Plane } from './svg/plane';
import update from "immutability-helper";

const SlantedDiv = (props: React.PropsWithChildren<any>) => (
    <div style={{ transform: "translateY(25%) skewY(26.5deg)" }}>{props.children}</div>
)

const itemStyle: React.CSSProperties = {
    padding: "0.7em",
    margin: "0.5em 0 0.5em 0",
    cursor: "grab",
}

const items = ["Input", "Conv2D", "Dud"];

function ModuleItem(props: any) {
    const [{ isDragging }, drag] = useDrag({
        type: "BOX",
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    });
    return (
        <div ref={drag} style={itemStyle}>
            <h3>{props.children}</h3>
            <hr />
        </div>);
}

function Box() {
    const [{ isDragging }, drag] = useDrag({
        type: "CREATE",
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    });

    return (
        <div ref={drag} style={{ backgroundColor: "red", width: "200px", height: "200px", opacity: isDragging ? 0.5 : 1 }}>
            hrllo
        </div>
    )
}

interface Node {
    top: number;
    left: number;
    module: Module;
}

interface Nodes { [key: string]: Node }
interface DragItem { top: number; left: number; id: string }
interface CreateItem { type: string }

function Canvas(props: React.PropsWithChildren<{ nodes: Nodes, moveNode: Function, createNode: Function }>) {
    const [, drop] = useDrop(() => ({
        accept: "BOX",
        drop(item: DragItem, monitor) {
            const delta = monitor.getDifferenceFromInitialOffset() as { x: number, y: number };

            let left = Math.round(item.left + delta.x);
            let top = Math.round(item.top + delta.y);
            props.moveNode(item.id, left, top);
        }
    }));

    const [, drop2] = useDrop(() => ({
        accept: "CREATE",
        drop(item: CreateItem, monitor) {
            props.createNode(item.type, monitor.getClientOffset() as { x: number, y: number });
        }
    }));

    return (
        <div
            ref={drop}
            style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#ddd",
                padding: "2em",
            }}>
            <div
                ref={drop2}
                style={{
                    width: "100%",
                    height: "100%",
                }} />{props.children}
        </div>);
}

export function NetKreContainer() {

    const [nodes, setNodes] = useState<Nodes>({});
    const [edges, setEdges] = useState([]);

    const moveNode = useCallback((key: string, left: number, top: number) => {
        setNodes(
            update(nodes,
                { [key]: { $merge: { left, top } } }
            )
        )
    }, [nodes]);
    const createNode = useCallback((type: string, left: number, top: number) => {
        const key = Object.keys(nodes).length.toString();
        setNodes(
            update(nodes,
                { [key]: { $set: {  } }})
        );
    });

    return (
        <DndProvider backend={HTML5Backend} >
            <Canvas moveNode={moveNode} nodes={nodes}>
                <div style={{
                    padding: "2em",
                    display: "flex",
                    flexDirection: "column",
                    maxHeight: "60%",
                    minHeight: "20%",
                    width: "8em",
                    backgroundColor: "white",
                    boxShadow: "20px 20px rgba(0,0,0,.15)",
                }}>
                    {items.map((item) => (
                        <ModuleItem>{item}</ModuleItem>

                    ))}
                </div>
                {Object.keys(nodes).map((key) => (
                    <Box key={key} />
                ))}
            </Canvas>
        </DndProvider>
    );
}