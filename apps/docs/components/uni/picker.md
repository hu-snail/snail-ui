# Picker 选择器（uni 端 / 移动端）

`sn-picker` 是 `@snui/uni` 的弹层选择器：`sn-popup` 提供遮罩 / 动画，`sn-picker-view` 提供滚轮，本体负责工具栏与草稿值。easycom 自动注册（`components/sn-picker/sn-picker.vue` → `<sn-picker>`），几何值使用 `rpx`。默认（`immediateChange: false`）滚动只改草稿，点确认才写 `v-model`——与 wot-ui 一致。

## 基础用法

sn-picker 弹层选择器：v-model:visible 控制显隐，滚动只改草稿，确认才写 v-model。

<Demo name="picker-mp-basic" description="sn-picker 弹层选择器：v-model:visible 控制显隐，滚动只改草稿，确认才写 v-model。" />

## 级联与确认校验（`cascade` / `beforeConfirm`）

cascade 让 columns 变成树，确认时返回完整路径；beforeConfirm 返回 false 时弹层不关闭、v-model 不写。

<Demo name="picker-mp-cascade-confirm" description="cascade 让 columns 变成树，确认时返回完整路径；beforeConfirm 返回 false 时弹层不关闭、v-model 不写。" />
## 字段映射与按钮文案（`valueKey` / `labelKey` / `childrenKey` / `cancelButtonText`）

`valueKey` / `labelKey` / `childrenKey` 把任意字段名的选项映射到 value / label / 子级（`cascade` 模式下才读 `childrenKey`）；`cancelButtonText` 改取消按钮文案。

<Demo name="picker-mp-fields" description="valueKey / labelKey / childrenKey 字段映射；cancelButtonText；confirmButtonText。" />

## 滚筒几何与弹层（`itemHeight` / `visibleItemCount` / `immediateChange` / 遮罩层级 / `custom*`）

`itemHeight`（px 设计值）与 `visibleItemCount` 决定行高与可见行数；`immediateChange` 滚动即写 `v-model`；`closeOnClickModal` / `safeAreaInsetBottom` / `zIndex` / `rootPortal` 转发给 `sn-popup`，`customClass` / `customStyle` 挂弹层，`customViewClass` 挂滚筒本体。

<Demo name="picker-mp-rows-sheet" description="itemHeight / visibleItemCount；immediateChange；closeOnClickModal=false；safeAreaInsetBottom；zIndex；rootPortal；customClass / customStyle / customViewClass。" />

## Props

| 属性                                              | 类型                                                        | 默认值                               | 说明                            |
| ------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------ | ------------------------------- |
| `modelValue`                                      | `Array<string \| number>`                                   | `[]`                                 | 确认后的各列值                  |
| `visible`                                         | `boolean`                                                   | `false`                              | 弹层显隐（`v-model:visible`）   |
| `columns`                                         | `Array<Array<...>>`                                         | `[]`                                 | 列数据；`cascade` 时传选项树    |
| `cascade`                                         | `boolean`                                                   | `false`                              | 把 columns 当树处理             |
| `title`                                           | `string`                                                    | `''`                                 | 工具栏标题（空则不渲染标题行）  |
| `cancelButtonText` / `confirmButtonText`          | `string`                                                    | `'取消'` / `'确认'`                  | 取消 / 确认按钮文案             |
| `valueKey` / `labelKey` / `childrenKey`           | `string`                                                    | `'value'` / `'label'` / `'children'` | 选项字段名                      |
| `itemHeight` / `visibleItemCount`                 | `number`                                                    | `44` / `6`                           | 行高 / 可见行数                 |
| `beforeConfirm`                                   | `({ value, selectedItems }) => boolean \| Promise<boolean>` | `undefined`                          | 确认前钩子，返回 false 阻止关闭 |
| `closeOnClickModal`                               | `boolean`                                                   | `true`                               | 点击遮罩关闭                    |
| `zIndex`                                          | `number`                                                    | `15`                                 | 弹层层级                        |
| `safeAreaInsetBottom`                             | `boolean`                                                   | `true`                               | 底部安全区留白                  |
| `immediateChange`                                 | `boolean`                                                   | `false`                              | 滚动即写回 v-model              |
| `customClass` / `customStyle` / `customViewClass` | `string`                                                    | `''`                                 | 根节点 / 弹层 / 滚轮自定义类名  |

> **未实现**：`root-portal`：uni-app 小程序没有 portal 宿主，无法把弹层重新挂到页面根节点（与 `sn-popup` 相同的差异）。

## Events

| 事件名              | 说明                                   | 参数                       |
| ------------------- | -------------------------------------- | -------------------------- |
| `update:modelValue` | 确认时（`immediateChange` 时每次滚动） | `(value: Array)`           |
| `update:visible`    | 弹层显隐变化时                         | `(value: boolean)`         |
| `confirm`           | 点击确认并通过校验时                   | `{ value, selectedItems }` |
| `cancel`            | 点击取消时                             | —                          |
| `open`              | 弹层打开时                             | —                          |

## Slots

本组件不提供插槽。

## 主题变量

| 变量                                          | 用途            |
| --------------------------------------------- | --------------- |
| `--sn-mp-color-background-elevated`           | 弹层底色        |
| `--sn-mp-color-border-subtle`                 | 工具栏分割线    |
| ``--sn-mp-color-text-primary` / `-secondary`` | 标题 / 取消文案 |
| `--sn-mp-color-action-primary`                | 确认文案        |
| `--sn-mp-font-size-md`                        | 工具栏字号      |
| ``--sn-mp-spacing-2` / `-3` / `-4``           | 工具栏内边距    |

## 无障碍

- 取消 / 确认为 `role="button"`，带 `aria-label`。
- 弹层本体由 `sn-popup` 提供 `role="dialog"` + `aria-modal`。

## 桌面端 H5 交互

H5 端在触摸之外支持桌面输入：弹层内的滚筒可按住鼠标左键上下拖动滚动选择，也可使用鼠标滚轮——每滚一格前进一行（自动跳过禁用行，两端收边）。滚轮手势由滚筒接管，页面不会跟着滚动；点击某一行也可直接选中。小程序端保持触摸手势。

## 暗色模式

所有颜色都通过 `--sn-mp-*` token 解析，没有浅色兜底。`.sn-theme-dark` / `page.sn-theme-dark` 下文字、底板、边框与状态色自动翻转。验证方式：
