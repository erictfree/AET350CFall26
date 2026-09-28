# Assignment 4: 100 Circles

## Course

**AET 350C — Department of Arts and Entertainment Technologies**  
**The University of Texas at Austin**  
**Professor Eric Freeman**  
**TA: Tanmayee Bharadwaj**

## Overview

Make 100 circles that listen to music. Write a `Circle` class, create 100
instances of it, and pass every circle the same audio object each frame. Each
circle listens to one band: bass, mid, or treble.

In Assignment 3, the library did the drawing and you passed in arrow functions.
This time you write the class yourself: its constructor, its `update(audio)`
method, and its `draw()` method. You pass the constructor a diameter that is a
number or an arrow function, just like the shapes in Assignment 3. The circle
stores it, and every frame `update(audio)` calls the function to get the new
diameter.

> **START HERE:** The audio is already done. `audio-bands.js` loads and loops
> the song and gives you `{ bass, mid, treble }` every frame. You
> write everything that listens. See the [project README](../README.md) for the
> `audioBands` calls.

## Download the starter project

1. Open the [AET350CFall26 repository](https://github.com/erictfree/AET350CFall26).
2. Click the green **Code** button and choose **Download ZIP** (or if you are
   familiar with Git, use any method you like).
3. Unzip the download and open `AET350CFall26/100 Circles` in VS Code.
4. Right-click `index.html` and choose **Open with Live Server**.
5. Click the canvas. You should hear music and see the live bass, mid, and
   treble numbers change in the middle of the screen.

The starter includes `assets/sound.mp3`; keep the folder structure intact.
You may use your own music instead: put an MP3 in `assets/`, change the path
in the `audioBands.init()` call in `sketch.js`, and include the file in your ZIP.

## Learning goals

- Define a class with a constructor and methods, and create instances with `new`.
- Explain what `this` refers to inside `circles[i].update(audio)`.
- Store many instances in an array and update them in a loop.
- Use destructuring to pull named values out of an object.
- Read a property by a name stored in a variable: `audio[band]`.
- Pass a function into a constructor, store it, and call it later.

## Requirements

Starting from `sketch.js`:

1. **Keep the provided audio.** Do not edit `audio-bands.js` or remove the
   `audioBands.init()`, `audioBands.read()`, and `audioBands.toggle()` calls.
2. **Write a `Circle` class** with a constructor that takes `x`, `y`, and
   `diameter` (plus anything else you need, such as a color), an
   `update(audio)` method, and a `draw()` method. Use instance variables for
   each circle's position, color, and diameter.
3. **Make 100 circles.** In `setup()`, use a loop to create **100** circles and
   push them into the `circles` array.
4. **Make every circle different.** Give each circle its own position and
   color.
5. **Assign bands.** Each circle listens to one band. Use the audio object to
   access its `bass`, `mid`, or `treble` property. All three bands must appear
   among your 100 circles.
6. **Compute the diameter from the audio.** First create each circle with a
   fixed diameter: `new Circle(x, y, 40)`. Once that works, replace `40` with a
   function that computes the diameter from the audio passed to it, for example
   `new Circle(x, y, audio => 10 + audio.bass * 150)`. Your constructor must
   accept either a number or a function and store it; `update(audio)` calls
   the function.
7. **Update and draw every circle.** In `draw()`, loop over `circles`. Pass
   the audio object to each circle's `update()`, then call its `draw()`.
8. **Use destructuring at least once.** For example, pull the bands out of the
   audio object with `const { bass, mid, treble } = audio;`, or destructure in
   your function's parameter: `({ bass }) => 10 + bass * 150`.
9. **Establish a visual idea** through color, transparency, layering, or motion.

Keep the responsibilities clear: the class's `update()` method changes the
circle's instance variables; its `draw()` method only draws what they say.

### Passing a number or a function to the constructor

```js
// Step 1: a fixed diameter. Every circle is 40 pixels.
circles.push(new Circle(x, y, 40));

// Step 2: a function of the audio. Every circle grows with the bass.
circles.push(new Circle(x, y, audio => 10 + audio.bass * 150));

// Step 3: in step 2, every circle listens to the bass. Now pick a band for
// each circle inside the setup() loop. The function remembers its band.
const band = random(['bass', 'mid', 'treble']);
circles.push(new Circle(x, y, audio => 10 + audio[band] * 150));
```

The constructor stores what it was given. `update(audio)` checks which kind it
is:

```js
constructor(x, y, diameter) {
  this.x = x;
  this.y = y;
  this.diameter = diameter;   // a number or a function
}

update(audio) {
  if (typeof this.diameter === 'function') {
    this.currentDiameter = this.diameter(audio);
  } else {
    this.currentDiameter = this.diameter;
  }
}

draw() {
  circle(this.x, this.y, this.currentDiameter);
}
```

## Submission

Submit a ZIP file containing your entire `100 Circles` folder, including
`index.html`, your edited `sketch.js`, `audio-bands.js`, the `assets` folder,
and any other JavaScript files you created. Do not include `node_modules` or
unrelated files.

## Troubleshooting

- Click the canvas to start audio; browsers require a user gesture.
- If the numbers stay at 0.00, check the browser console and confirm the path
  in `audioBands.init()` matches your MP3's file name in `assets/` exactly.
- If nothing appears, check that your loop actually pushes into `circles` and
  that `draw()` loops over the same array.
- If every instance moves identically, check that you pick random values
  **inside** the loop, once per instance.
- Check the browser console for JavaScript errors.
