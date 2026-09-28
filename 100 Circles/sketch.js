// 100 Circles — student starter.
// The audio is done for you (see audio-bands.js). Your job: write a class,
// make 100 circles from it, and let each one listen to the music.

// STUDENTS: write your Circle class here.
// It needs a constructor, an update(diameter, audio) method, and a draw() method.

let circles = []; // your 100 circles go here

async function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);

  // STUDENTS: use a loop to create 100 circles and push them into the
  // circles array. Give each one its own position, color, and band.

  // Keep this line last in setup(): it loads and loops the song.
  // Want your own music? Drop an MP3 into the assets folder and change the
  // path below (for example 'assets/my-song.mp3'). Include it in your ZIP.
  await audioBands.init('assets/sound.mp3');
}

function draw() {
  background(230, 30, 9);

  // One fresh object each frame: { bass, mid, treble }, each 0–1.
  const audio = audioBands.read();

  // STUDENTS: loop over circles. For each one, call update() with a diameter
  // and this audio object, then call draw(). Start with a fixed diameter:
  //   circles[i].update(40, audio);
  // then replace 40 with a function of the audio:
  //   circles[i].update(audio => 10 + audio.bass * 150, audio);

  // Remove this readout when your circles are working.
  noStroke();
  fill(0, 0, 100);
  textAlign(CENTER, CENTER);
  textSize(18);
  text(
    `bass ${audio.bass.toFixed(2)}  ·  mid ${audio.mid.toFixed(2)}  ·  treble ${audio.treble.toFixed(2)}`,
    width / 2,
    height / 2
  );
}

// Click to play or pause.
function mousePressed() {
  audioBands.toggle();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
