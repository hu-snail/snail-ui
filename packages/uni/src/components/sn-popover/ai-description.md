# sn-popover — AI-Friendly Component Description
- Custom card border: `--sn-popover-border` (transparent default). The fill
  triangle overlaps the junction, so the border opens at the arrow and the
  interiors stay connected.

> Human-readable + AI-parseable description of the uni-end sn-popover component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Tap-triggered rich bubble with two display modes (`normal` card / `menu` list)
and two presentations (`anchor` pinned to the trigger / `sheet` fixed bottom
panel). Used for contextual actions ("more" menus), rich hint cards
(icon + title + description + actions), and bottom-sheet option lists.

Outside taps close an anchored bubble through the page-root `useQueue` /
`closeOutside` channel (`closeOnClickOutside`, default `true`) without
swallowing the tap — the same gesture still reaches whatever control sits under
it. The trigger and the bubble bind `@tap.stop`, so opening a bubble never
immediately closes it. On uni-app x App the page-root dispatcher never sees
page taps, so the App close paths are the trigger re-tap, the card's close
button, and the sheet mask. The card is fixed-width (`--sn-popover-width`,
default 480rpx) and auto-height: it grows with its content instead of clipping
it. The bubble defaults to the elevated surface — white in the light theme —
with the page text color; recolor via `--sn-popover-bg` / `--sn-popover-color`.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors wot-ui `wd-popover`
(https://wot-ui.cn/component/popover.html). New props added here MUST also be
added to the wd-popover parity list.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-popover v-model="open" title="Quick Tip" icon="location" content="…">
  <sn-button>提示</sn-button>
</sn-popover>
<sn-popover v-model="sheet" presentation="sheet" title="Share Options"
  :content="rows" cancel-text="取消" @menuclick="onPick">
  <sn-button>更多</sn-button>
</sn-popover>
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnPopover } from '@snui/uni';
```

## Props

| Name                  | Type                                      | Default    | Required | Description                                                                        |
| --------------------- | ----------------------------------------- | ---------- | -------- | ---------------------------------------------------------------------------------- |
| `modelValue`          | `boolean`                                 | `false`    | no       | Whether the bubble is shown (`v-model`).                                           |
| `trigger`             | `'slot' \| 'manual'`                      | `'slot'`   | no       | `slot` (default) toggles from the trigger tap (an App-only catcher node receives it on uni-app x App). `manual` leaves toggling to the page via v-model. |
| `presentation`        | `'anchor' \| 'sheet'`                     | `'anchor'` | no       | Where the popover appears (additive): pinned bubble vs fixed bottom sheet.         |
| `content`             | `string \| SnPopoverMenuItem[]`           | `''`       | no       | A string in `normal` mode, a row list in `menu` mode.                              |
| `mode`                | `'normal' \| 'menu'`                      | `'normal'` | no       | Bubble display mode.                                                               |
| `title`               | `string`                                  | `''`       | no       | Bold card title (additive); centred sheet heading in `sheet` mode.                 |
| `subtitle`            | `string`                                  | `''`       | no       | Muted line under the title — a timestamp, or the sheet description (additive).     |
| `iconData`            | `IconData`                                | —          | no       | Header glyph as inline SVG data (additive). Highest precedence.                    |
| `iconUrl`             | `string`                                  | `''`       | no       | Header glyph as an image address (additive). Beats `icon`, loses to `iconData`.    |
| `icon`                | `string`                                  | `''`       | no       | Header glyph as an SnIcon registry name (additive).                                |
| `placement`           | 12-direction `PlacementType`              | `'bottom'` | no       | Bubble anchor (anchor presentation; ignored by `sheet`).                           |
| `offset`              | `number \| number[] \| { x?, y? }`        | `0`        | no       | Gap in design px; published as `--sn-popover-offset-x` / `-y`.                     |
| `visibleArrow`        | `boolean`                                 | `true`     | no       | Render the arrow (anchor presentation).                                            |
| `disabled`            | `boolean`                                 | `false`    | no       | Disables the trigger.                                                              |
| `showClose`           | `boolean`                                 | `false`    | no       | Render a close button in the card header.                                          |
| `actions`             | `SnPopoverAction[]`                       | `[]`       | no       | Full-width pill buttons under the bubble body (additive).                          |
| `closeOnAction`       | `boolean`                                 | `true`     | no       | Close the bubble after an action / menu row tap (additive).                        |
| `cancelText`          | `string`                                  | `''`       | no       | Sheet Cancel pill label — empty hides the pill (additive, sn-action-sheet parity). |
| `closeOnClickOutside` | `boolean`                                 | `true`     | no       | Close on an outside tap through the page-root `closeOutside` channel (additive, AUI-OPT-07). |
| `customClass`         | `string`                                  | `''`       | no       | Custom class for the root node.                                                    |
| `customStyle`         | `string`                                  | `''`       | no       | Custom inline style for the root node.                                             |
| `customArrow`         | `string`                                  | `''`       | no       | Extra class on the arrow node.                                                     |
| `customPop`           | `string`                                  | `''`       | no       | Extra class on the bubble node.                                                    |
| `rootPortal`          | `boolean`                                 | `false`    | no       | **Not implemented** — declared for parity; miniprogram has no portal host.         |

### `SnPopoverMenuItem`

| Field         | Type       | Description                                                                           |
| ------------- | ---------- | ------------------------------------------------------------------------------------- |
| `content`     | `string`   | Row title.                                                                            |
| `description` | `string`   | Muted second line under the title (additive).                                         |
| `iconBg`      | `string`   | Row glyph plate fill — colored plate when set (additive).                             |
| `iconColor`   | `string`   | Row glyph color (additive).                                                           |
| `iconData`    | `IconData` | Inline icon data — highest precedence, no registration step (additive).               |
| `iconUrl`     | `string`   | Image address, rendered as `<image>` (additive).                                      |
| `icon`        | `string`   | Icon name resolved through SnIcon: registry → built-in catalog → provider (additive). |
| `iconClass`   | `string`   | Legacy field: an `sn-icon` name, or an image URL (lowest precedence).                 |
| `disabled`    | `boolean`  | Disable the row — taps are ignored.                                                   |

### `SnPopoverAction`

| Field      | Type                        | Description                                    |
| ---------- | --------------------------- | ---------------------------------------------- |
| `label`    | `string`                    | Button label.                                  |
| `type`     | `'default' \| 'danger'`     | `danger` renders the label in the danger color. |
| `disabled` | `boolean`                   | Disable the button — taps are ignored.         |

## Events

| Name                | Payload                                      | Description                              |
| ------------------- | -------------------------------------------- | ---------------------------------------- |
| `update:modelValue` | `boolean`                                    | Visibility changed.                      |
| `open`              | —                                            | Bubble shown.                            |
| `close`             | —                                            | Bubble hidden.                           |
| `change`            | `{ show: boolean }`                          | Visibility changed.                      |
| `menuclick`         | `{ item: SnPopoverMenuItem, index: number }` | A `menu` mode row was tapped.            |
| `actionclick`       | `{ item: SnPopoverAction, index: number }`   | An action pill was tapped (additive).    |
| `cancel`            | —                                            | The sheet Cancel pill was tapped (additive). |

## Slots

| Name      | Description                                           |
| --------- | ----------------------------------------------------- |
| `default` | Trigger content.                                      |
| `content` | Custom bubble body; replaces `content` in both modes. |
| `footer`  | Card footer strip under the body (additive) — a tag row, a meta line. |

## Exposed Methods

| Name               | Description                                    |
| ------------------ | ---------------------------------------------- |
| `open()`           | Show the bubble.                               |
| `close()`          | Hide the bubble.                               |
| `updatePosition()` | Compatibility no-op — placement is CSS-driven. |

## Tokens Consumed (end: mp)

| Token          | CSS Variable                                                                                                                                                                     | Purpose                                                                   |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Bubble palette | `--sn-popover-bg` (default: `--sn-mp-color-background-elevated`), `--sn-popover-color` (default: `--sn-mp-color-text-primary`)                                                   | Bubble fill (white in the light theme) / text; the arrow follows the fill |
| Bubble widths  | `--sn-popover-width` (default `480rpx`), `--sn-popover-menu-width` (default `320rpx`)                                                                                            | Fixed card widths — the cross-platform replacement for `max-content` sizing (uni-app x App drops it) |
| Header glyph   | `--sn-popover-icon-size` (default `--sn-mp-icon-size-medium`), `--sn-popover-icon-plate-size` (default `72rpx`), `--sn-popover-icon-bg` (default sunken), `--sn-popover-icon-color` (default secondary) | Tinted circle behind the card / sheet row glyph     |
| Glyph scale    | `--sn-popover-menu-icon-size` (default: `--sn-mp-icon-size-medium`), `--sn-popover-close-icon-size` (default: `--sn-mp-icon-size-small`)                                         | Menu row glyph / close glyph; both are overridable via `custom-style`     |
| Muted text     | `--sn-mp-color-text-secondary`, `--sn-mp-color-text-tertiary`                                                                                                                    | Description / subtitle / menu second line                                 |
| Disabled       | `--sn-mp-color-text-disabled`                                                                                                                                                    | Disabled row (via opacity)                                                |
| Elevation      | `--sn-mp-shadow-md` (App fallback; H5 / MP use `filter: drop-shadow` following the silhouette)                                                                                   | Bubble + arrow elevation                                                  |
| Card border    | `--sn-popover-border` (default transparent — borderless reference card; set it via custom-style for a custom border — the fill triangle opens the border at the arrow)                | Card outline                                                              |
| Radius         | `--sn-mp-radius-lg` (card), `--sn-mp-radius-full` (pills / plate), `--sn-mp-radius-xl` (sheet top)                                                                               | Corners                                                                   |
| Scrim          | `--sn-mp-color-background-overlay`                                                                                                                                               | Sheet mask                                                                |
| Spacing        | `--sn-mp-spacing-1/2/3/4/5`                                                                                                                                                      | Padding / gaps                                                            |
| Typography     | `--sn-mp-font-size-xs/sm/md/lg`, `--sn-mp-font-weight-medium/semibold`, `--sn-mp-font-line-height-normal`                                                                        | Card text hierarchy                                                       |

## Accessibility

- Trigger carries `role="button"` + `aria-expanded` + `aria-disabled`
- Bubble / sheet carry `role="dialog"`; the arrow and the sheet handle are `aria-hidden="true"`
- `menu` rows carry `role="menuitem"` + `aria-disabled`
- Action pills and the Cancel pill carry `role="button"` + `aria-label` + `aria-disabled`
- The App trigger catcher is `aria-hidden="true"` and takes no screen-reader focus
- Interaction uses `@tap`; no hover trigger (miniprogram has none)

## Documented Divergences

- No hover trigger: there is no hover on miniprogram, so the trigger is always
  tapped. The `trigger` prop switches between slot-internal toggling and
  page-driven v-model toggling — it is not a hover/click selector.
- Click-outside close (additive AUI-OPT-07): the page-root
  `useQueue` / `closeOutside` channel closes the anchored bubble without
  swallowing the tap (the transparent full-viewport mask was removed). The
  trigger and the bubble bind `@tap.stop`, so sibling triggers switch bubbles
  in one gesture; pass `closeOnClickOutside="false"` to unregister while
  mounted. A `sheet` presentation has its own mask — the mask tap is the
  outside close.
- Rich card body (additive): header glyph plate + title + subtitle, footer
  slot, action pills; menu rows gain a muted `description` line.
- Sheet presentation (additive): fixed bottom panel with mask, handle,
  centred heading, rich rows, action pills and the Cancel pill. It ignores
  `placement` / `visibleArrow` / `offset`.
- Fixed-width cards (additive, cross-platform): `max-content` / `min()` /
  `vw` sizing is unsupported on uni-app x App and was the "bubble renders
  collapsed / invisible" bug — the card width is now a component var.
- App trigger catcher (uni-app x App): taps on slot content never reach the
  component's own views there — an `#ifdef APP` transparent catcher over the
  trigger box receives the tap and runs the same toggle. Web / MP strip the
  node; there the wrapper's `@tap` fires by native bubbling.
