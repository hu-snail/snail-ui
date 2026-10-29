# DateStrip 日期条（uni 端 / 移动端）

`sn-date-strip` 是 `@snui/uni` 的横向日期条（**AUI 追加组件**，wot-ui / naive-ui 均无同型组件）：一行滚动日期列，每列 = 星期字（顶）+ 日号（中）+ 自定义文案（底，如价格）。支持单选与区间选择，值为本地零点毫秒时间戳。easycom 自动注册（`components/sn-date-strip/sn-date-strip.vue` → `<sn-date-strip>`）。

## 基础用法

单选，点选即写 `v-model`。

<Demo name="date-strip-mp-basic" description="sn-date-strip 基础用法：单选，点选即写 v-model。" />

## 自定义样式

`customClass` / `customStyle` 换条底色与圆角。

<Demo name="date-strip-mp-custom-style" description="custom-class / custom-style 换条底色与圆角。" />

## 自定义日期文案

`formatter` 改写 `text` / `topInfo` / `bottomInfo` / `disabled`——价格日历场景在日号下方注入 `¥60` 文案。

<Demo name="date-strip-mp-formatter" description="formatter 在日号下方注入价格文案（bottomInfo）。" />

## 自定义日期范围

`type="range"`：首点定起点、再点定终点，越界自动交换；进行中区间值为 `[start]`，对已完成区间再点任意格子重新起头。

<Demo name="date-strip-mp-range" description="type=range：首点定起点、再点定终点，越界自动交换。" />

## Props

| 属性          | 类型                                           | 默认值      | 说明                                                                 |
| ------------- | ---------------------------------------------- | ----------- | -------------------------------------------------------------------- |
| `modelValue`  | `number \| number[] \| null`                   | `null`      | 时间戳；`range` 模式为 `[start, end]`（进行中允许 `[start]`）        |
| `type`        | `'single' \| 'range'`                          | `'single'`  | 选择模式                                                             |
| `count`       | `number`                                       | `7`         | 条内天数；超出屏宽横向滚动                                           |
| `startDate`   | `number`                                       | 今天        | 条起点（本地零点时间戳）                                             |
| `minDate`     | `number`                                       | `undefined` | 早于该日的格子禁用                                                   |
| `maxDate`     | `number`                                       | `undefined` | 晚于该日的格子禁用                                                   |
| `showWeek`    | `boolean`                                      | `true`      | 顶部星期行（跟随各列日期）                                           |
| `formatter`   | `(item: DateStripDayItem) => DateStripDayItem` | `undefined` | 格子钩子：改写 `text` / `topInfo` / `bottomInfo` / `disabled`        |
| `disabled`    | `boolean`                                      | `false`     | 整条禁用                                                             |
| `customClass` / `customStyle` | `string`                       | `''`        | 根节点类名 / 内联样式                                                |

`DateStripDayItem`：`date`（本地零点时间戳）/ `day` / `week`（0 = 周日）/ `text` / `topInfo` / `bottomInfo` / `disabled`。

## Events

| 事件名              | 说明               | 参数                          |
| ------------------- | ------------------ | ----------------------------- |
| `update:modelValue` | 点选合法格子时写回 | `(value: number \| number[])` |
| `change`            | 同上               | `{ value }`                   |

## 主题变量

| 变量                                | 用途       |
| ----------------------------------- | ---------- |
| `--sn-mp-color-background-elevated` | 条底色     |
| `--sn-mp-color-action-primary`      | 选中块底色 |
| `--sn-mp-color-action-primary-soft` | 区间中段   |
| `--sn-mp-color-feedback-error`      | 周末字色   |
| `--sn-mp-font-size-xs` / `-md`      | 字号       |
| `--sn-mp-radius-md`                 | 选中块圆角 |

## 无障碍

- 每格 `role="button"`，`aria-label` 为「N 日」，带 `aria-selected` / `aria-disabled`；禁用格 `tabindex=-1`。
- 根节点 `role="group"`。

## 暗色模式

全部颜色走 `--sn-mp-*` token，`.sn-theme-dark` / `page.sn-theme-dark` 下自动翻转。

## Out of scope

- 月历网格（用 `sn-calendar-view`）与弹层日历（用 `sn-calendar`）；多月翻页、农历角标可作后续 additive 增强；节假日 / 节气标注由业务侧 `formatter` 注入。

完整契约见组件 `ai-description.md`。
