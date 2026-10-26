# SelectPicker 单复选选择器（uni 端 / 移动端）

`sn-select-picker` 是 `@snui/uni` 的单 / 复选弹层：一个带可选搜索框的列表加确认底栏。easycom 自动注册（`components/sn-select-picker/sn-select-picker.vue` → `<sn-select-picker>`），几何值使用 `rpx`。`type="checkbox"` 用数组 `v-model`，`type="radio"` 用标量；组件把两种形态统一成内部集合，再按声明形态写回。

## 基础用法

checkbox 类型用数组 v-model；min / max 限制可选数量；tap 行即切换。

<Demo name="select-picker-mp-basic" description="checkbox 类型用数组 v-model；min / max 限制可选数量；tap 行即切换。" />

## 单选与搜索（`type` / `filterable` / `checkedColor`）

type="radio" 写回标量；filterable 打开搜索框按 label 过滤；checkedColor 覆盖选中色。

<Demo name="select-picker-mp-radio-filter" description="type=radio 写回标量；filterable 打开搜索框按 label 过滤；checkedColor 覆盖选中色。" />
## 字段映射与按钮（`valueKey` / `labelKey` / `confirmButtonText` / `showConfirm` / `selectSize`）

`valueKey` / `labelKey` 把任意字段名的选项映射到 value / label；`confirmButtonText` 改确认按钮文案，`showConfirm=false` 收起确认按钮。`selectSize`（`mini` / `small` / `medium` / `large`）为与 wot-ui 对齐的 chip 尺寸参数，本构建的行高由 token 决定，**声明但未参与渲染**。

<Demo name="select-picker-mp-fields-size" description="valueKey / labelKey 字段映射；confirmButtonText；showConfirm=false；selectSize（声明但未参与渲染）。" />

## 加载态与弹层（`loading` / `loadingColor` / `beforeConfirm` / `scrollIntoView` / 遮罩层级 / `custom*`）

`loading` 把列表换成加载占位，`loadingColor` 给 spinner 上色；`beforeConfirm` 可拦确认；`scrollIntoView` 打开时把选中行滚进视野。`closeOnClickModal` / `safeAreaInsetBottom` / `zIndex` / `rootPortal` 转发给 `sn-popup`，`customClass` / `customStyle` 挂弹层，`customContentClass` 挂选项内容容器。

<Demo name="select-picker-mp-loading-sheet" description="loading / loadingColor；beforeConfirm；closeOnClickModal；safeAreaInsetBottom；zIndex；rootPortal；scrollIntoView；customClass / customStyle / customContentClass。" />

## Props

| 属性                               | 类型                                                        | 默认值                | 说明                            |
| ---------------------------------- | ----------------------------------------------------------- | --------------------- | ------------------------------- |
| `modelValue`                       | `string \| number \| boolean \| Array<...>`                 | `undefined`           | radio 为标量，checkbox 为数组   |
| `visible`                          | `boolean`                                                   | `false`               | 弹层显隐                        |
| `title`                            | `string`                                                    | `'选择器'`            | 工具栏标题                      |
| `checkedColor`                     | `string`                                                    | `''`                  | 选中颜色                        |
| `min` / `max`                      | `number`                                                    | `0`                   | 最少 / 最多可选数量（0 不限制） |
| `type`                             | `'checkbox' \| 'radio'`                                     | `'checkbox'`          | 选择类型                        |
| `valueKey` / `labelKey`            | `string`                                                    | `'value'` / `'label'` | 选项字段名                      |
| `confirmButtonText`                | `string`                                                    | `'确认'`              | 确认按钮文案                    |
| `loading` / `loadingColor`         | `boolean` / `string`                                        | `false` / `''`        | 加载态与加载色                  |
| `closeOnClickModal`                | `boolean`                                                   | `true`                | 点击遮罩关闭                    |
| `columns`                          | `Record<string, unknown>[]`                                 | `[]`                  | 选项列表                        |
| `beforeConfirm`                    | `({ value, selectedItems }) => boolean \| Promise<boolean>` | `undefined`           | 确认前钩子                      |
| `zIndex` / `safeAreaInsetBottom`   | `number` / `boolean`                                        | `15` / `true`         | 层级 / 安全区                   |
| `filterable` / `filterPlaceholder` | `boolean` / `string`                                        | `false` / `'搜索'`    | 搜索框                          |
| `scrollIntoView`                   | `boolean`                                                   | `true`                | 打开时滚动到已选行              |
| `customContentClass`               | `string`                                                    | `''`                  | 选项区自定义类名                |
| `showConfirm`                      | `boolean`                                                   | `true`                | 是否渲染确认按钮                |
| `customClass` / `customStyle`      | `string`                                                    | `''`                  | 根节点自定义类名 / 样式         |

> **未实现**：`root-portal`：uni-app 小程序没有 portal 宿主。

## Events

| 事件名                      | 说明                  | 参数                       |
| --------------------------- | --------------------- | -------------------------- |
| `update:modelValue`         | 选中变化时            | `(value)`                  |
| `update:visible`            | 弹层显隐变化时        | `(value: boolean)`         |
| `change`                    | 选中变化时（同 tick） | `{ value }`                |
| `confirm`                   | 确认并通过校验时      | `{ value, selectedItems }` |
| `cancel` / `open` / `close` | 弹层生命周期          | —                          |

## Slots

本组件不提供插槽。

## 主题变量

| 变量                                                        | 用途                 |
| ----------------------------------------------------------- | -------------------- |
| `--sn-mp-color-background-elevated`                         | 弹层底色             |
| `--sn-mp-color-background-soft`                             | 搜索框底色           |
| `--sn-mp-color-action-primary`                              | 选中文案 / 勾选图标  |
| `--sn-mp-color-text-on-primary`                             | 确认按钮文字         |
| ``--sn-mp-color-text-primary` / `-secondary` / `-tertiary`` | 行 / 底栏 / 计数文案 |
| `--sn-mp-color-border-subtle`                               | 行与底栏分割线       |
| ``--sn-mp-radius-md` / `-full``                             | 圆角                 |

## 无障碍

- 每行 `role="button"`，带 `aria-pressed` / `aria-disabled`。
- 加载态为 `role="status"` + `aria-live="polite"`。
- 取消 / 确认为 `role="button"`，带 `aria-label`。

## 暗色模式

所有颜色都通过 `--sn-mp-*` token 解析，没有浅色兜底。`.sn-theme-dark` / `page.sn-theme-dark` 下文字、底板、边框与状态色自动翻转。验证方式：
