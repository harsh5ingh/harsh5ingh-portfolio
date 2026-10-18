import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

// CSS is the sole authored palette. Run with --write-assets after editing it;
// without that flag, this checks contrast and rejects stale generated assets.
const root = new URL("../", import.meta.url);
const css = await readFile(new URL("src/app/globals.css", root), "utf8");
function tokens(selector) {
  const block = css.slice(css.indexOf(`${selector} {`)).split("}")[0];
  return Object.fromEntries(
    [...block.matchAll(/--([\w-]+):\s*(#[\da-f]{6,8});/gi)].map(
      ([, name, value]) => [name, value],
    ),
  );
}
const themes = { light: tokens(":root"), dark: tokens(".dark") };
function luminance(hex) {
  const [r, g, b] = hex
    .slice(1)
    .match(/../g)
    .slice(0, 3)
    .map((value) => {
      const channel = parseInt(value, 16) / 255;
      return channel <= 0.04045
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4;
    });
  return r * 0.2126 + g * 0.7152 + b * 0.0722;
}
function contrast(a, b) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}
let checks = 0;
for (const [theme, palette] of Object.entries(themes)) {
  const surfaces = ["background", "surface", "surface-raised", "accent-soft"];
  let minText = Infinity;
  let minUI = Infinity;
  for (const background of surfaces) {
    for (const foreground of [
      "foreground",
      "muted-foreground",
      "accent-text",
    ]) {
      const ratio = contrast(palette[foreground], palette[background]);
      assert.ok(
        ratio >= 4.5,
        `${theme}: ${foreground}/${background} = ${ratio}, requires 4.5`,
      );
      minText = Math.min(minText, ratio);
      checks++;
    }
    for (const foreground of [
      "control-border",
      "focus-ring",
      "accent-action",
      "chart-secondary",
    ]) {
      const ratio = contrast(palette[foreground], palette[background]);
      assert.ok(
        ratio >= 3,
        `${theme}: ${foreground}/${background} = ${ratio}, requires 3`,
      );
      minUI = Math.min(minUI, ratio);
      checks++;
    }
  }
  for (const background of ["accent-action", "accent-hover"]) {
    const ratio = contrast(palette["accent-foreground"], palette[background]);
    assert.ok(ratio >= 4.5, `${theme}: action label/${background} = ${ratio}`);
    checks++;
  }
  for (const background of ["background", "surface"]) {
    const ratio = contrast(palette.accent, palette[background]);
    assert.ok(
      ratio >= 3,
      `${theme}: large brand text/${background} = ${ratio}`,
    );
    checks++;
    console.log(`${theme} exact Ember on ${background}: ${ratio.toFixed(2)}:1`);
  }
  for (const [foreground, background, minimum] of [
    ["cinematic-foreground", "cinematic-background", 4.5],
    ["cinematic-accent", "cinematic-background", 4.5],
    ["editorial-foreground", "editorial-background", 4.5],
    ["editorial-muted", "editorial-background", 4.5],
    ["cinematic-accent", "editorial-background", 4.5],
    ["editorial-border", "editorial-background", 3],
  ]) {
    const ratio = contrast(palette[foreground], palette[background]);
    assert.ok(
      ratio >= minimum,
      `${theme}: ${foreground}/${background} = ${ratio}`,
    );
    checks++;
  }
  // Worst case for the photo overlay: a pure-white source pixel.
  const scrim = palette["photo-scrim"];
  const alpha = parseInt(scrim.slice(7), 16) / 255;
  const overWhite =
    "#" +
    scrim
      .slice(1, 7)
      .match(/../g)
      .map((channel) =>
        Math.round(parseInt(channel, 16) * alpha + 255 * (1 - alpha))
          .toString(16)
          .padStart(2, "0"),
      )
      .join("");
  assert.ok(
    contrast(palette["cinematic-foreground"], overWhite) >= 4.5,
    `${theme}: photo overlay contrast`,
  );
  checks++;
  console.log(
    `${theme}: minimum text ${minText.toFixed(2)}:1; minimum control/focus/chart ${minUI.toFixed(2)}:1`,
  );
}
assert.equal(
  Object.keys(themes.light).sort().join(),
  Object.keys(themes.dark).sort().join(),
  "Themes must share token names",
);
assert.ok(
  !/#[\da-f]{3,8}\b/i.test(css.slice(css.indexOf("@theme inline"))),
  "Raw colors must stay in the theme blocks",
);
assert.ok(
  !/var\(--(?:paper|ink|olive|olive-soft|card|line|muted|deep|contrast|chart-light)\)/.test(
    css,
  ),
  "Legacy color token remains",
);
assert.ok(
  !/gradient\(/.test(css),
  "Gradients are not part of this design system",
);

// Raster social previews and standalone favicons cannot inherit page CSS.
// Export just the tokens they use, and verify these snapshots on every check.
const brand = {
  light: {
    background: themes.light.background,
    foreground: themes.light.foreground,
    accentText: themes.light["accent-text"],
  },
  dark: {
    background: themes.dark.background,
    foreground: themes.dark.foreground,
    accent: themes.dark.accent,
  },
};
const brandJson = `${JSON.stringify(brand, null, 2)}\n`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><!-- Generated from globals.css by scripts/design-system.mjs --><rect width="64" height="64" rx="16" fill="${brand.dark.background}"/><path d="M18 15v34m28-34v34M18 32h28" fill="none" stroke="${brand.dark.foreground}" stroke-width="5"/><circle cx="47" cy="48" r="4" fill="${brand.dark.accent}"/></svg>\n`;
const png = await sharp(Buffer.from(svg)).resize(48, 48).png().toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header[6] = 48;
header[7] = 48;
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(png.length, 14);
header.writeUInt32LE(22, 18);
const ico = Buffer.concat([header, png]);
for (const [path, expected] of [
  ["src/config/brand-palette.json", brandJson],
  ["src/app/icon.svg", svg],
  ["src/app/favicon.ico", ico],
]) {
  const url = new URL(path, root);
  if (process.argv.includes("--write-assets")) await writeFile(url, expected);
  else
    assert.deepEqual(
      await readFile(url),
      Buffer.from(expected),
      `${fileURLToPath(url)} is stale; run node scripts/design-system.mjs --write-assets`,
    );
}
console.log(
  `PASS: ${checks} contrast pairs; semantic tokens; synchronized branding assets.`,
);
