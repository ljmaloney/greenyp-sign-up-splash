## Goal

Improve the `/dashboard/invoices` date range selector so it looks intentional, professional, and easy to understand—not like default calendar widgets dropped into a card.

## Planned changes

### 1. Redesign the date range card
- Turn the plain card into a stronger “Billing period” control panel with better hierarchy.
- Add concise supporting text under the title so users understand the purpose immediately.
- Use green-accented design-system tokens, subtle border treatment, and cleaner spacing.
- Keep the existing quick range actions, but restyle them as segmented preset chips instead of generic outline buttons.

### 2. Improve the range trigger
- Replace the basic full-width button with a more informative range field:
  - Calendar icon in a small accent container.
  - Clear label such as “Invoice period”.
  - Prominent selected range text.
  - Muted helper text when the range is incomplete.
- Keep the Search button aligned with the field and visually primary only when a complete date range is selected.

### 3. Polish the calendar popover
- Add popover padding, rounded corners, border, and shadow so it feels like a designed date picker surface.
- Improve month/year dropdown styling inside `src/components/ui/calendar.tsx` so the dropdowns do not look raw or cramped.
- Improve range styles:
  - Selected endpoints use primary green.
  - Range middle uses a softer green accent.
  - Today and hover states remain visible without fighting the selected range.
- Keep the responsive behavior: two months on desktop, one month on mobile.

### 4. Preserve behavior
- No new datepicker dependency.
- Keep the existing quick ranges: Last Month, Last 3 Months, Last 6 Months, Last 12 Months.
- Preserve existing invoice search behavior and callbacks.
- Only target the dashboard invoice date range selector and shared calendar styling needed for it.

### 5. Verify
- Check the `/dashboard/invoices` component styling at desktop width.
- Check that the popover no longer looks cramped or unstyled.
- Confirm the range selection still updates start/end dates and the Search button remains disabled until both dates are selected.
