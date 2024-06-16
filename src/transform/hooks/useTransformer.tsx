import { useState } from "react";
import type { Point2D } from "../types/geometry";
import type { SVGData } from "../types/svg";

export default function useTransformer({ minX, minY, width, height }: SVGData) {
  const [range, setRange] = useState(50);
  const [selectedTransformer, setSelectedTransformer] = useState("arc");

  function tfm(rng: number) {
    const amp = 1.2;
    const midPointX = minX + width / 2;
    const midPointY = minY + height / 2;

    switch (selectedTransformer) {
      case "flag":
        rng = (rng - 50) * amp;
        return flag;
      case "prespectiveX":
        rng = rng - 50;
        return prespectiveX;
      case "skew":
        rng = rng - 50;
        return skew;
      case "arc":
      default:
        rng = (rng - 50) * amp;
        return arc;
    }
    function arc([x, y]: Point2D): Point2D {
      return [x, y - rng * Math.sin((Math.PI / 2) * (x / midPointX))];
    }
    function flag([x, y]: Point2D): Point2D {
      return [x, y - rng * Math.sin((Math.PI / 2) * ((x / midPointX) * 2))];
    }
    function skew([x, y]: Point2D): Point2D {
      const q = x - minX;
      return [x, (rng / 200) * q + y];
    }
    function prespectiveX([x, y]: Point2D): Point2D {
      const baseOffset = 0;
      let dir = y - midPointY + baseOffset < 0 ? -rng : rng;
      let q = rng > 0 ? x - minX : Math.abs(x - (minX + width));
      dir = rng > 0 ? dir : -dir;
      q = Math.abs(q * (y - midPointY)) / 25;
      return [x, (dir / 400) * q + y];
    }
  }

  return {
    list: [
      { name: "Arc", id: "arc" },
      { name: "Flag", id: "flag" },
      { name: "Skew", id: "skew" },
      { name: "Prespective X", id: "prespectiveX" },
    ],
    range: range,
    setRange,
    selectedTransformer,
    setSelectedTransformer,
    transformer: tfm(range),
  };
}
