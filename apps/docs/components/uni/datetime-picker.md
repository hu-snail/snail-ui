# DatetimePicker 日期时间选择器（uni 端 / 移动端）

`sn-datetime-picker` 是 `@snui/uni` 的日期时间弹层：`sn-popup` 提供遮罩 / 动画，本体负责工具栏与草稿值，内核是 `sn-datetime-picker-view`。easycom 自动注册（`components/sn-datetime-picker/sn-datetime-picker.vue` → `<sn-datetime-picker>`），几何值使用 `rpx`。默认滚动只改草稿，确认才写 `v-model`。

## 基础用法

sn-datetime-picker 弹层选择器：滚动只改草稿，确认才写 v-model。

<Demo name="datetime-picker-mp-basic" description="sn-datetime-picker 弹层选择器：滚动只改草稿，确认才写 v-model。" />

## 单元格卡片布局（`sn-cell` 的 `card`）

入口行用 `sn-cell` 承载：`sn-cell-group` 打开 `card` 后每一行各自成一张圆角卡片（组背景透明、行间距走 token），单个单元格也可以用自身的 `card` 脱离分组独立成卡。单元格只负责触发弹层，弹层几何与卡片布局互不影响。

<Demo name="datetime-picker-mp-card" description="sn-cell-group card / sn-cell card：每行入口独立成卡，行间距走 token。" />

## 弹层头部（取消左 / 标题中 / 确认右）

头部固定三段：取消贴左、标题居中（可省略）、确认贴右。标题缺失时中间槽位仍占住剩余空间，确认不会因此被推向中间。两个动作都是纯文字按钮，不渲染图标；按压反馈走 `hover-class`，触摸端与 App 端表现一致。`cancelButtonText` / `confirmButtonText` 只替换文案，不改变位置。

<Demo name="datetime-picker-mp-header" description="title 有 / 无、自定义按钮文案：确认始终贴右，两个动作均为纯文字。" />

## 农历选择（`lunar`，AUI 追加）

`lunar` 打开后年 / 月 / 日三列切换农历文案：年列干支（甲辰年、乙巳年…），月列正月至腊月（含闰X月，冬月 = 十一月、腊月 = 十二月），日列初一至三十。`v-model` 始终是公历毫秒时间戳（内建 1900–2100 历法表换算）。`type="datetime"` + `lunar` 保留时分滚筒；`type="time"` 下无效果；`minDate` / `maxDate` 农历模式下只约束年列。

<Demo name="datetime-picker-mp-lunar" description="lunar：年干支 / 月含闰月 / 日初一三十；v-model 仍是公历时间戳；datetime + lunar 保留时分。" />

## 时间类型与确认校验（`type="time"` / `beforeConfirm`）

type="time" 写回 "HH:mm" 字符串；beforeConfirm 返回 false 时弹层不关闭。

<Demo name="datetime-picker-mp-time-confirm" description="type=time 写回 HH:mm 字符串；beforeConfirm 返回 false 时弹层不关闭。" />

## 滚筒几何与列取值（`itemHeight` / `visibleItemCount` / 时分秒边界 / `formatter` / `filter`）

`itemHeight`（px 设计值）与 `visibleItemCount` 决定滚筒行高与可见行数；`minHour` / `maxHour` / `minMinute` / `maxMinute` / `minSecond` / `maxSecond` 限制各列取值，`useSecond` 打开秒列。`formatter` 改列文案，`filter` 直接过滤列候选值。`valueKey` / `labelKey` 是字段名占位参数（列由组件按 `type` 生成，没有外部数据源）。

<Demo name="datetime-picker-mp-columns-bounds" description="itemHeight / visibleItemCount；minHour / maxHour / minMinute / maxMinute；useSecond + minSecond / maxSecond；formatter / filter；valueKey / labelKey。" />

## 弹层外观与写回时机（`cancelButtonText` / `immediateChange` / `zIndex` / `rootPortal` / `custom*`）

`immediateChange` 让滚动即写 `v-model`，默认只在确认时写。`closeOnClickModal` 控制点遮罩是否关闭，`safeAreaInsetBottom` 是否留安全区，`zIndex` 调层级，`rootPortal` 是脱离文档流的占位参数（小程序没有 portal 宿主，声明但不生效）。`customClass` / `customStyle` 挂弹层，`customViewClass` 挂滚筒本体。

<Demo name="datetime-picker-mp-sheet" description="immediateChange；cancelButtonText；closeOnClickModal；safeAreaInsetBottom；zIndex；rootPortal；customClass / customStyle / customViewClass；displayFormatTabLabel。" />

## Props

