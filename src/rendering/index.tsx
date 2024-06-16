import { useRef, useState } from "react";
import { renderSteps } from "./renderSteps";
import { CANVAS_HEIGHT, CANVAS_WIDTH, Canvas } from "./engine/Canvas";
import BackButton from "../components/BackButton";
import "../style/rendering.scss";

const wait = async (delay: number) => {
  return new Promise((resolve) => setTimeout(resolve, delay));
};

/**
 * This component is responsible for rendering the canvas and handling the
 * steps to change the state of the canvas.
 */
function Rendering() {
  const [step, setStep] = useState<number>(0);
  const [testing, setTesting] = useState<null | "stepped" | "full">(null);
  const [processingStep, setProcessingStep] = useState<boolean>(false);

  const [durations, setDurations] = useState<
    { label: string; duration: number }[]
  >([]);

  /**
   * setup the canvas on load
   */
  const canvasElement = useRef<HTMLCanvasElement | null>(null);
  const canvas = useRef<Canvas | null>(null);

  /**
   * Sum up all the durations and add a total duration
   */
  const updateTotalDuration = () => {
    setDurations((durations) => [
      ...durations,
      {
        label: "Total",
        duration: durations.reduce(
          (acc, duration) => acc + duration.duration,
          0
        ),
      },
    ]);
  };

  const handleStart = async () => {
    setTesting("full");

    for (const entry of renderSteps) {
      const startTime = new Date().getTime();
      canvas.current = await entry.action(
        canvas.current,
        canvasElement.current
      );
      const duration = new Date().getTime() - startTime;
      setDurations((timings) => [...timings, { label: entry.label, duration }]);
      // Small wait between steps to get more consistent results
      await wait(500);
    }

    updateTotalDuration();

    setTesting(null);
  };

  const handleNextStep = async () => {
    if (processingStep) {
      return;
    }

    setTesting("stepped");
    setProcessingStep(true);

    const currentStep = step;
    const scriptEntry = renderSteps[currentStep];

    if (!scriptEntry) {
      updateTotalDuration();
      setTesting(null);
      setProcessingStep(false);
    } else {
      const startTime = new Date().getTime();
      canvas.current = await scriptEntry.action(
        canvas.current,
        canvasElement.current
      );
      setProcessingStep(false);
      const duration = new Date().getTime() - startTime;
      setDurations((durations) => [
        ...durations,
        { label: scriptEntry.label, duration },
      ]);
    }

    setStep((step) => step + 1);
  };

  const handleReset = () => {
    setTesting(null);
    setStep(0);
    setDurations([]);
    if (canvas.current) {
      canvas.current.clear();
    }
    canvas.current = null;
  };

  const isFinished = () => {
    return durations.length > renderSteps.length;
  };

  return (
    <main id="rendering">
      <canvas
        ref={canvasElement}
        style={{
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
        }}
      />
      <div className="btn-wrapper">
        <p>
          Viewport: ({canvas.current?.viewport.left},{" "}
          {canvas.current?.viewport.top})
        </p>
        <Btn
          onClick={handleStart}
          isDisabled={testing !== null || isFinished()}
          icon="play_arrow"
          name="Start"
        />
        <Btn
          onClick={handleReset}
          isDisabled={testing === "full" || processingStep}
          icon="restart_alt"
          name="Reset"
        />
        <Btn
          onClick={handleNextStep}
          isDisabled={testing === "full" || isFinished()}
          icon="skip_next"
          name="Next Step"
        />
      </div>
      <div className="steps-grid">
        <div className="step-row head">
          <div>Step</div>
          <div>Duration (ms)</div>
        </div>

        {durations.map((duration) => (
          <div className="step-row" key={duration.label}>
            <div>{duration.label}</div>
            <div>{duration.duration}</div>
          </div>
        ))}
      </div>
      <BackButton />
    </main>
  );
}

export default Rendering;

type BtnPropsT = {
  isDisabled: boolean;
  onClick: () => void | Promise<void>;
  icon: string;
  name: string;
};

function Btn({ isDisabled, onClick, icon, name }: BtnPropsT) {
  return (
    <div className="btn-holder">
      <button className="btn-iconic" onClick={onClick} disabled={isDisabled}>
        {icon}
      </button>
      <div className="btn-name">{name}</div>
    </div>
  );
}