- One-shape arrow: a border-triangle fill (40rpx base × 16rpx tall,
  tooltip parity) flush with the bubble edge — no own border, no own
  shadow. The trigger gap equals the arrow height, so the apex lands
  exactly on the trigger edge (reference). The fill paints the card color
  once across the junction, so the interiors connect and the arrow reads
  as one shape with the borderless card under the pop's drop-shadow.
- One-shape elevation: the card is borderless (reference design) and its
  shadow is `filter: drop-shadow` on H5 / miniprogram — the shadow follows
  the true rendered silhouette, card plus protruding arrow. uni-app x App
  has no filter support and falls back to the `box-shadow` token behind
  conditional compilation (breaking: `--sn-popover-border` removed with
  the outline; the doodle skin draws its own hand-drawn border).
- Auto height (additive AUI-OPT-07): the card is `height: auto`, labels wrap,
  and glyph boxes follow the icon-size tokens instead of a fixed square.
- Menu row glyphs: `iconData` / `iconUrl` / `icon` are additive (AUI-OPT-07,
  AGENTS.md §112.3a); the legacy `iconClass` field keeps its wd-parity
  name-or-image-address semantics at the lowest precedence.
- `root-portal` is declared but not implemented.
- `updatePosition()` is a no-op.

## Disposal

One transition timer keeps the bubble mounted for the fade-out leg; cleared on
every leg change and in `onBeforeUnmount` (AGENTS.md §41). No global listener.

## Versioning

`@snui/uni@0.4.0` — M2 overlay / interaction batch. Rich card body, sheet
presentation and fixed-width geometry added in the reference-design refactor.
