# Creating Your Own Reactive Shape

For extra credit, make a new shape that fits the library's pattern:

1. Accept shape arguments as numbers or functions.
2. Call each function with the current audio object.
3. Use the returned values to draw with ordinary p5.js functions.

Here is a simple triangle primitive:

```js
function audioReactiveTriangle(x, y, size) {
  // A parameter can be a fixed value or a function.
  // If it is a function, call it with the current audio object.
  const cx = typeof x === 'function' ? x(audioReactive.audio) : x;
  const cy = typeof y === 'function' ? y(audioReactive.audio) : y;
  const s = typeof size === 'function' ? size(audioReactive.audio) : size;

  // The arrow function supplies the size; this function draws the triangle.
  triangle(cx, cy - s / 2, cx - s / 2, cy + s / 2, cx + s / 2, cy + s / 2);
}
```

Use it in `draw()` like any other shape:

```js
// The first two values stay fixed. The arrow makes the size react to treble.
audioReactiveTriangle(300, 200, audio => 40 + audio.treble * 160);
```

The arrow function calculates a value; the shape function does the drawing. Keep
styles such as `fill()` and `stroke()` in `draw()`. If your shape changes p5
settings or transforms, wrap those changes in `push()` and `pop()` so it does not
affect the next shape.
