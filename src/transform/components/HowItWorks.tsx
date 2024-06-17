import "../../style/transform.scss";
const HowItWorks = () => {
  return (
    <div className="howItWorks">
      <h3>How It Works</h3>
      <div className="">
        <p>
          The main logic are in <code>useWarp</code> and{" "}
          <code>useTransformer</code> hooks, that use WarpJS to transform the
          SVG
        </p>
        <ul>
          <li className="special">
            <b>The trick</b> is to <b>reset the SVG</b> to its original state
            before applying each transformation, otherwise the transformation
            goes out of hand as they will be added on the top of eachother.
          </li>
          <li>
            On the first run, I grap the relaxed (reset) svg points. I calculate
            the correct size of the shape and set the dimensions and the
            viewport accordingly. Some gap (padding) is considered to house the
            transformed svg.
          </li>
          <li>
            The SVG is then transformed by the selected <code>transformer</code>{" "}
            with its amplitude set by the range input (see
            <code>useTransformer</code>):
            <ul>
              <li>
                <b>Arc Transformer</b> (default) is sine wave added to the y
                values. The sine wave is calculated by the formula{" "}
                <code>
                  <i>y = q * Math.sin((Math.PI / 2) * (x / midPoint))</i>
                </code>{" "}
                Here <code>q</code> is based on the given range and{" "}
                <code>midPoint</code> is half of the <code>width</code>
                of the SVG (offset by the smallest x).
              </li>
              <li>
                <b>Flag Transformer</b> (just to show-off!) is also sine wave
                added to the y values, with its <code>midPoint</code> set in
                quarter of the <code>width</code>!
              </li>
              <li>
                <b>Skew</b> (just to show-off!) uses a sloped line formula to
                changes the y values on a slope:{" "}
                <code>
                  <i>y = a * x + y</i>
                </code>
              </li>
              <li>
                <b>Perspective X</b> (just to show-off!) also follows the sloped
                line formula, with its baseline being the <code>midPoint</code>{" "}
                in the SVG height. In addition to that, there is another scale
                factor that boostes <code>y</code> value so to scale things up
                as they diverge from eachother. I fond the height midpoint and
                any y above that will slope-up and slope-down for the{" "}
                <code>y</code>'s less than midpoint.
              </li>
            </ul>
          </li>
          <li>
            The SVG is reset by the Reset button, which resets the SVG to its
            original state.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HowItWorks;
