import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
import postcss from "postcss";
const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
function evaluate(path, env = {}) {
  const code = ts.transpileModule(read(path), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  const exports = {};
  new Function("exports", "process", code)(exports, { env });
  return exports;
}
const { projects, skillGroups, education, experience } = evaluate(
  "src/content/portfolio.ts",
);
test("four fixed projects retain details, education and experience; KaushalIQ is Prototype", () => {
  assert.deepEqual(
    projects.map((p) => p.id),
    ["geovista", "kaushaliq", "halo", "agrozyro"],
  );
  assert.equal(projects.find((p) => p.id === "kaushaliq").status, "Prototype");
  assert.ok(projects.every((p) => p.contribution && p.details.length === 3));
  assert.equal(skillGroups.length, 6);
  assert.equal(education.length, 3);
  assert.equal(experience.length, 3);
  assert.ok(education.some((e) => e.institution === "Gyan Niketan, Patna"));
});
test("every project URL is optional and environment-only; invalid protocols are rejected", () => {
  const empty = evaluate("src/config/site.ts").site;
  for (const p of Object.values(empty.projects)) {
    assert.equal(p.repository, undefined);
    assert.equal(p.live, undefined);
  }
  for (const project of projects) {
    const key = project.id.toUpperCase();
    const configured = evaluate("src/config/site.ts", {
      [`NEXT_PUBLIC_${key}_REPOSITORY_URL`]: "https://example.test/source",
      [`NEXT_PUBLIC_${key}_LIVE_URL`]: "https://example.test/home",
    }).site.projects[project.id];
    assert.equal(configured.repository, "https://example.test/source");
    assert.equal(configured.live, "https://example.test/home");
    const invalid = evaluate("src/config/site.ts", {
      [`NEXT_PUBLIC_${key}_LIVE_URL`]: "javascript:alert(1)",
    }).site.projects[project.id];
    assert.equal(invalid.live, undefined);
  }
});
test("dark globe colors remain identical in both themes; sticky header has offset", () => {
  const css = postcss.parse(read("src/app/globals.css"));
  const palettes = {};
  css.walkRules((rule) => {
    if ([":root", ".dark"].includes(rule.selector)) {
      palettes[rule.selector] = {};
      rule.walkDecls(
        /^--globe-/,
        (d) => (palettes[rule.selector][d.prop] = d.value),
      );
    }
  });
  assert.deepEqual(palettes[":root"], palettes[".dark"]);
  assert.equal(palettes[":root"]["--globe-background"], "#121211");
  assert.match(css.toString(), /position: sticky/);
  assert.match(css.toString(), /scroll-padding-top: 96px/);
  assert.match(css.toString(), /scrollbar-color:/);
});
test("removed controls and selector logic are absent; showcase has no embedded applications", () => {
  const portfolio = read("src/components/portfolio.tsx");
  assert.doesNotMatch(portfolio, /perspective|theme-horizon/);
  assert.match(portfolio, /© 2026 Harsh Kumar. All rights reserved./);
  assert.doesNotMatch(
    read("src/components/profile-hero.tsx"),
    /motionPaused|Pause hero motion/,
  );
  assert.doesNotMatch(
    read("src/components/contact-earth.tsx"),
    /earth-instructions|earth-controls|RotateCcw|function reset/,
  );
  const showcase = read("src/components/project-showcase.tsx");
  assert.doesNotMatch(showcase, /<iframe|walkthrough-controls|contentWindow|contentDocument/);
  assert.match(showcase, /Source code/);
  assert.match(showcase, /Live site/);
  assert.match(portfolio, /spideyAvailable/);
});
