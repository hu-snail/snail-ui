# Ellipsis · Web

Clamps text to one or N lines, reveals the full content in a tooltip on
overflow, and can expand in place on click.

## When to use

- Table cells, card titles — any space-constrained long text.
- The truncated content should be visible on hover (tooltip).
- Long paragraphs need a click-to-expand reading interaction.

## Basic

Single- and multi-line clamping; the tooltip shows the full text only
when the content overflows (ResizeObserver + resize listeners).

<Demo name="ellipsis-web-basic" description="Single line / lineClamp / overflow tooltip / click to expand." />

## API

### SnEllipsis Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| expandTrigger | `'click' \| 'none'` | `'none'` | Clicking the text toggles expansion |
| lineClamp | `number` | `1` | Clamp rows; `1` = single line |
| tooltip | `boolean \| SnTooltip props subset` | `true` | Full-text tooltip on overflow; object form forwards tooltip props |
| width | `number \| 'screen'` | — | Box width; number = px, `'screen'` = 100vw |

### SnEllipsis Slots

| Slot | Notes |
| --- | --- |
| default | Text content to clamp |

No events. The tooltip object form accepts a documented subset:
`content` / `placement` / `trigger` / `delay` / `duration` / `arrow` /
`zIndex` / `raw` / `animated` / `keepAliveOnHover` / `overlap` / `width`
/ `to` / `displayDirective` / `contentClass` / `contentStyle`;
`disabled` is owned by the overflow detection.

## Tokens

Purely structural (inherits the surrounding text tokens); the tooltip
uses SnTooltip's own tokens.

## Accessibility

- Clamping is visual only — the full string stays in the DOM for screen
  readers.
- The tooltip bubble carries `role="tooltip"`.
- With `expandTrigger='click'` the text is clickable but not focusable;
  provide a keyboard-accessible alternative for essential content.

## AI Patch Boundary

- Patches may change `lineClamp` / `width` / `expandTrigger` / `tooltip`.
- The overflow state is a runtime measurement, not schema data; patches
  must not try to write "is overflowing".
- The full text comes from the slot; patching the text keeps the tooltip
  in sync.

See the component `ai-description.md` for the full contract.
