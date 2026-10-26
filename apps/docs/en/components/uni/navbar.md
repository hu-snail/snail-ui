# Navbar · uni-app

`sn-navbar` is the top navigation bar of `@snui/uni` (mobile / miniprogram / H5). It carries the page title, a left back action, right-side actions and an optional miniprogram capsule slot. Auto-registered via easycom; geometry uses `rpx` so it scales with the device.

## Basic usage

Title, side labels and the back arrow:

<Demo name="navbar-mp-basic" description="title renders the heading; left-text / right-text add side labels; left-arrow shows the back arrow; bordered draws the bottom hairline." />

## Slots and fixed positioning

The `left` / `title` / `right` slots override the same-named props; `fixed` + `placeholder` pins the bar and reserves an equal-height spacer:

<Demo name="navbar-mp-slots" description="left / right slots carry custom icons; fixed + placeholder pins the bar and renders the spacer." />

## Disabled sides / safe area / capsule slot

`left-disabled` / `right-disabled` make that side inert; `safe-area-inset-top` adds the status-bar height; the `capsule` slot takes over the left zone; `custom-class` / `custom-style` land on the root:

<Demo name="navbar-mp-config" description="left-disabled / right-disabled veto taps; safe-area-inset-top adds the safe area; capsule slot plus custom-class / custom-style." />

## Auto registration (easycom)

The component follows the easycom convention, so **no import is needed in a template**:

```vue
<sn-navbar title="Home" left-arrow />
```

For an explicit import:

```ts
import { SnNavbar } from '@snui/uni/components/sn-navbar/sn-navbar.vue';
```

## Props

| Prop               | Type      | Default | Description                               |
| ------------------ | --------- | ------- | ----------------------------------------- |
| `title`            | `string`  | `''`    | Title text                                |
| `leftText`         | `string`  | `''`    | Left-side label                           |
| `rightText`        | `string`  | `''`    | Right-side label                          |
| `leftArrow`        | `boolean` | `false` | Show the back arrow on the left           |
| `bordered`         | `boolean` | `false` | Hairline bottom border                    |
| `fixed`            | `boolean` | `false` | Pin the bar to the top                    |
| `placeholder`      | `boolean` | `false` | Reserve the bar height in flow when fixed |
| `zIndex`           | `number`  | `10`    | Stacking level (written only when fixed)  |
| `safeAreaInsetTop` | `boolean` | `false` | Add status-bar height as top padding      |
| `leftDisabled`     | `boolean` | `false` | Dim the left zone and block its events    |
| `rightDisabled`    | `boolean` | `false` | Dim the right zone and block its events   |
| `customClass`      | `string`  | `''`    | Extra class on the root node              |
| `customStyle`      | `string`  | `''`    | Inline style on the root node             |

## Events

| Event         | Description                                         | Payload          |
| ------------- | --------------------------------------------------- | ---------------- |
| `click-left`  | Left zone tapped (blocked while `leftDisabled`)     | `(event: Event)` |
| `click-right` | Right zone tapped (blocked while `rightDisabled`)   | `(event: Event)` |
| `back`        | Fired alongside `click-left` when `leftArrow` is on | `(event: Event)` |
| `back-home`   | Capsule zone tapped                                 | `(event: Event)` |

## Slots

| Slot      | Description                                      |
| --------- | ------------------------------------------------ |
| `capsule` | Custom capsule; suppresses the left zone         |
| `left`    | Left content; overrides `leftArrow` / `leftText` |
| `title`   | Title content; overrides `title`                 |
| `right`   | Right content; overrides `rightText`             |

## Theme variables

| Variable                                        | Purpose                 |
| ----------------------------------------------- | ----------------------- |
| `--sn-mp-color-background-surface`              | Bar background          |
| `--sn-mp-color-text-primary`                    | Title colour            |
| `--sn-mp-color-border-subtle`                   | Bottom hairline         |
| `--sn-mp-color-action-primary`                  | Side action colour      |
| `--sn-mp-font-size-md` / `--sn-mp-font-size-lg` | Action / title size     |
| `--sn-mp-font-weight-medium`                    | Title weight            |
| `--sn-mp-spacing-1` / `--sn-mp-spacing-3`       | Icon gap / side padding |

## Accessibility

- Root carries `role="navigation"` with `aria-label` from `title`.
- Side zones are `role="button"` with `aria-disabled` mirroring the props.
- The fixed-mode placeholder is `aria-hidden="true"` — pure geometry.
- Mobile only: interaction is `tap`; miniprogram has no keyboard focus.

## Dark mode

Every colour in `sn-navbar` comes from `--sn-mp-color-*` with no light `var()` fallback, so it adapts automatically under `.sn-theme-dark`: the background flips to the dark surface, the title and action labels switch to the dark text colours, and the hairline uses the dark border token.

Verify it by wrapping in sn-config-provider 的 theme 设为 dark:

## Related

- Bottom tab bar: [`sn-tabbar`](/en/components/uni/tabbar)
- Side navigation: [`sn-sidebar`](/en/components/uni/sidebar)
