// audio-bands.js — PROVIDED. You do not need to edit this file.
//
// Loads a song, loops it, analyzes it with p5.sound's FFT, and hands your
// sketch one plain object of band levels each frame:
//
//   { bass: 0–1, mid: 0–1, treble: 0–1 }
//
// Tested with p5.js 2.3.3 and p5.sound 0.4.1 in p5 global mode.

const audioBands = (() => {
  // Higher-frequency bands tend to average lower in most recordings. These
  // gains balance their *visual* influence without changing the sound.
  const BAND_GAINS = { bass: 1, mid: 2.2, treble: 3.2 };
  const FFT_SIZE = 1024;

  let song;
  let fft;

  // Load the song, connect it to the FFT, and set it to loop.
  // Call with await at the end of setup().
  async function init(path) {
    fft = new p5.FFT(FFT_SIZE);
    try {
      // fetch() handles spaces in the project folder's URL.
      const response = await fetch(path);
      if (!response.ok) throw new Error(`No audio file found at ${path}`);
      const buffer = await getAudioContext().decodeAudioData(await response.arrayBuffer());
      song = new p5.SoundFile(buffer);
      song.connect(fft);
      song.loop(true); // loop when played; does not start playback
    } catch (error) {
      song = undefined;
      console.error('Could not load the audio', error);
    }
  }

  // Returns a NEW object every call: { bass, mid, treble }, each 0–1.
  // All zeros while nothing is playing.
  function read() {
    const audio = { bass: 0, mid: 0, treble: 0 };
    if (song?.isPlaying()) {
      const spectrum = fft.analyze();
      audio.bass = bandLevel(spectrum, 20, 250, BAND_GAINS.bass);
      audio.mid = bandLevel(spectrum, 250, 4000, BAND_GAINS.mid);
      audio.treble = bandLevel(spectrum, 4000, 12000, BAND_GAINS.treble);
    }
    return audio;
  }

  // Average the FFT bins between two frequencies, then lift quiet values so
  // each band can produce a visible change. These are calibrated visual
  // levels, not raw spectral amplitudes.
  function bandLevel(spectrum, lowHz, highHz, gain) {
    const binWidth = getAudioContext().sampleRate / FFT_SIZE;
    const firstBin = Math.max(0, Math.floor(lowHz / binWidth));
    const lastBin = Math.min(spectrum.length - 1, Math.ceil(highHz / binWidth));
    let sum = 0;
    for (let bin = firstBin; bin <= lastBin; bin++) {
      sum += spectrum[bin];
    }
    const average = sum / (lastBin - firstBin + 1);
    return Math.min(1, Math.sqrt(average) * 5 * gain);
  }

  // Play or pause the song. Browsers need a click before audio starts.
  async function toggle() {
    if (!song) return;
    await userStartAudio();
    if (song.isPlaying()) {
      song.pause();
    } else {
      song.play();
    }
  }

  function isPlaying() {
    return Boolean(song?.isPlaying());
  }

  return { init, read, toggle, isPlaying };
})();
