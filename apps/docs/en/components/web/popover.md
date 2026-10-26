# Popover · Web

`SnPopover` is a floating card anchored to a trigger element: a titled header above a body section, opened by hover / click / focus, flipping automatically when space runs out.

## When to use

- Present structured help content (title + body) without leaving the page.
- Icon buttons and table actions need richer context than a plain text hint.
- The content itself needs interaction (links, a small form) inside a bubble.

## Demos

### Basic usage

Hover by default. `header` provides the title section, `content` the body; `show-arrow` draws the pointer and the common placements can be compared.

<Demo name="popover-web-basic" description="hover trigger, header + content, arrow and common placements" />

### Triggers and controlled mode

`click` toggles on click and closes on an outside click; `manual` pairs with `v-model:show` so external state owns visibility entirely.

<Demo name="popover-web-trigger" description="click trigger and manual + v-model:show" />

### Twelve placements

Each of the four sides offers `start` / center / `end` alignment — twelve `placement` values in total; the bubble flips to the opposite side when space runs out.

<Demo name="popover-web-placement" description="live switching across twelve placements + viewport flip" />

### Open / close timing

`delay` debounces opening (the array form sets open / close separately) and `duration` debounces closing, which suppresses accidental pops while the pointer sweeps past.

<Demo name="popover-web-delay" description="default timing, slow open and asymmetric [open, close] delays" />

### Width control

`width="trigger"` matches the bubble to the trigger width; a numeric `width` fixes a pixel width for a full paragraph of copy.

<Demo name="popover-web-width" description="width=&quot;trigger&quot; next to a fixed numeric width" />

### Long scrollable content

`scrollable` turns on inner scrolling once the body exceeds the height cap, and `content-style` overrides that default max height.

<Demo name="popover-web-scrollable" description="scrollable and content-style maxHeight with long content" />

### Custom header and body

The `#header` / `#content` slots accept icons, paragraphs and buttons, and take precedence over the same-named `header` / `content` props.

<Demo name="popover-web-slots" description="SnIcon title plus a rich body with actions" />

## API

### Props

| Prop                  | Type                                                                                                                                                                 | Default     | Notes                                                                                                      |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------- |
| show                  | `boolean`                                                                                                                                                            | `undefined` | Show state; `undefined` = uncontrolled mode driven by internal state.                                      |
| default-show          | `boolean`                                                                                                                                                            | `false`     | Initial state for uncontrolled mode.                                                                       |
| trigger               | `'hover' \| 'click' \| 'focus' \| 'manual'`                                                                                                                          | `'hover'`   | Opening gesture; `'manual'` is driven by `show` only.                                                      |
| placement             | `'top-start' \| 'top' \| 'top-end' \| 'right-start' \| 'right' \| 'right-end' \| 'bottom-start' \| 'bottom' \| 'bottom-end' \| 'left-start' \| 'left' \| 'left-end'` | `'top'`     | Requested side; can flip when space runs out.                                                              |
| delay                 | `number \| [number, number]`                                                                                                                                         | `100`       | Open debounce (ms); the array's second item overrides the close delay.                                     |
| duration              | `number`                                                                                                                                                             | `100`       | Close debounce (ms).                                                                                       |
| show-arrow            | `boolean`                                                                                                                                                            | `false`     | Render the arrow pointing at the trigger.                                                                  |
| arrow                 | `boolean`                                                                                                                                                            | `true`      | Boolean alias of `show-arrow`; the arrow needs both to be true.                                            |
| arrow-point-to-center | `boolean`                                                                                                                                                            | `false`     | Aim the arrow at the bubble centre instead of the trigger edge.                                            |
| arrow-class           | `string`                                                                                                                                                             | `undefined` | Class on the arrow element.                                                                                |
| arrow-style           | `CSSProperties`                                                                                                                                                      | `undefined` | Inline style on the arrow element.                                                                         |
| header                | `string`                                                                                                                                                             | `''`        | Title text; overridden by the `#header` slot.                                                              |
| content               | `string`                                                                                                                                                             | `''`        | Body text; overridden by the `#content` slot.                                                              |
| disabled              | `boolean`                                                                                                                                                            | `false`     | Suppress showing entirely.                                                                                 |
| raw                   | `boolean`                                                                                                                                                            | `false`     | Strip built-in card styling so the caller paints the bubble.                                               |
| animated              | `boolean`                                                                                                                                                            | `true`      | Enter / leave animation on or off.                                                                         |
| overlap               | `boolean`                                                                                                                                                            | `false`     | Bubble overlaps the trigger instead of sitting beside it.                                                  |
| scrollable            | `boolean`                                                                                                                                                            | `false`     | Scroll the body inside the bubble once it exceeds the height cap.                                          |
| display-directive     | `'if' \| 'show'`                                                                                                                                                     | `'if'`      | `'if'` unmounts on hide; `'show'` keeps the node and toggles `display`.                                    |
| flip                  | `boolean`                                                                                                                                                            | `true`      | Flip to the opposite side when space runs out.                                                             |
| keep-alive-on-hover   | `boolean`                                                                                                                                                            | `true`      | Keep open while the pointer is inside the bubble (hover trigger).                                          |
| width                 | `number \| 'trigger'`                                                                                                                                                | `undefined` | Width; `'trigger'` matches the trigger, a number sets a fixed px width (the 280px card cap still applies). |
| to                    | `string \| HTMLElement \| false`                                                                                                                                     | `'body'`    | Teleport target; `false` renders it inline.                                                                |
| z-index               | `number`                                                                                                                                                             | `undefined` | Explicit stacking order.                                                                                   |
| content-class         | `string`                                                                                                                                                             | `undefined` | Class on the body section.                                                                                 |
| content-style         | `CSSProperties`                                                                                                                                                      | `undefined` | Inline style on the body section.                                                                          |
| on-clickoutside       | `(e: MouseEvent) => void`                                                                                                                                            | `undefined` | Called when a click lands outside the bubble and its trigger.                                              |

