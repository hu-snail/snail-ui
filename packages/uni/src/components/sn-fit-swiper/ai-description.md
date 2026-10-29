# sn-fit-swiper — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-fit-swiper component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Adaptive-height carousel for content pages of different heights — the
Taobao "King Kong" grid pattern (金刚区). Each page renders arbitrary slot
content with its own intrinsic height; the container height follows the
ACTIVE page and animates between pages while swiping. Typical use:
home-page icon grids where page 1 has two rows and page 2 has one, dashboards
of cards with unequal sections, tabbed content rails.

Reference note (internal, per AGENTS.md §112): shared carousel props mirror
wot-ui `wd-swiper` semantics; the fit-height engine and indicator styles are
AUI-additive (registered in AGENTS.md §112.3a) — no reference counterpart
exists.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-fit-swiper :list="pages" v-model:current="current">
  <template #default="{ page }">
    <my-kong-grid :items="page.items" />
  </template>
</sn-fit-swiper>
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnFitSwiper } from '@snui/uni';
```

## Props

| Name                   | Type                                                                                        | Default  | Required | Description                                                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| `list`                 | `SnFitSwiperPage[]` (`Record<string, unknown>`)                                             | `[]`     | no       | Page data rows; each row is handed to the default slot verbatim.                                             |
| `current`              | `number`                                                                                    | `0`      | no       | Current page index (`v-model:current`). Out-of-range values are clamped.                                     |
| `autoplay`             | `boolean`                                                                                   | `true`   | no       | Autoplay (driven by the native swiper).                                                                      |
| `interval`             | `number`                                                                                    | `5000`   | no       | Autoplay interval in ms.                                                                                     |
| `duration`             | `number`                                                                                    | `300`    | no       | Slide transition duration in ms.                                                                             |
| `loop`                 | `boolean`                                                                                   | `true`   | no       | Loop the pages.                                                                                              |
| `height`               | `string \| number`                                                                          | `320`    | no       | Placeholder height before the first measurement lands (bare number = rpx). The measured px height takes over. |
| `radius`               | `string \| number`                                                                          | `''`     | no       | Corner radius (bare number = rpx).                                                                           |
| `animateHeight`        | `boolean`                                                                                   | `true`   | no       | Animate the container height when the page changes.                                                          |
| `heightDuration`       | `number`                                                                                    | `300`    | no       | Height transition duration in ms.                                                                            |
| `indicator`            | `boolean \| SnFitSwiperIndicator`                                                           | `true`   | no       | Indicator config; `false` hides it. `{ type, minShowNum }`.                                                  |
| `indicatorPosition`    | `'left' \| 'top-left' \| 'top' \| 'top-right' \| 'bottom-left' \| 'bottom' \| 'bottom-right' \| 'right'` | `'bottom'` | no | Indicator anchor.                                                          |
| `customClass`          | `string`                                                                                    | `''`     | no       | Class for the root node.                                                                                     |
| `customStyle`          | `string`                                                                                    | `''`     | no       | Inline style for the root node.                                                                              |
| `customPageClass`      | `string`                                                                                    | `''`     | no       | Class for each page item.                                                                                    |
| `customIndicatorClass` | `string`                                                                                    | `''`     | no       | Class for the indicator node.                                                                                |
| `customIndicatorStyle` | `string`                                                                                    | `''`     | no       | Inline style for the indicator node.                                                                         |

`SnFitSwiperIndicator`:

```ts
interface SnFitSwiperIndicator {
  type?: 'dots' | 'dots-bar' | 'fraction' | 'slider';
  minShowNum?: number; // default 2 — hide below this page count
}
```

## Events

| Name              | Payload                                     | Description                                    |
| ----------------- | ------------------------------------------- | ---------------------------------------------- |
| `update:current`  | `number`                                    | v-model:current — active page index changed.   |
| `change`          | `{ current: number; source: string }`       | Native swiper change.                          |
| `animationfinish` | `{ current: number; source: string }`       | Native swiper animation finished (re-measures). |
| `click`           | `{ index: number; page: SnFitSwiperPage }`  | A page body was tapped.                        |
| `heightchange`    | `{ height: number }`                        | The applied container height changed (px).     |

## Slots

| Name        | Scope                                          | Description                                                                       |
| ----------- | ---------------------------------------------- | --------------------------------------------------------------------------------- |
| `default`   | `{ page: SnFitSwiperPage; index: number; active: boolean }` | One page's content. Render intrinsic-height content (no `height: 100%`). |
| `indicator` | `{ current: number; total: number }`           | Fully replaces the built-in indicator rendering.                                  |

## Methods

| Name    | Signature              | Description                                                     |
| ------- | ---------------------- | --------------------------------------------------------------- |
| `refit` | `() => Promise<void>`  | Re-measure every page and re-apply the active height. Call after slot content resizes asynchronously (data arrived, images settled) without replacing `list`. |

## How the height fits

1. After mount (and on list changes / `animationfinish`), every page's
   `.sn-fit-swiper__content` box is measured once via
   `uni.createSelectorQuery().selectAll().boundingClientRect()` (px).
2. The container height switches to the ACTIVE page's measured height
   (ceil px) with a CSS height transition.
3. When no measurement is available (SSR, tests, mis-shaped host), the
   `height` placeholder stays applied — the component degrades, never throws.

## CSS variables

| Variable                            | Fallback                          | Description        |
| ----------------------------------- | --------------------------------- | ------------------ |
| `--sn-fit-swiper-dot-color`         | `--sn-mp-color-text-tertiary`     | Inactive dot / fraction pill background. |
| `--sn-fit-swiper-dot-active-color`  | `--sn-mp-color-action-primary`    | Active dot background.                   |

## Usage example

```vue
<script setup lang="ts">
import { ref } from 'vue';

const current = ref(0);
// Two pages with different row counts — the height animates on swipe.
const pages = [
  { items: [{ icon: 'star', label: '电影' }, { icon: 'heart', label: '追剧' }] },
  { items: [{ icon: 'wallet', label: '钱包' }] },
];
</script>

<template>
  <sn-fit-swiper v-model:current="current" :list="pages" :height="440" radius="16rpx">
    <template #default="{ page }">
      <view class="grid">
        <view v-for="item in page.items" :key="item.label" class="grid__item">
          <text>{{ item.label }}</text>
        </view>
      </view>
    </template>
  </sn-fit-swiper>
</template>
```

## Caveats

- Page content must have intrinsic height — do not build `height: 100%`
  chains inside a page; the content box is measured, not stretched.
- Mutating a page object in place does not trigger re-measurement (only
  `list` replacement does) — call `refit()` through a template ref instead.
- The active index mirrors the native swiper, so indicator / height / slot
  `active` stay correct even when the parent never binds `current` back.
