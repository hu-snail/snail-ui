# Tabs · uni-app

`sn-tabs` is the horizontal tab navigation container of `@snui/uni` (mobile / miniprogram / H5); `sn-tab` is a single pane. Auto-registered via easycom; geometry uses `rpx` so it scales with the device.

## When to use

- One region carries several peer content groups that switch horizontally (order states, channels, reporting periods).
- The tab count overflows one screen and the strip must scroll, keeping the selection in view.
- A card-segment or pill look is wanted, or tabs need icons and badges.
- The content area should page with a horizontal swipe gesture.

## Basic usage

`v-model` binds the active index or name; each `sn-tab` carries a title and its panel content:

<Demo name="tabs-mp-basic" description="v-model bound to the index and to the name; sn-tab renders the title in the strip and the default slot as the panel." />

## Nav form and active emphasis

`type` controls the strip form (`line` underline / `card` card segment / `tag` standalone pills) and `active-theme` controls how the active item is emphasised (`text` text only / `fill` soft rounded background / `pill` solid pill). The two combine freely:

<Demo name="tabs-mp-type" description="type=line/card/tag forms; active-theme=text/fill/pill emphasis; any combination works." />

## Tab icons and badges

`sn-tab`'s `icon` takes icon data or a registered / built-in icon name, `icon-image` takes an image address and wins over `icon`; `badge-props` is forwarded to `sn-badge` for a numeric or dot badge:

<Demo name="tabs-mp-icon" description="icon as data and as a name; badge-props numeric value, overflow cap, dot badge and semantic colours." />

## Badge configuration

The full `badge-props` surface: `value` / `max` / `isDot` / `type` / `showZero` / `hidden` / `shape` / `border` / `top` / `right`:

<Demo name="tabs-mp-badge" description="Numeric badges with semantic colours; dot badge, zero value and hidden; buttons change the config live." />

## Bar styles and disabled tabs

`line-theme` switches the active-bar shape, `line-width` / `line-height` override its size, `sticky` pins the strip, and `disabled` blocks the switch while emitting `disabled`:

<Demo name="tabs-mp-line" description="line-theme=normal/underline/dot; line-width/line-height overrides; sticky + offset-top; a disabled tab only emits the disabled event." />

## Scroll navigation and auto scroll-into-view

`slidable-num` is the tab-count threshold that turns scrolling on, `slidable="always"` forces it, and `show-scrollbar` reveals the scrollbar; the selected tab (by tap or an external value write) scrolls into view through `scroll-into-view`, and `animated` makes that scroll transition:

<Demo name="tabs-mp-scroll" description="slidable-num threshold turns scrolling on; slidable=always forces it; the selection scrolls into view (an external value write works too)." />

## Content-area swipe

`swipeable` swaps the content area for a native `swiper`: horizontal gestures page through the tabs and each `sn-tab` renders as a `swiper-item`; `duration` is also the slide duration, `swiper-easing` configures the easing, and `swiper-height` fixes the content height. Swiping onto a disabled pane snaps back:

<Demo name="tabs-mp-swiper" description="swipeable native swiper body; duration / swiper-easing / swiper-height; swiping onto a disabled pane snaps back." />

## Composed with a paged list

Pane content belongs to the host — `sn-tabs` renders only the strip and the panel container — so `sn-paging` drops straight into a pane; `sn-tab` defaults to `lazy`, so the pane mounts on first activation and the list's first query follows the first tab switch:

<Demo name="tabs-mp-paging" description="Each pane hosts an sn-paging list; pull-to-refresh and load-more; the lazy pane defers the first query to the first switch." />

## Switch animation and sticky pinning

`animated` + `duration` drive the bar transition and the strip scroll animation, `sticky` + `offset-top` control pinning:

<Demo name="tabs-mp-animate" description="animated / duration; sticky + offset-top; inline line-width / line-height." />

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

