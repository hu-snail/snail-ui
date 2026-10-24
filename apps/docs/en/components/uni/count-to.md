# CountTo · uni-app

`sn-count-to` is the number roll-up of `@snui/uni` (mobile / miniprogram / H5): it tweens from `startVal` to `endVal` with thousands separators, decimals, prefix / suffix and an easing curve. **The tween runs on `setInterval` (~16ms)** because `requestAnimationFrame` is not guaranteed on every miniprogram target. Auto-registered through easycom (`components/sn-count-to/sn-count-to.vue` → `<sn-count-to>`); geometry uses `rpx`.

## Basic usage

`startVal` / `endVal` / `duration` drive the tween; `prefix` / `suffix` wrap the number, `decimals` + `decimal` control the fraction, `separator` controls the thousands mark.

<Demo name="count-to-mp-basic" description="Basic tween, currency prefix, decimals and a custom separator." />

## Type colors and controls

`type` provides five text colors: `default` / `primary` / `success` / `warning` / `error`. With a `ref` on the instance you can call `start()` / `pause()` / `reset()`.

<Demo name="count-to-mp-type" description="Five type colors plus manual start / pause / reset." />

## Easing and custom classes

`useEasing` defaults to `true` and applies a cubic ease-out (`1 - (1 - t)^3`) so the number sprints then settles; `false` runs a linear tween with an even tick rate. `customClass` / `customStyle` apply to the root node.

<Demo name="count-to-mp-easing" description="The rhythm with use-easing on and off, plus customClass / customStyle." />

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| color | string | '' | Text color override |
| type | 'default' \| 'primary' \| 'success' \| 'warning' \| 'error' | 'default' | Semantic text theme |
| startVal | number | 0 | Start value |
| endVal | number | 2024 | End value |
| duration | number | 3000 | Tween duration in ms |
| autoStart | boolean | true | Start automatically |
| decimals | number | 0 | Decimal places to keep |
| decimal | string | '.' | Decimal separator |
| separator | string | ',' | Thousands separator |
| prefix | string | '' | Text before the number |
| suffix | string | '' | Text after the number |
| useEasing | boolean | true | Use the easing curve |
| customClass | string | '' | Custom class for the root node |
| customStyle | string | '' | Custom inline style for the root node |

Exposed methods: `start()` / `pause()` / `reset()`.

## Events

| Event | Description | Payload |
| --- | --- | --- |
| mounted | Component mounted (parity with the reference) | — |
| finish | The tween reached `endVal` | — |

## Slots

None.

## Theme variables

| Variable | Purpose |
| --- | --- |
| --sn-mp-color-text-primary | `type="default"` text |
| --sn-mp-color-action-primary | `type="primary"` text |
| --sn-mp-color-feedback-success` / `-warning` / `-danger | `type="success"` / `warning` / `error` text |
| --sn-mp-font-size-md | Text size |
| --sn-mp-font-line-height-normal | Text line height |

## Accessibility

- Root: `role="status"` + `aria-live="polite"` + `aria-label` mirroring the rendered text

## Dark mode

All five type colors come from semantic tokens (`--sn-mp-color-text-primary` / `--sn-mp-color-action-primary` / `--sn-mp-color-feedback-*`), all overridden in the dark block of `@snui/tokens-mp/styles`, so it adapts automatically. Verify with sn-config-provider 的 theme 设为 dark:


> A literal passed through `color` does not flip with the theme — prefer `var(--sn-mp-*)` colors in dark mode.

## Related

- Countdown: [`sn-count-down`](/en/components/uni/count-down)
- Circular progress: [`sn-circle`](/en/components/uni/circle)
