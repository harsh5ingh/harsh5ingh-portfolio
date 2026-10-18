import { readFile, writeFile } from "node:fs/promises";
const base =
  "https://raw.githubusercontent.com/simple-icons/simple-icons/15.0.0";
const metadata = await fetch(`${base}/data/simple-icons.json`);
if (!metadata.ok) throw new Error(`Metadata ${metadata.status}`);
const data = await metadata.json();
const icons = data.icons ?? data;
const catalog = JSON.parse(
  await readFile("src/content/brand-icons.json", "utf8"),
);
for (const [name, slug] of Object.entries({
  Ollama: "ollama",
  LangGraph: "langgraph",
  Qdrant: "qdrant",
  n8n: "n8n",
})) {
  const response = await fetch(`${base}/icons/${slug}.svg`);
  if (!response.ok) {
    console.log(
      `${name}: unavailable (${response.status}), retained labelled fallback`,
    );
    continue;
  }
  const svg = await response.text();
  if (!svg.startsWith("<svg") || !svg.includes('viewBox="0 0 24 24"'))
    throw new Error("Invalid icon");
  const title = svg.match(/<title>(.*?)<\/title>/)?.[1];
  const icon = icons.find((item) => item.title === title);
  if (!icon) throw new Error(`Metadata missing: ${name}`);
  await writeFile(`public/icons/${slug}.svg`, svg);
  catalog[name] = { slug, color: `#${icon.hex}`, source: icon.source };
  console.log(`${name}: imported`);
}
await writeFile(
  "src/content/brand-icons.json",
  JSON.stringify(catalog, null, 2) + "\n",
);
