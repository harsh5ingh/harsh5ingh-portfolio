import assert from 'node:assert/strict';
const base = process.argv[2] || 'http://localhost:3000';
const home = await fetch(base);
assert.equal(home.status, 200);
const html = await home.text();
assert.match(html, /<title>Harsh Kumar/);
assert.match(html, /name="description" content="Harsh Kumar/);
assert.match(html, /rel="icon"[^>]*href="\/icon.svg/);
assert.doesNotMatch(html, /portrait-badge|little-flame/);
for (const [, hash] of html.matchAll(/href="#([^"]+)"/g)) {
  assert.ok(html.includes(`id="${hash}"`), `Anchor #${hash}`);
}
const missing = await fetch(`${base}/audit-missing-page`);
assert.equal(missing.status, 404);
const missingHtml = await missing.text();
assert.match(missingHtml, /Page not found — Harsh Kumar/);
assert.match(missingHtml, /This page took a wrong turn/);
assert.match(missingHtml, /name="robots" content="noindex/);
assert.match(missingHtml, /href="\/"/);
for (const path of ['/icon.svg','/favicon.ico','/assets/harsh-kumar-resume.pdf','/robots.txt','/sitemap.xml','/opengraph-image']) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200, path);
  if (path.endsWith('.pdf')) assert.equal((await response.text()).slice(0,5),'%PDF-');
  else await response.body?.cancel();
}
const original = await fetch(`${base}/assets/photo.jpeg`);
const optimized = await fetch(`${base}/_next/image?url=%2Fassets%2Fphoto.jpeg&w=640&q=75`, {headers:{Accept:'image/webp'}});
assert.equal(optimized.status, 200);
const originalBytes = (await original.arrayBuffer()).byteLength;
const optimizedBytes = (await optimized.arrayBuffer()).byteLength;
assert.ok(optimizedBytes < originalBytes);
console.log(`PASS: anchors, metadata, branded 404/HTTP status, favicon, resume/PDF, discovery routes, optimized portrait (${originalBytes} → ${optimizedBytes} bytes).`);
