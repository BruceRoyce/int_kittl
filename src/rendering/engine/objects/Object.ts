import type { CameraPosition } from "../utils/camera";
export enum ObjectType {
  Circle = "circle",
  Illustration = "illustration",
}

export type Point = [number, number];

export interface ObjectData {
  id: number;
  type: ObjectType;

  /**
   * position and size of the object
   */
  top: number;
  left: number;
  width: number;
  height: number;

  /**
   * color of the object
   */
  color: string;
}

/**
 * Interface for all objects that can be rendered on the canvas
 */
export interface Object extends ObjectData {
  cameraPosition: CameraPosition;
  isValid: boolean;
  isInView: boolean;

  /**
   * checks the shape validity
   * @returns void
   */
  checkValidity: () => boolean;
  /**
   * adjusts values to reposition the shapes according to the viewport position
   * @returns void
   */
  reposition: () => void;

  /**
   * chackes whether the shape is in vision
   * @returns void
   */
  checkInView: () => void;

  /**
   * set the color of the object
   * @param color
   * @returns void
   */
  setColor: (color: string) => void;

  /**
   * render the object on the canvas
   * @param ctx
   * @return Promise<void>;
   */
  render(ctx: CanvasRenderingContext2D): Promise<void>;
}
