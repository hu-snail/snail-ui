# Tooltip 文字提示（uni 端 / 移动端）

`sn-tooltip` 是 `@snui/uni`（移动端 / 小程序 / H5）的文字提示气泡：一个触发元素加一个短提示，`placement` 支持 wot-ui 的 12 个方向档位。基于 easycom 自动注册（`components/sn-tooltip/sn-tooltip.vue` → `<sn-tooltip>`），样式几何值走 `rpx`。

> **与 wot-ui 的差异**
>
> - 小程序 / 触摸设备没有 `hover`，触发器改为**点击**切换显隐。
> - `root-portal` 已声明但**未实现**（小程序没有 portal 宿主，无法把气泡挂到页面根节点）。
> - `updatePosition()` 是兼容占位：气泡位置由 CSS 决定，没有需要重新测量的内容。

## 基础用法

`v-model` 控制显隐；`content` 是提示文案。再点一次触发器收起。

<Demo name="tooltip-mp-basic" description="点击按钮切换提示气泡，外部点击不会关闭。" />

## 弹出方向

`placement` 支持 `top` / `bottom` / `left` / `right` 四组，每组带 `-start` / `-end` 对齐变体（共 12 档）。箭头位置随方向自动调整。

<Demo name="tooltip-mp-placement" description="四个方向的提示气泡，一次只开一个。" />

## 箭头 / 关闭按钮 / 偏移

- `visibleArrow=false` 去掉箭头
- `showClose` 在气泡内渲染关闭按钮
- `offset` 支持 `number`、`[x, y]`、`{ x, y }`，单位是设计稿 px，通过 `--sn-tooltip-offset-x` / `--sn-tooltip-offset-y` 参与定位计算
- `disabled` 让触发器点击失效，气泡保持关闭

<Demo name="tooltip-mp-config" description="无箭头 / 带关闭按钮 + offset / 禁用三种状态。" />

## 多行内容与 content 插槽

`content` 传数组时每条渲染成一行（对象取 `label` / `text` / `content` / `name` 之一）；`content` 插槽完全替换气泡正文，可放任意结构：

<Demo name="tooltip-mp-content" description="数组 content 渲染多行；content 插槽自定义气泡结构；offset 的 [x, y] 与 { x, y } 两种写法。" />
## Props

| 属性           | 类型                                                                                                                                                                 | 默认值     | 说明                                                                                    |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------- |
| `modelValue`   | `boolean`                                                                                                                                                            | `false`    | 是否显示（`v-model`）                                                                   |
| `content`      | `string \| Array<Record<string, unknown> \| string>`                                                                                                                 | `''`       | 提示文案；数组按行渲染（取 `label` / `text` / `content` / `name` 字段，或直接是字符串） |
| `placement`    | `'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | `'bottom'` | 提示位置                                                                                |
| `offset`       | `number \| number[] \| { x?, y? }`                                                                                                                                   | `0`        | 与触发器的间距（设计稿 px）                                                             |
| `visibleArrow` | `boolean`                                                                                                                                                            | `true`     | 是否显示箭头                                                                            |
| `disabled`     | `boolean`                                                                                                                                                            | `false`    | 是否禁用                                                                                |
| `showClose`    | `boolean`                                                                                                                                                            | `false`    | 是否显示关闭按钮                                                                        |
| `customArrow`  | `string`                                                                                                                                                             | `''`       | 箭头节点自定义类名                                                                      |
| `customPop`    | `string`                                                                                                                                                             | `''`       | 气泡节点自定义类名                                                                      |
| `customClass`  | `string`                                                                                                                                                             | `''`       | 根节点自定义类名                                                                        |
| `customStyle`  | `string`                                                                                                                                                             | `''`       | 根节点自定义样式                                                                        |
| `rootPortal`   | `boolean`                                                                                                                                                            | `false`    | **未实现**（小程序无 portal 宿主）                                                      |

## Events

| 事件名              | 说明               | 参数                |
| ------------------- | ------------------ | ------------------- |
| `update:modelValue` | 显隐变化           | `(value: boolean)`  |
| `open`              | 提示层显示时触发   | —                   |
| `close`             | 提示层关闭时触发   | —                   |
| `change`            | 显隐状态变化时触发 | `{ show: boolean }` |

## Slots

| 插槽名    | 说明                               |
| --------- | ---------------------------------- |
| `default` | 触发提示层的目标内容               |
| `content` | 自定义提示层内容，会替换 `content` |

## 方法

| 方法名             | 说明                 |
| ------------------ | -------------------- |
| `open()`           | 打开提示层           |
| `close()`          | 关闭提示层           |
| `updatePosition()` | 兼容占位，无实际操作 |

## 主题变量

| 变量                                                            | 用途                                 |
| --------------------------------------------------------------- | ------------------------------------ |
| `--sn-mp-color-text-primary`                                    | 气泡底色（反向表面，暗色下自动翻转） |
| `--sn-mp-color-background-elevated`                             | 气泡文字色 / 关闭图标色              |
| `--sn-mp-shadow-md`                                             | 气泡阴影                             |
| `--sn-mp-radius-md`                                             | 气泡圆角                             |
| `--sn-mp-spacing-2` / `--sn-mp-spacing-3` / `--sn-mp-spacing-4` | 气泡内边距与间距                     |
| `--sn-mp-font-size-sm`                                          | 气泡字号                             |
| `--sn-mp-font-line-height-normal`                               | 气泡行高                             |

## 无障碍

- 触发器带 `role="button"` + `aria-expanded` + `aria-disabled`
- 气泡带 `role="tooltip"`，箭头 `aria-hidden="true"`
- 关闭按钮带 `role="button"` + `aria-label="close"`
- 交互统一用 `@tap`；移动端无键盘焦点陷阱

## 暗色模式

气泡使用「反向表面」配色：底色取 `--sn-mp-color-text-primary`、文字取 `--sn-mp-color-background-elevated`，这两个变量都在 `@snui/tokens-mp/styles` 的 `page.sn-theme-dark, .sn-theme-dark` 块里覆盖，因此暗色下自动变成浅底深字，无需额外处理。可用 `<sn-config-provider theme="dark">` 包裹验证。

## 相关

- 带菜单项 / 富内容的气泡：[`sn-popover`](/components/uni/popover)
- 页面级下拉筛选：`sn-drop-menu`
