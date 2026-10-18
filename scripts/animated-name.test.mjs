import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import postcss from 'postcss';

const require = createRequire(import.meta.url);
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
function evaluate(path, modules = {}, globals = {}) {
  const exports = {};
  const code = ts.transpileModule(read(path), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  new Function('exports', 'require', ...Object.keys(globals), code)(exports, name => modules[name] ?? require(name), ...Object.values(globals));
  return exports;
}
const lib = evaluate('src/lib/name-reveal.ts');
const names = { en: 'Harsh Kumar', hi: 'हर्ष कुमार' };
function clockHarness() {
  let now = 0, id = 0;
  const frames = new Map(), timers = new Map();
  const clock = {
    now: () => now,
    requestFrame: callback => { frames.set(++id, callback); return id; },
    cancelFrame: key => frames.delete(key),
    setTimer: (callback, delay) => { timers.set(++id, { callback, at: now + delay }); return id; },
    clearTimer: key => timers.delete(key),
  };
  return { clock, frames, timers, advance(time) {
    now = time;
    const callbacks = [...frames.values(), ...[...timers.values()].filter(timer => timer.at <= now).map(timer => timer.callback)];
    frames.clear();
    callbacks.forEach(callback => callback());
  } };
}

test('Hindi clusters, matras and spaces stay intact; reveal resolves left to right with dynamic noise', () => {
  const hindi = lib.nameGraphemes(names.hi);
  assert.deepEqual(hindi.map(part => part.text), ['ह', 'र्ष', ' ', 'कु', 'मा', 'र']);
  assert.deepEqual(hindi.map(part => part.index), [0, 1, 4, 5, 7, 9]);
  for (const language of ['en', 'hi']) {
    const glyphs = lib.nameGraphemes(names[language]).map(part => part.text);
    const first = lib.scrambleGraphemes(glyphs, language, 0, () => 0);
    const second = lib.scrambleGraphemes(glyphs, language, 0, () => 0.9);
    assert.notDeepEqual(first, second);
    let previous = 0;
    for (const progress of [0, 0.2, 0.5, 0.8, 1]) {
      const result = lib.scrambleGraphemes(glyphs, language, progress, () => 0.99);
      assert.equal(result.length, glyphs.length);
      glyphs.forEach((glyph, index) => { if (glyph === ' ') assert.equal(result[index], ' '); });
      const expected = Math.floor(progress * glyphs.filter(glyph => glyph !== ' ').length);
      const actualLetters = result.filter(glyph => glyph !== ' ');
      assert.deepEqual(actualLetters.slice(0, expected), glyphs.filter(glyph => glyph !== ' ').slice(0, expected));
      assert.ok(expected >= previous); previous = expected;
    }
    assert.equal(lib.scrambleGraphemes(glyphs, language, 1).join(''), names[language]);
  }
});

test('single existing cycle reveals English, Hindi at 4s and English at 9s; holds schedule no RAF loop', () => {
  const h = clockHarness(), output = [];
  const cycle = lib.createNameReveal(names, value => output.push(value), h.clock);
  assert.equal(output.at(-1).language, 'en'); assert.ok(output.at(-1).glyphs);
  const count = output.length;
  h.advance(16); assert.equal(output.length, count); // throttled glyph writes
  h.advance(800); assert.deepEqual(output.at(-1), { language: 'en', glyphs: null });
  assert.equal(h.frames.size, 0); assert.equal(h.timers.size, 1);
  h.advance(3999); assert.equal(output.at(-1).language, 'en');
  h.advance(4000); assert.equal(output.at(-1).language, 'hi'); assert.ok(output.at(-1).glyphs);
  h.advance(4800); assert.deepEqual(output.at(-1), { language: 'hi', glyphs: null });
  h.advance(9000); assert.equal(output.at(-1).language, 'en'); assert.ok(output.at(-1).glyphs);
  h.advance(9800); assert.deepEqual(output.at(-1), { language: 'en', glyphs: null });
  assert.equal(h.frames.size + h.timers.size, 0);
  const end = output.length; h.advance(30000); assert.equal(output.length, end);
  cycle.dispose();
});

test('reduced motion, rapid preference changes, hidden tabs and disposal leave no stale scheduled work', () => {
  const h = clockHarness(), output = [];
  const cycle = lib.createNameReveal(names, value => output.push(value), h.clock, true);
  assert.deepEqual(output.at(-1), { language: 'en', glyphs: null });
  assert.equal(h.frames.size + h.timers.size, 0);
  for (let pass = 0; pass < 4; pass++) {
    cycle.setReducedMotion(false);
    assert.equal(h.frames.size, 1);
    cycle.setReducedMotion(true);
    assert.equal(h.frames.size + h.timers.size, 0);
    assert.equal(output.at(-1).glyphs, null);
  }
  cycle.setReducedMotion(false); h.advance(4000);
  assert.equal(output.at(-1).language, 'hi');
  cycle.setHidden(true); assert.equal(h.frames.size + h.timers.size, 0);
  h.advance(11000); cycle.setHidden(false);
  assert.deepEqual(output.at(-1), { language: 'en', glyphs: null });
  cycle.setReducedMotion(true); cycle.setReducedMotion(false);
  cycle.dispose();
  assert.equal(h.frames.size + h.timers.size, 0);
  const count = output.length;
  cycle.setReducedMotion(true); cycle.setHidden(false); h.advance(25000);
  assert.equal(output.length, count);
});

test('missing Segmenter uses the whole static name, never a code-unit fallback', () => {
  const fallback = evaluate('src/lib/name-reveal.ts', {}, { Intl: {} });
  const h = clockHarness(), output = [];
  assert.equal(fallback.nameGraphemes(names.hi), null);
  fallback.createNameReveal(names, value => output.push(value), h.clock);
  assert.deepEqual(output, [{ language: 'en', glyphs: null }]);
  assert.equal(h.frames.size + h.timers.size, 0);
});

test('SSR has one visible name, inert size reservations, and a stable screen-reader label', () => {
  const { AnimatedName } = evaluate('src/components/animated-name.tsx', {
    '@/config/site': { site: { name: names.en } }, '@/lib/name-reveal': lib,
  });
  const html = renderToStaticMarkup(React.createElement(AnimatedName));
  assert.equal((html.match(/class="name-display"/g) || []).length, 1);
  assert.match(html, /class="name-display" lang="en" aria-hidden="true">Harsh Kumar<\/span>/);
  assert.equal((html.match(/style="visibility:hidden"/g) || []).length, 2);
  assert.match(html, /class="sr-only">Harsh Kumar/);
  assert.doesNotMatch(html, /name-noise|name-final|name-english|name-hindi|aria-live/);
  const css = postcss.parse(read('src/app/globals.css'));
  const values = {};
  css.walkRules(rule => { if (!rule.parent.name) rule.walkDecls(decl => { (values[rule.selector] ??= {})[decl.prop] = decl.value; }); });
  assert.equal(values['.animated-name'].display, 'inline-grid');
  assert.equal(values['.name-display'].position, 'absolute');
  assert.equal(values['.name-size']['grid-area'], '1 / 1');
  assert.doesNotMatch(css.toString(), /name-noise|name-final|name-english|name-hindi/);
  assert.equal(values['.animated-name'].overflow, undefined); // no clipping to mask duplicates
});

test('DOM adapter replaces one text node, completes every character, and cleans up across repeated cycles', () => {
  const h = clockHarness(), mediaEvents = new Map(), documentEvents = new Map();
  const media = { matches: false, addEventListener: (key, fn) => mediaEvents.set(key, fn), removeEventListener: key => mediaEvents.delete(key) };
  const display = { lang: 'en', textContent: names.en };
  let effect;
  const document = {
    hidden: false,
    addEventListener: (key, fn) => documentEvents.set(key, fn), removeEventListener: key => documentEvents.delete(key),
  };
  const browserWindow = {
    requestAnimationFrame(callback) { assert.equal(this, browserWindow); return h.clock.requestFrame(callback); },
    cancelAnimationFrame(id) { assert.equal(this, browserWindow); h.clock.cancelFrame(id); },
    setTimeout(callback, delay) { assert.equal(this, browserWindow); return h.clock.setTimer(callback, delay); },
    clearTimeout(id) { assert.equal(this, browserWindow); h.clock.clearTimer(id); },
  };
  const { AnimatedName } = evaluate('src/components/animated-name.tsx', {
    react: { useRef: () => ({ current: display }), useEffect: callback => { effect = callback; } },
    '@/config/site': { site: { name: names.en } }, '@/lib/name-reveal': lib,
  }, { document, matchMedia: () => media, performance: { now: h.clock.now }, window: browserWindow });
  AnimatedName();
  for (let pass = 0; pass < 5; pass++) {
    const origin = h.clock.now();
    const cleanup = effect();
    for (const [offset, language] of [[0, 'en'], [4000, 'hi'], [9000, 'en']]) {
      h.advance(origin + offset);
      assert.equal(display.lang, language);
      assert.equal(lib.nameGraphemes(display.textContent).length, lib.nameGraphemes(names[language]).length);
      h.advance(origin + offset + 799); // final glyph can still be noise here
      h.advance(origin + offset + 800);
      assert.equal(display.textContent, names[language]); // exact final r and Hindi cluster
    }
    assert.equal(h.frames.size + h.timers.size, 0);
    cleanup();
    assert.equal(mediaEvents.size + documentEvents.size, 0);
  }
  const cleanup = effect();
  const staleFrame = [...h.frames.values()][0];
  media.matches = true; mediaEvents.get('change')();
  assert.equal(display.textContent, names.en);
  assert.equal(h.frames.size + h.timers.size, 0);
  cleanup(); staleFrame();
  assert.equal(display.textContent, names.en);
  assert.equal(h.frames.size + h.timers.size, 0);
});