# Earth map

`land-points.json` and `earth-fallback.svg` are sampled from Natural Earth's
1:110m land polygons. No country borders or territorial claims are drawn.
The India marker denotes 22° N, 79° E, not a precise personal location.

- Source: https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson
- Retrieved: 2026-10-17
- Source SHA-256: `9e0729ee253ca7d7a5c4ae9395fb1902264c5377c52e224d13dd85010e2835d9`
- License: public domain, https://www.naturalearthdata.com/about/terms-of-use/
- Regenerate: `node scripts/generate-globe.mjs <path-to-ne_110m_land.geojson>`

The SVG is a monochrome land mask; the portfolio applies its semantic theme
colors to the ocean, land, and India marker. It remains available if JavaScript,
Canvas 2D, or the interactive map data fails. No WebGL or external map API is used.
