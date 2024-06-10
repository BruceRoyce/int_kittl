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
  // id: number;
  // type: ObjectType;

  // /**
  //  * position and size of the object
  //  */
  // top: number;
  // left: number;
  // width: number;
  // height: number;

  // /**
  //  * color of the object
  //  */
  // color: string;
  /**
   * set the color of the object
   */
  setColor: (color: string) => void;

  /**
   * render the object on the canvas
   */
  render(ctx: CanvasRenderingContext2D): Promise<void>;
}
