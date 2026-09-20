# Examples

[Home](../README.md) · [Getting started](getting-started.md) · [API reference](api.md)

## Visual progression

Open the parent **First Class Reactive** folder in VS Code. Then open
[progression.html](../examples/progression.html) with **VS Code Live Server**
(not by double-clicking the HTML file or by opening the `examples` folder alone) for a
guided visual sequence: a plain p5 circle, a reactive circle with a fixed number,
a reactive circle whose size comes from an audio arrow, and a reactive circle
whose size uses the current bass number directly. Press **1–4** to focus a stage.
Use each card's checkbox to stop or start that stage's draw call.
The live bass, mid, and treble bars at the bottom show the values available to the
arrow function or direct expression.

Use [one-circle.js](../examples/one-circle.js) for a complete starter or
[sketch.js](../sketch.js) for the full six-shape composition.

The recipes below belong inside `draw()`, after `background()` and one
`audioReactive.update()`. Add several to compose them. Canvas positions assume
at least 600 × 400 pixels; adjust the numbers to suit your canvas.

## A pulse and its opposite

Both circles read the same bass value. Their arrows use it differently:

```js
noStroke();
fill(100, 220, 255);
audioReactiveCircle(180, 200, audio => 50 + audio.bass * 180);

fill(255, 180, 100);
audioReactiveCircle(420, 200, audio => 230 - audio.bass * 180);
```

## One function, multiple shapes

The function only calculates a number. Both a circle's diameter and a rectangle's
width can use it. Each shape call evaluates it with the current audio:

```js
const pulse = audio => 50 + audio.bass * 180;

noStroke();
fill(100, 220, 255);
audioReactiveCircle(180, 200, pulse);

fill(210, 130, 255);
audioReactiveRect(420, 200, pulse, 20);
```

## Moving position, fixed size

```js
noStroke();
fill(255, 180, 100);
audioReactiveCircle(audio => 100 + audio.mid * 400, 200, 80);
```

Only x is reactive. Replace `200` with another arrow to make y reactive too.

## A line that tilts

```js
stroke(255, 140, 180);
strokeWeight(3);
audioReactiveLine(100, 100, 500, audio => 100 + audio.treble * 150);
```

## A star that switches size

```js
noStroke();
fill(255, 180, 100);
audioReactiveStar(300, 200, audio => audio.mid > 0.35 ? 180 : 60,
  audio => audio.treble * 2);
```

The threshold is a rule on amplitude, not a detected beat. Try `0.2` and `0.6`.

## A traveling wave

```js
noFill();
stroke(120, 240, 180);
strokeWeight(2);
audioReactiveWave(300, 200, 500,
  audio => 4 + audio.treble * 40,
  audio => 2 + audio.mid * 4,
  frameCount * 0.04);
```

Treble controls height; mids control the number of waves. Time advances the phase.
Set the last argument to `0` to remove that continuous motion.

## Repetition with a loop

```js
noStroke();
fill(210, 130, 255);
for (let i = 0; i < 5; i++) {
  audioReactiveRect(100 + i * 100, 200, 30,
    audio => 20 + audio.mid * (50 + i * 30));
}
```

Each arrow reads the loop's `i`, so each bar scales the same mid value differently.
The bars are centered on y = 200 and grow in both vertical directions.

## A layered composition

```js
noFill();
stroke(100, 220, 255);
strokeWeight(3);
audioReactiveCircle(300, 200, audio => 150 + audio.bass * 180);

noStroke();
fill(255, 180, 100);
audioReactiveStar(300, 200, 80, audio => audio.mid * 3);

fill(240);
audioReactiveOrbit(300, 200, audio => 110 + audio.bass * 80,
  12, frameCount * 0.025);
```

All three calls share a center. The circle and star follow sound. The dot moves
continuously, while bass changes its orbit radius.

## Control music-driven and time-driven motion separately

These two calls illustrate different meanings of the angle argument:

```js
// Continuous movement, including while music is paused.
audioReactiveOrbit(300, 200, 100, 12, frameCount * 0.025);

// Position follows mids; no independent clock.
audioReactiveOrbit(300, 200, 100, 12, audio => audio.mid * Math.PI * 2);
```

`frameCount * 0.025` is a number recalculated by `draw()`. The second expression
is a function called by the shape. For frame-rate-independent motion, a numeric
argument such as `millis() / 1000` can also provide an angle in radians.
