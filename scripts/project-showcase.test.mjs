import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React from 'react';
import * as jsxRuntime from 'react/jsx-runtime';
import { renderToStaticMarkup } from 'react-dom/server';
import postcss from 'postcss';

const require = createRequire(import.meta.url);
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
function evaluate(path, modules = {}, env = {}) {
  const code = ts.transpileModule(read(path), { compilerOptions: {
    module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
  } }).outputText;
  const exports = {};
  new Function('exports', 'require', 'process', code)(exports, name => modules[name] ?? require(name), { env });
  return exports;
}
const data = evaluate('src/content/portfolio.ts').projects;

// Exercise actual component handlers/state with a small hook harness; this is
// not a browser test or verification of Framer Motion's rendered animation.
function harness(projects = data, reducedMotion = false) {
  let cells = [], slot = 0, buttons = [], images = [], animations = [];
  const motionDiv = ({ initial, animate, exit, transition, ...props }) => {
    animations.push({ initial, animate, exit, transition });
    return React.createElement('div', props);
  };
  const wrapJsx = render => (type, props, key) => {
    if (type === 'button') buttons.push(props);
    return render(type, props, key);
  };
  const imageMock = props => {
    images.push(props);
    const { fill, unoptimized, onError, ...attributes } = props;
    void fill; void unoptimized; void onError;
    return React.createElement('img', attributes);
  };
  const concepts = evaluate('src/components/project-concepts.tsx', {
    'next/image': imageMock, './project-concepts.css': {},
  });
  const { ProjectShowcase } = evaluate('src/components/project-showcase.tsx', {
    react: { ...React, useId: () => 'test-showcase', useState: initial => {
      const index = slot++;
      if (!(index in cells)) cells[index] = initial;
      return [cells[index], value => { cells[index] = typeof value === 'function' ? value(cells[index]) : value; }];
    } },
    'react/jsx-runtime': { ...jsxRuntime, jsx: wrapJsx(jsxRuntime.jsx), jsxs: wrapJsx(jsxRuntime.jsxs) },
    'framer-motion': { motion: { div: motionDiv }, AnimatePresence: ({ children }) => children, useReducedMotion: () => reducedMotion },
    'next/image': props => {
      images.push(props);
      const { fill, unoptimized, onError, ...attributes } = props;
      void fill; void unoptimized; void onError;
      return React.createElement('img', attributes);
    },
    './project-showcase.css': {},
    './project-concepts': concepts,
  });
  return {
    render(next = projects) {
      projects = next; slot = 0; buttons = []; images = []; animations = [];
      return renderToStaticMarkup(React.createElement(ProjectShowcase, { projects }));
    },
    click(label) {
      const button = buttons.find(item => item['aria-label'] === label || item.children === label);
      assert.ok(button, label);
      assert.ok(!button.disabled, `${label} must be enabled`);
      button.onClick();
    },
    images: () => images,
    animations: () => animations,
  };
}

test('empty and single-item arrays are safe; unavailable links do not become anchors', () => {
  assert.equal(harness([]).render(), '');
  const html = harness([data[0]]).render();
  assert.match(html, /Illustrative concept/);
  assert.equal((html.match(/disabled=""/g) || []).length, 2);
  assert.equal((html.match(/aria-disabled="true"/g) || []).length, 2);
  assert.doesNotMatch(html, /<a\b|<iframe|<img/);
});

test('previous/next wrap, direct choices expose all project content and retain a single set of actions', () => {
  const projects = data.map(project => ({ ...project, live: `https://example.test/${project.id}`, repository: `https://example.test/source/${project.id}` }));
  const h = harness(projects);
  const initial = h.render();
  assert.match(initial, /<h3>GeoVISTA<\/h3>/);
  const picker = initial.match(/class="showcase-picker"[\s\S]*?<\/div>/)[0];
  assert.deepEqual([...picker.matchAll(/<button[^>]*>([^<]+)<\/button>/g)].map(match => match[1]), ['GeoVISTA', 'KaushalIQ', 'Halo', 'AgroZyro']);
  for (const name of ['KaushalIQ', 'Halo', 'AgroZyro', 'GeoVISTA']) {
    h.click('Next project');
    assert.ok(h.render().includes(`<h3>${name}</h3>`));
  }
  h.click('Previous project');
  assert.match(h.render(), /<h3>AgroZyro<\/h3>/);
  h.click('Next project'); assert.match(h.render(), /<h3>GeoVISTA<\/h3>/);
  for (const project of projects) {
    h.click(project.name);
    const html = h.render();
    assert.ok(html.includes(`<h3>${project.name}</h3>`));
    assert.ok(html.includes(project.summary));
    assert.ok(html.includes(project.contribution));
    for (const technology of project.stack) assert.ok(html.includes(technology));
    assert.ok(html.includes(`href="${project.live}"`));
    assert.ok(html.includes(`href="${project.repository}"`));
    assert.equal((html.match(/target="_blank" rel="noopener noreferrer"/g) || []).length, 2);
    assert.equal((html.match(/<h3>/g) || []).length, 1);
    assert.equal((html.match(/aria-pressed="true"/g) || []).length, 1);
    assert.match(html, /aria-live="polite"/);
  }
  // A removed active item falls back to the first entry, never an undefined item.
  assert.match(h.render([projects[0]]), /<h3>GeoVISTA<\/h3>/);
  assert.equal(h.render([]), '');
});

