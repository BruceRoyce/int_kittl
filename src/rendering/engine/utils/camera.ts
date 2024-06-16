import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../Canvas";
import type { Object } from "../objects/Object";

export type Boundary = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type CameraPosition = {
  left: number;
  top: number;
};

export type CameraSize = {
  width: number;
  height: number;
};

type CameraMoveCheckerT = {
  object: Object;
  pos: CameraPosition;
};

export function isCameraMoved({ object, pos }: CameraMoveCheckerT) {
  const lastPos = object.cameraPosition;
  const isMoved = pos.left !== lastPos.left || pos.top !== lastPos.top;
  return isMoved;
}

export function isInView(
  { top, left, width, height }: Boundary,
  pos: CameraPosition
) {
  return (
    (left < pos.left + CANVAS_WIDTH && left + width > pos.left) ||
    (top < pos.top + CANVAS_HEIGHT && top + height > pos.top)
  );
}
