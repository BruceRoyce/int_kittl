# Welcome to Kittl's Frontend Rendering Assignment!

## Part 1

### Challenge

Part 1 involved improving the performance of a simplified rendering engine on HTML canvas (2D).

The original engine setup was producing the image in about 1500-1700ms (bad experience). The changes brought the total duration down to about 92~115ms (acceptable performance), which is almost 15 times faster. (flactuationg)

### Solution

![Before and after optimization](.resources/before_after.jpg)

#### Observation

I was only allowed to make (constructive) changes within the `engine` directory.

```
└── 📁rendering
        └── 📁engine
            └── Canvas.ts
            └── 📁objects
                └── Circle.ts
                └── Illustration.ts
                └── Object.ts
```

#### Problem 1

In `Canvas.ts`, I noticed the canvas context was being unnecessarily regenerated and error checked for every render, which negatively impacted performance.

#### Remedy for Problem 1

I changed this to be generated once when the class is instantiated as a static field that could be accessed for an entire session via `Canvas.ctx`.

The extra null checks were safely removed.

A few other minor changes were applied (e.g., importing types correctly, etc.) - Please see the PR.

**In short**, the unnecessary canvas context creation is fixed.

#### Problem 2

I noticed one of the longer renders occurs when the color changes. This is linked to the logic of filtering the objects to get the target object.
Currently, the logic loops through the entire set of objects.

This is because `getInitialObjects()` returns an array.

```typescript
getInitialObjects() : ObjectData[]
```

#### Remedy to problem 2

I updated the object initializer to be indexed by object.id, eliminating the need to loop through the entire object set each time to find the `object_id`.
For better understanding, please see below:

**❌ Current**

```typescript
// Bruce: Current update color method that should loop through objects everytime
 updateColor(objectId: number, color: string): void {
    const object = this.objects.find((object) => object.id === objectId);
    if (!object) {
      throw new Error(`Could not find object with id ${objectId}`);
    }
    object.setColor(color);
  }
```

**✅ Performant (indexed)**

```typescript
// Bruce: imporoved update color method that eliminates looping
  updateColor(objectId: number, color: string): void {
    this.objects[objectId]?.setColor(color);
  }
```

#### Other improvements:

- All objects with `width` or `height` of `0` are filtered out because they won't draw anything but add to the load. - (See `engine/utils/objectSanity/isObjectSane.ts`)
- The canvas resolution is fixed to be only as large as necessary.
- Unnecessary steps in clearing the canvas were removed.

### The major issue

The major issues lied in the object initializers, where the least amount of initialization and preparation for optimal rendering were in place.

#### Problem 1

Many time-consuming computations were set to happen within the render method of each object, and most importantly, they were set to happen repeatedly for each traverse and points.

For example, I noticed the render method of Illustration.ts to be like: (notice the red flags in the comments)

```javascript
async render(ctx: CanvasRenderingContext2D): Promise<void> {
    // 🚩 Bruce: this check could have happened earlier in life cycle
    const path = await this.loadIllustration();
    if (!path.startsWith("M") || !path.endsWith("Z")) {
      throw new Error("Invalid path");
    }
    const commands = path.replace("M", "").replace("Z", "").split("L");

    // draw the path
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.beginPath();

  // 🚩 Bruce:segregated logic hard to maintain and understand
    const firstCommand = commands.shift();
    // 🚩 Bruce: this check could have happened earlier in life cycle
    if (!firstCommand) {
      throw new Error("Invalid path");
      // 🚩 Bruce: doesn't restore the canvas
    }
    const [x, y] = firstCommand.split(",");
    ctx.moveTo(
      -this.canvas.viewport.left + this.left + parseInt(x),
      -this.canvas.viewport.top + this.top + parseInt(y)
    );

    for (const command of commands) {
    // 🚩 Bruce: looped computation to extract absolute points
      const [x, y] = command.split(",");
      ctx.lineTo(
        // 🚩 Bruce: looped computation to calculate relative points
        -this.canvas.viewport.left + this.left + parseInt(x),
        -this.canvas.viewport.top + this.top + parseInt(y)
      );
    }

    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
```

#### Remedy to problem 1

Many of these calculations, such as extracting the commands and points, are moved earlier in the object life cycle, prepared for the renderer.
The absolute to relative position calculation needed to be fresh at render time to accommodate camera movement.
In short, two main improvements have been applied:

**The shape** class `constructor`s' are updated to handle as much preparation (pre-calculation) as possible for

- the `render` method to leverage when called.
- The `render` methods are updated to follow simpler and more straightforward logic, and most importantly, to take advantage of prepared data during instantiation.

#### Problem 2

I have added a check to skip rendering the shapes that are falling outside of the canvas visible area.
I added a check to skip rendering shapes that fall outside the canvas visible area via `isInView`. (See `engine/utils/camera.ts` function `isInView`)

![Out of vision check function](.resources/oov-check.jpg)

If not in view, a flag is set and the renderer safely skips rendering while still resolving the render promise.

#### Other imporvements applied

- The setup is improved to notify the renderer when `viewport` is changed. The recalculation for point positions _ONLY_ happens when there is camera movement; otherwise, prepared data is reused. (See `engine/utils/camera.ts` function `isCameraMoved`)
- Invalidity checks are executed as early as possible to avoid waste. (See `engine/utils/objectSanity/isObjectSane.ts` function `isObjectValid`)

## Part 2

### Challenge

Implement an Arch Transformation for the provided SVG file.

### Solution

I also added a React component with a story that demonstrates how it works.

![SVG transformation screenshot](.resources/transforms.jpg)

### How It Works

**The trick** is to **reset the SVG** to its original state before applying each transformation; otherwise, the transformations will compound.

The main logic is in the `useWarp` and `useTransformer` hooks, which use WarpJS to transform the SVG.

- On the first run, I grab the relaxed (reset) SVG points. I calculate the correct size of the shape and set the dimensions and viewport accordingly. Some gap (padding) is considered to house the transformed SVG.

- The SVG is then transformed by the selected `transformer` with its amplitude set by the range input (see `useTransformer`):

  - **Arc Transformer (default)** is a sine wave added to the y values. The sine wave is calculated by the formula: `y = q * Math.sin((Math.PI / 2) * (x / midPoint))`. Here, `q` is based on the given range, and `midPoint` is half of the `width` of the SVG (offset by the smallest x).

🙋🏻‍♂️ **I added the following extra transformers for a bit of showing off (I hope you don't mind!)**

- **Flag Transformer** (just to show off!) is also a sine wave added to the y values, with its `midPoint` set to a quarter of the `width`!

- **Skew** (just to show off!) uses a sloped line formula to change the y values on a slope: `y = a * x + y`.

- **Perspective X** (just to show off!) also follows the sloped line formula, with its baseline being the `midPoint` in the SVG height. In addition, there is another scale factor that boosts the `y` value to scale things up as they diverge from each other. I found the height midpoint, and any y above that will slope up, while any y below that will slope down.

### Resting SVG

The SVG is reset by the Reset button, which resets the SVG to its original state.

## General

- The assignment was completed in TypeScript using React.

### Running the Code

Please use `yarn start` and open [http://localhost:3000](http://localhost:3000) to view it in the browser. You will see buttons that redirect you to **Part 1** and **Part 2** of the challenge solutions.

---

Please let me know if you have any questions or if anything is missing.

Thank you very much!<br>
Bruce Royce<br>
(bruceroyce@yahoo.com)
