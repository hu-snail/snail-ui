# sn-notify — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-notify component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Stacked card notification anchored to the top (or bottom) edge of the screen.
Each message renders as an elevated rounded card — semantic-colored title and
glyph, secondary description, close pill — that slides in smoothly from the
screen edge; older messages slide down behind the front card and peek out
below (deck stack). Supports swipe-to-dismiss, auto-dismiss with per-card
duration and per-card customization (icon / colors / radius / close label).

## Reference Library

Per AGENTS.md §112, the visual spec mirrors the HeroUI `Toast` mobile demo
(card stack, close pill, semantic title colors) on top of the wot-ui
`wd-notify` (https://wot-ui.cn/component/notify.html) ancestry. The deviation
from the wd-notify parity surface — queue interaction model, stacked deck
cards, close pill — is Human-directed and registered in AGENTS.md §112.3a.

## Interaction model

One `<sn-notify>` per page (queue container). Messages are pushed through the
template ref:

```ts
const notify = ref<SnNotifyInstance | null>(null);
notify.value?.show({ title: 'Plan upgraded', description: '…', type: 'success' });
notify.value?.hide(id);
notify.value?.hideAll();
```

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-notify ref="notify" position="top" :duration="4000" />
```

```ts
import { SnNotify } from '@snui/uni';
// Type contracts (SnNotifyOptions / SnNotifyInstance / payloads) live in the
// pure ts module — the uni-x-safe import path:
import type { SnNotifyInstance, SnNotifyOptions } from '@snui/uni-x/components/sn-notify/sn-notify-types';
```

## Container Props

| Name             | Type                        | Default    | Required | Description                                              |
| ---------------- | --------------------------- | ---------- | -------- | -------------------------------------------------------- |
| `position`       | 'top' \| 'bottom'           | 'top'      | no       | Anchor of the stack.                                     |
| `duration`       | number                      | 4000       | no       | Default auto-dismiss delay in ms; `0` keeps cards open.  |
| `maxVisible`     | number                      | 3          | no       | Queue cap; the deepest cards are dropped with `overflow`. |
| `zIndex`         | number                      | 9990       | no       | Stacking level of the fixed layer.                       |
| `closable`       | boolean                     | true       | no       | Render the close pill by default.                        |
| `closeText`      | string                      | 'Close'    | no       | Default close pill label.                                |
| `swipeToDismiss` | boolean                     | true       | no       | Horizontal swipe dismisses the front card.               |
| `safeAreaInsetTop` | boolean                   | true       | no       | Top stacks auto-clear the status bar + nav band (WeChat capsule measured per AUI-MP-002; App reads the status bar + 44px nav row; H5 flat). `false` for default-navigation-bar pages. |
| `safeHeight`     | number \| string \| undefined | —        | no       | Extra top offset (bare number = px, stacked on the auto inset); a string overrides `padding-top` verbatim, replacing the auto inset. |
| `customClass`    | string                      | ''         | no       | Custom class for the root node.                          |
| `customStyle`    | string                      | ''         | no       | Custom inline style for the root node.                   |

## Methods (ref)

| Name                     | Signature                          | Description                            |
| ------------------------ | ---------------------------------- | -------------------------------------- |
| `show`                   | `(options: SnNotifyOptions) => string` | Queue a message; returns its id.   |
| `hide`                   | `(id: string) => void`             | Dismiss one message (reason `api`).    |
| `hideAll`                | `() => void`                       | Dismiss every message (reason `api`).  |

## SnNotifyOptions

| Name          | Type                                    | Default      | Required | Description                                       |
| ------------- | --------------------------------------- | ------------ | -------- | ------------------------------------------------- |
| `title`       | string                                  | —            | yes      | Bold headline line.                               |
| `description` | string                                  | ''           | no       | Secondary line; `\n` renders as a line break.     |
| `type`        | 'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' | 'default' | no | Semantic color: glyph + title + close pill. |
| `icon`        | IconData \| null                        | per `type`   | no       | Custom glyph; `null` hides the icon.              |
| `duration`    | number                                  | container    | no       | Per-card auto-dismiss delay; `0` sticky.          |
| `closable`    | boolean                                 | container    | no       | Render the close pill.                            |
| `closeText`   | string                                  | container    | no       | Close pill label.                                 |
| `background`  | string                                  | ''           | no       | Card background override (any CSS color).         |
| `color`       | string                                  | ''           | no       | Title color override (any CSS color).             |
| `radius`      | number \| string                        | ''           | no       | Card corner radius (bare number = rpx).           |
| `customClass` | string                                  | ''           | no       | Custom class for this card.                       |
| `customStyle` | string                                  | ''           | no       | Custom inline style for this card.                |

## Events

| Event   | Payload              | Description                                              |
| ------- | -------------------- | -------------------------------------------------------- |
| `open`  | `SnNotifyOpenPayload` | Fired when a message is queued (id / title / description / type). |
| `close` | `SnNotifyClosePayload` | Fired when dismissal starts; `reason`: `auto` / `close` / `swipe` / `api` / `overflow`. |
| `click` | `SnNotifyOpenPayload` | The front card body was tapped.                          |

## Slots

| Slot   | Props                    | Description                                    |
| ------ | ------------------------ | ---------------------------------------------- |
| `card` | `{ id, title, description, type }` | Fully replaces one card's inner content. |

## Not implemented (documented divergences)

- `v-model:visible` / `message` / `variant` (wd-notify parity surface) — the
  queue model replaced them (breaking change, changeset recorded).
- Function API (`useNotify()`) — uni-app has no reliable programmatic mount
  point on every target; use the ref API on the component.

## Layout engine

Card heights are measured via `uni.createSelectorQuery` and the deck is laid
out with per-card `translateY` chains; without a measurement host the
component degrades to a plain column list. The root carries the explicit
`sn-notify--deck` / `sn-notify--flow` mode class.

## Safe area (top anchor)

`safeAreaInsetTop` defaults to true: the container reserves the status bar
plus the nav band so cards never slide under the clock or the WeChat capsule.
The numbers come from the shared `utils/capsule.ts` metrics (AUI-MP-002) on
WeChat MP, from `getSystemInfoSync().statusBarHeight` + the default 44px nav
row on App, and stay 0 on H5. The uni-h5 runtime also styles
`uni-view { overflow: hidden }` by default, so the container and stack carry
an explicit `overflow: visible` — the deck cards hang outside the ~0-height
container and must not be clipped.

## Tokens Consumed (end: mp)

| Token                               | CSS Variable                        | Purpose                          |
| ----------------------------------- | ----------------------------------- | -------------------------------- |
| Background elevated                 | `--sn-mp-color-background-elevated` | Card surface                     |
| Background soft                     | `--sn-mp-color-background-soft`     | `default` close pill fill        |
| Shadow LG                           | `--sn-mp-shadow-lg`                 | Card elevation                   |
| Action primary (+ soft)             | `--sn-mp-color-action-primary`      | `primary` title / glyph / pill   |
| Feedback success / warning / danger | `--sn-mp-color-feedback-*`          | Semantic title / glyph / pill    |
| Text primary / secondary            | `--sn-mp-color-text-*`              | Title / description / pill label |
| Font size MD / LG                   | `--sn-mp-font-size-*`               | Description / title sizes        |
| Spacing 2 / 3 / 4 / 5               | `--sn-mp-spacing-*`                 | Padding, gaps, stack sliver      |
| Radius XL                           | `--sn-mp-radius-xl`                 | Close pill corners               |

## Accessibility

- Card: `role="alert"` + `aria-live="assertive"`.
- Close pill: `role="button"` + `aria-label="close"`.
- Status glyph: `aria-hidden="true"` (semantics carried by the message).

## Dispose

Every queued message owns an auto-dismiss timer and a leave timer; both are
cleared on dismiss / hide / unmount (AGENTS.md §41).

## Versioning

`@snui/uni@0.5.x` — HeroUI-style stacked-card redesign (breaking API change).
