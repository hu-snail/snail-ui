# Toast · uni-app

`sn-toast` is the lightweight transient message of `@snui/uni` (mobile / miniprogram / H5): a line of text that auto-dismisses, optionally with a status glyph or spinner, four anchors and an optional blocking scrim. Auto-registered through easycom (`components/sn-toast/sn-toast.vue` → `<sn-toast>`); geometry uses `rpx`.

> **Not implemented**
>
> - **Function API** (`useToast()` and its `success` / `error` / `warning` / `info` / `loading` / `close` helpers) is not implemented this round — uni-app has no reliable programmatic mount point on every target. Use the component form with `v-model`.
> - `selector` is accepted for parity and has no effect in the component form.
> - `class-prefix` / `css-icon` are accepted for parity only: uni icons are `IconData` objects, so the iconfont-class path is inert.

## Basic usage

Centred and horizontal by default; auto-closes after `duration` ms. `duration=0` keeps it open (tapping emits `click`).

<Demo name="toast-mp-basic" description="Plain text / success icon (top) / loading icon, vertical (bottom, never auto-closes)." />

## Icons and loading shapes

`iconName` takes `success` / `error` / `warning` / `info` / `loading`; when it is `loading`, `loadingType` switches between `circular` / `spinner` / `dots` / `wave`.

<Demo name="toast-mp-icon" description="Four status glyphs and four loading shapes." />

## Icon size and color, scrim and stacking

- `iconSize` / `iconColor` tune the status glyph; `loadingSize` / `loadingColor` tune the spinner
- `cover` renders a transparent full-screen scrim that blocks page taps
- `zIndex` sets the stacking level and `customStyle` lands on the toast box
- `selector` / `classPrefix` / `cssIcon` / `iconClass` are wot-ui parity declarations with no effect on the uni end

<Demo name="toast-mp-style" description="Glyph and spinner size/color / cover scrim / zIndex + custom-style." />

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| modelValue | boolean | false | Visibility (`v-model`) |
| msg | string | '' | Message text |
| duration | number | 2000 | Delay in ms; `0` keeps it open |
| direction | 'horizontal' \| 'vertical' | 'horizontal' | Layout direction |
| iconName | '' \| 'success' \| 'error' \| 'warning' \| 'loading' \| 'info' | '' | Icon kind |
| iconSize | number \| string | — | Icon size (bare number = rpx) |
| loadingType | 'circular' \| 'spinner' \| 'dots' \| 'wave' | 'circular' | Spinner shape for `iconName="loading"` |
| loadingColor | string | '' | Spinner color |
| loadingSize | number \| string | — | Spinner size (bare number = rpx) |
| iconColor | string | '' | Status glyph color |
| position | 'top' \| 'middle-top' \| 'middle' \| 'bottom' | 'middle' | Anchor of the toast box |
| zIndex | number | 100 | Stacking level |
| cover | boolean | false | Render a blocking transparent scrim |
| iconClass | string | '' | Custom class for the icon node (parity) |
| classPrefix | string | 'wd-icon' | Icon class prefix (parity; inert) |
| cssIcon | boolean \| string | false | CSS-icon mode (parity; inert) |
| selector | string | '' | Instance id (parity only) |
| customClass | string | '' | Custom class for the root node |
| customStyle | string | '' | Custom inline style for the toast box |

## Events

| Event | Description | Payload |
| --- | --- | --- |
| update:modelValue | `v-model` sync (also fires on auto-close) | boolean |
| opened | Toast finished appearing | — |
| closed | Toast finished closing (after the fade) | — |
| click | Toast box tapped | — |

## Slots

| Slot | Description |
| --- | --- |
| default | Custom message content (replaces `msg`) |
| icon | Custom icon area |

## Theme variables

| Variable | Purpose |
| --- | --- |
| --sn-mp-color-text-on-primary | Toast text |
| --sn-mp-color-background-sunken | Toast surface |
| --sn-mp-color-background-overlay | `cover` scrim |
| --sn-mp-font-size-md | Message size |
| --sn-mp-font-line-height-normal | Message line height |
| --sn-mp-spacing-3` / `--sn-mp-spacing-5` / `--sn-mp-spacing-6 | Padding and icon gap |
| --sn-mp-radius-lg | Toast box corners |

## Accessibility

- Toast box: `role="alert"` + `aria-live="assertive"`
- Scrim: `aria-hidden="true"`, transparent by default
- No keyboard interaction (auto-dismissing)

## Dark mode

The toast surface uses `--sn-mp-color-background-sunken` and the text uses `--sn-mp-color-text-on-primary`; both are overridden in the dark block of `@snui/tokens-mp/styles`, so it adapts automatically. Verify with sn-config-provider 的 theme 设为 dark:


## Related

- Top banner notification: [`sn-notify`](/en/components/uni/notify)
- Modal with buttons: [`sn-dialog`](/en/components/uni/dialog)
