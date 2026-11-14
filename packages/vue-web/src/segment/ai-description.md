# SnSegment — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end segmented control.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

A segmented control for picking one value from a small set of mutually
exclusive options. A sliding thumb indicator animates behind the selected
item (items are content-sized, so text and icon-only items both work);
supports three sizes, a transparent `ghost` variant, root / per-item
disabling, and optional separators that hide next to the selection.

## Reference Library

Per the component header, the API surface mirrors heroui.pro `Segment`
(https://heroui.pro/docs/react/components/segment). The reference's
`Segment.Item` children and `Segment.Separator` elements flatten into the
`options` array + `separators` switch; per-item AUI addition: `ariaLabel`.

## Import

```ts
import SnSegment from '@snui/vue-web/src/segment/SnSegment.vue';
```

## Props

| Name           | Type                                                       | Default     | Required | Description                                                                |
| -------------- | ---------------------------------------------------------- | ----------- | -------- | -------------------------------------------------------------------------- |
| `options`      | `SnSegmentOption[]`                                        | —           | yes      | Items: `{ value, label?, icon?, disabled?, ariaLabel? }`.                   |
| `modelValue`   | `string \| number`                                         | `undefined` | no       | Selected key (v-model). Omit for uncontrolled mode.                         |
| `defaultValue` | `string \| number`                                         | `undefined` | no       | Initial key for the uncontrolled mode.                                      |
| `size`         | `'sm' \| 'md' \| 'lg'`                                     | `'md'`      | no       | Total heights 28 / 32 / 40 px.                                              |
| `variant`      | `'default' \| 'ghost'`                                     | `'default'` | no       | `ghost` = transparent shell + accent-tinted indicator.                      |
| `disabled`     | `boolean`                                                  | `false`     | no       | Disables every item (root `aria-disabled`).                                 |
| `separators`   | `boolean`                                                  | `false`     | no       | Dividers between adjacent unselected items (hidden next to the selection).  |

## Events

| Name              | Parameters              | Description                                    |
| ----------------- | ----------------------- | ---------------------------------------------- |
| `update:modelValue` | `SnSegmentKey`        | Selection change — supports `v-model`.         |
| `change`          | `SnSegmentKey`          | Selection change (listener-style alias).       |

## Slots

None — items are declared through `options` (`icon` takes a component,
`label` renders text). Custom item markup is out of scope by design.

## Accessibility

- Root `role="radiogroup"`; items `role="radio"` + `aria-checked`.
- Roving tabindex; Arrow keys cycle enabled items, Home / End jump to the
  first / last enabled item; keyboard selection moves focus.
- Item accessible name = `ariaLabel ?? label`; give icon-only items an
  `ariaLabel`.
- Disabled items get the native `disabled` attribute and are skipped by
  keyboard navigation.

## AI Patch Boundary

| Field                 | Patchable | Notes                                          |
| --------------------- | --------- | ---------------------------------------------- |
| `options[].value`     | yes       | Stable identity — never reuse a key for new data. |
| `options[].label`     | yes       | Display text.                                  |
| `options[].icon`      | yes       | Component reference (not a schema-safe string).  |
| `options[].disabled`  | yes       | Per-item disable.                              |
| `modelValue`          | yes       | Must equal one `options[].value`.              |
| `defaultValue`        | yes       | Uncontrolled initial key.                      |
| `size`                | yes       | `sm` / `md` / `lg`.                            |
| `variant`             | yes       | `default` / `ghost`.                           |
| `disabled`            | yes       | Root disable.                                  |
| `separators`          | yes       | Boolean switch.                                |

## Token Dependency

`--sn-web-color-background-subtle` (shell), `--sn-web-color-background-surface`
(thumb), `--sn-web-color-text-primary` / `-secondary` (labels),
`--sn-web-color-action-primary` / `-soft` (ghost indicator + focus ring),
`--sn-web-color-border-subtle` (separators).
