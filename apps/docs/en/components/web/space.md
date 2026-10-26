# Space · Web

Spacing container (n-space aligned). CSS gap — no wrapper elements.

## Basic

<Demo name="space-web-basic" description="Horizontal + preset size." />

## Vertical & tuple gap

<Demo name="space-web-vertical" description="vertical + [horizontal, vertical] gap." />

## Align & wrap

<Demo name="space-web-align" description="justify / align / wrap." />

## API

### SnSpace Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| vertical | `boolean` | `false` | Vertical (forces nowrap) |
| size | `number \| 'small'\|'medium'\|'large' \| [number, number]` | `'medium'` | Gap (8/12/16) |
| wrap | `boolean` | `true` | Wrapping |
| justify | flex justify values | `'start'` | Main axis (start/end → flex-*) |
| align | flex align values | — | Cross axis |
| inline | `boolean` | `false` | Inline container |

See the component `ai-description.md` for the full contract.
