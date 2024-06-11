import { Canvas } from "../Canvas";
import { Object, ObjectData, ObjectType } from "./Object";

export class Circle implements Object {
  id: number;
  type = ObjectType.Circle;
  top: number;
  left: number;
  width: number;
  height: number;
  color: string;
  private radius: number;
  private canvas: Canvas;
  private center: { x: number; y: number } = { x: 0, y: 0 };
  private arc = { start: 0, end: 2 * Math.PI };
  protected static isValid = true;

  constructor(data: ObjectData, canvas: Canvas) {
    if (data.width !== data.height) {
      Circle.isValid = false;
      throw new Error("Circle width and height must be equal");
    }
    this.id = data.id;
    this.radius = data.width / 2;
    this.canvas = canvas;
    this.color = data.color;
    this.top = data.top;
    this.left = data.left;
    this.width = data.width;
    this.height = data.height;
    this.setCenter();
  }

  setCenter(): void {
    this.center = {
      x: this.radius - this.canvas.viewport.left + this.left,
      y: this.radius - this.canvas.viewport.top + this.top,
    };
  }

  setColor(color: string): void {
    this.color = color;
  }

  /**
   * render a circle on the canvas
   */
  render(ctx: CanvasRenderingContext2D): Promise<void> {
    // log the position of the circle

    if (!Circle.isValid) return Promise.reject();

    this.setCenter();

    // console.log(
    //   `Circle ${this.id}: is rendered at position ${this.center.x} ${this.center.x} with the color ${this.color}`
    // );

    // draw the circle
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(
      this.center.x,
      this.center.y,
      this.radius,
      this.arc.start,
      this.arc.end
    );
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    return Promise.resolve();
  }
}
