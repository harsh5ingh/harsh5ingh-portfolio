// Read-only GET requests; never print private environment variables or credentials.
import env from '@next/env';
env.loadEnvConfig(process.cwd());
const { site } = await import('../src/config/site.ts');
const links = [
  ...site.profiles.map(profile => [profile.label, profile.url]),
  ...Object.entries(site.projects).flatMap(([name, project]) => [[`${name} live`, project.live], [`${name} source`, project.repository]]),
];
for (const [name, url] of links) {
  if (!url) { console.log(`${name}: not configured`); continue; }
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
    const csp = response.headers.get('content-security-policy') || '';
    const frame = csp.match(/frame-ancestors[^;]*/)?.[0];
    console.log(`${name}: HTTP ${response.status} ${response.url}; X-Frame-Options=${response.headers.get('x-frame-options') || 'absent'}; ${frame || 'no frame-ancestors header'}`);
    await response.body?.cancel();
  } catch (error) { console.log(`${name}: request failed (${error.cause?.code || error.name})`); }
}
