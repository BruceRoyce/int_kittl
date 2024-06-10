import { Canvas } from "../Canvas";
import { type Object, type ObjectData, type Point, ObjectType } from "./Object";

export class Illustration implements Object {
  id: number;
  type = ObjectType.Illustration;
  top: number;
  left: number;
  width: number;
  height: number;
  color: string;
  private canvas: Canvas;
  private commands: string[];
  private points: Point[];
  protected isValid: boolean;
  private canPosAdjuster: Record<string, number> = { left: 0, top: 0 };

  constructor(data: ObjectData, canvas: Canvas) {
    this.isValid = true;
    this.commands = [];
    this.points = [];
    this.color = data.color;
    this.canvas = canvas;
    this.id = data.id;
    this.top = data.top;
    this.left = data.left;
    this.width = 0;
    this.height = 0;
    this.absPosAdjuster();
  }

  setColor(color: string): void {
    this.color = color;
  }

  async setCommands(): Promise<void> {
    const path = await this.loadIllustration();
    if (!this.isPathValid(path)) {
      this.isValid = false;
      throw new Error("Invalid path");
    } else {
      this.commands = path
        .replace("M", "")
        .replace("Z", "")
        .split("L")
        .filter((c) => Boolean(c));
      this.setPoints();
    }
  }

  async setPoints(): Promise<void> {
    const points: Point[] = [];
    for (const command of this.commands) {
      const [x, y] = command.split(",").map((c) => parseInt(c));
      points.push([x, y] as Point);
    }
    this.points = points;
  }

  private isPathValid(path: string): boolean {
    return path.startsWith("M") && path.endsWith("Z");
  }

  private absPosAdjuster(): void {
    this.canPosAdjuster = {
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

  /**
   * render an illustration on the canvas
   */
  render(ctx: CanvasRenderingContext2D): Promise<void> {
    // NOTE: this is a very simple svg parser, that only works for the illustration.svg file

    if (!this.isValid || !this.commands || !this.points)
      return Promise.reject();
    // log the command of the illustration
    console.log(
      `Illustration ${this.id}: is rendered with ${this.commands.length} commands with the color ${this.color}`
    );

    this.absPosAdjuster();
    // draw the path
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.beginPath();

    let motion = 0;
    for (const point of this.points) {
      const [x, y] = point;
      motion === 0
        ? ctx.moveTo(x + this.canPosAdjuster.left, y + this.canPosAdjuster.top)
        : ctx.lineTo(x + this.canPosAdjuster.left, y + this.canPosAdjuster.top);
      motion++;
    }

    ctx.closePath();
    ctx.fill();
    ctx.restore();
    return Promise.resolve();
  }
}
