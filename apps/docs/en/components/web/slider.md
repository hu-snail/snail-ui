# Slider · Web

Custom-painted slider with range dual handles, marks, step ticks (showSteps), value inputs (showInput), vertical / reverse, tooltip, plus gradient / transparent track and custom tooltip colors.

## Basic

<Demo name="slider-web-basic" description="v-model + drag / track click." />

## Range

<Demo name="slider-web-range" description="Dual handles, non-crossing (clamp)." />

## Step & step ticks (showSteps)

<Demo name="slider-web-step" description="step snapping + showSteps ticks (toggle Step / Show steps)." />

## Marks

<Demo name="slider-web-marks" description="Clickable mark labels." />

## Vertical / reverse

<Demo name="slider-web-vertical" description="vertical + reverse + vertical mark labels." />

## Tooltip

<Demo name="slider-web-tooltip" description="Drag bubble + formatTooltip + tooltipBackground." />

## Value inputs (showInput)

<Demo name="slider-web-show-input" description="showInput renders number input(s) beside the rail (two + separator in range; commits on blur / Enter)." />

## Custom style (gradient / transparent diffuse / thickness)

<Demo name="slider-web-custom" description="Rail gradient and transparent diffuse (railBackground / railShadow), trackBackground gradient, railWidth thickness and tooltip colors." />

## API

### SnSlider Props

| Prop                | Type                                  | Default     | Notes                   |
| ------------------- | ------------------------------------- | ----------- | ----------------------- |
| modelValue          | `number \| [number, number]`          | `0`         | v-model (dual in range) |
| min / max           | `number`                              | `0` / `100` | Bounds                  |
| step                | `number`                              | `1`         | Step snapping           |
| range               | `boolean`                             | `false`     | Dual-handle mode        |
| disabled / readonly | `boolean`                             | `false`     | Disabled / read-only    |
| vertical            | `boolean`                             | `false`     | Vertical orientation    |
| reverse             | `boolean`                             | `false`     | Reversed                |
| tooltip             | `boolean`                             | `true`      | Drag bubble             |
| formatTooltip       | `(value: number) => string \| number` | —           | Bubble formatter        |
| marks               | `Record<number, string>`              | —           | Marks                   |
| placement           | 12 placements                         | `'top'`     | Bubble placement        |
| showSteps           | `boolean`                             | `false`     | Step ticks between min / max |
| showInput           | `boolean`                             | `false`     | Number input(s) beside the rail |
| trackBackground     | `string`                              | —           | Fill-track background (gradient / transparent) |
| railBackground      | `string`                              | —           | Rail background (gradient / transparent) |
| railWidth           | `number \| string`                    | —           | Rail thickness (number → px) |
| railShadow          | `string`                              | —           | Rail diffuse glow (box-shadow) |
| tooltipBackground   | `string`                              | —           | Bubble background       |
| tooltipTextColor    | `string`                              | —           | Bubble text color       |

Each handle: `role="slider"` + aria-valuenow/min/max; arrows / Home / End / PageUp/PageDown (10×step).

See the component `ai-description.md` for the full contract.
