# Popselect · Web

`SnPopselect` is a dropdown selection menu anchored to a trigger: a white listbox with single / multiple selection, grouped options, keyboard navigation and custom row renderers — for toolbar filters and light switches that don't warrant a full select field.

## When to use

- Space is tight: a small button opens the choice instead of a resident select field.
- Few, simple (possibly grouped) options whose result acts directly on the trigger.
- Multiple selection where the menu should stay open for continuous toggling.

## Demos

### Basic usage

Click to open, single selection. The selected row is marked with primary text and a check glyph; the menu closes after committing.

<Demo name="popselect-web-basic" description="single select, selected state, disabled row and grouped options" />

### Multiple and scrolling

`multiple` keeps the menu open for continuous toggling; `scrollable` caps the menu height when there are many options.

<Demo name="popselect-web-multiple" description="multiple + scrollable + controlled value" />

### Grouped options

An entry with a non-empty `children` array renders as a group header that cannot be selected and never enters the keyboard sequence; bare values sit between groups untouched.

<Demo name="popselect-web-groups" description="group headers, a disabled leaf and mixed bare values" />

### Custom row rendering

`render-label` replaces the row label (an icon prefix here) and `render-option` wraps the whole default row node to append extra information.

<Demo name="popselect-web-render" description="renderLabel icon prefix and renderOption status caption" />

## API

### Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| options | `SnSelectOptionInput[]` | `[]` | Bare values or `{ label, value, disabled, children }` records; a non-empty `children` renders a group header. |
| value | `SnSelectValue \| SnSelectValue[] \| null` | `undefined` | Selected value; `undefined` = uncontrolled mode driven by internal state. |
| default-value | `SnSelectValue \| SnSelectValue[] \| null` | `undefined` | Initial value for uncontrolled mode; `null` in single mode, `[]` in multiple mode when unset. |
| multiple | `boolean` | `false` | Toggle / multi-select mode; commits an array and keeps the menu open. |
| trigger | `'click' \| 'hover' \| 'manual' \| 'focus'` | `'click'` | Opening gesture; `'manual'` is driven by `show` only. |
| placement | `'top-start' \| 'top' \| 'top-end' \| 'right-start' \| 'right' \| 'right-end' \| 'bottom-start' \| 'bottom' \| 'bottom-end' \| 'left-start' \| 'left' \| 'left-end'` | `'bottom'` | Requested side; can flip when space runs out. |
| scrollable | `boolean` | `false` | Cap the menu height and scroll the overflowing rows. |
| render-label | `(option, selected) => VNodeChild` | `undefined` | Custom row label renderer; receives the normalized leaf and the selected flag. |
| render-option | `(info: { node, option, selected }) => VNodeChild` | `undefined` | Wraps the whole default row node to append extra information; wins over `render-label` when both are given. |
| menu-props | `Record<string, unknown>` | `undefined` | Attributes spread onto the listbox element. |
| show | `boolean` | `undefined` | Menu show state; `undefined` = uncontrolled mode driven by internal state. |

### Events

| Name | Payload | Notes |
| --- | --- | --- |
| `update:value` | `SnSelectValue \| SnSelectValue[] \| null` | Selection changed (v-model:value). Single mode commits one value, multiple mode commits the whole array. |
| `update:show` | `boolean` | Menu show state changed (v-model:show). |

### Slots

| Slot | Notes |
| --- | --- |
| default | Trigger element — the visible node the menu anchors to. |

### Methods

| Name | Type | Notes |
| --- | --- | --- |
| `show` | `() => void` | Programmatic open. |
| `hide` | `() => void` | Programmatic close. |
| `isShown` | `() => boolean` | Read the effective show state. |

## Tokens

| Token | CSS variable | Purpose |
| --- | --- | --- |
| Background surface | `--sn-web-color-background-surface` | Menu panel fill |
| Border subtle | `--sn-web-color-border-subtle` | Menu panel border |
| Card shadow | `--sn-web-card-shadow` | Menu elevation |
| Text primary | `--sn-web-color-text-primary` | Row text |
| Text tertiary | `--sn-web-color-text-tertiary` | Group header text |
| Text disabled | `--sn-web-color-text-disabled` | Disabled row text |
| Action primary | `--sn-web-color-action-primary` | Selected row text + check glyph |
| Background subtle | `--sn-web-color-background-subtle` | Pending / hover row fill |
| Focus ring | `--sn-web-focus-ring` | Row focus outline |

## Accessibility

- Menu container: `role="listbox"` (+ `aria-multiselectable` in multiple mode; `aria-activedescendant` points at the highlighted row).
- Rows: `role="option"` with `aria-selected` and `aria-disabled`; the selected row's check glyph is decorative.
- Trigger wrapper: `aria-expanded` + `aria-haspopup="listbox"`.
- Keyboard: ↑ / ↓ move the highlight (disabled rows skipped), Enter commits, Escape closes; the menu re-anchors to the trigger while the page scrolls.

## AI Patch Boundary

| Safe for AI to generate | Requires human review |
| --- | --- |
| Static `options` data (label / value / disabled / groups) and default `placement` | Controlled `value` binding (v-model:value page state wiring) |
| `trigger` / `scrollable` / `menu-props` display params | Logic inside `render-label` / `render-option` renderers |
| Static composition in docs and demos | How the multiple-selection array is consumed downstream |

See the component `ai-description.md` for the full contract.
