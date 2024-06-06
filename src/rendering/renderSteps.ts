/**
 * Rendering steps to test the rendering engine
 */
import { Canvas } from "./engine/Canvas";
import { getInitialObjects } from "./initialObjects";

interface RenderStep {
  /**
   * description of the step
   */
  label: string;
  /**
   * action to be executed
   * the first action will create the canvas
   */
  action: (
    canvas: Canvas | null,
    canvasElement?: HTMLCanvasElement | null
  ) => Promise<Canvas>;
}

export const renderSteps: RenderStep[] = [
  {
    label: "Initialize the canvas",
    action: (_canvas, canvasElement) => {
      if (!canvasElement) {
        throw new Error("Canvas element is not defined");
      }
      const canvas = new Canvas(canvasElement, getInitialObjects());
      return Promise.resolve(canvas);
    },
  },
  {
    label: "First render",
    action: async (canvas) => {
      if (!canvas) {
        throw new Error("Canvas is not defined");
      }
      await canvas.render();
      return canvas;
    },
  },
  {
    label: "Second render",
    action: async (canvas) => {
      if (!canvas) {
        throw new Error("Canvas is not defined");
      }
      await canvas.render();
      return canvas;
    },
  },
  {
    label: "Change some colors to blue and render",
    action: async (canvas) => {
      if (!canvas) {
        throw new Error("Canvas is not defined");
      }
      for (const object of canvas.getObjects()) {
        if (object.id % 2 === 1) {
          canvas.updateColor(object.id, "#3498db");
        }
      }
      await canvas.render();
      return canvas;
    },
  },
  {
    label: "Move Viewport and render",
    action: async (canvas) => {
      if (!canvas) {
        throw new Error("Canvas is not defined");
      }
      canvas.setViewport(0, 300);
      await canvas.render();
      return canvas;
    },
  },
  {
    label: "Move Viewport again and render",
    action: async (canvas) => {
      if (!canvas) {
        throw new Error("Canvas is not defined");
      }
      canvas.setViewport(0, 600);
      await canvas.render();
      return canvas;
    },
  },
  {
    label: "Change some colors to red and render",
    action: async (canvas) => {
      if (!canvas) {
        throw new Error("Canvas is not defined");
      }
      for (const object of canvas.getObjects()) {
        if (object.id % 2 === 0) {
          canvas.updateColor(object.id, "#ff0000");
        }
      }
      await canvas.render();
      return canvas;
    },
  },
  {
    label: "Last Render",
    action: async (canvas) => {
      if (!canvas) {
        throw new Error("Canvas is not defined");
      }
      await canvas.render();
      return canvas;
    },
  },
];
