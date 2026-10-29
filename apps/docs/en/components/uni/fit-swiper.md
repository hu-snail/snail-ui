# FitSwiper Adaptive Carousel (uni / mobile)

`sn-fit-swiper` is the adaptive-height carousel of `@snui/uni` (mobile / mini-program / H5 / App): every page renders arbitrary slot content, the container height follows the **active** page's content, and the height transitions smoothly while swiping — the Taobao "King Kong" grid experience where pages with different row counts re-flow on switch. Auto-registered via easycom (`components/sn-fit-swiper/sn-fit-swiper.vue` → `<sn-fit-swiper>`).

## When to use

- Home King Kong grids: one icon grid per page with different row counts (2 rows / 1 row…).
- Carousels whose page heights cannot be predicted: card digests, leaderboards, mixed image-text rails.
- A content pager that bundles swipe navigation, height animation and an indicator.

For fixed-height image carousels use `sn-swiper`.

## Basic usage

Page data flows in through `list` (one object per row); the page content is fully owned by the default scoped slot: `{ page, index, active }`. After mount the component measures every page's content height and applies the active page's height to the container; `v-model:current` two-way binds the index. `height` is only the placeholder until the first measurement lands (bare number = rpx), then the real height replaces it.

<Demo name="fit-swiper-mp-basic" description="Two King Kong grid pages with different row counts; the container height adapts on swipe." />

## Indicator

Pass `indicator: false` to hide it; pass an object to pick the built-in style via `type` (`dots` / `dots-bar` with the elongating active item / `fraction`), and `minShowNum` to hide below a page count. `indicator-position` supports 8 anchors.

Colors are overridable through CSS variables: `--sn-fit-swiper-dot-color` (inactive dot / fraction pill), `--sn-fit-swiper-dot-active-color` (active dot), or directly via `customIndicatorClass` / `customIndicatorStyle`.

<Demo name="fit-swiper-mp-indicator" description="dots / dots-bar / fraction built-in indicator styles." />

## Custom indicator

The `#indicator` scoped slot (`{ current, total }`) fully replaces the built-in rendering with anything you like; the component still owns the positioning.

<Demo name="fit-swiper-mp-custom" description="A custom indicator rendered through the #indicator slot." />

## Height fitting details

- Page content must keep its intrinsic height (no `height: 100%` chains) — the component measures the natural content box.
- The height switches on `change`; one re-measure runs on `animationfinish` to catch images that loaded while their page was off screen.
- Replacing `list` re-measures automatically; in-place mutation of a page object does not — call `refit()` through a template ref.
- `animateHeight: false` disables the height transition; `heightDuration` tunes its length.
- Without a measurement host (SSR / exotic runtimes) the placeholder height stays and nothing throws.
- `heightchange` fires whenever the applied container height actually changes (px) — useful for scroll compensation.

## API

### Props

| Name                   | Type                                                                                                | Default  | Description                                                                  |
| ---------------------- | --------------------------------------------------------------------------------------------------- | -------- | ---------------------------------------------------------------------------- |
| `list`                 | `SnFitSwiperPage[]`                                                                                  | `[]`     | Page data rows, handed to the default slot verbatim.                          |
| `current`              | `number`                                                                                             | `0`      | Active page index (`v-model:current`), clamped into range.                    |
| `autoplay`             | `boolean`                                                                                            | `true`   | Autoplay.                                                                     |
| `interval`             | `number`                                                                                             | `5000`   | Autoplay interval (ms).                                                       |
| `duration`             | `number`                                                                                             | `300`    | Slide transition duration (ms).                                               |
| `loop`                 | `boolean`                                                                                            | `true`   | Loop the pages.                                                               |
| `height`               | `string \| number`                                                                                   | `320`    | Placeholder height before the first measurement (bare number = rpx).          |
| `radius`               | `string \| number`                                                                                   | `''`     | Container radius (bare number = rpx).                                         |
| `animateHeight`        | `boolean`                                                                                            | `true`   | Animate the container height on page change.                                  |
| `heightDuration`       | `number`                                                                                             | `300`    | Height transition duration (ms).                                              |
| `indicator`            | `boolean \| { type?: 'dots' \| 'dots-bar' \| 'fraction'; minShowNum?: number }`                      | `true`   | Indicator config; `false` hides it.                                           |
| `indicatorPosition`    | `'left' \| 'top-left' \| 'top' \| 'top-right' \| 'bottom-left' \| 'bottom' \| 'bottom-right' \| 'right'` | `'bottom'` | Indicator anchor.                                                        |
| `customClass`          | `string`                                                                                             | `''`     | Root class.                                                                   |
| `customStyle`          | `string`                                                                                             | `''`     | Root inline style.                                                            |
| `customPageClass`      | `string`                                                                                             | `''`     | Class for every page item.                                                    |
| `customIndicatorClass` | `string`                                                                                             | `''`     | Indicator class.                                                              |
| `customIndicatorStyle` | `string`                                                                                             | `''`     | Indicator inline style.                                                       |

### Events

| Name              | Payload                                     | Description                                       |
| ----------------- | ------------------------------------------- | ------------------------------------------------- |
| `update:current`  | `number`                                    | Active index changed (`v-model:current`).         |
| `change`          | `{ current: number; source: string }`       | Native swipe change.                              |
| `animationfinish` | `{ current: number; source: string }`       | Swipe animation finished; a re-measure follows.   |
| `click`           | `{ index: number; page: SnFitSwiperPage }`  | Page content tapped.                              |
| `heightchange`    | `{ height: number }`                        | Applied container height changed (px).            |

### Slots

| Name        | Scope                                                       | Description                                     |
| ----------- | ----------------------------------------------------------- | ----------------------------------------------- |
| `default`   | `{ page: SnFitSwiperPage; index: number; active: boolean }` | Page content with row data, index and active flag. |
| `indicator` | `{ current: number; total: number }`                        | Custom indicator, replaces the built-in one.    |

### Methods

| Name    | Type                  | Description                                                      |
| ------- | --------------------- | ---------------------------------------------------------------- |
| `refit` | `() => Promise<void>` | Re-measure all pages and re-apply the active height.             |
