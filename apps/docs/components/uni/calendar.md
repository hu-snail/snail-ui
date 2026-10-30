# Calendar 日历（uni 端 / 移动端）

`sn-calendar` 是 `@snui/uni` 的日历弹层：`sn-popup` 提供遮罩与动画，可选快捷 chip 与确认底栏，本体是 `sn-calendar-view`。easycom 自动注册（`components/sn-calendar/sn-calendar.vue` → `<sn-calendar>`），几何值使用 `rpx`。本体持有草稿值，点确认才写 `v-model`；取消会丢弃草稿。

## 何时使用

- 需要在限定范围内挑一个日期、一段区间或若干日期，而页面空间不足以常驻展示日历时。
- 页面上已有「日期」入口行（如 `sn-cell`），点开后进入选择时。
- 需要预置快捷区间（今天 / 近一周 / 近一月）减少点选次数时。
- 需要农历角标辅助选择（初一显示月名）时。
- 反之：日期面板需要常驻展示用 `sn-calendar-view`；只选时间用 `sn-datetime-picker`。

## 代码演示

### 基础用法

弹层日历：滚动只改草稿，确认才写 `v-model`；取消会丢弃草稿。入口行用 `sn-cell` 的 card 形态，右侧显示已确认值。

<Demo name="calendar-mp-basic" description="弹层日历：滚动只改草稿，确认才写 v-model；取消会丢弃草稿。" />

### 卡片入口（cells card 形态）

`sn-cell` 的 `card` 开启后每行渲染为独立圆角卡片（圆角 / 描边 / 阴影走 token），行间距由外层 flex gap 统一。三张卡片分别打开 `date` / `daterange` / `dates` 三种模式，末行回显三种模式的已确认值。

<Demo name="calendar-mp-card" description="cell 卡片形态的入口行：date / daterange / dates 三种模式各占一张独立卡片。" />

### 网格与区间约束（`firstDayOfWeek` / `formatter` / `maxRange` / `rangePrompt` / `allowSameDay` / `defaultTime`）

`firstDayOfWeek` 改一周起始日；`formatter` 返回 `{ text, topInfo, bottomInfo, disabled }` 的子集改写单元格；`maxRange` 限制区间跨度（`0` 不限制），超出时展示 `rangePrompt`；`allowSameDay` 允许起止同一天；`defaultTime` 给日期值补默认时分秒。三种约束各占一张 cell 卡片，卡片右侧显示当前配置对应的已选值。

<Demo name="calendar-mp-grid-range" description="firstDayOfWeek；formatter 自定义 topInfo / bottomInfo / disabled；maxRange + rangePrompt；allowSameDay；defaultTime。" />

### 弹层头部插槽（`header`，AUI 追加）

`header` 插槽替换弹层顶部的默认标题行，宿主可在弹层内放 cell 摘要行等分节内容；未传插槽时仍渲染 `title` 文本，行为不变。示例配合 `immediate-change` 让弹层内摘要随点选实时更新。

<Demo name="calendar-mp-header" description="header 插槽替换默认标题行；未传插槽时仍显示 title；配合 immediateChange 摘要实时更新。" />

### 快捷回调与声明参数（`onShortcutsClick` / `beforeConfirm`）

`onShortcutsClick` 在快捷 chip 写值后被调用，`beforeConfirm` 可在确认前拦截。`timeFilter` / `hideSecond` / `innerDisplayFormat` / `ellipsis` / `showTypeSwitch` 为保持配置面稳定而声明，本构建没有时间滚筒与区间 tab，因此**声明但无视觉效果**。

<Demo name="calendar-mp-hooks-parity" description="onShortcutsClick 快捷 chip 回调；beforeConfirm；innerDisplayFormat / ellipsis / showTypeSwitch / hideSecond / timeFilter 声明参数（未实现）。" />

### 农历角标（`showLunar`，AUI 追加）

`show-lunar` 在每个日格下方显示农历日名（初二、十五…），初一显示月名（正月 / 闰六月）；`formatter` 的 `bottomInfo` 优先级更高，可覆盖农历文案。弹层之外的入口行回显公历 + 农历对照。

<Demo name="calendar-mp-lunar" description="show-lunar：格下农历角标，初一显示月名；formatter 可覆盖。" />

### 面板与弹层（`panelHeight` / `switchMode` / `immediateChange` / `showConfirm` / 遮罩层级）

