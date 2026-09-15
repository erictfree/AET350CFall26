# Teaching and maintenance notes

[Home](../README.md) · [Student guide](getting-started.md) · [API reference](api.md)

## The teaching target

Students should be able to explain: “I pass a function that computes a value;
the shape decides how to use that value.” Start with numeric arguments, then
replace one argument with an arrow. The rest of the sketch still works the same way.

This is an introduction to higher-order functions: functions that accept other
functions. Audio provides a changing input students can hear and see.

## The general pattern

The library's private evaluator is deliberately small:

```js
function audioValue(value) {
  return typeof value === "function" ? value(audio) : value;
}
```

It is not restricted to numbers. It passes through any non-function value and
returns whatever a callback produces. A color-setting consumer might expect a
string, while a layout consumer might expect an object. These particular shape
consumers expect numeric coordinates, dimensions, and angles.

The helper stays private because students use shape functions rather than
evaluating values manually. It performs no type validation. Document the consumer's
contract separately from this general evaluation mechanism.

## Keep the visible lifecycle

```js
async function setup() {
  createCanvas(600, 400);
  const song = await loadSound("sound.mp3");
  song.loop(true);
  audioReactive.init(song);
}

function draw() {
  background(20);
  audioReactive.update();
  audioReactiveCircle(300, 200, audio => 50 + audio.bass * 180);
}

function mousePressed() {
  audioReactive.toggle();
}
```

There is no hidden animation registration. A shape call draws immediately. The
library does not load the song or own `setup()` or `draw()`. It shares one audio
snapshot across all the shapes in a frame.

## Why some shapes use push/pop

`push()` saves drawing state, and `pop()` restores it. Circle temporarily uses
center positioning. Rectangle and star also translate and rotate around their
centers. Those changes must not alter the composition's later drawing.

The library preserves caller styles: students set `fill`, `stroke`, and similar
properties outside the arrows. Angles are always interpreted as radians; the
library applies a rotation matrix without changing the sketch's `angleMode`.

## Suggested progression

1. Draw a circle with three numbers.
2. Replace size with a bass-driven arrow.
3. Change the formula to shrink or switch sizes.
4. Use separate arrows for x, y, and size.
5. Name a function and reuse it across two different shapes.
6. Compose several shapes using styles and draw order.
7. Mix audio-driven values with time-driven numeric values.
8. Add a new consumer using the same value-or-function pattern.

Use the [examples](examples.md) as short exercises. Keep expression arrows compact:
`audio => expression`. Avoid introducing mutation, timers, or drawing inside callbacks.

## Documentation structure

The repository uses a small, conventional documentation stack:

- `README.md` is the short entry point.
- `docs/getting-started.md` teaches the workflow.
- `docs/api.md` is the complete public reference.
- `docs/examples.md` provides recipes.
- JSDoc comments describe types, defaults, returns, and examples beside the code.
- `CHANGELOG.md` records releases and changes.

Markdown links are relative, so the pages work on GitHub and in local Markdown
previews. GitHub provides a heading-based outline. The source JSDoc is useful to
readers and editor tooling; no generated API website is required for this package.
If generated documentation is introduced later, preserve the Markdown guide and
the source comments as their respective learning and API sources.

## Maintenance checks

With Node.js installed, no dependency installation is needed:

```sh
npm test
npm run docs:check
```

The tests cover all 168 number/function argument combinations, optional defaults,
initialization, playback helpers, and shared FFT updates. The documentation check
verifies local links and anchors, compiles JavaScript snippets, and checks that the
public functions have JSDoc parameter and return tags.

When changing an API, update the source JSDoc, API page, runnable examples, and
tests together. Include the documentation pages in the student ZIP. Keep the
last script tag in `index.html` pointed at only one runnable sketch.

<a id="distribution"></a>
## Distribution notes

This is a local browser-script package, not a published npm module. The package
metadata is for versioning and development checks. The included `sound.mp3` was
copied from the original project's demo audio and is separate from the library.

No project license has been selected in this prototype. Choose a license and add
a `LICENSE` file as a separate project decision. Do not label the demo audio with
a new license on the assumption that a code license covers it.
