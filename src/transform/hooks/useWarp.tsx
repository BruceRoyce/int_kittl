import { useState, useRef, useEffect, type RefObject } from "react";
import type { SVGData } from "../types/svg";
import Warp from "warpjs";

export default function useWarp({
  svgRef,
}: {
  svgRef: RefObject<SVGSVGElement>;
}) {
  const [svgData, setSvgData] = useState<SVGData>({
    minX: Number.MAX_VALUE,
    minY: Number.MAX_VALUE,
    maxX: Number.MIN_VALUE,
    maxY: Number.MIN_VALUE,
    width: 1000,
    height: 200,
    vGap: 200,
  });
  const resetData = useRef<number[][]>([]);
  const warpRef = useRef<any>(null);

  useEffect(() => {
    warpRef.current = new Warp(svgRef.current);
    if (!warpRef.current) {
      return;
    }
    const tempData = Object.assign({}, svgData);
    resetData.current = [];
    warpRef.current.transform(([x, y]: number[]) => {
      resetData.current.push([x, y]);
      tempData.minX = Math.min(tempData.minX, x);
      tempData.minY = Math.min(tempData.minY, y);
      tempData.maxX = Math.max(tempData.maxX, x);
      tempData.maxY = Math.max(tempData.maxY, y);
      return [x, y];
    });
    tempData.width = tempData.maxX - tempData.minX;
    tempData.height = tempData.maxY - tempData.minY;
    setSvgData(tempData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function warpReset() {
    const resetHolder = resetData.current.slice();
    warpRef.current.transform(() => {
      return resetHolder.shift();
    });
  }

  return { svgData, warpRef, warpReset };
}
