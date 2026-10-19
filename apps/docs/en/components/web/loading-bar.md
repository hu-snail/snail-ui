# LoadingBar (Web)

`SnLoadingBarProvider` + `useLoadingBar()` provide a global loading progress strip pinned to the top of the viewport: thin, full-width, above every overlay — the "page is busy" signal.

## When to use

- Page-level loading feedback: route changes, global data refreshes.
- Requests with unknown progress: `start()` keeps the bar creeping forward without completing; end with `finish()` / `error()`.
- Loading feedback that must live outside any local container and always sit on top of the viewport.

Not suitable: localised spinners belong in `SnLoading`; exact percentages should be implemented by the app itself — this component carries no real progress.

## Demos

### Basic usage

Wrap your app (or a subtree) in `SnLoadingBarProvider`, then call `useLoadingBar()` inside a descendant's `setup()` — this demo covers start / immediate finish / simulated failure:

<Demo name="loading-bar-web-basic" description="Provider wrapper + start / finish / error triggers" />

### Full flow and error comparison

The same flow runs twice: `start()` → growing width → `finish()`, and `start()` → growing width → `error()`. The trace panel on the right records the call order:

<Demo name="loading-bar-web-flow" description="Two buttons: start() → growing → finish() / error() full-flow comparison" />

## API

### Props

`SnLoadingBarProvider` props:

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `to` | `string \| HTMLElement` | `'body'` | Teleport target for the bar element. |
| `loading-bar-style` | `{ loading?: StyleValue; error?: StyleValue }` | `undefined` | Custom inline styles for the bar: `loading` applies to the default-colour phase, `error` to the error sprint. |

The provider's default slot carries the trigger area (see Slots below).

### loading-bar-style

The two fields of `loading-bar-style` from the table above:

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `loading` | `StyleValue` | `undefined` | Inline style merged during the default-colour phase, alongside the component's own width/opacity style. |
| `error` | `StyleValue` | `undefined` | Inline style merged during the `error()` sprint. |

### Slots

| Name | Params | Description |
| --- | --- | --- |
| `default` | `()` | Carries the trigger area; `useLoadingBar()` must be called inside one of its descendants. |

### Methods

Call `useLoadingBar()` inside the `setup()` of a **descendant** of `SnLoadingBarProvider` to get a `LoadingBarApi`:

| Method | Signature | Description |
| --- | --- | --- |
| `start` | `() => void` | Show the bar and grow its width fast-then-slow towards 90%, never completing on its own. Repeat calls while loading are no-ops. |
| `finish` | `() => void` | Stop growing, sprint to 100% in the default colour, then fade out and reset to 0. A no-op when idle. |
| `error` | `() => void` | Stop growing, switch to the danger colour, sprint to 100%, hold a moment longer, then fade out and reset. A no-op when idle. |

Behaviour details:

- **start**: a `requestAnimationFrame` loop growing the width by `width += (90 - width) × 0.035` per frame — fast initial steps, decelerating tail, so a hanging request never finishes on its own.
- **finish / error**: stop the loop → 0.25s sprint to 100% → fade out (the error colour holds 120ms longer) → reset to 0.
- Phase machine: `idle` → `loading` → `finishing` → `fading` → `idle`; the bar is only visible during `loading` / `finishing`.
- Unmounting the provider cancels the animation frame and all timers — nothing leaks.

Calling `useLoadingBar()` without a provider never throws: it logs a structured `PROVIDER_MISSING` warning and returns a safe no-op API (`start` / `finish` / `error` do nothing).

## Tokens

| Token | Fallback | Description |
| --- | --- | --- |
| `--sn-web-loading-bar-height` | `2px` | Bar height |
| `--sn-web-loading-bar-z-index` | `7000` | Bar z-index |

Also consumed: `--sn-web-color-action-primary` (default colour), `--sn-web-color-feedback-danger` (error colour).

## Accessibility

- The strip is **purely decorative**: the container is `aria-hidden="true"` and is not announced to assistive technology; loading state should be conveyed by the app's own UI.
- The container has `pointer-events: none` and never intercepts clicks.

## AI Patch Boundary

| Field | AI-safe to modify | Notes |
| --- | --- | --- |
| When `start` / `finish` / `error` are called | yes | Pure trigger semantics, no parameters |
| `loading-bar-style` | no — needs human review | Inline style injection; review for visual consistency |
| `to` | no — needs human review | Affects global mount point and stacking context |

## Known trade-offs

- `finish()` / `error()` while idle show nothing (no full-bar flashback).
- The progress value is a visual simulation only; no real progress reading is exposed.
