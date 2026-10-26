# SnLoadingBar / SnLoadingBarProvider — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end loading bar
> components. Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware
> listing. **`end: web`** marker — consumed by `list_components({ end: 'web' })`.
>
> Task: AUI-WEB-FB-013.

## Meta Information (internal)

Per AGENTS.md §112 / §114.4, the reference-library relation is recorded here
and in the SFC header comments — never in user-facing docs.

- Reference library: naive-ui `n-loading-bar` + `n-loading-bar-provider` +
  `useLoadingBar`
  (https://www.naiveui.com/zh-CN/light/components/loading-bar)
- Files: `SnLoadingBar.vue` (presentational bar), `SnLoadingBarProvider.vue`
  (state machine + provide + Teleport), `use-loading-bar.ts` (inject + no-op
  fallback), `loading-bar-types.ts` (public types)
- Exported (main-thread registration in `index.ts`): `SnLoadingBar`,
  `SnLoadingBarProvider`, `useLoadingBar`, and the `loading-bar-types.ts`
  type surface

## Purpose

Route/request-level progress feedback: a fixed, full-width 2px strip at the
top of the viewport. `start()` grows the width with a decelerating animation
that never completes on its own; `finish()` sprints to 100% and fades out;
`error()` does the same with the danger colour.

## Import

```ts
import { SnLoadingBar, SnLoadingBarProvider, useLoadingBar } from '@snui/vue-web';
```

## Component Surface

### `<SnLoadingBarProvider>` Props

| Name              | Type                                           | Default     | Description                            |
| ----------------- | ---------------------------------------------- | ----------- | -------------------------------------- |
| `to`              | `string \| HTMLElement`                        | `'body'`    | Teleport target for the bar element.   |
| `loadingBarStyle` | `{ loading?: StyleValue; error?: StyleValue }` | `undefined` | Custom inline styles per visual state. |

### `useLoadingBar()` → `LoadingBarApi`

| Method   | Signature    | Description                                                                                                      |
| -------- | ------------ | ---------------------------------------------------------------------------------------------------------------- |
| `start`  | `() => void` | Show the bar and grow the width towards 90% with a decelerating rAF loop. Repeat calls while loading are no-ops. |
| `finish` | `() => void` | Sprint to 100%, fade out, reset. No-op when idle.                                                                |
| `error`  | `() => void` | Sprint to 100% in the danger colour, fade out, reset. No-op when idle.                                           |

## Provider / composable wiring

- `loadingBarApiInjectionKey` (in `use-loading-bar.ts`) is the provide/inject
  contract; the provider `provide`s it in setup, `useLoadingBar()` injects it.
- Missing provider → `console.warn` with structured code
  **`PROVIDER_MISSING`** (message string + `{ code, component, composable }`
  payload) and a no-op `{ start, finish, error }` API. Never throws.
- State machine: `idle → loading → finishing → fading → idle`. All timers and
  the rAF loop are cancelled in `onBeforeUnmount` (§41/§42).

## Divergences from the reference library (§112.2a)

1. No-provider behaviour: the reference throws; this implementation warns
   `PROVIDER_MISSING` and returns a no-op API (AGENTS.md §83).
2. The loading loop uses `requestAnimationFrame` with a per-frame
   deceleration factor (per task spec); the reference chains `setTimeout`
   steps.
3. `finish()` / `error()` are no-ops when no loading is in progress (the
   reference shows a full-bar flash even without a prior `start()`).
4. Theming reads `--sn-web-*` tokens in CSS instead of the reference's JS
   theme object (§34). Component-specific sizes use
   `var(--sn-web-loading-bar-*, <fallback>)` hooks.
5. The bar is `aria-hidden="true"` (decorative) instead of exposing a
   `role="progressbar"`.

## Tokens Consumed (end: web)

| Token                                            | Purpose                       |
| ------------------------------------------------ | ----------------------------- |
| `--sn-web-color-action-primary`                  | Bar fill in the default state |
| `--sn-web-color-feedback-danger`                 | Bar fill in the error state   |
| `--sn-web-loading-bar-height` (fallback `2px`)   | Bar height                    |
| `--sn-web-loading-bar-z-index` (fallback `7000`) | Bar z-index                   |

## Accessibility

- Bar root: `aria-hidden="true"` — the strip is decorative; the app's own UI
  conveys loading state to assistive technology.
- `pointer-events: none` — never intercepts clicks.

## Versioning

`@snui/vue-web` — initial release. Part of AUI-WEB-FB-013 (feedback Web
components).
