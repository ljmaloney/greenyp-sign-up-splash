## Goal

Rework `public/greenpages-logo-5.svg` so the leaf from `greenpages-logo-4.svg` appears on the left, and the tree-Y inside "GreenYP" has a brown, clearly visible trunk and branches.

## Changes to `public/greenpages-logo-5.svg`

1. **Add the leaf on the left** — copy the leaf group from `greenpages-logo-4.svg` (smooth teardrop, gradient `#86efac`→`#22c55e`→`#15803d`, central vein, side veins, stem) and place it at the left edge. Scale to fit the logo height (~70-80 units tall) and shift the wordmark right to make room.
2. **Brown trunk and branches** — change the trunk and the two forked branches inside the Y from `#15803d` to a brown (`#6b4423` body with `#3f2a14` for subtle shading, or a single `#5a3a1d`). Increase the trunk width (~6-7 units instead of ~5) and thicken the branches so they read clearly against the green canopy and white background.
3. **Keep** the green canopy of overlapping leaf circles on top of the fork, "Green" prefix in `#15803d`, "P" suffix in `#22c55e`, and the overall horizontal layout. Adjust viewBox width if needed to fit the new leaf on the left.

## Out of scope

- `greenpages-logo.svg`, `-2`, `-3`, `-4` are not touched.
- No code references change — static asset only.
