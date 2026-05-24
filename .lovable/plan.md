## Goal

Replace the leaf in `public/greenpages-logo-6.svg` with a shape that matches the uploaded reference: a more realistic, pointed-tip leaf with an asymmetric S-curve central vein, softer side veins, and a fuller body that tapers to a sharp apex (rather than the current symmetric teardrop).

## Reference observations

From `user-uploads://greenpages_splash.png`:
- Pointed apex at top, gently rounded base.
- Slight S-curve silhouette — left edge bulges lower, right edge bulges higher, so the leaf looks alive rather than perfectly symmetric.
- Prominent dark-green central vein following the same S-curve, splitting the leaf into a lighter left half and a slightly darker right half.
- 3–4 soft side veins per side branching off the central vein toward the edges.
- Light-to-dark green gradient (light at the tip-facing side, darker toward the base/right).
- Short stem at the base.
- Leaf stands nearly upright (very slight tilt), not the current 20° rotation.

## Changes to `public/greenpages-logo-6.svg`

1. Remove the existing teardrop `<path>`, central vein, and 8 side veins inside the leaf `<g>`.
2. Replace with a new leaf composition:
   - Outer silhouette: pointed apex at top, asymmetric curves (left side fuller below, right side fuller above), rounded base where the stem meets.
   - Central vein: single dark-green path (`#14532d`) following an S-curve from base to apex, slightly off-center.
   - 3 side veins per side, curving outward and upward from the central vein toward the edges, stroke `#14532d` at low opacity.
   - Optional subtle two-tone fill: keep the existing `leaf6` gradient on the main body, plus a slightly darker overlay path on the right half (clipped to the leaf shape) to suggest the fold along the central vein.
3. Reduce rotation from `rotate(20)` to about `rotate(5)` so the leaf stands nearly upright like the reference.
4. Keep the stem rect, the leaf group's translate/scale, the surrounding viewBox (`280×120`), the wordmark, and the tagline exactly as they are.

## Out of scope

- `greenpages-logo.svg`, `-2`, `-3`, `-4`, `-5`, and `-7` through `-16` are not touched.
- No code references change — static asset only.
- Wordmark, tagline, colors, gradient stops, fonts, and layout remain unchanged.
