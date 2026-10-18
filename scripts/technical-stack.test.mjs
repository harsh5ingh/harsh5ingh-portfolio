import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React from 'react';
import * as jsx from 'react/jsx-runtime';
import { renderToStaticMarkup } from 'react-dom/server';

const require = createRequire(import.meta.url);
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
function evaluate(path, modules = {}) {
  const exports = {};
  const code = ts.transpileModule(read(path), { compilerOptions: {
    module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
  } }).outputText;
  new Function('exports', 'require', code)(exports, name => modules[name] ?? require(name));
  return exports;
}

test('all skill items including disclosures receive brand masks and pointer/focus support', () => {
  const content = evaluate('src/content/portfolio.ts');
  const brands = evaluate('src/components/brand-icon.tsx', {
    '@/content/brand-icons.json': JSON.parse(read('src/content/brand-icons.json')),
  });
  const items = [];
  const capture = render => (type, props, key) => {
    if (type === 'li') items.push(props);
    return render(type, props, key);
  };
  const { TechnicalStack } = evaluate('src/components/technical-stack.tsx', {
    '@/content/portfolio': content, './brand-icon': brands,
    'react/jsx-runtime': { ...jsx, jsx: capture(jsx.jsx), jsxs: capture(jsx.jsxs) },
  });
  const html = renderToStaticMarkup(React.createElement(TechnicalStack));
  assert.equal(items.length, content.skillGroups.reduce((sum, group) => sum + group.items.length, 0));
  assert.match(html, /<details class="skill-more">[\s\S]*?<ul class="technology-list">/);
  for (const name of ['Python', 'React', 'PostgreSQL', 'GitHub']) {
    const item = items.find(item => item.children[1].props.children === name);
    assert.ok(item?.style['--brand-color'], name);
  }
  for (const item of items) {
    assert.equal(item.tabIndex, 0);
    const currentTarget = { dataset: {} };
    item.onPointerEnter({ currentTarget, pointerType: 'touch', buttons: 1 });
    assert.equal(currentTarget.dataset.hovered, undefined);
    item.onPointerEnter({ currentTarget, pointerType: 'mouse', buttons: 0 });
    assert.equal(currentTarget.dataset.hovered, 'true');
    item.onPointerLeave({ currentTarget });
    assert.equal(currentTarget.dataset.hovered, undefined);
    item.onPointerEnter({ currentTarget, pointerType: 'pen', buttons: 0 });
    assert.equal(currentTarget.dataset.hovered, 'true');
    item.onPointerDown({ currentTarget, pointerType: 'touch' });
    assert.equal(currentTarget.dataset.hovered, undefined);
    item.onPointerEnter({ currentTarget, pointerType: 'mouse', buttons: 0 });
    item.onPointerCancel({ currentTarget });
    assert.equal(currentTarget.dataset.hovered, undefined);
  }
});
