# sn-cascader — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end Tabbed hierarchical selector sheet. Drills through levels, confirms a leaf in static mode, or the whole path in lazy mode.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.
>
> Internal reference metadata (AGENTS.md §112.2a / §114.4 — never surfaces in
> the user-facing docs): reference library `wd-cascader`, prop surface mirrored
> 1:1 except the documented omission.

## Purpose

Tabbed hierarchical selector sheet. Drills through levels, confirms a leaf in static mode, or the whole path in lazy mode. Additive chrome: a toolbar return control, row drill / check glyphs, an empty-level hint and a `card` layout that renders every option as its own card.

## Reference Library

Per AGENTS.md §112, the API surface mirrors wot-ui `wd-cascader`
(https://wot-ui.cn/component/cascader.html). New props added here MUST also be
added to the parity list.

## Additive chrome (AUI-OPT-13, AGENTS.md §112.3a — wd-cascader has none)

- `card` — sheet-level layout switch: every option renders as its own card
  (radius / border / shadow / row gap from the same tokens sn-cell's `card`
  uses) instead of an edge-to-edge row with a hairline.
- Toolbar return control (ChevronLeft) steps the active level up one; it renders
  only once a level has been drilled into.
- Row tail affordance: ChevronRight on rows that lead to another level, Check on
  the selected row. Decorative (`aria-hidden`) — the row carries `aria-pressed`.
- Empty level renders a `role="status"` "暂无选项" hint instead of a blank panel.
- A tab for a level without a selection shows a muted "请选择" hint chip.
- Press feedback rides `hover-class` (§116.2 — the App side has no `:active`).

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-cascader v-model="value" v-model:visible="open" :options="tree" title="Area" card />
```

```ts
import SnCascader from '@snui/uni-src/components/sn-cascader/sn-cascader.vue';
import type { CascaderOption, CascaderLazyLoad } from '@snui/uni-src/components/sn-cascader/sn-cascader-types';
```

## Props

| Name                                                            | Type                                                          | Default                                                    | Description                                    |
| --------------------------------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------- |
| `modelValue`                                                    | `string \| number \| Array<...>`                              | `undefined`                                                | Leaf value, or a path array in lazy mode.      |
| `visible`                                                       | `boolean`                                                     | `false`                                                    | Sheet visibility.                              |
| `options`                                                       | `CascaderOption[]`                                            | `[]`                                                       | Option tree.                                   |
| `title`                                                         | `string`                                                      | `''`                                                       | Toolbar title.                                 |
| `beforeConfirm`                                                 | `({ value, selectedOptions }) => boolean \| Promise<boolean>` | `undefined`                                                | Veto hook.                                     |
| `checkStrictly`                                                 | `boolean`                                                     | `false`                                                    | Allow confirming any level.                    |
| `confirmText`                                                   | `string`                                                      | `'确认'`                                                   | Confirm label.                                 |
| `valueKey` / `textKey` / `childrenKey` / `tipKey` / `isLeafKey` | `string`                                                      | `'value'` / `'text'` / `'children'` / `'tip'` / `'isLeaf'` | Node keys.                                     |
| `lazyLoad`                                                      | `CascaderLazyLoad`                                            | `undefined`                                                | Async children loader.                         |
| `closeOnClickModal`                                             | `boolean`                                                     | `true`                                                     | Mask tap closes.                               |
| `zIndex` / `safeAreaInsetBottom`                                | `number` / `boolean`                                          | `15` / `true`                                              | Sheet placement.                               |
| `lineWidth` / `lineHeight`                                      | `number \| string`                                            | `undefined`                                                | Active-tab indicator size.                     |
| `lineTheme`                                                     | `'normal' \| 'text' \| 'underline' \| 'dot'`                  | `'normal'`                                                 | Indicator placement.                           |
| `card`                                                          | `boolean`                                                     | `false`                                                    | Card layout per option. Additive (AUI-OPT-13). |
| `customClass` / `customStyle`                                   | `string`                                                      | `''`                                                       | Root forwarding.                               |

## Events

| Name                | Payload                      | When                             |
| ------------------- | ---------------------------- | -------------------------------- |
| `update:modelValue` | `(value)`                    | Selection confirmed.             |
| `update:visible`    | `(value: boolean)`           | Sheet shown / hidden.            |
| `confirm`           | `{ value, selectedOptions }` | Confirmed.                       |
| `close`             | —                            | Sheet closed without confirming. |

## Not Implemented

`root-portal` — uni-app miniprograms have no portal host.

## Tokens Consumed (end: mp)

| Token                                                                   | Purpose                                      |
| ----------------------------------------------------------------------- | -------------------------------------------- |
| `--sn-mp-color-background-elevated`                                     | Sheet and card surface                       |
| `--sn-mp-color-background-soft` / `-subtle`                             | Tab plate and press feedback                 |
| `--sn-mp-color-action-primary` / `-soft`                                | Active tab / selected row / check glyph      |
| `--sn-mp-color-text-primary` / `-secondary` / `-tertiary` / `-disabled` | Text + disabled                              |
| `--sn-mp-color-border-subtle`                                           | Row and toolbar rules / card border          |
| `--sn-mp-radius-md` / `-lg` / `--sn-mp-radius-full`                     | Tab, action, card and return-control corners |
| `--sn-mp-shadow-sm`                                                     | Card shadow (`card`)                         |
| `--sn-mp-spacing-1` … `--sn-mp-spacing-4`                               | Toolbar / tab / row / card gaps              |
| `--sn-mp-font-size-xs` / `-sm` / `-md`                                  | Tip / tab and status labels / option text    |
| `--sn-mp-font-weight-semibold`                                          | Active tab / selected row / confirm          |

## Accessibility

- The tab strip is `role="tablist"`; each tab is `role="tab"` with `aria-selected`; a level without a selection shows a hint chip.
- Each option is `role="button"` with `aria-pressed` / `aria-disabled`.
- The toolbar return control and cancel / confirm are `role="button"` with an `aria-label`.
- Row drill / check glyphs are decorative (`aria-hidden`).
- The lazy loading state and the empty-level hint are `role="status"` (loading also `aria-live="polite"`).

## Versioning

`@snui/uni@0.5.0` — initial release.
