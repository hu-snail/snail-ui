# DatetimePickerView 日期时间选择器视图（uni 端 / 移动端）

`sn-datetime-picker-view` 是 `@snui/uni` 的日期时间滚筒本体：按 `type` 与 min / max 边界推导年 / 月 / 日 / 时 / 分 / 秒列，并写回时间戳（`type="time"` 时写回 `HH:mm[:ss]` 字符串）。easycom 自动注册（`components/sn-datetime-picker-view/sn-datetime-picker-view.vue` → `<sn-datetime-picker-view>`），几何值使用 `rpx`。列推导是纯函数（`sn-datetime-picker-view-utils`），所以滚筒本身只是渲染器。

## 基础用法

sn-datetime-picker-view 滚筒本体：type 决定列集合，minDate / maxDate 限制可选范围。

<Demo name="datetime-picker-view-mp-basic" description="sn-datetime-picker-view 滚筒本体：type 决定列集合，minDate / maxDate 限制可选范围。" />

## 时间类型与格式化（`type="time"` / `formatter` / `filter`）

type="time" 只出时分列并写回 "HH:mm" 字符串；formatter 改文案，filter 过滤列取值。

<Demo name="datetime-picker-view-mp-time-format" description="type=time 只出时分列并写回 HH:mm 字符串；formatter 改文案，filter 过滤列取值。" />
## 滚筒几何与列改写（`itemHeight` / `visibleItemCount` / `valueKey` / `labelKey` / `columnFormatter`）

`itemHeight`（px 设计值）与 `visibleItemCount` 决定行高与可见行数；`valueKey` / `labelKey` 为与 wot-ui 对齐的占位参数（列由组件生成）；`columnFormatter` 拿到整列候选值并可整体改写顺序。

<Demo name="datetime-picker-view-mp-columns" description="itemHeight / visibleItemCount；valueKey / labelKey；columnFormatter 倒序年份列。" />

## 时间列边界与秒列（`minMinute` / `maxMinute` / `useSecond` / `minSecond` / `maxSecond`）

`minMinute` / `maxMinute` 限制分钟列取值；`useSecond` 打开秒列，`minSecond` / `maxSecond` 再限定秒的区间。

<Demo name="datetime-picker-view-mp-time-bounds" description="minMinute / maxMinute；useSecond + minSecond / maxSecond。" />

## 区间联动与写回时机（`boundaryMinDate` / `boundaryMaxDate` / `immediateChange` / `custom*`）

`immediateChange` 让拖动过程中就 emit `change`（松手时总会 emit）。`boundaryMinDate` / `boundaryMaxDate` 为与 wd-datetime-picker-view 对齐的「区间联动」参数，本构建的滚筒不做联动夹取，**声明但未参与渲染**。`customClass` / `customStyle` 挂根节点。

<Demo name="datetime-picker-view-mp-range-boundary" description="boundaryMinDate / boundaryMaxDate（声明但未参与渲染）；immediateChange；customClass / customStyle。" />

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string \| number` | `undefined` | 时间戳；`time` 类型为 `HH:mm[:ss]` |
| `type` | `'datetime' \| 'date' \| 'year-month' \| 'time' \| 'year'` | `'datetime'` | 列集合 |
| `itemHeight` / `visibleItemCount` | `number` | `44` / `6` | 行高 / 可见行数 |
| `valueKey` / `labelKey` | `string` | `'value'` / `'label'` | 字段名（仅对齐 wot-ui，列由组件生成） |
| `formatter` | `(type, value) => string` | `undefined` | 自定义文案格式化 |
| `filter` | `(type, values) => number[]` | `undefined` | 过滤列取值 |
| `columnFormatter` | `(type, values) => number[]` | `undefined` | 整列改写 |
| `minDate` / `maxDate` | `number` | `undefined` | 最小 / 最大日期（默认前后 10 年） |
| `minHour` / `maxHour` / `minMinute` / `maxMinute` | `number` | `0` / `23` / `0` / `59` | `time` 类型边界 |
| `useSecond` / `minSecond` / `maxSecond` | `boolean` / `number` / `number` | `false` / `0` / `59` | 秒列 |
| `immediateChange` | `boolean` | `false` | 拖动过程中立即触发 change |
| `boundaryMinDate` / `boundaryMaxDate` | `number` | `undefined` | 区间模式联动边界 |
| `customClass` / `customStyle` | `string` | `''` | 根节点自定义类名 / 样式 |

## Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 选中变化时 | `(value: string \| number)` |
| `change` | 选中变化时（同 tick） | `{ value, columns }` |
| `pickstart` / `pickend` | 拖动生命周期 | — |

## Exposed API

| 成员 | 签名 | 说明 |
| --- | --- | --- |
| `getSelectedOptions` | `() => Array<{ value, label }>` | 每列一项 |
| `correctValue` | `(value) => string \| number` | 把值规范成声明类型 |
| `getOriginColumns` | `() => RollerColumn[]` | 推导出的列 |

## Slots

本组件不提供插槽。

## 主题变量

| 变量 | 用途 |
| --- | --- |
| ``--sn-mp-color-background-elevated`` | 滚轮底色 |
| ``--sn-mp-color-text-primary` / `-secondary`` | 选中 / 普通行文字 |
| ``--sn-mp-color-border-subtle`` | 选中指示线 |
| ``--sn-mp-font-size-md`` | 行文字字号 |
| ``--sn-mp-font-weight-semibold`` | 选中行字重 |
| ``--sn-mp-spacing-2` / `-3`` | 指示线内缩 / 面板内边距 |

## 无障碍

- 根节点 `role="group"`，`aria-label` 携带格式化后的当前值。
- 每行为 `role="button"`，带 `aria-selected`。
- 另有一个视觉隐藏的 `aria-live="polite"` 文本同步当前值。

## 桌面端 H5 交互

H5 端在触摸之外支持桌面输入：按住鼠标左键上下拖动列即可滚动选择；鼠标滚轮每滚一格前进一行（两端按 `minDate` / `maxDate` 与时分秒边界收边）。滚轮手势由滚轮接管，页面不会跟着滚动；点击某一行也可直接选中。小程序端保持触摸手势。

## 暗色模式

所有颜色都通过 `--sn-mp-*` token 解析，没有浅色兜底。`.sn-theme-dark` / `page.sn-theme-dark` 下文字、底板、边框与状态色自动翻转。验证方式：

