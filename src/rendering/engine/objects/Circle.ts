import { Canvas } from "../Canvas";
import { isCameraMoved, isInView, type CameraPosition } from "../utils/camera";

import { Point, Object, ObjectData, ObjectType } from "./Object";
import { isObjectValid } from "../utils/objectSanity";

export class Circle implements Object {
  public id: number;
  public type = ObjectType.Circle;
  public top: number;
  public left: number;
  public width: number;
  public height: number;
  public color: string;
  private radius: number;
  private canvas: Canvas;
  private center: Point = [0, 0];
  private arc = { start: 0, end: 2 * Math.PI };

  public cameraPosition: CameraPosition = { left: 0, top: 0 };
  public isValid: boolean = true;
  public isInView: boolean = true;

  constructor(data: ObjectData, canvas: Canvas) {
    this.width = data.width;
    this.height = data.height;
    this.checkValidity();
    this.id = data.id;
    this.radius = data.width / 2;
    this.canvas = canvas;
    this.color = data.color;
    this.top = data.top;
    this.left = data.left;
    this.width = data.width;
    this.height = data.height;
    this.reposition();
    this.checkInView();
  }

  reposition(): void {
    this.center = [
      this.radius + this.left - this.canvas.viewport.left,
      this.radius + this.top - this.canvas.viewport.top,
    ];
  }

  setColor(color: string): void {
    this.color = color;
  }

  checkValidity(): boolean {
    const [isValid, error] = isObjectValid(this.type, this.width, this.height);
    this.isValid = isValid;
    if (!isValid && error) throw error;
    return isValid;
  }

  checkInView() {
    const rad = this.radius;
    this.isInView = isInView(
      {
        left: this.center[0] - rad,
        top: this.center[1] - rad,
        width: rad * 2,
        height: rad * 2,
      },
      this.cameraPosition
    );
  }

  checkCamera() {
    const pos = this.canvas.viewport;
    if (
      isCameraMoved({
        object: this,
        pos,
      })
    ) {
      this.cameraPosition = pos;
      this.reposition();
      this.checkInView();
    }
  }

  render(ctx: CanvasRenderingContext2D): Promise<void> {
    if (!this.isValid) return Promise.reject();
    this.checkCamera();
    if (!this.isInView) return Promise.resolve();

    // console.log(
    //   `Circle ${this.id}: is rendered at position ${this.center.x} ${this.center.x} with the color ${this.color}`
    // );

    ctx.save();
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(...this.center, this.radius, this.arc.start, this.arc.end);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    return Promise.resolve();
  }
}
