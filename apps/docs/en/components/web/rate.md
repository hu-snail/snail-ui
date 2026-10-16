# Rate · Web

Rating with inline SVG stars (no emoji), half stars, clearable, and keyboard support.

## Basic

<Demo name="rate-web-basic" description="v-model + count." />

## Half stars (allowHalf)

<Demo name="rate-web-half" description="Two 50% hit zones per star, 0.5 steps." />

## Readonly / disabled

<Demo name="rate-web-states" description="readonly display; disabled interaction." />

## Clearable

<Demo name="rate-web-clearable" description="Clicking the current value clears it." />

## API

### SnRate Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| modelValue | `number \| null` | `null` | v-model |
| count | `number` | `5` | Star count |
| allowHalf | `boolean` | `false` | Half stars |
| clearable | `boolean` | `false` | Re-click clears |
| readonly / disabled | `boolean` | `false` | Read-only / disabled |
| size | `'small'\|'medium'\|'large'` | `'medium'` | Size |
| color | `string` | — | Active color (token variable) |

`role="radiogroup"` with star `role="radio"`; ArrowLeft/Right ±1 (±0.5 with allowHalf).

See the component `ai-description.md` for the full contract.
