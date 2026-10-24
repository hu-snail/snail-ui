# sn-sn-slide-verify — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end Drag-to-confirm slider captcha: the handle must travel to the right edge (minus `tolerance`) before `success` fires..
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Drag-to-confirm slider captcha: the handle must travel to the right edge (minus `tolerance`) before `success` fires.

## Reference Library

Per AGENTS.md §112, the API surface mirrors wot-ui `wd-slide-verify`
(https://wot-ui.cn/component/slide-verify.html). New props added here MUST also be
added to the parity list.


## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-slide-verify text="向右拖动滑块" @success="onVerified" />
```

```ts
import SnSlideVerify from '@snui/uni-src/components/sn-slide-verify/sn-slide-verify.vue'
```


## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `tolerance` | `number` | `10` | Pixels of slack at the right edge. |
| `text` / `successText` | `string` | `''` | Hint / success copy (empty = built-in). |
| `disabled` | `boolean` | `false` | Blocks dragging. |
| `backgroundColor` / `activeBackgroundColor` | `string` | `''` | Track colors (CSS colors). |
| `customClass` / `customStyle` | `string` | `''` | Root forwarding. |


## Events

| Name | Payload | When |
| --- | --- | --- |
| `success` | — | The handle reached the end. |
| `fail` | — | The handle was released short of the end. |


## Exposed API

| Member | Signature | Description |
| --- | --- | --- |
| `init` | `() => void` | Re-measure the track width. |
| `reset` | `() => void` | Return the handle to the start. |


## Not Implemented

The puzzle-piece background (needs canvas). The icon props (`icon` / `successIcon` / `iconPrefix` / `cssIcon` / `iconSize` / `successIconSize`) ARE declared and wired like `sn-button`: a name resolves through the iconfont convention, `cssIcon` renders a bare class, and the sizes drive the glyph box; empty names keep the built-in SVG glyphs (`ChevronRight` → `Check`), which the `icon` / `success-icon` slots still override. This build verifies distance only, so it is a "confirm you are human" gesture, not a bot filter.


## Tokens Consumed (end: mp)

| Token | Purpose |
| --- | --- |
| `--sn-mp-color-background-soft` | Track fill |
| `--sn-mp-color-feedback-success-soft` | Verified track fill |
| `--sn-mp-color-feedback-success` | Verified text + handle glyph |
| `--sn-mp-color-background-elevated` | Handle plate |
| `--sn-mp-color-action-primary` | Idle handle glyph |
| `--sn-mp-color-text-tertiary` | Hint text |
| `--sn-mp-radius-md` | Track + handle corners |
| `--sn-mp-shadow-sm` | Handle shadow |


## Accessibility

- Root is `role="group"` with `aria-label` carrying the hint text.
- The handle is `role="button"` with `aria-label`; `tabindex` drops to `-1` when disabled or verified.
- The track carries `aria-disabled`.


## Versioning

`@snui/uni@0.5.0` — initial release.
