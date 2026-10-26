# Tabs · uni-app

`sn-tabs` is the horizontal tab navigation container of `@snui/uni` (mobile / miniprogram / H5); `sn-tab` is a single pane. Auto-registered via easycom; geometry uses `rpx` so it scales with the device.

## Basic usage

`v-model` binds the active index or name; each `sn-tab` carries a title and its panel content:

<Demo name="tabs-mp-basic" description="v-model binds the active index; sn-tab renders the title in the strip and the default slot as the panel." />

## Bar styles and disabled tabs

`line-theme` switches the active-bar shape, `sticky` pins the strip, and `disabled` blocks the switch while emitting `disabled`:

<Demo name="tabs-mp-line" description="line-theme=underline draws an underline; sticky pins the strip; a disabled tab only emits the disabled event." />

## Scroll navigation and colour overrides

`slidable-num` is the tab-count threshold that turns scrolling on, `slidable="always"` forces it, and `show-scrollbar` reveals the scrollbar; `color` / `inactive-color` override the label colour inline; `custom-class` / `custom-style` land on the root:

<Demo name="tabs-mp-scroll" description="slidable-num threshold turns scrolling on; slidable=always forces it; show-scrollbar and colour overrides." />

## Animation / gesture / bar sizing

`animated` + `duration` drive the active-bar transition, `swipeable` enables the panel gesture, `line-width` / `line-height` size the bar, and `sticky` + `offset-top` control pinning:

<Demo name="tabs-mp-animate" description="animated / duration / swipeable; line-width / line-height; sticky + offset-top; string sizing with line-theme=dot." />

## Auto registration (easycom)

The component follows the easycom convention, so **no import is needed in a template**:

```vue
<sn-tabs v-model="active">
  <sn-tab title="All" :name="0">Content</sn-tab>
</sn-tabs>
```

For an explicit import:

```ts
import { SnTabs } from '@snui/uni/components/sn-tabs/sn-tabs.vue';
import { SnTab } from '@snui/uni/components/sn-tabs/sn-tab.vue';
```

## Props

### sn-tabs

| Prop            | Type                                         | Default     | Description                                          |
| --------------- | -------------------------------------------- | ----------- | ---------------------------------------------------- |
| `modelValue`    | `number \| string`                           | `0`         | Active index or name                                 |
| `slidableNum`   | `number`                                     | `6`         | Tab count that turns on scrolling                    |
| `mapNum`        | `number`                                     | `10`        | Navigation-map threshold (not implemented, see note) |
| `mapTitle`      | `string`                                     | `''`        | Navigation-map title (not implemented, see note)     |
| `sticky`        | `boolean`                                    | `false`     | Pin the strip                                        |
| `offsetTop`     | `number`                                     | `0`         | Sticky offset in px                                  |
| `swipeable`     | `boolean`                                    | `false`     | Enable swipe-to-switch                               |
| `lineTheme`     | `'normal' \| 'text' \| 'underline' \| 'dot'` | `'normal'`  | Active-bar style                                     |
| `lineWidth`     | `number \| string`                           | `undefined` | Bar width (numbers are px)                           |
| `lineHeight`    | `number \| string`                           | `undefined` | Bar height (numbers are px)                          |
| `color`         | `string`                                     | `''`        | Active label colour override                         |
| `inactiveColor` | `string`                                     | `''`        | Inactive label colour override                       |
| `animated`      | `boolean`                                    | `false`     | Animate the switch                                   |
| `duration`      | `number`                                     | `300`       | Animation duration in ms                             |
| `slidable`      | `'auto' \| 'always'`                         | `'auto'`    | Scroll-navigation mode                               |
| `showScrollbar` | `boolean`                                    | `false`     | Show the scrollbar while scrolling                   |
| `customClass`   | `string`                                     | `''`        | Extra class on the root node                         |
| `customStyle`   | `string`                                     | `''`        | Inline style on the root node                        |

### sn-tab

| Prop          | Type               | Default     | Description                           |
| ------------- | ------------------ | ----------- | ------------------------------------- |
| `name`        | `number \| string` | `undefined` | Unique value; falls back to the index |
| `title`       | `string`           | `''`        | Tab title                             |
| `disabled`    | `boolean`          | `false`     | Disable the tab                       |
| `lazy`        | `boolean`          | `true`      | Defer content until first activation  |
| `customClass` | `string`           | `''`        | Extra class on the pane root          |
| `customStyle` | `string`           | `''`        | Inline style on the pane root         |

> **Not implemented**: `mapNum` / `mapTitle` drive wot-ui's navigation-map overlay, which needs per-tab width measurement plus a floating panel. The props stay in the surface for contract parity, but the uni implementation renders no map; use `slidable="always"` with your own `scroll-view` when you need it.

## Events

| Event               | Description                                 | Payload                     |
| ------------------- | ------------------------------------------- | --------------------------- |
| `update:modelValue` | Active item changed                         | `(value: number \| string)` |
| `change`            | Active item changed                         | `({ index, name })`         |
| `click`             | Tab title tapped (including the active one) | `({ index, name })`         |
| `disabled`          | Disabled tab tapped                         | `({ index, name })`         |

## Slots

| Slot             | Description                  |
| ---------------- | ---------------------------- |
| `default` (tabs) | Tab list (`sn-tab` children) |
| `default` (tab)  | Panel content                |

## Theme variables

| Variable                                  | Purpose                     |
| ----------------------------------------- | --------------------------- |
| `--sn-mp-color-background-surface`        | Strip and panel background  |
| `--sn-mp-color-text-secondary`            | Inactive label              |
| `--sn-mp-color-text-disabled`             | Disabled label              |
| `--sn-mp-color-action-primary`            | Active label and active bar |
| `--sn-mp-color-text-primary`              | Panel body text             |
| `--sn-mp-font-size-md`                    | Label size                  |
| `--sn-mp-font-weight-medium`              | Active label weight         |
| `--sn-mp-spacing-2` / `--sn-mp-spacing-4` | Strip padding / tab padding |
| `--sn-mp-radius-full`                     | Dot bar radius              |

## Accessibility

- The strip is `role="tablist"` and every tab is `role="tab"`.
- `aria-selected` follows the active state, `aria-disabled` mirrors `disabled`, `aria-label` comes from `title`.
- Panels are `role="tabpanel"` with `aria-hidden="true"` while inactive.
- Mobile only: interaction is `tap`; miniprogram has no keyboard focus.

## Dark mode

Every colour in `sn-tabs` comes from `--sn-mp-color-*` with no light `var()` fallback, so it adapts automatically under `.sn-theme-dark`: the strip and panel backgrounds flip to the dark surface, inactive labels move to the dark secondary text colour, and the active item keeps the brand hue.

Verify it by wrapping in sn-config-provider 的 theme 设为 dark:

## Related

- Segmented control: [`sn-segmented`](/en/components/uni/segmented)
- Bottom tab bar: [`sn-tabbar`](/en/components/uni/tabbar)
- Collapse panels: [`sn-collapse`](/en/components/uni/collapse)
