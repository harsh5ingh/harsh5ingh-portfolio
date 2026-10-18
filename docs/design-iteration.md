# Portfolio iteration — 17 October 2026

Reference research: Brittany Chiang (brittanychiang.com), Lee Robinson (leerob.com),
and Ramkrishna Swarnkar (ramx.in). Their accessible content hierarchy, concise
project descriptions, and compact navigation informed this iteration. Page content
was available through web tools; live visual/animation inspection was unavailable
because local browser use is disabled. No complete design was copied.

## Decisions

- Keep Manrope + DM Sans as explicitly requested in the preceding brief. Hindi uses
  installed Devanagari system fonts; no extra font download. Verify its rendering
  on target mobile platforms before release.
- Reserve a shared grid cell for both name variants. English is server-rendered;
  motion starts after hydration and can be paused. Reduced motion stays English.
- Portrait width is capped at 448px instead of constraining its height, preserving
  the 4:5 ratio. Original photo, crop content, and facial features are unmodified.
- Floating brand links occupy their own space below the hero actions and navigate
  to the skills section. Hover/focus slows their Web Animations playback rate.
- Skills retain verified content. Rust, Tauri, and Ollama are identified as Halo
  stack/plan items. No proficiency ratings or unsupported employment claims.
- Social links reuse the existing configuration and sit in a compact arc above the
  existing geographic globe. Its drag, keyboard, pause, and fallback logic stays intact.

## Preview limitations

Embeds load on request to avoid loading two external apps on initial page load.
Each keeps a 440px viewport and one primary external link. Browser error events
and a 15-second load timeout return to an editorial cover. A manual fallback is
always available while the iframe is open: blocked frames can still emit `load`.
The portfolio cannot inspect cross-origin frame contents or reliably detect their
errors, scroll position, authentication, or internal navigation. No internal click
redirects or guessed deep links were added. Such behavior needs changes in the
original application or a vetted cooperative message protocol.

No authentic Halo/AgroZyro captures exist in this repository. Their covers explicitly
state they are editorial, not screenshots. Halo's public source URL is still absent;
configure NEXT_PUBLIC_HALO_REPOSITORY_URL when available. Do not invent one.

## Cleanup

Removed the three unreferenced stock photos after source/documentation reference
checks. Historical credits remain. Starter SVGs were already removed; custom
favicon, metadata, portrait, resume, globe map, and source documentation are kept.
Removed obsolete preview, placeholder, source-action, and text-social CSS. Theme
tokens used by contrast/branding checks remain. All installed dependencies still
have a current build or application role; package manifests are unchanged.

## Required browser follow-up

Desktop/tablet/mobile composition, overflow, layout shift, both themes and reload
persistence, Hindi glyphs and text transitions, hover/focus slowdown, copy-email,
iframe scrolling/authentication/navigation/fallback UI, reduced motion, and console
errors must be tested with browser access enabled. HTTP and source checks do not
prove those interactions work.

## Executed checks

TypeScript, ESLint, production build, 78 palette contrast pairs, and five globe
geometry/rotation tests passed. The local HTTP audit passed for four unique anchor
targets, one H1, the English-first server fallback, configured email, theme bootstrap,
and all 37 referenced local icons/map/photo/resume assets. SVGs total about 50 KB.

Read-only public URL checks returned 200 for GitHub, both deployed project homepages,
and the three configured source repositories. The project homepages supplied no
X-Frame-Options or CSP frame-ancestors header. This is not a guarantee of successful
embedding, authentication, or data loading. LinkedIn returned 999; LeetCode and
Codeforces returned 403, preventing automated profile verification. URLs are unchanged.
Halo has no public URL configured, and AgroZyro has no live URL configured.

## Changed files

- Components: profile-hero, portfolio, prototype-panel, contact-earth.
- New components: animated-name, floating-technologies, brand-icon, technical-stack,
  social-orbit.
- Shared styles: src/app/globals.css.
- Content: src/content/portfolio.ts (skill grouping; existing project/experience/
  education facts preserved), src/content/brand-icons.json (new icon catalogue).
- Assets: public/icons/ (33 SVGs, license, credits); public/images/CREDITS.md;
  removed architecture.jpg, desk.jpg, studio.jpg.
- Documentation: README.md, docs/prototype-integration.md, this file.
- New scripts: import-brand-icons.mjs, import-additional-icons.mjs,
  verify-portfolio.mjs, check-public-links.mjs.

Fonts, palette tokens, package manifests, public URL configuration, favicon, portrait,
resume, Next.js setup, and external project source repositories were not replaced.
