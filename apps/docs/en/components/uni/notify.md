# Notify · uni-app

`sn-notify` is the banner notification of `@snui/uni` (mobile / miniprogram / H5): it slides in from the top or bottom edge, stays for a configurable duration and slides out. Multi-line messages, a close button and a `floating` card variant are supported. Auto-registered through easycom (`components/sn-notify/sn-notify.vue` → `<sn-notify>`); geometry uses `rpx`.

> **Not implemented**
>
> - **Function API** (`useNotify()`) is not implemented this round; use the component form with `v-model:visible`.
> - `root-portal` is not implemented (no portal host on miniprogram).
> - `selector` is accepted for parity and has no effect in the component form.

## Basic usage

`type` drives the fill color and the default glyph; `\n` inside `message` renders as a line break.

<Demo name="notify-mp-basic" description="primary / success / warning / danger." />

## Variant and position

`variant="floating"` renders an inset card with rounded corners and a shadow; `closable` adds a close button (pair it with `duration=0` to keep the notice open); `position="bottom"` slides in from the bottom edge.

<Demo name="notify-mp-variant" description="Floating card, closable (never auto-dismisses), bottom anchor." />

## Colors, stacking and safe area

`color` / `background` override the text color and the fill; `safeHeight` adds a top offset (space for a custom nav bar); `zIndex` sets the stacking level and `customStyle` lands on the root node.

<Demo name="notify-mp-style" description="Custom fill and text color / safe-height=88 / zIndex=300 + custom-style." />

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| visible | boolean | false | Visibility (`v-model:visible`) |
| type | 'primary' \| 'success' \| 'warning' \| 'danger' | 'danger' | Semantic type (fill + default glyph) |
| message | string \| number | '' | Message text; `\n` renders a line break |
| duration | number | 3000 | Dwell time in ms; `0` keeps it open |
| position | 'top' \| 'bottom' | 'top' | Anchor of the banner |
| color | string | '' | Text color override |
| background | string | '' | Background color override |
| zIndex | number | 99 | Stacking level |
| safeHeight | number \| string | — | Extra top offset (bare number = px) |
| closable | boolean | false | Show the close button |
| variant | 'filled' \| 'floating' | 'filled' | Visual shape |
| selector | string | '' | Instance id (parity only) |
| customClass | string | '' | Custom class for the root node |
| customStyle | string | '' | Custom inline style for the root node |

## Events

| Event | Description | Payload |
| --- | --- | --- |
| update:visible | `v-model` sync (also fires on auto-dismiss / close) | boolean |
| click | Banner body tapped | Event |
| opened | Banner finished appearing | — |
| closed | Banner finished leaving (node unmounted) | — |

## Slots

| Slot | Description |
| --- | --- |
| default | Custom notification content (replaces `message`) |

## Theme variables

| Variable | Purpose |
| --- | --- |
| --sn-mp-color-action-primary | `type="primary"` fill |
| --sn-mp-color-feedback-success` / `-warning` / `-danger | Other fills / floating icon colors |
| --sn-mp-color-text-on-primary | Filled variant text |
| --sn-mp-color-text-primary | Floating variant text |
| --sn-mp-color-background-elevated | Floating card surface |
| --sn-mp-shadow-md | Floating card shadow |
| --sn-mp-font-size-md | Message size |
| --sn-mp-font-line-height-normal | Message line height |
| --sn-mp-spacing-3` / `--sn-mp-spacing-4` / `--sn-mp-spacing-5 | Padding and icon gap |
| --sn-mp-radius-lg | Floating card corners |

## Accessibility

- Banner body: `role="alert"` + `aria-live="assertive"`
- Close button: `role="button"` + `aria-label="close"`
- Status glyph: `aria-hidden="true"` (semantics carried by the message)

## Dark mode

The fills and text colors all come from semantic tokens (`--sn-mp-color-action-primary` / `--sn-mp-color-feedback-*` / `--sn-mp-color-text-*` / `--sn-mp-color-background-elevated`), all overridden in the dark block of `@snui/tokens-mp/styles`, so it adapts automatically. Verify with sn-config-provider 的 theme 设为 dark:


> A literal passed through `background` / `color` does not flip with the theme — prefer `var(--sn-mp-*)` colors in dark mode.

## Related

- Transient toast: [`sn-toast`](/en/components/uni/toast)
- Scrolling notice strip: [`sn-notice-bar`](/en/components/uni/notice-bar)
