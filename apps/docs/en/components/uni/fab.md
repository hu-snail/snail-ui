# Fab · uni-app

`sn-fab` is the floating action button of `@snui/uni` (mobile / miniprogram / H5): 8 anchor presets, 4 expansion directions, 2 expansion shapes (line stack / arc fan), 5 color themes and optional dragging. Auto-registered through easycom (`components/sn-fab/sn-fab.vue` → `<sn-fab>`); geometry uses `rpx`.

> **Behavior notes**
>
> - Dragging does **not snap to an edge**: the position stays where the user let go (clamped inside the viewport only).
> - `direction` strictly decides the expansion axis: even for side-midpoint anchors the menu expands vertically / horizontally along the chosen direction.
> - Fan mode (`mode="fan"`) takes its shape from the anchor: corner anchors open a 90° oblique quadrant fan into the screen, edge-centre anchors a symmetric 120° fan (`bottom-center` = the classic centre fan).

## When to use

- A persistent set of quick actions (create, share, support, etc.) aggregated into one floating button.
- With more than one action, collect them in an expandable menu; for a single action use the `expandable=false` click-only form.

## Basic usage

`v-model:active` controls expansion; the `default` slot holds the action items ("icon + text" pills or icon bubbles both work) and the `trigger` slot fully replaces the trigger button.

<Demo name="fab-mp-basic" description="A bottom-right floating button sliding out three icon+text pills upwards; picking one shows the feedback and collapses." />

## Expansion direction

`direction` decides the axis and order of the expanding action items: `up` / `down` run along the vertical axis, `left` / `right` along the horizontal axis. `up` / `down` are new vocabulary (default `up`); the legacy `top` / `bottom` values keep working with the same meaning.

<Demo name="fab-mp-direction" description="up (bottom-right) / down (top-left) / left (right-center) / right (left-center), each expanding its icon actions; picking one records the direction feedback." />

## Fan expansion (`mode="fan"`)

`mode="fan"` blooms the action items along an arc out of the trigger centre: 45° stepping, a back-out easing, a 40 ms per-item stagger, and a collapse back into the button. Items come from structured `actions` (`{ icon, text?, color?, disabled? }`) — with `text` they render as pills, otherwise as icon bubbles; tapping one emits `action` and auto-closes. `fanRadius` (default 96px) tunes the arc radius.

<Demo name="fab-mp-fan" description="A symmetric centre fan at bottom-center (pill items) plus oblique fans at bottom-right / top-left (icon bubbles); items auto-close on tap." />

## Dragging (`draggable`)

With `draggable`, hold the trigger to drag it; on release it clamps back inside the `gap` safe area (clamped to the viewport when `uni.getSystemInfoSync()` is available). Dragging and expanding do not interfere.

<Demo name="fab-mp-drag" description="Hold the bottom-right button to drag it; it clamps into the safe area on release and still expands afterwards." />

## Positions and themes

`position` takes 8 presets (four corners + four edge midpoints); `gap` sets the default inset for all four edges while `top` / `bottom` / `left` / `right` override a single side; `direction` pairs with the anchor to pick the expansion axis.

<Demo name="fab-mp-position" description="Top-left / top-right / bottom-left / bottom-center anchors, each with a pill group whose direction follows the anchor." />

## Disabled and click-only

`disabled` blocks every interaction; `expandable=false` skips expansion and emits `click` instead (gesture dragging → the "Dragging" section above).

<Demo name="fab-mp-disabled" description="expandable=false (click counter), disabled at half opacity, and draggable — the menu still opens after dragging." />

## Trigger icons and theme switching (`inactive-icon` / `active-icon` / `type`)

The trigger icon has two tracks: `inactive-icon` / `active-icon` take registry names (`plus` / `close` built in, anything else after `registerSnIcons()`); or render an icon object directly in the `trigger` slot. The trigger glyph scales with the `--sn-mp-icon-size-*` tier. `type` provides 5 color themes.

<Demo name="fab-mp-icons" description="Bottom-left icon-name track (Edit ↔ X), bottom-right trigger-slot icon object (Sparkles ↔ X) + swatches switching the 5 themes live." />

## Props

