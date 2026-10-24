# Signature · uni-app

`sn-signature` is the signature pad of `@snui/uni`: it samples touch points and reports the stroke geometry through `confirm`. easycom auto-registration (`components/sn-signature/sn-signature.vue` → `<sn-signature>`); geometry in `rpx`. Because `<canvas>` is not in the cross-end element allowlist, the stroke is drawn as a chain of absolutely positioned, rotated `<view>` bars — one per consecutive point pair, `width` = the segment length, `transform: rotate(θ)` about the left edge, forming a real polyline.

## Basic usage

Signature pad: touchstart / touchmove sample the points and `confirm` reports the stroke geometry (`paths`).

<Demo name="signature-mp-basic" description="Signature pad: touchstart / touchmove sample the points and `confirm` reports the stroke geometry (`paths`)." />

## Undo / redo & appearance (`enableHistory` / `penColor` / `disabled`)

`enableHistory` renders the undo / redo buttons; `penColor` overrides the stroke color; `disabled` locks the pad.

<Demo name="signature-mp-history" description="`enableHistory` renders the undo / redo buttons; `penColor` overrides the stroke color; `disabled` locks the pad." />
## Button labels (`confirmText` / `clearText` / `revokeText` / `restoreText` / `undoText` / `redoText`)

Every footer label is configurable; when both are set, `undoText` / `redoText` win over `revokeText` / `restoreText` (same as wd-signature).

<Demo name="signature-mp-button-labels" description="confirmText / clearText; revokeText / restoreText under enableHistory; undoText / redoText overrides." />

## Pad look & scrolling (`height` / `width` / `backgroundColor` / `disableScroll` / `step`)

`height` / `width` take a number (an rpx design value) or a CSS length; `backgroundColor` overrides the pad background; `disableScroll` intercepts `touchmove` so the page cannot scroll while drawing; `step` sets how many strokes one undo tap moves.

<Demo name="signature-mp-pad-look" description="height / width; backgroundColor override; disableScroll=false; step=2 undoes two strokes at a time." />

## Export & pressure parity props (`fileType` / `quality` / `exportScale` / `pressure` / `maxWidth` / `minWidth` / `minSpeed` / `custom*`)

These are declared for wd-signature parity: this build never rasterizes, so the host applies `fileType` / `quality` / `exportScale` inside the `confirm` callback, and pressure simulation (speed → width) is **not implemented** — `pressure` / `maxWidth` / `minWidth` / `minSpeed` do not change the pad behaviour. `customClass` / `customStyle` land on the root node.

<Demo name="signature-mp-export-parity" description="fileType / quality / exportScale (used by the host); pressure / maxWidth / minWidth / minSpeed (unimplemented); customClass / customStyle." />

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `penColor` | `string` | `''` | Stroke color (empty = token default) |
| `lineWidth` | `number` | `3` | Stroke width (px design units) |
| `confirmText` / `clearText` | `string` | `'确认'` / `'清空'` | Button labels |
| `revokeText` / `restoreText` | `string` | `'撤回'` / `'恢复'` | Undo / redo labels |
| `undoText` / `redoText` | `string` | `''` | Override the undo / redo labels |
| `disabled` | `boolean` | `false` | Blocks drawing and buttons |
| `height` / `width` | `string \| number` | `undefined` | Pad size; a number is an rpx design value |
| `backgroundColor` | `string` | `''` | Pad background (empty = token default) |
| `disableScroll` | `boolean` | `true` | Intercept `touchmove` while drawing |
| `enableHistory` | `boolean` | `false` | Render undo / redo |
| `step` | `number` | `1` | Strokes moved per undo / redo |
| `customClass` / `customStyle` | `string` | `''` | Root class / inline style |

> **Not implemented**: `fileType` / `quality` / `exportScale` (image export needs `<canvas>`, outside the cross-end allowlist), `pressure` / `maxWidth` / `minWidth` / `minSpeed` (speed-based width sampling is unreliable across MP renderers).

## Events

| Event | Description | Payload |
| --- | --- | --- |
| `start` / `end` / `signing` | Touch lifecycle | `(event: Event)` |
| `confirm` | Confirm pressed | `SignatureResult` |
| `clear` | Pad cleared | — |

## Exposed API

| Member | Signature | Description |
| --- | --- | --- |
| `confirm` | `() => void` | Emit the current geometry |
| `clear` | `() => void` | Clear the pad |
| `revoke` / `restore` | `() => void` | Undo / redo |
| `init` | `() => void` | Drop the redo stack |

## Slots

This component exposes no slots.

## Theme tokens

| Token | Purpose |
| --- | --- |
| ``--sn-mp-color-background-surface`` | Pad background |
| ``--sn-mp-color-border-default`` | Pad border |
| ``--sn-mp-color-text-primary`` | Default pen color |
| ``--sn-mp-color-background-soft`` | Secondary button fill |
| ``--sn-mp-color-action-primary`` | Confirm button |
| ``--sn-mp-color-text-on-primary`` | Confirm label |
| ``--sn-mp-color-background-overlay`` | Disabled scrim |
| ``--sn-mp-radius-lg` / `-full` / `-md`` | Pad / stroke / button corners |

## Accessibility

- Root is `role="group"` with `aria-label="signature pad"`.
- The pad carries `aria-disabled`.
- Every button is `role="button"` with `aria-label` / `aria-disabled`; `tabindex="-1"` when blocked.
- A visually hidden `aria-live="polite"` text echoes the step + stroke counters.

## Dark mode

Every color resolves through a `--sn-mp-*` token and there is no light literal fallback. Under `.sn-theme-dark` / `page.sn-theme-dark` the text, surfaces, borders and state colors flip automatically. Verify with:

