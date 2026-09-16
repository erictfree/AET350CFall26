# Assignment 3: Reactive Audio Shapes

## Course

**AET 350C — Department of Arts and Entertainment Technologies**  
**The University of Texas at Austin**  
**Professor Eric Freeman**

## Overview

Create a short p5.js composition whose shapes respond to music. Practice
first-class and higher-order JavaScript functions: a shape argument can be a
fixed number or an arrow function that receives the current audio object.

> **START HERE — PROVIDED SHAPES:** Before designing your composition, review
> the six `audioReactive...` primitives in the [Provided shapes and documentation](#provided-shapes-and-documentation)
> section below. Their full parameters and examples are in the [API reference](api.md).

## Download the starter project

1. Open the [AET350CFall26 repository](https://github.com/erictfree/AET350CFall26).
2. Open **First Class Reactive**, click the green **Code** button, and choose
   **Download ZIP** (or if you are familar with Git, use any method you like).
3. Unzip the download and open `AET350CFall26/First Class Reactive` in VS Code.
4. Right-click `index.html` and choose **Open with Live Server**.

The starter includes `assets/sound.mp3`; keep the folder structure intact.

## Learning goals

- Explain the difference between passing a value and passing a function.
- Write arrows such as `audio => 40 + audio.bass * 180`.
- Use `bass`, `mid`, and `treble` to drive visual properties.
- Combine reactive primitives while keeping styling outside arrows.

## Requirements

Starting from `sketch.js`:

1. Do not remove the provided song-loading code or the `audioReactive.update()` call.
2. Use at least three different reactive shapes.
3. Make at least four shape arguments audio-reactive with functions.
4. Use at least two audio bands (`bass`, `mid`, or `treble`).
5. Change the p5 styling to establish a visual idea.

Keep the responsibilities clear: a shape function draws the shape, while each
arrow passed to it only creates one responsive value for `x`, `y`, `size`, or
another parameter. An arrow can read the audio object and return a value, but it
should not call `circle()`, `rect()`, or another drawing function.

## Extra credit: add a custom shape

Write your own `audioReactive...` custom shape: a JavaScript function that follows
the same pattern as the supplied primitives. It should accept numbers or audio
functions for its parameters, resolve those values, and draw one new kind of
shape. See [Creating Your Own Reactive Shape](custom-shapes.md) for a short guide.
Keep the arrow functions responsible for calculating values; keep the custom
shape responsible for drawing. Use it in the final composition and explain its
design in your submission paragraph.

## Starting example

```js
function draw() {
  background(20);
  audioReactive.update();
  noStroke();
  fill(100, 220, 255);
  audioReactiveCircle(width / 2, height / 2, audio => 50 + audio.bass * 180);
}
```

Sizes and positions use pixels; rotations and angles use radians.

<a id="provided-shapes-and-documentation"></a>
## ⭐ Provided shapes and documentation

The library provides six drawing primitives:

- `audioReactiveCircle()` — a centered circle
- `audioReactiveRect()` — a centered rectangle with optional rotation
- `audioReactiveLine()` — a line between two points
- `audioReactiveStar()` — a five-point star with optional rotation
- `audioReactiveOrbit()` — a dot traveling around a center point
- `audioReactiveWave()` — a controllable sine wave

See the [API reference](api.md) for each shape's parameters, defaults, units,
examples, and behavior. The full project README also links to the [examples](examples.md)
and [architecture notes](architecture.md).

## Submission

Submit your edited `sketch.js`, one screenshot or short screen recording showing
the composition responding to the song, and a short paragraph naming the audio
bands you used and explaining what each arrow function controls.

Do not submit the entire downloaded ZIP unless requested.

## Troubleshooting

- Click the canvas to start audio; browsers require a user gesture.
- For a clean frame, you may place `background()` first, then update audio, then draw shapes.
- Confirm the song path is `assets/sound.mp3`.
- Check the browser console for JavaScript errors.
