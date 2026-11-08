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

## Custom nodes

The `node` slot replaces the default indicator wholesale (covering the step number and the status glyph), so a host can draw a badge, avatar or any shape; the connector line is container furniture and keeps rendering. The `content` slot replaces the whole content region (title + description):

<Demo name="steps-mp-node" description="the node slot replaces the default indicator; the content slot replaces title + description." />

## Connector line type

`connector` is owned by the container, so every connector inside it uses the same line type: `solid` (default), `dashed` and `dotted`. Dot steps render no connector at all, so `connector` has no effect in `dot` mode:

<Demo name="steps-mp-connector" description="connector set to solid / dashed / dotted; also applies in vertical layout." />

## Icon configuration

A step icon has three sources, in precedence order `iconData` > `iconUrl` > `icon`:

- `icon` — an icon name, resolved through the icon registry and then the built-in catalogue (kebab-case names need no registration); an unresolved name falls back to the built-in status glyph and the step number;
- `iconData` — an `IconData` object passed straight in (named imports from the built-in icon set need no registration);
- `iconUrl` — an image URL, rendered as `<image>`.

`iconSize` accepts a tier name (`tiny` / `small` / `medium` / `large` / `xlarge`) mapped to `--sn-mp-icon-size-*`, or a number in px; the default is `--sn-mp-icon-size-medium`. `iconColor` overrides the stroke colour, defaulting to `currentColor` so the glyph follows the step state colour:

<Demo name="steps-mp-icon" description="icon name / iconData object / iconUrl image; iconSize tiers and iconColor override." />

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

| Prop          | Type                              | Default   | Description                                      |
| ------------- | --------------------------------- | --------- | ------------------------------------------------ |
| `active`      | `number`                          | `0`       | Active step index                                |
| `vertical`    | `boolean`                         | `false`   | Vertical layout                                  |
| `dot`         | `boolean`                         | `false`   | Dot indicators                                   |
| `space`       | `string`                          | `''`      | Step spacing (auto by default)                   |
| `alignCenter` | `boolean`                         | `false`   | Centre horizontally (horizontal layout only)     |
| `customClass` | `string`                          | `''`      | Extra class on the root node                     |
| `customStyle` | `string`                          | `''`      | Inline style on the root node                    |
| `connector`   | `'solid' \| 'dashed' \| 'dotted'` | `'solid'` | Connector line type (no connector in `dot` mode) |

### sn-step

| Prop          | Type                                           | Default     | Description                                                                                             |
| ------------- | ---------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------- |
| `title`       | `string`                                       | `''`        | Step title                                                                                              |
| `description` | `string`                                       | `''`        | Step description                                                                                        |
| `icon`        | `string`                                       | `''`        | Step icon name (registry → built-in catalogue; unresolved falls back to the status glyph / step number) |
| `status`      | `'finished' \| 'process' \| 'error' \| 'wait'` | `undefined` | Step state (derived from `active` when omitted)                                                         |
| `customClass` | `string`                                       | `''`        | Extra class on the step root                                                                            |
| `customStyle` | `string`                                       | `''`        | Inline style on the step root                                                                           |
| `iconData`    | `IconData`                                     | `undefined` | Icon data object (highest precedence)                                                                   |
| `iconUrl`     | `string`                                       | `''`        | Icon image URL (below `iconData`, above `icon`)                                                         |
| `iconSize`    | `string \| number`                             | `undefined` | Icon size: tier names map to tokens, numbers are px; default `--sn-mp-icon-size-medium`                 |
| `iconColor`   | `string`                                       | `''`        | Icon colour, default `currentColor` (follows the step state colour)                                     |

## Events

Neither `sn-steps` nor `sn-step` emits: the state is driven entirely by the `active` prop (AGENTS.md §18 — the runtime renders state, it does not own business transitions).

## Slots

| Slot                 | Description                                      |
| -------------------- | ------------------------------------------------ |
| `default` (steps)    | Step list                                        |
| `icon` (step)        | Custom step icon (rendered inside the node)      |
| `title` (step)       | Custom step title                                |
| `description` (step) | Custom step description                          |
| `node` (step)        | Replace the default indicator (number / glyph)   |
| `content` (step)     | Replace the content region (title + description) |

## Theme variables

| Variable                                                                              | Purpose                                                                                            |
| ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `--sn-mp-color-background-surface`                                                    | Indicator and step surface                                                                         |
| `--sn-mp-color-border-default`                                                        | Indicator ring and connector                                                                       |
| `--sn-mp-color-text-secondary`                                                        | Wait / finished title and description                                                              |
| `--sn-mp-color-action-primary`                                                        | Process / finished indicator and connector                                                         |
| `--sn-mp-color-text-on-primary`                                                       | Icon inside a filled indicator                                                                     |
| `--sn-mp-color-feedback-danger`                                                       | Error indicator and title                                                                          |
| `--sn-mp-font-size-md` / `--sn-mp-font-size-sm` / `--sn-mp-font-size-xs`              | Title / node number / description size                                                             |
| `--sn-mp-font-weight-medium`                                                          | Process title weight                                                                               |
| `--sn-mp-radius-full`                                                                 | Circle indicator radius                                                                            |
| `--sn-mp-spacing-1` / `--sn-mp-spacing-2` / `--sn-mp-spacing-3` / `--sn-mp-spacing-5` | Title-description gap / content padding / vertical content indent / vertical content bottom margin |
| `--sn-mp-icon-size-tiny` … `--sn-mp-icon-size-xlarge`                                 | Icon sizes behind the `iconSize` tier names                                                        |

Every glyph inside a node (custom icon, finished / error status icon, step number) shares one tier: `--sn-mp-icon-size-medium` by default, overridden as a whole by `iconSize`. The connector takes `--sn-mp-color-border-default` normally and `--sn-mp-color-action-primary` once the step is finished.

## AI Patch Boundary

- AI may patch `active` / `vertical` / `dot` / `space` / `alignCenter` / `connector`, plus each step's `title` / `description` / `icon` / `iconData` / `iconUrl` / `iconSize` / `iconColor` / `status`.
- `active` is a projection of the host's business progress: a patch may set its initial value but must not treat it as a workflow engine — step transitions belong to the host.
- Slot content (`node` / `content` / `icon` / `title` / `description`) is business data: a patch adjusts container configuration, never the slot internals.
- Colours and sizes must come from `--sn-mp-color-*` / `--sn-mp-icon-size-*` tokens; a patch must not write literal colours or lengths.
- `connector` accepts only the `solid` / `dashed` / `dotted` enum, never an arbitrary CSS `border-style`.

## Accessibility

- The container is `role="list"` and every step is `role="listitem"`.
- The in-progress step additionally carries `aria-current="step"`; other steps do not.
- Connectors and dot indicators are decorative and are not announced.
- Mobile only: interaction is `tap`; miniprogram has no keyboard focus.

## Dark mode

Every colour in `sn-steps` comes from `--sn-mp-color-*` with no light `var()` fallback, so it adapts automatically under `.sn-theme-dark`: indicator surfaces flip to the dark surface, inactive rings and connectors use the dark border token, the active state keeps the brand hue, and the error state keeps the danger hue.

Verify it by wrapping the component in `sn-config-provider` with `theme="dark"`:

## Related

- Tabs: [`sn-tabs`](/en/components/uni/tabs)
- Collapse: [`sn-collapse`](/en/components/uni/collapse)
- Progress bar: [`sn-progress`](/en/components/uni/progress)