test('genuine optional screenshots and supplied Spidey fail back to an honest cover', () => {
  const project = { ...data.find(project => project.id === 'halo'), image: { src: '/assets/real-capture.png', alt: 'Actual captured homepage', caption: 'Supplied homepage capture' }, artwork: { src: '/assets/spidey.svg', alt: 'Supplied Spidey' } };
  const h = harness([project]);
  assert.match(h.render(), /Supplied homepage capture/);
  assert.equal(h.images()[0].fill, true);
  h.images()[0].onError();
  assert.match(h.render(), /Illustrative concept/);
  assert.equal(h.images()[0].src, '/assets/spidey.svg');
  h.images()[0].onError();
  assert.doesNotMatch(h.render(), /<img/);
});

test('motion settings are deterministic and reduced motion disables transforms/transitions; no autoplay', () => {
  const h = harness(); h.render();
  const before = h.animations(); h.render();
  assert.deepEqual(h.animations(), before);
  const reduced = harness(data, true); reduced.render();
  assert.ok(reduced.animations().every(item => item.initial === false && item.transition.duration === 0));
  const source = read('src/components/project-showcase.tsx');
  assert.doesNotMatch(source, /setInterval|setTimeout|Math.random|ResizeObserver|HalomotButton|layout="fill"/);
  const css = postcss.parse(read('src/components/project-showcase.css'));
  assert.match(css.toString(), /grid-template-columns: minmax\(0, 1fr\)/);
  assert.match(css.toString(), /prefers-reduced-motion: reduce/);
  assert.match(css.toString(), /focus-visible/);
  assert.doesNotMatch(css.toString(), /#[0-9a-f]{3,8}\b|gradient|box-shadow/i);
});

test('project URLs stay environment-only and invalid destinations never reach showcase data', () => {
  for (const project of data) {
    const prefix = `NEXT_PUBLIC_${project.id.toUpperCase()}`;
    for (const value of ['', 'not-a-url', 'javascript:alert(1)', 'https://user:password@example.test/']) {
      const { site } = evaluate('src/config/site.ts', {}, { [`${prefix}_REPOSITORY_URL`]: value, [`${prefix}_LIVE_URL`]: value });
      assert.equal(site.projects[project.id].live, undefined);
      assert.equal(site.projects[project.id].repository, undefined);
    }
    const { site } = evaluate('src/config/site.ts', {}, { [`${prefix}_REPOSITORY_URL`]: 'https://example.test/source', [`${prefix}_LIVE_URL`]: 'https://example.test/home#start' });
    assert.equal(site.projects[project.id].live, 'https://example.test/home#start');
    assert.equal(site.projects[project.id].repository, 'https://example.test/source');
  }
});

test('obsolete iframe implementation and preview-only styles are removed', () => {
  for (const path of ['src/components/prototype-panel.tsx', 'src/components/prototype-panel.css', 'src/lib/preview-state.ts', 'src/lib/embed-policy.ts', 'src/app/api/project-preview/[id]/route.ts']) {
    assert.equal(existsSync(new URL(`../${path}`, import.meta.url)), false, path);
  }
  assert.doesNotMatch(read('src/app/globals.css'), /\.portal-|\.project-row|\.project-portal|\.project-destinations/);
  assert.doesNotMatch(read('src/components/portfolio.tsx'), /PrototypePanel|ProjectCard/);
  assert.match(read('src/components/portfolio.tsx'), /<ProjectShowcase projects=\{showcaseProjects\}/);
});


test('four distinct compositions disclose illustration and do not introduce fake controls', () => {
  const expected = {geovista:'terrain-study', kaushaliq:'demand-bars', halo:'assistant-workspace', agrozyro:'crop-grid'};
  for (const project of data) {
    const h = harness([project]);
    const html = h.render();
    assert.ok(html.includes(expected[project.id]));
    assert.match(html, /Illustrative concept/);
    const figure = html.match(/<figure class="project-concept[\s\S]*?<\/figure>/)[0];
    assert.match(figure, /role="img" aria-label=/);
    assert.doesNotMatch(figure, /<button|<input|<a\b|tabindex|<iframe/);
    if (project.id === 'halo') assert.ok(h.images().some(img => img.src.endsWith('spidey-prototype.png')));
    if (project.id === 'agrozyro') assert.equal(h.images().length, 3);
  }
});
