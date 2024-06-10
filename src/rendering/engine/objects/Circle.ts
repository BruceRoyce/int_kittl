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
  private arc: { start: number; end: number };
  protected static isValid = true;
  protected lastPos: { x: number; y: number } = { x: -1, y: -1 };

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
    this.setCenter();
    this.arc = this.getArc();

    if (this.lastPos.x === -1 || this.lastPos.y === -1) {
      this.lastPos = { x: this.left, y: this.top };
    }

    // unnecessary
    this.width = 0;
    this.height = 0;
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

  getArc(): { start: number; end: number } {
    return { start: 0, end: 2 * Math.PI };
  }

  /**
   * render a circle on the canvas
   */
  render(ctx: CanvasRenderingContext2D): Promise<void> {
    // log the position of the circle

    if (!Circle.isValid) return Promise.reject();

    this.setCenter();

    console.log(
      `Circle ${this.id}: is rendered at position ${this.center.x} ${this.center.x} with the color ${this.color}`
    );

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
