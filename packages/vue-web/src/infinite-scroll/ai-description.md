# SnInfiniteScroll — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end infinite scroll
> component. Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware
> listing. **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

Load more content when the user scrolls near the bottom of a container,
with a built-in pending spinner and a re-entrancy guard.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui
`n-infinite-scroll`
(https://www.naiveui.com/zh-CN/light/components/infinite-scroll).

## Import

```ts
import SnInfiniteScroll from '@snui/vue-web/src/infinite-scroll/SnInfiniteScroll.vue';
```

## Props

| Name             | Type                          | Default     | Required | Description                                                                                                                                 |
| ---------------- | ----------------------------- | ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `distance`       | `number`                      | `0`         | no       | Bottom-distance threshold (px) that triggers `load`.                                                                                        |
| `load`           | `() => Promise<void> \| void` | `undefined` | no       | Called when the container is scrolled within `distance` of the bottom; a pending promise blocks further triggers; rejections are swallowed. |
| `scrollbarProps` | `Record<string, unknown>`     | `undefined` | no       | Extra attributes for the internal scroll container.                                                                                         |
| `showLoading`    | `boolean`                     | `true`      | no       | Render an inline-SVG spinner below the content while `load` is pending.                                                                     |

## Events

None. (The reference has no events either — pass `load` as a function prop.)

## Slots

| Name      | Description         |
| --------- | ------------------- |
| `default` | Scrollable content. |

## Divergences from the reference API

- The reference delegates scrolling to its internal `n-scrollbar`; this
  component renders its own scroll container (`overflow: auto` on the root
  element; height / max-height come from consumer styles, e.g.
  `style="height: 240px"`). `scrollbarProps` is spread onto the root
  element instead of a Scrollbar instance.
- `showLoading` is an addition: the reference ships no built-in loading UI
  (its demos render their own).
- No stop condition: after `load` resolves, loading re-arms and fires again
  on the next scroll / wheel event, matching the reference — consumers stop
  by no longer appending content.

## Behavior Notes

- Triggers when `scrollTop + clientHeight >= scrollHeight - distance`,
  on `scroll` and on downward `wheel` deltas.
- While pending: no re-trigger (re-entrancy guard) and the root gets
  `sn-infinite-scroll--loading`.
- `scroll` / `wheel` listeners are attached on mount and removed on
  unmount.
- Sizing: the container needs a constrained height from the consumer
  (e.g. `height: 240px`), otherwise it never scrolls.

## Tokens Consumed (end: web)

| Token         | CSS Variable                   | Purpose       |
| ------------- | ------------------------------ | ------------- |
| Text tertiary | `--sn-web-color-text-tertiary` | Spinner color |

## Versioning

`@snui/vue-web@0.2.0` — initial release. Part of AUI-WEB-DD-011.
