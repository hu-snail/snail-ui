# Calendar 日历（uni 端 / 移动端）

`sn-calendar` 是 `@snui/uni` 的日历弹层：`sn-popup` 提供遮罩与动画，可选快捷 chip 与确认底栏，本体是 `sn-calendar-view`。easycom 自动注册（`components/sn-calendar/sn-calendar.vue` → `<sn-calendar>`），几何值使用 `rpx`。本体持有草稿值，点确认才写 `v-model`；取消会丢弃草稿。

## 基础用法

sn-calendar 弹层日历：滚动只改草稿，确认才写 v-model；取消会丢弃草稿。

<Demo name="calendar-mp-basic" description="sn-calendar 弹层日历：滚动只改草稿，确认才写 v-model；取消会丢弃草稿。" />

## 快捷选项与区间（`shortcuts` / `type` / `beforeConfirm`）

shortcuts 渲染预设 chip（days 相对今天）；type="daterange" 选区间；beforeConfirm 可拦确认。

<Demo name="calendar-mp-shortcuts-range" description="shortcuts 渲染预设 chip（days 相对今天）；type=daterange 选区间；beforeConfirm 可拦确认。" />
## 网格与区间约束（`firstDayOfWeek` / `formatter` / `maxRange` / `rangePrompt` / `allowSameDay` / `defaultTime`）

`firstDayOfWeek` 改一周起始日；`formatter` 返回 `{ text, topInfo, bottomInfo, disabled }` 的子集改写单元格；`maxRange` 限制区间跨度（`0` 不限制），超出时展示 `rangePrompt`；`allowSameDay` 允许起止同一天；`defaultTime` 给日期值补默认时分秒。

<Demo name="calendar-mp-grid-range" description="firstDayOfWeek；formatter 自定义 topInfo / bottomInfo / disabled；maxRange + rangePrompt；allowSameDay；defaultTime。" />

## 面板与弹层（`panelHeight` / `switchMode` / `immediateChange` / `showConfirm` / 遮罩层级）

`panelHeight`（px 设计值）与 `showPanelTitle` 控制面板；`switchMode` 出「月 / 年」切换控件；`duration` 调弹层动画时长；`immediateChange` 点格子即写 `v-model`；`showConfirm=false` 只留取消。`closeOnClickModal` / `safeAreaInsetBottom` / `zIndex` / `rootPortal` / `customClass` / `customStyle` 全部转发给 `sn-popup`，`customViewClass` 挂到 `sn-calendar-view` 本体。

<Demo name="calendar-mp-panel-sheet" description="panelHeight / showPanelTitle / switchMode / duration；immediateChange；showConfirm=false；closeOnClickModal；safeAreaInsetBottom；zIndex；rootPortal；customClass / customStyle / customViewClass。" />

## 快捷回调与对齐参数（`onShortcutsClick` / `timeFilter` / `hideSecond` / `innerDisplayFormat` / `ellipsis` / `showTypeSwitch`）

`onShortcutsClick` 在快捷 chip 写值后被调用。`timeFilter` / `hideSecond` / `innerDisplayFormat` / `ellipsis` / `showTypeSwitch` 为与 wd-calendar 对齐而声明，本构建没有时间滚筒与区间 tab，因此**声明但无视觉效果**。

<Demo name="calendar-mp-hooks-parity" description="onShortcutsClick 快捷 chip 回调；beforeConfirm；innerDisplayFormat / ellipsis / showTypeSwitch / hideSecond / timeFilter 对齐参数（未实现）。" />

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `number \| number[] \| null` | `null` | 选中的值 |
| `visible` | `boolean` | `false` | 弹层显隐 |
| `type` | `CalendarType` | `'date'` | 选择模式 |
| `minDate` / `maxDate` | `number` | `undefined` | 日期范围 |
| `firstDayOfWeek` | `number` | `0` | 周起始日 |
| `formatter` | `CalendarFormatter` | `undefined` | 单元格格式化钩子 |
| `maxRange` / `rangePrompt` | `number` / `string` | `0` / `''` | 区间跨度限制与提示 |
| `allowSameDay` | `boolean` | `false` | 允许区间起止同一天 |
| `defaultTime` | `string \| string[]` | `'00:00:00'` | 日期默认时分秒 |
| `title` | `string` | `'选择日期'` | 弹层标题 |
| `closeOnClickModal` | `boolean` | `true` | 点击遮罩关闭 |
| `zIndex` | `number` | `15` | 弹层层级 |
| `showConfirm` / `confirmText` | `boolean` / `string` | `true` / `'确定'` | 确认按钮与文案 |
| `shortcuts` | `Array<{ text, value?, days? }>` | `[]` | 快捷选项 chip |
| `safeAreaInsetBottom` | `boolean` | `true` | 底部安全区留白 |
| `beforeConfirm` | `(value) => boolean \| Promise<boolean>` | `undefined` | 确认前钩子 |
| `customViewClass` | `string` | `''` | 面板内部视图类名 |
| `immediateChange` | `boolean` | `false` | 点击即触发 change |
| `panelHeight` / `showPanelTitle` / `switchMode` | `number` / `boolean` / `'none' \| 'month' \| 'year-month'` | `316` / `true` / `'none'` | 面板透传 |
| `duration` | `number` | `200` | 弹层动画时长（ms） |
| `customClass` / `customStyle` | `string` | `''` | 根节点自定义类名 / 样式 |

> **未实现**：`week` / `weekrange` 类型、`innerDisplayFormat`、`ellipsis`、`showTypeSwitch`、`rootPortal`。`shortcuts` 与 `onShortcutsClick` 已实现（点击 chip 写入预设值后回调）。

## Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 确认时（`immediateChange` 时每次点击） | `(value: CalendarValue)` |
| `update:visible` | 弹层显隐变化时 | `(value: boolean)` |
| `confirm` | 确认并通过校验时 | `{ value }` |
| `change` | 选中变化时 | `{ value }` |
| `cancel` / `open` | 弹层生命周期 | — |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `confirm-left` | 确认区域左侧插槽 |
| `confirm-right` | 确认区域右侧插槽 |

## 主题变量

| 变量 | 用途 |
| --- | --- |
| ``--sn-mp-color-background-elevated`` | 弹层底色 |
| ``--sn-mp-color-background-soft`` | 快捷 chip 底色 |
| ``--sn-mp-color-action-primary`` | 确认按钮 |
| ``--sn-mp-color-text-on-primary`` | 确认按钮文字 |
| ``--sn-mp-color-text-primary` / `-secondary`` | 标题 / chip 文案 |
| ``--sn-mp-color-border-subtle`` | 头尾分割线 |
| ``--sn-mp-radius-md` / `-full`` | 圆角 |

## 无障碍

- 取消 / 确认为 `role="button"`，带 `aria-label`。
- 快捷 chip 为 `role="button"`，带 `aria-label`。
- `confirm-left` / `confirm-right` 插槽位于底栏，供宿主放自定义内容。

## 暗色模式

所有颜色都通过 `--sn-mp-*` token 解析，没有浅色兜底。`.sn-theme-dark` / `page.sn-theme-dark` 下文字、底板、边框与状态色自动翻转。验证方式：

