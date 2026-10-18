# 日历 Calendar

按月展示与选择日期的面板组件，支持自定义日期单元格内容与禁用指定日期。

## 何时使用

- 需要按月浏览日期并点选某一天时。
- 需要在日期格下方展示日程、待办等自定义内容时。
- 需要限制部分日期不可点击时。

## 代码演示

### 基础用法

点选日期并通过 `v-model:value` 双向绑定；通过默认插槽自定义单元格内容；`is-date-disabled` 拦截今天之前的日期。

<Demo name="calendar-web-basic" description="v-model:value + 自定义单元格 + 禁用日期。" />

## API

### SnCalendar Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| value | `number \| null` | `undefined` | 选中日期（毫秒时间戳），支持 `v-model:value` |
| default-value | `number \| null` | `null` | 非受控默认选中日期，同时决定初始面板月份 |
| is-date-disabled | `(ts: number) => boolean \| undefined` | `undefined` | 返回 true 时该日期禁用，入参为当日零点时间戳 |

### SnCalendar Events

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| update:value | `(value: number, time: { year, month, date })` | 选中日期变化；`month` 从 1 开始 |
| panel-change | `(info: { year, month })` | 面板年月切换（上一月 / 下一月 / 今天按钮、点击跨月单元格）；`month` 从 1 开始 |

### SnCalendar Slots

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| default | `{ year, month, date }` | 自定义日期单元格内容，渲染在日期数字下方 |
| header | `{ year, month }` | 自定义头部标题 |

### 行为说明

- 网格周一开头，第一行在日期数字右侧内联展示「周一 … 周日」。
- 头部提供 [上月 / 今天 / 下月] 按钮组；点击跨月单元格会切换面板并触发 `panel-change`。
- 选中日期底部显示 3px 主色条；今天以主色圆形标注；非当月与禁用日期置灰，禁用日期光标为 not-allowed。
- 网格按整周补齐到 28 / 35 / 42 格（随月份起始星期与天数变化）。

完整契约见组件 `ai-description.md`。