`panelHeight`（px 设计值）与 `showPanelTitle` 控制面板；`switchMode` 出「月 / 年」切换控件；`duration` 调弹层动画时长；`immediateChange` 点格子即写 `v-model`；`showConfirm=false` 只留取消，此时底栏左侧的 `confirm-left` 插槽可承载「清空」等宿主动作。`closeOnClickModal` / `safeAreaInsetBottom` / `zIndex` / `rootPortal` / `customClass` / `customStyle` 全部转发给 `sn-popup`，`customViewClass` 挂到 `sn-calendar-view` 本体。

<Demo name="calendar-mp-panel-sheet" description="panelHeight / showPanelTitle / switchMode / duration；immediateChange；showConfirm=false + confirm-left 插槽；closeOnClickModal；safeAreaInsetBottom；zIndex；rootPortal；customClass / customStyle / customViewClass。" />

### 快捷选项与区间（`shortcuts` / `type`）

`shortcuts` 渲染预设 chip（`days` 相对今天，`value` 直接给时间戳）；`type="daterange"` 选区间，`confirm-text` 自定义确认文案；卡片右侧显示已确认区间，第二张卡片回显最近点击的快捷项。

<Demo name="calendar-mp-shortcuts-range" description="shortcuts 渲染预设 chip（days 相对今天）；type=daterange 选区间；on-shortcuts-click 回显最近点击项。" />

## API

### Props

| 属性                                            | 类型                                                       | 默认值                    | 说明                                                       |
| ----------------------------------------------- | ---------------------------------------------------------- | ------------------------- | ---------------------------------------------------------- |
| `modelValue`                                    | `number \| number[] \| null`                               | `null`                    | 选中的值                                                   |
| `visible`                                       | `boolean`                                                  | `false`                   | 弹层显隐                                                   |
| `type`                                          | `CalendarType`                                             | `'date'`                  | 选择模式                                                   |
| `minDate` / `maxDate`                           | `number`                                                   | `undefined`               | 日期范围                                                   |
| `firstDayOfWeek`                                | `number`                                                   | `0`                       | 周起始日                                                   |
| `formatter`                                     | `CalendarFormatter`                                        | `undefined`               | 单元格格式化钩子                                           |
| `maxRange` / `rangePrompt`                      | `number` / `string`                                        | `0` / `''`                | 区间跨度限制与提示                                         |
| `allowSameDay`                                  | `boolean`                                                  | `false`                   | 允许区间起止同一天                                         |
| `defaultTime`                                   | `string \| string[]`                                       | `'00:00:00'`              | 日期默认时分秒                                             |
| `title`                                         | `string`                                                   | `'选择日期'`              | 弹层标题（`header` 插槽未使用时渲染）                      |
| `closeOnClickModal`                             | `boolean`                                                  | `true`                    | 点击遮罩关闭                                               |
| `zIndex`                                        | `number`                                                   | `15`                      | 弹层层级                                                   |
| `showConfirm` / `confirmText`                   | `boolean` / `string`                                       | `true` / `'确定'`         | 确认按钮与文案                                             |
| `shortcuts`                                     | `Array<{ text, value?, days? }>`                           | `[]`                      | 快捷选项 chip                                              |
| `safeAreaInsetBottom`                           | `boolean`                                                  | `true`                    | 底部安全区留白                                             |
| `beforeConfirm`                                 | `(value) => boolean \| Promise<boolean>`                   | `undefined`               | 确认前钩子                                                 |
| `customViewClass`                               | `string`                                                   | `''`                      | 面板内部视图类名                                           |
| `immediateChange`                               | `boolean`                                                  | `false`                   | 点击即写回 `v-model`                                       |
| `panelHeight` / `showPanelTitle` / `switchMode` | `number` / `boolean` / `'none' \| 'month' \| 'year-month'` | `316` / `true` / `'none'` | 面板透传                                                   |
| `showLunar`                                     | `boolean`                                                  | `false`                   | 农历角标——**AUI 追加**（初一显示月名；`formatter` 可覆盖） |
| `duration`                                      | `number`                                                   | `200`                     | 弹层动画时长（ms）                                         |
| `customClass` / `customStyle`                   | `string`                                                   | `''`                      | 根节点自定义类名 / 样式                                    |

> **未实现**：`week` / `weekrange` 类型、`innerDisplayFormat`、`ellipsis`、`showTypeSwitch`、`rootPortal`。`shortcuts` 与 `onShortcutsClick` 已实现（点击 chip 写入预设值后回调）。

### Events

