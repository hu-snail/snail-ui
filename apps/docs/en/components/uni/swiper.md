# Swiper · uni-app

`sn-swiper` is the carousel of `@snui/uni` (mobile / miniprogram / H5), built on the native uni `<swiper>` element: autoplay, looping, multiple visible slides, dots / bar / fraction indicators and captions. Auto-registered through easycom (`components/sn-swiper/sn-swiper.vue` → `<sn-swiper>`); geometry uses `rpx`.

> **Declared but with no rendering effect (reference-API parity)**
>
> - **Video items do not play**: `<video>` cannot be driven reliably from a cross-end carousel. An item with `type: "video"` degrades to rendering its `poster` image, so `autoplay-video` / `muted` / `video-loop` / `stop-previous-video` / `stop-autoplay-when-video-play` are declared but never change the picture.
> - `adjust-height` / `adjust-vertical-height` are Alipay-only in the reference: the values are forwarded to the native `<swiper>` and ignored by every other target.
> - `custom-prev-class` / `custom-next-class` / `custom-prev-image-class` / `custom-next-image-class` are declared, but this build renders no prev / next peek slides, so nothing consumes them yet.
> - `easing-function` is forwarded to the native swiper, which only honours its own fixed ease set.

## Basic usage

`list` accepts strings or objects (`valueKey` / `textKey` pick the field names); `height` sets the container height and `v-model:current` two-way binds the index.

<Demo name="swiper-mp-basic" description="Three autoplaying slides with captions and the current index." />

## Playback controls

`autoplay` / `interval` / `duration` / `loop` are all forwarded to the native `<swiper>`: the interval, the transition duration and the looping are driven by the platform, so the component owns no timer. `easing-function` is forwarded too, but the platform only honours its own ease set (default `default`).

<Demo name="swiper-mp-playback" description="Toggle autoplay / loop and switch interval / duration / easing." />

## Multiple slides and margins

`display-multiple-items` shows several slides at once; `previous-margin` / `next-margin` let the neighbouring slides peek in; `snap-to-edge` aligns the insets to the first and last slide as well.

<Demo name="swiper-mp-multiple" description="Two slides at once, peek margins, and snap-to-edge on the edges." />

## Vertical carousel

`direction="vertical"` switches the scroll axis; `height` accepts a string (such as `360rpx`) or a bare number (treated as rpx).

<Demo name="swiper-mp-vertical" description="Vertical scrolling; a string height plus the Alipay-only adjust-height / adjust-vertical-height." />

## Indicator position

`indicator-position` accepts `left` / `top-left` / `top` / `top-right` / `bottom-left` / `bottom` / `bottom-right` / `right`; `minShowNum` hides the whole indicator below a slide count.

<Demo name="swiper-mp-indicator-position" description="Four corner anchors, plus the minShowNum threshold hiding the indicator." />

## Indicators

Pass `false` to `indicator` to hide it; an object accepts `type` (`dots` / `dots-bar` / `fraction`), `minShowNum` and `showControls`.

<Demo name="swiper-mp-indicator" description="Dots / bar / fraction / with prev-next controls." />

## Video items

An item with `type: "video"` degrades to rendering its `poster` image on the uni end (see "Declared but with no rendering effect" above). The demo below shows both the five video props in use and what the degraded picture actually looks like.

<Demo name="swiper-mp-video" description="Video items render their poster; the five video props are declared but never change the picture." />

## Radius and custom classes

`radius` rounds the container; `customClass` / `customStyle` apply to the root node, `customItemClass` to every `swiper-item`, `customImageClass` is forwarded to `sn-img`, `customTextClass` / `customTextStyle` style the caption and `customIndicatorClass` styles the indicator node.

<Demo name="swiper-mp-custom" description="Radius plus custom classes / styles on the root, item, image, caption and indicator." />

## Data fields and events

`valueKey` / `textKey` adapt your own field names; `current` (`v-model:current`) drives the index; `imageMode` is forwarded to `sn-img`; `showMenuByLongpress` opens the miniprogram QR menu on long press (WeChat only). The demo reports the `click` / `change` / `animationfinish` events.

