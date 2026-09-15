# Architecture

The library is intentionally one browser file so a student can copy it into a
p5 sketch. Inside that file, the code is divided into two conceptual layers.

## 1. Audio and value utilities

The utility layer owns the changing input:

- `audioReactive.init(song)` connects the already-loaded `p5.SoundFile` to one FFT.
- `audioReactive.update()` reads the FFT once and updates `audioReactive.audio`.
- `audioValue(value)` is the general value-or-function pattern. A literal passes
  through unchanged; a function is called with the current audio object.
- `bandLevel()` converts FFT bins into normalized `bass`, `mid`, and `treble` values.
- `rotateRadians()` applies a local rotation without changing the sketch's
  `angleMode()` setting.

Students normally use only `audioReactive.update()` and the `audio` parameter in
their arrows. The utility layer does not draw anything.

## 2. Reactive drawing primitives

The six `audioReactive*` shape functions are consumers of those utilities. Each
one follows the same three steps:

1. Resolve every argument with the value-or-function rule.
2. Use the resolved values as geometry.
3. Draw with the current p5 styles.

That means an arrow function never needs to know whether its result will become a
circle size, a line endpoint, or a star rotation:

```js
const pulse = audio => 20 + audio.bass * 100;
audioReactiveCircle(200, 200, pulse);
audioReactiveRect(400, 200, pulse, 20);
```

Styling (`fill`, `stroke`, `noFill`, and so on) stays in the sketch. The drawing
primitives preserve temporary p5 state with `push()`/`pop()` where transforms or
mode changes are needed.

## Frame order

Keep the layers in this order inside `draw()`:

```js
background(20);
audioReactive.update();
audioReactiveCircle(300, 200, audio => 50 + audio.bass * 180);
```

The background clears the previous frame, the utility layer refreshes audio once,
and the primitives render the current frame.
