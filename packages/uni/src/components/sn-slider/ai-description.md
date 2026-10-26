# sn-sn-slider — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end Single / range slider driven by touch drag, with snapping, marks and a value bubble..
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Single / range slider driven by touch drag, with snapping, marks and a value bubble.

## Reference Library

Per AGENTS.md §112, the API surface mirrors wot-ui `wd-slider`
(https://wot-ui.cn/component/slider.html). New props added here MUST also be
added to the parity list.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-slider v-model="value" :min="0" :max="100" :step="5" show-extreme-value />
```

```ts
import SnSlider from '@snui/uni-src/components/sn-slider/sn-slider.vue';
import type { SliderMarks, SliderValue } from '@snui/uni-src/components/sn-slider/sn-slider-types';
```

## Props

| Name                            | Type                              | Default     | Description                                      |
| ------------------------------- | --------------------------------- | ----------- | ------------------------------------------------ |
| `modelValue`                    | `number \| number[]`              | `0`         | Value, or a `[start, end]` pair in `range` mode. |
| `min` / `max`                   | `number`                          | `0` / `100` | Bounds.                                          |
| `step`                          | `number`                          | `1`         | Snap granularity.                                |
| `range`                         | `boolean`                         | `false`     | Two-knob mode.                                   |
| `vertical`                      | `boolean`                         | `false`     | Vertical orientation.                            |
| `theme`                         | `'default' \| 'capsule'`          | `'default'` | Track style.                                     |
| `disabled`                      | `boolean`                         | `false`     | Blocks dragging.                                 |
| `showExtremeValue`              | `boolean`                         | `false`     | Render the min / max captions.                   |
| `popoverVisible`                | `'always' \| 'normal' \| 'never'` | `'normal'`  | Value bubble visibility.                         |
| `marks`                         | `SliderMarks`                     | `undefined` | Tick marks (array or `{ value: label }`).        |
| `activeColor` / `inactiveColor` | `string`                          | `''`        | Track colors (CSS colors).                       |
| `customClass` / `customStyle`   | `string`                          | `''`        | Root forwarding.                                 |

## Events

| Name                                 | Payload                | When                       |
| ------------------------------------ | ---------------------- | -------------------------- |
| `update:modelValue`                  | `(value: SliderValue)` | Value changed.             |
| `change`                             | `(value: SliderValue)` | Value changed (same tick). |
| `dragstart` / `dragmove` / `dragend` | `{ value }`            | Drag lifecycle.            |

## Exposed API

| Member       | Signature    | Description                                 |
| ------------ | ------------ | ------------------------------------------- |
| `initSlider` | `() => void` | Re-measure the track after a layout change. |

## Tokens Consumed (end: mp)

| Token                               | Purpose                 |
| ----------------------------------- | ----------------------- |
| `--sn-mp-color-background-sunken`   | Inactive track          |
| `--sn-mp-color-action-primary`      | Active track / scale    |
| `--sn-mp-color-background-elevated` | Knob plate              |
| `--sn-mp-color-text-primary`        | Bubble background       |
| `--sn-mp-color-text-on-primary`     | Bubble text             |
| `--sn-mp-color-text-tertiary`       | Extreme / mark captions |
| `--sn-mp-color-border-default`      | Inactive scale tick     |
| `--sn-mp-radius-full`               | Track + knob rounding   |
| `--sn-mp-shadow-sm`                 | Knob shadow             |

## Accessibility

- The track is `role="slider"` with `aria-valuemin` / `aria-valuemax` / `aria-valuenow` / `aria-orientation` / `aria-disabled`.
- Each knob is `role="button"` with an `aria-label` carrying its value; `tabindex` drops to `-1` when disabled.

## Versioning

`@snui/uni@0.5.0` — initial release.
