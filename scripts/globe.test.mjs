import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { advanceRotation, geographicPoint, INDIA, INITIAL_VIEW, projectPoint } from '../src/lib/globe.ts';

test('India is centred when the view is centred on its geographic coordinates', () => {
  const [x, y, depth] = projectPoint(geographicPoint(INDIA.latitude, INDIA.longitude), INDIA.longitude, INDIA.latitude);
  assert.ok(Math.abs(x) < 1e-12);
  assert.ok(Math.abs(y) < 1e-12);
  assert.ok(Math.abs(depth - 1) < 1e-12);
});
test('India is visible initially, hidden on the far side, and returns after a full turn', () => {
  const point = geographicPoint(INDIA.latitude, INDIA.longitude);
  const start = projectPoint(point, INITIAL_VIEW.longitude, INITIAL_VIEW.latitude);
  assert.ok(start[2] > 0);
  assert.ok(projectPoint(point, INITIAL_VIEW.longitude + 180, INITIAL_VIEW.latitude)[2] < 0);
  const end = projectPoint(point, INITIAL_VIEW.longitude + 360, INITIAL_VIEW.latitude);
  start.forEach((value, index) => assert.ok(Math.abs(value - end[index]) < 1e-12));
});
test('rotation resumes gently from the dragged angle and caps long suspended intervals', () => {
  const resumed = advanceRotation(147, 0, 33.34);
  assert.ok(resumed.longitude >= 147 && resumed.longitude < 147.01);
  assert.ok(resumed.speed > 0 && resumed.speed < 0.05);
  const suspended = advanceRotation(147, 1, 300000);
  assert.ok(suspended.longitude - 147 <= 0.151);
});
test('steady rotation is three degrees per second across frame rates and wraps smoothly', () => {
  for (const frames of [30, 60, 120]) {
    let state = { longitude: 358, speed: 1 };
    for (let i = 0; i < frames; i++) state = advanceRotation(state.longitude, state.speed, 1000 / frames);
    assert.ok(Math.abs(state.longitude - 1) < 1e-8);
  }
});
test('land dataset covers recognizable continents and uses valid geographic coordinates', () => {
  const points = JSON.parse(readFileSync(new URL('../public/maps/land-points.json', import.meta.url)));
  assert.ok(points.length > 2000 && points.length < 5000);
  assert.ok(points.every(([lat, lon]) => Math.abs(lat) <= 90 && Math.abs(lon) <= 180));
  for (const [lat, lon] of [[22, 79], [40, -100], [-10, -55], [5, 20], [50, 15], [-25, 135], [-80, 0]]) {
    assert.ok(points.some(([a, b]) => Math.abs(a - lat) < 3 && Math.abs(b - lon) < 6), `Land near ${lat}, ${lon}`);
  }
});
