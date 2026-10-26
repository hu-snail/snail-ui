# Card · uni-app (Mobile)

`<view role="region">` container for mobile / miniprogram cards. Visual styling is driven by `--sn-mp-card-*` token aliases (rpx units).

## Basic usage

<Demo name="card-mp" description="Default card (title prop + footer slot) + Rectangle card (type='rectangle', list-style)." />

## Per-region custom classes and styles

`customTitleClass` / `customContentClass` / `customFooterClass` attach to the title / content / footer nodes; `customClass` lands on the root node and `customStyle` is appended to its inline style.

<Demo name="card-mp-custom" description="Three region classes, the root class plus inline style, and the same customisation on the rectangle variant." />

## Props

> The full prop list follows the library's dual-platform contract. Web-only `variant` / `padding` / `shadow` / `closable` / `hoverable` / `embedded` / `segmented` aliases are intentionally NOT exposed — passing them is rejected by contract validation.

| Prop                 | Type     | Default | Description                                       |
| -------------------- | -------- | ------- | ------------------------------------------------- |
| `title`              | `string` | `''`    | Card title (mutually exclusive with `title` slot) |
| `type`               | `string` | `''`    | Card type; supports `'rectangle'` (list-style)    |
| `customTitleClass`   | `string` | `''`    | Custom class for title region                     |
| `customContentClass` | `string` | `''`    | Custom class for content region                   |
| `customFooterClass`  | `string` | `''`    | Custom class for footer region                    |
| `customClass`        | `string` | `''`    | Custom class for root node                        |
| `customStyle`        | `string` | `''`    | Custom inline style for root node                 |

## Slots

| Slot      | Description                                  |
| --------- | -------------------------------------------- |
| `default` | Content region                               |
| `title`   | Custom title region (overrides `title` prop) |
| `footer`  | Bottom action area                           |

## Region omission rules

- `title` region renders only if `title` slot or `title` prop is non-empty
- `content` region renders only if default slot has content
- `footer` region renders only if `footer` slot has content

## Tokens (end: mp)

| Token              | CSS Variable                       | Purpose               |
| ------------------ | ---------------------------------- | --------------------- |
| Card padding       | `--sn-mp-card-padding`             | Default inner padding |
| Card radius        | `--sn-mp-card-radius`              | Border radius         |
| Border default     | `--sn-mp-color-border-default`     | Footer divider line   |
| Text primary       | `--sn-mp-color-text-primary`       | Title + body text     |
| Background surface | `--sn-mp-color-background-surface` | Card background       |

## Accessibility

| Attribute | Value                                     |
| --------- | ----------------------------------------- |
| `role`    | `'region'`                                |
| Keyboard  | Not focusable (mobile tap does not focus) |
