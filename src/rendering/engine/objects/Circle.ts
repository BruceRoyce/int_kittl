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

  constructor(data: ObjectData, canvas: Canvas) {
    this.id = data.id;
    this.top = data.top;
    this.left = data.left;
    this.color = data.color;
    this.canvas = canvas;

    if (data.width !== data.height) {
      throw new Error("Circle width and height must be equal");
    }
    this.width = data.width;
    this.height = data.height;
    this.radius = data.width / 2;
  }

  setColor(color: string): void {
    this.color = color;
  }

  /**
   * render a circle on the canvas
   */
  render(ctx: CanvasRenderingContext2D): Promise<void> {
    // calculate the center of the circle, adjust the position based on the viewport
    const centerX = -this.canvas.viewport.left + this.left + this.radius;
    const centerY = -this.canvas.viewport.top + this.top + this.radius;

    // log the position of the circle
    console.log(`Circle ${this.id}: is rendered at position ${centerX} ${centerY} with the color ${this.color}`);

    // draw the circle
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, this.radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    return Promise.resolve();
  }
}
