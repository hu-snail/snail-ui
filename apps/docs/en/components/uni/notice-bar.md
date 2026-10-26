# NoticeBar · uni-app

`sn-notice-bar` is the horizontal notice strip of `@snui/uni` (mobile / miniprogram / H5): a marquee, a static / wrapping mode, and a vertical one-line-at-a-time mode, with an optional leading icon and close button. Auto-registered through easycom (`components/sn-notice-bar/sn-notice-bar.vue` → `<sn-notice-bar>`); geometry uses `rpx`.

> **Not implemented**
>
> - `speed` is honoured as "px per second", converted into a keyframe duration from an **estimated** text width (character count × font size) — a cross-end component cannot measure real text width; wot-ui does.
> - `direction="vertical"` shows one line at a time on an interval instead of a scroll animation.

## Basic usage

`scrollable` defaults to `true` (marquee); `scrollable=false` renders a static line; add `wrapable` to wrap long text.

<Demo name="notice-bar-mp-basic" description="Marquee / static / wrapping." />

## Types and closing

`type` takes `warning` (default) / `info` / `danger`; `closable` shows a close button that hides the strip and emits `close`.

<Demo name="notice-bar-mp-type" description="Three tints plus a closable notice (restorable)." />

## Vertical rotation

With `direction="vertical"` and a `text` array, one line shows at a time and each rotation emits `next`.

<Demo name="notice-bar-mp-vertical" description="Three announcements rotating, with the current index shown." />

## Icon, delay and speed

`prefix` swaps in an icon from the registry (falling back to the type glyph when it misses); `delay` is the seconds before the marquee starts; `speed` is the scroll speed in px/s.

<Demo name="notice-bar-mp-marquee" description="Registry prefix icon / delay=3 / speed=120." />

## Custom colors and class names

`color` / `backgroundColor` override the default tint, and `customClass` / `customStyle` land on the root node.

<Demo name="notice-bar-mp-custom" description="Overridden text and fill color / custom-class border / custom-style radius." />

## Props

| Prop            | Type                            | Default      | Description                                   |
| --------------- | ------------------------------- | ------------ | --------------------------------------------- |
| text            | string \| string[]              | ''           | Notice text (a string, or lines)              |
| type            | 'warning' \| 'info' \| 'danger' | 'warning'    | Semantic type (tint + fallback glyph)         |
| prefix          | string                          | ''           | Leading icon name (sn-icon registry)          |
| scrollable      | boolean                         | true         | Enable the marquee                            |
| delay           | number                          | 1            | Delay before the marquee starts, in seconds   |
| speed           | number                          | 50           | Marquee speed in px per second                |
| closable        | boolean                         | false        | Show the close button                         |
| wrapable        | boolean                         | false        | Wrap long text (only when `scrollable=false`) |
| color           | string                          | ''           | Text and icon color override                  |
| backgroundColor | string                          | ''           | Background color override                     |
| direction       | 'horizontal' \| 'vertical'      | 'horizontal' | Scroll axis                                   |
| customClass     | string                          | ''           | Custom class for the root node                |
| customStyle     | string                          | ''           | Custom inline style for the root node         |

## Events

| Event | Description                                  | Payload           |
| ----- | -------------------------------------------- | ----------------- |
| close | Close button tapped (the strip hides itself) | —                 |
| next  | Vertical mode advanced to the next line      | index: number     |
| click | Content area tapped                          | `{ text, index }` |

## Slots

| Slot    | Description                                                   |
| ------- | ------------------------------------------------------------- |
| prefix  | Custom leading content; ignored when the `prefix` prop is set |
| suffix  | Custom trailing content; overrides the default close icon     |
| default | Custom notice text (horizontal direction only)                |

## Theme variables

| Variable                                       | Purpose                  |
| ---------------------------------------------- | ------------------------ |
| --sn-mp-color-feedback-warning`/`-warning-soft | `type="warning"` tint    |
| --sn-mp-color-feedback-info                    | `type="info"` foreground |
| --sn-mp-color-background-subtle                | `type="info"` tint       |
| --sn-mp-color-feedback-danger`/`-danger-soft   | `type="danger"` tint     |
| --sn-mp-font-size-md                           | Text size                |
| --sn-mp-font-line-height-normal                | Text line height         |
| --sn-mp-spacing-3`/`--sn-mp-spacing-4          | Padding and icon gap     |

## Accessibility

- Root: `role="marquee"`, `aria-live="off"` while scrolling and `polite` when static
- Leading icon wrapper: `aria-hidden="true"`
- Close button: `role="button"` + `aria-label="close"`

## Dark mode

All three type tints and foregrounds come from semantic tokens (`--sn-mp-color-feedback-*` / `--sn-mp-color-background-subtle`), all overridden in the dark block of `@snui/tokens-mp/styles`, so it adapts automatically. Verify with sn-config-provider 的 theme 设为 dark:

> A literal passed through `color` / `backgroundColor` does not flip with the theme — prefer `var(--sn-mp-*)` colors in dark mode.

## Related

- Top banner notification: [`sn-notify`](/en/components/uni/notify)
- Transient toast: [`sn-toast`](/en/components/uni/toast)