<Demo name="swiper-mp-data" description="Custom field names, a controlled current index, aspectFit cropping and all three events." />

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| autoplay | boolean | true | Autoplay |
| current | number | 0 | Current index (`v-model:current`) |
| direction | 'horizontal' \| 'vertical' | 'horizontal' | Scroll axis |
| displayMultipleItems | number | 1 | Slides visible at once |
| duration | number | 300 | Slide transition duration in ms |
| easingFunction | string | 'default' | Easing name (forwarded to the native swiper) |
| height | string \| number | 192 | Carousel height (bare number = rpx) |
| interval | number | 5000 | Autoplay interval in ms |
| list | (string \| SnSwiperItem)[] | [] | Slide data |
| loop | boolean | true | Loop the slides |
| nextMargin | string \| number | 0 | Next-slide inset (bare number = rpx) |
| indicatorPosition | SwiperIndicatorPosition | 'bottom' | Indicator anchor |
| previousMargin | string \| number | 0 | Previous-slide inset (bare number = rpx) |
| radius | string \| number | '' | Corner radius (bare number = rpx) |
| snapToEdge | boolean | false | Snap the insets to the first / last slide |
| indicator | boolean \| SnSwiperIndicator | true | Indicator config; `false` hides it |
| imageMode | SwiperImageMode | 'aspectFill' | Crop mode forwarded to `sn-img` |
| showMenuByLongpress | boolean | false | Long-press QR menu (WeChat only) |
| adjustHeight | 'first' \| 'current' \| 'highest' \| '' | '' | Auto-size to the slide height (Alipay miniprogram only) |
| adjustVerticalHeight | boolean | false | Force `adjustHeight` in vertical mode (Alipay miniprogram only) |
| autoplayVideo | boolean | false | Autoplay video items (declared; video items degrade to their poster) |
| muted | boolean | false | Mute video items (same, no visual effect) |
| videoLoop | boolean | false | Loop video items (same, no visual effect) |
| stopPreviousVideo | boolean | false | Stop the previous slide's video on change (same, no visual effect) |
| stopAutoplayWhenVideoPlay | boolean | false | Pause autoplay while a video plays (same, no visual effect) |
| valueKey | string | 'value' | Image URL field name on an item object |
| textKey | string | 'text' | Caption field name on an item object |
| customIndicatorClass | string | '' | Custom class for the indicator node |
| customImageClass | string | '' | Custom class for the image node |
| customItemClass | string | '' | Custom class for each slide |
| customTextClass | string | '' | Custom class for the caption node |
| customTextStyle | string | '' | Custom inline style for the caption node |
| customClass | string | '' | Custom class for the root node |
| customStyle | string | '' | Custom inline style for the root node |

`SnSwiperItem` = `{ value?, poster?, text?, type?: "image" | "video" }`; `SnSwiperIndicator` = `{ type?: "dots" | "dots-bar" | "fraction"; minShowNum?; showControls? }`.

## Events

| Event | Description | Payload |
| --- | --- | --- |
| click | Slide tapped | `{ index, item }` |
| change | Slide switched | `{ current, source }` |
| animationfinish | Slide animation finished | `{ current, source }` |
| update:current | Current index sync | number |

## Slots

None.

## Theme variables

| Variable | Purpose |
| --- | --- |
| --sn-mp-color-background-subtle | Slide plate |
| --sn-mp-color-background-elevated | Inactive dot |
| --sn-mp-color-background-overlay | Caption strip / fraction plate |
| --sn-mp-color-action-primary | Active dot |
| --sn-mp-color-text-on-primary | Caption and fraction text |
| --sn-mp-font-size-xs` / `-md` / `-lg | Fraction / caption / control size |
| --sn-mp-font-line-height-normal | Text line height |
| --sn-mp-spacing-1` … `-4 | Indicator padding and caption padding |
| --sn-mp-radius-xs` / `-full` / `-lg | Dots / controls / container corners |

## Accessibility

- The indicator node is `aria-hidden="true"`; the slides carry the content
- The swipe gesture is handled by the native `<swiper>` on every target

## Dark mode

The slide plate, dots, caption strip and text all come from semantic tokens (`--sn-mp-color-background-*` / `--sn-mp-color-action-primary` / `--sn-mp-color-text-on-primary`), all overridden in the dark block of `@snui/tokens-mp/styles`, so it adapts automatically. Verify with sn-config-provider 的 theme 设为 dark:


## Related

- Single image: [`sn-img`](/en/components/uni/img)
- Vertical scrolling container: use the native `<scroll-view>`
