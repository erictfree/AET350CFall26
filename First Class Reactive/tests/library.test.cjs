const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const vm = require('node:vm');
const source = readFileSync(join(__dirname, '..', 'audio-reactive.js'), 'utf8');

function harness() {
  const calls = [];
  const spectrum = new Float32Array(1024);
  let analyses = 0;
  const song = {
    playing: false,
    connect(node) { this.connected = node; },
    loop(value) { this.looping = value; },
    play() { this.playing = true; },
    pause() { this.playing = false; },
    isPlaying() { return this.playing; },
  };
  const context = vm.createContext({
    CENTER: 'center', CLOSE: 'close',
    p5: { FFT: class { analyze() { analyses++; return spectrum; } } },
    getAudioContext: () => ({ sampleRate: 48000, resume: async () => {} }),
  });
  for (const name of ['push', 'pop', 'ellipseMode', 'circle', 'translate',
    'applyMatrix', 'rectMode', 'rect', 'line', 'beginShape', 'vertex', 'endShape']) {
    context[name] = (...args) => calls.push([name, ...args]);
  }
  vm.runInContext(source, context);
  return { context, calls, spectrum, song, analyses: () => analyses };
}

test('exports helpers without taking over p5 lifecycle or exposing internal state', () => {
  const { context: c } = harness();
  assert.equal(c.audioReactive.version, '0.1.0');
  for (const name of ['setup', 'draw', 'mousePressed', 'fft', 'song', 'audioValue']) {
    assert.equal(c[name], undefined);
  }
  assert.equal(c.audioReactive.isPlaying(), false);
  assert.equal(c.audioReactive.update(), c.audioReactive.audio);
});

test('all 168 number/function combinations draw the same geometry', () => {
  const { context: c, calls } = harness();
  const cases = [
    ['audioReactiveCircle', [100, 200, 60]],
    ['audioReactiveRect', [100, 200, 60, 30, 0.4]],
    ['audioReactiveLine', [10, 20, 30, 40]],
    ['audioReactiveStar', [100, 200, 60, 0.4]],
    ['audioReactiveOrbit', [100, 200, 50, 12, 0.4]],
    ['audioReactiveWave', [100, 200, 200, 10, 3, 0.4]],
  ];
  for (const [name, values] of cases) {
    calls.length = 0;
    c[name](...values);
    const expected = JSON.stringify(calls);
    for (let mask = 0; mask < 2 ** values.length; mask++) {
      const evaluated = values.map(() => 0);
      const args = values.map((value, i) => mask & (1 << i) ? audio => {
        assert.equal(audio, c.audioReactive.audio);
        evaluated[i]++;
        return value;
      } : value);
      calls.length = 0;
      c[name](...args);
      assert.equal(JSON.stringify(calls), expected, name + ' mask ' + mask);
      assert.deepEqual(evaluated, values.map((_, i) => mask & (1 << i) ? 1 : 0));
    }
  }
});

test('optional arguments use their documented numeric defaults', () => {
  const { context: c, calls } = harness();
  for (const [name, args, defaults] of [
    ['audioReactiveRect', [1, 2, 3, 4], [0]],
    ['audioReactiveStar', [1, 2, 3], [0]],
    ['audioReactiveWave', [1, 2, 3, 4], [3, 0]],
  ]) {
    calls.length = 0;
    c[name](...args);
    const expected = JSON.stringify(calls);
    calls.length = 0;
    c[name](...args, ...defaults);
    assert.equal(JSON.stringify(calls), expected);
  }
});

test('init accepts a supplied song without loading or changing loop mode; update shares one FFT reading', async () => {
  const h = harness();
  const api = h.context.audioReactive;
  assert.equal(await api.toggle(), false);
  assert.equal(api.load, undefined);
  for (const invalid of [undefined, 'sound.mp3', Promise.resolve(h.song)]) {
    assert.throws(() => api.init(invalid), /loaded p5.SoundFile/);
  }
  h.song.loop(false);
  assert.equal(api.init(h.song), undefined);
  assert.ok(h.song.connected instanceof h.context.p5.FFT);
  assert.equal(h.song.looping, false);
  assert.equal(api.isPlaying(), false);
  assert.equal(await api.toggle(), true);
  assert.equal(await api.toggle(), false);
  assert.equal(await api.toggle(), true);
  assert.throws(() => api.init(h.song), /only once/);

  api.sensitivity.bass = api.sensitivity.mid = api.sensitivity.treble = 1;
  h.spectrum.fill(0.25, 1, 6);
  h.spectrum.fill(0.5, 18, 111);
  h.spectrum.fill(0.75, 222, 598);
  const audio = api.audio;
  assert.equal(api.update(), audio);
  assert.deepEqual(JSON.parse(JSON.stringify(audio)), { bass: 0.25, mid: 0.5, treble: 0.75 });
  assert.equal(h.analyses(), 1);
  api.sensitivity.treble = 2000;
  api.update();
  assert.equal(audio.treble, 1);
  h.spectrum.fill(0);
  api.update();
  assert.deepEqual(JSON.parse(JSON.stringify(audio)), { bass: 0, mid: 0, treble: 0 });
  assert.equal(h.analyses(), 3);
});
