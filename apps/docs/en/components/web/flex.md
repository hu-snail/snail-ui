# Flex · Web

Flex primitive (n-flex aligned). Generic flex container with direct gap values.

## Basic

<Demo name="flex-web-basic" description="Horizontal layout + gap." />

## Vertical & alignment

<Demo name="flex-web-vertical" description="vertical / justify / align combos." />

## Expand children

<Demo name="flex-web-expand" description="expand is a snail extension (absent in naive)." />

## API

### SnFlex Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| vertical | `boolean` | `false` | Vertical layout |
| gap | `number \| 'small'\|'medium'\|'large' \| [number, number]` | `'medium'` | Gap |
| justify | flex justify values (direct) | `'start'` | Main axis |
| align | flex align values | — | Cross axis |
| wrap | `boolean` | `true` | Wrapping |
| inline | `boolean` | `false` | Inline container |
| expand | `boolean` | `false` | Children flex:1 (snail extension) |

Space vs Flex: Flex is the generic primitive (justify direct); Space is the "component spacing" semantic.

See the component `ai-description.md` for the full contract.
