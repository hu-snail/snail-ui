# Gap · uni-app (Mobile)

`sn-gap` is the vertical spacer of `@snui/uni` (mobile / miniprogram / H5). Mobile layout rhythm is often produced by an explicit spacer element rather than a container margin, because miniprogram WXSS support for `gap` and margin collapsing is uneven. Auto-registered via easycom.

## Basic usage

14px by default; pass a number (px) or a string with a unit:

<Demo name="gap-mp-basic" description="Default 14px gap; height=24 numeric gap; height='20px' gap with a background." />

## Bottom safe area

`safeAreaBottom` adds `env(safe-area-inset-bottom)` on top of the spacer's own height:

<Demo name="gap-mp-safe-area" description="safeAreaBottom reserves the gesture-bar inset at the bottom of a page so the last row is not covered." />

It uses `padding-bottom` rather than a taller box: the spacer's `height` stays the caller's value and the inset stacks on top. `env()` falls back to `0px` on targets without a safe area, so the plain height is the floor everywhere.

## rpx heights and custom styles

A string `height` is forwarded verbatim, so `24rpx` keeps the mobile rhythm; `custom-class` / `custom-style` land on the root node:

<Demo name="gap-mp-custom" description="height=&quot;24rpx&quot; is forwarded verbatim while a number stays px; customClass / customStyle stack with bg-color." />

## Auto registration (easycom)

```vue
<sn-gap />
<sn-gap :height="24" />
<sn-gap height="40rpx" safe-area-bottom />
```

For an explicit import:

```ts
import { SnGap } from '@snui/uni/components/sn-gap/sn-gap.vue';
```

## Props

| Prop             | Type               | Default         | Description                                                  |
| ---------------- | ------------------ | --------------- | ------------------------------------------------------------ |
| `height`         | `string \| number` | `14`            | Spacer height; a number is px, a string is used verbatim     |
| `bgColor`        | `string`           | `'transparent'` | Background colour; `transparent` writes no inline background |
| `safeAreaBottom` | `boolean`          | `false`         | Add the bottom safe-area inset                               |
| `customClass`    | `string`           | `''`            | Extra class on the root node                                 |
| `customStyle`    | `string`           | `''`            | Inline style on the root node                                |

## Events

None. The spacer is decoration.

## Slots

None. Content passed to the default slot is not rendered — a spacer with children would be a layout container, which is a different component.

## Theme variables

None. The spacer's geometry comes from `height` and the optional safe-area inset, and its background defaults to `transparent`, so there is no colour or spacing token to consume.

This is deliberate: a spacer must inherit the page surface, otherwise it would paint a visible light band in dark mode.

## Accessibility

- `aria-hidden="true"` + `role="presentation"`: the element carries no information and must not appear in the accessibility tree.
- No interaction, so no keyboard contract.

## Dark mode

`sn-gap` consumes no colour tokens; the default `transparent` background inherits the page surface, so nothing extra is needed under `.sn-theme-dark`.

One caveat: passing a light literal to `bgColor` (for example `#f4f4f5`) keeps that light colour in dark mode. That is the semantics of an inline override, not a component issue. Use `var(--sn-mp-color-*)` when the fill should track the theme:

```vue
<sn-gap height="20px" bg-color="var(--sn-mp-color-background-subtle)" />
```

Verify the default transparent spacer with sn-config-provider 的 theme 设为 dark:

## Related

- Separator: [`sn-divider`](/en/components/uni/divider)
- Card container: [`sn-card`](/en/components/uni/card)
