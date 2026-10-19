# Popover · Web

`SnPopover` is a floating card anchored to a trigger element: a titled
header above a body section, opened by hover / click / focus, with
viewport-aware flipping when space runs out.

## When to use

- Present structured help content (title + body) without leaving the page.
- Icon buttons and table row actions need richer context than a plain text hint.
- The content itself needs interaction (links, a small form) inside a bubble.

## Basic

<Demo name="popover-web-basic" description="hover trigger, header + content, arrow and placements" />

### Triggers and controlled mode

`click` / `manual` triggers side by side; `manual` pairs with
`v-model:show` for full external control.

<Demo name="popover-web-trigger" description="click and manual + v-model:show" />

## API

### Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| show | `boolean` | `undefined` | Show state; `undefined` = uncontrolled mode. |
| default-show | `boolean` | `false` | Initial state for uncontrolled mode. |
| trigger | `'hover' \| 'click' \| 'focus' \| 'manual'` | `'hover'` | Opening gesture. `'manual'` = only `show` drives it. |
| placement | `'top-start' \| 'top' \| 'top-end' \| 'right-start' \| 'right' \| 'right-end' \| 'bottom-start' \| 'bottom' \| 'bottom-end' \| 'left-start' \| 'left' \| 'left-end'` | `'top'` | Bubble position relative to the trigger. |
| delay | `number \| [number, number]` | `100` | Open debounce (ms); array form sets `[open, close]`. |
| duration | `number` | `100` | Close debounce (ms). |
| show-arrow | `boolean` | `false` | Render the directional arrow. |
| arrow | `boolean` | `true` | Alias of `show-arrow`; both must be true to render. |
| arrow-point-to-center | `boolean` | `false` | Aim the arrow at the bubble centre. |
| arrow-class | `string` | `undefined` | Class on the arrow element. |
| arrow-style | `CSSProperties` | `undefined` | Style on the arrow element. |
| header | `string` | `''` | Title section text. |
| content | `string` | `''` | Body text. |
| disabled | `boolean` | `false` | Suppress showing entirely. |
| raw | `boolean` | `false` | Strip built-in card styling (caller paints). |
| animated | `boolean` | `true` | Enter animation on/off. |
| overlap | `boolean` | `false` | Bubble overlaps the trigger instead of sitting beside it. |
| scrollable | `boolean` | `false` | Cap body height and scroll overflow. |
| display-directive | `'if' \| 'show'` | `'if'` | `'if'` unmounts on hide; `'show'` keeps the node. |
| flip | `boolean` | `true` | Flip to the opposite side when space runs out. |
| keep-alive-on-hover | `boolean` | `true` | Keep open while the pointer is inside (hover trigger). |
| width | `number \| 'trigger'` | `undefined` | Fixed px width, or `'trigger'` to match the trigger. |
| to | `string \| HTMLElement \| false` | `'body'` | Teleport target; `false` renders inline. |
| z-index | `number` | `undefined` | Explicit stacking order. |
| content-class | `string` | `undefined` | Class on the body section. |
| content-style | `CSSProperties` | `undefined` | Style on the body section. |
| on-clickoutside | `(e: MouseEvent) => void` | `undefined` | Click outside the bubble and trigger. |

### Events

| Name | Payload | Notes |
| --- | --- | --- |
| `update:show` | `boolean` | Show state change (controlled mode). |
| `show` | `()` | Bubble appeared. |
| `hide` | `()` | Bubble hidden. |

### Slots

| Slot | Notes |
| --- | --- |
| default | Trigger element. |
| header | Title content — overrides the `header` prop. |
| content | Body content — overrides the `content` prop. |

### Methods

| Name | Type | Notes |
| --- | --- | --- |
| `show` | `() => void` | Programmatic show. |
| `hide` | `() => void` | Programmatic hide. |
| `isShown` | `() => boolean` | Read the current show state. |

## Tokens

| Token | CSS variable | Purpose |
| --- | --- | --- |
| Background surface | `--sn-web-color-background-surface` | Card + arrow fill |
| Border subtle | `--sn-web-color-border-subtle` | Card + arrow border |
| Card shadow | `--sn-web-card-shadow` | Card elevation |
| Text primary | `--sn-web-color-text-primary` | Header + body text |

## Accessibility

- Bubble: `role="dialog"` + `aria-modal="false"` (non-trapping).
- Trigger wrapper: `aria-expanded` + `aria-haspopup="dialog"`.
- Arrow is decorative (`aria-hidden="true"`).

## AI Patch Boundary

| Safe for AI to generate | Requires human review |
| --- | --- |
| `content` / `header` copy and static `placement`, `trigger`, `show-arrow` display params | Controlled `show` binding (`v-model:show` wires page state) |
| `content-class` / `content-style` style hooks (existing tokens only) | `on-clickoutside` and imperative `show()` / `hide()` call sites |
| Static composition in docs and demos | Nesting complex interactive components inside the bubble |

See the component `ai-description.md` for the full contract.
