// AUDIO REACTIVE PROGRESSION
// Open the parent First Class Reactive folder in VS Code, then run this through
// VS Code Live Server. Do not open progression.html directly
// as a file:// URL; browsers block the local audio file in that mode.
// Press 1, 2, or 3 to focus a stage. Click the canvas to play or pause.

let stage = 3;
let song;

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
  drawStage(1, width * 0.18, height * 0.42);
  drawStage(2, width * 0.50, height * 0.42);
  drawStage(3, width * 0.82, height * 0.42);
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
  text('Press 1–3 to focus a stage  •  click to play / pause', width / 2, 57);
}

function drawStage(number, x, y) {
  const active = stage === number;
  const cardWidth = min(width * 0.27, 300);
  const cardHeight = 275;
  const left = x - cardWidth / 2;
  const top = y - 125;

  stroke(active ? color(125, 210, 255) : color(55, 60, 80));
  strokeWeight(active ? 3 : 1);
  fill(31, 34, 49);
  rect(left, top, cardWidth, cardHeight, 14);

  noStroke();
  fill(active ? color(125, 210, 255) : color(160));
  textAlign(CENTER, TOP);
  textSize(16);
  text(`${number}. ${stageTitle(number)}`, x, top + 18);

  if (number === 1) {
    fill(100, 220, 255);
    circle(x, y, 100);
  } else if (number === 2) {
    fill(255, 190, 100);
    audioReactiveCircle(x, y, 100);
  } else {
    fill(150, 255, 180);
    audioReactiveCircle(x, y, audio => 45 + audio.bass * 180);
  }

  fill(185, 188, 210);
  textSize(12);
  text(stageCode(number), x, top + cardHeight - 42, cardWidth - 28, 34);
}

function stageTitle(number) {
  if (number === 1) return 'p5 circle';
  if (number === 2) return 'reactive circle + numbers';
  return 'reactive circle + arrow';
}

function stageCode(number) {
  if (number === 1) return 'circle(width / 2, height / 2, 100);';
  if (number === 2) return 'audioReactiveCircle(x, y, 100);';
  return 'audioReactiveCircle(x, y, audio => 45 + audio.bass * 180);';
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
  audioReactive.toggle();
}

function keyPressed() {
  if (key >= '1' && key <= '3') stage = Number(key);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
