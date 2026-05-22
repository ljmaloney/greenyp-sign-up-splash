## Goal

Update the leaf illustrations in `public/greenpages-logo-2.svg`, `public/greenpages-logo-3.svg`, and `public/greenpages-logo-4.svg` so the leaf reads as a proper teardrop: **narrow/pointed at the top, widest near the bottom, with a short stem extending below**.

## Changes per file

For each of the three SVGs:

1. **Reshape the leaf path** so the silhouette is an inverted teardrop:
   - Pointed apex at the top
   - Sides bulge outward, reaching maximum width in the lower third
   - Base rounded and wide (not pointed)
2. **Add a short stem** as a small rounded rectangle / thin path extending a few units below the leaf base, using the darkest gradient stop color (`#15803d`) so it reads as part of the plant.
3. **Adjust the central vein** to run from the top apex down through the leaf into the stem (straighter, since the leaf is now symmetric top-to-bottom along its axis).
4. **Rebalance the side veins** so they fan outward from the central vein toward the widest part of the leaf (lower half gets more/longer veins than upper half).
5. **Keep** the existing gradient (`#86efac` → `#22c55e` → `#15803d`), vein color (`#14532d`), wordmark, tagline, viewBox, and overall layout/positioning unchanged.
6. **Keep** the slight tilt rotation on logos 3/4 (or remove it if it looks off with the new shape — minor visual judgement during build).

`public/greenpages-logo.svg` is **not** touched.

## Technical notes

- New leaf path shape (conceptual, for a leaf bounding box of width ~64, height ~112, apex at top):
  ```
  M cx,top                          (apex, pointed)
  C cx-28,top+30  cx-32,top+80  cx,bottom     (left side bulges, rounds into base)
  C cx+32,top+80  cx+28,top+30  cx,top        (right side mirrors back to apex)
  Z
  ```
- Stem: small rounded rect ~3-4 units wide, ~8-10 units tall, centered under leaf base, filled `#15803d`.
- No code/component references change — these remain unused static assets.
