# DateStrip · uni-app

`sn-date-strip` is the horizontal date strip of `@snui/uni` (**AUI-added component**; neither wot-ui nor naive-ui ships an equivalent): a `swiper`-paged date strip with `count` days per page; each column = weekday (top) + day number (middle) + custom caption (bottom, e.g. a price or lunar label), and **the whole column is the tap / highlight target**. Three ways to change the page: horizontal swipe (swiper), the side nav buttons (`show-nav`, content replaceable via slots), and the `prev()` / `next()` / `jumpTo()` methods. Single and range selection; values are local-midnight millisecond timestamps. easycom auto-registration (`components/sn-date-strip/sn-date-strip.vue` → `<sn-date-strip>`).

## Basic usage

Single selection; tapping a column writes `v-model`. The initial page follows the bound value.

<Demo name="date-strip-mp-basic" description="sn-date-strip basics: single selection, tap a whole column to write v-model." />

## Navigation buttons

`show-nav` renders the side paging buttons; the `#prev` / `#next` slots replace their content. Page settles (swipe or button) emit `pagechange`. The demo also enables the `show-lunar` captions.

<Demo name="date-strip-mp-nav" description="show-nav side buttons + #prev / #next slots + pagechange + show-lunar." />

## Lunar captions

`show-lunar` renders a lunar day name under the day number (初二, 十五…); 初一 shows the month name (正月 / 闰六月). `formatter` may override.

<Demo name="date-strip-mp-lunar" description="show-lunar: lunar caption under the day number, month name on 初一." />

## Custom day text

The `formatter` hook rewrites `text` / `topInfo` / `bottomInfo` / `disabled` — the price-calendar case injects `¥60` under the day number.

<Demo name="date-strip-mp-formatter" description="formatter injects price captions (bottomInfo) under the day numbers." />

## Custom date range

`type="range"`: first tap sets the start, second tap completes it; out-of-order taps swap. A pending range is `[start]`; tapping any cell on a completed range restarts it.

<Demo name="date-strip-mp-range" description="type=range: first tap sets the start, second tap completes; out-of-order taps swap." />

## Custom style

`customClass` / `customStyle` restyle the strip background and radius.

<Demo name="date-strip-mp-custom-style" description="custom-class / custom-style restyle the strip." />

## Props

| Prop          | Type                                           | Default     | Description                                                              |
| ------------- | ---------------------------------------------- | ----------- | ------------------------------------------------------------------------ |
| `modelValue`  | `number \| number[] \| null`                   | `null`      | Timestamp; `range` mode is `[start, end]` (pending: `[start]`)           |
| `type`        | `'single' \| 'range'`                          | `'single'`  | Selection mode                                                           |
| `count`       | `number`                                       | `7`         | Days per page (one swiper page)                                          |
| `startDate`   | `number`                                       | today       | First page anchor (local midnight)                                       |
| `minDate`     | `number`                                       | `undefined` | Disable days before; clamps the left paging bound                        |
| `maxDate`     | `number`                                       | `undefined` | Disable days after; clamps the right paging bound                        |
| `showWeek`    | `boolean`                                      | `true`      | Weekday caption on top of each column                                    |
| `showLunar`   | `boolean`                                      | `false`     | Lunar captions — **AUI-added** (month name on 初一; formatter can override) |
| `showNav`     | `boolean`                                      | `false`     | Side paging buttons (content replaceable via `#prev` / `#next` slots)    |
| `formatter`   | `(item: DateStripDayItem) => DateStripDayItem` | `undefined` | Cell hook: rewrite `text` / `topInfo` / `bottomInfo` / `disabled`        |
| `disabled`    | `boolean`                                      | `false`     | Disable the whole strip                                                  |
| `customClass` / `customStyle` | `string`                       | `''`        | Root class / inline style                                                |

`DateStripDayItem`: `date` (local midnight) / `day` / `week` (0 = Sunday) / `text` / `topInfo` / `bottomInfo` / `disabled`.

## Slots

| Slot   | Description                                                |
| ------ | ---------------------------------------------------------- |
| `prev` | Left paging-button content (default `‹`), fully replaceable |
| `next` | Right paging-button content (default `›`), fully replaceable |

## Events

| Event               | Description                    | Payload                                            |
| ------------------- | ------------------------------ | -------------------------------------------------- |
| `update:modelValue` | Written on a legal tap         | `(value: number \| number[])`                      |
| `change`            | Same                           | `{ value }`                                        |
| `pagechange`        | Page settled (swipe or button) | `{ start, end, index }` (page range and page index) |

## Methods (ref)

| Method              | Description                                  |
| ------------------- | -------------------------------------------- |
| `prev()` / `next()` | Page backward / forward (animated)           |
| `jumpTo(date)`      | Jump to the page containing `date`           |

## Theming

| Variable                            | Usage                    |
| ----------------------------------- | ------------------------ |
| `--sn-mp-color-background-elevated` | Strip background         |
| `--sn-mp-color-action-primary`      | Selected column          |
| `--sn-mp-color-action-primary-soft` | Range middle             |
| `--sn-mp-color-text-primary` / `-secondary` / `-tertiary` / `-on-primary` | Text |
| `--sn-mp-font-size-xs` / `-md` / `-lg` | Font sizes            |
| `--sn-mp-radius-md`                 | Selected column radius   |

## Accessibility

- Each cell is `role="button"` with `aria-label` "N 日", plus `aria-selected` / `aria-disabled`; disabled cells get `tabindex=-1`.
- Paging buttons are `role="button"` with `aria-label="previous page" / "next page"`; root is `role="group"`.

## Dark mode

All colors resolve through `--sn-mp-*` tokens and flip under `.sn-theme-dark` / `page.sn-theme-dark`.

## Out of scope

- Month grid (use `sn-calendar-view`) and sheet calendar (use `sn-calendar`); holidays / solar terms are injected by the host via `formatter`.

See the component `ai-description.md` for the full contract.