| 属性                                              | 类型                                     | 默认值                  | 说明                                                                             |
| ------------------------------------------------- | ---------------------------------------- | ----------------------- | -------------------------------------------------------------------------------- |
| `modelValue`                                      | `string \| number`                       | `undefined`             | 时间戳；`time` 类型为 `HH:mm[:ss]`                                               |
| `visible`                                         | `boolean`                                | `false`                 | 弹层显隐                                                                         |
| `type`                                            | `DateTimeType`                           | `'datetime'`            | 列集合                                                                           |
| `title`                                           | `string`                                 | `''`                    | 弹层标题                                                                         |
| `cancelButtonText` / `confirmButtonText`          | `string`                                 | `'取消'` / `'确认'`     | 取消 / 确认文案                                                                  |
| `closeOnClickModal` / `safeAreaInsetBottom`       | `boolean`                                | `true`                  | 遮罩关闭 / 安全区                                                                |
| `itemHeight` / `visibleItemCount`                 | `number`                                 | `44` / `6`              | 行高 / 可见行数                                                                  |
| `valueKey` / `labelKey`                           | `string`                                 | `'value'` / `'label'`   | 字段名占位（列由组件生成，无外部数据源）                                         |
| `minDate` / `maxDate`                             | `number`                                 | `undefined`             | 日期范围                                                                         |
| `minHour` / `maxHour` / `minMinute` / `maxMinute` | `number`                                 | `0` / `23` / `0` / `59` | `time` 类型边界                                                                  |
| `useSecond` / `minSecond` / `maxSecond`           | `boolean` / `number` / `number`          | `false` / `0` / `59`    | 秒列                                                                             |
| `formatter` / `filter`                            | function                                 | `undefined`             | 列钩子                                                                           |
| `beforeConfirm`                                   | `(value) => boolean \| Promise<boolean>` | `undefined`             | 确认前钩子                                                                       |
| `zIndex`                                          | `number`                                 | `15`                    | 弹层层级                                                                         |
| `immediateChange`                                 | `boolean`                                | `false`                 | 滚动即写回 v-model                                                               |
| `lunar`                                           | `boolean`                                | `false`                 | 农历滚筒——**AUI 追加**（年干支 / 月含闰月 / 日初一三十；v-model 仍为公历时间戳） |
| `customClass` / `customStyle` / `customViewClass` | `string`                                 | `''`                    | 根节点 / 弹层 / 滚轮类名                                                         |
| `rootPortal`                                      | `boolean`                                | `false`                 | 脱离文档流渲染——**声明但未实现**（小程序无 portal 宿主，透传给 `sn-popup`）      |
| `displayFormatTabLabel`                           | `((tab) => string) \| undefined`         | `undefined`             | 区间 Tab 标签格式化——**声明但未实现**（本轮只实现单值模式）                      |

> **未实现**：`root-portal`、`display-format-tab-label`，以及区间模式的 `toggle` 事件（本轮只实现单值模式）。

## Events

| 事件名              | 说明                                   | 参数               |
| ------------------- | -------------------------------------- | ------------------ |
| `update:modelValue` | 确认时（`immediateChange` 时每次滚动） | `(value)`          |
| `update:visible`    | 弹层显隐变化时                         | `(value: boolean)` |
| `confirm`           | 确认并通过校验时                       | `{ value }`        |
| `change`            | 选中变化时                             | `{ value }`        |
| `cancel` / `open`   | 弹层生命周期                           | —                  |

## Slots

本组件不提供插槽。

## 主题变量

| 变量                                                          | 用途                        |
| ------------------------------------------------------------- | --------------------------- |
| `--sn-mp-color-background-elevated`                           | 弹层底色                    |
| `--sn-mp-color-border-subtle`                                 | 工具栏分割线                |
| `--sn-mp-color-text-primary` / `--sn-mp-color-text-secondary` | 标题 / 取消文案             |
| `--sn-mp-color-action-primary`                                | 确认文案                    |
| `--sn-mp-font-size-md` / `--sn-mp-font-weight-semibold`       | 工具栏字号 / 标题与确认字重 |
| `--sn-mp-spacing-2` / `--sn-mp-spacing-4`                     | 动作内边距 / 工具栏内边距   |

## AI Patch Boundary

- AI 可通过 Patch 修改展示与选择配置：`title` / `cancelButtonText` / `confirmButtonText` / `type` / `minDate` / `maxDate` / `minHour` / `maxHour` / `minMinute` / `maxMinute` / `useSecond` / `minSecond` / `maxSecond` / `itemHeight` / `visibleItemCount` / `valueKey` / `labelKey` / `formatter` / `filter` / `lunar` / `zIndex` / `closeOnClickModal` / `safeAreaInsetBottom` / `immediateChange`。
- `modelValue` 是运行时选择结果：Patch 可以设置初始值，但弹层打开后不应覆盖用户已拨动的草稿；`immediateChange` 开启时每次拨动都会写回，Patch 应把它当成运行时状态而不是静态配置。
- `visible` 属于宿主交互状态：Patch 可以改初始显隐，不应在用户操作过程中反复翻转。
- `beforeConfirm` 是宿主校验回调：Patch 只应调整是否声明，不应伪造校验结果或绕过业务逻辑。
- `customClass` / `customStyle` / `customViewClass` 允许 Patch 做皮肤与布局微调，但不得借其注入影响其他组件的作用域样式。

## 无障碍

- 取消 / 确认为 `role="button"`，带 `aria-label`。
- 滚筒本体的 `aria-label` 与隐藏 live region 携带当前值。

## 桌面端 H5 交互

H5 端在触摸之外支持桌面输入：弹层内的滚筒可按住鼠标左键上下拖动滚动选择，也可使用鼠标滚轮——每滚一格前进一行（两端按 `minDate` / `maxDate` 与时分秒边界收边）。滚轮手势由滚筒接管，页面不会跟着滚动；点击某一行也可直接选中。小程序端保持触摸手势。

## 暗色模式

所有颜色都通过 `--sn-mp-*` token 解析，没有浅色兜底。`.sn-theme-dark` 下文字、底板、边框与状态色自动翻转：面板底色切到暗色表面，标题与滚轮正文转为暗色主文本，取消文案转为暗色次级文本，确认文案保持品牌色。

用 `sn-config-provider` 的 `theme="dark"` 包裹即可验证：

```vue
<sn-config-provider theme="dark">
  <sn-datetime-picker v-model="stamp" v-model:visible="open" type="date" title="选择日期" />
</sn-config-provider>
```

## 相关

- 滚轮本体：[`sn-datetime-picker-view`](/components/uni/datetime-picker-view)
- 入口单元格：[`sn-cell`](/components/uni/cell)
- 弹层容器：[`sn-popup`](/components/uni/popup)
- 主题切换：[`sn-config-provider`](/components/uni/config-provider)
