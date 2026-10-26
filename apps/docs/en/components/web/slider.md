# Slider · Web

Custom-painted slider with range dual handles, marks, vertical / reverse, and tooltip.

## Basic

<Demo name="slider-web-basic" description="v-model + drag / track click." />

## Range

<Demo name="slider-web-range" description="Dual handles, non-crossing (clamp)." />

## Step & bounds

<Demo name="slider-web-step" description="step snapping + min / max clamp." />

## Marks

<Demo name="slider-web-marks" description="Clickable mark labels." />

## Vertical / reverse

<Demo name="slider-web-vertical" description="vertical + reverse." />

## Tooltip

<Demo name="slider-web-tooltip" description="Drag bubble + formatTooltip." />

## API

### SnSlider Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| modelValue | `number \| [number, number]` | `0` | v-model (dual in range) |
| min / max | `number` | `0` / `100` | Bounds |
| step | `number` | `1` | Step snapping |
| range | `boolean` | `false` | Dual-handle mode |
| disabled / readonly | `boolean` | `false` | Disabled / read-only |
| vertical | `boolean` | `false` | Vertical orientation |
| reverse | `boolean` | `false` | Reversed |
| tooltip | `boolean` | `true` | Drag bubble |
| formatTooltip | `(value: number) => string \| number` | — | Bubble formatter |
| marks | `Record<number, string>` | — | Marks |
| placement | 12 placements | `'top'` | Bubble placement |

Each handle: `role="slider"` + aria-valuenow/min/max; arrows / Home / End / PageUp/PageDown (10×step).

See the component `ai-description.md` for the full contract.
