# Cascader · uni-app

`sn-cascader` is the cascading selector sheet of `@snui/uni`: tab-style drilling through levels. easycom auto-registration (`components/sn-cascader/sn-cascader.vue` → `<sn-cascader>`); geometry in `rpx`. In static mode a leaf tap confirms immediately with the leaf value; `checkStrictly` allows confirming any level and shows the confirm button; with `lazyLoad` the confirmed value is the whole path (an async tree has no leaf value until the last level resolves). With `card` every option in the sheet renders as its own card, using the same radius / border / shadow tokens as `sn-cell`'s `card`.

## Basic usage

Static mode: drill level by level; tapping a leaf confirms and closes. The entry point is usually a `sn-cell` card row carrying "field name + current selection".

<Demo name="cascader-mp-basic" description="Static mode: drill level by level; tapping a leaf confirms and closes; a sn-cell card row opens the sheet." />

## Card look (`card`)

With `card` every option renders as its own card (radius / border / shadow, rows separated by a token gap), visually sharing one language with `sn-cell`'s card look; without `card` the default list look stays (edge-to-edge rows with a hairline). Drilling, the selected state and the row affordances behave the same in both layouts.

<Demo name="cascader-mp-card" description="Card look (`card`) beside the default list look; in card mode every row is a self-contained card." />

## Any level (`checkStrictly`)

`checkStrictly` lets any level be confirmed: tapping a branch no longer confirms, the confirm button only renders in that mode, and the submitted value is the picked level's value.

<Demo name="cascader-mp-strict-lazy" description="checkStrictly lets any level be confirmed and shows the confirm button; the emitted value is that level's value." />

## Disabled options (`disabled`)

An option carrying `disabled: true` renders dimmed and a tap neither drills down nor confirms; disabling a whole branch works the same way.

<Demo name="cascader-mp-disabled" description="Option-level disabled: the row reads dimmed and ignores taps; a disabled branch and a disabled leaf both hold." />

## Field mapping & tips (`valueKey` / `textKey` / `childrenKey` / `tipKey` / `lineWidth` / `lineHeight`)

Option keys are fully configurable: `valueKey` / `textKey` / `childrenKey` point at the value / label / children and `tipKey` at the per-row tip. `lineWidth` / `lineHeight` size the active-column indicator (a number is an rpx design value — 1 design value = 2rpx).

<Demo name="cascader-mp-fields" description="valueKey / textKey / childrenKey / tipKey mapping; lineTheme=text with lineHeight." />

## Lazy loading & confirm veto (`lazyLoad` / `isLeafKey` / `beforeConfirm`)

`lazyLoad(option, tabIndex, resolve)` asks the host for children when a non-leaf node expands; `isLeafKey` names the field that marks a leaf; `beforeConfirm` can veto the confirm (returning `false` keeps the sheet open). In lazy mode the confirmed `value` is the whole path array.

<Demo name="cascader-mp-lazy-confirm" description="lazyLoad + isLeafKey; checkStrictly; beforeConfirm veto with its verdict reported by a sn-cell row." />

## Sheet & indicator (`closeOnClickModal` / `zIndex` / `safeAreaInsetBottom` / `lineTheme` / `custom*`)

`lineTheme` has four indicator styles (`normal` / `text` / `underline` / `dot`). `closeOnClickModal` / `safeAreaInsetBottom` / `zIndex` / `rootPortal` are forwarded to `sn-popup`; `customClass` / `customStyle` land on the sheet.

<Demo name="cascader-mp-sheet" description="lineTheme underline / dot; closeOnClickModal=false; safeAreaInsetBottom; zIndex; rootPortal; customClass / customStyle." />

## Props

