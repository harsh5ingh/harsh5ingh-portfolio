> Current implementation: see [ProjectShowcase](project-showcase.md). The iframe implementation has been retired. The observations below are historical, including browser observations; they are not verification of the current showcase.

# Actual prototype integration audit

Checked 17 October 2026. Source inspection and HTTP results are distinguished from interactive browser verification. Browser access became available during the cleanup. Earlier HTTP-only observations below are historical; see the cleanup verification at the end for the new browser evidence. No full end-to-end acceptance is claimed.

## Portfolio behavior

The portfolio no longer contains fabricated application screens, generated analytics, scripted walkthrough responses, or a replacement map. Project descriptions, contributions, perspective ordering, and stacks remain. References to the removed simulations were updated. `PrototypePanel` offers an original-app launch and, for configured HTTPS applications, an on-request iframe with loading timeout, manual fallback, and close control. Apps retain their own branding, themes, navigation, loading and error states.

The supplied public URLs live only in ignored `.env.local` as `NEXT_PUBLIC_KAUSHALIQ_LIVE_URL` and `NEXT_PUBLIC_GEOVISTA_LIVE_URL`. Configure the same values in the hosting environment. `.env.example` contains blank placeholders. `NEXT_PUBLIC_*_EMBED_ENABLED=true` enables the optional iframe after checking the destination's policy. The checked home responses did not send X-Frame-Options or a Content-Security-Policy restricting framing. This is not proof that every route or authentication flow works in a frame. No security header, cookie, CORS, or OAuth setting was changed.

The iframe permits scripts, same-origin application storage, forms, and new-tab popups; it does not permit top-level navigation, camera, microphone, or geolocation. Opening the app in a new tab is the fallback for loading problems or authentication. No provider credentials, backend proxy, or privileged access is added to the portfolio.

## Halo

- Actual source: `D:\Coding\halo\frontend` and `D:\Coding\halo\desktop\src-tauri`.
- Source implements Spidey rendering, native drag commands, companion settings, context menu, and tray/lifecycle control. Browser mode explicitly rejects native drag/settings operations. Python inference and cloud providers remain planned.
- The Tauri configuration points to the existing frontend at port 1420. Native entry point: `cargo tauri dev` from `desktop/`, using the project's pinned toolchain and prerequisites. Follow the checkout's current build-readiness guidance; do not bypass Application Control restrictions documented there.
- Integration: clearly labelled desktop-only information and setup instructions. No browser mockup, guessed installer URL, or automatic executable launch.
- Verification: current source/configuration inspected. Native functionality was not launched or retested in this portfolio task. A recording of the actual runtime or a published release would enable a richer public demonstration later.

## KaushalIQ

- Canonical source: `D:\SIH part 2\KaushalIQ`; frontend React/Vite, backend FastAPI. The separate `D:\Coding\kaushaliq` checkout was not modified.
- User-confirmed deployment is configured in `NEXT_PUBLIC_KAUSHALIQ_LIVE_URL`. Its homepage returned HTTP 200. The public source contains product/how-it-works/info routes; real intelligence views; authentication; and protected profile/settings routes. Their interactive operation was not browser-tested here.
- `useDemandSnapshot.ts` requests demand, demand coverage, and `/api/v1/sources`. Any network failure, contract mismatch, provenance mismatch, or incompatible snapshot triggers the screenshot's error. Empty verified results use a separate unavailable state.
- The existing Vercel `/api` rewrite points to `https://kaushaliq.onrender.com/api/:path*`. Initial public API requests timed out. Subsequent demand, coverage, and sources requests all returned 200. Their real responses passed the actual TypeScript demand decoders and the hero's snapshot invariants: version, national observation count, dates, reference period, publication counts, geographic coverage, and source binding. The publication has 37 records and returns one national observation for the hero query. These are diagnostic observations, not portfolio metrics.
- Local canonical and demand files exist, their SHA-256 manifests match, and demand's base version matches the canonical publication.
- The actual local Vite frontend returned 200. Its API proxy returned 500 with the configured backend at port 8000 absent. Start the existing backend with `python -m uvicorn src.main:app --host 127.0.0.1 --port 8000` from `backend/`, using its own environment; then run `npm run dev` in `frontend/`.
- Conclusion: public availability was intermittent during checking. Backend wake-up is plausible but unconfirmed without hosting logs. No reproducible source/data fault justified a code fix; no backend or data was changed. The real app's errors remain visible.
- Integration: original application launch and optional iframe. Rendering, authentication and navigation inside the iframe remain browser-verification tasks.

## GeoVISTA

- Source: `D:\Coding\z-axis` contains a newer root Cesium app and a separate `frontend/` app with Three.js viewers, public/officer views, account flows, and API services.
- The user-confirmed deployment is configured in `NEXT_PUBLIC_GEOVISTA_LIVE_URL`. Homepage and application bundle returned 200. The deployed bundle contains the older application's token/storage marker and a backend origin of `https://z-axis.onrender.com`; it does not contain Cesium markers found in the root app. This supports using the supplied deployment rather than silently substituting the root app.
- Root Cesium source exits early without its configured Ion token, contains fixed illustrative property data, and currently has no installed root dependencies. It was not installed, reconfigured, or presented as a verified working map.
- Integration: original deployed application launch and optional iframe. Real maps and property views are supplied by that application, never recreated in the portfolio. No authentication credentials or demo-officer access are copied into this repository.
- Verification limits: map rendering, layer loading, property interactions, authentication and backend-dependent workflows require a browser pass. No complete integration claim is made.
- Public backend check: `/health` initially timed out after 15 seconds; `/api/parcels` subsequently returned HTTP 200 JSON. This confirms a reachable read endpoint at that time, not working map rendering or every backend workflow.

## AgroZyro

- Source: `D:\Coding\agrozyro` (Next.js App Router). Actual routes include `/` and `/marketplace`; components include product cards, category/filter UI, navigation and sign-in/sign-up modals.
- `ProductGrid.tsx` supplies hardcoded listings. Filter drawer visibility has local state, but no connection to dynamic inventory was found. Sign-in's submit handler prevents default submission; no authentication or commerce API implementation was found. Product details/order/payment flows cannot be described as working.
- User plans deployment; no deployed URL was supplied. Add it to `NEXT_PUBLIC_AGROZYRO_LIVE_URL` after deployment. Leave embedding disabled until the deployed headers and browser behavior are checked.
- Integration: clearly labelled application-in-development panel and local setup, with unavailable live action hidden. The portfolio adds no inventory, orders, or fake successful responses.
- Local test: the actual Next.js dev server on port 3002 returned HTTP 200 for `/` and `/marketplace`; the marketplace response included its existing Mustard Seeds and Soybean listings. This verifies served pages, not functional authentication, checkout, or interactive filtering.

## Hero assets

- Portrait: `public/assets/photo.jpeg`. Missing files render a neutral placeholder; an image-load failure also falls back gracefully. Replace the file at this path and rebuild the deployment to update the photograph.
- Resume: `public/assets/harsh-kumar-resume.pdf`, copied unchanged from the user's supplied resume. The download action is rendered only when the file exists.
- Identity remains Harsh Kumar, explicitly reconfirmed by the user. College, study dates, and interests now replace the former promotional stat labels.

## Portfolio checks

Standalone TypeScript, ESLint, the normal production build, 78 semantic contrast checks, and Git whitespace checks passed. The copied resume's SHA-256 matches the supplied original. `.env.local` is ignored by Git. Browser-only checks remain outstanding: mobile/tablet layout, portrait load fallback, perspective interactions, opening/closing embeds, keyboard focus, real app navigation, and authentication behavior. No other application's source, security configuration, data publication, or deployment was modified.

Production HTTP checks confirmed the new hero, server-rendered missing-portrait placeholder, both environment-backed prototype links, Halo/AgroZyro unavailable states, valid internal navigation targets, and the PDF download. Removed simulation labels and UI are absent from the served page. Temporary prototype/test servers started for these checks were stopped; the existing portfolio development server was left running.

## Approved cleanup (17 October 2026)

- The portrait hero remains first; no cinematic intro is restored. Duplicate introductions, standalone interest panels, stock-photo placements, redundant numbers, and duplicate project launch links are removed.
- Original project descriptions, perspective ordering/commentary, experience, education, and skills remain in src/content/portfolio.ts. Technology details are expandable. Setup commands remain in this document.
- KaushalIQ and GeoVISTA keep their actual applications in stable-width, lazy-loaded, sandboxed frames. A single external launch link remains available if embedding, authentication, or services fail. No fake data or application state is supplied.
- Halo: a monitor icon and labelled desktop-capture placeholder, not a screenshot or native runtime. To demonstrate it locally, run npm run dev from frontend/ and cargo tauri dev from desktop/ after satisfying the project's documented native-build prerequisites. No installer is configured.
- AgroZyro: a seedling icon and labelled marketplace-capture placeholder. Run npm run dev -- --port 3002 in its existing checkout and visit /marketplace. Capture only the actual frontend; listings are static. Add a deployed URL through the existing public environment variable when available.
- No source outside this portfolio was changed. Stock photos are retained only as credited source assets, not page content. Five unused starter SVGs and the unreferenced editorial component were removed after reference searches.

## Cleanup verification results

All three stages passed standalone TypeScript (npx --no-install tsc --noEmit), ESLint (npm run lint), and the normal production build (npm run build). The final semantic palette/generated-brand checks passed all 78 combinations. The content module SHA-256 remained 1d8d3f9e0ee4097eab21758ee09cd2daa986dc176f8db968106bcd532b142753 throughout: project content, experience, skills, and education were not rewritten.

Browser evidence from the stage-two production build:
- At 1440px, the alternating project columns used the intended grid and the page did not overflow horizontally. The portrait loaded. The dark theme was visible; persistence code was preserved, but a toggle/reload test was not completed.
- Both actual deployed applications rendered inside sandboxed portfolio frames.
- KaushalIQ: View Evidence navigated to Demand. Published historical data loaded; selecting Bihar produced one matching observation (26,911 active portal vacancies, observation date 2025-07-14). These are the original app's data, not portfolio metrics. The broader application's unavailable forecasts and sample sections remain its responsibility. No fabricated success state was introduced.
- GeoVISTA: Get Started opened the Public Portal sign-in form. The portfolio's Hide/Show embedded app controls changed state correctly. Authentication was not submitted; map, property, officer, and backend workflows are unverified. The app contains its own institutional branding and claims; embedding does not independently verify those claims.
- Cross-origin application themes remain independent. Portfolio security settings and source applications were not weakened or changed.

Browser access was disabled again before final mobile/tablet, light-theme toggle/persistence, keyboard, and final placeholder visual checks could finish. A temporary viewport reset was attempted but blocked by that setting. No full browser acceptance is claimed.

Final stage-three production HTTP checks passed: one H1, one portrait image, all four project anchors, two real iframe URLs, both explicit capture placeholders, retained Gyan Niketan/CBSE/dates, no old stat slogans or setup commands, and valid internal links. Portrait, resume, robots, sitemap, social image, SVG icon and favicon returned 200. The existing port-3000 dev server initially served stale CSS; its final HTTP-served CSS contains the latest prototype and placeholder rules. The temporary port-3001 test server was stopped after checks.
