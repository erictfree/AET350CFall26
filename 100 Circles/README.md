# 100 Circles

Write a class, make 100 circles from it, and let each one listen to music.

## Course context

This project is for **AET 350C** in the **Department of Arts and Entertainment
Technologies (AET)** at **The University of Texas at Austin**. It is prepared for
students by **Professor Eric Freeman**.

**Tested with:** p5.js 2.3.3 and p5.sound 0.4.1 · **Mode:** p5 global mode

## Documentation

- [Assignment 4: 100 Circles](docs/assignment.md) — student brief, download steps, and requirements.

## Quick start

Open the **100 Circles** folder in VS Code, then open `index.html` with
Live Server. Click the canvas to play or pause. The song loops.

You edit [sketch.js](sketch.js). The audio lives in
[audio-bands.js](audio-bands.js), which you do not need to edit.

## The `audioBands` helper

| Call | What it does |
| --- | --- |
| `await audioBands.init(path)` | Loads the song and loops it. Call once, at the end of `setup()`. To use your own music, put an MP3 in `assets/` and pass its path. |
| `audioBands.read()` | Refreshes and returns the **one shared** object `{ bass, mid, treble }`, each from 0 to 1. It is the same object every call, so a circle that holds it always sees current values. All zeros while paused. Call once per frame in `draw()`. |
| `audioBands.toggle()` | Plays or pauses the song. |
| `audioBands.isPlaying()` | `true` while the song is playing. |

The band values are **visual** levels, not raw FFT amplitudes. Each band averages
a frequency range, takes a square root to lift quiet sounds, and applies its own gain
so bass doesn't overpower mid and treble:

| Band | Frequency range |
| --- | --- |
| `bass` | 20–250 Hz |
| `mid` | 250–4,000 Hz |
| `treble` | 4,000–12,000 Hz |

## The pattern

```js
// setup(): every circle receives the audio object in its constructor
const audio = audioBands.read();
circles.push(new Circle(x, y, audio, a => 10 + a.bass * 150));

function draw() {
  audioBands.read();                 // refreshes the shared object
  for (let i = 0; i < circles.length; i++) {
    circles[i].update();
    circles[i].draw();
  }
}
```

Every circle holds the same audio object. What makes them different is their
instance variables: each circle has its own position, color, and diameter.
