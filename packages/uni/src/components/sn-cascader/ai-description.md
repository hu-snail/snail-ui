# sn-sn-cascader — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end Tabbed hierarchical selector sheet. Drills through levels, confirms a leaf in static mode, or the whole path in lazy mode..
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Tabbed hierarchical selector sheet. Drills through levels, confirms a leaf in static mode, or the whole path in lazy mode.

## Reference Library

Per AGENTS.md §112, the API surface mirrors wot-ui `wd-cascader`
(https://wot-ui.cn/component/cascader.html). New props added here MUST also be
added to the parity list.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-cascader v-model="value" v-model:visible="open" :options="tree" title="Area" />
```

```ts
import SnCascader from '@snui/uni-src/components/sn-cascader/sn-cascader.vue';
import type { CascaderOption, CascaderLazyLoad } from '@snui/uni-src/components/sn-cascader/sn-cascader-types';
```

## Props

| Name                                                            | Type                                                          | Default                                                    | Description                               |
| --------------------------------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------- | ----------------------------------------- |
| `modelValue`                                                    | `string \| number \| Array<...>`                              | `undefined`                                                | Leaf value, or a path array in lazy mode. |
| `visible`                                                       | `boolean`                                                     | `false`                                                    | Sheet visibility.                         |
| `options`                                                       | `CascaderOption[]`                                            | `[]`                                                       | Option tree.                              |
| `title`                                                         | `string`                                                      | `''`                                                       | Toolbar title.                            |
| `beforeConfirm`                                                 | `({ value, selectedOptions }) => boolean \| Promise<boolean>` | `undefined`                                                | Veto hook.                                |
| `checkStrictly`                                                 | `boolean`                                                     | `false`                                                    | Allow confirming any level.               |
| `confirmText`                                                   | `string`                                                      | `'确认'`                                                   | Confirm label.                            |
| `valueKey` / `textKey` / `childrenKey` / `tipKey` / `isLeafKey` | `string`                                                      | `'value'` / `'text'` / `'children'` / `'tip'` / `'isLeaf'` | Node keys.                                |
| `lazyLoad`                                                      | `CascaderLazyLoad`                                            | `undefined`                                                | Async children loader.                    |
| `closeOnClickModal`                                             | `boolean`                                                     | `true`                                                     | Mask tap closes.                          |
| `zIndex` / `safeAreaInsetBottom`                                | `number` / `boolean`                                          | `15` / `true`                                              | Sheet placement.                          |
| `lineWidth` / `lineHeight`                                      | `number \| string`                                            | `undefined`                                                | Active-tab indicator size.                |
| `lineTheme`                                                     | `'normal' \| 'text' \| 'underline' \| 'dot'`                  | `'normal'`                                                 | Indicator placement.                      |
| `customClass` / `customStyle`                                   | `string`                                                      | `''`                                                       | Root forwarding.                          |

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

| Token                                                                   | Purpose                                 |
| ----------------------------------------------------------------------- | --------------------------------------- |
| `--sn-mp-color-background-elevated`                                     | Sheet surface                           |
| `--sn-mp-color-background-soft`                                         | Tab plate                               |
| `--sn-mp-color-action-primary`                                          | Active tab / selected row / check glyph |
| `--sn-mp-color-text-primary` / `-secondary` / `-tertiary` / `-disabled` | Text + disabled                         |
| `--sn-mp-color-border-subtle`                                           | Row + toolbar rules                     |
| `--sn-mp-radius-md`                                                     | Tab + action corners                    |

## Accessibility

- The tab strip is `role="tablist"`; each tab is `role="tab"` with `aria-selected`.
- Each option is `role="button"` with `aria-pressed` / `aria-disabled`.
- The lazy loading state is `role="status"` + `aria-live="polite"`.

## Versioning

`@snui/uni@0.5.0` — initial release.