| Prop                                                            | Type                                                          | Default                                                    | Description                                                        |
| --------------------------------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------ |
| `modelValue`                                                    | `string \| number \| Array<...>`                              | `undefined`                                                | Leaf value, or a path array in lazy mode                           |
| `visible`                                                       | `boolean`                                                     | `false`                                                    | Sheet visibility                                                   |
| `options`                                                       | `CascaderOption[]`                                            | `[]`                                                       | Option tree                                                        |
| `title`                                                         | `string`                                                      | `''`                                                       | Toolbar title                                                      |
| `beforeConfirm`                                                 | `({ value, selectedOptions }) => boolean \| Promise<boolean>` | `undefined`                                                | Veto hook                                                          |
| `checkStrictly`                                                 | `boolean`                                                     | `false`                                                    | Allow confirming any level                                         |
| `confirmText`                                                   | `string`                                                      | `'确认'`                                                   | Confirm label                                                      |
| `valueKey` / `textKey` / `childrenKey` / `tipKey` / `isLeafKey` | `string`                                                      | `'value'` / `'text'` / `'children'` / `'tip'` / `'isLeaf'` | Node keys                                                          |
| `lazyLoad`                                                      | `CascaderLazyLoad`                                            | `undefined`                                                | Async children loader                                              |
| `closeOnClickModal`                                             | `boolean`                                                     | `true`                                                     | Mask tap closes                                                    |
| `zIndex` / `safeAreaInsetBottom`                                | `number` / `boolean`                                          | `15` / `true`                                              | Sheet placement                                                    |
| `lineWidth` / `lineHeight`                                      | `number \| string`                                            | `undefined`                                                | Active-tab indicator size (a number is an rpx design value)        |
| `lineTheme`                                                     | `'normal' \| 'text' \| 'underline' \| 'dot'`                  | `'normal'`                                                 | Indicator placement                                                |
| `card`                                                          | `boolean`                                                     | `false`                                                    | Card look (**AUI addition**): every option is its own rounded card |
| `customClass` / `customStyle`                                   | `string`                                                      | `''`                                                       | Root class / inline style                                          |

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

| Token                                                                   | Purpose                                                 |
| ----------------------------------------------------------------------- | ------------------------------------------------------- |
| `--sn-mp-color-background-elevated`                                     | Sheet and card surface                                  |
| `--sn-mp-color-background-soft`                                         | Tab plate / press feedback                              |
| `--sn-mp-color-background-subtle`                                       | Tab press feedback                                      |
| `--sn-mp-color-action-primary`                                          | Active tab / selected row / check glyph / indicator     |
| `--sn-mp-color-action-primary-soft`                                     | Active tab and selected row plate                       |
| `--sn-mp-color-text-primary` / `-secondary` / `-tertiary` / `-disabled` | Text + disabled                                         |
| `--sn-mp-color-border-subtle`                                           | Row and toolbar rules / card border                     |
| `--sn-mp-radius-md` / `--sn-mp-radius-lg` / `--sn-mp-radius-full`       | Tab / action / card and return-control corners (`card`) |
| `--sn-mp-shadow-sm`                                                     | Card shadow (`card`)                                    |
| `--sn-mp-spacing-1` … `--sn-mp-spacing-4`                               | Toolbar / tab / row / card gaps                         |
| `--sn-mp-font-size-xs` / `-sm` / `-md`                                  | Tip text / tab and status labels / option text          |
| `--sn-mp-font-weight-semibold`                                          | Active tab / selected row / confirm weight              |

## AI Patch Boundary

- A patch may change presentation and data configuration: `title` / `options` (tree shape, `value` / `text` / `tip` / `disabled` / custom keys) / `confirmText` / `card` / `lineTheme` / `lineWidth` / `lineHeight` / `zIndex` / `safeAreaInsetBottom` / `closeOnClickModal` / `customClass` / `customStyle`.
- `modelValue` / `visible` are host-controlled: a patch should change defaults or the field mapping (`valueKey` / `textKey` / `childrenKey` / `tipKey` / `isLeafKey`) instead of faking confirm events or writing runtime state.
- `beforeConfirm` / `lazyLoad` are host capability boundaries (data fetching, permission checks): a patch must not inline business logic there, only adjust their presence and binding name.
- `root-portal` is not implemented; a patch must not rely on it to change stacking.

## Accessibility

- The tab strip is `role="tablist"`; each tab is `role="tab"` with `aria-selected`; a level without a selection yet shows a "please select" hint.
- Each option is `role="button"` with `aria-pressed` / `aria-disabled`.
- The toolbar's return control (step one level up) and cancel / confirm are `role="button"` with an `aria-label`.
- The row drill arrow / check glyph are decorative (`aria-hidden`); the row itself carries the semantics.
- The lazy loading state and the empty-level hint are `role="status"` (the loading one also `aria-live="polite"`).

## Dark mode

Every color resolves through a `--sn-mp-*` token and there is no light literal fallback. Under `.sn-theme-dark` the sheet surface, card borders and shadows, tab plates, selected states and text colors flip automatically, while the return control and the indicator follow the brand token. Verify it by wrapping in a dark config provider:

```vue
<sn-config-provider theme="dark">
  <sn-cascader v-model="value" v-model:visible="open" :options="tree" title="Region" card />
</sn-config-provider>
```
