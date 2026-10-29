# Curtain · uni-app

`sn-curtain` is the image curtain of `@snui/uni` (mobile / miniprogram / H5): a full-screen scrim, a centred image and a close button whose position is configurable — the promo / festival pop-up pattern. Auto-registered through easycom (`components/sn-curtain/sn-curtain.vue` → `<sn-curtain>`); geometry uses `rpx`.

> **Divergences from wot-ui**
>
> - The deprecated `value` prop is not declared; `v-model` is the single source of truth.
> - `root-portal` is declared but **not implemented** (no portal host on miniprogram).
> - `show-menu-by-longpress` is forwarded to `<image>`'s attribute of the same name; only WeChat honours it.
> - `to` navigates through `globalThis.uni.navigateTo` behind an existence guard. A failed navigation is swallowed and `click` still fires, so the host decides the routing.

## Basic usage

`v-model` controls visibility, `src` is the image URL and `width` its width in design px (`0` = full screen width). The default `close-position="inset"` pins the close button to the bottom-centre of the image.

<Demo name="curtain-mp-basic" description="Default inset close button; tapping the image closes the curtain." />

## Close button position

`close-position` accepts `inset` / `top` / `bottom` / `top-left` / `top-right` / `bottom-left` / `bottom-right`. `custom-close-class` / `custom-close-style` style the button further.

<Demo name="curtain-mp-close-position" description="top and bottom-right positions; the corner button gets a custom shadow." />

## Close behaviour

- `closeOnClick` (default `true`) decides whether an image tap closes the curtain
- `closeOnClickModal` (default `false`) decides whether a scrim tap closes it
- `hideWhenClose=false` keeps the node after closing; `zIndex` sets the stacking level; `rootPortal` is declared for parity only

<Demo name="curtain-mp-behavior" description="Image tap keeps it open / scrim tap closes / node kept after close + zIndex=150." />

## Custom styles

`customCloseStyle` lands on the close button and `customStyle` on the root node; `showMenuByLongpress` is forwarded to `image` and only takes effect in WeChat miniprogram.

<Demo name="curtain-mp-custom" description="Close button inline style + root inline style + long-press recognition menu." />

## Props

| Prop                  | Type                                                                                           | Default   | Description                                          |
| --------------------- | ---------------------------------------------------------------------------------------------- | --------- | ---------------------------------------------------- |
| `modelValue`          | `boolean`                                                                                      | `false`   | Whether the curtain is shown (`v-model`)             |
| `src`                 | `string`                                                                                       | `''`      | Image URL (network address or package path)          |
| `width`               | `number`                                                                                       | `0`       | Image width in design px; `0` fills the screen width |
| `to`                  | `string`                                                                                       | `''`      | Page path opened when the image is tapped            |
| `closePosition`       | `'inset' \| 'top' \| 'bottom' \| 'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'inset'` | Close button position                                |
| `closeOnClickModal`   | `boolean`                                                                                      | `false`   | Close on a scrim tap                                 |
| `closeOnClick`        | `boolean`                                                                                      | `true`    | Close on an image tap                                |
| `hideWhenClose`       | `boolean`                                                                                      | `true`    | Remove the node once closed                          |
| `zIndex`              | `number`                                                                                       | `10`      | Stacking level                                       |
| `customCloseClass`    | `string`                                                                                       | `''`      | Extra class on the close button                      |
| `customCloseStyle`    | `string`                                                                                       | `''`      | Extra inline style on the close button               |
| `showMenuByLongpress` | `boolean`                                                                                      | `false`   | WeChat long-press menu (WeChat only)                 |
| `customClass`         | `string`                                                                                       | `''`      | Root class                                           |
| `customStyle`         | `string`                                                                                       | `''`      | Root inline style                                    |
| `rootPortal`          | `boolean`                                                                                      | `false`   | **Not implemented** (no portal host on miniprogram)  |

## Events

| Event                                    | Description                                          | Payload            |
| ---------------------------------------- | ---------------------------------------------------- | ------------------ |
| `update:modelValue`                      | Visibility changed                                   | `(value: boolean)` |
| `click`                                  | The curtain image was tapped                         | —                  |
| `close`                                  | A close was requested (image / scrim / close button) | —                  |
| `closed`                                 | The leave animation finished                         | —                  |
| `click-modal`                            | The scrim was tapped                                 | —                  |
| `before-enter` / `enter` / `after-enter` | Enter animation legs                                 | —                  |
| `before-leave` / `leave` / `after-leave` | Leave animation legs                                 | —                  |
| `load`                                   | The image loaded                                     | `(event: Event)`   |
| `error`                                  | The image failed to load (the curtain hides itself)  | —                  |

## Slots

| Slot    | Description                                      |
| ------- | ------------------------------------------------ |
| `close` | Custom close button; replaces the built-in glyph |

## Tokens

| Variable                                    | Purpose                            |
| ------------------------------------------- | ---------------------------------- |
| `--sn-mp-color-background-overlay`          | Full-screen scrim                  |
| `--sn-mp-color-background-elevated`         | Close button fill                  |
| `--sn-mp-color-text-secondary`              | Close button glyph                 |
| `--sn-mp-color-border-default`              | Close button outline               |
| `--sn-mp-radius-md` / `--sn-mp-radius-full` | Image corners / round close button |

## Accessibility

- Root carries `role="dialog"` + `aria-modal="true"`
- The scrim is `aria-hidden="true"`
- Close button carries `role="button"` + `aria-label="close"`
- Interaction uses `@tap`; no keyboard focus trap on mobile

## Dark mode

The scrim uses `--sn-mp-color-background-overlay`; the close button uses `--sn-mp-color-background-elevated` / `--sn-mp-color-border-default` / `--sn-mp-color-text-secondary` for fill, outline and glyph. All are overridden in the `.sn-theme-dark` block of `@snui/tokens-mp/styles`, so dark mode adapts automatically. Verify by wrapping the demo in `<sn-config-provider theme="dark">`.

## Related

- General popup layer: [`sn-popup`](/en/components/uni/popup)
- Image preview / zoom: `sn-img`