| 事件名              | 说明                                   | 参数                     |
| ------------------- | -------------------------------------- | ------------------------ |
| `update:modelValue` | 确认时（`immediateChange` 时每次点击） | `(value: CalendarValue)` |
| `update:visible`    | 弹层显隐变化时                         | `(value: boolean)`       |
| `confirm`           | 确认并通过校验时                       | `{ value }`              |
| `change`            | 选中变化时                             | `{ value }`              |
| `cancel` / `open`   | 弹层生命周期                           | —                        |

### Slots

| 插槽名          | 说明                                                               |
| --------------- | ------------------------------------------------------------------ |
| `header`        | 替换弹层顶部默认标题行（可放 cell 摘要行等分节内容）——**AUI 追加** |
| `confirm-left`  | 取消 / 确认按钮左侧内容                                            |
| `confirm-right` | 取消 / 确认按钮右侧内容                                            |

## 主题变量

| 变量                                            | 用途                     |
| ----------------------------------------------- | ------------------------ |
| `--sn-mp-color-background-elevated`             | 弹层底色                 |
| `--sn-mp-color-text-primary`                    | 标题与日期正文           |
| `--sn-mp-color-background-soft`                 | 快捷 chip 底色           |
| `--sn-mp-color-text-secondary`                  | 快捷 chip / 取消按钮文案 |
| `--sn-mp-color-action-primary`                  | 确认按钮底色             |
| `--sn-mp-color-text-on-primary`                 | 确认按钮文字             |
| `--sn-mp-color-border-subtle`                   | 标题行与底栏分割线       |
| `--sn-mp-font-size-md` / `--sn-mp-font-size-sm` | 标题 / chip 与按钮字号   |
| `--sn-mp-font-weight-semibold`                  | 标题与确认按钮字重       |
| `--sn-mp-spacing-1` / `-2` / `-3` / `-4`        | chip、按钮与页边距       |
| `--sn-mp-radius-md` / `--sn-mp-radius-full`     | 按钮 / chip 圆角         |

## AI Patch Boundary

- AI 可通过 Patch 修改展示与选择配置：`title` / `confirmText` / `type` / `minDate` / `maxDate` / `firstDayOfWeek` / `formatter` / `maxRange` / `rangePrompt` / `allowSameDay` / `defaultTime` / `shortcuts` / `panelHeight` / `showPanelTitle` / `switchMode` / `duration` / `showConfirm` / `showLunar` / `zIndex` / `closeOnClickModal` / `safeAreaInsetBottom` / `immediateChange`。
- `modelValue` 是运行时选择结果：Patch 可以设置初始值，但弹层打开后不应覆盖用户已点选的草稿；`immediateChange` 开启时每次点选都会写回，Patch 应把它当成运行时状态而不是静态配置。
- `visible` 属于宿主交互状态：Patch 可以改初始显隐，不应强制在用户操作过程中反复翻转。
- `beforeConfirm` / `onShortcutsClick` 是宿主回调：Patch 只应调整是否声明，不应伪造校验结果或跳过业务逻辑。
- `header` / `confirm-left` / `confirm-right` 插槽内容属于业务数据：Patch 只调整容器配置，不改写插槽内部结构。
- `customClass` / `customStyle` / `customViewClass` 允许 Patch 做皮肤与布局微调，但不得借其注入影响其他组件的作用域样式。

## 无障碍

- 取消 / 确认为 `role="button"`，带 `aria-label`。
- 快捷 chip 为 `role="button"`，带 `aria-label`。
- 使用 `header` 插槽时，插槽内容承担弹层可读标题职责，请在其中保留文本；未使用时由 `title` 文本承担。
- `confirm-left` / `confirm-right` 插槽位于底栏，供宿主放自定义内容，宿主需自行标注 `role` / `aria-label`。

## 暗色模式

所有颜色都通过 `--sn-mp-*` token 解析，没有浅色 `var()` 兜底，因此在 `.sn-theme-dark` 下自动适配：弹层底色切到暗色表面，标题行与底栏分割线使用暗色边框令牌，标题与日期正文转为暗色主文本，快捷 chip 与取消按钮转为暗色次级文本，确认按钮保持品牌色。

用 `sn-config-provider` 的 `theme="dark"` 包裹即可验证：

```vue
<sn-config-provider theme="dark">
  <sn-calendar v-model="date" v-model:visible="open" title="选择日期" />
</sn-config-provider>
```

## 相关

- 日历面板：[`sn-calendar-view`](/components/uni/calendar-view)
- 日期入口行：[`sn-cell`](/components/uni/cell)
- 弹层容器：[`sn-popup`](/components/uni/popup)
- 主题切换：[`sn-config-provider`](/components/uni/config-provider)
