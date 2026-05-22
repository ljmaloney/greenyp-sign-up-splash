## Goal

1. Refine the leaf in `public/greenpages-logo-2.svg`, `-3.svg`, `-4.svg` to better match the leaf in `src/assets/greenyp-logo.png` — a smooth, classic teardrop: **pointed apex at top, gently curving sides, full rounded bulb at the bottom**, no harsh mid-leaf bulge, light internal veining.
2. Create a new `public/greenpages-logo-5.svg` — a "tree" variant where the **Y in "GreenYP"** acts as the trunk and forked branches of a stylized tree, with a green canopy of leaves resting on the fork.

## Reference shape (logos 2/3/4)

Adjust the leaf path so the silhouette reads like the reference:
- Apex narrows to a soft point at the top (not razor-sharp)
- Sides curve smoothly outward as one continuous arc (no inflection / no "wider in lower third" bulge)
- Base is a full round bulb, widest near the bottom ~25%
- Small stem stays below
- Central vein curves slightly along the leaf axis; 3 pairs of side veins arcing toward the tip
- Keep gradient `#86efac` → `#22c55e` → `#15803d`, vein color `#14532d`, viewBox, wordmarks, taglines, and positioning unchanged

Conceptual path (cx=30, top=4, bottom=66, max-half-width ~22):
```
M 30 4
C 18 14, 8 34, 8 48          (left side: smooth arc out)
C 8 60, 18 66, 30 66          (left base: round into bulb)
C 42 66, 52 60, 52 48         (right base: round out of bulb)
C 52 34, 42 14, 30 4          (right side: smooth arc back to apex)
Z
```
Scale this path appropriately for logo-3/4's larger leaf (~2× height).

## New file: `public/greenpages-logo-5.svg`

Layout: horizontal, similar dimensions to `greenpages-logo-2.svg` (viewBox `0 0 280 100` or similar).

**Tree concept:**
- Render the wordmark "GreenYP" in the same fonts/colors as the other logos.
- The **"Y" glyph itself is drawn as a tree**, not as a normal text character:
  - Trunk: a vertical tapered shape in `#15803d` / brown-green, sitting on the text baseline.
  - At the top of the trunk, two branches fork up-left and up-right (the Y arms), in the same trunk color, tapering thinner toward their tips.
  - A cluster of leaf shapes / a soft cloud-like canopy sits over the fork, filled with the leaf gradient (`#86efac` → `#22c55e` → `#15803d`). Canopy occupies roughly the visual space of the Y's upper triangle, with a few small individual leaflets peeking out for organic feel.
- "P" follows the tree-Y in `#22c55e` like the other logos.
- "Green" prefix in `#15803d`.
- No tagline.

Implementation notes:
- The tree-Y replaces only the Y character — split the wordmark into three text spans: "Green" (text), tree-Y (SVG group), "P" (text). Align baselines visually so the trunk's base sits on the text baseline.
- Use simple paths (no rasters). Stems/branches as filled tapered paths or thick rounded strokes.

## Out of scope

- `public/greenpages-logo.svg` is not touched.
- No code references to any of these files are added — static assets only.
