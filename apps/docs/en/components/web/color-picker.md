# ColorPicker · Web

Color picker. SV drag panel + hue / alpha rails + format dropdown (RGB / HSL / HEX) + recent colors + preset swatches, with a panel-only (`panelOnly`) inline mode.

## Basic

<Demo name="color-picker-web-basic" description="Drag to pick; v-model normalized to hex." />

## Color format (modes)

`modes` sets the format dropdown options: `hex`, `rgb`, and `hsl`. The `rgb` format uses three 0–255 channel inputs, `hex` carries a `#` prefix; typing converts live and the output follows the active format.

<Demo name="color-picker-web-modes" description="Hex / RGB / HSL format dropdown with channel inputs." />

## Alpha (showAlpha)

<Demo name="color-picker-web-alpha" description="Alpha rail + percent input + 8-digit hex / rgba output." />

## Swatches

`swatches` sets the preset color section. The panel also keeps a recently-used section (session history, max 10, deduped).

<Demo name="color-picker-web-swatches" description="One-click preset colors." />

## Panel only (panelOnly)

`panelOnly` renders just the picker panel: inline, no trigger, no popper positioning — ideal for embedding in settings pages or toolbars.

<Demo name="color-picker-web-panel-only" description="panelOnly inline panels, multiple instances side by side." />

## Clearable / disabled

<Demo name="color-picker-web-states" description="clearable resets to default; disabled; readonly." />

## API

### SnColorPicker Props

| Prop                | Type                                         | Default                    | Notes                                                    |
| ------------------- | -------------------------------------------- | -------------------------- | -------------------------------------------------------- |
| modelValue          | `string`                                     | `null` (renders `#000000`) | Accepts hex / rgb() / hsl(); normalized to lowercase hex |
| modes               | `('rgb'\|'hsl'\|'hex')[]`                    | `['rgb','hex']`            | Format dropdown options (Hex / RGB / HSL)                |
| showAlpha           | `boolean`                                    | `false`                    | Alpha rail + percent input (8-digit hex / rgba when < 1) |
| swatches            | `string[]`                                   | —                          | Preset color section                                     |
| panelOnly           | `boolean`                                    | `false`                    | Panel only: inline render, no trigger / positioning      |
| size                | `'mini'\|'tiny'\|'small'\|'medium'\|'large'` | `'medium'`                 | Size                                                     |
| disabled / readonly | `boolean`                                    | `false`                    | Disabled / read-only                                     |
| clearable           | `boolean`                                    | `false`                    | Reset to default color and emit clear                    |
| defaultShow         | `boolean`                                    | `false`                    | Open panel initially (ignored with panelOnly)            |

Events: `update:modelValue` (live during drag) / `change` (on release; also recorded into the recent history) / `clear` / `focus` / `blur`. Keyboard: handle arrows step h/s/v ±1 (Shift ±10), alpha ±0.01 (Shift ±0.1); the format dropdown opens with Enter / Space / ArrowDown, roves with ArrowUp / ArrowDown, closes on Escape. Output format follows the active format option.

**Out of scope** (see ai-description.md): gradient mode, labeled swatches, color keywords, persistent (localStorage) recent colors.

See the component `ai-description.md` for the full contract.
