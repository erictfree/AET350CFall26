# API reference

[Home](../README.md) · [Getting started](getting-started.md) · [Examples](examples.md)

Version 0.1.0. Public API for p5 global mode. Load `audio-reactive.js` after p5.js
and p5.sound and before your sketch. The library does not define p5 lifecycle functions.

## Contents

- [Argument convention](#arguments)
- [Audio state and sensitivity](#audio-state)
- [init](#init), [update](#update), [toggle](#toggle), [isPlaying](#is-playing)
- [Circle](#circle), [rectangle](#rect), [line](#line), [star](#star), [orbit](#orbit), [wave](#wave)

<a id="arguments"></a>
## Argument convention

Every shape parameter can be **a number or a function that receives the current
audio object and returns a number**, including optional parameters.

```js
audioReactiveCircle(300, 200, 100);
audioReactiveCircle(300, 200, audio => 50 + audio.bass * 180);
```

Functions are evaluated once per supplied argument on each shape call. They all
receive the same current audio object. Results are used immediately; no callbacks
are registered for later execution. Put the calls in `draw()` to repeat them.

The internal evaluator is generic: values pass through and functions are called.
The **consumer** supplies the type requirement. These six shape functions expect
numeric geometry, but the value-or-function pattern also works with colors,
strings, arrays, and objects in other consumers. The evaluator does not enforce
number types. For shapes, supply finite numbers and nonnegative dimensions.

Keep callbacks free of drawing and mutations. Units are pixels for positions and
dimensions, radians for angles. Positive angles appear clockwise in p5's default
canvas coordinates. Radians work even if the sketch uses `angleMode(DEGREES)`.

All shapes return `undefined`. They inherit the current p5 styles and transforms.
Circle, rectangle, star, and orbit preserve their temporary drawing-state changes
with `push()`/`pop()`. Line and wave use the current state without changing it.

<a id="audio-state"></a>
## Audio state and settings

### `audioReactive.audio`

**Type:** `AudioState` — the same object passed to every callback.

| Property | Type | Initial value | Range | Frequency band |
| --- | --- | --- | --- | --- |
| `bass` | number | 0 | 0–1 | 20–140 Hz |
| `mid` | number | 0 | 0–1 | 400–2600 Hz |
| `treble` | number | 0 | 0–1 | 5200–14000 Hz |

`update()` mutates this object in place. Treat it as read-only in callbacks. To save
an independent snapshot, use `{ ...audioReactive.audio }`.

For each band, the library averages FFT amplitudes, multiplies by sensitivity, and
clamps the result to 0–1. These values are not physical energy or beat events.
Different band gains mean their relative values do not preserve the original
balance of the song. Sampling uses a 1024-bin FFT and the audio context's sample rate.

### `audioReactive.sensitivity`

Mutable settings. Use finite, nonnegative numbers.

| Property | Default | Meaning |
| --- | --- | --- |
| `bass` | 20 | Bass amplitude multiplier |
| `mid` | 200 | Mid amplitude multiplier |
| `treble` | 2000 | Treble amplitude multiplier |

```js
audioReactive.sensitivity.mid = 150;
```

Settings take effect on the next `update()`. They are fixed gains, not adaptive
normalization. Raise a multiplier for weak movement; lower it for a band pinned at 1.

### `audioReactive.version`

**Type:** string. Currently `"0.1.0"`.

<a id="init"></a>
## `audioReactive.init(song)`

Connect a previously loaded song to the library's FFT. Call once in setup.

| Parameter | Type | Required | Meaning |
| --- | --- | --- | --- |
| `song` | p5.SoundFile | yes | Result of `await loadSound(...)` |

**Returns:** `undefined`. Synchronous; do not await it.

**Does not:** load a file, set looping, start playback, or create a canvas.

**Errors:** throws `Error` if already initialized; throws `TypeError` if the
argument is missing or lacks a `connect()` method. A path or Promise is not a loaded song.

```js
const song = await loadSound("assets/sound.mp3");
song.loop(true);
audioReactive.init(song);
```

The library keeps a reference for analysis and playback helpers. This version
supports one initialized song per page; refresh to initialize another song.

<a id="update"></a>
## `audioReactive.update()`

Run one FFT analysis and refresh all three bands. No arguments.

**Returns:** `AudioState` — the same object as `audioReactive.audio`.

Before initialization, returns the initial zero-valued object without analyzing.
Call once per frame after `background()` and before drawing any shapes:

```js
background(20);
audioReactive.update();
audioReactiveCircle(300, 200, audio => 50 + audio.bass * 180);
```

<a id="toggle"></a>
## `audioReactive.toggle()`

Resume the browser audio context, then start/resume or pause the song. No arguments.
Use a mouse, keyboard, or button event to satisfy browser audio-start requirements.

**Returns:** `Promise<boolean>` — playback state afterward. Resolves to `false`
before initialization. An audio-context resume failure may reject the Promise.
It does not change the song's looping setting.

```js
function mousePressed() {
  audioReactive.toggle();
}
```

<a id="is-playing"></a>
## `audioReactive.isPlaying()`

Read playback state without changing it. No arguments.

**Returns:** boolean — true during playback, false before initialization or while paused.

```js
if (!audioReactive.isPlaying()) {
  text("click to play", 20, 30);
}
```

<a id="circle"></a>
## `audioReactiveCircle(x, y, size)`

Draw a circle using the current fill and stroke. Each parameter can be a number or a function.

| Parameter | Required | Meaning |
| --- | --- | --- |
| `x` | yes | Center x in pixels |
| `y` | yes | Center y in pixels |
| `size` | yes | Diameter in pixels, not radius |

Temporarily uses `ellipseMode(CENTER)`, then restores the previous mode and state.

```js
audioReactiveCircle(300, 200, audio => 50 + audio.bass * 180);
```

<a id="rect"></a>
## `audioReactiveRect(x, y, w, h, rotation = 0)`

Draw a rectangle positioned by its **center**, not its upper-left corner.
Each parameter can be a number or a function.

| Parameter | Required/default | Meaning |
| --- | --- | --- |
| `x` | required | Center x in pixels |
| `y` | required | Center y in pixels |
| `w` | required | Width in pixels |
| `h` | required | Height in pixels |
| `rotation` | 0 | Rotation about the center, in radians |

Temporarily changes the origin, transform, and rectangle mode; restores them afterward.

```js
audioReactiveRect(300, 200, audio => 80 + audio.mid * 200, 16,
  audio => audio.treble * 0.5);
```

<a id="line"></a>
## `audioReactiveLine(x1, y1, x2, y2)`

Draw a line between two endpoints. Each parameter can be a number or a function.

| Parameter | Required | Meaning |
| --- | --- | --- |
| `x1` | yes | First endpoint x in pixels |
| `y1` | yes | First endpoint y in pixels |
| `x2` | yes | Second endpoint x in pixels |
| `y2` | yes | Second endpoint y in pixels |

Use `stroke()` and `strokeWeight()` to style it. `noStroke()` makes it invisible.

```js
stroke(255, 140, 180);
audioReactiveLine(100, 80, 500, audio => 80 + audio.treble * 150);
```

<a id="star"></a>
## `audioReactiveStar(x, y, size, rotation = 0)`

Draw a five-point star. Each parameter can be a number or a function.

| Parameter | Required/default | Meaning |
| --- | --- | --- |
| `x` | required | Center x in pixels |
| `y` | required | Center y in pixels |
| `size` | required | Diameter of the circle through its outer points |
| `rotation` | 0 | Rotation about the center, in radians |

At zero rotation, one point faces upward. The inner radius is 45% of the outer
radius. Temporary translations and rotations are restored after drawing.

```js
audioReactiveStar(300, 200, audio => 60 + audio.treble * 120,
  audio => audio.mid * 3);
```

<a id="orbit"></a>
## `audioReactiveOrbit(x, y, radius, size, angle)`

Draw one dot on a circular orbit. Each parameter can be a number or a function.

| Parameter | Required | Meaning |
| --- | --- | --- |
| `x` | yes | Orbit center x in pixels |
| `y` | yes | Orbit center y in pixels |
| `radius` | yes | Distance from the center to the dot, in pixels |
| `size` | yes | Dot diameter in pixels |
| `angle` | yes | Position on the orbit, in radians |

Angle zero is to the right of the center. The helper neither draws an orbit path
nor advances the angle. Supply a changing number for continuous movement:

```js
audioReactiveOrbit(300, 200, audio => 70 + audio.bass * 80,
  14, frameCount * 0.025);
```

<a id="wave"></a>
## `audioReactiveWave(x, y, w, amplitude, waves = 3, phase = 0)`

Draw a decorative sine wave sampled at 81 vertices. This is not the song's raw
waveform. Each parameter can be a number or a function.

| Parameter | Required/default | Meaning |
| --- | --- | --- |
| `x` | required | Horizontal center in pixels |
| `y` | required | Baseline y in pixels |
| `w` | required | Total width in pixels, from `x - w/2` to `x + w/2` |
| `amplitude` | required | Distance from baseline to crest; total height is twice this |
| `waves` | 3 | Number of cycles across the width; fractional values are allowed |
| `phase` | 0 | Sine-wave phase offset in radians |

Use `noFill()` and `stroke()` for a line wave. Large cycle counts can look jagged
because the sample count is fixed. The helper does not advance phase itself.

```js
noFill();
stroke(120, 240, 180);
audioReactiveWave(300, 300, 400, audio => 4 + audio.treble * 30,
  audio => 2 + audio.mid * 4, frameCount * 0.04);
```
