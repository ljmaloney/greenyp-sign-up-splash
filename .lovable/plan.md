# Create 3 new logo SVG variants

Add three new files alongside `public/greenpages-logo.svg`, each inspired by `src/assets/greenyp-logo.png` and `src/assets/greenpages-splash.png`.

## Files to create

1. **`public/greenpages-logo-2.svg`** — Horizontal: upright tear-drop leaf on the left + "GreenYP" wordmark on the right (single line). Based on `greenyp-logo.png`.
2. **`public/greenpages-logo-3.svg`** — Stacked: upright leaf on top, "GreenPages" wordmark below, with tagline "Your Garden. Their Expertise." Based on `greenpages-splash.png`.
3. **`public/greenpages-logo-4.svg`** — Same stacked layout as #3 but without the tagline.

## Design details

- **Leaf**: refined upright tear-drop shape (pointed tip up, curved central vein, a few side veins) — closer to the references than the rounded rotated leaf in `greenpages-logo.svg`. Linear gradient from `#22c55e` (top) to `#15803d` (bottom), matching the existing palette.
- **Typography**: system sans-serif, bold, matching current weights. Two-tone wordmark:
  - "Green" in `#15803d` (dark green)
  - "YP" / "Pages" in `#22c55e` (bright green)
- **Tagline** (logo-3 only): smaller weight-400 text in `#22c55e`, "Your Garden. Their Expertise."
- **ViewBoxes**: sized to fit each composition tightly with small padding; no external dependencies, pure inline SVG (same approach as the existing file).

## Notes

- No code references to these new files are added — they are static assets the user can wire up later.
- The existing `greenpages-logo.svg` is untouched.
