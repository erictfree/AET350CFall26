// AUDIO REACTIVE PROGRESSION
// Open the parent First Class Reactive folder in VS Code, then run this through
// VS Code Live Server. Do not open progression.html directly
// as a file:// URL; browsers block the local audio file in that mode.
// Press 1, 2, 3, or 4 to focus a stage. Click the canvas to play or pause.

let stage = 3;
let song;
const enabled = [true, true, true, true];

async function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('Menlo, Consolas, monospace');
  song = await loadSound('../assets/sound.mp3');
  song.loop(true);
  audioReactive.init(song);
}

function draw() {
  background(16, 18, 28);
  audioReactive.update();
  drawHeader();
  drawStage(1, width * 0.125, height * 0.42);
  drawStage(2, width * 0.375, height * 0.42);
  drawStage(3, width * 0.625, height * 0.42);
  drawStage(4, width * 0.875, height * 0.42);
  drawMeters();
}

function drawHeader() {
  fill(245);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(24);
  text('From a number to an audio function', width / 2, 22);
  fill(150, 155, 180);
  textSize(13);
  text('Press 1–4 to focus  •  click a checkbox to call / stop a stage  •  click elsewhere to play', width / 2, 57);
}

function drawStage(number, x, y) {
  const active = stage === number;
  const cardWidth = min(width * 0.23, 340);
  const cardHeight = 275;
  const left = x - cardWidth / 2;
  const top = y - 125;

  stroke(active ? color(125, 210, 255) : color(55, 60, 80));
  strokeWeight(active ? 3 : 1);
  fill(31, 34, 49);
  rect(left, top, cardWidth, cardHeight, 14);

  noStroke();
  fill(active ? color(125, 210, 255) : color(70, 75, 100));
  rect(left, top, cardWidth, 5, 14);

  noStroke();
  fill(active ? color(125, 210, 255) : color(185, 188, 210));
  textAlign(CENTER, TOP);
  textSize(15);
  text(`${number}. ${stageTitle(number)}`, x, top - 34, cardWidth - 54, 28);

  const checkboxX = left + cardWidth - 28;
  const checkboxY = top + 18;
  stroke(180);
  strokeWeight(1);
  fill(31, 34, 49);
  rect(checkboxX, checkboxY, 16, 16, 3);
  if (enabled[number - 1]) {
    stroke(125, 210, 255);
    strokeWeight(3);
    line(checkboxX + 3, checkboxY + 8, checkboxX + 7, checkboxY + 12);
    line(checkboxX + 7, checkboxY + 12, checkboxX + 14, checkboxY + 4);
  }
  noStroke();
  fill(185, 188, 210);
  textAlign(RIGHT, CENTER);
  textSize(11);
  text(enabled[number - 1] ? 'on' : 'off', checkboxX - 8, checkboxY + 8);

  if (!enabled[number - 1]) {
    fill(115, 120, 145);
    textAlign(CENTER, CENTER);
    textSize(14);
    text('not called', x, y);
  } else if (number === 1) {
    fill(100, 220, 255);
    circle(x, y, 100);
  } else if (number === 2) {
    fill(255, 190, 100);
    audioReactiveCircle(x, y, 100);
  } else if (number === 3) {
    fill(255, 150, 220);
    audioReactiveCircle(x, y, 45 + audioReactive.audio.bass * 180);
  } else {
    fill(150, 255, 180);
    audioReactiveCircle(x, y, audio => 45 + audio.bass * 180);
  }

  fill(20, 22, 34);
  rect(left + 16, y + 70, cardWidth - 32, 70, 7);
  fill(210, 215, 235);
  textAlign(CENTER, TOP);
  textSize(13);
  text(stageCode(number), x, y + 83, cardWidth - 48, 54);
}

function stageTitle(number) {
  if (number === 1) return 'p5 circle';
  if (number === 2) return 'reactive circle + numbers';
  if (number === 3) return 'reactive circle + bass number';
  return 'reactive circle + arrow';
}

function stageCode(number) {
  if (number === 1) return 'circle(x, y, 100);';
  if (number === 2) return 'audioReactiveCircle(x, y, 100);';
  if (number === 3) return 'audioReactiveCircle(x, y,\n  45 + audioReactive.audio.bass\n  * 180);';
  return 'audioReactiveCircle(x, y,\n  audio => 45 + audio.bass\n  * 180);';
}

function drawMeters() {
  const labels = ['bass', 'mid', 'treble'];
  const values = [audioReactive.audio.bass, audioReactive.audio.mid, audioReactive.audio.treble];
  const colors = [color(255, 110, 140), color(255, 205, 100), color(120, 205, 255)];
  const left = width * 0.14;
  const barWidth = width * 0.72;
  const top = height - 118;

  noStroke();
  textAlign(LEFT, CENTER);
  textSize(13);
  for (let i = 0; i < labels.length; i++) {
    const y = top + i * 27;
    fill(120, 125, 150);
    text(labels[i], left, y + 7);
    fill(42, 45, 62);
    rect(left + 62, y, barWidth, 14, 7);
    fill(colors[i]);
    rect(left + 62, y, barWidth * values[i], 14, 7);
  }

  fill(120, 125, 150);
  textAlign(CENTER, TOP);
  textSize(12);
  text('live FFT band levels (0–1)', width / 2, top + 88);
}

function mousePressed() {
  for (let number = 1; number <= 4; number++) {
    const x = [width * 0.125, width * 0.375, width * 0.625, width * 0.875][number - 1];
    const top = height * 0.42 - 125;
    const cardWidth = min(width * 0.23, 340);
    const checkboxX = x - cardWidth / 2 + cardWidth - 28;
    const checkboxY = top + 18;
    if (mouseX >= checkboxX && mouseX <= checkboxX + 16 && mouseY >= checkboxY && mouseY <= checkboxY + 16) {
      enabled[number - 1] = !enabled[number - 1];
      return;
    }
  }
  audioReactive.toggle();
}

function keyPressed() {
  if (key >= '1' && key <= '4') stage = Number(key);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
