# SnLoading — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end loading component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

Loading indicator. Two modes share one component:

- **Bare** — just the spinner, for empty regions or inline use.
- **Wrapper** — pass a `default` slot and the spinner is centred over the
  content, which dims and stops accepting pointer events while loading.

The spinner graphic itself lives in the internal `SnLoadingSpinner.vue`.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui
`n-spin` (https://www.naiveui.com/zh-CN/light/components/spin).

## Import

```ts
import { SnLoading } from '@snui/vue-web';
```

## Props

| Name           | Type                                                           | Default      | Description                                                                 |
| -------------- | -------------------------------------------------------------- | ------------ | --------------------------------------------------------------------------- |
| `size`         | `'tiny' \| 'small' \| 'medium' \| 'large' \| 'huge' \| number` | `'medium'`   | Size tier, or a number treated as px.                                       |
| `show`         | `boolean`                                                      | `true`       | Whether the spinner is visible (wrapper mode) / the spinner is shown.       |
| `delay`        | `number`                                                       | `undefined`  | Defer appearance by N ms. Hiding is always immediate.                       |
| `rotate`       | `boolean`                                                      | `true`       | Rotate a custom `icon` slot. Ignored by the built-in spinner (SMIL-driven). |
| `description`  | `string`                                                       | `undefined`  | Text under the spinner.                                                     |
| `contentClass` | `string`                                                       | `undefined`  | Class on the wrapped content element.                                       |
| `contentStyle` | `string \| object`                                             | `undefined`  | Style on the wrapped content element.                                       |
| `stroke`       | `string`                                                       | `undefined`  | Custom arc colour. Defaults to `--sn-web-spin-color`.                       |
| `strokeWidth`  | `number`                                                       | size-derived | Arc thickness in SVG units.                                                 |
| `scale`        | `number`                                                       | `1`          | Overall scale factor.                                                       |
| `radius`       | `number`                                                       | `100`        | SVG arc radius in design units.                                             |
| `spinning`     | `boolean`                                                      | `undefined`  | **@deprecated** — upstream alias for `show`; wins when both are set.        |

## Slots

| Name          | Description                                                             |
| ------------- | ----------------------------------------------------------------------- |
| `default`     | Wrapped content. **Presence switches the component into wrapper mode.** |
| `description` | Rich description under the spinner — overrides the `description` prop.  |
| `icon`        | Custom spinner graphic, replacing the built-in SVG arc.                 |

## Delay semantics

`delay` defers the spinner's _appearance_; hiding is always immediate. A
pending delay is cancelled on hide and on unmount, so a request that
resolves inside the delay window never flashes the spinner — the usual
reason to set `delay` at all.

## Wrapper-mode contract

While active, the wrapped content receives:

- reduced opacity (`--sn-web-spin-opacity-spinning`)
- `pointer-events: none` and `user-select: none`

so it cannot be interacted with mid-request. The overlay fades in via a
CSS `Transition`, independent of `delay`.

## §112 future markers

- `n-spin` composes `NBaseLoading` and rotates it with naive-ui's own
  `spin-rotate` keyframe when an `icon` slot is supplied. This version keeps
  the same SMIL-based arc geometry (`0→270°` group sweep, `0→135°→450°`
  circle sweep, dash-offset pulse) but drives it with `currentColor`, which
  lets `stroke` work without upstream's extra inline-style hop.
- `n-spin` emits `--n-*` theme vars per size tier. This library uses the
  `--sn-web-spin-*` token block instead.
- Upstream's `size` accepts any number through `pxfy()`; here a bare number
  is treated as px.

## Tokens Consumed (end: web)

| Token            | CSS Variable                     | Purpose                               |
| ---------------- | -------------------------------- | ------------------------------------- |
| Size — tiny      | `--sn-web-spin-size-tiny`        | `size="tiny"`                         |
| Size — small     | `--sn-web-spin-size-small`       | `size="small"`                        |
| Size — medium    | `--sn-web-spin-size-medium`      | `size="medium"` (default)             |
| Size — large     | `--sn-web-spin-size-large`       | `size="large"`                        |
| Size — huge      | `--sn-web-spin-size-huge`        | `size="huge"`                         |
| Color            | `--sn-web-spin-color`            | Arc colour                            |
| Text color       | `--sn-web-spin-text-color`       | Description text                      |
| Font size        | `--sn-web-spin-font-size`        | Description text size                 |
| Spinning opacity | `--sn-web-spin-opacity-spinning` | Dimmed content opacity                |
| Description gap  | `--sn-web-spin-description-gap`  | Space between spinner and description |

## Accessibility

- Both the bare root and the wrapper overlay are `role="img"` with
  `aria-label="loading"`.
- The internal SVG is `aria-hidden="true"` — the label sits on the wrapper,
  so screen readers announce the state once.
- The spinner graphic respects `prefers-reduced-motion` (the CSS rotation is
  disabled; the SMIL arc still conveys activity).

## Versioning

`@snui/vue-web` — initial release. Part of AUI-WEB-FB-006 (M1 feedback
Web components).
