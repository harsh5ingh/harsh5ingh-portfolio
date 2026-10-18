import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import postcss from 'postcss';
const root = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const catalog = JSON.parse(await read('src/content/brand-icons.json'));
const assets = ['/maps/land-points.json', '/maps/earth-fallback.svg', '/assets/photo.jpeg', '/assets/harsh-kumar-resume.pdf'];
assets.push(...['spidey-prototype.png', 'wheat.jpg', 'rice.jpg', 'mustard.jpg'].map(file => `/assets/project-previews/${file}`));
for (const { slug } of Object.values(catalog)) {
  const path = `public/icons/${slug}.svg`;
  const svg = await read(path);
  assert.match(svg, /viewBox="0 0 24 24"/);
  assert.match(svg, /<path /);
  assert.doesNotMatch(svg, /<script|onload=|<foreignObject/i);
  assets.push(`/icons/${slug}.svg`);
}
const layout = await read('src/app/layout.tsx');
assert.match(layout, /DM_Sans, Manrope/);
assert.doesNotMatch(layout, /Sora|Inter|Geist|Cormorant/);
const css = await read('src/app/globals.css');
const ast = postcss.parse(css);
assert.ok(ast.nodes.length > 0);
assert.doesNotMatch(css, /\.development-placeholder|\.prototype-panel|\.social-links/);
const sources = (await readdir(new URL('src/components/', root))).filter(name => name.endsWith('.tsx'));
const allSource = (await Promise.all(sources.map(name => read(`src/components/${name}`)))).join('\n');
assert.doesNotMatch(allSource, /next\.svg|vercel\.svg|architecture\.jpg|desk\.jpg|studio\.jpg/);
const name = await read('src/components/animated-name.tsx');
assert.match(name, /हर्ष कुमार/);
assert.match(name, /createNameReveal/);
const showcase = await read('src/components/project-showcase.tsx');
assert.match(showcase, /onError/);
assert.match(showcase, /<ProjectConcept/);
assert.match(await read('src/components/project-concepts.tsx'), /Illustrative concept/);
assert.doesNotMatch(showcase, /<iframe|contentDocument|contentWindow|Math.random|ResizeObserver|walkthrough-controls/);
console.log(`PASS: ${Object.keys(catalog).length} SVGs, fonts, stylesheet parsing, retired references, and static motion/portal safeguards.`);

if (process.argv[2]) {
  const { default: env } = await import('@next/env');
  env.loadEnvConfig(process.cwd());
  const { site } = await import('../src/config/site.ts');
  const base = process.argv[2];
  const response = await fetch(base);
  assert.equal(response.status, 200);
  const html = await response.text();
  const nav = html.match(/<nav class="desktop-nav"[\s\S]*?<\/nav>/)?.[0];
  assert.ok(nav);
  for (const id of ['work', 'about', 'experience', 'contact']) {
    assert.ok(nav.includes(`href="#${id}"`));
    assert.equal((html.match(new RegExp(`id="${id}"`, 'g')) || []).length, 1);
  }
  assert.equal((html.match(/<h1 /g) || []).length, 1);
  assert.match(html, /Harsh Kumar/);
  assert.match(html, /हर्ष कुमार/);
  assert.ok(html.includes(`mailto:${site.email}`));
  assert.match(html, /localStorage/);
  assert.match(html, /class="name-display" lang="en"/);
  assert.doesNotMatch(html, /A perspective on the work|Pause hero motion|earth-instructions|earth-controls|theme-horizon/);
  assert.match(html, /© 2026 Harsh Kumar\. All rights reserved\./);
  assert.equal((html.match(/class="project-showcase"/g) || []).length, 1);
  assert.equal((html.match(/aria-pressed="(?:true|false)" aria-controls=/g) || []).length, 4);
  assert.doesNotMatch(html, /<iframe|walkthrough-controls/);
  // Only the active project has action links; inactive projects have no hidden focus targets.
  assert.match(html, /<h3>GeoVISTA<\/h3>/);
  for (const [id, project] of [['geovista', site.projects.geovista]]) {
    for (const [label, url] of [['Source code', project.repository], ['Live site', project.live]]) {
      if (url) assert.ok(html.includes(`href="${url}"`), `${id} ${label}`);
    }
  }
  const socials = html.match(/<nav class="social-orbit"[\s\S]*?<\/nav>/)?.[0];
  assert.ok(socials);
  for (const profile of site.profiles) {
    assert.ok(profile.url && socials.includes(`href="${profile.url}"`), profile.label);
  }
  for (const path of assets) {
    const result = await fetch(base + path);
    assert.equal(result.status, 200, path);
  }
  console.log(`PASS: rendered anchors, single H1, English-first server fallback, configured email, theme bootstrap, and ${assets.length} local assets over HTTP.`);
}
