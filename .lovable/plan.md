## Goal

Make the date picker on `/dashboard/invoices` easier to use and lay out properly, while staying on the existing shadcn + react-day-picker stack (no new dependencies).

## Changes

### 1. `src/components/ui/calendar.tsx`
- Add `captionLayout="dropdown-buttons"` support with `fromYear` / `toYear` props passed through, so users can jump months and years quickly via dropdowns instead of clicking the month arrows.
- Add `pointer-events-auto` to the wrapper so the calendar is always interactive inside popovers.
- Style the new dropdowns to match the design system (green tokens, rounded, proper spacing) so they don't look like raw `<select>` elements.

### 2. `src/components/dashboard/payment/InvoiceDateRangeSelector.tsx`
- Replace the two separate single-date Popover+Calendar blocks with a single **range** calendar:
  - One trigger button showing `"Start – End"` (or "Pick a date range").
  - Inside the popover, render `<Calendar mode="range" numberOfMonths={2} captionLayout="dropdown-buttons" fromYear={currentYear - 10} toYear={currentYear} />`.
  - Wire `selected={{ from: startDate, to: endDate }}` and `onSelect` to update both `onStartDateChange` and `onEndDateChange` in one go.
- On smaller screens fall back to `numberOfMonths={1}` for proper layout.
- Keep the existing quick-range buttons (Last Month / 3 / 6 / 12 Months) and the Search button beside the range trigger.

### 3. Verify
- Open `/dashboard/invoices`, confirm:
  - The trigger button displays the chosen range cleanly.
  - Month + year dropdowns appear at the top of the calendar.
  - Range selection highlights properly.
  - Layout doesn't overflow the card on the current viewport.

## Out of scope
- No new dependencies.
- No changes to the admin invoice search (`InvoiceSearch.tsx`) — only the dashboard invoice page picker, as requested.
- No business-logic changes; `onDirectSearch` / quick-range behavior is preserved.
