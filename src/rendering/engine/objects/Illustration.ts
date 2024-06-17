import { Canvas } from "../Canvas";
import { isObjectValid } from "../utils/objectSanity";
import { isCameraMoved, isInView, type CameraPosition } from "../utils/camera";
import { type Object, type ObjectData, type Point, ObjectType } from "./Object";

export class Illustration implements Object {
  public type = ObjectType.Illustration;
  public id; // types from the implemented interface
  public top;
  public left;
  public width;
  public height;
  public color;

  public cameraPosition = { left: 0, top: 0 };
  public isValid = false;
  public isInView = true;

  // properties not in the interface
  public path: string = "";
  public commands: string[] = [];
  public canvas: Canvas;
  private points: Point[] = [];
  private pointsReposition: CameraPosition = { left: 0, top: 0 };

  constructor(data: ObjectData, canvas: Canvas) {
    this.setCommands();
    this.color = data.color;
    this.canvas = canvas;
    this.id = data.id;
    this.top = data.top;
    this.left = data.left;
    this.width = data.width;
    this.height = data.height;
    this.reposition();
    this.checkInView();
  }

  setColor(color: string): void {
    this.color = color;
  }

  async setCommands(): Promise<void> {
    this.path = await this.loadIllustration();
    this.checkValidity();
    this.commands = this.path
      .replace("M", "")
      .replace("Z", "")
      .split("L")
      .filter((c) => Boolean(c));
    this.setPoints();
  }

  private async setPoints(): Promise<void> {
    const points: Point[] = [];
    for (const command of this.commands) {
      const [x, y] = command.split(",").map((c) => parseInt(c));
      points.push([x, y] as Point);
    }
    this.points = points;
  }

  reposition(): void {
    this.pointsReposition = {
      left: this.left - this.canvas.viewport.left,
      top: this.top - this.canvas.viewport.top,
    };
  }

  private async loadIllustration(): Promise<string> {
    const response = await fetch("/illustration.svg"); // Path to your SVG file in the folder
    const svgText = await response.text();

    // Parse the SVG text using DOMParser
    const parser = new DOMParser();
    const document = parser.parseFromString(svgText, "image/svg+xml");

    // Get the first path element and its 'd' attribute
    const firstPath = document.querySelector("path");
    const dAttribute = firstPath!.getAttribute("d");

    return dAttribute!;
  }

  checkValidity(): boolean {
    const [isValid, error] = isObjectValid(this.type, this.path);
    this.isValid = isValid;
    if (!isValid && error) throw error;
    return isValid;
  }

  checkInView() {
    this.isInView = isInView(this, this.cameraPosition);
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
    return new Promise((resolve, reject) => {
      if (!this.isValid) return reject(); // rejects invalid shapes
      this.checkCamera(); // checks camera motion and updates positions only when needed
      if (!this.isInView) return resolve(); // resolves by skipping out of vision shapes

      // log the command of the illustration
      // console.log(
      //   `Illustration ${this.id}: is rendered with ${this.commands.length} commands with the color ${this.color}`
      // );

      // all good drawing the path
      ctx.save();
      ctx.fillStyle = this.color;
      ctx.beginPath();

      // ✅ `for of` is slightly faster than `forEach`
      let idx = 0;
      for (let point of this.points) {
        point = [
          point[0] + this.pointsReposition.left,
          point[1] + this.pointsReposition.top,
        ];
        idx++ === 0 ? ctx.moveTo(...point) : ctx.lineTo(...point);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      return resolve();
    });
  }
}
