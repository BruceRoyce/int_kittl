import { useState, useRef, useEffect } from "react";
import useWarp from "./hooks/useWarp";
import SVGContainer from "./components/SVGContainer";
import HowItWorks from "./components/HowItWorks";
import "../style/transform.scss";
import useTransformer from "./hooks/useTransformer";
/**
 * page for transforming the SVG
 */

function Transform() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { svgData, warpRef, warpReset } = useWarp({ svgRef });
  const {
    list,
    range,
    setRange,
    selectedTransformer,
    setSelectedTransformer,
    transformer,
  } = useTransformer(svgData);

  const handleSelectTransformer = (transformationName: string) => {
    handleResetButton();
    setSelectedTransformer(transformationName);
  };
  const handleResetButton = () => {
    warpReset();
    setRange(50);
  };

  useEffect(() => {
    warpReset();
    warpRef.current.transform(transformer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  return (
    <div className="transform">
      <h1>{selectedTransformer.toUpperCase()} Transform</h1>
      <div className="canvas">
        <SVGContainer
          ref={svgRef}
          width={svgData.width}
          height={svgData.height + svgData.vGap}
          viewBox={`${svgData.minX} ${svgData.vGap / -8} ${svgData.width} ${
            svgData.height + svgData.vGap / 2
          }`}
          reset={range}
        />
      </div>
      <p>Transforming SVG from sampleText.svg</p>
      <input
        type="range"
        value={range}
        onChange={(event) => setRange(parseInt(event.target.value))}
      />
      <p className="rangeValue">{range}</p>

      <div className="options-wrapper">
        <div>
          <label htmlFor="tfm-selector">Select Transformer</label>
          <select
            id="tfm-selector"
            value={selectedTransformer}
            onChange={(e) => handleSelectTransformer(e.target.value)}
          >
            {list.map((op) => (
              <option key={op.id} value={op.id}>
                {op.name}
              </option>
            ))}
          </select>
        </div>

        <button className="btn" onClick={handleResetButton}>
          Reset
        </button>
      </div>
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
