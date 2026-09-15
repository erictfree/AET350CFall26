const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const files = ['README.md', 'CHANGELOG.md', ...fs.readdirSync(path.join(root, 'docs'))
  .filter(name => name.endsWith('.md')).map(name => 'docs/' + name)];
let links = 0;
let snippets = 0;

function anchors(markdown) {
  const ids = new Set([...markdown.matchAll(/<a\s+id="([^"]+)"/g)].map(match => match[1]));
  for (const match of markdown.matchAll(/^#{1,6}\s+(.+)$/gm)) {
    ids.add(match[1].toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s/g, '-'));
  }
  return ids;
}

for (const file of files) {
  const text = fs.readFileSync(path.join(root, file), 'utf8');
  for (const match of text.matchAll(/\[[^\]]*\]\(([^\s)]+)\)/g)) {
    const href = match[1];
    if (/^[a-z]+:/i.test(href)) continue;
    assert.ok(!href.startsWith('/'), file + ': use relative links: ' + href);
    const [relative, fragment] = href.split('#');
    const target = relative ? path.resolve(root, path.dirname(file), decodeURIComponent(relative)) : path.join(root, file);
    assert.ok(fs.existsSync(target), file + ': missing link target: ' + href);
    if (fragment && target.endsWith('.md')) {
      assert.ok(anchors(fs.readFileSync(target, 'utf8')).has(decodeURIComponent(fragment)), file + ': missing anchor: ' + href);
    }
    links++;
  }
  for (const match of text.matchAll(/```(?:js|javascript)\n([\s\S]*?)```/g)) {
    new vm.Script('(async function () {\n' + match[1] + '\n});', { filename: file });
    assert.ok(!/\(audio\)\s*=>/.test(match[1]), file + ': use audio => expression');
    snippets++;
  }
}

const source = fs.readFileSync(path.join(root, 'audio-reactive.js'), 'utf8');
const context = vm.createContext({});
vm.runInContext(source, context);
const publicNames = [
  ...Object.keys(context).filter(name => typeof context[name] === 'function'),
  ...Object.keys(context.audioReactive).filter(name => typeof context.audioReactive[name] === 'function'),
];
const comments = new Map([...source.matchAll(/\/\*\*((?:(?!\*\/)[\s\S])*)\*\/\s*(?:async\s+)?function\s+(\w+)\(([^)]*)\)/g)]
  .map(match => [match[2], { text: match[1], args: match[3] }]));
const api = fs.readFileSync(path.join(root, 'docs/api.md'), 'utf8');
for (const name of publicNames) {
  const comment = comments.get(name);
  assert.ok(comment, 'Missing JSDoc for ' + name);
  assert.ok(/@returns\s+\{/.test(comment.text), 'Missing return type for ' + name);
  const actual = comment.args.split(',').map(arg => arg.trim().split('=')[0].trim()).filter(Boolean);
  const documented = [...comment.text.matchAll(/@param\s+\{[^}]+\}\s+(\[[^\]]+\]|\w+)/g)]
    .map(match => match[1].replace(/^\[|\]$/g, '').split('=')[0]);
  assert.deepEqual(documented, actual, 'JSDoc parameter mismatch: ' + name);
  assert.ok(api.includes(name + '('), 'Missing API reference for ' + name);
}
console.log('PASS:', files.length, 'Markdown files,', links, 'local links,', snippets,
  'JavaScript snippets, and JSDoc for', publicNames.length, 'public functions.');
