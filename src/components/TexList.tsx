// eslint-disable-line @typescript-eslint/no-unused-vars
import TeX from "@matejmazur/react-katex";
import * as React from "react";

export const TexList = (props: { maths: string[] }) => {
    const rootsList = props.maths.map((math) => <TeX key={math} math={math} block={true} />);

    return <>{rootsList}</>;
};
