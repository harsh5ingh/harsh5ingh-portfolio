// Vendor only the icons used by this portfolio; no runtime icon dependency/CDN.
import { mkdir, writeFile } from "node:fs/promises";
const version = "11.15.0";
const base = `https://raw.githubusercontent.com/simple-icons/simple-icons/${version}`;
const response = await fetch(`${base}/_data/simple-icons.json`);
if (!response.ok) throw new Error(`Icon metadata: ${response.status}`);
const { icons } = await response.json();
const wanted = {
  Python: "python",
  "C++": "cplusplus",
  JavaScript: "javascript",
  TypeScript: "typescript",
  HTML: "html5",
  CSS: "css3",
  React: "react",
  "Next.js": "nextdotjs",
  Vite: "vite",
  "Tailwind CSS": "tailwindcss",
  FastAPI: "fastapi",
  "Node.js": "nodedotjs",
  PostgreSQL: "postgresql",
  MySQL: "mysql",
  Redis: "redis",
  Qdrant: "qdrant",
  Prisma: "prisma",
  Docker: "docker",
  Git: "git",
  GitHub: "github",
  Rust: "rust",
  Tauri: "tauri",
  CesiumJS: "cesium",
  Azure: "microsoftazure",
  n8n: "n8n",
  Zapier: "zapier",
  Postman: "postman",
  "VS Code": "visualstudiocode",
  LinkedIn: "linkedin",
  LeetCode: "leetcode",
  Codeforces: "codeforces",
  JSON: "json",
};
await mkdir("public/icons", { recursive: true });
const catalog = {};
// Sequential download keeps the source host load small and failures explicit.
for (const [label, slug] of Object.entries(wanted)) {
  const res = await fetch(`${base}/icons/${slug}.svg`);
  if (!res.ok) {
    console.log(`Unavailable: ${label} (${res.status}); use text fallback`);
    continue;
  }
  const svg = await res.text();
  if (!svg.startsWith("<svg") || !svg.includes('viewBox="0 0 24 24"'))
    throw new Error(`Invalid SVG: ${label}`);
  const title = svg.match(/<title>(.*?)<\/title>/)?.[1];
  const entry = icons.find((icon) => icon.title === title);
  if (!entry) throw new Error(`Missing brand metadata: ${label} / ${title}`);
  await writeFile(`public/icons/${slug}.svg`, svg);
  catalog[label] = { slug, color: `#${entry.hex}`, source: entry.source };
}
await writeFile(
  "src/content/brand-icons.json",
  JSON.stringify(catalog, null, 2) + "\n",
);
await writeFile(
  "public/icons/LICENSE.md",
  await (await fetch(`${base}/LICENSE.md`)).text(),
);
console.log(
  `Vendored ${Object.keys(catalog).length} icons from Simple Icons ${version}`,
);
