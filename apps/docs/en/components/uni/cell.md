# Cell · uni-app

`sn-cell` is the list row of `@snui/uni` (mobile / miniprogram / H5); `sn-cell-group` is its grouping container. Auto-registered via easycom; geometry uses `rpx` so it scales with the device.

## Basic usage

`sn-cell-group` supplies the section heading and the card surface; each `sn-cell` carries a title and its right-hand value:

<Demo name="cell-mp-basic" description="cell-group title / value render the section heading; insert gives the rounded card look; an empty value falls back to placeholder." />

## Links, icons and tap feedback

`is-link` renders the arrow and enables tap feedback, `prefix-icon` / `suffix-icon` resolve through the icon registry, and `arrow-direction` rotates the arrow:

<Demo name="cell-mp-link" description="is-link adds the arrow and tap feedback; prefix-icon adds a leading icon; arrow-direction=down points the arrow down; clickable gives feedback without an arrow." />

## Layout, required marks and alignment

`layout="vertical"` stacks the row, `required` renders the asterisk, and `title-width` / `value-align` control the columns:

<Demo name="cell-mp-layout" description="layout=vertical stacks title over value; required adds the asterisk (asterisk-position moves it); title-width / value-align control width and alignment." />

## Auto registration (easycom)

The component follows the easycom convention, so **no import is needed in a template**:

```vue
<sn-cell-group title="Account">
  <sn-cell title="Username" value="Ada" />
</sn-cell-group>
```

For an explicit import:

```ts
import { SnCell } from '@snui/uni/components/sn-cell/sn-cell.vue';
import { SnCellGroup } from '@snui/uni/components/sn-cell/sn-cell-group.vue';
```

## Props

### sn-cell-group

| Prop          | Type                            | Default        | Description                         |
| ------------- | ------------------------------- | -------------- | ----------------------------------- |
| `title`       | `string`                        | `''`           | Section heading                     |
| `value`       | `string`                        | `''`           | Right-hand group value              |
| `border`      | `boolean`                       | `true`         | Draw the outer border               |
| `insert`      | `boolean`                       | `false`        | Rounded card style                  |
| `size`        | `'default' \| 'large'`          | `'default'`    | Heading size step                   |
| `layout`      | `'horizontal' \| 'vertical'`    | `'horizontal'` | Child layout (inherited)            |
| `valueAlign`  | `'left' \| 'right' \| 'center'` | `'right'`      | Child value alignment (inherited)   |
| `titleWidth`  | `string \| number`              | `undefined`    | Child title width (inherited)       |
| `center`      | `boolean`                       | `false`        | Child vertical centring (inherited) |
| `customClass` | `string`                        | `''`           | Extra class on the root node        |
| `customStyle` | `string`                        | `''`           | Inline style on the root node       |

### sn-cell

| Prop                | Type                                  | Default     | Description                                      |
| ------------------- | ------------------------------------- | ----------- | ------------------------------------------------ |
| `title`             | `string`                              | `''`        | Row title                                        |
| `value`             | `string \| number`                    | `''`        | Right-hand value                                 |
| `placeholder`       | `string`                              | `''`        | Shown only when `value` is empty                 |
| `label`             | `string`                              | `''`        | Description under the title                      |
| `prefixIcon`        | `string`                              | `''`        | Leading icon name                                |
| `suffixIcon`        | `string`                              | `''`        | Trailing icon name                               |
| `iconSize`          | `string \| number`                    | `undefined` | Icon size                                        |
| `iconPrefix`        | `string`                              | `''`        | Iconfont class prefix                            |
| `cssIcon`           | `boolean \| string`                   | `false`     | Render a font icon                               |
| `to`                | `string`                              | `''`        | Target path (forwarded through `click` only)     |
| `replace`           | `boolean`                             | `false`     | Replace history (forwarded through `click` only) |
| `clickable`         | `boolean`                             | `false`     | Enable tap feedback                              |
| `isLink`            | `boolean`                             | `false`     | Render the arrow and enable tap feedback         |
| `arrowDirection`    | `'left' \| 'up' \| 'down' \| 'right'` | `'right'`   | Arrow direction                                  |
| `size`              | `'default' \| 'large'`                | `'default'` | Row size                                         |
| `border`            | `boolean`                             | `undefined` | Inner border (wins over the group)               |
| `titleWidth`        | `string \| number`                    | `undefined` | Title column width                               |
| `center`            | `boolean`                             | `undefined` | Vertical centring                                |
| `layout`            | `'horizontal' \| 'vertical'`          | `undefined` | Row layout                                       |
| `valueAlign`        | `'left' \| 'right' \| 'center'`       | `undefined` | Value alignment                                  |
| `required`          | `boolean`                             | `false`     | Render the required asterisk                     |
| `asteriskPosition`  | `'start' \| 'end'`                    | `'start'`   | Asterisk position                                |
| `hideAsterisk`      | `boolean`                             | `false`     | Hide the asterisk                                |
| `ellipsis`          | `boolean`                             | `false`     | Truncate overflowing content                     |
| `useTitleSlot`      | `boolean`                             | `true`      | Enable the `title` slot                          |
| `useLabelSlot`      | `boolean`                             | `true`      | Enable the `label` slot                          |
| `customClass`       | `string`                              | `''`        | Extra class on the row root                      |
| `customStyle`       | `string`                              | `''`        | Inline style on the row root                     |
| `customPrefixClass` | `string`                              | `''`        | Extra class on the leading icon                  |
| `customSuffixClass` | `string`                              | `''`        | Extra class on the trailing icon                 |
| `customLabelClass`  | `string`                              | `''`        | Extra class on the label area                    |
| `customValueClass`  | `string`                              | `''`        | Extra class on the value area                    |
| `customTitleClass`  | `string`                              | `''`        | Extra class on the title area                    |

