// Fullscreen p5.js display for a single value (number/string) or a short array.
// Set currentValue to whatever you want to show, then call updateDisplay(currentValue).

let currentValue;

// Try changing these arrays, then experiment with the array methods below.
const numbers = [12, 37, 51, 64, 78, 91, 23, 88, 45, 100];
const fruits = ['apple', 'banana', 'cherry', 'dragonfruit', 'kiwi', 'mango'];

const COLORS = {
  bg: '#1e1e2e',
  number: '#7aa2f7',
  string: '#9ece6a',
  boolean: '#e0af68',
  other: '#bb9af7',
  box: '#2a2a3d',
  text: '#f5f5f5',
  label: '#8888aa'
};

const DEMOS = [
  42,
  "hello",
  numbers.slice(0, 5),
  fruits.slice(0, 5),
  []
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textFont('Menlo, Consolas, monospace');

  // ----- Higher-order array function examples (try one at a time) -----

  // forEach - just runs a function per element, nothing to display
  // numbers.forEach(n => console.log(n * 2));   // logs each number doubled, one at a time

  // map - transform each element into a new array
  // updateDisplay(numbers.map(n => n * 2));         // new array with every number doubled
  // updateDisplay(fruits.map(f => f.toUpperCase())); // new array with every fruit name in caps

  // filter - keep only the elements that pass a test
  const filteredNumbers = numbers.filter(n => n > 50); // new array with only numbers greater than 50
  updateDisplay(filteredNumbers);
  // updateDisplay(fruits.filter(f => f.length > 5)); // new array with only fruit names longer than 5 letters

  // reduce - combine all elements into a single value
  updateDisplay(numbers.reduce((sum, n) => sum + n, 0));      // total of every number added together
  // updateDisplay(numbers.reduce((max, n) => Math.max(max, n))); // the single largest number in the array

  // find / some / every - test elements, return one value or a boolean
  // updateDisplay(numbers.find(n => n > 90));  // the first number greater than 90 (or undefined if none)
  // updateDisplay(numbers.some(n => n > 90));  // true if AT LEAST ONE number is greater than 90
  // updateDisplay(numbers.every(n => n > 0));  // true only if EVERY number is greater than 0

  // sort - reorder elements. WARNING: sort() is destructive - it mutates
  // the array it's called on, in place, instead of returning a new one.
  // numbers.sort((a, b) => a - b) would permanently reorder `numbers` itself.
  // Copy first with [...numbers] (or numbers.slice()) to keep the original safe.
  const sortedNumbers = [...numbers].sort((a, b) => a - b); // copy, then sort the copy smallest to largest
  updateDisplay(sortedNumbers.slice(0, 8)); // show the first 8 (smallest) sorted numbers

  // ----- Chaining - call another array method directly on the result of the last one -----

  // filter then map: keep only the even numbers, then double each one that's left
  const doubledEvens = numbers.filter(n => n % 2 === 0).map(n => n * 10);
  updateDisplay(doubledEvens);
  // filter then map then reduce: keep numbers over 50, double them, then add them all into one total
  // updateDisplay(numbers.filter(n => n > 50).map(n => n * 2).reduce((sum, n) => sum + n, 0));

  // map doesn't have to return numbers or strings - the callback can return ANY type,
  // like a boolean. Here every number becomes true/false based on the test.
  updateDisplay(numbers.map(n => n > 50)); // array of true/false, same length/order as numbers
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(COLORS.bg);

  if (Array.isArray(currentValue)) {
    drawArray(currentValue);
  } else {
    drawSingleValue(currentValue);
  }
}

function keyPressed() {
  const n = parseInt(key, 10);
  if (n >= 1 && n <= DEMOS.length) {
    updateDisplay(DEMOS[n - 1]);
  }
}

// Call updateDisplay(currentValue) any time currentValue changes, to show it on screen.
function updateDisplay(value) {
  currentValue = value;
}

function colorForType(value) {
  switch (typeof value) {
    case 'number': return COLORS.number;
    case 'string': return COLORS.string;
    case 'boolean': return COLORS.boolean;
    default: return COLORS.other;
  }
}

function drawSingleValue(value) {
  const boxW = min(width * 0.5, 420);
  const boxH = min(height * 0.3, 240);
  const x = width / 2 - boxW / 2;
  const y = height / 2 - boxH / 2;

  noStroke();
  fill(colorForType(value));
  rect(x, y, boxW, boxH, 16);

  fill(COLORS.text);
  textSize(min(boxW, boxH) * 0.28);
  text(formatValue(value), width / 2, height / 2);

  fill(COLORS.label);
  textSize(18);
  text(`type: ${typeof value}`, width / 2, y - 30);
}

function drawArray(arr) {
  if (arr.length === 0) {
    fill(COLORS.label);
    textSize(24);
    text('[ ]  (empty array)', width / 2, height / 2);
    return;
  }

  const maxBoxW = 160;
  const gap = 16;
  const availableW = width * 0.85;
  const boxW = min(maxBoxW, (availableW - gap * (arr.length - 1)) / arr.length);
  const boxH = boxW;
  const totalW = boxW * arr.length + gap * (arr.length - 1);
  const startX = width / 2 - totalW / 2;
  const y = height / 2 - boxH / 2;

  for (let i = 0; i < arr.length; i++) {
    const x = startX + i * (boxW + gap);
    const value = arr[i];

    noStroke();
    fill(colorForType(value));
    rect(x, y, boxW, boxH, 10);

    fill(COLORS.text);
    textSize(min(boxW, boxH) * 0.32);
    text(formatValue(value), x + boxW / 2, y + boxH / 2);

    fill(COLORS.label);
    textSize(16);
    text(i, x + boxW / 2, y + boxH + 24);
  }

  fill(COLORS.label);
  textSize(18);
  text(`array of ${arr.length}`, width / 2, y - 30);
}

function formatValue(value) {
  if (typeof value === 'string') return `"${value}"`;
  return String(value);
}
