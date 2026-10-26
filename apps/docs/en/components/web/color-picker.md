# ColorPicker · Web

Color picker. SV drag panel + hue / alpha rails + RGB / HSL / HEX modes + swatches.

## Basic

<Demo name="color-picker-web-basic" description="Drag to pick; v-model normalized to hex." />

## Modes

<Demo name="color-picker-web-modes" description="RGB / HSL / HEX tabs with live conversion." />

## Alpha (showAlpha)

<Demo name="color-picker-web-alpha" description="Alpha rail + 8-digit hex / rgba output." />

## Swatches

<Demo name="color-picker-web-swatches" description="One-click preset colors." />

## Clearable / disabled

<Demo name="color-picker-web-states" description="clearable resets to default; disabled; readonly." />

## API

### SnColorPicker Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| modelValue | `string` | `null` (renders `#000000`) | Accepts hex / rgb() / hsl(); normalized to lowercase hex |
| modes | `('rgb'\|'hsl'\|'hex')[]` | `['rgb','hex']` | Panel mode tabs |
| showAlpha | `boolean` | `false` | Alpha rail (8-digit hex / rgba when < 1) |
| swatches | `string[]` | — | Preset swatches |
| size | `'mini'\|'tiny'\|'small'\|'medium'\|'large'` | `'medium'` | Size |
| disabled / readonly | `boolean` | `false` | Disabled / read-only |
| clearable | `boolean` | `false` | Reset to default color and emit clear |
| defaultShow | `boolean` | `false` | Open panel initially |

Events: `update:modelValue` (live during drag) / `change` (on release) / `clear` / `focus` / `blur`. Keyboard: handle arrows step h/s/v ±1 (Shift ±10), alpha ±0.01 (Shift ±0.1). Output format follows the active mode tab.

**Out of scope** (see ai-description.md): gradient mode, labeled swatches, color keywords.

See the component `ai-description.md` for the full contract.
