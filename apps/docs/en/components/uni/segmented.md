# Segmented · uni-app

`sn-segmented` is the segmented control of `@snui/uni` (mobile / miniprogram / H5), used to switch between a few mutually exclusive options. Auto-registered via easycom; geometry uses `rpx` so it scales with the device.

## Basic usage

`v-model` binds the selected value; `options` accepts `string[]`, `number[]` or object entries:

<Demo name="segmented-mp-basic" description="v-model binds the selection; string options fall back to String(value) as the label." />

## Themes and disabled states

`theme="outline"` switches to the outlined look; both option-level `disabled` and the control-level flag block taps:

<Demo name="segmented-mp-theme" description="theme=outline gives the outlined look; object options carry custom labels; the control-level disabled flag blocks the whole segmented control." />

## The wot-ui `value` spelling

`value` is wot-ui's name for the selected value; this component calls it `modelValue`. Both are accepted and `value` wins when both are passed, so a component migrated from wd-segmented keeps working. The event name stays `update:modelValue`:

<Demo name="segmented-mp-value" description="`:value` alias with `@update:model-value`; value wins over model-value; vibrate-short haptics." />

## Event-name difference and root styling

**The prop name is aligned, the event name is not**: the `value` alias accepts the wot-ui spelling, but the component only emits `update:modelValue`, so a wot-ui-style `@update:value` listener never fires — the thumb moves (internal state) while the parent ref does not update. When migrating, change `@update:value` to `@update:model-value` (or use `v-model`). `customClass` / `customStyle` both land on the root node; the latter replaces the component's own fill and radius.

<Demo name="segmented-mp-value-alias" description="`:value` + `@update:value` (stays out of sync) versus `@update:model-value` (in sync); customClass frame; customStyle overriding fill and radius." />

## Auto registration (easycom)

The component follows the easycom convention, so **no import is needed in a template**:

```vue
<sn-segmented v-model="period" :options="['day', 'week', 'month']" />
```

For an explicit import:

```ts
import { SnSegmented } from '@snui/uni/components/sn-segmented/sn-segmented.vue';
```

## Props

| Prop           | Type                                        | Default     | Description                                                                       |
| -------------- | ------------------------------------------- | ----------- | --------------------------------------------------------------------------------- |
| `modelValue`   | `string \| number`                          | `undefined` | Selected value                                                                    |
| `value`        | `string \| number`                          | `undefined` | wot-ui's name for the selected value; wins over `modelValue` when both are passed |
| `disabled`     | `boolean`                                   | `false`     | Disable the whole control                                                         |
| `options`      | `string[] \| number[] \| SegmentedOption[]` | `[]`        | Option list                                                                       |
| `theme`        | `'card' \| 'outline'`                       | `'card'`    | Visual theme                                                                      |
| `vibrateShort` | `boolean`                                   | `false`     | Short vibration on switch                                                         |
| `customClass`  | `string`                                    | `''`        | Extra class on the root node                                                      |
| `customStyle`  | `string`                                    | `''`        | Inline style on the root node                                                     |

`SegmentedOption` shape: `{ value: string | number, label?: string, disabled?: boolean, payload?: unknown }`.

## Events

| Event               | Description                              | Payload                     |
| ------------------- | ---------------------------------------- | --------------------------- |
| `update:modelValue` | Selected value changed                   | `(value: string \| number)` |
| `change`            | Option switched                          | `(option: SegmentedOption)` |
| `click`             | Option tapped (including the active one) | `(option: SegmentedOption)` |

## Slots

| Slot    | Description                             |
| ------- | --------------------------------------- |
| `label` | Custom option label; scope `{ option }` |

## Theme variables

| Variable                                  | Purpose                         |
| ----------------------------------------- | ------------------------------- |
| `--sn-mp-color-background-subtle`         | `card` theme track              |
| `--sn-mp-color-background-surface`        | Slider and card option surface  |
| `--sn-mp-color-border-default`            | `outline` border and dividers   |
| `--sn-mp-color-text-secondary`            | Inactive option label           |
| `--sn-mp-color-text-disabled`             | Disabled option label           |
| `--sn-mp-color-action-primary`            | Active label and `outline` fill |
| `--sn-mp-color-text-on-primary`           | `outline` active label          |
| `--sn-mp-font-size-md`                    | Option label size               |
| `--sn-mp-font-weight-medium`              | Active label weight             |
| `--sn-mp-radius-md` / `--sn-mp-radius-sm` | Track / slider radius           |
| `--sn-mp-spacing-1` / `--sn-mp-spacing-3` | Track padding / option padding  |

## Accessibility

- The root is `role="group"` and every option is `role="button"`.
- `aria-pressed` reflects selection; `aria-disabled` merges the option and control flags.
- The short vibration calls `uni.vibrateShort`; hosts without it (H5) skip silently and the tap still works.
- Mobile only: interaction is `tap`; miniprogram has no keyboard focus.

## Dark mode

Every colour in `sn-segmented` comes from `--sn-mp-color-*` with no light `var()` fallback, so it adapts automatically under `.sn-theme-dark`: the track flips to the dark subtle surface, the slider to the dark elevated surface, the active label keeps the brand hue, and the `outline` fill stays the same brand colour (still recognisable on a near-black page).

Verify it by wrapping in sn-config-provider 的 theme 设为 dark:

## Related

- Tabs: [`sn-tabs`](/en/components/uni/tabs)
- Side navigation: [`sn-sidebar`](/en/components/uni/sidebar)
- Radio group: [`sn-radio`](/en/components/uni/radio)