| Prop            | Type                                                                           | Default     | Description                                                              |
| --------------- | ------------------------------------------------------------------------------ | ----------- | ------------------------------------------------------------------------ |
| `modelValue`    | `number \| string`                                                             | `0`         | Active index or name                                                     |
| `slidableNum`   | `number`                                                                       | `6`         | Tab count that turns on scrolling                                        |
| `mapNum`        | `number`                                                                       | `10`        | Navigation-map threshold (not implemented, see note)                     |
| `mapTitle`      | `string`                                                                       | `''`        | Navigation-map title (not implemented, see note)                         |
| `sticky`        | `boolean`                                                                      | `false`     | Pin the strip                                                            |
| `offsetTop`     | `number`                                                                       | `0`         | Sticky offset in px                                                      |
| `swipeable`     | `boolean`                                                                      | `false`     | Enable swipe-to-switch (the content area renders as a native `swiper`)   |
| `lineTheme`     | `'normal' \| 'text' \| 'underline' \| 'dot'`                                   | `'normal'`  | Active-bar style                                                         |
| `lineWidth`     | `number \| string`                                                             | `undefined` | Bar width (numbers are px)                                               |
| `lineHeight`    | `number \| string`                                                             | `undefined` | Bar height (numbers are px)                                              |
| `color`         | `string`                                                                       | `''`        | Active label colour override                                             |
| `inactiveColor` | `string`                                                                       | `''`        | Inactive label colour override                                           |
| `animated`      | `boolean`                                                                      | `false`     | Animate the switch (also turns on the strip scroll transition)           |
| `duration`      | `number`                                                                       | `300`       | Animation duration in ms; also the content slide duration in swiper mode |
| `slidable`      | `'auto' \| 'always'`                                                           | `'auto'`    | Scroll-navigation mode                                                   |
| `showScrollbar` | `boolean`                                                                      | `false`     | Show the scrollbar while scrolling                                       |
| `type`          | `'line' \| 'card' \| 'tag'`                                                    | `'line'`    | Strip form: underline / card segment / standalone pills                  |
| `activeTheme`   | `'text' \| 'fill' \| 'pill'`                                                   | `'text'`    | Active emphasis: text only / soft rounded background / solid pill        |
| `swiperEasing`  | `'default' \| 'linear' \| 'easeInCubic' \| 'easeOutCubic' \| 'easeInOutCubic'` | `'default'` | Content swiper easing (`swipeable` only; `default` leaves it unset)      |
| `swiperHeight`  | `number \| string`                                                             | `''`        | Content swiper height (numbers are px, strings forwarded verbatim)       |
| `customClass`   | `string`                                                                       | `''`        | Extra class on the root node                                             |
| `customStyle`   | `string`                                                                       | `''`        | Inline style on the root node                                            |

### sn-tab

| Prop          | Type                 | Default     | Description                                                            |
| ------------- | -------------------- | ----------- | ---------------------------------------------------------------------- |
| `name`        | `number \| string`   | `undefined` | Unique value; falls back to the index                                  |
| `title`       | `string`             | `''`        | Tab title                                                              |
| `disabled`    | `boolean`            | `false`     | Disable the tab                                                        |
| `lazy`        | `boolean`            | `true`      | Defer content until first activation                                   |
| `icon`        | `IconData \| string` | `undefined` | Icon left of the title: icon data or a registered / built-in icon name |
| `iconImage`   | `string`             | `''`        | Icon image address (URL / base64); wins over `icon`                    |
| `badgeProps`  | `object`             | `undefined` | Badge config forwarded to `sn-badge` (see below)                       |
| `customClass` | `string`             | `''`        | Extra class on the pane root                                           |
| `customStyle` | `string`             | `''`        | Inline style on the pane root                                          |

`badgeProps` accepts:

| Field                         | Type                                                        | Description                                        |
| ----------------------------- | ----------------------------------------------------------- | -------------------------------------------------- |
| `value`                       | `string \| number`                                          | Display value; a number above `max` shows `{max}+` |
| `max`                         | `number`                                                    | Numeric cap                                        |
| `isDot`                       | `boolean`                                                   | Draw a dot instead of a value                      |
| `hidden`                      | `boolean`                                                   | Hide the badge (content still renders)             |
| `type`                        | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | Semantic colour; danger red by default             |
| `bgColor`                     | `string`                                                    | Inline background override                         |
| `showZero`                    | `boolean`                                                   | Render `0` too (hidden by default)                 |
| `shape`                       | `'circle' \| 'square' \| 'bubble'`                          | Marker shape                                       |
| `border`                      | `boolean`                                                   | Draw the surface-coloured separator ring           |
| `top`                         | `string \| number`                                          | Vertical nudge (numbers are px)                    |
| `right`                       | `string \| number`                                          | Horizontal nudge (numbers are px)                  |
| `customClass` / `customStyle` | `string`                                                    | Forwarded to the badge root                        |

