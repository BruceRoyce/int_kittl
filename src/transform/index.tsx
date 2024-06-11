import { useState, useRef, useEffect } from "react";
import useWarp from "./hooks/useWarp";
import "./transform.scss";
import SVGContainer from "./components/SVGContainer";
import HowItWorks from "./components/HowItWorks";
/**
 * page for transforming the SVG
 */

function Transform() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [value, setValue] = useState(50);
  const { svgData, warpRef, warpReset } = useWarp({ svgRef });
  const handleResetButton = () => {
    warpReset();
    setValue(50);
  };

  useEffect(() => {
    warpReset();
    const arcRad = (value - 50) * 1.2;
    warpRef.current.transform(([x, y]: number[]) => {
      const newOne = [x, y - arcRad * Math.sin(x / (1000 / 8))];
      return newOne;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="transform">
      <h1>Transform</h1>
      <SVGContainer
        ref={svgRef}
        width={svgData.width}
        height={svgData.height + svgData.vGap}
        viewBox={`${svgData.minX} ${svgData.vGap / -8} ${svgData.width} ${
          svgData.height + svgData.vGap / 2
        }`}
        reset={value}
      />
      <p>Transforming SVG from sampleText.svg</p>
      <input
        type="range"
        value={value}
        onChange={(event) => setValue(parseInt(event.target.value))}
      />
      <p className="rangeValue">{value}</p>
      <button className="btn" onClick={handleResetButton}>
        Reset
      </button>
      <div className="vSpacer" />
      <HowItWorks />
      <div className="vSpacer" />
      <p className="sign">
        Tech Test for Kittl.com by Bruce Royce - 2024 -{" "}
        <a className="link" href="mailto:bruceroyce@yahoo.com">
          bruceroyce@yahoo.com
        </a>
      </p>
    </div>
  );
}

export default Transform;
