# Progress · Web

Displays the current progress of an operation or task, in line, circle,
or multiple-circle shape.

## When to use

- Show the completion percentage of a task (upload, loading, steps).
- Running tasks need a striped animation to signal "still processing".
- A set of related metrics needs multi-ring comparison with a legend.

## Basic

<Demo name="progress-web-basic" description="Line / indicator placement / status colors / processing stripes." />

### Circle & multiple-circle

Circles are drawn as SVG rings; `offsetDegree` sets the start angle. The
multiple-circle shape renders a color legend below the rings.

<Demo name="progress-web-circle" description="Circle / multiple-circle with legend / success & error glyphs." />

## API

### SnProgress Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| type | `'line' \| 'circle' \| 'multiple-circle'` | `'line'` | Progress shape |
| percentage | `number \| number[]` | `0` | Value(s), clamped to 0–100; array for multiple-circle |
| height | `number \| string` | `undefined` | Line rail height; number = px |
| borderRadius | `number \| string` | `undefined` | Line rail radius |
| fillBorderRadius | `number \| string` | `undefined` | Line fill radius; falls back to `borderRadius` |
| strokeWidth | `number` | `6` | Circle stroke width (px) |
| indicatorPlacement | `'inside' \| 'outside' \| 'top'` | `'outside'` | Indicator placement (line only) |
| color | `string \| { color, stop? }[] \| (percentage) => string` | `undefined` | Fill color: solid / gradient / function; overrides `status` |
| railColor | `string \| { color, stop? }[]` | `undefined` | Rail color |
| showIndicator | `boolean` | `true` | Render the indicator |
| status | `'default' \| 'success' \| 'error' \| 'info' \| 'warning'` | `'default'` | Drives default fill color and circle glyph |
| processing | `boolean` | `false` | Striped fill animation (line) / pulsing arc (circle) |
| offsetDegree | `number` | `0` | Circle start-angle offset (0 = 12 o'clock) |

### SnProgress Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| default | `{ percentage }` | Custom indicator content |
| icon | — | Custom circle success / error glyph |

No events. Status colors: success → `--sn-web-color-feedback-success`,
error → danger, warning → warning, info → info, default →
`--sn-web-color-action-primary`. Metrics: rail 8px, radius 6px, circle
stroke 6px, circle size 120px, indicator font 14px.

## Tokens

| Token | Purpose |
| --- | --- |
| `--sn-web-color-action-primary` | Default fill |
| `--sn-web-color-feedback-success / -danger / -info / -warning` | Status fills and glyphs |
| `--sn-web-color-background-subtle` | Rail color |
| `--sn-web-color-text-secondary` | Indicator text |
| `--sn-web-color-text-on-primary` | Indicator inside the fill |

## Accessibility

- Line / circle: root carries `role="progressbar"` with
  `aria-valuemin` / `aria-valuemax` / `aria-valuenow`.
- Multiple-circle: root carries `role="img"` + `aria-label` summary.
- Decorative SVG parts are `aria-hidden="true"`.

## AI Patch Boundary

- Patches may change `percentage` / `status` / `type` / `color`.
- Indicator and glyph support slots; patches must not rewrite the
  internal SVG structure.
- Out-of-range percentages are clamped silently.

See the component `ai-description.md` for the full contract.
