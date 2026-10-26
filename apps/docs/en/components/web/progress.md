# Progress · Web

Displays the current progress of an operation or task as a line, a ring, or
a set of concentric rings.

## When to use

- Show the completion percentage of a task (upload, download, steps).
- A running task needs a striped animation or a pulsing arc to signal
  "still processing".
- A set of related metrics needs multi-ring comparison with a legend.

## Demos

### Line and status colors

The line shape shows the percentage indicator to the right of the rail by
default; `status` drives the fill color and `processing` overlays the
scrolling stripes.

<Demo name="progress-web-basic" description="Line / status colors / indicator placement / processing stripes / custom indicator." />

### Indicator placement

`indicatorPlacement` only affects the line shape: `outside` sits right of
the rail, `inside` inside the fill, `top` above the rail. With
`showIndicator` set to `false` no indicator is rendered at all.

<Demo name="progress-web-indicator" description="outside / inside / top side by side + showIndicator off + default slot." />

### Processing and the four statuses

`processing` overlays moving stripes on the line and pulses the fill arc on
circles; the four statuses are success / error / warning / info. Circle
success and error states render a built-in glyph that the `icon` slot can
replace.

<Demo name="progress-web-processing" description="Processing stripes and pulsing arc / four statuses / custom glyph through the icon slot." />

### Driving the value at runtime

Step buttons, a slider and an auto-play timer change `percentage` live; the
status flips to success at 100% and to error at 0%.

<Demo name="progress-web-dynamic" description="Button steps / slider drag / auto-play (the timer is cleared on unmount)." />

### Circle

Circles are drawn as SVG rings; `offsetDegree` sets the start angle and
`strokeWidth` the ring thickness.

<Demo name="progress-web-circle" description="Circle / start angle / success and error glyphs / multiple-circle with legend." />

### Multiple circles

Passing an array to `percentage` switches to the multiple-circle shape;
a color array is mapped per ring index (the last color is reused past the
end) and a legend is rendered below the rings.

<Demo name="progress-web-multiple" description="Percentage array + per-ring colors + legend hidden." />

## API

### Props

All props are optional.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| type | `'line' \| 'circle' \| 'multiple-circle'` | `'line'` | Progress shape |
| percentage | `number \| number[]` | `0` | Value(s), clamped to 0–100; array for multiple-circle |
| height | `number \| string` | `undefined` | Line rail height; number = px |
| borderRadius | `number \| string` | `undefined` | Line rail radius |
| fillBorderRadius | `number \| string` | `undefined` | Line fill radius; falls back to `borderRadius` |
| strokeWidth | `number` | `6` | Circle stroke width (px) |
| indicatorPlacement | `'inside' \| 'outside' \| 'top'` | `'outside'` | Indicator placement (line only) |
| color | `string \| { color: string; stop?: number }[] \| (percentage: number) => string` | `undefined` | Fill color: solid / gradient / function; overrides `status` |
| railColor | `string \| { color: string; stop?: number }[]` | `undefined` | Rail color |
| showIndicator | `boolean` | `true` | Render the indicator and the multiple-circle legend |
| status | `'default' \| 'success' \| 'error' \| 'info' \| 'warning'` | `'default'` | Drives the default fill color and the circle glyph |
| processing | `boolean` | `false` | Striped fill (line) / pulsing fill arc (circle) |
| offsetDegree | `number` | `0` | Circle start-angle offset (0 = 12 o'clock) |

### Slots

| Name | Scope | Description |
| --- | --- | --- |
| default | `{ percentage: number }` | Custom indicator content; called per ring on multiple-circle |
| icon | — | Custom circle success / error glyph |

No events.

Status colors: success → `--sn-web-color-feedback-success`, error → danger,
warning → warning, info → info, default → `--sn-web-color-action-primary`.
Metrics: rail 8px, radius 6px, circle stroke 6px, circle size 120px, ring
gap 2px, indicator font 14px.

## Tokens

| Token | Purpose |
| --- | --- |
| `--sn-web-color-action-primary` | Default fill |
| `--sn-web-color-feedback-success / -danger / -info / -warning` | Status fills and glyphs |
| `--sn-web-color-background-subtle` | Rail color |
| `--sn-web-color-text-secondary` | Indicator text |
| `--sn-web-color-text-on-primary` | Indicator inside the fill |

## Accessibility

- Line / circle: the root carries `role="progressbar"` with
  `aria-valuemin` / `aria-valuemax` / `aria-valuenow`.
- Multiple-circle: the root carries `role="img"` + an `aria-label` summary.
- Decorative SVG parts are `aria-hidden="true"`.

## AI Patch Boundary

- Patches may change `percentage` / `status` / `type` / `color`.
- Indicator and glyph support slots; patches must not rewrite the internal
  SVG structure.
- Out-of-range percentages are clamped silently.

See the component `ai-description.md` for the full contract.
