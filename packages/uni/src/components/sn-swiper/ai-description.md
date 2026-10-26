# sn-swiper — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-swiper component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Carousel built on the native `<swiper>` element: autoplay, looping, multiple visible slides, dots / bar / fraction indicators and optional captions.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors wot-ui `wd-swiper`
(https://wot-ui.cn/component/swiper.html). New props added here MUST also be
added to the wd-swiper parity list.

## Not implemented (documented divergences)

- **Video items** — `<video>` cannot be driven reliably from a cross-end
  carousel. An item with `type: 'video'` renders its `poster` as an image. The
  video props (`autoplay-video` / `muted` / `video-loop` /
  `stop-previous-video` / `stop-autoplay-when-video-play`) **are declared** so a
  wd-swiper config type-checks unchanged and are forwarded to the native
  `<swiper>`, but they have no visible effect while video items degrade to
  their poster.
- `adjust-height` (`'first' | 'current' | 'highest' | ''`) and
  `adjust-vertical-height` are Alipay-only upstream; they are declared and
  forwarded to the native `<swiper>` (other vendors ignore the attributes).
- `custom-prev-image-class` / `custom-next-image-class` / `custom-prev-class` /
  `custom-next-class` are declared for parity; this build renders no prev / next
  peek slides, so nothing consumes them yet.
- `easing-function` is forwarded to the native swiper, which only honours its own
  fixed ease set.

## Autoplay

The native `<swiper>` element owns the autoplay interval and the touch handling,
so this component creates no timer and registers no listener.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-swiper :list="images" height="320" />
```

```ts
import { SnSwiper } from '@snui/uni'
```

## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `autoplay` | boolean | true | no | Autoplay. |
| `current` | number | 0 | no | Current slide index (`v-model:current`). |
| `direction` | 'horizontal' | 'vertical' | 'horizontal' | no | Scroll axis. |
| `displayMultipleItems` | number | 1 | no | Slides visible at once. |
| `duration` | number | 300 | no | Slide transition duration in ms. |
| `easingFunction` | string | 'default' | no | Easing name (forwarded to the native swiper). |
| `height` | string | number | 192 | no | Carousel height (bare number = rpx). |
| `interval` | number | 5000 | no | Autoplay interval in ms. |
| `list` | (string | SnSwiperItem)[] | [] | no | Slide data. |
| `loop` | boolean | true | no | Loop the slides. |
| `nextMargin` | string | number | 0 | no | Next-slide inset (bare number = rpx). |
| `indicatorPosition` | SwiperIndicatorPosition | 'bottom' | no | Indicator anchor. |
| `previousMargin` | string | number | 0 | no | Previous-slide inset (bare number = rpx). |
| `radius` | string | number | '' | no | Corner radius (bare number = rpx). |
| `snapToEdge` | boolean | false | no | Snap the insets to the first / last slide. |
| `indicator` | boolean | SnSwiperIndicator | true | no | Indicator config; `false` hides it. |
| `imageMode` | SwiperImageMode | 'aspectFill' | no | Crop mode forwarded to sn-img. |
| `showMenuByLongpress` | boolean | false | no | Long-press QR menu (WeChat only). |
| `valueKey` | string | 'value' | no | Image URL field name on an item object. |
| `textKey` | string | 'text' | no | Caption field name on an item object. |
| `customIndicatorClass` | string | '' | no | Custom class for the indicator node. |
| `customImageClass` | string | '' | no | Custom class for the image node. |
| `customItemClass` | string | '' | no | Custom class for each slide. |
| `customTextClass` | string | '' | no | Custom class for the caption node. |
| `customTextStyle` | string | '' | no | Custom inline style for the caption node. |
| `customClass` | string | '' | no | Custom class for the root node. |
| `customStyle` | string | '' | no | Custom inline style for the root node. |

`SnSwiperItem` = `{ value?, poster?, text?, type?: 'image' | 'video' }`.
`SnSwiperIndicator` = `{ type?: 'dots' | 'dots-bar' | 'fraction'; minShowNum?; showControls? }`.

## Events

| Event | Payload | Description |
|---|---|---|
| `click` | { index, item } | Slide tapped. |
| `change` | { current, source } | Slide switched. |
| `animationfinish` | { current, source } | Slide animation finished. |
| `update:current` | number | Current index sync (`v-model:current`). |

## Slots

None.

## Tokens Consumed (end: mp)

| Token | CSS Variable | Purpose |
|---|---|---|
| Background subtle | `--sn-mp-color-background-subtle` | Slide plate |
| Background elevated | `--sn-mp-color-background-elevated` | Inactive dot |
| Background overlay | `--sn-mp-color-background-overlay` | Caption + fraction plate |
| Action primary | `--sn-mp-color-action-primary` | Active dot |
| Text on primary | `--sn-mp-color-text-on-primary` | Caption + fraction text |
| Font size XS / MD / LG | `--sn-mp-font-size-xs …` | Fraction / caption / arrows |
| Line height normal | `--sn-mp-font-line-height-normal` | Text line height |
| Spacing 1–4 | `--sn-mp-spacing-1 …` | Indicator padding + caption padding |
| Radius XS / full / LG | `--sn-mp-radius-xs …` | Dots / arrows / container |

## Accessibility

- The indicator node is `aria-hidden="true"` — the slides carry the content.
- Native `<swiper>` handles the swipe gesture on every uni target.

## Dispose

Nothing: autoplay and touch handling belong to the native `<swiper>`.

## Versioning

`@snui/uni@0.5.0` — initial release.
