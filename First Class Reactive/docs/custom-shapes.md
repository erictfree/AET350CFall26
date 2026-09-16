# Creating Your Own Reactive Shape

For extra credit, make a new shape that fits the library's pattern. A **custom
shape** is just a JavaScript function that accepts values and uses p5.js drawing
commands to draw something new:

1. Accept shape arguments as numbers or functions.
2. Call each function with the current audio object.
3. Use the returned values to draw with ordinary p5.js functions.

Here is a simple triangle primitive:

```js
function audioReactiveTriangle(x, y, size) {
  // Each parameter can be a fixed value or a function.
  // If it is a function, call it with the current audio object.
  const cx = typeof x === 'function' ? x(audioReactive.audio) : x;
  const cy = typeof y === 'function' ? y(audioReactive.audio) : y;
  const s = typeof size === 'function' ? size(audioReactive.audio) : size;

  // Use the resolved values with p5.js drawing commands.
  triangle(cx, cy - s / 2, cx - s / 2, cy + s / 2, cx + s / 2, cy + s / 2);
}
```

Use it in `draw()` like this:

```js
fill(100, 220, 255);
// The arrow returns a size. The triangle function uses that size to draw.
audioReactiveTriangle(300, 200, audio => 40 + audio.treble * 160);
```

Keep the responsibilities clear: the custom shape function only draws the shape.
Each arrow function passed to it only creates one responsive value for `x`, `y`,
`size`, or another parameter. An arrow can read the audio object and return a
value, but it should not draw anything. Put appearance choices such as `fill()`
and `stroke()` in `draw()`, before the custom shape call. If the custom code uses
`translate()`, `rotate()`, or changes a p5.js mode, use `push()` at the beginning
and `pop()` at the end so the next drawing starts with the old settings.
