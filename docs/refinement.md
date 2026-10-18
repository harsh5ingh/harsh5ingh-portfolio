# Refinement — 17 October 2026

This pass supersedes the perspective and preview behavior described in earlier
iteration notes. Manrope, DM Sans, the portrait, resume, custom favicon, palette,
framework setup, experience and education remain intact.

## Behavior

- No perspective selector or profile-dependent ordering. Four projects have a fixed
  order; their technical, design and security commentary remains in disclosures.
- KaushalIQ is labelled Prototype. Both actions are always present for every
  project; missing destinations are non-clickable, clearly unavailable text.
- Hero logos share one clockwise motion (4px radius, 22 seconds). Hover/focus slows
  it. Buttons toggle authentic brand color; click again or Escape clears selection.
  Mobile and reduced-motion environments pause movement. The bilingual name runs
  one English/Hindi cycle and settles back to English; no motion-control button.
- The globe uses fixed dark semantic tokens in both themes. Pointer dragging,
  keyboard arrows, reduced motion, offscreen suspension, and SVG fallback remain.
  Play/pause, reset, Home handling, and all instructional text are removed.
- Six skills groups show six priority items each; additional genuine skills remain
  in compact disclosures. No proficiency claims or ratings are added.
- Navbar is sticky with a translucent neutral surface and 96px anchor offset.
  Scrollbars use native CSS styling. The sun line was an explicit theme-horizon
  span; only that span and its CSS were removed from the toggle.

## Homepage walkthrough boundary

All four frames use a 440px viewport and manual previous/next controls. There is no
autoplay or artificial cursor. Configured HTTPS embeds load on request into a
1320px-tall read-only iframe; the three steps move the portfolio's viewport over
that homepage. They do not query its DOM, scroll its document, click its controls,
submit forms, authenticate, or pretend backend actions occurred. Pointer events
and focus are disabled within the frame. External Source code and Live site actions
remain separate. Content/cropping varies with the real website's responsive layout;
these three crops are not a verified tour of specific internal app sections.

An error event or 15-second load timeout falls back to the labelled cover. Browsers
can emit load even when a cross-origin frame is blocked; the manual “Preview not
working?” control handles that case. This is not automatic confirmation that the
application loaded correctly. Security headers are unchanged.

Without a configured/embeddable homepage, the three steps show explicitly labelled
prototype homepage concepts using confirmed project information, without invented
inventory, prices, maps, dashboards, or Spidey identity artwork.

## Configuration and supplied assets

For each prefix HALO, KAUSHALIQ, GEOVISTA, AGROZYRO:

- `NEXT_PUBLIC_<PREFIX>_REPOSITORY_URL`: optional public source destination.
- `NEXT_PUBLIC_<PREFIX>_LIVE_URL`: optional real homepage destination.
- `NEXT_PUBLIC_<PREFIX>_EMBED_ENABLED=true`: enable the read-only homepage preview
  only after checking the deployment's frame policy and rendering.

The repository retains the established REPOSITORY_URL naming convention. There are
no hardcoded project URL fallbacks. Empty values are safe. These are public values,
never credentials. Rebuild after changing them. Existing .env.local is untouched.

Place the actual supplied Spidey SVG at `public/assets/spidey.svg` and rebuild.
Its path is centralized in `site.spideyAssetPath`. Until present, the preview shows
“Spidey artwork pending” and makes no broken image request.

## Cleanup and testing boundary

No further starter assets were found; custom framework branding assets and authentic
Next.js technology logos are retained. Removed selector/profile state, unused globe
controls, theme-horizon CSS, and obsolete style rules; exact duplicate selectors
were consolidated. No dependencies were added or removed.

Run `npx tsc --noEmit`, `npm run lint`, `npm run build`,
`node --test scripts/*.test.mjs`, `node scripts/verify-portfolio.mjs`, and
`node scripts/design-system.mjs`. With a production server, pass its URL to
verify-portfolio.mjs. check-public-links.mjs checks configured public URLs without
claiming browser behavior.

Browser automation is disabled in Work settings. Desktop/tablet/mobile appearance,
both themes and persistence, sticky positioning, real anchor clearance, scrollbar
rendering, icon speed/color/focus, actual homepage crops/fallback interactions,
globe interaction, console errors, and overflow remain unverified in a browser.

## Results from this pass

- TypeScript, ESLint, and the production build passed.
- All nine tests passed (five existing globe tests and four refinement tests).
- The existing 78 design-system contrast checks passed.
- Source/reference checks passed for 33 local SVGs, fonts, styles and preview
  safeguards. The temporary production server passed rendered-page checks and
  HTTP checks for 37 local assets; it was stopped after testing.
- KaushalIQ and GeoVISTA returned HTTP 200, with no X-Frame-Options or CSP
  frame-ancestors restriction detected. This does not verify iframe rendering,
  homepage crops, application data, or backend functionality.
- The configured GitHub profile returned 200. LinkedIn returned 999; LeetCode
  and Codeforces returned 403, so those profiles could not be verified by HTTP.
- All four source repository destinations are currently unconfigured. Halo and
  AgroZyro also have no configured live destination. No destinations were invented.
- Node emitted a non-failing module-type warning when verification scripts imported
  TypeScript configuration. Application package configuration was preserved.

## Files changed in this pass

- `src/components/portfolio.tsx`
- `src/components/profile-hero.tsx`
- `src/components/floating-technologies.tsx`
- `src/components/contact-earth.tsx`
- `src/components/social-orbit.tsx`
- `src/components/prototype-panel.tsx`
- `src/components/technical-stack.tsx`
- `src/content/portfolio.ts`
- `src/config/site.ts`
- `src/app/page.tsx`
- `src/app/globals.css`
- `.env.example`
- `scripts/refinement.test.mjs` (new)
- `scripts/verify-portfolio.mjs`
- `README.md`
- `docs/prototype-integration.md`
- `docs/refinement.md` (new)

No image assets, dependencies, font configuration, private environment files,
or other project repositories were changed or deleted in this pass.
