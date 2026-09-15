// Audio Reactive Shapes — edit your composition in draw().
// Every shape argument can be a number or a function of audio.

async function setup() {
  createCanvas(windowWidth, windowHeight);
  const song = await loadSound("sound.mp3");
  song.loop(true);
  audioReactive.init(song);
}

function draw() {
  background(20, 25);
  audioReactive.update();

  // STUDENTS: compose shapes here. Every argument can be a number or an arrow.
  // Styling stays outside the arrows; each arrow only returns a number.

  // Bass makes the circle pulse.
  noStroke();
  fill(100, 220, 255);
  audioReactiveCircle(width * 0.3, height * 0.45, audio => 50 + audio.bass * 180);

  // A dot travels around the circle. Bass expands its orbit.
  fill(240);
  audioReactiveOrbit(
    width * 0.3, height * 0.45,
    audio => 70 + audio.bass * 100,
    14, frameCount * 0.025
  );

  // Treble changes the star's size; mids turn it.
  fill(255, 180, 100);
  audioReactiveStar(
    width * 0.7, height * 0.45,
    audio => 60 + audio.treble * 120,
    audio => audio.mid * 3
  );

  // Mids stretch a bar. Rectangles are positioned by their center.
  fill(210, 130, 255);
  audioReactiveRect(width / 2, height * 0.75, audio => 80 + audio.mid * 320, 16);

  // Treble moves one endpoint of a line.
  stroke(255, 140, 180);
  strokeWeight(3);
  audioReactiveLine(width * 0.15, 80, width * 0.85, audio => 80 + audio.treble * 180);

  // A traveling wave: treble changes its height; mids change its number of waves.
  noFill();
  stroke(120, 240, 180);
  strokeWeight(2);
  audioReactiveWave(
    width / 2, height * 0.88, width * 0.7,
    audio => 4 + audio.treble * 30,
    audio => 2 + audio.mid * 4,
    frameCount * 0.4
  );
  noStroke();

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
