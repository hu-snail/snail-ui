# Dropdown · Web

Dropdown menu (n-dropdown aligned). Click / hover triggers, six placements with flip, scroll-follow.

## Basic

<Demo name="dropdown-web-basic" description="Click trigger + options (with divider)." />

## Hover trigger

<Demo name="dropdown-web-hover" description="300ms close delay, cancelled on panel hover." />

## Placement

<Demo name="dropdown-web-placement" description="Six placements + flip." />

## Submenu

<Demo name="dropdown-web-submenu" description="Slide-out second level + keyboard nav." />

## Context menu (right-click)

`trigger="contextMenu"` (Arco Design parity): a right-click opens the panel
anchored to the **pointer** and replaces the native context menu; another
right-click re-anchors it. The `placement` alignment suffix still applies
around the cursor point.

<Demo name="dropdown-web-context-menu" description="trigger=contextMenu: right-click opens at the pointer; icon rows; select closes." />

## Icons

`options[].icon` accepts any Vue icon component (same convention as SnMenu
`icon`) and renders identically under the click / hover / contextMenu
triggers.

## Custom panel (#content slot)

Providing the scoped `#content` slot takes over the panel body entirely
(`options` and submenus are ignored). The slot scope is `{ close }` — call
`close()` from a custom row to dismiss. In this mode the component stops
managing the option keyboard walk (Enter/Space still open, Esc and
outside-click still close); the custom content owns its a11y. Combine with
`trigger="contextMenu"` for a fully custom context menu.

<Demo name="dropdown-web-content-slot" description="#content slot: custom icon rows, danger row, footer; close() dismisses." />

## API

### SnDropdown Props

| Prop      | Type                              | Default    | Notes                                                                         |
| --------- | --------------------------------- | ---------- | ----------------------------------------------------------------------------- |
| options   | `SnDropdownOption[]`              | `[]`       | {label, key, disabled?, icon?, children?}; type:'divider' renders a separator |
| trigger   | `'click'\|'hover'\|'contextMenu'` | `'hover'`  | Trigger mode; `contextMenu` opens on right-click anchored to the pointer      |
| placement | bottom/top ± start/end (6)        | `'bottom'` | Popup placement (flip keeps the suffix)                                       |
| disabled  | `boolean`                         | `false`    | Disabled                                                                      |
| size      | `'small'\|'medium'\|'large'`      | `'medium'` | Size                                                                          |
| show      | `boolean`                         | —          | Controlled (v-model:show)                                                     |

Events: `update:show` / `select(key, option)` / `clickoutside`. Keyboard: Enter/Space/ArrowDown open, ArrowUp/Down highlight, ArrowRight/Left enter/exit submenu, Esc close. ARIA: menu/menuitem/separator.

### SnDropdown Slots

| Slot    | Scope       | Notes                                                                                                                                                                                                                                                                                                                                          |
| ------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| default | —           | Trigger content. Render a focusable element (its keydown bubbles to the wrapper so keyboard users can open the menu).                                                                                                                                                                                                                          |
| content | `{ close }` | Takes over the panel body: `options` and submenus are ignored while provided; call `close()` from custom rows to dismiss. The option keyboard walk is disabled in this mode (Enter/Space still open, Esc / outside-click still close); the custom content owns its a11y. Combine with `trigger="contextMenu"` for a fully custom context menu. |

Icons: `options[].icon` accepts any Vue icon component (same convention as SnMenu `icon`), identical under the click / hover / contextMenu triggers.

See the component `ai-description.md` for the full contract.
