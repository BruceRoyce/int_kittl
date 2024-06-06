import { useState } from "react";

/**
 * page for transforming the SVG
 */
function Transform() {
  const [value, setValue] = useState(0);

  return (
    <div>
      <h1>Transform</h1>
      <p>Please show the transformed SVG from sampleText.svg here</p>
      <input
        type="range"
        value={value}
        onChange={(event) => setValue(parseInt(event.target.value))}
      />
      <p>{value}</p>
    </div>
  );
}

export default Transform;
