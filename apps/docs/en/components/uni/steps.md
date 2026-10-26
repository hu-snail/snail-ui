# Steps · uni-app

`sn-steps` is the step-progress container of `@snui/uni` (mobile / miniprogram / H5); `sn-step` is a single step. Auto-registered via easycom; geometry uses `rpx` so it scales with the device.

## Basic usage

`active` sets the current step index; earlier steps are marked finished automatically:

<Demo name="steps-mp-basic" description="active sets the current step; earlier steps become finished, the current one process, later ones wait." />

## Vertical / dot / error states

`vertical` stacks the steps, `dot` renders dot indicators, and `status` overrides a single step:

<Demo name="steps-mp-vertical" description="vertical stacks the steps; status=error overrides one step; dot renders dot indicators." />

## Spacing, centring and explicit status

`space` overrides the indicator gap, `align-center` centres a horizontal row, and `status` overrides the value derived from `active`; the `icon` / `title` / `description` slots replace their region entirely:

<Demo name="steps-mp-space" description="space=120rpx with align-center; explicit status overrides; icon / title / description slots." />

## Auto registration (easycom)

The component follows the easycom convention, so **no import is needed in a template**:

```vue
<sn-steps :active="1">
  <sn-step title="Order placed" description="Submitted" />
</sn-steps>
```

For an explicit import:

```ts
import { SnSteps } from '@snui/uni/components/sn-steps/sn-steps.vue';
import { SnStep } from '@snui/uni/components/sn-steps/sn-step.vue';
```

## Props

### sn-steps

| Prop          | Type      | Default | Description                                  |
| ------------- | --------- | ------- | -------------------------------------------- |
| `active`      | `number`  | `0`     | Active step index                            |
| `vertical`    | `boolean` | `false` | Vertical layout                              |
| `dot`         | `boolean` | `false` | Dot indicators                               |
| `space`       | `string`  | `''`    | Step spacing (auto by default)               |
| `alignCenter` | `boolean` | `false` | Centre horizontally (horizontal layout only) |
| `customClass` | `string`  | `''`    | Extra class on the root node                 |
| `customStyle` | `string`  | `''`    | Inline style on the root node                |

### sn-step

| Prop          | Type                                           | Default     | Description                                         |
| ------------- | ---------------------------------------------- | ----------- | --------------------------------------------------- |
| `title`       | `string`                                       | `''`        | Step title                                          |
| `description` | `string`                                       | `''`        | Step description                                    |
| `icon`        | `string`                                       | `''`        | Step icon name (registered via `registerSnIcons()`) |
| `status`      | `'finished' \| 'process' \| 'error' \| 'wait'` | `undefined` | Step state (derived from `active` when omitted)     |
| `customClass` | `string`                                       | `''`        | Extra class on the step root                        |
| `customStyle` | `string`                                       | `''`        | Inline style on the step root                       |

## Events

Neither `sn-steps` nor `sn-step` emits: the state is driven entirely by the `active` prop (AGENTS.md §18 — the runtime renders state, it does not own business transitions).

## Slots

| Slot                 | Description             |
| -------------------- | ----------------------- |
| `default` (steps)    | Step list               |
| `icon` (step)        | Custom step icon        |
| `title` (step)       | Custom step title       |
| `description` (step) | Custom step description |

## Theme variables

| Variable                                        | Purpose                                         |
| ----------------------------------------------- | ----------------------------------------------- |
| `--sn-mp-color-background-surface`              | Indicator and step surface                      |
| `--sn-mp-color-border-default`                  | Indicator ring and connector                    |
| `--sn-mp-color-border-subtle`                   | Dot-mode connector                              |
| `--sn-mp-color-text-secondary`                  | Wait / finished title and description           |
| `--sn-mp-color-action-primary`                  | Process / finished indicator and connector      |
| `--sn-mp-color-text-on-primary`                 | Icon inside a filled indicator                  |
| `--sn-mp-color-feedback-danger`                 | Error indicator and title                       |
| `--sn-mp-font-size-md` / `--sn-mp-font-size-xs` | Title / description size                        |
| `--sn-mp-font-weight-medium`                    | Process title weight                            |
| `--sn-mp-radius-full`                           | Circle indicator radius                         |
| `--sn-mp-spacing-1` / `--sn-mp-spacing-3`       | Title-description gap / vertical content indent |

## Accessibility

- The container is `role="list"` and every step is `role="listitem"`.
- The in-progress step additionally carries `aria-current="step"`; other steps do not.
- Connectors and dot indicators are decorative and are not announced.
- Mobile only: interaction is `tap`; miniprogram has no keyboard focus.

## Dark mode

Every colour in `sn-steps` comes from `--sn-mp-color-*` with no light `var()` fallback, so it adapts automatically under `.sn-theme-dark`: indicator surfaces flip to the dark surface, inactive rings and connectors use the dark border token, the active state keeps the brand hue, and the error state keeps the danger hue.

Verify it by wrapping in sn-config-provider 的 theme 设为 dark:

## Related

- Tabs: [`sn-tabs`](/en/components/uni/tabs)
- Collapse: [`sn-collapse`](/en/components/uni/collapse)
- Progress bar: [`sn-progress`](/en/components/uni/progress)
