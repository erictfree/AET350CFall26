# Audio Reactive Shapes

A small teaching library for p5.js: pass a number or an audio function to a shape.

```js
audioReactiveCircle(300, 200, audio => 50 + audio.bass * 180);
```

The arrow returns a size. The shape handles drawing. Replace the arrow to change
the behavior, or combine shapes into a composition.

**Version:** 0.1.0 · **Tested with:** p5.js 2.3.3 and p5.sound 0.4.1 · **Mode:** p5 global mode

## Documentation

- [Getting started](docs/getting-started.md) — load a song, draw, and change a behavior.
- [API reference](docs/api.md) — every public method, parameter, default, unit, and return value.
- [Examples](docs/examples.md) — recipes for all six shapes and compositions.
- [Teaching and maintenance notes](docs/teaching-notes.md) — the evaluation pattern, exercises, and tests.
- [Changelog](CHANGELOG.md) — version history.

## Quick start

Open `index.html` with Live Server in VS Code. Edit [sketch.js](sketch.js), or start
with [the one-circle example](examples/one-circle.js). Click the canvas to play/pause.

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
  noStroke();
  fill(100, 220, 255);
  audioReactiveCircle(300, 200, audio => 50 + audio.bass * 180);
}

function mousePressed() {
  audioReactive.toggle();
}
```

Your sketch owns loading and the draw loop. The library supplies audio controls
(`bass`, `mid`, `treble`) and six reusable shape functions. Styling stays in your sketch.

## Add to another sketch

Copy [audio-reactive.js](audio-reactive.js) into the project and load scripts in this order:

```html
<script src="https://cdn.jsdelivr.net/npm/p5@2.3.3/lib/p5.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/p5.sound@0.4.1/dist/p5.sound.min.js"></script>
<script src="audio-reactive.js"></script>
<script src="sketch.js"></script>
```

This is a regular browser script. No build step or npm install is required to use
it. The CDN scripts require internet access. It supports one initialized song per
page, not p5 instance mode. It has not been published to npm.

## Shape helpers

All arguments independently accept numbers or functions. Optional arguments have defaults.

| Helper | Purpose |
| --- | --- |
| [audioReactiveCircle](docs/api.md#circle) | Center and diameter |
| [audioReactiveRect](docs/api.md#rect) | Center, dimensions, rotation |
| [audioReactiveLine](docs/api.md#line) | Two endpoints |
| [audioReactiveStar](docs/api.md#star) | Five-point star and rotation |
| [audioReactiveOrbit](docs/api.md#orbit) | A dot at an angle around a center |
| [audioReactiveWave](docs/api.md#wave) | A sine wave with controllable height, cycles, and phase |

## Development

Run `npm test` with Node.js installed. Tests need no npm dependencies and cover
argument evaluation, shape defaults, shared FFT updates, and playback helpers.
Public functions also have JSDoc comments in [the source](audio-reactive.js).

The Markdown documentation uses relative links and works in GitHub and VS Code.
No documentation build or GitHub Pages deployment is needed.

The included `sound.mp3` comes from the original project's demo audio and is not
part of the JavaScript library. See [distribution notes](docs/teaching-notes.md#distribution)
before publishing the package publicly.
