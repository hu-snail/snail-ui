# Switch · uni-app

Cross-end on/off toggle for uni-app (H5 / WeChat MP / App). easycom auto-registration (`components/sn-switch/sn-switch.vue` → `<sn-switch>`); geometry in `rpx`, colors from `--sn-mp-*` tokens.

The value model matches wot-ui: `activeValue` (default `true`) / `inactiveValue` (default `false`) map arbitrary `boolean | string | number` payloads onto the rail state.

## Basic usage

`v-model` binds the value; `change` fires after a successful toggle.

<Demo name="switch-mp-basic" description="v-model + the change event." />

## Appearance (`activeText` / `inactiveText` / `shape` / `size` / `activeColor` / `inactiveColor`)

`activeText` / `inactiveText` render inside the rail (replaced by an icon when `activeIcon` is set); `shape` is `round` or `square`; a numeric `size` is treated as an rpx design value; `activeColor` / `inactiveColor` are user CSS colors applied inline on top of the token defaults.

<Demo name="switch-mp-appearance" description="Rail text, square shape, custom size, custom colors." />

## Guard & states (`activeValue` / `inactiveValue` / `beforeChange` / `loading` / `disabled`)

`beforeChange` may return a boolean or a Promise; returning `false` (or rejecting) vetoes the toggle so nothing is emitted. `loading` shows a spinner in the knob and blocks interaction; `disabled` dims and blocks.

<Demo name="switch-mp-before-change" description="String activeValue/inactiveValue; beforeChange veto; loading; disabled." />
## Icons (`activeActionIcon` / `inactiveActionIcon` / `activeIcon` / `inactiveIcon`)

The knob glyph uses `activeActionIcon` / `inactiveActionIcon` (resolved through the sn-icon registry); the rail glyph uses `activeIcon` / `inactiveIcon` and replaces `activeText` / `inactiveText`. With no icon configured the knob falls back to Check / X.

<Demo name="switch-mp-icons" description="activeActionIcon / inactiveActionIcon knob glyphs; activeIcon / inactiveIcon rail glyphs; glyph mixed with a text label." />

## CSS-class icons (`activeActionCssIcon` / `inactiveActionCssIcon` / `activeCssIcon` / `inactiveCssIcon` / `classPrefix`)

The four `*CssIcon` flags switch the same string from "registry icon name" to "CSS class name"; the host class supplies the styling. `classPrefix` is an informational prefix kept for wd-switch parity (it does not affect rendering).

<Demo name="switch-mp-css-icons" description="activeActionCssIcon / inactiveActionCssIcon; activeCssIcon / inactiveCssIcon; classPrefix." />

## Loading & custom styling (`loadingProps` / `customClass` / `customStyle`)

`loadingProps` is declared for wd-switch parity; this build's spinner is a pure CSS ring (token colors, fixed 24rpx), so **the object currently does not affect rendering**. `customClass` / `customStyle` land on the root node.

<Demo name="switch-mp-loading-custom" description="loading (spinner in the knob); loadingProps (declared but not rendered); customClass; customStyle." />

## Props

| Prop                    | Type                                | Default     | Description                                         |
| ----------------------- | ----------------------------------- | ----------- | --------------------------------------------------- |
| `modelValue`            | `boolean \| string \| number`       | `false`     | Bound value, compared against `activeValue`.        |
| `disabled`              | `boolean`                           | `false`     | Disables and dims the rail.                         |
| `inactiveActionIcon`    | `string`                            | `''`        | Knob icon while inactive (registry name).           |
| `activeActionIcon`      | `string`                            | `''`        | Knob icon while active.                             |
| `activeIcon`            | `string`                            | `''`        | Rail icon while active; overrides `activeText`.     |
| `inactiveIcon`          | `string`                            | `''`        | Rail icon while inactive; overrides `inactiveText`. |
| `classPrefix`           | `string`                            | `'wd-icon'` | Icon class prefix (kept for wot-ui parity).         |
| `inactiveActionCssIcon` | `boolean \| string`                 | `false`     | Treat `inactiveActionIcon` as a CSS class.          |
| `activeActionCssIcon`   | `boolean \| string`                 | `false`     | Treat `activeActionIcon` as a CSS class.            |
| `activeCssIcon`         | `boolean \| string`                 | `false`     | Treat `activeIcon` as a CSS class.                  |
| `inactiveCssIcon`       | `boolean \| string`                 | `false`     | Treat `inactiveIcon` as a CSS class.                |
| `activeText`            | `string`                            | `''`        | Rail label while on.                                |
| `inactiveText`          | `string`                            | `''`        | Rail label while off.                               |
| `activeValue`           | `boolean \| string \| number`       | `true`      | Value meaning "on" (strict equality).               |
| `inactiveValue`         | `boolean \| string \| number`       | `false`     | Value meaning "off".                                |
| `activeColor`           | `string`                            | `''`        | Active rail color (CSS color, inline override).     |
| `inactiveColor`         | `string`                            | `''`        | Inactive rail color.                                |
| `size`                  | `string \| number`                  | —           | Rail size; a number is treated as rpx.              |
| `shape`                 | `'round' \| 'square'`               | `'round'`   | Rail shape.                                         |
| `loading`               | `boolean`                           | `false`     | Spinner in the knob; blocks interaction.            |
| `beforeChange`          | `() => boolean \| Promise<boolean>` | —           | Pre-toggle hook; `false` vetoes.                    |
| `customClass`           | `string`                            | `''`        | Class on the root node.                             |
| `customStyle`           | `string`                            | `''`        | Inline style on the root node.                      |

## Events

| Event               | Description                             | Payload   |
| ------------------- | --------------------------------------- | --------- |
| `update:modelValue` | Toggle accepted (post `beforeChange`)   | `(value)` |
| `change`            | Fires together with `update:modelValue` | `(value)` |

## Slots

None. Rail content comes from `activeText` / `inactiveText` / the icon props.

## Theme variables

| Variable                              | Purpose                  |
| ------------------------------------- | ------------------------ |
| `--sn-mp-color-control-unchecked`     | Inactive rail            |
| `--sn-mp-color-action-primary`        | Active rail + knob glyph |
| `--sn-mp-color-control-knob`          | Knob plate               |
| `--sn-mp-color-text-on-primary`       | Rail label / rail icon   |
| `--sn-mp-radius-full` / `-sm` / `-xs` | Round vs square geometry |
| `--sn-mp-color-border-subtle`         | Loading spinner ring     |

## Accessibility

- Root is `role="switch"` with `aria-checked="true" | "false"`.
- `aria-disabled="true"` when `disabled`.
- `tabindex` drops to `-1` when blocked (disabled / loading / pending).

## Dark mode

Every color resolves through `--sn-mp-color-*` with no light-only fallback, so `.sn-theme-dark` flips the rail, knob plate and rail label (the brand token `--sn-mp-color-action-primary` keeps the same hue in both themes). Verify with:
