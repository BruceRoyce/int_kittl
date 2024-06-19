import { ReactComponent as SampleText } from "@/../../.resources/sampleText.svg";
import { forwardRef, LegacyRef, Suspense } from "react";

const isVewBox = (str: string): boolean => {
  const regex = /^[-\d\s.]+$/;
  return regex.test(str);
};

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
  const isSvgConstriant = isVewBox(props.viewBox);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SampleText
        ref={ref}
        width={props.width}
        height={props.height}
        viewBox={isSvgConstriant ? props.viewBox : "0 0 100 100"}
      />
    </Suspense>
  );
});

export default SVGContainer;
