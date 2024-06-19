import { type Object, type ObjectData, ObjectType } from "./objects/Object";
import { Circle } from "./objects/Circle";
import { Illustration } from "./objects/Illustration";
import { doesDarwAnything } from "./utils/objectSanity";

export const CANVAS_WIDTH = 600;
export const CANVAS_HEIGHT = 400;

type InitObjs = {
  [id: number]: Object;
};

/**
 * turn object data into objects
 */
const initializeObjects = (objects: ObjectData[], canvas: Canvas) => {
  const initObjs: InitObjs = {};
  objects.filter(doesDarwAnything).forEach((object) => {
    if (object.type === ObjectType.Circle) {
      initObjs[object.id] = new Circle(object, canvas);
    } else if (object.type === ObjectType.Illustration) {
      initObjs[object.id] = new Illustration(object, canvas);
    } else throw new Error(`Unknown object type ${object.type}`);
  });
  return initObjs;
};

export class Canvas {
  private canvasElement: HTMLCanvasElement;
  private objects: InitObjs;
  public viewport = {
    top: 0,
    left: 0,
  };
  private dpr: number;
  protected static ctx: CanvasRenderingContext2D | null = null;
  protected static isValid = true;

  constructor(canvasElement: HTMLCanvasElement, objects: ObjectData[] = []) {
    if (!canvasElement) {
      throw new Error("Valid canvas element is required!");
    }
    this.canvasElement = canvasElement;
    this.dpr = window.devicePixelRatio ?? 1;
    this.canvasElement.setAttribute("width", `${CANVAS_WIDTH * this.dpr}`);
    this.canvasElement.setAttribute("height", `${CANVAS_HEIGHT * this.dpr}`);
    this.objects = initializeObjects(objects, this);
    this.setCtx();
  }

  setCtx() {
    const ctx = this.canvasElement.getContext("2d");
    if (ctx === null) {
      Canvas.isValid = false;
      throw new Error("Could not get canvas context");
    } else {
      ctx.scale(this.dpr, this.dpr);
      ctx.canvas.width = CANVAS_WIDTH;
      ctx.canvas.height = CANVAS_HEIGHT;
      Canvas.ctx = ctx;
    }
  }
  /**
   * update the color of an object
   */
  updateColor(objectId: number, color: string): void {
    this.objects[objectId]?.setColor(color);
  }

  /**
   * clear the canvas element
   */
  public clear(): void {
    if (!Canvas.isValid || !Canvas.ctx)
      throw new Error("Could not get canvas context");
    Canvas.ctx.save();
    Canvas.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    Canvas.ctx.restore();
  }

  /**
   * set the viewport of the canvas
   */
  public setViewport(top: number, left: number): void {
    this.viewport = {
      top,
      left,
    };
  }

  /**
   * get all objects
   */
  public getObjects(): Object[] {
    return Object.values(this.objects);
  }

  /**
   * render all objects on the canvas
   */
  public async render(): Promise<void> {
    if (!Canvas.ctx) {
      throw new Error("Could not get canvas context");
    }
    return new Promise(async (resolve, reject) => {
      this.clear(); // clear the canvas from the last render
      try {
        const renderQueue = []; // catching promises
        // ✅ for loop is faster than forEach
        for (const object of this.getObjects()) {
          renderQueue.push(await object.render(Canvas.ctx!));
        }
        Promise.all(renderQueue).then(() => resolve());
        // or await Promise.allSettled(renderQueue).then(() => resolve()) depending on the intention;
      } catch (e) {
        if (!e) return resolve();
        console.error("Canvas renderer catched error:", e);
        return reject();
      }
    });
  }
}
