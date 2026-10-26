# sn-sn-signature — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end Touch signature pad. Strokes are captured as point lists and rendered as rotated `<view>` bars (no `<canvas>`), so it works on every uni target..
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Touch signature pad. Strokes are captured as point lists and rendered as rotated `<view>` bars (no `<canvas>`), so it works on every uni target.

## Reference Library

Per AGENTS.md §112, the API surface mirrors wot-ui `wd-signature`
(https://wot-ui.cn/component/signature.html). New props added here MUST also be
added to the parity list.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-signature :line-width="3" enable-history @confirm="onConfirm" />
```

```ts
import SnSignature from '@snui/uni-src/components/sn-signature/sn-signature.vue';
import type { SignatureResult } from '@snui/uni-src/components/sn-signature/sn-signature.vue';
```

## Props

| Name                          | Type               | Default             | Description                                |
| ----------------------------- | ------------------ | ------------------- | ------------------------------------------ |
| `penColor`                    | `string`           | `''`                | Stroke color (empty = token default).      |
| `lineWidth`                   | `number`           | `3`                 | Stroke width (px design units).            |
| `confirmText` / `clearText`   | `string`           | `'确认'` / `'清空'` | Button labels.                             |
| `revokeText` / `restoreText`  | `string`           | `'撤回'` / `'恢复'` | Undo / redo labels.                        |
| `undoText` / `redoText`       | `string`           | `''`                | Override the undo / redo labels.           |
| `disabled`                    | `boolean`          | `false`             | Blocks drawing and buttons.                |
| `height` / `width`            | `string \| number` | `undefined`         | Pad size; a number is an rpx design value. |
| `backgroundColor`             | `string`           | `''`                | Pad background (empty = token default).    |
| `disableScroll`               | `boolean`          | `true`              | Intercept `touchmove` while drawing.       |
| `enableHistory`               | `boolean`          | `false`             | Render undo / redo.                        |
| `step`                        | `number`           | `1`                 | Strokes moved per undo / redo.             |
| `customClass` / `customStyle` | `string`           | `''`                | Root forwarding.                           |

## Events

| Name                        | Payload           | When             |
| --------------------------- | ----------------- | ---------------- |
| `start` / `end` / `signing` | `(event: Event)`  | Touch lifecycle. |
| `confirm`                   | `SignatureResult` | Confirm pressed. |
| `clear`                     | —                 | Pad cleared.     |

## Exposed API

| Member               | Signature    | Description                |
| -------------------- | ------------ | -------------------------- |
| `confirm`            | `() => void` | Emit the current geometry. |
| `clear`              | `() => void` | Clear the pad.             |
| `revoke` / `restore` | `() => void` | Undo / redo.               |
| `init`               | `() => void` | Drop the redo stack.       |

## Not Implemented (declared, inert)

`fileType` / `quality` / `exportScale` and `pressure` / `maxWidth` / `minWidth` / `minSpeed` are **declared** for wd-signature parity but have no effect here: image export needs `<canvas>` (outside the cross-end allowlist) so the host rasterizes the geometry from `confirm`, and speed-based width sampling is unreliable across MP renderers.

## Tokens Consumed (end: mp)

| Token                                 | Purpose                       |
| ------------------------------------- | ----------------------------- |
| `--sn-mp-color-background-surface`    | Pad background                |
| `--sn-mp-color-border-default`        | Pad border                    |
| `--sn-mp-color-text-primary`          | Default pen color             |
| `--sn-mp-color-background-soft`       | Secondary button fill         |
| `--sn-mp-color-action-primary`        | Confirm button                |
| `--sn-mp-color-text-on-primary`       | Confirm label                 |
| `--sn-mp-color-background-overlay`    | Disabled scrim                |
| `--sn-mp-radius-lg` / `-full` / `-md` | Pad / stroke / button corners |

## Accessibility

- Root is `role="group"` with `aria-label="signature pad"`.
- The pad carries `aria-disabled`.
- Every button is `role="button"` with `aria-label` / `aria-disabled`; `tabindex` drops to `-1` when blocked.
- A visually hidden `aria-live="polite"` text echoes the step + stroke counters.

## Versioning

`@snui/uni@0.5.0` — initial release.
