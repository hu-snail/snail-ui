# Search · uni-app

Cross-end search field for uni-app (H5 / WeChat MP / App). easycom auto-registration (`components/sn-search/sn-search.vue` → `<sn-search>`); geometry in `rpx`, colors from `--sn-mp-*` tokens. The component only handles input and events — the actual query runs in the host app behind the `search` event.

## Basic usage

`v-model` binds the query; the soft-keyboard search key fires `search`.

<Demo name="search-mp-basic" description="v-model binding + the search event." />

## Variants (`variant`: `plain` / `filled` / `light`)

`plain` (default) is bordered; `filled` uses a tinted block; `light` is the lightest, for nesting inside a colored surface.

<Demo name="search-mp-variant" description="Three variants: plain / filled / light." />

## Cancel text & states (`cancelTxt` / `hideCancel` / `placeholderLeft` / `disabled`)

`cancelTxt` customizes the right-hand label and fires `cancel`; `hideCancel` removes it; `placeholderLeft` left-aligns the placeholder; `disabled` blocks input / search / cancel / clear and only emits `click` on the root.

<Demo name="search-mp-cancel-states" description="cancelTxt + cancel event; hideCancel; placeholderLeft; disabled." />

## Input attributes (`maxlength` / `focus` / `focusWhenClear` / `customInputClass`)

`maxlength` caps the character count (`-1` = unlimited); `focus` focuses on mount; `focus-when-clear` keeps the refocus-after-clear switch; `custom-input-class` is appended to the inner native input.

<Demo name="search-mp-input-attrs" description="`maxlength` caps the character count; `focus` focuses on mount; `focusWhenClear` refocuses after clear; `customInputClass` is appended to the inner input." />

## Placeholder text & root styling (`placeholderStyle` / `placeholderClass` / `customClass` / `customStyle`)

`placeholder-style` is an inline declaration string and `placeholder-class` a class on the placeholder pseudo-element — both affect only the placeholder text; `custom-class` / `custom-style` land on the root wrapper.

<Demo name="search-mp-placeholder-style" description="`placeholderStyle` / `placeholderClass` affect only the placeholder text; `customClass` / `customStyle` restyle the root frame and fill." />

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string` | `''` | Bound query text. |
| `customInputClass` | `string` | `''` | Class on the inner `<input>`. |
| `placeholder` | `string` | `'搜索'` | Placeholder text. |
| `cancelTxt` | `string` | `'取消'` | Right-hand cancel text. |
| `variant` | `'plain' \| 'filled' \| 'light'` | `'plain'` | Visual variant. |
| `hideCancel` | `boolean` | `false` | Hide the cancel text. |
| `disabled` | `boolean` | `false` | Blocks every interaction event. |
| `maxlength` | `number \| string` | `-1` | Max length; `-1` = unlimited. |
| `placeholderLeft` | `boolean` | `false` | Left-align the placeholder (default is centered). |
| `focus` | `boolean` | `false` | Focus on mount. |
| `focusWhenClear` | `boolean` | `false` | Re-focus after clear (no-op on uni-end). |
| `placeholderStyle` | `string` | `''` | Inline style for the placeholder. |
| `placeholderClass` | `string` | `''` | Class on the placeholder. |
| `customClass` | `string` | `''` | Class on the root node. |
| `customStyle` | `string` | `''` | Inline style on the root node. |

## Events

| Event | Description | Payload |
| --- | --- | --- |
| `update:modelValue` | Input sync | `(value: string)` |
| `change` | Content changed (alias of `update:modelValue`) | `(value: string)` |
| `search` | Soft-keyboard search key | `(value: string)` |
| `cancel` | Right-hand cancel text tapped | `(value: string)` |
| `clear` | × button tapped | — |
| `focus` / `blur` | Focus / blur | `(event: Event)` |
| `click` | Root tapped while disabled | `(event: Event)` |

## Slots

| Slot | Description |
| --- | --- |
| `prefix` | Content before the field. |
| `input-suffix` | Content inside the field, right of the input. |
| `suffix` | Content after the cancel text. |

## Theme variables

| Variable | Purpose |
| --- | --- |
| `--sn-mp-color-input-bg` | `plain` field background |
| `--sn-mp-color-input-text` | Input text |
| `--sn-mp-color-input-placeholder` | Placeholder |
| `--sn-mp-color-input-border` | Idle border |
| `--sn-mp-color-input-border-focus` | Focus border |
| `--sn-mp-color-background-soft` | `filled` surface |
| `--sn-mp-color-background-subtle` | `light` surface |
| `--sn-mp-color-action-primary` | Cancel text color |
| `--sn-mp-color-text-secondary` | Search / clear glyphs |
| `--sn-mp-radius-full` | Pill radius |

## Accessibility

- `role="search"` on the root.
- Native `<input type="text">` with `confirm-type="search"`.
- `aria-label` defaults to the placeholder; `aria-disabled` mirrors the prop.
- The × button is decorative (`aria-hidden`) with `tabindex` dropping to `-1` when disabled.

## Dark mode

Every color resolves through `--sn-mp-color-*` with no light-only fallback, so `.sn-theme-dark` / `page.sn-theme-dark` flips the field background, border, placeholder and cancel text. Verify with:

