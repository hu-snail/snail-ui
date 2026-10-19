# SnPopselect — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end popselect
> component. Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware
> listing. **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

A bubble selector anchored to a trigger: opens a white listbox menu,
supports single and multiple selection, keyboard navigation (↑ ↓ Enter
Esc), and custom row renderers. Selecting a value in single mode closes
the menu; multiple mode keeps it open.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui
`n-popselect` (https://www.naiveui.com/zh-CN/light/components/popselect).

## Import

```ts
import SnPopselect from '@snui/vue-web/src/popselect/SnPopselect.vue'
```

## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `options` | `SnSelectOptionInput[]` | `[]` | no | Bare values or `{ label, value, disabled, children }` records (`children` renders a group header). Same shape as SnSelect options. |
| `value` | `SnSelectValue \| SnSelectValue[] \| null \| undefined` | `undefined` | no | Selected value(s); `undefined` = uncontrolled mode. |
| `defaultValue` | `SnSelectValue \| SnSelectValue[] \| null` | `null` (`[]` when `multiple`) | no | Initial value for uncontrolled mode. |
| `multiple` | `boolean` | `false` | no | Toggle / multi-select mode. |
| `trigger` | `'click' \| 'hover' \| 'manual' \| 'focus'` | `'click'` | no | Gesture that opens the menu. |
| `placement` | `'top-start' \| 'top' \| 'top-end' \| 'right-start' \| 'right' \| 'right-end' \| 'bottom-start' \| 'bottom' \| 'bottom-end' \| 'left-start' \| 'left' \| 'left-end'` | `'bottom'` | no | Menu position relative to the trigger. |
| `scrollable` | `boolean` | `false` | no | Cap the menu height (260px) and scroll overflow. |
| `renderLabel` | `(option: SnPopselectLeafOption, selected: boolean) => VNodeChild` | `undefined` | no | Custom row label renderer (receives the normalized leaf). |
| `renderOption` | `(info: { node, option, selected }) => VNodeChild` | `undefined` | no | Wraps the whole default row node. |
| `menuProps` | `Record<string, unknown>` | `undefined` | no | Attributes spread onto the listbox element. |
| `show` | `boolean \| undefined` | `undefined` | no | Menu show state; `undefined` = uncontrolled mode. |

## Events

| Name | Payload | Description |
|---|---|---|
| `update:value` | `SnSelectValue \| SnSelectValue[] \| null` | Selection changed (v-model:value). Single mode commits one value; multiple mode commits the full array. |
| `update:show` | `boolean` | Menu show state change (v-model:show). |

## Slots

| Name | Description |
|---|---|
| `default` | Trigger element (the visible target). |

## Divergences from the reference API

- Not implemented: `consistencyMenuWidth` (the menu sizes to its
  content), inherited `showArrow` (the menu panel draws no arrow),
  `displayDirective`, and theme overrides (token-driven).
- `renderLabel` / `renderOption` receive the *normalized* leaf (label /
  value / disabled resolved), not the raw option object.
- `labelField` / `valueField` remapping is not exposed — records use
  the `label` / `value` keys.

## Accessibility

- Menu: `role="listbox"` (+ `aria-multiselectable` in multiple mode,
  `aria-activedescendant` pointing at the highlighted row).
- Rows: `role="option"` + `aria-selected` (+ `aria-disabled`); the
  selected row shows a primary-coloured check glyph (`aria-hidden`).
- Trigger wrapper: `aria-expanded` + `aria-haspopup="listbox"`.
- Keyboard: ↑ / ↓ move the highlight (disabled rows skipped), Enter
  commits, Escape closes.

## Tokens Consumed (end: web)

| Token | CSS Variable | Purpose |
|---|---|---|
| Background surface | `--sn-web-color-background-surface` | Menu panel fill |
| Border subtle | `--sn-web-color-border-subtle` | Menu panel border |
| Card shadow | `--sn-web-card-shadow` | Menu elevation |
| Text primary | `--sn-web-color-text-primary` | Row text |
| Text tertiary | `--sn-web-color-text-tertiary` | Group header text |
| Text disabled | `--sn-web-color-text-disabled` | Disabled row text |
| Action primary | `--sn-web-color-action-primary` | Selected row text + check glyph |
| Background subtle | `--sn-web-color-background-subtle` | Pending / hover row fill |
| Focus ring | `--sn-web-focus-ring` | Row focus outline |

## Versioning

`@snui/vue-web@0.1.0` — initial release. Part of AUI-WEB-FB-011.
