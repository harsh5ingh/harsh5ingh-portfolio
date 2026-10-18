// Geographic coordinates in degrees; orthographic projection with a tilted camera.
export type Vector3 = readonly [number, number, number];
export const INDIA = { latitude: 22, longitude: 79 };
export const INITIAL_VIEW = { latitude: 18, longitude: 60 };
const radians = Math.PI / 180;

export function geographicPoint(latitude: number, longitude: number): Vector3 {
  const lat = latitude * radians;
  const lon = longitude * radians;
  return [Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon)];
}

export function projectPoint(point: Vector3, longitude: number, latitude: number): Vector3 {
  const yaw = longitude * radians;
  const pitch = latitude * radians;
  const x = point[0] * Math.cos(yaw) - point[2] * Math.sin(yaw);
  const z = point[0] * Math.sin(yaw) + point[2] * Math.cos(yaw);
  return [x, point[1] * Math.cos(pitch) - z * Math.sin(pitch), point[1] * Math.sin(pitch) + z * Math.cos(pitch)];
}

export function normalizeLongitude(longitude: number) {
  return ((longitude % 360) + 360) % 360;
}

export function advanceRotation(longitude: number, speed: number, elapsed: number) {
  // Cap elapsed time after a suspended tab; ease back to three degrees per second.
  const dt = Math.max(0, Math.min(elapsed, 50));
  const nextSpeed = 1 - (1 - speed) * Math.exp(-dt / 700);
  return { longitude: normalizeLongitude(longitude + dt * 0.003 * nextSpeed), speed: nextSpeed };
}
