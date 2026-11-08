# Keyboard · uni-app

`sn-keyboard` is the on-screen keypad of `@snui/uni`: numeric, car-plate and custom layouts. easycom auto-registration (`components/sn-keyboard/sn-keyboard.vue` → `<sn-keyboard>`); geometry in `rpx`. `maxlength` caps the value, the delete key removes one character and fires `delete` (**hold it to repeat**; the timers are cleared on release, on close and on unmount); `hideOnClickOutside` also controls whether the scrim is rendered.

The bottom row always fills all three cells: a slot without an `extraKey` renders the **collapse-to-system glyph key** (tapping it acts like the close button and fires `close`), so there is never a hole or an over-wide `0`; the header close button shows a circular chevron chip when no label is set.

Visually it follows the established mobile keypad idiom: a grey sheet (`background-subtle`) under white key plates (`background-elevated`), an elevated toolbar with the "done" action as a primary-coloured text button, and press feedback through `hover-class`. Key height, gap and radius are exposed as component-local custom properties (`--sn-keyboard-key-height`, `--sn-keyboard-gap`, `--sn-keyboard-key-radius`) that a host can retune from `custom-class` without a new prop.

## Basic usage

Default numeric keypad: bottom row [collapse] [0] [⌫], `maxlength` caps the value; pair it with a read-only field.

<Demo name="keyboard-mp-basic" description="Default numeric keypad: bottom row [collapse][0][⌫], `maxlength` caps the value; pair it with a read-only field." />

## Decimal (`extraKey="."`)

`extraKey="."` takes the bottom-left slot for amount input.

<Demo name="keyboard-mp-decimal" description="`extraKey=.` takes the bottom-left slot for amount input." />

## ID number (`extraKey="X"`)

`extraKey="X"` provides the checksum-digit key; pair with `maxlength=18` for ID numbers.

<Demo name="keyboard-mp-idcard" description="`extraKey=X` provides the checksum-digit key; `maxlength=18` for ID numbers." />

## Car & custom modes (`mode` / `extraKey` / `autoSwitchLang`)

`mode="car"` shows the plate keypad and `autoSwitchLang` flips to letters after the province; `mode="custom"` adds a large action column and `extraKey` appends a key.

<Demo name="keyboard-mp-car-custom" description="`mode=car` shows the plate keypad and `autoSwitchLang` flips to letters after the province; `mode=custom` adds a large action column and `extraKey` appends a key." />
## Key labels & the delete key (`deleteText` / `closeText` / `showDeleteKey` / `randomKeyOrder` / `zIndex`)

`deleteText` / `closeText` rename the delete and close keys (empty falls back to the icon); `showDeleteKey=false` drops the delete key; `randomKeyOrder` shuffles the digit keys; `zIndex` sets the stacking level.

<Demo name="keyboard-mp-labels" description="deleteText / closeText; showDeleteKey=false; randomKeyOrder; zIndex." />

## Scrim & behaviour (`modal` / `hideOnClickOutside` / `lockScroll` / `closeButtonLoading` / `safeAreaInsetBottom` / `rootPortal` / `custom*`)

`modal` renders an opaque scrim; `hideOnClickOutside=false` keeps the panel open when the scrim is tapped; `lockScroll=false` stops intercepting `touchmove`; `closeButtonLoading` shows a spinner in the close button; `rootPortal` is a parity placeholder (miniprograms have no portal host); `customClass` / `customStyle` land on the panel.

<Demo name="keyboard-mp-scrim" description="modal; hideOnClickOutside=false; lockScroll=false; closeButtonLoading; safeAreaInsetBottom; rootPortal; customClass / customStyle." />

## Props

| Prop                                          | Type                             | Default                   | Description                                                                                                  |
| --------------------------------------------- | -------------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `visible`                                     | `boolean`                        | `false`                   | Keyboard visibility                                                                                          |
| `modelValue`                                  | `string`                         | `''`                      | Current value                                                                                                |
| `title`                                       | `string`                         | `''`                      | Keyboard title                                                                                               |
| `mode`                                        | `'default' \| 'custom' \| 'car'` | `'default'`               | Layout preset                                                                                                |
| `zIndex`                                      | `number`                         | `100`                     | Stacking level                                                                                               |
| `maxlength`                                   | `number`                         | `Infinity`                | Maximum value length                                                                                         |
| `showDeleteKey`                               | `boolean`                        | `true`                    | Render the delete key                                                                                        |
| `randomKeyOrder`                              | `boolean`                        | `false`                   | Shuffle the digit keys                                                                                       |
| `closeText` / `deleteText`                    | `string`                         | `''`                      | Button labels                                                                                                |
| `closeButtonLoading`                          | `boolean`                        | `false`                   | Spinner in the close button                                                                                  |
| `modal` / `hideOnClickOutside` / `lockScroll` | `boolean`                        | `false` / `true` / `true` | Scrim behaviour                                                                                              |
| `safeAreaInsetBottom`                         | `boolean`                        | `true`                    | Safe-area padding                                                                                            |
| `extraKey`                                    | `string \| string[]`             | `undefined`               | Extra digit-grid key(s); an unsupplied slot renders the collapse key (fires `close`)                         |
| `carLang`                                     | `'zh' \| 'en'`                   | `'zh'`                    | Car-plate language                                                                                           |
| `autoSwitchLang`                              | `boolean`                        | `false`                   | Switch to letters after the province char                                                                    |
| `customClass` / `customStyle`                 | `string`                         | `''`                      | Root class / inline style                                                                                    |
| `rootPortal`                                  | `boolean`                        | `false`                   | Render outside the page flow — **declared, not implemented** (no portal host on MP; forwarded to `sn-popup`) |

> **Not implemented**: `root-portal` — declared and forwarded to `sn-popup`, but uni-app mini-programs have no portal host, so it has no visual effect.

## Events

| Event               | Description                                           | Payload                |
| ------------------- | ----------------------------------------------------- | ---------------------- |
| `update:modelValue` | Value changed                                         | `(value: string)`      |
| `update:visible`    | Visibility changed                                    | `(value: boolean)`     |
| `update:carLang`    | Car language changed                                  | `(lang: 'zh' \| 'en')` |
| `input`             | A character key was pressed                           | `(key: string)`        |
| `delete`            | Delete key pressed                                    | —                      |
| `close`             | Keyboard closed (close button / scrim / collapse key) | —                      |

## Slots

This component exposes no slots.

## Theme tokens

| Token                                                       | Purpose                  |
| ----------------------------------------------------------- | ------------------------ |
| `--sn-mp-color-background-elevated`                         | Keyboard surface         |
| `--sn-mp-color-background-soft`                             | Key plate                |
| `--sn-mp-color-background-sunken`                           | Custom-mode delete plate |
| ``--sn-mp-color-text-primary` / `-secondary` / `-tertiary`` | Key + header text        |
| `--sn-mp-radius-md`                                         | Key corners              |
| ``--sn-mp-font-size-md` / `-sm` / `-xl``                    | Label sizes              |

## Accessibility

- Every key is `role="button"` with an `aria-label` (the glyph, or "delete" / the close label); the collapse key carries `aria-label="collapse"`.
- The close button carries `aria-busy` while `closeButtonLoading` is set.
- The scrim is `aria-hidden`; the panel is the `sn-popup` `role="dialog"`.

## Dark mode

Every color resolves through a `--sn-mp-*` token and there is no light literal fallback. Under `.sn-theme-dark` the text, surfaces, borders and state colors flip automatically. Verify with:
