## What's actually wrong

The runtime preview renders (homepage with the GreenYP logo loads). The "broken" symptom is the long list of TypeScript build errors that block the production build and surface as red overlays. They fall into two groups:

1. **shadcn/ui template files written for older library versions** — `react-resizable-panels` was upgraded to v4 (renamed exports), `react-day-picker` to v9 (new component API), `recharts` to v3 (Tooltip prop typing changed).
2. **App-level type drift** — a few components/hooks pass props that no longer match the current type definitions.

## Fixes

### 1. `src/components/ui/resizable.tsx` — react-resizable-panels v4 rename
v4 exports `Group`, `Panel`, `Separator` (not `PanelGroup` / `PanelResizeHandle`). Update three references:
- `ResizablePrimitive.PanelGroup` → `ResizablePrimitive.Group`
- `ResizablePrimitive.PanelResizeHandle` → `ResizablePrimitive.Separator`
- `ResizablePrimitive.Panel` stays the same.

### 2. `src/components/ui/calendar.tsx` — react-day-picker v9
v9 replaced `IconLeft` / `IconRight` with a single `Chevron` component. Replace the `components` prop:
```ts
components={{
  Chevron: ({ orientation }) =>
    orientation === "left"
      ? <ChevronLeft className="h-4 w-4" />
      : <ChevronRight className="h-4 w-4" />,
}}
```

### 3. `src/components/ui/chart.tsx` — recharts v3 Tooltip typing
Recharts v3 typed `payload` as `unknown`. Cast the tooltip render-prop arg locally:
- Type the destructured `{ active, payload, label, ... }` via an explicit `any` (or `TooltipProps<any, any>`) at the forwardRef signature so `payload.length` and `payload.map` type-check.
- For the `Legend content` callback (~line 262), cast the `payload` prop the same way.

This is the lowest-risk fix; the runtime shape hasn't changed.

### 4. `src/components/payment/SquareErrorBoundary.tsx` — `process` not defined
In a Vite browser bundle `process` isn't available without `@types/node`. Replace `process.env.NODE_ENV === 'development'` with `import.meta.env.DEV`.

### 5. `src/hooks/useLocationForm.ts` — missing `LocationFormData` fields
`getInitialFormData()` is missing `emailAddress`, `cellPhoneNumber`, `phoneNumber`, `title`, and 4 others required by `LocationFormData`. Read `src/types/location.ts`, then add empty-string defaults for every required field so the literal satisfies the type.

### 6. `src/components/dashboard/location/LocationGroup.tsx` — missing `contacts` prop
`ContactCard` now requires a `contacts` array. Pass the surrounding `locationContacts` (already in scope at line 76) as `contacts={locationContacts}`.

### 7. `src/components/dashboard/location/LocationsDialogManager.tsx` — callback type mismatch
`EditLocationDialog`'s `onLocationUpdated` expects `(location: LocationFormData) => void` but the parent passes `(updatedLocation: Location) => void`. Wrap the parent callback so it receives `LocationFormData` and converts/forwards as needed — or, if the parent really wants the full `Location`, change `EditLocationDialog`'s prop type to accept `Location`. Pick whichever matches existing call sites after reading both files.

## Verification

After the edits:
1. Read the dev-server log — confirm no module-resolution errors from the resizable/calendar changes.
2. Re-navigate the browser to the sandbox and screenshot the homepage to confirm the preview still renders.
3. Confirm the build-error list returned with the next tool response is empty (or only contains errors unrelated to the seven files above).

## Out of scope

- The `Failed to fetch http://localhost:8081/reference/lob` and `services.greenyp.com` CORS errors are expected (external API not reachable from the preview sandbox). Not touching those.
- No design or feature changes — only making existing code compile against the current dependency versions.
