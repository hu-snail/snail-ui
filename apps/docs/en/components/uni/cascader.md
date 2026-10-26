# Cascader · uni-app

`sn-cascader` is the cascading selector sheet of `@snui/uni`: tab-style drilling through levels. easycom auto-registration (`components/sn-cascader/sn-cascader.vue` → `<sn-cascader>`); geometry in `rpx`. In static mode a leaf tap confirms immediately with the leaf value; `checkStrictly` allows confirming any level and shows the confirm button; with `lazyLoad` the confirmed value is the whole path (an async tree has no leaf value until the last level resolves).

## Basic usage

Static mode: drill level by level; tapping a leaf confirms and closes.

<Demo name="cascader-mp-basic" description="Static mode: drill level by level; tapping a leaf confirms and closes." />

## Any level & lazy loading (`checkStrictly` / `lazyLoad`)

`checkStrictly` lets any level be confirmed and shows the confirm button; `lazyLoad` asks the host for children when a branch expands.

<Demo name="cascader-mp-strict-lazy" description="`checkStrictly` lets any level be confirmed and shows the confirm button; `lazyLoad` asks the host for children when a branch expands." />
## Field mapping & tips (`valueKey` / `textKey` / `childrenKey` / `tipKey` / `lineWidth` / `lineHeight`)

Option keys are fully configurable: `valueKey` / `textKey` / `childrenKey` point at the value / label / children and `tipKey` at the per-row tip. `lineWidth` / `lineHeight` size the active-column indicator (a number is an rpx design value).

<Demo name="cascader-mp-fields" description="valueKey / textKey / childrenKey / tipKey mapping; lineWidth / lineHeight; confirmText." />

## Lazy loading & confirm veto (`lazyLoad` / `isLeafKey` / `beforeConfirm` / `checkStrictly`)

`lazyLoad(option, tabIndex, resolve)` asks the host for children when a non-leaf node expands; `isLeafKey` names the field that marks a leaf; `beforeConfirm` can veto the confirm; `checkStrictly` lets any level be confirmed (the confirm button only renders in that mode).

<Demo name="cascader-mp-lazy-confirm" description="lazyLoad + isLeafKey; checkStrictly; beforeConfirm veto; confirmText." />

## Sheet & indicator (`closeOnClickModal` / `zIndex` / `safeAreaInsetBottom` / `lineTheme` / `custom*`)

`lineTheme` has four indicator styles (`normal` / `text` / `underline` / `dot`). `closeOnClickModal` / `safeAreaInsetBottom` / `zIndex` / `rootPortal` are forwarded to `sn-popup`; `customClass` / `customStyle` land on the sheet.

<Demo name="cascader-mp-sheet" description="lineTheme underline / dot; closeOnClickModal=false; safeAreaInsetBottom; zIndex; rootPortal; customClass / customStyle." />

## Props

| Prop                                                            | Type                                                          | Default                                                    | Description                              |
| --------------------------------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------- |
| `modelValue`                                                    | `string \| number \| Array<...>`                              | `undefined`                                                | Leaf value, or a path array in lazy mode |
| `visible`                                                       | `boolean`                                                     | `false`                                                    | Sheet visibility                         |
| `options`                                                       | `CascaderOption[]`                                            | `[]`                                                       | Option tree                              |
| `title`                                                         | `string`                                                      | `''`                                                       | Toolbar title                            |
| `beforeConfirm`                                                 | `({ value, selectedOptions }) => boolean \| Promise<boolean>` | `undefined`                                                | Veto hook                                |
| `checkStrictly`                                                 | `boolean`                                                     | `false`                                                    | Allow confirming any level               |
| `confirmText`                                                   | `string`                                                      | `'确认'`                                                   | Confirm label                            |
| `valueKey` / `textKey` / `childrenKey` / `tipKey` / `isLeafKey` | `string`                                                      | `'value'` / `'text'` / `'children'` / `'tip'` / `'isLeaf'` | Node keys                                |
| `lazyLoad`                                                      | `CascaderLazyLoad`                                            | `undefined`                                                | Async children loader                    |
| `closeOnClickModal`                                             | `boolean`                                                     | `true`                                                     | Mask tap closes                          |
| `zIndex` / `safeAreaInsetBottom`                                | `number` / `boolean`                                          | `15` / `true`                                              | Sheet placement                          |
| `lineWidth` / `lineHeight`                                      | `number \| string`                                            | `undefined`                                                | Active-tab indicator size                |
| `lineTheme`                                                     | `'normal' \| 'text' \| 'underline' \| 'dot'`                  | `'normal'`                                                 | Indicator placement                      |
| `customClass` / `customStyle`                                   | `string`                                                      | `''`                                                       | Root class / inline style                |

> **Not implemented**: `root-portal`: uni-app mini-programs have no portal host.

## Events

| Event               | Description                     | Payload                      |
| ------------------- | ------------------------------- | ---------------------------- |
| `update:modelValue` | Selection confirmed             | `(value)`                    |
| `update:visible`    | Sheet shown / hidden            | `(value: boolean)`           |
| `confirm`           | Confirmed                       | `{ value, selectedOptions }` |
| `close`             | Sheet closed without confirming | —                            |

## Slots

This component exposes no slots.

## Theme tokens

| Token                                                                     | Purpose                                 |
| ------------------------------------------------------------------------- | --------------------------------------- |
| `--sn-mp-color-background-elevated`                                       | Sheet surface                           |
| `--sn-mp-color-background-soft`                                           | Tab plate                               |
| `--sn-mp-color-action-primary`                                            | Active tab / selected row / check glyph |
| ``--sn-mp-color-text-primary` / `-secondary` / `-tertiary` / `-disabled`` | Text + disabled                         |
| `--sn-mp-color-border-subtle`                                             | Row + toolbar rules                     |
| `--sn-mp-radius-md`                                                       | Tab + action corners                    |

## Accessibility

- The tab strip is `role="tablist"`; each tab is `role="tab"` with `aria-selected`.
- Each option is `role="button"` with `aria-pressed` / `aria-disabled`.
- The lazy loading state is `role="status"` + `aria-live="polite"`.

## Dark mode

Every color resolves through a `--sn-mp-*` token and there is no light literal fallback. Under `.sn-theme-dark` / `page.sn-theme-dark` the text, surfaces, borders and state colors flip automatically. Verify with:
