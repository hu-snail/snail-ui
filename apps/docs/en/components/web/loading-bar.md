# LoadingBar (Web)

`SnLoadingBarProvider` + `useLoadingBar()` provide a global loading progress strip pinned to the top of the viewport: thin, full-width, above every overlay. Best for route transitions and global requests — the "page is busy" signal.

## When to use

- Page-level loading feedback: route changes, global data refreshes.
- Requests with unknown progress: `start()` keeps the bar creeping forward without completing; end with `finish()` / `error()`.

Not suitable: localised spinners belong in `SnLoading`; exact percentages should be implemented in the app itself — this component carries no real progress.

## Basic usage

Wrap your app (or a subtree) in `SnLoadingBarProvider`, then call `useLoadingBar()` inside a descendant's `setup()`:

<Demo name="loading-bar-web-basic" description="Provider wrapper + start / finish / error triggers" />

## API

### SnLoadingBarProvider Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `to` | `string \| HTMLElement` | `'body'` | Teleport target for the bar element. |
| `loading-bar-style` | `{ loading?: StyleValue; error?: StyleValue }` | `undefined` | Custom inline styles per state: `loading` applies to the default-colour phase, `error` to the error sprint. |

### useLoadingBar()

Call inside the `setup()` of a component nested under `SnLoadingBarProvider`. Returns `LoadingBarApi`:

| Method | Signature | Description |
| --- | --- | --- |
| `start` | `() => void` | Show the bar and grow its width fast-then-slow towards 90%, never completing on its own. Repeat calls while loading are no-ops. |
| `finish` | `() => void` | Sprint to 100%, fade out, reset. No-op when idle. |
| `error` | `() => void` | Sprint to 100% in the danger colour, hold briefly, fade out, reset. No-op when idle. |

Calling `useLoadingBar()` without a provider never throws: it logs a structured `PROVIDER_MISSING` warning and returns a safe no-op API (`start` / `finish` / `error` do nothing).

## Usage example

```vue
<script setup lang="ts">
import { defineComponent, h, onBeforeUnmount } from 'vue'
import { SnButton, SnLoadingBarProvider, useLoadingBar } from '@snui/vue-web'

// useLoadingBar must run in the setup() of a provider descendant
const Trigger = defineComponent({
  name: 'LoadingBarTrigger',
  setup() {
    const loadingBar = useLoadingBar()
    let timer: ReturnType<typeof setTimeout> | undefined

    const startLoading = () => {
      loadingBar.start()
      timer = setTimeout(() => loadingBar.finish(), 2000)
    }

    const startFailing = () => {
      loadingBar.start()
      timer = setTimeout(() => loadingBar.error(), 1200)
    }

    onBeforeUnmount(() => clearTimeout(timer))

    return () => [
      h(SnButton, { type: 'primary', onClick: startLoading }, () => 'Start loading'),
      h(SnButton, { onClick: startFailing }, () => 'Simulate failure'),
    ]
  },
})
</script>

<template>
  <SnLoadingBarProvider>
    <Trigger />
  </SnLoadingBarProvider>
</template>
```

## Behaviour details

- **start**: a `requestAnimationFrame` loop growing the width by `width += (90 - width) × 0.035` per frame — fast initial steps, decelerating tail, so a hanging request never finishes on its own.
- **finish / error**: stop the loop → 0.25s sprint to 100% → fade out (the error colour holds 120ms longer) → reset to 0.
- Unmounting the provider cancels the animation frame and all timers — nothing leaks.

## Theming

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
