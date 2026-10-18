# ProjectShowcase

Adapted from the user-supplied React component on 18 October 2026. One data-driven showcase replaces the four separate prototype panels. It keeps layered visual transitions, active text transitions, Previous/Next navigation, and responsive visual/details columns. A compact project picker makes all four entries directly accessible.

## Content and configuration

`src/content/portfolio.ts` remains the source for project names, descriptions, statuses, contributions, technologies and extended technical details. No project claims were changed. `src/components/portfolio.tsx` combines those records with the existing validated source/live links from `src/config/site.ts`.

All eight URL variables remain optional:

- `NEXT_PUBLIC_HALO_REPOSITORY_URL`, `NEXT_PUBLIC_HALO_LIVE_URL`
- `NEXT_PUBLIC_KAUSHALIQ_REPOSITORY_URL`, `NEXT_PUBLIC_KAUSHALIQ_LIVE_URL`
- `NEXT_PUBLIC_GEOVISTA_REPOSITORY_URL`, `NEXT_PUBLIC_GEOVISTA_LIVE_URL`
- `NEXT_PUBLIC_AGROZYRO_REPOSITORY_URL`, `NEXT_PUBLIC_AGROZYRO_LIVE_URL`

Blank, malformed, non-web or credential-bearing URLs render unavailable actions. Valid actions are normal links with `target="_blank"` and `rel="noopener noreferrer"`. Rebuild when public environment values change. No private environment file was modified. The former `NEXT_PUBLIC_*_EMBED_ENABLED` flags are unused and have been removed from `.env.example`.

## Screenshots and illustrative compositions

No genuine application screenshots are configured. Each project now uses a distinct, explicitly labelled illustrative composition: GeoVISTA terrain/buildings/parcels, KaushalIQ sample demand/supply/forecast charts, Halo assistant layout with actual prototype Spidey artwork, and AgroZyro crop listings using its source photos and sample prices. These are visual studies, not functioning applications or captures. See `public/assets/project-previews/CREDITS.md` for provenance. Add an optional `image` when a genuine capture is supplied:

```ts
image: {
  src: "/assets/your-supplied-capture.webp",
  alt: "Describe the actual captured screen",
  caption: "Actual homepage capture · date/version if known",
}
```

The path above is a documentation example, not a configured or generated asset. Use a local file under `public/assets`. Images use modern Next Image `fill`, responsive sizes and `object-fit: contain`, preserving screenshot content. A failed screenshot returns to the labelled illustrative composition. Halo optionally includes owner-supplied `public/assets/spidey.svg`; otherwise it uses the copied current prototype artwork. Image errors reveal a brief unavailable-artwork label. No replacement Spidey identity was generated.

## Interaction and accessibility

- No autoplay, iframe, demo cursor, backend simulation, image generation or additional dependency.
- Native labelled buttons provide manual Previous/Next and direct selection; selection wraps. Controls stay mounted when content changes, preserving keyboard focus.
- Empty arrays render nothing; a single entry disables Previous/Next; removing the selected entry falls back to the first available project.
- Reduced motion disables transform entrances and transition duration. A polite announcement reports the selected project and position.
- CSS grid handles responsiveness without `ResizeObserver`, resize state, dynamic Tailwind classes or listener cleanup. Rotations are deterministic. Theme colors come from existing semantic variables, with Manrope and DM Sans inherited from the portfolio.
- Full technical details are preserved in an optional disclosure, reset on selection. Only the active project has action links.

## Changed and removed files

Added `src/components/project-showcase.tsx`, `src/components/project-showcase.css`, `scripts/project-showcase.test.mjs`, and this document.

Updated `src/components/portfolio.tsx`, `src/content/portfolio.ts`, `src/config/site.ts`, `src/app/globals.css`, `.env.example`, `scripts/refinement.test.mjs`, `scripts/verify-portfolio.mjs`, and historical preview documentation.

Removed the old `prototype-panel.tsx` / `.css`, `src/lib/preview-state.ts`, `src/lib/embed-policy.ts`, `src/app/api/project-preview/[id]/route.ts`, and the two tests dedicated to those deleted implementations. Reference checks confirmed these were preview-only. Removed 36 obsolete project/portal CSS rules or selector branches, retaining unrelated branches of shared rules. No assets or dependencies were removed.

## Original showcase integration verification (historical)

Automated component tests execute selection handlers, wraparound, changing/empty project arrays, external-link rendering, image error fallback and reduced-motion configuration using a React hook harness. They do not verify real browser layout or Framer Motion's visual output.

Browser access is disabled in Work settings. Theme appearance/persistence, actual keyboard/touch interaction, transitions, screenshots, responsive overflow and browser-console checks require a browser pass. Link destination availability was not rechecked in this change; configured URLs were preserved.

Completed: standalone TypeScript, ESLint, production build, all 25 Node tests, 78 existing contrast checks, asset/reference checks and HTTP checks for 37 local assets passed. The production showcase stylesheet was served successfully, old preview selectors were absent, and the retired API returned 404. Initial checks hit stale generated route types and the existing Turbopack worker/cache failure; regenerating the build after preserving/refreshing the generated cache resolved them. Node's pre-existing module-type warning remains; no dependency or package setting was changed to suppress it.

## Illustrated preview refinement — 18 October 2026

Changed only the showcase visual fallback and supporting files:

- Added `src/components/project-concepts.tsx` and `project-concepts.css` with four distinct static compositions. Each has an accessible image description and visible illustrative caption. Decorative interface controls are not focusable or interactive.
- Updated `project-showcase.tsx` to render those compositions only when a genuine screenshot is unavailable. Removed the unused typographic cover rules from `project-showcase.css`. Existing frame dimensions, navigation, transitions, order, project copy and URL configuration are unchanged.
- Added four unchanged source assets and their `CREDITS.md` under `public/assets/project-previews/`. SHA-256 comparisons confirmed the copies match the source files.
- Updated `scripts/project-showcase.test.mjs`, `scripts/verify-portfolio.mjs`, and this document. No dependencies were added.

Verification completed after the final code changes:

- `npx tsc --noEmit`, `npm run lint`, and `npm run build`: passed.
- `node --test scripts/*.test.mjs`: 29/29 passed. Covers selection/wraparound, empty arrays, missing/failed screenshots and supplied artwork, safe optional links, reduced-motion configuration, and honest non-interactive concept markup.
- `node scripts/design-system.mjs`: 78 existing contrast pairs passed. These verify the shared token combinations, not every miniature detail in the illustrations.
- `node scripts/verify-portfolio.mjs` and the HTTP variant with `http://localhost:3000`: passed; 41 local assets returned 200.
- Browser: inspected all four previews at 1280px desktop, 768px tablet and 320px phone widths in both themes. A 24-case DOM check found no horizontal page overflow, no overflowing scene height, and no missing preview images. Also checked the Halo layout at 414px.
- Browser: direct project selection, Previous/Next keyboard activation and wraparound worked; focus remained on the navigation control with a visible outline. External links retained new-tab and `noopener noreferrer` attributes. No warning/error console entries were captured.

The tablet pass exposed squeezed charts; container-based compact spacing corrected them without resizing the frame. No automatic motion or pretend backend operations were added. Browser reduced-motion emulation and real external destination availability were not retested in this refinement. All four current visuals remain illustrative compositions; authentic supplied screenshots will still take priority when configured.
