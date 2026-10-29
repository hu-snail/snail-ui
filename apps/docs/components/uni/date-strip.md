# DateStrip 日期条（uni 端 / 移动端）

`sn-date-strip` 是 `@snui/uni` 的横向日期条（**AUI 追加组件**，wot-ui / naive-ui 均无同型组件）：`swiper` 分页的日期条，每页 `count` 天，每列 = 星期字（顶）+ 日号（中）+ 自定义文案（底，如价格 / 农历），**点整列即选中**（高亮盖住星期 + 日号整列）。翻页三种方式：手势横滑（swiper）、两侧导航按钮（`show-nav`，内容可插槽自定义）、`prev()` / `next()` / `jumpTo()` 方法。支持单选与区间选择，值为本地零点毫秒时间戳。easycom 自动注册（`components/sn-date-strip/sn-date-strip.vue` → `<sn-date-strip>`）。

## 基础用法

单选，点整列即写 `v-model`；初始页自动定位到已选值所在页。

<Demo name="date-strip-mp-basic" description="sn-date-strip 基础用法：单选，点整列即写 v-model。" />

## 导航按钮

`show-nav` 在两侧渲染翻页按钮，`#prev` / `#next` 插槽可整块替换按钮内容；翻页（手势或按钮）结束触发 `pagechange`。示例同时开启 `show-lunar` 农历角标。

<Demo name="date-strip-mp-nav" description="show-nav 两侧翻页 + #prev / #next 自定义插槽 + pagechange + show-lunar。" />

## 农历显示

`show-lunar` 在日号下方铺农历角标（初二、十五…），初一显示月名（正月 / 闰六月）；`formatter` 可覆盖。

<Demo name="date-strip-mp-lunar" description="show-lunar：日号下方农历角标，初一显示月名。" />

## 自定义日期文案

`formatter` 改写 `text` / `topInfo` / `bottomInfo` / `disabled`——价格日历场景在日号下方注入 `¥60` 文案。

<Demo name="date-strip-mp-formatter" description="formatter 在日号下方注入价格文案（bottomInfo）。" />

## 自定义日期范围

`type="range"`：首点定起点、再点定终点，越界自动交换；进行中区间值为 `[start]`，对已完成区间再点任意格子重新起头。

<Demo name="date-strip-mp-range" description="type=range：首点定起点、再点定终点，越界自动交换。" />

## 自定义样式

`customClass` / `customStyle` 换条底色与圆角。

<Demo name="date-strip-mp-custom-style" description="custom-class / custom-style 换条底色与圆角。" />

## Props

| 属性          | 类型                                           | 默认值      | 说明                                                                        |
| ------------- | ---------------------------------------------- | ----------- | --------------------------------------------------------------------------- |
| `modelValue`  | `number \| number[] \| null`                   | `null`      | 时间戳；`range` 模式为 `[start, end]`（进行中允许 `[start]`）               |
| `type`        | `'single' \| 'range'`                          | `'single'`  | 选择模式                                                                    |
| `count`       | `number`                                       | `7`         | 每页天数（swiper 每页一屏）                                                 |
| `startDate`   | `number`                                       | 今天        | 首页起点（本地零点时间戳）                                                  |
| `minDate`     | `number`                                       | `undefined` | 早于该日的格子禁用，并夹住可翻页左边界                                      |
| `maxDate`     | `number`                                       | `undefined` | 晚于该日的格子禁用，并夹住可翻页右边界                                      |
| `showWeek`    | `boolean`                                      | `true`      | 每列顶部的星期字                                                           |
| `showLunar`   | `boolean`                                      | `false`     | 农历角标——**AUI 追加**（初一显示月名；`formatter` 可覆盖）                  |
| `showNav`     | `boolean`                                      | `false`     | 显示两侧翻页按钮（内容可用 `#prev` / `#next` 插槽自定义）                   |
| `formatter`   | `(item: DateStripDayItem) => DateStripDayItem` | `undefined` | 格子钩子：改写 `text` / `topInfo` / `bottomInfo` / `disabled`               |
| `disabled`    | `boolean`                                      | `false`     | 整条禁用                                                                    |
| `customClass` / `customStyle` | `string`                       | `''`        | 根节点类名 / 内联样式                                                       |

`DateStripDayItem`：`date`（本地零点时间戳）/ `day` / `week`（0 = 周日）/ `text` / `topInfo` / `bottomInfo` / `disabled`。

## Slots

| 插槽   | 说明                                             |
| ------ | ------------------------------------------------ |
| `prev` | 左侧翻页按钮内容（默认 `‹`），整块替换           |
| `next` | 右侧翻页按钮内容（默认 `›`），整块替换           |

## Events

| 事件名              | 说明                       | 参数                                        |
| ------------------- | -------------------------- | ------------------------------------------- |
| `update:modelValue` | 点选合法格子时写回         | `(value: number \| number[])`               |
| `change`            | 同上                       | `{ value }`                                 |
| `pagechange`        | 翻页结束（手势或按钮）     | `{ start, end, index }`（该页首尾时间戳与页序号） |

## Methods（ref）

| 方法               | 说明                            |
| ------------------ | ------------------------------- |
| `prev()` / `next()`| 翻上一页 / 下一页（带动画）     |
| `jumpTo(date)`     | 跳到包含 `date` 的页            |

## 主题变量

| 变量                                | 用途       |
| ----------------------------------- | ---------- |
| `--sn-mp-color-background-elevated` | 条底色     |
| `--sn-mp-color-action-primary`      | 整列选中底色 |
| `--sn-mp-color-action-primary-soft` | 区间中段   |
| `--sn-mp-color-text-primary` / `-secondary` / `-tertiary` / `-on-primary` | 文案 |
| `--sn-mp-font-size-xs` / `-md` / `-lg` | 字号    |
| `--sn-mp-radius-md`                 | 选中列圆角 |

## 无障碍

- 每格 `role="button"`，`aria-label` 为「N 日」，带 `aria-selected` / `aria-disabled`；禁用格 `tabindex=-1`。
- 翻页按钮 `role="button"` + `aria-label="previous page" / "next page"`；根节点 `role="group"`。

## 暗色模式

全部颜色走 `--sn-mp-*` token，`.sn-theme-dark` / `page.sn-theme-dark` 下自动翻转。

## Out of scope

- 月历网格（用 `sn-calendar-view`）与弹层日历（用 `sn-calendar`）；节假日 / 节气标注由业务侧 `formatter` 注入。

完整契约见组件 `ai-description.md`。
