# Splitter · Web

Split panes (n-splitter aligned). Drag to resize, keyboard accessible, collapsible panels.

## Basic

<Demo name="splitter-web-basic" description="Dual panes drag + min/max." />

## Vertical

<Demo name="splitter-web-vertical" description="direction='vertical'." />

## Collapsible

<Demo name="splitter-web-collapse" description="Snap-collapse below min; double-click to restore." />

## API

### SnSplitter Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| direction | `'horizontal'\|'vertical'` | `'horizontal'` | Split direction |
| disabled | `boolean` | `false` | Disable dragging |

Events: `resize` (after drag/collapse settles).

### SnSplitterPanel Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| defaultSize | `number \| 'N%'` | — | Initial percent (unset = equal split) |
| minSize / maxSize | `number \| 'N%'` | — | Drag bounds |
| collapsible | `boolean` | `false` | Snap-collapse to 0 |
| collapsed | `boolean \| undefined` | — | v-model:collapsed |

divider `role="separator"`; Arrow ±2%, Home/End to bounds; double-click divider restores default.

See the component `ai-description.md` for the full contract.
