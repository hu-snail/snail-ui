# sn-popover — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-popover component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Tap-triggered bubble with two modes: `normal` (plain text / custom content) and
`menu` (a tappable option list). Used for contextual actions ("more" menus) and
inline rich hints on mobile / miniprogram.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors wot-ui `wd-popover`
(https://wot-ui.cn/component/popover.html). New props added here MUST also be
added to the wd-popover parity list.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-popover v-model="open" mode="menu" :content="items" @menuclick="onPick">
  <sn-button>更多</sn-button>
</sn-popover>
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnPopover } from '@snui/uni';
```

## Props

| Name           | Type                               | Default    | Required | Description                                                                |
| -------------- | ---------------------------------- | ---------- | -------- | -------------------------------------------------------------------------- |
| `modelValue`   | `boolean`                          | `false`    | no       | Whether the bubble is shown (`v-model`).                                   |
| `content`      | `string \| SnPopoverMenuItem[]`    | `''`       | no       | A string in `normal` mode, a row list in `menu` mode.                      |
| `mode`         | `'normal' \| 'menu'`               | `'normal'` | no       | Bubble display mode.                                                       |
| `placement`    | 12-direction `PlacementType`       | `'bottom'` | no       | Bubble anchor.                                                             |
| `offset`       | `number \| number[] \| { x?, y? }` | `0`        | no       | Gap in design px; published as `--sn-popover-offset-x` / `-y`.             |
| `visibleArrow` | `boolean`                          | `true`     | no       | Render the arrow.                                                          |
| `disabled`     | `boolean`                          | `false`    | no       | Disables the trigger.                                                      |
| `showClose`    | `boolean`                          | `false`    | no       | Render a close button inside the bubble.                                   |
| `customClass`  | `string`                           | `''`       | no       | Custom class for the root node.                                            |
| `customStyle`  | `string`                           | `''`       | no       | Custom inline style for the root node.                                     |
| `customArrow`  | `string`                           | `''`       | no       | Extra class on the arrow node.                                             |
| `customPop`    | `string`                           | `''`       | no       | Extra class on the bubble node.                                            |
| `rootPortal`   | `boolean`                          | `false`    | no       | **Not implemented** — declared for parity; miniprogram has no portal host. |

### `SnPopoverMenuItem`

| Field       | Type      | Description                               |
| ----------- | --------- | ----------------------------------------- |
| `content`   | `string`  | Row label.                                |
| `iconClass` | `string`  | `sn-icon` registry name, or an image URL. |
| `disabled`  | `boolean` | Disable the row — taps are ignored.       |

## Events

| Name                | Payload                                      | Description                   |
| ------------------- | -------------------------------------------- | ----------------------------- |
| `update:modelValue` | `boolean`                                    | Visibility changed.           |
| `open`              | —                                            | Bubble shown.                 |
| `close`             | —                                            | Bubble hidden.                |
| `change`            | `{ show: boolean }`                          | Visibility changed.           |
| `menuclick`         | `{ item: SnPopoverMenuItem, index: number }` | A `menu` mode row was tapped. |

## Slots

| Name      | Description                                           |
| --------- | ----------------------------------------------------- |
| `default` | Trigger content.                                      |
| `content` | Custom bubble body; replaces `content` in both modes. |

## Exposed Methods

| Name               | Description                                    |
| ------------------ | ---------------------------------------------- |
| `open()`           | Show the bubble.                               |
| `close()`          | Hide the bubble.                               |
| `updatePosition()` | Compatibility no-op — placement is CSS-driven. |

## Tokens Consumed (end: mp)

| Token         | CSS Variable                                              | Purpose                |
| ------------- | --------------------------------------------------------- | ---------------------- |
| Surface       | `--sn-mp-color-background-elevated`                       | Bubble background      |
| Text          | `--sn-mp-color-text-primary`                              | Bubble / row text      |
| Muted text    | `--sn-mp-color-text-secondary`                            | Row icon               |
| Disabled text | `--sn-mp-color-text-disabled`                             | Disabled row           |
| Border        | `--sn-mp-color-border-subtle`                             | Bubble + arrow outline |
| Elevation     | `--sn-mp-shadow-md`                                       | Bubble shadow          |
| Radius        | `--sn-mp-radius-md`                                       | Bubble corners         |
| Spacing       | `--sn-mp-spacing-2/3/4`                                   | Padding / gaps         |
| Typography    | `--sn-mp-font-size-sm`, `--sn-mp-font-line-height-normal` | Bubble text            |

## Accessibility

- Trigger carries `role="button"` + `aria-expanded` + `aria-disabled`
- Bubble carries `role="dialog"`; the arrow is `aria-hidden="true"`
- `menu` rows carry `role="menuitem"` + `aria-disabled`
- Interaction uses `@tap`; no hover trigger (miniprogram has none)

## Documented Divergences

- No `trigger` prop: there is no hover on miniprogram, so the trigger is always tapped.
- `root-portal` is declared but not implemented.
- `updatePosition()` is a no-op.
- `iconClass` is an `sn-icon` registry name / image URL, not a CSS class.

## Disposal

One transition timer keeps the bubble mounted for the fade-out leg; cleared on
every leg change and in `onBeforeUnmount` (AGENTS.md §41). No global listener.

## Versioning

`@snui/uni@0.4.0` — initial release. Part of the M2 overlay / interaction batch.
