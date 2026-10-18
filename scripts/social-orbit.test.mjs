import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
const require = createRequire(import.meta.url);
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
function evaluate(path, modules = {}, globals = {}) {
  const exports = {};
  const code = ts.transpileModule(read(path), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  new Function('exports', 'require', ...Object.keys(globals), code)(exports, name => modules[name] ?? require(name), ...Object.values(globals));
  return exports;
}
test('shared contact links include LinkedIn once with authentic asset and safe external behavior', () => {
  const { site } = evaluate('src/config/site.ts', {}, { process: { env: {} } });
  const { BrandIcon, brandStyle } = evaluate('src/components/brand-icon.tsx', {
    '@/content/brand-icons.json': { default: JSON.parse(read('src/content/brand-icons.json')) },
  });
  const { SocialOrbit } = evaluate('src/components/social-orbit.tsx', {
    '@/config/site': { site }, './brand-icon': { BrandIcon, brandStyle },
  });
  const html = renderToStaticMarkup(React.createElement(SocialOrbit));
  assert.equal(site.profiles.length, 4);
  assert.equal((html.match(/href="https:\/\/linkedin.com\/in\/harsh5ingh"/g) || []).length, 1);
  assert.match(html, /aria-label="LinkedIn profile — opens in a new tab"/);
  assert.match(html, /url\(\/icons\/linkedin.svg\)/);
  assert.equal((html.match(/target="_blank" rel="noopener noreferrer"/g) || []).length, 4);
  assert.match(read('public/icons/linkedin.svg'), /<path /);
});
