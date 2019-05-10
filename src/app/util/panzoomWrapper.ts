import * as panzoom from "pan-zoom";
import * as React from "react";

export interface CameraState {
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
  scaleX: number;
  scaleY: number;
}

/*
 * Register camera that will update state on panning and zooming.
 * Returns a callback to unregister the camera.
 */
export function panzoomWrapper<U extends CameraState>(
  component: React.Component<any, U>,
  canvas: HTMLCanvasElement,
  afterUpdate: () => any
): () => void {

  //@ts-ignore
  return panzoom(canvas, (e: any) => {

    const clamp = (x: number, min: number, max: number) => {
      return x < min
        ? min
        : x > max
          ? max
          : x;
    }

    component.setState(oldState => {
      var left = 0;
      var top = 0;
      var width = oldState.width;
      var height = oldState.height;

      const zoom = clamp(-e.dz, -height * .75, height * .75) / height;

      let x = { offset: oldState.offsetX, scale: oldState.scaleX },
        y = { offset: oldState.offsetY, scale: oldState.scaleY };

      var oX = 0;
      x.offset -= oldState.scaleX * e.dx;

      var tx = (e.x - left) / width - oX;
      var prevScale = x.scale;
      x.scale *= (1 - zoom);
      x.scale = clamp(x.scale, 0.000000000000001, 100000000000000);
      x.offset -= width * (x.scale - prevScale) * tx;

      var oY = 0;
      y.offset += y.scale * e.dy;
      var ty = oY - (e.y - top) / height;
      var prevScale$1 = y.scale;
      y.scale *= (1 - zoom);
      y.scale = clamp(y.scale, 0.000000000000001, 100000000000000);
      y.offset -= height * (y.scale - prevScale$1) * ty;

      return ({
        offsetX: x.offset,
        offsetY: y.offset,
        scaleX: x.scale,
        scaleY: y.scale,
      })
    }, afterUpdate);

  });

}