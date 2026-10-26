# Badge · uni-app (Mobile)

`sn-badge` is the marker component of `@snui/uni` (mobile / miniprogram / H5). It annotates icons, avatars and tabs with a count or a status dot. It wraps the target and anchors itself to the top-right corner, so the marker never drifts when the host resizes. Auto-registered via easycom; geometry uses `rpx`.

## Basic usage

Numeric markers with the `max` overflow cap:

<Demo name="badge-mp-basic" description="Numeric markers: plain value, max overflow shown as 99+, five semantic types." />

## Shape and offset

`isDot`, three `shape` values, the `border` ring, and `top` / `right` offsets:

<Demo name="badge-mp-shape" description="isDot dot; shape circle / square / bubble; border ring; top / right offsets; bgColor override." />

## Visibility rules

Four rules decide whether a marker renders; `hidden` wins over all of them:

<Demo name="badge-mp-visibility" description="value=0 hidden by default; showZero reveals 0; hidden forces it off; the count updates live." />

Rule order:

1. `hidden` is true → no marker.
2. `isDot` is true → render a dot (no `value` needed).
3. `value` is absent or an empty string → no marker.
4. `value === 0` and `showZero` is false → no marker.

## Root class and inline style (`customClass` / `customStyle`)

Both props land on the **wrapper** (the root node), not on the marker: `customClass` appends a root class and `customStyle` becomes the root inline style. The marker's own look (`type` / `bgColor` / `top` / `right` / `shape`) is untouched — keep using `bgColor` to recolour the marker.

<Demo name="badge-mp-custom" description="customClass puts a dashed frame on the wrapper; customStyle adds padding and fill; both together; a control showing the marker's own type / bgColor / offsets." />

## Auto registration (easycom)

```vue
<sn-badge :value="8">
  <sn-avatar text="AU" />
</sn-badge>
```

For an explicit import:

```ts
import { SnBadge } from '@snui/uni/components/sn-badge/sn-badge.vue';
```

## Props

| Prop          | Type                                                        | Default     | Description                                              |
| ------------- | ----------------------------------------------------------- | ----------- | -------------------------------------------------------- |
| `value`       | `string \| number`                                          | `undefined` | Displayed value; a number over `max` renders `{max}+`    |
| `max`         | `number`                                                    | `undefined` | Overflow threshold, applied to numeric values only       |
| `top`         | `string \| number`                                          | `undefined` | Vertical nudge from the default anchor; a number is px   |
| `right`       | `string \| number`                                          | `undefined` | Horizontal nudge from the default anchor; a number is px |
| `isDot`       | `boolean`                                                   | `false`     | Dot mode, no label                                       |
| `hidden`      | `boolean`                                                   | `false`     | Hide the marker (wrapped content still renders)          |
| `type`        | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `undefined` | Marker colour; unset falls back to danger red            |
| `bgColor`     | `string`                                                    | `''`        | Inline background override                               |
| `showZero`    | `boolean`                                                   | `false`     | Render a `0` value                                       |
| `shape`       | `'circle' \| 'square' \| 'bubble'`                          | `'circle'`  | Marker outline                                           |
| `border`      | `boolean`                                                   | `false`     | Draw a separating ring in the page background colour     |
| `customClass` | `string`                                                    | `''`        | Extra class on the root node                             |
| `customStyle` | `string`                                                    | `''`        | Inline style on the root node                            |

## Events

None. The marker is decoration; taps belong to the wrapped content.

## Slots

| Slot      | Description                                                  |
| --------- | ------------------------------------------------------------ |
| `default` | The content the marker is anchored to (icon / avatar / text) |

## Theme variables

| Variable                            | Purpose                          |
| ----------------------------------- | -------------------------------- |
| `--sn-mp-color-action-primary`      | `primary` marker fill            |
| `--sn-mp-color-feedback-success`    | `success` type                   |
| `--sn-mp-color-feedback-warning`    | `warning` type                   |
| `--sn-mp-color-feedback-danger`     | `danger` type (also the default) |
| `--sn-mp-color-feedback-info`       | `info` type                      |
| `--sn-mp-color-text-on-primary`     | Marker label                     |
| `--sn-mp-color-background-surface`  | `border` ring colour             |
| `--sn-mp-color-text-primary`        | Doodle skin outline              |
| `--sn-mp-font-size-xs`              | Marker label size                |
| `--sn-mp-font-weight-{medium,bold}` | Marker label weight              |
| `--sn-mp-radius-{sm,lg,full}`       | Circle / square / bubble shape   |

## Accessibility

- Dot mode sets `aria-hidden="true"` on the marker: a bare dot has no text to announce, so exposing it would only add noise.
- A numeric marker stays in the accessibility tree; the wrapped element should carry its own accessible name.
- No interaction, so no keyboard contract.

## Dark mode

Every fill and label colour in `sn-badge` comes from `--sn-mp-color-*` with no light fallback:

- The five `type` fills keep their brand hue in dark mode, so the white label keeps its contrast.
- The `border` ring uses `--sn-mp-color-background-surface`, which flips to near-black in dark mode — so the ring stays a visible separator on a dark page.
- `bgColor` is used verbatim; a light literal will not invert in dark mode, so prefer `var(--sn-mp-*)` for such overrides.

Verify with sn-config-provider 的 theme 设为 dark:

## Related

- Label text: [`sn-tag`](/en/components/uni/tag)
- Avatar: [`sn-avatar`](/en/components/uni/avatar)
