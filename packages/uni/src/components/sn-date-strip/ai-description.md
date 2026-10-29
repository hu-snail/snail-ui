# sn-date-strip — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-date-strip component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.
>
> Internal reference metadata (AGENTS.md §112.2a / §112.3a — never surfaces in
> the user-facing docs): **AUI 追加组件**。wot-ui / naive-ui 均无同型组件，
> 无 1:1 参考面；API 风格（值模型 / formatter / token / rpx 几何）对齐库内
> `sn-calendar-view`。

## Purpose

横向日期条（swiper 分页）：每页 `count` 天，每列 = 星期字（顶）+ 日号（中）+
自定义文案（底，如价格 / 农历），点整列即选中（高亮盖住整列）。翻页三种方式：
手势横滑（swiper，仅渲染 prev/current/next 三页并回中）、两侧导航按钮
（`show-nav`，`#prev` / `#next` 插槽自定义）、`prev()` / `next()` / `jumpTo()`
方法。适用于酒店 / 门票 / 排期类业务的近几日快速选择。支持单选与区间选择，
值统一为本地零点毫秒时间戳。

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-date-strip v-model="date" :start-date="start" :count="7" />
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnDateStrip } from '@snui/uni/components/sn-date-strip/sn-date-strip.vue';
```

## Props

| Name          | Type                                                   | Default       | Description                                                            |
| ------------- | ------------------------------------------------------ | ------------- | ---------------------------------------------------------------------- |
| `modelValue`  | `number \| number[] \| null`                           | `null`        | 时间戳；`range` 模式为 `[start, end]`（进行中允许 `[start]`）。        |
| `type`        | `'single' \| 'range'`                                  | `'single'`    | 选择模式。`range` 首点定起点、再点定终点，越界自动交换。               |
| `count`       | `number`                                               | `7`           | 每页天数（swiper 每页一屏）。                                          |
| `startDate`   | `number`                                               | 今天          | 条起点（本地零点时间戳）。                                             |
| `minDate`     | `number`                                               | `undefined`   | 早于该日的格子禁用，并夹住可翻页左边界。                               |
| `maxDate`     | `number`                                               | `undefined`   | 晚于该日的格子禁用，并夹住可翻页右边界。                               |
| `showWeek`    | `boolean`                                              | `true`        | 每列顶部的星期字。                                                     |
| `showLunar`   | `boolean`                                              | `false`       | 农历角标：日号下方农历日名，初一显示月名；`formatter` 可覆盖。        |
| `showNav`     | `boolean`                                              | `false`       | 两侧翻页按钮（`#prev` / `#next` 插槽自定义内容）。                    |
| `formatter`   | `(item: DateStripDayItem) => DateStripDayItem`         | `undefined`   | 格子钩子：改写 `text` / `topInfo` / `bottomInfo` / `disabled`。        |
| `disabled`    | `boolean`                                              | `false`       | 整条禁用。                                                             |
| `customClass` | `string`                                               | `''`          | 根节点类名。                                                           |
| `customStyle` | `string`                                               | `''`          | 根节点内联样式。                                                       |

### DateStripDayItem

| 字段         | 类型      | 说明                       |
| ------------ | --------- | -------------------------- |
| `date`       | `number`  | 本地零点时间戳。           |
| `day`        | `number`  | 日号（1-based）。          |
| `week`       | `number`  | 星期（0 = 周日）。         |
| `text`       | `string`  | 日号文案（默认日号数字）。 |
| `topInfo`    | `string`  | 日号上方文案。             |
| `bottomInfo` | `string`  | 日号下方文案（如 `¥60`）。 |
| `disabled`   | `boolean` | 禁用。                     |

## Events

| 事件名              | 说明                     | 参数                        |
| ------------------- | ------------------------ | --------------------------- |
| `update:modelValue` | 点选合法格子时写回       | `(value: number \| number[])` |
| `change`            | 同上（带 payload 形状）  | `{ value }`                 |
| `pagechange`        | 翻页结束（手势或按钮）   | `{ start, end, index }`     |

区间语义与 `sn-calendar-view` 一致：`[start]` 表示进行中（仅起点），点新日期
收尾；对已完成区间再点任意格子重新起头；点起点本身不写值。

## Slots

| 插槽   | 说明                                             |
| ------ | ------------------------------------------------ |
| `prev` | 左侧翻页按钮内容（默认 `‹`），整块替换           |
| `next` | 右侧翻页按钮内容（默认 `›`），整块替换           |

## Methods（ref）

| 方法                | 说明                        |
| ------------------- | --------------------------- |
| `prev()` / `next()` | 翻上一页 / 下一页（带动画） |
| `jumpTo(date)`      | 跳到包含 `date` 的页        |

## Tokens（CSS 变量）

| 变量                                  | 用途                     |
| ------------------------------------- | ------------------------ |
| `--sn-mp-color-background-elevated`   | 条底色                   |
| `--sn-mp-color-action-primary`        | 选中块底色               |
| `--sn-mp-color-action-primary-soft`   | 区间中段底色             |
| `--sn-mp-color-text-primary` / `-tertiary` / `-on-primary` | 文案 |
| `--sn-mp-color-feedback-error`        | 周末字色                 |
| `--sn-mp-font-size-xs` / `-md`        | 星期 / 日号字号          |
| `--sn-mp-radius-md` / `-xs`           | 选中块圆角（doodle 皮肤）|

## Accessibility

- 每格 `role="button"`，`aria-label` 为「N 日」，带 `aria-selected` /
  `aria-disabled`；禁用格 `tabindex=-1`。
- 根节点 `role="group"`。

## Dark mode

全部颜色走 `--sn-mp-*` token，`.sn-theme-dark` / `page.sn-theme-dark` 下自动翻转。

## Out of scope

- 月历网格（用 `sn-calendar-view`）与弹层日历（用 `sn-calendar`）。
- 节假日 / 节气标注（业务侧用 `formatter` 自行注入）。
