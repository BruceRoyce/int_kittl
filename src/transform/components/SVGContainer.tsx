import { ReactComponent as SampleText } from "@/../../.resources/sampleText.svg";
import { forwardRef, LegacyRef } from "react";

type SVGContainerProps = {
  width: number;
  height: number;
  viewBox: string;
  reset: number;
};

const SVGContainer = forwardRef(function (
  props: SVGContainerProps,
  ref: LegacyRef<SVGSVGElement>
) {
  // console.log("SVGContainer renered");
  return (
    <SampleText
      ref={ref}
      width={props.width}
      height={props.height}
      viewBox={props.viewBox}
    />
  );
});

export default SVGContainer;
