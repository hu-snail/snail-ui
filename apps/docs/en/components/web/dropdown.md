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

<Demo name="dropdown-web-context-menu" description="trigger=contextMenu: right-click opens at the pointer; select closes." />

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

See the component `ai-description.md` for the full contract.
