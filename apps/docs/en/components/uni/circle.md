# Circle · uni-app

`sn-circle` is the circular progress ring of `@snui/uni` (mobile / miniprogram / H5): a 0–100 value mapped to an arc with a centre label. **The rendering differs from wot-ui**: the ring is a CSS `conic-gradient` behind a mask rather than SVG `stroke-dasharray`, because miniprogram targets do not guarantee an inline-SVG host for arbitrary shapes. Auto-registered through easycom (`components/sn-circle/sn-circle.vue` → `<sn-circle>`); geometry uses `rpx`.

> **Not implemented**
>
> - `stroke-linecap` (`butt` / `round` / `square`): a conic arc has no caps, so the prop is accepted for parity only and does not change the rendering.

## Basic usage

`modelValue` is clamped to 0–100; numeric `size` / `strokeWidth` are treated as rpx, strings pass through.

<Demo name="circle-mp-basic" description="0 / 30 / 70 / 100, three sizes and a live +/- control." />

## Colors and shapes

`color` accepts a solid string or a `{ offset: color }` gradient map; `layerColor` changes the track, `fill` paints an inner disc, `clockwise=false` sweeps the other way.

<Demo name="circle-mp-color" description="Status colors / gradient / custom track and disc / counter-clockwise." />

## Animation speed and custom styles

`speed` is "percent per second" and `0` disables the transition; `strokeLinecap` is declared for parity only (a conic sweep has no caps); `customClass` / `customStyle` land on the root node.

<Demo name="circle-mp-custom" description="speed=0 / 200 / 10 transitions, the three stroke-linecap values, plus a root class and inline style." />

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| modelValue | number | 0 | Progress, 0–100 (clamped) |
| size | number \| string | 120 | Ring diameter (bare number = rpx) |
| color | string \| Record<string, string> | '' | Solid color, or a `{ offset: color }` gradient map |
| layerColor | string | '' | Track color |
| fill | string | '' | Inner disc color; empty renders a hollow ring |
| speed | number | 50 | Animation speed in percent per second; `0` disables the transition |
| text | string | '' | Centre text; empty shows the rounded percentage |
| strokeWidth | number \| string | 18 | Ring thickness (bare number = rpx) |
| strokeLinecap | 'butt' \| 'round' \| 'square' | 'round' | Stroke cap (parity only; inert) |
| clockwise | boolean | true | Sweep clockwise or counter-clockwise |
| customClass | string | '' | Custom class for the root node |
| customStyle | string | '' | Custom inline style for the root node |

## Events

None — the component is presentational.

## Slots

| Slot | Description |
| --- | --- |
| default | Custom centre content (replaces `text` / the percentage) |

## Theme variables

| Variable | Purpose |
| --- | --- |
| --sn-mp-color-action-primary | Default sweep color |
| --sn-mp-color-background-subtle | Track color |
| --sn-mp-color-text-primary | Centre text |
| --sn-mp-font-size-lg | Centre text size |
| --sn-mp-font-weight-medium | Centre text weight |
| --sn-mp-font-line-height-tight | Centre text line height |

## Accessibility

- Root: `role="progressbar"` + `aria-valuenow` / `aria-valuemin` / `aria-valuemax`
- `aria-label` mirrors the rendered centre text
- Track / arc / disc nodes are `aria-hidden="true"`
- No keyboard interaction (read-only indicator)

## Dark mode

The track and text colors come from semantic tokens (`--sn-mp-color-background-subtle` / `--sn-mp-color-text-primary`) and the default sweep uses `--sn-mp-color-action-primary`; all are overridden in the dark block of `@snui/tokens-mp/styles`, so it adapts automatically. Verify with sn-config-provider 的 theme 设为 dark:


> A literal passed through `color` / `layerColor` / `fill` does not flip with the theme — prefer `var(--sn-mp-*)` colors in dark mode.

## Related

- Linear progress bar: [`sn-progress`](/en/components/uni/progress)
- Number roll-up: [`sn-count-to`](/en/components/uni/count-to)
