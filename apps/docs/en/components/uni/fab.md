# Fab · uni-app

`sn-fab` is the floating action button of `@snui/uni` (mobile / miniprogram / H5): 8 anchor presets, 4 expansion directions, 5 color themes and optional dragging. Auto-registered through easycom (`components/sn-fab/sn-fab.vue` → `<sn-fab>`); geometry uses `rpx`.

> **Not implemented**
>
> - Dragging does **not snap to an edge**: the reference snaps after release, while this implementation keeps the position where the user let go (clamped inside the viewport).

## Basic usage

`v-model:active` controls expansion; the `default` slot holds the menu items and the `trigger` slot fully replaces the trigger button.

<Demo name="fab-mp-basic" description="A bottom-right floating button expanding three actions upwards." />

## Positions and themes

`position` takes 8 presets (four corners + four edge midpoints); `gap` sets the default inset for all four edges while `top` / `bottom` / `left` / `right` override a single side; `direction` picks the expansion direction.

<Demo name="fab-mp-position" description="Four anchor presets with different themes and expansion directions." />

## Disabled, click-only and dragging

`disabled` blocks every interaction; `expandable=false` skips expansion and emits `click` instead; `draggable` enables gesture dragging (clamped to the viewport when `uni.getSystemInfoSync()` is available).

<Demo name="fab-mp-disabled" description="expandable=false (click only), disabled, and draggable." />

## Trigger icons and stacking (`inactive-icon` / `active-icon` / `z-index`)

`inactive-icon` / `active-icon` name the trigger icon while collapsed / expanded: `plus` and `close` are the two built-in names, any other name is resolved after `registerSnIcons()`. `z-index` sets the root stacking level, and `custom-style` is appended to the root inline style (written after `z-index`, so it can override it).

<Demo name="fab-mp-icons" description="Switching between the built-in plus / close names and the registered Heart / Star names; two z-index levels; customStyle adding a shadow." />

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| active | boolean | false | Whether the menu is expanded (`v-model:active`) |
| type | 'primary' \| 'success' \| 'info' \| 'warning' \| 'danger' | 'primary' | Color theme |
| position | FabPosition | 'right-bottom' | Anchor preset (8 options) |
| draggable | boolean | false | Allow dragging the trigger |
| direction | 'top' \| 'right' \| 'bottom' \| 'left' | 'top' | Menu expansion direction |
| disabled | boolean | false | Disable the whole button |
| inactiveIcon | string | 'plus' | Icon while collapsed |
| activeIcon | string | 'close' | Icon while expanded |
| zIndex | number | 99 | Stacking level |
| gap | SnFabGap | `{ top: 16, right: 16, bottom: 16, left: 16 }` | Inset from each viewport edge |
| expandable | boolean | true | Expand on tap; `false` emits `click` |
| top | number | — | Top inset (overrides `gap.top`) |
| bottom | number | — | Bottom inset (overrides `gap.bottom`) |
| left | number | — | Left inset (overrides `gap.left`) |
| right | number | — | Right inset (overrides `gap.right`) |
| customClass | string | '' | Custom class for the root node |
| customStyle | string | '' | Custom inline style for the root node |

`SnFabGap` = `{ top?, right?, bottom?, left? }` (px); `FabPosition` = `"left-top" | "right-top" | "left-bottom" | "right-bottom" | "left-center" | "right-center" | "top-center" | "bottom-center"`.

## Events

| Event | Description | Payload |
| --- | --- | --- |
| update:active | Menu expanded / collapsed | boolean |
| click | Emitted on tap when `expandable=false` | — |

## Slots

| Slot | Description |
| --- | --- |
| default | Action items rendered inside the expandable menu |
| trigger | Fully custom trigger content |

## Theme variables

| Variable | Purpose |
| --- | --- |
| --sn-mp-color-action-primary | `type="primary"` fill |
| --sn-mp-color-feedback-success` / `-info` / `-warning` / `-danger | Other type fills |
| --sn-mp-color-text-on-primary | Trigger icon color |
| --sn-mp-shadow-lg | Trigger elevation |
| --sn-mp-radius-full | Trigger shape |
| --sn-mp-spacing-2` / `--sn-mp-spacing-3 | Menu gap and root gap |

## Accessibility

- Trigger: `role="button"` + `aria-expanded` + `aria-disabled`
- Menu container: `aria-hidden` mirrors the expanded state

## Dark mode

All five type fills and the icon color come from semantic tokens (`--sn-mp-color-action-primary` / `--sn-mp-color-feedback-*` / `--sn-mp-color-text-on-primary`), all overridden in the dark block of `@snui/tokens-mp/styles`, so it adapts automatically. Set `theme` to `dark` on `sn-config-provider` to verify.

## Related

- Button: [`sn-button`](/en/components/uni/button)
- Layer: [`sn-popup`](/en/components/uni/popup)
