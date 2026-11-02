# Tabbar · uni-app

`sn-tabbar` is the bottom tab bar of `@snui/uni` (mobile / miniprogram / H5); `sn-tabbar-item` is a single tab. Auto-registered via easycom; geometry uses `rpx` so it scales with the device.

## Basic usage

`v-model` binds the active index or item name; each `sn-tabbar-item` carries an icon and a label. The playground pins the bar to the viewport bottom with `fixed` + `placeholder` and exposes every knob as a live setting: mode (standard / glass / elevated center action), top border, bottom safe area, placeholder, badges and active colour:

<Demo name="tabbar-mp-playground" description="Full playground: the bar is fixed to the screen bottom; mode (standard / glass / elevate), top border, safe area, placeholder, badges and active colour all switch live." />

## Auto registration (easycom)

The component follows the easycom convention, so **no import is needed in a template**:

```vue
<sn-tabbar v-model="active">
  <sn-tabbar-item title="Home" icon="Home" />
</sn-tabbar>
```

For an explicit import:

```ts
import { SnTabbar } from '@snui/uni/components/sn-tabbar/sn-tabbar.vue';
import { SnTabbarItem } from '@snui/uni/components/sn-tabbar/sn-tabbar-item.vue';
```

## Props

### sn-tabbar

| Prop                  | Type                                      | Default     | Description                                                 |
| --------------------- | ----------------------------------------- | ----------- | ----------------------------------------------------------- |
| `modelValue`          | `number \| string`                        | `0`         | Active index or item name                                   |
| `fixed`               | `boolean`                                 | `false`     | Pin the bar to the bottom                                   |
| `bordered`            | `boolean`                                 | `false`     | Hairline top border                                         |
| `safeAreaInsetBottom` | `boolean`                                 | `false`     | Bottom safe-area padding                                    |
| `shape`               | `'default' \| 'round'`                    | `'default'` | Bar shape                                                   |
| `activeColor`         | `string`                                  | `''`        | Active item colour (icon + label, empty = token default)    |
| `inactiveColor`       | `string`                                  | `''`        | Inactive item colour (icon + label, empty = token default)  |
| `placeholder`         | `boolean`                                 | `false`     | Reserve the bar height in flow when fixed                   |
| `zIndex`              | `number`                                  | `10`        | Stacking level (written only when fixed)                    |
| `glass`               | `boolean`                                 | `false`     | Glass style: translucent surface + backdrop blur (additive) |
| `elevate`             | `{ index: number; icon: string } \| null` | `null`      | Raised round center action (additive)                       |
| `beforeChange`        | `(value) => boolean \| Promise<boolean>`  | `undefined` | Veto hook; `false` blocks the switch                        |
| `customClass`         | `string`                                  | `''`        | Extra class on the root node                                |
| `customStyle`         | `string`                                  | `''`        | Inline style on the root node                               |

### sn-tabbar-item

| Prop          | Type                | Default     | Description                                      |
| ------------- | ------------------- | ----------- | ------------------------------------------------ |
| `title`       | `string`            | `''`        | Tab label                                        |
| `name`        | `number \| string`  | `undefined` | Unique value; falls back to the item index       |
| `icon`        | `string`            | `''`        | Icon name (registered via `registerSnIcons()`)   |
| `iconPrefix`  | `string`            | `''`        | Iconfont class prefix                            |
| `cssIcon`     | `boolean \| string` | `false`     | Render a font icon; a string is the class prefix |
| `value`       | `number \| string`  | `undefined` | Badge value                                      |
| `isDot`       | `boolean`           | `false`     | Render a text-less dot badge                     |
| `max`         | `number`            | `99`        | Badge ceiling; above it renders `{max}+`         |
| `customClass` | `string`            | `''`        | Extra class on the item root                     |
| `customStyle` | `string`            | `''`        | Inline style on the item root                    |

## Events

| Event               | Description          | Payload                     |
| ------------------- | -------------------- | --------------------------- |
| `update:modelValue` | Active value changed | `(value: number \| string)` |
| `change`            | Active value changed | `({ value })`               |

## Slots

| Slot               | Description                            |
| ------------------ | -------------------------------------- |
| `default` (tabbar) | TabbarItem list                        |
| `default` (item)   | Whole item content; scope `{ active }` |
| `icon` (item)      | Icon area; scope `{ active }`          |

## Theme variables

| Variable                                    | Purpose                 |
| ------------------------------------------- | ----------------------- |
| `--sn-mp-color-background-surface`          | Bar background          |
| `--sn-mp-color-border-subtle`               | Top hairline            |
| `--sn-mp-color-text-secondary`              | Inactive label          |
| `--sn-mp-color-action-primary`              | Active label            |
| `--sn-mp-color-feedback-danger`             | Badge fill              |
| `--sn-mp-color-text-on-primary`             | Badge text              |
| `--sn-mp-icon-size-large`                   | Font-icon glyph size    |
| `--sn-mp-font-size-xs`                      | Label / badge size      |
| `--sn-mp-radius-full` / `--sn-mp-spacing-1` | Pill radius / icon gap  |
| `--sn-mp-shadow-md`                         | `round` shape elevation |

## Accessibility

- The bar root is `role="tablist"` and every item is `role="tab"`.
- `aria-selected` follows the active state and `aria-label` comes from `title`.
- Badges are decorative text inside the tab; the tab label carries the meaning.
- Mobile only: interaction is `tap`; miniprogram has no keyboard focus.

## Dark mode

Every colour in `sn-tabbar` comes from `--sn-mp-color-*` with no light `var()` fallback, so it adapts automatically under `.sn-theme-dark`: background and top hairline flip to the dark tokens, the active / inactive labels keep the brand and secondary text colours, and the badge red stays recognisable.

Verify it by wrapping the bar in `sn-config-provider` with `theme="dark"`:

## Related

- Top navigation: [`sn-navbar`](/en/components/uni/navbar)
- Segmented control: [`sn-segmented`](/en/components/uni/segmented)
