import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import postcss from 'postcss';

const require = createRequire(import.meta.url);
const source = readFileSync(new URL('../src/components/floating-technologies.tsx', import.meta.url), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: {
  module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX,
} }).outputText;
function load(react, globals = {}) {
  const context = { exports: {}, ...globals, require: name => {
    if (name === 'react') return react;
    if (name === './brand-icon') return { BrandIcon: () => null, brandStyle: () => ({}) };
    if (name === './hero-marquee.css') return {};
    return require(name);
  } };
  vm.runInNewContext(code, context);
  return context.exports.FloatingTechnologies;
}
test('one accessible technology list; duplicate adds no focus targets or persistent selection', () => {
  const Component = load(React);
  const html = renderToStaticMarkup(React.createElement(Component));
  assert.equal((html.match(/<ul/g) || []).length, 2);
  assert.equal((html.match(/aria-label="Technologies behind the work"/g) || []).length, 1);
  assert.match(html, /<ul class="hero-tech-group" aria-hidden="true"/);
  assert.equal((html.match(/role="img"/g) || []).length, 24);
  assert.doesNotMatch(html, /<button|<a\b|aria-pressed/);
  assert.equal((html.match(/tabindex="0"/g) || []).length, 1);
  assert.match(html, /role="region" aria-label="Technology logos"/);
  assert.doesNotMatch(source, /useState|setSelected|Pause hero motion|translate\(/);
});
test('single loop slows and restores without resetting position; reduced motion, mobile and cleanup work', () => {
  const events = new Map();
  const media = [];
  let effect, cleanup, observe, tick, clock = 0, keyframes, timing;
  const animation = { currentTime: 1234, playbackRate: 1, playState: 'running',
    pause() { this.playState = 'paused'; }, play() { this.playState = 'running'; },
    cancel() { this.playState = 'idle'; }, updatePlaybackRate(rate) { this.playbackRate = rate; },
  };
  const area = { dataset: {}, querySelector: () => ({ animate: (frames, options) => {
    keyframes = frames; timing = options; return animation;
  } }), addEventListener: (name, fn) => events.set(name, fn), removeEventListener: name => events.delete(name) };
  const document = { hidden: false, addEventListener() {}, removeEventListener() {} };
  const Component = load({ useRef: () => ({ current: area }), useEffect: fn => { effect = fn; } }, {
    document, Element: { prototype: { animate() {} } },
    matchMedia: () => { const m = { matches: false, addEventListener: (_, fn) => { m.change = fn; }, removeEventListener() {} }; media.push(m); return m; },
    performance: { now: () => clock }, requestAnimationFrame: fn => { tick = fn; return 1; }, cancelAnimationFrame() {},
    IntersectionObserver: class { constructor(fn) { observe = fn; } observe() {} disconnect() {} },
  });
  Component(); cleanup = effect(); observe([{ isIntersecting: true }]);
  assert.equal(keyframes[1].transform, 'translateX(-50%)');
  assert.equal(timing.duration, 30000);
  assert.equal(timing.iterations, Infinity);
  events.get('pointerenter')({ pointerType: 'mouse' });
  tick(300); assert.ok(animation.playbackRate > 0.15 && animation.playbackRate < 1);
  tick(600); assert.ok(Math.abs(animation.playbackRate - 0.15) < 1e-8);
  assert.equal(animation.currentTime, 1234);
  clock = 600; events.get('pointerleave')(); tick(1200);
  assert.equal(animation.playbackRate, 1); assert.equal(animation.currentTime, 1234);
  events.get('pointerenter')({ pointerType: 'touch' }); assert.equal(animation.playbackRate, 1);
  media[0].matches = true; media[0].change();
  assert.equal(animation.playState, 'paused'); assert.equal(animation.currentTime, 0);
  assert.equal(area.dataset.moving, 'false');
  media[0].matches = false; media[0].change(); assert.equal(animation.playState, 'running');
  media[1].matches = true; media[1].change(); assert.equal(area.dataset.moving, 'false');
  cleanup(); assert.equal(animation.playState, 'idle'); assert.equal(events.size, 0);
});

test('layout is a bounded horizontal strip before hydration, on mobile and without motion', () => {
  const css = postcss.parse(readFileSync(new URL('../src/components/hero-marquee.css', import.meta.url), 'utf8'));
  const declarations = selector => {
    const values = {};
    css.walkRules(selector, rule => rule.walkDecls(d => { values[d.prop] = d.value; }));
    return values;
  };
  assert.equal(declarations('.hero-tech-viewport').height, '88px');
  assert.equal(declarations('.hero-tech-viewport')['overflow-x'], 'auto');
  assert.equal(declarations('.hero-tech-track').display, 'flex');
  assert.equal(declarations('.hero-tech-track')['flex-flow'], 'row nowrap');
  assert.equal(declarations('.hero-tech-group')['flex-flow'], 'row nowrap');
  assert.equal(declarations('.hero-tech-item').flex, '0 0 64px');
  assert.equal(declarations('.hero-tech-group[aria-hidden="true"]').display, 'none');
  assert.equal(declarations('.hero-tech-viewport[data-moving="true"]')['overflow-x'], 'hidden');
});
