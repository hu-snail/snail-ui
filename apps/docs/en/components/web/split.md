# Split · Web

Split panes (n-splitter aligned). Drag to resize, keyboard accessible, collapsible panels.

The divider is hidden while idle; a rounded vertical bar appears at the center on hover, keyboard focus or drag. Distinguish panels with different backgrounds.

## Basic

<Demo name="split-web-basic" description="Dual panes drag + min/max, two backgrounds to tell panels apart." />

## Vertical

<Demo name="split-web-vertical" description="direction='vertical'." />

## Collapsible

<Demo name="split-web-collapse" description="Snap-collapse below min; double-click to restore." />

## API

### SnSplit Props

| Prop      | Type                       | Default        | Notes            |
| --------- | -------------------------- | -------------- | ---------------- |
| direction | `'horizontal'\|'vertical'` | `'horizontal'` | Split direction  |
| disabled  | `boolean`                  | `false`        | Disable dragging |

Events: `resize` (after drag/collapse settles).

### SnSplitPanel Props

| Prop              | Type                   | Default | Notes                                 |
| ----------------- | ---------------------- | ------- | ------------------------------------- |
| defaultSize       | `number \| 'N%'`       | —       | Initial percent (unset = equal split) |
| minSize / maxSize | `number \| 'N%'`       | —       | Drag bounds                           |
| collapsible       | `boolean`              | `false` | Snap-collapse to 0                    |
| collapsed         | `boolean \| undefined` | —       | v-model:collapsed                     |

divider `role="separator"`; Arrow ±2%, Home/End to bounds; double-click divider restores default.

See the component `ai-description.md` for the full contract.
