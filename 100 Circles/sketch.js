// 100 Circles — student starter.
// The audio is done for you (see audio-bands.js). Your job: write a class,
// make 100 circles from it, and let each one listen to the music.

// STUDENTS: write your Circle class here.
// Its constructor takes a diameter that is a number or a function of the
// audio. It also needs an update(audio) method and a draw() method.

let circles = []; // your 100 circles go here

async function setup() {
  createCanvas(windowWidth, windowHeight);

  // STUDENTS: use a loop to create 100 circles, each with its own position
  // and color, and push them into the circles array. Start with a fixed
  // diameter:
  //   circles.push(new Circle(x, y, 40));
  // then replace 40 with a function of the audio:
  //   circles.push(new Circle(x, y, audio => 10 + audio.bass * 150));

  // Keep this line last in setup(): it loads and loops the song.
  // Want your own music? Drop an MP3 into the assets folder and change the
  // path below (for example 'assets/my-song.mp3'). Include it in your ZIP.
  await audioBands.init('assets/sound.mp3');
}

function draw() {
  background(16, 19, 28);

  // One fresh object each frame: { bass, mid, treble }, each 0–1.
  const audio = audioBands.read();

  // STUDENTS: loop over circles. Pass this audio object to each circle's
  // update(), then call its draw():
  //   circles[i].update(audio);
  //   circles[i].draw();

  // Remove this readout when your circles are working.
  noStroke();
  fill(255);
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
