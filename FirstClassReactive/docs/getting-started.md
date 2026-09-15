# Getting started

[Home](../README.md) · [API reference](api.md) · [Examples](examples.md)

Open `index.html` with Live Server in VS Code. Click the canvas to play or pause.
After saving and reloading, click again to start the music.

## Choose a starting sketch

- [sketch.js](../sketch.js) is a composition using all six shapes.
- [examples/one-circle.js](../examples/one-circle.js) is the smallest runnable example.

To use the smaller example, change the last script tag in `index.html` to
`<script src="examples/one-circle.js"></script>`. Load only one sketch at a time.
Keep `assets/sound.mp3` in the project: file paths are relative to the HTML page.

## Load your song in setup

```js
async function setup() {
  createCanvas(600, 400);
  const song = await loadSound("assets/sound.mp3");
  song.loop(true);
  audioReactive.init(song);
}
```

Your sketch loads the song. The library receives the loaded sound and connects
an FFT to it. `init(song)` is synchronous and does not need `await`.

With p5.sound 0.4.1, `song.loop(true)` enables looping without starting playback.
Put `audioReactive.toggle()` in an input event to start, pause, or resume:

```js
function mousePressed() {
  audioReactive.toggle();
}
```

## Draw one shape

```js
function draw() {
  background(20);
  audioReactive.update();
  noStroke();
  fill(100, 220, 255);

  audioReactiveCircle(300, 200, 100);
}
```

The order is **background → audio update → shapes**. Call `update()` once each
frame, however many shapes you draw. It refreshes one shared audio object from
one FFT reading.

## Replace a number with a function

Change the circle's size argument:

```js
audioReactiveCircle(300, 200, audio => 50 + audio.bass * 180);
```

The first two arguments remain fixed. The last argument is a function. When the
shape is drawn, the library calls that function with the current audio values
and uses its result as the diameter.

`50` is the diameter during silence; `180` is the maximum extra diameter. The
arrow returns a number without knowing what shape will use it.

Single-parameter expression arrows use `audio => expression`: no parameter
parentheses, braces, or `return` are needed.

## Change the behavior

Replace the size arrow with one of these:

```js
audio => 50 + audio.bass * 180          // Grow with bass.
audio => 240 - audio.bass * 180         // Shrink with bass.
audio => audio.mid > 0.35 ? 200 : 40    // Switch between two sizes.
audio => 40 + audio.treble ** 2 * 200   // Emphasize stronger treble.
```

Every argument accepts a number or a function independently. For example:

```js
audioReactiveCircle(
  audio => 100 + audio.mid * 300,
  audio => 100 + audio.treble * 150,
  audio => 50 + audio.bass * 180
);
```

## Use the audio controls

| Property | Range | Band |
| --- | --- | --- |
| `audio.bass` | 0–1 | 20–140 Hz |
| `audio.mid` | 0–1 | 400–2600 Hz |
| `audio.treble` | 0–1 | 5200–14000 Hz |

These are boosted average amplitudes. They are useful visual controls, not
beat detection or physical energy measurements. The full snapshot is available
as `audioReactive.audio` outside callbacks too.

The supplied track has much weaker mids and treble than bass. Default sensitivity
is `{ bass: 20, mid: 200, treble: 2000 }`. For another track, change settings in setup:

```js
audioReactive.sensitivity.treble = 3000;
```

Raise a multiplier if a band barely moves. Lower it if the value stays at 1.
Use finite, nonnegative multipliers. This is fixed gain, not automatic normalization.

## Compose

Put multiple shape calls after the update. Use ordinary p5 style functions before
each group. Later drawing appears on top of earlier drawing.

```js
noFill();
stroke(100, 220, 255);
strokeWeight(3);
audioReactiveCircle(300, 200, audio => 150 + audio.bass * 180);

noStroke();
fill(255, 180, 100);
audioReactiveStar(300, 200, 80, audio => audio.mid * 3);
```

The library has circles, rectangles, lines, stars, orbiting dots, and waves.
See the [examples](examples.md) for combinations and the [API reference](api.md)
for argument names, defaults, units, and drawing behavior.

## If something looks wrong

| Symptom | Check |
| --- | --- |
| No music | Click the canvas; check volume and the `assets/sound.mp3` path. |
| Loading never finishes | Check the browser's Network panel. p5.sound 0.4.1 can leave failed file loads pending. |
| Initialization error | Pass the result of `await loadSound(...)`, not a path or Promise. Call init once. |
| No audio movement | Put `audioReactive.update()` after background and before shapes; check playback and sensitivity. |
| Line or wave invisible | Use `stroke(...)`; waves usually also need `noFill()`. |
| Shape disappears | Check callback results: shape coordinates and sizes must be finite numbers. |
| Size seems doubled | `size` means diameter, not radius. |
| Old code still shows | Save, check the script selected in `index.html`, and refresh. |

The generic value evaluator does not validate types. An arrow with braces but no
`return` produces `undefined`, which is not a valid shape coordinate or size.
Use the compact expression form shown above.
