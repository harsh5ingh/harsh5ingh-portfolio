> Historical implementation. Replaced by [ProjectShowcase](project-showcase.md); the iframe component, endpoint and policy helpers described below have been removed.

# Homepage previews

Updated 18 October 2026. No application UI, analytics, map data, inventory, or authentication is recreated by the portfolio.

## Configuration

Each of HALO, KAUSHALIQ, GEOVISTA and AGROZYRO uses the existing public variables:

- `NEXT_PUBLIC_<PROJECT>_REPOSITORY_URL`: optional public source URL.
- `NEXT_PUBLIC_<PROJECT>_LIVE_URL`: optional actual homepage URL.
- `NEXT_PUBLIC_<PROJECT>_EMBED_ENABLED`: `true` offers an on-demand preview; blank/false keeps the cover and external links.

Values are embedded at build time: rebuild after changing them. Use the same environment for the frontend build and server. Invalid, non-web, and credential-bearing URLs do not become active links. Embedding additionally requires HTTPS. `.env.example` contains blank project values. Never put credentials in these variables.

Halo can display supplied artwork at `public/assets/spidey.svg`; missing artwork is omitted, and image errors fall back without inventing a companion identity. Halo and AgroZyro currently have no live URLs. Their covers are labelled prototype concepts, not screenshots. KaushalIQ remains **Prototype**. GeoVISTA's configured embed flag is currently false; its external link remains available.

## Loading and failure behavior

1. The visitor chooses **Explore homepage**. No third-party iframe loads on initial page render.
2. `/api/project-preview/[id]` checks only the configured destination for that known, enabled project. Caller-supplied URLs are never fetched. The check uses GET, no credentials, an eight-second timeout and bounded same-origin redirects. Cross-origin redirects, non-HTML responses, errors and framing restrictions produce a fallback.
3. An allowed response means only that the check found no known framing restriction. The browser remains the final authority. X-Frame-Options and CSP frame-ancestors are checked conservatively; unsupported policies fail closed. No site's security settings are changed.
4. The original site loads into a fixed viewport with native scrolling and its own styling. The hash is removed from the initial configured URL; **Reload homepage** creates a fresh frame. The portfolio cannot force scroll position or intercept internal SPA navigation across origins. Configure a homepage URL, not a deep route.
5. The iframe's `load` event is labelled **visibility unverified**, because some blocked documents also emit it. Only the visitor's **Homepage is visible** confirmation changes that label. A subsequent document load clears the confirmation. An error or 15-second initial load timeout returns to the cover; **Use fallback** is always available when the frame is open. The portfolio does not infer backend success or successful rendering from HTTP 200.
6. Source and live actions are independent, always outside the iframe, and use `noopener noreferrer` in a new tab. Missing actions are visibly unavailable. The frame permits scripts and same-origin application storage, but not forms, popups, top-level navigation, camera or microphone. Use **Open live site** for the complete application and account flows.

Loading uses a static skeleton rather than continuous decorative animation. Containers share a 440px desktop/tablet viewport and 380px mobile viewport. Themes apply to the frame and controls; external websites retain their own theme.

## Audit and verification boundary

The old KaushalIQ message was unconditional for any configured live URL. The previous component rendered no iframe and ignored the embed flag; it was not evidence of an actual framing failure.

During this update both configured deployed homepage URLs returned HTTP 200 with no X-Frame-Options or CSP frame-ancestors restriction. All four configured repository URLs also returned 200. These are HTTP checks, not verified browser embeds or feature tests.

Browser automation is disabled in this environment. Desktop/tablet/mobile appearance, iframe rendering and scrolling, keyboard focus, loading/fallback interactions, external-tab behavior, theme appearance, console output and overflow still require browser verification. Do not describe any current embed as browser-verified based on the automated policy tests.

Completed checks: TypeScript, ESLint, all 29 Node tests, the production build, 78 existing contrast pairs, asset/reference checks, and HTTP checks for 37 local assets passed. The built API returned `allowed: true` for KaushalIQ, configured-disabled/missing fallbacks for the other three, and 404 for an unknown project. The build initially hit a Turbopack worker/cache failure; preserving and refreshing its generated cache resolved it without framework configuration changes. Node emitted an existing module-type warning during tests; no package setting was changed to suppress it.

## Files changed in this pass

- `src/components/prototype-panel.tsx`, `src/components/prototype-panel.css`: preview state UI, shared controls, frame and skeleton styling.
- `src/lib/preview-state.ts`: load/confirmation/fallback state transitions and initial URL handling.
- `src/lib/embed-policy.ts`, `src/app/api/project-preview/[id]/route.ts`: configured-destination policy checks.
- `src/config/site.ts`, `.env.example`: validated URLs, embed flags and public configuration documentation.
- `scripts/project-previews.test.mjs`, `scripts/embed-policy.test.mjs`, `scripts/refinement.test.mjs`, `scripts/verify-portfolio.mjs`: preview and regression checks.
- `docs/homepage-previews.md`, `docs/prototype-integration.md`: current behavior and historical-audit clarification.

No other portfolio components, assets, external application sources, or private environment values were changed.
