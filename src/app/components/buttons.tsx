import * as React from 'react';
import screenfull = require('screenfull');

export const NextButton = (props: { onClick: (event: React.FormEvent) => any; }) => (
  <div
    className={"normal-btn"}
    id="next-btn"
    onClick={props.onClick}
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path d="M20 12l-2.83 2.83L26.34 24l-9.17 9.17L20 36l12-12z" /></svg>
  </div>
);

export const PreviousButton = (props: { onClick: (event: React.FormEvent) => any; }) => (
  <div
    className={"normal-btn"}
    id="prev-btn"
    onClick={props.onClick}
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path d="M30.83 14.83L28 12 16 24l12 12 2.83-2.83L21.66 24z" /></svg>
  </div>
);

export const ResetButton = (props: { onClick: (event: React.FormEvent) => any; }) => (
  <div
    className={"normal-btn"}
    id="reset-btn"
    onClick={props.onClick}
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path d="M24 10V2L14 12l10 10v-8c6.63 0 12 5.37 12 12s-5.37 12-12 12-12-5.37-12-12H8c0 8.84 7.16 16 16 16s16-7.16 16-16-7.16-16-16-16z" /></svg>
  </div>
);

export const ConfigButton = (props: { onClick: (event: React.FormEvent) => any; }) => (
  <div
    className={"normal-btn"}
    id="reset-btn"
    onClick={props.onClick}
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path d="M38.86 25.95c.08-.64.14-1.29.14-1.95s-.06-1.31-.14-1.95l4.23-3.31c.38-.3.49-.84.24-1.28l-4-6.93c-.25-.43-.77-.61-1.22-.43l-4.98 2.01c-1.03-.79-2.16-1.46-3.38-1.97L29 4.84c-.09-.47-.5-.84-1-.84h-8c-.5 0-.91.37-.99.84l-.75 5.3c-1.22.51-2.35 1.17-3.38 1.97L9.9 10.1c-.45-.17-.97 0-1.22.43l-4 6.93c-.25.43-.14.97.24 1.28l4.22 3.31C9.06 22.69 9 23.34 9 24s.06 1.31.14 1.95l-4.22 3.31c-.38.3-.49.84-.24 1.28l4 6.93c.25.43.77.61 1.22.43l4.98-2.01c1.03.79 2.16 1.46 3.38 1.97l.75 5.3c.08.47.49.84.99.84h8c.5 0 .91-.37.99-.84l.75-5.3c1.22-.51 2.35-1.17 3.38-1.97l4.98 2.01c.45.17.97 0 1.22-.43l4-6.93c.25-.43.14-.97-.24-1.28l-4.22-3.31zM24 31c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" /></svg>
  </div>
);

export const FullscreenButton = () => (
  <div
    className={"normal-btn"}
    id="fullscreen-btn"
    onClick={() => {
      if (screenfull)
        screenfull.isFullscreen
          ? screenfull.exit()
          : screenfull.request(document.getElementById('canvas-div')!);
    }}
  >
    {screenfull && screenfull.isFullscreen
      ? <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path d="M10 32h6v6h4V28H10v4zm6-16h-6v4h10V10h-4v6zm12 22h4v-6h6v-4H28v10zm4-22v-6h-4v10h10v-4h-6z" /></svg>
      : <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path d="M14 28h-4v10h10v-4h-6v-6zm-4-8h4v-6h6v-4H10v10zm24 14h-6v4h10V28h-4v6zm-6-24v4h6v6h4V10H28z" /></svg>
    }
  </div>
);
