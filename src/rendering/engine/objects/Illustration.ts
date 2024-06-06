import { Canvas } from "../Canvas";
import { Object, ObjectData, ObjectType } from "./Object";

export class Illustration implements Object {
  id: number;
  type = ObjectType.Illustration;
  top: number;
  left: number;
  width: number;
  height: number;
  color: string;
  private canvas: Canvas;

  constructor(data: ObjectData, canvas: Canvas) {
    this.id = data.id;
    this.top = data.top;
    this.left = data.left;
    this.color = data.color;
    this.canvas = canvas;
    this.width = data.width;
    this.height = data.height;
  }

  setColor(color: string): void {
    this.color = color;
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
  async render(ctx: CanvasRenderingContext2D): Promise<void> {
    // NOTE: this is a very simple svg parser, that only works for the illustration.svg file
    const path = await this.loadIllustration();
    if (!path.startsWith("M") || !path.endsWith("Z")) {
      throw new Error("Invalid path");
    }
    const commands = path.replace("M", "").replace("Z", "").split("L");

    // log the command of the illustration
    console.log(
      `Illustration ${this.id}: is rendered with ${commands.length} commands with the color ${this.color}`
    );

    // draw the path
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.beginPath();

    const firstCommand = commands.shift();
    if (!firstCommand) {
      throw new Error("Invalid path");
    }
    const [x, y] = firstCommand.split(",");
    ctx.moveTo(
      -this.canvas.viewport.left + this.left + parseInt(x),
      -this.canvas.viewport.top + this.top + parseInt(y)
    );

    for (const command of commands) {
      const [x, y] = command.split(",");
      ctx.lineTo(
        -this.canvas.viewport.left + this.left + parseInt(x),
        -this.canvas.viewport.top + this.top + parseInt(y)
      );
    }

    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}