## Events

| Event   | Description                              | Payload          |
| ------- | ---------------------------------------- | ---------------- |
| `click` | Row tapped while `clickable` or `isLink` | `(event: Event)` |

> **Routing**: `to` / `replace` are forwarded through `click` only — the component never navigates by itself, because routing belongs to the host AppBridge capability (AGENTS.md §60).

## Slots

| Slot      | Description                                    |
| --------- | ---------------------------------------------- |
| `prefix`  | Leading icon area                              |
| `title`   | Title area (when `useTitleSlot` is true)       |
| `label`   | Description area (when `useLabelSlot` is true) |
| `default` | Right-hand value area                          |
| `suffix`  | Trailing icon area (when `isLink` is false)    |

## Theme variables

| Variable                                                        | Purpose                        |
| --------------------------------------------------------------- | ------------------------------ |
| `--sn-mp-color-background-surface`                              | Row and group surface          |
| `--sn-mp-color-background-soft`                                 | Tap feedback fill              |
| `--sn-mp-color-border-subtle`                                   | Inner border and group outline |
| `--sn-mp-color-text-primary`                                    | Title colour                   |
| `--sn-mp-color-text-secondary`                                  | Label, value and icon colour   |
| `--sn-mp-color-text-tertiary`                                   | Arrow colour                   |
| `--sn-mp-color-input-placeholder`                               | Placeholder colour             |
| `--sn-mp-color-feedback-danger`                                 | Required asterisk              |
| `--sn-mp-font-size-md` / `--sn-mp-font-size-lg`                 | Default / large sizes          |
| `--sn-mp-font-size-sm`                                          | Description size               |
| `--sn-mp-font-weight-medium`                                    | Group heading weight           |
| `--sn-mp-radius-lg`                                             | `insert` corner radius         |
| `--sn-mp-spacing-2` / `--sn-mp-spacing-3` / `--sn-mp-spacing-4` | Heading / row / icon spacing   |

## Accessibility

- Interactive rows (`clickable` / `isLink`) are `role="button"` with `aria-label` from `title`; static rows carry no role.
- The required asterisk is `aria-hidden="true"`; the required semantics belong to the host form layer.
- Arrows and icons are decorative; the title carries the meaning.
- Mobile only: interaction is `tap`; miniprogram has no keyboard focus.

## Dark mode

Every colour in `sn-cell` and `sn-cell-group` comes from `--sn-mp-color-*` with no light `var()` fallback, so they adapt automatically under `.sn-theme-dark`: surfaces flip to the dark surface, dividers use the dark border token, the title moves to the dark primary text while value and label use the dark secondary text, and the asterisk keeps the danger hue.

Verify it by wrapping in sn-config-provider 的 theme 设为 dark:

## Related

- Form rows: [`sn-form-item`](/en/components/uni/form)
- Collapse panels: [`sn-collapse`](/en/components/uni/collapse)
- Grid: [`sn-grid`](/en/components/uni/grid)