> **Not implemented**: `mapNum` / `mapTitle` drive the navigation-map overlay, which needs per-tab width measurement plus a floating panel. The props stay in the surface for contract parity, but the uni implementation renders no map; use `slidable="always"` with your own `scroll-view` when you need it.

## Events

| Event               | Description                                 | Payload                     |
| ------------------- | ------------------------------------------- | --------------------------- |
| `update:modelValue` | Active item changed                         | `(value: number \| string)` |
| `change`            | Active item changed                         | `({ index, name })`         |
| `click`             | Tab title tapped (including the active one) | `({ index, name })`         |
| `disabled`          | Disabled tab tapped                         | `({ index, name })`         |

## Methods

| Method        | Type                                | Description                     |
| ------------- | ----------------------------------- | ------------------------------- |
| `setActive`   | `(value: number \| string) => void` | Set the active item (no events) |
| `activeIndex` | `number`                            | Index of the active item        |

## Slots

| Slot             | Description                  |
| ---------------- | ---------------------------- |
| `default` (tabs) | Tab list (`sn-tab` children) |
| `default` (tab)  | Panel content                |

## Theme variables

| Variable                                                          | Purpose                                     |
| ----------------------------------------------------------------- | ------------------------------------------- |
| `--sn-mp-color-background-surface`                                | Strip and panel background                  |
| `--sn-mp-color-background-subtle`                                 | Card-segment container background           |
| `--sn-mp-color-border-default`                                    | Card-segment / pill outline                 |
| `--sn-mp-color-text-secondary`                                    | Inactive label                              |
| `--sn-mp-color-text-disabled`                                     | Disabled label                              |
| `--sn-mp-color-text-on-primary`                                   | Inverted label on a solid pill              |
| `--sn-mp-color-action-primary`                                    | Active label and active bar                 |
| `--sn-mp-color-action-primary-soft`                               | Soft active background (`activeTheme=fill`) |
| `--sn-mp-color-text-primary`                                      | Panel body text                             |
| `--sn-mp-font-size-md`                                            | Label size                                  |
| `--sn-mp-font-weight-medium`                                      | Active label weight                         |
| `--sn-mp-spacing-1` ~ `--sn-mp-spacing-4`                         | Tab padding and icon gap                    |
| `--sn-mp-radius-sm` / `--sn-mp-radius-md` / `--sn-mp-radius-full` | Card / pill radii, dot bar                  |
| `--sn-mp-icon-size-small`                                         | Nav icon size                               |

## Accessibility

- The strip is `role="tablist"` and every tab is `role="tab"`.
- `aria-selected` follows the active state, `aria-disabled` mirrors `disabled`, `aria-label` comes from `title`.
- Panels are `role="tabpanel"` with `aria-hidden="true"` while inactive.
- Icons and badges are `aria-hidden`, so they never enter the accessible name.
- Mobile only: interaction is `tap`; miniprogram has no keyboard focus.

## Dark mode

Every colour in `sn-tabs` comes from `--sn-mp-color-*` with no light `var()` fallback, so it adapts automatically under `.sn-theme-dark`: the strip and panel backgrounds flip to the dark surface, inactive labels move to the dark secondary text colour, the active item keeps the brand hue, and the card-segment container plus pill outlines follow the dark border.

Verify it by wrapping in `sn-config-provider` with `theme="dark"`.

## Related

- Segmented control: [`sn-segmented`](/en/components/uni/segmented)
- Bottom tab bar: [`sn-tabbar`](/en/components/uni/tabbar)
- Collapse panels: [`sn-collapse`](/en/components/uni/collapse)
