/**
 * @file Audio Reactive Shapes — global-mode helpers for p5.js 2.x and p5.sound 0.4.1.
 * Load after p5 and p5.sound, before your sketch. The sketch owns loading and drawing.
 * @version 0.1.0
 * @see docs/api.md
 */

/**
 * Shared audio controls, updated in place once per frame. Treat as read-only in callbacks.
 * @typedef {Object} AudioState
 * @property {number} bass Boosted average amplitude at 20–140 Hz, clamped to 0–1.
 * @property {number} mid Boosted average amplitude at 400–2600 Hz, clamped to 0–1.
 * @property {number} treble Boosted average amplitude at 5200–14000 Hz, clamped to 0–1.
 */

/**
 * Calculate a numeric shape argument from the current audio values.
 * @callback AudioNumberFunction
 * @param {AudioState} audio Current shared audio controls.
 * @returns {number} The position, dimension, or angle to use for this call.
 */

/**
 * A fixed number or a function evaluated when a shape is drawn.
 * @typedef {(number|AudioNumberFunction)} AudioNumber
 */
(() => {
  // ---------------------------------------------------------------------------
  // Audio utilities: lifecycle, FFT analysis, and value-or-function evaluation
  // ---------------------------------------------------------------------------
  let song;
  let fft;
  const audio = { bass: 0, mid: 0, treble: 0 };
  const sensitivity = { bass: 20, mid: 200, treble: 2000 };

  /**
   * Connect an already-loaded sound to a new FFT. Does not load, loop, or play it.
   * @memberof audioReactive
   * @param {p5.SoundFile} sound A sound returned by awaiting loadSound() in setup.
   * @returns {void}
   * @throws {Error} If initialized more than once on the same page.
   * @throws {TypeError} If sound is missing or has no connect() method.
   * @example
   * const song = await loadSound("assets/sound.mp3");
   * song.loop(true);
   * audioReactive.init(song);
   */
  function init(sound) {
    if (song) throw new Error("Call audioReactive.init(song) only once, in setup().");
    if (!sound || typeof sound.connect !== "function") {
      throw new TypeError("Pass a loaded p5.SoundFile to audioReactive.init(song). Await loadSound() first.");
    }
    fft = new p5.FFT(1024);
    sound.connect(fft);
    song = sound;
  }

  /**
   * Refresh the shared audio object using one FFT analysis.
   * Call once per draw(), after background() and before shapes.
   * Before init(), returns the initial zero-valued object without analyzing anything.
   * @memberof audioReactive
   * @returns {AudioState} The same object exposed as audioReactive.audio.
   */
  function update() {
    if (!fft) return audio;
    const spectrum = fft.analyze();
    audio.bass = bandLevel(spectrum, 20, 140, sensitivity.bass);
    audio.mid = bandLevel(spectrum, 400, 2600, sensitivity.mid);
    audio.treble = bandLevel(spectrum, 5200, 14000, sensitivity.treble);
    return audio;
  }

  /** @private */
  function bandLevel(spectrum, lowHz, highHz, gain) {
    const hzPerBin = getAudioContext().sampleRate / (2 * spectrum.length);
    const first = Math.max(0, Math.ceil(lowHz / hzPerBin));
    const last = Math.min(spectrum.length - 1, Math.floor(highHz / hzPerBin));
    let total = 0;
    for (let i = first; i <= last; i++) total += spectrum[i];
    const average = last < first ? 0 : total / (last - first + 1);
    return Math.max(0, Math.min(1, average * gain));
  }

  /**
   * Unlock browser audio and toggle the supplied song's playback.
   * Call from a mouse, key, or button event. Does not change looping settings.
   * @memberof audioReactive
   * @returns {Promise<boolean>} Whether the song is playing afterward; false before init().
   * @example
   * function mousePressed() {
   *   audioReactive.toggle();
   * }
   */
  async function toggle() {
    if (!song || !fft) return false;
    await getAudioContext().resume();
    if (song.isPlaying()) song.pause();
    else song.play();
    return song.isPlaying();
  }

  /**
   * Report playback state without changing it.
   * @memberof audioReactive
   * @returns {boolean} True during playback; false before init() or while paused.
   */
  function isPlaying() {
    return Boolean(song && song.isPlaying());
  }

  /**
   * Evaluate a function with the current audio, or pass a literal value through.
   * This pattern is general: the consumer determines the expected result type.
   * @private
   * @template T
   * @param {T|function(AudioState):T} value A value or a function returning one.
   * @returns {T} The unchanged value or the callback's result.
   */
  function audioValue(value) {
    return typeof value === "function" ? value(audio) : value;
  }

  // ---------------------------------------------------------------------------
  // Reactive drawing primitives: resolve arguments, then draw with p5
  // ---------------------------------------------------------------------------

  /**
   * Draw a centered circle using the current p5 styles.
   * Preserves the caller's ellipseMode and drawing settings with push()/pop().
   * @global
   * @param {AudioNumber} x Center x, in pixels.
   * @param {AudioNumber} y Center y, in pixels.
   * @param {AudioNumber} size Diameter, in pixels; use a nonnegative value.
   * @returns {void}
   * @example
   * audioReactiveCircle(300, 200, audio => 50 + audio.bass * 180);
   */
  function audioReactiveCircle(x, y, size) {
    const cx = audioValue(x);
    const cy = audioValue(y);
    const diameter = audioValue(size);
    push();
    ellipseMode(CENTER);
    circle(cx, cy, diameter);
    pop();
  }

  /**
   * Draw a centered rectangle, rotated locally without affecting later shapes.
   * @global
   * @param {AudioNumber} x Center x, in pixels.
   * @param {AudioNumber} y Center y, in pixels.
   * @param {AudioNumber} w Width, in pixels; use a nonnegative value.
   * @param {AudioNumber} h Height, in pixels; use a nonnegative value.
   * @param {AudioNumber} [rotation=0] Clockwise rotation in radians.
   * @returns {void}
   * @example
   * audioReactiveRect(300, 200, audio => 80 + audio.mid * 200, 16, 0);
   */
  function audioReactiveRect(x, y, w, h, rotation = 0) {
    const cx = audioValue(x);
    const cy = audioValue(y);
    const rectWidth = audioValue(w);
    const rectHeight = audioValue(h);
    const angle = audioValue(rotation);
    push();
    translate(cx, cy);
    rotateRadians(angle);
    rectMode(CENTER);
    rect(0, 0, rectWidth, rectHeight);
    pop();
  }

  /**
   * Draw a line between two endpoints. Use stroke() before calling it.
   * @global
   * @param {AudioNumber} x1 First endpoint x, in pixels.
   * @param {AudioNumber} y1 First endpoint y, in pixels.
   * @param {AudioNumber} x2 Second endpoint x, in pixels.
   * @param {AudioNumber} y2 Second endpoint y, in pixels.
   * @returns {void}
   * @example
   * audioReactiveLine(100, 80, 500, audio => 80 + audio.treble * 150);
   */
  function audioReactiveLine(x1, y1, x2, y2) {
    line(audioValue(x1), audioValue(y1), audioValue(x2), audioValue(y2));
  }

  /**
   * Draw a five-point star. At zero rotation one point faces upward.
   * The inner radius is 45% of the outer radius. Drawing settings are restored afterward.
   * @global
   * @param {AudioNumber} x Center x, in pixels.
   * @param {AudioNumber} y Center y, in pixels.
   * @param {AudioNumber} size Outer diameter, in pixels; use a nonnegative value.
   * @param {AudioNumber} [rotation=0] Clockwise rotation in radians.
   * @returns {void}
   * @example
   * audioReactiveStar(300, 200, 80, audio => audio.mid * 3);
   */
  function audioReactiveStar(x, y, size, rotation = 0) {
    const cx = audioValue(x);
    const cy = audioValue(y);
    const radius = audioValue(size) / 2;
    const angle = audioValue(rotation);
    push();
    translate(cx, cy);
    rotateRadians(angle);
    beginShape();
    for (let i = 0; i < 10; i++) {
      const a = i * Math.PI / 5 - Math.PI / 2;
      const r = i % 2 === 0 ? radius : radius * 0.45;
      vertex(Math.cos(a) * r, Math.sin(a) * r);
    }
    endShape(CLOSE);
    pop();
  }

  /**
   * Draw a dot on a circular orbit. This function does not advance time itself.
   * At angle zero the dot is to the right of the center; positive angles move clockwise.
   * @global
   * @param {AudioNumber} x Orbit center x, in pixels.
   * @param {AudioNumber} y Orbit center y, in pixels.
   * @param {AudioNumber} radius Distance from the center to the dot, in pixels.
   * @param {AudioNumber} size Dot diameter, in pixels.
   * @param {AudioNumber} angle Position on the orbit, in radians.
   * @returns {void}
   * @example
   * audioReactiveOrbit(300, 200, audio => 70 + audio.bass * 80, 14, frameCount * 0.025);
   */
  function audioReactiveOrbit(x, y, radius, size, angle) {
    const cx = audioValue(x);
    const cy = audioValue(y);
    const r = audioValue(radius);
    const diameter = audioValue(size);
    const a = audioValue(angle);
    audioReactiveCircle(cx + Math.cos(a) * r, cy + Math.sin(a) * r, diameter);
  }

  /**
   * Draw a decorative sine wave using 81 vertices, not the song's raw waveform.
   * Usually pair with noFill() and stroke(). The function does not advance phase itself.
   * @global
   * @param {AudioNumber} x Horizontal center, in pixels.
   * @param {AudioNumber} y Baseline y, in pixels.
   * @param {AudioNumber} w Total horizontal width, in pixels.
   * @param {AudioNumber} amplitude Distance from the baseline to a crest, in pixels.
   * @param {AudioNumber} [waves=3] Number of cycles across the width; may be fractional.
   * @param {AudioNumber} [phase=0] Sine-wave phase offset, in radians.
   * @returns {void}
   * @example
   * audioReactiveWave(300, 300, 400, audio => 4 + audio.treble * 30, 3, frameCount * 0.04);
   */
  function audioReactiveWave(x, y, w, amplitude, waves = 3, phase = 0) {
    const cx = audioValue(x);
    const cy = audioValue(y);
    const span = audioValue(w);
    const waveHeight = audioValue(amplitude);
    const count = audioValue(waves);
    const offset = audioValue(phase);
    beginShape();
    for (let i = 0; i <= 80; i++) {
      const t = i / 80;
      vertex(cx + (t - 0.5) * span, cy + Math.sin(t * Math.PI * 2 * count + offset) * waveHeight);
    }
    endShape();
  }

  /** @private */
  function rotateRadians(angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    applyMatrix(c, s, -s, c, 0, 0);
  }

  /**
   * Audio lifecycle and shared controls. The sketch owns setup(), draw(), and events.
   * @namespace audioReactive
   * @property {string} version Library version, currently "0.1.0".
   * @property {AudioState} audio Shared current values; read these without mutating them.
   * @property {Object} sensitivity Mutable per-band gain settings.
   * @property {number} sensitivity.bass Bass multiplier; default 20.
   * @property {number} sensitivity.mid Mid multiplier; default 200.
   * @property {number} sensitivity.treble Treble multiplier; default 2000.
   */
  const audioReactive = { version: "0.1.0", audio, sensitivity, init, update, toggle, isPlaying };

  // Global-mode API. The library never defines setup(), draw(), or event handlers.
  Object.assign(globalThis, {
    audioReactive,
    audioReactiveCircle,
    audioReactiveRect,
    audioReactiveLine,
    audioReactiveStar,
    audioReactiveOrbit,
    audioReactiveWave,
  });
})();
