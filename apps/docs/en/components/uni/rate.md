# Rate · uni-app

`sn-rate` is the rating component of `@snui/uni`: a row of tappable icons with half-star support, per-icon colors and clear-on-re-tap. easycom auto-registration (`components/sn-rate/sn-rate.vue` → `<sn-rate>`); geometry in `rpx`, colors from `--sn-mp-*` tokens. A half star is not an extra glyph — the same icon is clipped to 50% width and overlaid on the inactive one.

## Basic usage

Basic sn-rate: `num` sets the icon count, tapping an icon writes `v-model`.

<Demo name="rate-mp-basic" description="Basic sn-rate: `num` sets the icon count, tapping an icon writes `v-model`." />

## Half stars, clearing & colors (`allowHalf` / `clearable` / `activeColor`)

`allowHalf` selects half stars; `clearable` clears back to null on re-tap; `activeColor` accepts a per-icon array; readonly blocks taps.

<Demo name="rate-mp-half-color" description="`allowHalf` selects half stars; `clearable` clears back to null on re-tap; `activeColor` accepts a per-icon array; readonly blocks taps." />

## Gap, icons & full-row spread (`space` / `icon` / `activeIcon` / `iconPrefix` / `block`)

`space` sets the gap between icons (a number is an rpx design value ×2); `icon` / `active-icon` are sn-icon registry names; `icon-prefix` is parity only; `block` spreads the icons across the full row.

<Demo name="rate-mp-icon-space" description="`space` sets the icon gap; `icon` / `activeIcon` resolve through the sn-icon registry; `iconPrefix` is parity only; `block` spreads the icons across the row." />

## Custom glyphs, disabled & root styling (`cssIcon` / `disabled` / `customClass` / `customStyle`)

A string `css-icon` applies that class verbatim to the glyph node; the boolean form applies both `icon` and `active-icon`; `disabled` blocks taps; `custom-class` / `custom-style` land on the root.

<Demo name="rate-mp-css-icon-disabled" description="A string `cssIcon` renders as a bare class and the boolean form applies both names; `disabled` blocks taps; `customClass` / `customStyle` land on the root." />

## Props

| Prop                          | Type                 | Default     | Description                         |
| ----------------------------- | -------------------- | ----------- | ----------------------------------- |
| `modelValue`                  | `number \| null`     | `null`      | Current score                       |
| `num`                         | `number`             | `5`         | Number of icons                     |
| `readonly`                    | `boolean`            | `false`     | Render-only mode                    |
| `size`                        | `string \| number`   | `undefined` | Icon size (px design units)         |
| `space`                       | `string \| number`   | `undefined` | Gap between icons                   |
| `color`                       | `string`             | `''`        | Inactive color                      |
| `activeColor`                 | `string \| string[]` | `''`        | Active color, or one per icon       |
| `icon` / `activeIcon`         | `string`             | `'star'`    | Registry icon names                 |
| `iconPrefix`                  | `string`             | `''`        | Parity only (informational)         |
| `cssIcon`                     | `boolean \| string`  | `false`     | Treat the icon names as CSS classes |
| `disabled`                    | `boolean`            | `false`     | Disables every icon                 |
| `allowHalf`                   | `boolean`            | `false`     | Half-star selection                 |
| `clearable`                   | `boolean`            | `false`     | Re-tap clears back to `null`        |
| `block`                       | `boolean`            | `false`     | Stretch across the row              |
| `customClass` / `customStyle` | `string`             | `''`        | Root class / inline style           |

## Events

| Event               | Description               | Payload                   |
| ------------------- | ------------------------- | ------------------------- |
| `update:modelValue` | Score changed             | `(value: number \| null)` |
| `change`            | Score changed (same tick) | `{ value }`               |

## Slots

This component exposes no slots.

## Theme tokens

| Token                            | Purpose               |
| -------------------------------- | --------------------- |
| `--sn-mp-color-feedback-warning` | Default active star   |
| `--sn-mp-color-text-disabled`    | Default inactive star |
| `--sn-mp-spacing-2`              | Default icon gap      |

## Accessibility

- Root is `role="slider"` with `aria-valuemin` / `aria-valuemax` / `aria-valuenow` plus `aria-readonly` / `aria-disabled`.
- Each icon is `role="button"` with `aria-pressed`; `tabindex` drops to `-1` when blocked.

## Dark mode

Every color resolves through a `--sn-mp-*` token and there is no light literal fallback. Under `.sn-theme-dark` the text, surfaces, borders and state colors flip automatically. Verify with:
