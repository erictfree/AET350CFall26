// To try this example, change the last script in index.html to examples/one-circle.js.
// Load only one sketch at a time. The song is in assets/sound.mp3.
async function setup() {
  createCanvas(windowWidth, windowHeight);
  const song = await loadSound("assets/sound.mp3");
  song.loop(true);
  audioReactive.init(song);
}

function draw() {
  background(20);
  audioReactive.update();
  noStroke();
  fill(100, 220, 255);

  // Start here: change the arrow, or replace any argument with a number.
  audioReactiveCircle(width / 2, height / 2, audio => 50 + audio.bass * 180);

  if (!audioReactive.isPlaying()) {
    fill(255);
    textAlign(CENTER, CENTER);
    text("click to play", width / 2, height - 30);
  }
}

function mousePressed() {
  audioReactive.toggle();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
