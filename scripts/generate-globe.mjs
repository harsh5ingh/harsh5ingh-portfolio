// Run: node scripts/generate-globe.mjs <Natural Earth ne_110m_land.geojson>
// Produces a small, local land-dot dataset and a matching no-JS/canvas fallback.
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { geographicPoint, projectPoint, INITIAL_VIEW } from '../src/lib/globe.ts';

const source = readFileSync(process.argv[2]);
const geo = JSON.parse(source);
const polygons = geo.features.flatMap(({ geometry }) =>
  geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates);
function insideRing(x, y, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
const points = [];
for (let lat = -85; lat <= 85; lat += 2) {
  const step = 2 / Math.cos(lat * Math.PI / 180);
  for (let lon = -179; lon < 180; lon += step) {
    if (polygons.some(([outer, ...holes]) => insideRing(lon, lat, outer) && !holes.some(hole => insideRing(lon, lat, hole)))) {
      points.push([lat, Number(lon.toFixed(2))]);
    }
  }
}
writeFileSync('public/maps/land-points.json', JSON.stringify(points) + '\n');
let dots = '';
for (const [lat, lon] of points) {
  const [x, y, depth] = projectPoint(geographicPoint(lat, lon), INITIAL_VIEW.longitude, INITIAL_VIEW.latitude);
  if (depth > 0) dots += `M${(200 + x * 177).toFixed(1)},${(200 - y * 177).toFixed(1)}h.1`;
}
writeFileSync('public/maps/earth-fallback.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><path d="${dots}" stroke="white" stroke-width="2.7" stroke-linecap="round"/></svg>\n`);
console.log(`${points.length} land points. Source SHA256: ${createHash('sha256').update(source).digest('hex')}`);