| Prop         | Type                                                                    | Default                                        | Description                                        |
| ------------ | ----------------------------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------- |
| active       | boolean                                                                 | false                                          | Whether the menu is expanded (`v-model:active`)    |
| type         | 'primary' \| 'success' \| 'info' \| 'warning' \| 'danger'               | 'primary'                                      | Color theme                                        |
| position     | FabPosition                                                             | 'right-bottom'                                 | Anchor preset (8 options)                          |
| draggable    | boolean                                                                 | false                                          | Allow dragging the trigger                         |
| direction    | 'up' \| 'down' \| 'left' \| 'right' (legacy 'top' \| 'bottom' accepted) | 'up'                                           | Menu expansion direction; up/down alias top/bottom |
| mode         | 'line' \| 'fan'                                                         | 'line'                                         | Expansion shape: stack / arc fan (additive)        |
| actions      | SnFabAction[]                                                           | []                                             | Fan-mode items (the slot is ignored in fan mode)   |
| fanRadius    | number                                                                  | 96                                             | Fan radius in px (trigger centre → item centre)    |
| disabled     | boolean                                                                 | false                                          | Disable the whole button                           |
| inactiveIcon | string                                                                  | 'plus'                                         | Icon while collapsed (registry name)               |
| activeIcon   | string                                                                  | 'close'                                        | Icon while expanded (registry name)                |
| zIndex       | number                                                                  | 99                                             | Stacking level                                     |
| gap          | SnFabGap                                                                | `{ top: 16, right: 16, bottom: 16, left: 16 }` | Inset from each viewport edge                      |
| expandable   | boolean                                                                 | true                                           | Expand on tap; `false` emits `click`               |
| top          | number                                                                  | —                                              | Top inset (overrides `gap.top`)                    |
| bottom       | number                                                                  | —                                              | Bottom inset (overrides `gap.bottom`)              |
| left         | number                                                                  | —                                              | Left inset (overrides `gap.left`)                  |
| right        | number                                                                  | —                                              | Right inset (overrides `gap.right`)                |
| customClass  | string                                                                  | ''                                             | Custom class for the root node                     |
| customStyle  | string                                                                  | ''                                             | Custom inline style for the root node              |

`SnFabGap` = `{ top?, right?, bottom?, left? }` (px); `SnFabAction` = `{ icon: string \| IconData, text?, color?, disabled? }` (`text` renders a pill, `color` tints the icon — prefer `var(--sn-mp-color-*)`); `FabPosition` = `"left-top" | "right-top" | "left-bottom" | "right-bottom" | "left-center" | "right-center" | "top-center" | "bottom-center"`.

## Events

| Event         | Description                            | Payload            |
| ------------- | -------------------------------------- | ------------------ |
| update:active | Menu expanded / collapsed              | boolean            |
| click         | Emitted on tap when `expandable=false` | —                  |
| action        | Fan item tapped (auto-closes the fan)  | SnFabAction, index |

## Slots

| Slot    | Description                                      |
| ------- | ------------------------------------------------ |
| default | Action items for line mode (ignored in fan mode) |
| trigger | Fully custom trigger content                     |

## Theme variables

| Variable                                                    | Purpose                                 |
| ----------------------------------------------------------- | --------------------------------------- |
| --sn-mp-color-action-primary                                | `type="primary"` fill                   |
| --sn-mp-color-feedback-success`/`-info`/`-warning`/`-danger | Other type fills                        |
| --sn-mp-color-text-on-primary                               | Trigger icon color                      |
| --sn-mp-icon-size-large                                     | Trigger glyph size (40rpx)              |
| --sn-mp-shadow-lg                                           | Trigger elevation                       |
| --sn-mp-radius-full                                         | Trigger shape                           |
| --sn-mp-spacing-3`/`--sn-mp-spacing-4                       | Menu gap, root gap and expansion offset |

## Accessibility

- Trigger: `role="button"` + `aria-expanded` + `aria-disabled`
- Menu container: `aria-hidden` mirrors the expanded state

## AI Patch Boundary

- AI can patch the display config: `type` / `position` / `direction` / `gap` / `zIndex` / `inactiveIcon` / `activeIcon` / `disabled` / `expandable`.
- Action item content is business data (the `default` slot); patches should only touch the container config, not rewrite the slot structure.
- `active` is a controlled state (`v-model:active`); write back through events instead of mutating internal state.
- The drag offset is a runtime gesture result; patches should not try to write it.

See the component `ai-description.md` for the full contract.

## Dark mode

All five type fills and the icon color come from semantic tokens (`--sn-mp-color-action-primary` / `--sn-mp-color-feedback-*` / `--sn-mp-color-text-on-primary`), all overridden in the dark block of `@snui/tokens-mp/styles`, so it adapts automatically. Set `theme` to `dark` on `sn-config-provider` to verify.

## Related

- Button: [`sn-button`](/en/components/uni/button)
- Layer: [`sn-popup`](/en/components/uni/popup)
