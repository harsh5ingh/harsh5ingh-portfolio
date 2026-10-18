import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
import postcss from 'postcss';
const require = createRequire(import.meta.url);
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
function evaluate(path, modules = {}, globals = {}) {
  const exports = {};
  const code = ts.transpileModule(read(path), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  new Function('exports', 'require', ...Object.keys(globals), code)(exports, name => modules[name] ?? require(name), ...Object.values(globals));
  return exports;
}
function find(node, predicate) {
  if (!node || typeof node !== 'object') return;
  if (predicate(node)) return node;
  for (const child of [node.props?.children].flat(Infinity)) {
    const found = find(child, predicate);
    if (found) return found;
  }
}
for (const fails of [false, true]) test(`copy-email ${fails ? 'failure' : 'success'} reports only the actual outcome and can be retried`, async () => {
  const states = [], copied = [];
  const { Portfolio } = evaluate('src/components/portfolio.tsx', {
    react: { useState: initial => [initial, value => states.push(value)], useRef: () => ({ current: null }), useEffect: () => {} },
    './project-showcase': {}, './profile-hero': {}, './contact-earth': {}, './technical-stack': {},
    '@/config/site': { site: { name: 'Harsh Kumar', email: 'verified@example.test', projects: {} } },
    '@/content/portfolio': { projects: [], education: [], experience: [] },
  }, { navigator: { clipboard: { writeText: async value => { if (fails) throw new Error('Permission denied'); copied.push(value); } } } });
  const tree = Portfolio({spideyAvailable:false, portraitAvailable:true, resumeAvailable:true});
  const button = find(tree, node => node.props?.['aria-label'] === 'Copy email address');
  assert.ok(button);
  await button.props.onClick(); await button.props.onClick();
  assert.deepEqual(states, fails ? ['copying','error','copying','error'] : ['copying','copied','copying','copied']);
  assert.deepEqual(copied, fails ? [] : ['verified@example.test','verified@example.test']);
  const status = find(tree, node => node.props?.role === 'status');
  assert.ok(status);
});

test('responsive sizing fixes the actual aspect-ratio constraint without hiding page overflow', () => {
  const rules = {};
  postcss.parse(read('src/components/project-showcase.css')).walkRules(rule => {
    if (rule.selector === '.showcase-stage' && rule.parent.type === 'root') rule.walkDecls(d => {rules[d.prop] = d.value;});
  });
  assert.equal(rules['min-height'], '0');
  assert.equal(rules.width, 'calc(100% - 16px)');
  assert.doesNotMatch(read('src/app/globals.css'), /portrait-badge/);
  assert.doesNotMatch(read('src/components/profile-hero.tsx'), /portrait-badge/);
  const css = postcss.parse(read('src/app/globals.css'));
  let portrait;
  css.walkRules('.portrait-frame', rule => { if (rule.parent.type === 'root') portrait = Object.fromEntries(rule.nodes.map(d => [d.prop,d.value])); });
  assert.equal(portrait['aspect-ratio'], '1');
  assert.equal(portrait['border-radius'], '50%');
  assert.equal(portrait['max-width'], '340px');
});
