# Sidebar · uni-app

`sn-sidebar` is the vertical side-navigation container of `@snui/uni` (mobile / miniprogram / H5); `sn-sidebar-item` is a single entry. Auto-registered via easycom; geometry uses `rpx` so it scales with the device.

## Basic usage

`v-model` binds the active value; the host drives the right-hand panel from `change`:

<Demo name="sidebar-mp-basic" description="v-model binds the value; each item renders its label; the panel is driven by change." />

## Icons and badges

`icon` resolves through the icon registry, `badge` / `isDot` render markers, and `disabled` blocks the switch:

<Demo name="sidebar-mp-badge" description="icon renders an icon; badge renders a numeric marker; is-dot renders a dot; disabled blocks the entry." />

## Switch guard and the select method

`before-change` runs before a switch and `false` vetoes it; `select(value, label)` on a template ref drives the sidebar from code; `max` on an item caps the badge:

<Demo name="sidebar-mp-guard" description="before-change blocks the first two switches; ref.select() switches from code; max caps the badge." />

## Auto registration (easycom)

The component follows the easycom convention, so **no import is needed in a template**:

```vue
<sn-sidebar v-model="active">
  <sn-sidebar-item label="All" :value="0" />
</sn-sidebar>
```

For an explicit import:

```ts
import { SnSidebar } from '@snui/uni/components/sn-sidebar/sn-sidebar.vue';
import { SnSidebarItem } from '@snui/uni/components/sn-sidebar/sn-sidebar-item.vue';
```

## Props

### sn-sidebar

| Prop           | Type                                     | Default     | Description                          |
| -------------- | ---------------------------------------- | ----------- | ------------------------------------ |
| `modelValue`   | `string \| number`                       | `0`         | Active value                         |
| `beforeChange` | `(value) => boolean \| Promise<boolean>` | `undefined` | Veto hook; `false` blocks the switch |
| `customClass`  | `string`                                 | `''`        | Extra class on the root node         |
| `customStyle`  | `string`                                 | `''`        | Inline style on the root node        |

### sn-sidebar-item

| Prop          | Type                | Default     | Description                                      |
| ------------- | ------------------- | ----------- | ------------------------------------------------ |
| `label`       | `string`            | `''`        | Entry title                                      |
| `value`       | `string \| number`  | `undefined` | Entry value (falls back to `label`)              |
| `badge`       | `string \| number`  | `undefined` | Badge value                                      |
| `icon`        | `string`            | `''`        | Icon name (registered via `registerSnIcons()`)   |
| `iconPrefix`  | `string`            | `''`        | Iconfont class prefix                            |
| `cssIcon`     | `boolean \| string` | `false`     | Render a font icon; a string is the class prefix |
| `isDot`       | `boolean`           | `false`     | Render a text-less dot badge                     |
| `max`         | `number`            | `99`        | Badge ceiling; above it renders `{max}+`         |
| `disabled`    | `boolean`           | `false`     | Disable this entry                               |
| `customClass` | `string`            | `''`        | Extra class on the entry root                    |
| `customStyle` | `string`            | `''`        | Inline style on the entry root                   |

## Events

| Event               | Description           | Payload                     |
| ------------------- | --------------------- | --------------------------- |
| `update:modelValue` | Active value changed  | `(value: string \| number)` |
| `change`            | Active entry switched | `({ value, label })`        |

## Slots

| Slot                | Description         |
| ------------------- | ------------------- |
| `default` (sidebar) | SidebarItem list    |
| `icon` (item)       | Custom icon content |

## Theme variables

| Variable                                    | Purpose                         |
| ------------------------------------------- | ------------------------------- |
| `--sn-mp-color-background-soft`             | Sidebar track                   |
| `--sn-mp-color-background-surface`          | Active entry surface            |
| `--sn-mp-color-text-secondary`              | Inactive label                  |
| `--sn-mp-color-text-disabled`               | Disabled label                  |
| `--sn-mp-color-action-primary`              | Active label and left indicator |
| `--sn-mp-color-feedback-danger`             | Badge fill                      |
| `--sn-mp-color-text-on-primary`             | Badge text                      |
| `--sn-mp-font-size-md`                      | Entry label size                |
| `--sn-mp-font-weight-medium`                | Active label weight             |
| `--sn-mp-radius-xs` / `--sn-mp-radius-full` | Indicator / badge radius        |
| `--sn-mp-spacing-3`                         | Entry padding                   |

## Accessibility

- The container is `role="tablist"` with `aria-orientation="vertical"`.
- Every entry is `role="tab"` with `aria-selected`, `aria-disabled` and `aria-label` from `label`.
- Badges are decorative text inside the entry; the label carries the meaning.
- Mobile only: interaction is `tap`; miniprogram has no keyboard focus.

## Dark mode

Every colour in `sn-sidebar` comes from `--sn-mp-color-*` with no light `var()` fallback, so it adapts automatically under `.sn-theme-dark`: the track flips to the dark soft surface, the active entry to the dark surface colour, and the active label plus indicator keep the brand hue.

Verify it by wrapping in sn-config-provider 的 theme 设为 dark:

## Related

- Tabs: [`sn-tabs`](/en/components/uni/tabs)
- Segmented control: [`sn-segmented`](/en/components/uni/segmented)
- Index bar: [`sn-index-bar`](/en/components/uni/index-bar)
