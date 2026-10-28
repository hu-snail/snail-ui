# Ellipsis · Web

Clamps text to one or N lines, reveals the full content in a tooltip on
overflow, and can expand in place on click.

## When to use

- Table cells, card titles — any space-constrained long text.
- The truncated content should be visible on hover.
- Long paragraphs need a click-to-expand reading interaction.

## Demos

### Basic clamping

`width` constrains the box; by default the tooltip only appears when the
content actually overflows. Multi-line clamping and click-to-expand can be
combined in one instance.

<Demo name="ellipsis-web-basic" description="Single line / lineClamp / overflow tooltip / click to expand." />

### Single line vs multi-line

With the same text and width, `lineClamp` of 1 clamps to a single line while
2 / 3 clamp by row count; nothing is shown for content that fits.

<Demo name="ellipsis-web-lines" description="lineClamp 1 / 2 / 3 side by side + no tooltip without overflow." />

### Click to expand and collapse

With `expandTrigger="click"` a click toggles between the clamped and the full
text; the expanded state is owned by the component. `fade` dissolves the
clamped edge like smoke; `expandPosition` places a dedicated expand /
collapse toggle — `suffix` right after the text, `bottom` on its own row.

<Demo name="ellipsis-web-expand" description="fade smoke mask + expandPosition suffix / bottom + expandTrigger click toggle." />

## API

### Props

All props are optional.

| Name           | Type                                  | Default           | Description                                                              |
| -------------- | ------------------------------------- | ----------------- | ------------------------------------------------------------------------ |
| expandTrigger  | `'click' \| 'none'`                   | `'none'`          | Clicking the text toggles expansion                                      |
| lineClamp      | `number`                              | `1`               | Clamp rows; `1` = single line, above 1 = multi-line                      |
| tooltip        | `boolean \| SnEllipsisTooltipOptions` | `true`            | Full-text tooltip on overflow; the object form forwards tooltip props    |
| width          | `number \| 'screen'`                  | `undefined`       | Box width; number = px, `'screen'` = 100vw                               |
| fade           | `boolean`                             | `false`           | Smoke mask on the clamped edge (bottom for multi-line, right for single) |
| expandPosition | `'suffix' \| 'bottom' \| 'none'`      | `'none'`          | Toggle placement: after the text / its own row                           |
| expandText     | `string`                              | locale "Expand"   | Toggle label while collapsed                                             |
| collapseText   | `string`                              | locale "Collapse" | Toggle label while expanded                                              |

### Slots

| Name    | Scope | Description           |
| ------- | ----- | --------------------- |
| default | —     | Text content to clamp |

No events.

The tooltip object form accepts a documented subset: `content` /
`placement` / `trigger` / `delay` / `duration` / `arrow` / `zIndex` / `raw`
/ `animated` / `keepAliveOnHover` / `overlap` / `width` / `to` /
`displayDirective` / `contentClass` / `contentStyle`. `disabled` is owned by
the overflow detection and cannot be overridden through it.

Overflow is re-measured on mount, on window resize, from a ResizeObserver on
the text box, and whenever `lineClamp` / `width` / the expanded state change.

## Tokens

The component is purely structural (it inherits the surrounding text
styles) and consumes no dedicated tokens; the tooltip uses its own tokens.

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
