// Fullscreen p5.js display for a single value (number/string) or a short array.
// Set currentValue to whatever you want to show, then call updateDisplay(currentValue).

const numbers = [12, 37, 51, 64, 78, 91, 23, 88, 45, 100];
const fruits = ['apple', 'banana', 'cherry', 'dragonfruit', 'kiwi', 'mango'];

let currentValue = numbers;

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

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textFont('Menlo, Consolas, monospace');
}

function draw() {
  background(COLORS.bg);
  
  drawValue(currentValue);
}

function drawValue(value) {
  if (Array.isArray(value)) {
    drawArray(value);
  } else {
    drawSingleValue(value);
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
