import "../transform.scss";
const HowItWorks = () => {
  return (
    <div className="howItWorks">
      <h3>How It Works</h3>
      <div className="">
        <p>
          The main logic is in useWarp hook, that uses WarpJS to transform the
          SVG!
        </p>
        <ul>
          <li>
            On the first run, I grap the relaxed (reset) svg points. I calculate
            the correct size of the shape and set the dimensions and the
            viewport accordingly. Some gap (padding) is considered to house the
            transformed svg.
          </li>
          <li>
            The SVG is then transformed by a sine wave added to the y values
            that is controlled by a range input. The sine wave is calculated by
            the formula <i>y = arcRad * sin(x / (1000 / 8))</i> 1000 is the
            width of the SVG.
          </li>
          <li>
            The SVG is reset by the Reset button, which resets the SVG to its
            original state.
          </li>
          <li>
            <b>The trick</b> is to <b>reset the SVG</b> to its original state
            before applying each transformation, otherwise the transformation
            goes out of hand as they will be added on the top of eachother
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HowItWorks;
