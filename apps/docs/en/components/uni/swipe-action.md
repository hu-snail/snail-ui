# SwipeAction · uni-app

`sn-swipe-action` is the swipe-to-reveal row of `@snui/uni` (mobile / miniprogram / H5): swipe left to expose the `right` action area, swipe right to expose the `left` one; tapping the open content area closes it and emits `click`. Auto-registered through easycom (`components/sn-swipe-action/sn-swipe-action.vue` → `<sn-swipe-action>`); geometry uses `rpx`.

> **Divergences from wot-ui**
>
> - A row without a `left` / `right` slot cannot be swiped open (the gesture is ignored).
> - `click` follows wd semantics: tapping the content area **while open** closes the row and reports `{ reason: 'click', position }`.
> - `before-close` also gates the swipe-driven close, not only the `close()` method.

## Basic usage

Put the row content in the default slot and the actions in `right` / `left`. `v-model` reports `'left' | 'close' | 'right'`.

<Demo name="swipe-action-mp-basic" description="Swipe left to reveal Delete; the state is shown live." />

## Both sides / close guard

- Providing both slots lets the row open either way
- `beforeClose(reason, position)` returning `false` (or a promise of it) blocks the close
- The gesture lives on the component root through `touchstart` / `touchmove` / `touchend` / `touchcancel` — no global listener

<Demo name="swipe-action-mp-both-sides" description="Left and right action areas + before-close blocking the first close." />

## Disabled and custom styles

`disabled` ignores the gesture and keeps the row closed; `customClass` / `customStyle` land on the root node.

<Demo name="swipe-action-mp-disabled" description="Swipeable + custom-class / custom-style, plus a disabled row that stays closed." />

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `'left' \| 'close' \| 'right'` | `'close'` | Current swipe state (`v-model`) |
| `disabled` | `boolean` | `false` | Disable swiping |
| `beforeClose` | `(reason, position) => boolean \| Promise<boolean>` | — | Close guard; `false` blocks the close |
| `customClass` | `string` | `''` | Root class |
| `customStyle` | `string` | `''` | Root inline style |

### beforeClose arguments

| Argument | Type | Description |
| --- | --- | --- |
| `reason` | `'click' \| 'swipe' \| 'other'` | What triggered the close |
| `position` | `'left' \| 'right'` | Which side is currently open |

## Events

| Event | Description | Payload |
| --- | --- | --- |
| `update:modelValue` | Swipe state changed | `('left' \| 'close' \| 'right')` |
| `click` | The open content area was tapped and closed | `{ reason: 'click', position: 'left' \| 'right' }` |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Row content (the area that slides) |
| `left` | Left action area (revealed by swiping right) |
| `right` | Right action area (revealed by swiping left) |

## Methods

| Method | Description |
| --- | --- |
| `close(reason?, position?)` | Close the open row; resolves `false` when `beforeClose` blocked it |

## Gesture behaviour

- A mostly-vertical swipe is handed to the page scroll; a horizontal one `preventDefault()`s so the page stays put while the row follows the finger
- `touchcancel` (a system gesture stealing the touch) closes the row so it can never stick half-open
- The open distance equals the real action-area width, measured per gesture through `uni.createSelectorQuery()` → the DOM node → a fallback constant

## Tokens

| Variable | Purpose |
| --- | --- |
| `--sn-mp-color-background-elevated` | Row / content background |
| `--sn-mp-color-text-primary` | Content text |
| `--sn-mp-color-text-disabled` | Disabled text |

## Accessibility

- The content area carries `role="button"` + `aria-expanded`
- Interaction uses `@tap` and touch events; no keyboard path on mobile

## Dark mode

The row and content background use `--sn-mp-color-background-elevated` and the text uses `--sn-mp-color-text-primary` — both overridden in the `page.sn-theme-dark, .sn-theme-dark` block of `@snui/tokens-mp/styles`, so dark mode adapts automatically. Action-area colours are the consumer's choice (the demos use `--sn-mp-color-feedback-danger` / `--sn-mp-color-action-primary`). Verify by wrapping the demo in `<sn-config-provider theme="dark">`.

## Related

- List row container: [`sn-cell`](/en/components/uni/cell)
- Bottom action panel: [`sn-action-sheet`](/en/components/uni/action-sheet)
