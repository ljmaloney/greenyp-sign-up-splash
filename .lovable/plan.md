# Replace PublicHeader logo with uploaded banner

## Steps

1. **Prepare the image asset**
   - Take `user-uploads://mainpage-banner.png`, remove the white background to make it transparent, and resize to a header-friendly size (target ~1600px wide, height auto — retains crispness on retina while keeping file size small).
   - Save as `src/assets/greenpages-banner.png` (or upload via `lovable-assets` CLI if we want CDN hosting — will use a local import for simplicity, matching how `greenyp-logo.png` is already imported).

2. **Update `src/components/PublicHeader.tsx`**
   - Remove the `Leaf` icon import and the `<Leaf>` element.
   - Remove the "GreenYP" text span.
   - Remove the tagline `<p>` (the banner already contains the tagline).
   - Replace the whole `<div className="flex flex-col">` block with a single `<Link to="/">` wrapping an `<img>` of the new banner.
   - Give the image a sensible responsive height (e.g. `h-16 md:h-20 w-auto`) and descriptive `alt="GreenPages - Your go-to directory for landscapers, gardeners, nurseries, and green industry professionals"`.
   - Keep the surrounding `<header>` and the `<CategoryNavigationBar />` untouched.

## Result

The header shows only the banner image (leaf + GreenPages wordmark + tagline), and clicking anywhere on it navigates to `/`.

## Notes / open considerations

- Only `PublicHeader.tsx` is changed. Other headers (`DashboardHeader`, `SubscribersHeader`, `ClassifiedsHeader`, `SignUpHeader`, `NoNavBarPublicHeader`) still use the Lucide Leaf + "GreenYP" wordmark. Let me know if you want those swapped too — not in scope for this plan.
- The banner says "GreenPages" while the rest of the app says "GreenYP". Per your earlier branding memory that's intentional (GreenPages for marketing surfaces), so no text change is planned.