### Events

| Name          | Payload   | Notes                                          |
| ------------- | --------- | ---------------------------------------------- |
| `update:show` | `boolean` | Show state changed; pairs with `v-model:show`. |
| `show`        | `()`      | Fired when the bubble appears.                 |
| `hide`        | `()`      | Fired when the bubble hides.                   |

### Slots

| Slot    | Notes                                                     |
| ------- | --------------------------------------------------------- |
| default | Trigger element — the visible node the bubble anchors to. |
| header  | Title content — overrides the `header` prop.              |
| content | Body content — overrides the `content` prop.              |

### Methods

| Name      | Type            | Notes                                                      |
| --------- | --------------- | ---------------------------------------------------------- |
| `show`    | `() => void`    | Programmatic show, still bound by `disabled`.              |
| `hide`    | `() => void`    | Programmatic hide.                                         |
| `isShown` | `() => boolean` | Read the effective show state (controlled + uncontrolled). |

## Tokens

| Token              | CSS variable                        | Purpose             |
| ------------------ | ----------------------------------- | ------------------- |
| Background surface | `--sn-web-color-background-surface` | Card + arrow fill   |
| Border subtle      | `--sn-web-color-border-subtle`      | Card + arrow border |
| Card shadow        | `--sn-web-card-shadow`              | Card elevation      |
| Text primary       | `--sn-web-color-text-primary`       | Header + body text  |

## Accessibility

- Bubble: `role="dialog"` + `aria-modal="false"` (non-trapping popover).
- Trigger wrapper: `aria-expanded` + `aria-haspopup="dialog"`.
- Arrow is decorative and carries `aria-hidden="true"`.
- Keyboard reachable: the trigger is focusable, a `focus` trigger opens on focus, and `manual` mode leaves the entry point to the app.

## AI Patch Boundary

| Safe for AI to generate                                                                  | Requires human review                                           |
| ---------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `content` / `header` copy and static `placement`, `trigger`, `show-arrow` display params | Controlled `show` binding (`v-model:show` wires page state)     |
| `content-class` / `content-style` style hooks (existing tokens only)                     | `on-clickoutside` and imperative `show()` / `hide()` call sites |
| Static composition in docs and demos                                                     | Nesting complex interactive components inside the bubble        |

See the component `ai-description.md` for the full contract.
