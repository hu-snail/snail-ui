# Slider · uni-app

`sn-slider` is the slider of `@snui/uni`: single knob or a two-knob range, with vertical orientation, a capsule theme, marks and a value bubble. easycom auto-registration (`components/sn-slider/sn-slider.vue` → `<sn-slider>`); geometry in `rpx`, colors from `--sn-mp-*` tokens. The track length is measured once on mount (`onMounted` → one `getBoundingClientRect`); call the exposed `initSlider()` after a layout change. No observer or timer is registered, so there is nothing to dispose.

## Basic usage

Single-knob slider: min / max / step drive the range and granularity; showExtremeValue renders both end captions.

<Demo name="slider-mp-basic" description="Single-knob slider: min / max / step drive the range and granularity; showExtremeValue renders both end captions." />

## Range, marks & theme (`range` / `marks` / `theme` / `disabled`)

`range` returns a `[start, end]` pair; `marks` accepts a record; `theme="capsule"` thickens the track; disabled blocks dragging.

<Demo name="slider-mp-range-theme" description="`range` returns a `[start, end]` pair; `marks` accepts a record; `theme=capsule` thickens the track; disabled blocks dragging." />

## Vertical track, value bubble, track colors & root styling (`vertical` / `popoverVisible` / `activeColor` / `inactiveColor` / `customClass` / `customStyle`)

`vertical` stands the track up; `popover-visible` takes `always` / `normal` / `never` for the value bubble; `active-color` / `inactive-color` override the filled / unfilled track colors; `custom-class` / `custom-style` land on the root.

<Demo name="slider-mp-vertical-popover-color" description="`vertical` stands the track up; `popoverVisible` takes always / normal / never; `activeColor` / `inactiveColor` override the track colors; `customClass` / `customStyle` land on the root." />

## Props

| Prop                            | Type                              | Default     | Description                                     |
| ------------------------------- | --------------------------------- | ----------- | ----------------------------------------------- |
| `modelValue`                    | `number \| number[]`              | `0`         | Value, or a `[start, end]` pair in `range` mode |
| `min` / `max`                   | `number`                          | `0` / `100` | Bounds                                          |
| `step`                          | `number`                          | `1`         | Snap granularity                                |
| `range`                         | `boolean`                         | `false`     | Two-knob mode                                   |
| `vertical`                      | `boolean`                         | `false`     | Vertical orientation                            |
| `theme`                         | `'default' \| 'capsule'`          | `'default'` | Track style                                     |
| `disabled`                      | `boolean`                         | `false`     | Blocks dragging                                 |
| `showExtremeValue`              | `boolean`                         | `false`     | Render the min / max captions                   |
| `popoverVisible`                | `'always' \| 'normal' \| 'never'` | `'normal'`  | Value bubble visibility                         |
| `marks`                         | `SliderMarks`                     | `undefined` | Tick marks (array or `{ value: label }`)        |
| `activeColor` / `inactiveColor` | `string`                          | `''`        | Active / inactive track colors                  |
| `customClass` / `customStyle`   | `string`                          | `''`        | Root class / inline style                       |

## Events

| Event                                | Description               | Payload                |
| ------------------------------------ | ------------------------- | ---------------------- |
| `update:modelValue`                  | Value changed             | `(value: SliderValue)` |
| `change`                             | Value changed (same tick) | `(value: SliderValue)` |
| `dragstart` / `dragmove` / `dragend` | Drag lifecycle            | `{ value }`            |

## Exposed API

| Member       | Signature    | Description                                |
| ------------ | ------------ | ------------------------------------------ |
| `initSlider` | `() => void` | Re-measure the track after a layout change |

## Slots

This component exposes no slots.

## Theme tokens

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
- Each knob is `role="button"` with an `aria-label` carrying its value; `tabindex="-1"` when disabled.

## Dark mode

Every color resolves through a `--sn-mp-*` token and there is no light literal fallback. Under `.sn-theme-dark` / `page.sn-theme-dark` the text, surfaces, borders and state colors flip automatically. Verify with:
