# sn-sn-input-number — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end Numeric stepper with an editable field: clamps into `min` / `max`, snaps onto the `step` grid when `stepStrictly` is on, rounds to `precision`, and asks `beforeChange` for permission before every commit..
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Numeric stepper with an editable field: clamps into `min` / `max`, snaps onto the `step` grid when `stepStrictly` is on, rounds to `precision`, and asks `beforeChange` for permission before every commit.

## Reference Library

Per AGENTS.md §112, the API surface mirrors wot-ui `wd-input-number`
(https://wot-ui.cn/component/input-number.html). New props added here MUST also be
added to the parity list.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-input-number v-model="qty" :min="1" :max="99" />
```

```ts
import SnInputNumber from '@snui/uni-src/components/sn-input-number/sn-input-number.vue';
```

## Props

| Name                                            | Type                                                     | Default                   | Description                                     |
| ----------------------------------------------- | -------------------------------------------------------- | ------------------------- | ----------------------------------------------- |
| `modelValue`                                    | `number \| string`                                       | `0`                       | Bound value.                                    |
| `min`                                           | `number`                                                 | `1`                       | Lower bound.                                    |
| `max`                                           | `number`                                                 | `Number.MAX_SAFE_INTEGER` | Upper bound.                                    |
| `step`                                          | `number`                                                 | `1`                       | Increment / decrement step.                     |
| `stepStrictly`                                  | `boolean`                                                | `false`                   | Snap every value onto the step grid.            |
| `precision`                                     | `number \| string`                                       | `0`                       | Decimal places kept after a commit.             |
| `disabled`                                      | `boolean`                                                | `false`                   | Disables the whole stepper.                     |
| `disableInput` / `disableMinus` / `disablePlus` | `boolean`                                                | `false`                   | Per-part disable flags.                         |
| `withoutInput`                                  | `boolean`                                                | `false`                   | Hide the field, buttons only.                   |
| `inputWidth`                                    | `number \| string`                                       | `undefined`               | Field width; a number is an rpx design value.   |
| `allowNull`                                     | `boolean`                                                | `false`                   | Allow the field to hold an empty string.        |
| `placeholder`                                   | `string`                                                 | `''`                      | Placeholder for an empty field.                 |
| `adjustPosition`                                | `boolean`                                                | `true`                    | Auto-scroll when the keyboard covers the field. |
| `beforeChange`                                  | `(value) => boolean \| Promise<boolean>`                 | `undefined`               | Veto hook for every commit.                     |
| `longPress`                                     | `boolean`                                                | `false`                   | Repeat the step while a button is held.         |
| `immediateChange`                               | `boolean`                                                | `true`                    | Commit while typing; `false` commits on blur.   |
| `updateOnInit`                                  | `boolean`                                                | `true`                    | Emit a corrected value on mount.                |
| `inputType`                                     | `'number' \| 'digit'`                                    | `'digit'`                 | Native keyboard type.                           |
| `theme`                                         | `'default' \| 'outline' \| 'outline-split' \| 'primary' \| 'circle'` | `'default'`               | Visual theme (`circle` = AUI-additive gray pill with circular buttons). |
| `round`                                         | `boolean`                                                | `false`                   | Fully rounded action buttons.                   |
| `customClass` / `customStyle`                   | `string`                                                 | `''`                      | Root forwarding.                                |
| `buttonColor` (AUI additive)                    | `string`                                                 | `undefined`               | Action-button fill (CSS color / `var(--sn-mp-color-*)`); overrides every theme fill, glyph flips to on-primary. |

## Behavior Notes

- `longPress` pauses as soon as the held finger travels more than 8px from its
  start point (`touchmove`) — touch events keep firing on the press-start
  element after the finger leaves it, so without this the repeat counts on
  while the user drags elsewhere. A paused press restarts with a new touch.

## Events

| Name                | Payload                     | When                         |
| ------------------- | --------------------------- | ---------------------------- |
| `update:modelValue` | `(value: number \| string)` | Value committed.             |
| `change`            | `{ value }`                 | Value committed (same tick). |
| `focus`             | `{ value, height }`         | Field focused.               |
| `blur`              | `{ value }`                 | Field blurred.               |

## Tokens Consumed (end: mp)

| Token                                                          | Purpose                                      |
| -------------------------------------------------------------- | -------------------------------------------- |
| `--sn-mp-color-background-soft`                                | Segment fill (minus / field / plus), `circle` track |
| `--sn-mp-color-background-elevated`                            | `default` theme divider gap, `circle` button fill |
| `--sn-mp-color-text-primary`                                   | Field value                                  |
| `--sn-mp-color-text-secondary` / `--sn-mp-color-text-disabled` | Glyph colors (normal / at bounds, disabled)  |
| `--sn-mp-color-action-primary`                                 | `primary` plus fill + minus outline; `buttonColor` recommendation |
| `--sn-mp-color-text-on-primary`                                | `primary` plus glyph; `buttonColor` glyph    |
| `--sn-mp-color-border-default`                                 | `outline` border + `outline-split` divider   |
| `--sn-mp-radius-sm` / `--sn-mp-radius-full`                    | Segment corners / `round` + `circle` pill corners |
| `--sn-mp-spacing-3`                                            | Field segment horizontal padding             |
| `--sn-mp-font-size-md` / `--sn-mp-font-weight-medium`          | Field typography                             |

## Accessibility

- Root is `role="group"` with `aria-disabled`.
- Both action buttons are `role="button"` with `aria-label` ("increase" / "decrease") and `aria-disabled` + `tabindex="-1"` at the bounds.
- The field carries `aria-label` (the placeholder, else "number input").

## Versioning

`@snui/uni@0.5.0` — initial release.
