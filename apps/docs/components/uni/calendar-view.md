# CalendarView 日历视图（uni 端 / 移动端）

`sn-calendar-view` 是 `@snui/uni` 的日历面板本体：在 `minDate` / `maxDate` 之间按月铺出网格，支持单选 / 区间 / 多选、单元格 formatter 与月份切换。easycom 自动注册（`components/sn-calendar-view/sn-calendar-view.vue` → `<sn-calendar-view>`），几何值使用 `rpx`。网格由 `<view>` 的 7 列 flex 布局 + `<scroll-view>` 滚动组成；没有 `ResizeObserver`、没有定时器、没有全局监听。

## 基础用法

sn-calendar-view 平铺月网格：minDate / maxDate 决定月份范围，tap 某天写回时间戳。

<Demo name="calendar-view-mp-basic" description="sn-calendar-view 平铺月网格：minDate / maxDate 决定月份范围，tap 某天写回时间戳。" />

## 区间与月份切换（`type` / `maxRange` / `switchMode`）

type="daterange" 选区间；maxRange 限制跨度并显示提示；switchMode="month" 改为单月 + 上下月按钮。

<Demo name="calendar-view-mp-range-switch" description="type=daterange 选区间；maxRange 限制跨度并显示提示；switchMode=month 改为单月 + 上下月按钮。" />

## 周起始、单元格格式与面板标题（`firstDayOfWeek` / `formatter` / `showPanelTitle`）

`first-day-of-week=1` 把周一挪到第一列；`formatter` 拿到单元格数据后可改写 text / topInfo / bottomInfo / disabled；`show-panel-title=false` 收起月份标题。

<Demo name="calendar-view-mp-formatter-week" description="firstDayOfWeek=1 周一起始；formatter 在周末格底部加「休」；showPanelTitle=false 收起月份标题。" />

## 同日区间、默认时分与自定义样式（`allowSameDay` / `defaultTime` / `immediateChange`）

`allow-same-day` 允许区间起止同一天；`default-time` 决定单选写回时间戳的时分秒；`immediate-change` 点中即触发；`custom-class` / `custom-style` 落在根节点。`timeFilter` / `timeItemHeight` / `timeVisibleItemCount` / `hideSecond` 仅做声明对齐（面板内无时间滚筒）。

<Demo name="calendar-view-mp-same-day-time" description="allowSameDay 允许区间起止同一天；defaultTime 决定写回时间戳的时分秒；immediateChange 点中即触发；customClass / customStyle 落在根节点。" />

## Props

| 属性                          | 类型                                                                                           | 默认值       | 说明                                                 |
| ----------------------------- | ---------------------------------------------------------------------------------------------- | ------------ | ---------------------------------------------------- |
| `modelValue`                  | `number \| number[] \| null`                                                                   | `null`       | 选中的时间戳                                         |
| `type`                        | `'date' \| 'dates' \| 'datetime' \| 'month' \| 'daterange' \| 'datetimerange' \| 'monthrange'` | `'date'`     | 选择模式                                             |
| `minDate` / `maxDate`         | `number`                                                                                       | `undefined`  | 最小 / 最大日期（默认前后 6 个月）                   |
| `firstDayOfWeek`              | `number`                                                                                       | `0`          | 周起始日（0 为周日）                                 |
| `formatter`                   | `CalendarFormatter`                                                                            | `undefined`  | 单元格格式化钩子                                     |
| `maxRange`                    | `number`                                                                                       | `0`          | 区间最大跨度（天，0 不限制）                         |
| `rangePrompt`                 | `string`                                                                                       | `''`         | 超出跨度的提示文案                                   |
| `allowSameDay`                | `boolean`                                                                                      | `false`      | 允许区间起止同一天                                   |
| `showPanelTitle`              | `boolean`                                                                                      | `true`       | 是否显示月份标题                                     |
| `defaultTime`                 | `string \| string[]`                                                                           | `'00:00:00'` | 日期默认时分秒                                       |
| `panelHeight`                 | `number`                                                                                       | `316`        | 可滚动面板高度（px 设计值）                          |
| `immediateChange`             | `boolean`                                                                                      | `false`      | 点击即触发 change                                    |
| `switchMode`                  | `'none' \| 'month' \| 'year-month'`                                                            | `'none'`     | 切换模式                                             |
| `showLunar`                   | `boolean`                                                                                      | `false`      | 农历角标——**AUI 追加**：格下农历日名，初一显示月名；`formatter` 可覆盖 |
| `customClass` / `customStyle` | `string`                                                                                       | `''`         | 根节点自定义类名 / 样式                              |
| `timeFilter`                  | `CalendarTimeFilter`                                                                           | `undefined`  | 时间列过滤钩子——**声明但未实现**（面板内无时间滚筒） |
| `timeItemHeight`              | `number`                                                                                       | `44`         | 时间行高——**声明但未实现**（同上）                   |
| `timeVisibleItemCount`        | `number`                                                                                       | `6`          | 时间可见行数——**声明但未实现**（同上）               |
| `hideSecond`                  | `boolean`                                                                                      | `false`      | 隐藏秒列——**声明但未实现**（同上）                   |

> **未实现**：`week` / `weekrange` 类型（各端没有可靠的 ISO 周辅助函数），以及 `timeFilter` / `timeItemHeight` / `timeVisibleItemCount` / `hideSecond`——本轮不实现面板内的时间滚筒；`datetime` / `datetimerange` 类型存在，并按 `defaultTime` 取时分秒。

## Events

| 事件名                  | 说明                       | 参数                     |
| ----------------------- | -------------------------- | ------------------------ |
| `update:modelValue`     | 选中变化时                 | `(value: CalendarValue)` |
| `change`                | 选中变化时（同 tick）      | `{ value }`              |
| `pickstart` / `pickend` | 预留给（未实现的）时间滚筒 | —                        |

## Exposed API

| 成员          | 签名                      | 说明                            |
| ------------- | ------------------------- | ------------------------------- |
| `shiftMonth`  | `(delta: number) => void` | 切换激活月份                    |
| `shiftYear`   | `(delta: number) => void` | 切换激活年份（year-month 模式） |
| `jumpToToday` | `() => void`              | 跳到今天所在月份                |

## Slots

本组件不提供插槽。

## 主题变量

| 变量                                                                      | 用途                          |
| ------------------------------------------------------------------------- | ----------------------------- |
| `--sn-mp-color-background-elevated`                                       | 面板底色                      |
| ``--sn-mp-color-action-primary` / `-soft``                                | 选中日 / 区间中间日           |
| `--sn-mp-color-text-on-primary`                                           | 选中日文字                    |
| ``--sn-mp-color-text-primary` / `-secondary` / `-tertiary` / `-disabled`` | 日期 / 标题 / 星期 / 禁用文字 |
| ``--sn-mp-color-border-default` / `-subtle``                              | 今天描边 / 控制条分割线       |
| `--sn-mp-color-feedback-warning`                                          | 区间提示                      |
| `--sn-mp-radius-md`                                                       | 日期格 / 控制按钮圆角         |

## 无障碍

- 根节点 `role="group"`；星期表头 `aria-hidden`。
- 每个当月日期为 `role="button"`，带 `aria-label` / `aria-selected` / `aria-disabled`；不可选时 `tabindex="-1"`。
- 月份控制按钮为 `role="button"`，带 `aria-label`（previous / next / next year）。

## 暗色模式

所有颜色都通过 `--sn-mp-*` token 解析，没有浅色兜底。`.sn-theme-dark` 下文字、底板、边框与状态色自动翻转。验证方式：
