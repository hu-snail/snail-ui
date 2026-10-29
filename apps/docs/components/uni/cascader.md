# Cascader 级联选择器（uni 端 / 移动端）

`sn-cascader` 是 `@snui/uni` 的级联选择弹层：tab 式逐级下钻。easycom 自动注册（`components/sn-cascader/sn-cascader.vue` → `<sn-cascader>`），几何值使用 `rpx`。静态模式下点中叶子立即确认并返回叶子值；`checkStrictly` 允许确认任意层级并显示确认按钮；`lazyLoad` 模式下确认返回完整路径（异步树在最后一级解析前没有叶子值）。

## 基础用法

静态模式：逐级 tap 下钻，点中叶子即确认并关闭。

<Demo name="cascader-mp-basic" description="静态模式：逐级 tap 下钻，点中叶子即确认并关闭。" />

## 任意级可选与异步加载（`checkStrictly` / `lazyLoad`）

checkStrictly 允许确认任意层级，并显示确认按钮；lazyLoad 在展开非叶子节点时向宿主请求子级。

<Demo name="cascader-mp-strict-lazy" description="checkStrictly 允许确认任意层级，并显示确认按钮；lazyLoad 在展开非叶子节点时向宿主请求子级。" />
## 字段映射与提示（`valueKey` / `textKey` / `childrenKey` / `tipKey` / `lineWidth` / `lineHeight`）

选项字段名完全可配：`valueKey` / `textKey` / `childrenKey` 分别指向 value / 文案 / 子级，`tipKey` 指向每行的提示小字。`lineWidth` / `lineHeight` 调整当前列指示条尺寸（数字按 rpx 设计值）。

<Demo name="cascader-mp-fields" description="valueKey / textKey / childrenKey / tipKey 字段映射；lineWidth / lineHeight；confirmText。" />

## 异步加载与确认拦截（`lazyLoad` / `isLeafKey` / `beforeConfirm` / `checkStrictly`）

`lazyLoad(option, tabIndex, resolve)` 在展开非叶子节点时向宿主请求子级；`isLeafKey` 指定标记叶子的字段；`beforeConfirm` 可拦确认；`checkStrictly` 让任意层级都可确认（此时才渲染确认按钮）。

<Demo name="cascader-mp-lazy-confirm" description="lazyLoad + isLeafKey；checkStrictly；beforeConfirm 拦截；confirmText。" />

## 弹层与指示条（`closeOnClickModal` / `zIndex` / `safeAreaInsetBottom` / `lineTheme` / `custom*`）

`lineTheme` 四档指示条（`normal` / `text` / `underline` / `dot`）。`closeOnClickModal` / `safeAreaInsetBottom` / `zIndex` / `rootPortal` 转发给 `sn-popup`，`customClass` / `customStyle` 挂弹层。

<Demo name="cascader-mp-sheet" description="lineTheme underline / dot；closeOnClickModal=false；safeAreaInsetBottom；zIndex；rootPortal；customClass / customStyle。" />

## Props

| 属性                                                            | 类型                                                          | 默认值                                                     | 说明                                       |
| --------------------------------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------ |
| `modelValue`                                                    | `string \| number \| Array<...>`                              | `undefined`                                                | 叶子值，或异步模式下的路径数组             |
| `visible`                                                       | `boolean`                                                     | `false`                                                    | 弹层显隐                                   |
| `options`                                                       | `CascaderOption[]`                                            | `[]`                                                       | 层级选项树                                 |
| `title`                                                         | `string`                                                      | `''`                                                       | 工具栏标题                                 |
| `beforeConfirm`                                                 | `({ value, selectedOptions }) => boolean \| Promise<boolean>` | `undefined`                                                | 确认前钩子                                 |
| `checkStrictly`                                                 | `boolean`                                                     | `false`                                                    | 任意级可选                                 |
| `confirmText`                                                   | `string`                                                      | `'确认'`                                                   | 确认按钮文案                               |
| `valueKey` / `textKey` / `childrenKey` / `tipKey` / `isLeafKey` | `string`                                                      | `'value'` / `'text'` / `'children'` / `'tip'` / `'isLeaf'` | 节点字段名                                 |
| `lazyLoad`                                                      | `CascaderLazyLoad`                                            | `undefined`                                                | 异步加载回调 `(option, tabIndex, resolve)` |
| `closeOnClickModal`                                             | `boolean`                                                     | `true`                                                     | 点击遮罩关闭                               |
| `zIndex` / `safeAreaInsetBottom`                                | `number` / `boolean`                                          | `15` / `true`                                              | 层级 / 安全区                              |
| `lineWidth` / `lineHeight`                                      | `number \| string`                                            | `undefined`                                                | 激活指示条尺寸                             |
| `lineTheme`                                                     | `'normal' \| 'text' \| 'underline' \| 'dot'`                  | `'normal'`                                                 | 指示条位置样式                             |
| `customClass` / `customStyle`                                   | `string`                                                      | `''`                                                       | 根节点自定义类名 / 样式                    |

> **未实现**：`root-portal`：uni-app 小程序没有 portal 宿主。

## Events

| 事件名              | 说明           | 参数                         |
| ------------------- | -------------- | ---------------------------- |
| `update:modelValue` | 确认选择时     | `(value)`                    |
| `update:visible`    | 弹层显隐变化时 | `(value: boolean)`           |
| `confirm`           | 确认时         | `{ value, selectedOptions }` |
| `close`             | 未确认关闭时   | —                            |

## Slots

本组件不提供插槽。

## 主题变量

| 变量                                                                      | 用途                         |
| ------------------------------------------------------------------------- | ---------------------------- |
| `--sn-mp-color-background-elevated`                                       | 弹层底色                     |
| `--sn-mp-color-background-soft`                                           | tab 底色                     |
| `--sn-mp-color-action-primary`                                            | 激活 tab / 选中行 / 勾选图标 |
| ``--sn-mp-color-text-primary` / `-secondary` / `-tertiary` / `-disabled`` | 文字与禁用态                 |
| `--sn-mp-color-border-subtle`                                             | 行与工具栏分割线             |
| `--sn-mp-radius-md`                                                       | tab / 按钮圆角               |

## 无障碍

- tab 条为 `role="tablist"`，每个 tab 为 `role="tab"` + `aria-selected`。
- 每个选项为 `role="button"`，带 `aria-pressed` / `aria-disabled`。
- 异步加载态为 `role="status"` + `aria-live="polite"`。

## 暗色模式

所有颜色都通过 `--sn-mp-*` token 解析，没有浅色兜底。`.sn-theme-dark` 下文字、底板、边框与状态色自动翻转。验证方式：
