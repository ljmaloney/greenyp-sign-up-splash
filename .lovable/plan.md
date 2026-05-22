## Goal

Match `src/assets/greenyp-logo.png`: a tilted teardrop leaf on the left, "Green" in dark green, "YP" in light green — no tree. Then create a stacked variant with the tagline below.

## Reference observations

In `greenyp-logo.png` the leaf:
- Sits to the left of the wordmark, roughly the cap-height of the text.
- Tilts right: apex points to the upper-right, bulb base toward the lower-left (≈ +20° clockwise from upright).
- Smooth teardrop with a faint central vein and a couple of curved side veins.
- Gradient: light green at apex → mid green → deeper green at base.

Wordmark: "Green" in dark green (`#15803d`), "YP" in light green (`#22c55e`), single line, tight tracking.

## Changes to `public/greenpages-logo-5.svg`

1. Remove the entire tree-Y group (trunk, branches, canopy, leaflets) and the separate "P" text.
2. Reuse the logo-4 leaf group, scaled to cap-height (~50 units), rotated `+20°` so the apex points upper-right and the base lower-left, placed at the left edge.
3. Single wordmark `GreenYP`: `Green` in `#15803d`, `YP` in `#22c55e`, same font/size/weight as logo-4.
4. Tighten viewBox to fit `leaf + GreenYP` on one horizontal line (≈ `260×80`).

## New file `public/greenpages-logo-6.svg`

Stacked variant of logo-5:
- Top row: same leaf (left) + `GreenYP` wordmark on a single baseline.
- Bottom row: tagline `Your Garden. Their Expertise.` centered (or left-aligned under the wordmark), smaller weight (e.g. 14–16px, weight 500), color `#15803d` at reduced opacity or `#4b5563`.
- ViewBox sized to fit both rows (≈ `260×120`).

## Out of scope

- `greenpages-logo.svg`, `-2`, `-3`, `-4` are not touched.
- No code references change — static assets only.
