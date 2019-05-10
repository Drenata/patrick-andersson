import * as TeX from '@matejmazur/react-katex';
import * as React from 'react';

export const TexList = (props: { maths: string[] }) => {
  const rootsList = props.maths.map(math => (
    <TeX math={math} block />
  ))
  return (
    <React.Fragment>
      {rootsList}
    </React.Fragment>
  )
};