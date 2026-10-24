# Dialog 弹框（uni 端 / 移动端）

`sn-dialog` 是 `@snui/uni`（移动端 / 小程序 / H5）的居中弹框：支持 `alert` / `confirm` / `prompt` 三种形态、状态图标、顶部通栏图、自定义操作行，以及带正则 / 函数校验的输入框。基于 easycom 自动注册（`components/sn-dialog/sn-dialog.vue` → `<sn-dialog>`），样式几何值走 `rpx`。

> **只提供组件式**：wot-ui 的 `useDialog()` 函数式 API（`show` / `alert` / `confirm` / `prompt` / `close`）本轮**未实现** —— uni-app 各端没有可靠的编程式挂载点。请用 `v-model` 的组件写法。

## 基础用法

`type` 决定按钮集合：`alert` 只有一个确认按钮，`confirm` 有确认 + 取消，`prompt` 额外渲染输入框。

<Demo name="dialog-mp-basic" description="alert / confirm / prompt 三种形态，prompt 带长度校验。" />

## 形态与图标

- `icon`：`success` / `info` / `warning` / `danger`，或 sn-icon 注册表里的图标名
- `iconColor`：覆盖状态图标颜色
- `theme="text"`：按钮改为无边框文本样式
- `actionLayout="vertical"`：按钮竖排
- `headerImage`：正文上方的通栏图

<Demo name="dialog-mp-variant" description="成功 / 警告图标、text 主题按钮、竖排按钮。" />

## 自定义操作与拦截

- `actions`：`{ name, color?, disabled? }[]`，配置后替换默认的确认 / 取消按钮
- `beforeConfirm`：返回 `false`（或 resolve `false`）时阻止确认并保持弹框打开
- `showClose` / `closeOnClickModal`：右上角关闭按钮 / 点遮罩关闭

<Demo name="dialog-mp-actions" description="自定义 actions 行（含禁用项）与 beforeConfirm 拦截。" />

## 自定义面板样式

`customStyle` 写在面板节点上，与组件自身布局样式叠加；`selector` / `rootPortal` 仅为函数式 API 与 wot-ui 对齐而声明，组件形态下无效果。

<Demo name="dialog-mp-custom" description="custom-style 追加内边距与最小宽度；selector / root-portal 为对齐声明。" />

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | 是否显示（`v-model`） |
| `title` | `string` | `''` | 标题 |
| `msg` | `string` | `''` | 消息内容 |
| `type` | `'alert' \| 'confirm' \| 'prompt'` | `'alert'` | 弹框类型 |
| `theme` | `'button' \| 'text'` | `'button'` | 按钮风格 |
| `zIndex` | `number` | `99` | 弹窗层级 |
| `lazyRender` | `boolean` | `true` | 弹层内容懒渲染 |
| `headerImage` | `string` | `''` | 顶部通栏图片地址 |
| `icon` | `string` | `''` | 状态图标：`success` / `info` / `warning` / `danger`，或自定义图标名 |
| `iconColor` | `string` | `''` | 图标颜色 |
| `iconProps` | `Record<string, unknown>` | `{}` | 透传给内部 `sn-icon` 的属性 |
| `inputValue` | `string \| number` | `''` | Prompt 输入框初始值（也支持 `v-model:input-value`） |
| `inputProps` | `Record<string, unknown>` | `{}` | Prompt 模式下透传给 `sn-input` 的属性 |
| `textareaProps` | `Record<string, unknown>` | `{}` | 非空时 prompt 模式改为渲染 `sn-textarea` |
| `inputPattern` | `RegExp` | — | Prompt 输入正则校验规则 |
| `inputValidate` | `(value) => boolean \| string` | — | Prompt 函数校验规则，返回字符串即错误文案 |
| `inputError` | `string` | `''` | 校验失败时的兜底提示文案 |
| `showErr` | `boolean` | `false` | 是否展示错误信息 |
| `actionLayout` | `'horizontal' \| 'vertical'` | `'horizontal'` | 操作按钮排列方式 |
| `showCancelButton` | `boolean` | — | 是否显示取消按钮；`alert` 默认 `false`，其余默认 `true` |
| `confirmButtonText` | `string` | `''` | 确认按钮文案（缺省为「确定」） |
| `cancelButtonText` | `string` | `''` | 取消按钮文案（缺省为「取消」） |
| `confirmButtonProps` | `string \| object \| null` | `{}` | 确认按钮高级配置；字符串为文案，对象透传给 `sn-button`，`null` 隐藏 |
| `cancelButtonProps` | `string \| object \| null` | — | 取消按钮高级配置，语法同上 |
| `actions` | `DialogAction[]` | `[]` | 自定义操作按钮数组，优先级高于确认 / 取消按钮 |
| `closeOnClickModal` | `boolean` | `false` | 是否支持点击遮罩关闭 |
| `showClose` | `boolean` | `false` | 是否显示右上角关闭按钮 |
| `beforeConfirm` | `() => boolean \| Promise<boolean>` | — | 确认前拦截函数 |
| `selector` | `string` | `''` | 唯一标识（仅为 API 对齐保留，组件式下无效果） |
| `customClass` | `string` | `''` | 根节点自定义类名 |
| `customStyle` | `string` | `''` | 面板自定义样式 |

`DialogAction` = `{ name?: string; color?: string; disabled?: boolean }`。

## Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | `v-model` 同步 | `boolean` |
| `update:inputValue` | Prompt 输入变化 | `string \| number` |
| `confirm` | 确认（校验 + `beforeConfirm` 通过后） | `{ action: 'confirm', inputValue }` |
| `cancel` | 取消 | — |
| `close` | 弹框关闭（确认 / 取消 / 关闭按钮 / 遮罩） | — |
| `select` | 点击自定义操作行 | `{ item, index }` |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `header` | 自定义头部区域 |
| `image` | 自定义图片区域（替代 `headerImage`） |
| `title` | 自定义标题区域，插槽 props：`{ icon, title, iconProps }` |
| `default` | 自定义内容区域，插槽 props：`{ msg, type, inputValue, showErr, inputError }` |
| `actions` | 自定义操作区，插槽 props：`{ confirm, cancel, close }` |

## 主题变量

| 变量 | 用途 |
| --- | --- |
| `--sn-mp-color-text-primary` | 标题与正文基础色 |
| `--sn-mp-color-text-secondary` | 消息内容 |
| `--sn-mp-color-text-tertiary` | 关闭图标 |
| `--sn-mp-color-action-primary` | 默认状态图标颜色 |
| `--sn-mp-color-feedback-danger` | 校验错误文案 |
| `--sn-mp-color-border-subtle` | 自定义操作行分隔线 |
| `--sn-mp-font-size-xl` | 标题字号 |
| `--sn-mp-font-size-md` | 正文 / 操作行字号 |
| `--sn-mp-font-size-sm` | 校验文案字号 |
| `--sn-mp-font-line-height-tight` | 标题行高 |
| `--sn-mp-font-line-height-normal` | 正文行高 |
| `--sn-mp-font-weight-medium` | 标题 / 强调操作行字重 |
| `--sn-mp-spacing-1` … `--sn-mp-spacing-6` | 内部间距节奏 |
| `--sn-mp-radius-lg` | 通栏图圆角 |

## 无障碍

- 弹层由 `sn-popup` 提供 `role="dialog"` + `aria-modal="true"`
- 关闭按钮：`role="button"` + `aria-label="close"`
- 自定义操作行：`role="button"` + `aria-disabled`
- 移动端无全局键盘事件，因此不做键盘拦截

## 暗色模式

面板背景、文字与状态色全部来自语义色 token（`--sn-mp-color-background-elevated` / `--sn-mp-color-text-*` / `--sn-mp-color-feedback-*`），这些都在 `@snui/tokens-mp/styles` 的暗色块里覆盖过，因此自动适配。可用 sn-config-provider 的 theme 设为 dark 包裹验证：


> 若通过 `iconColor` 传了自定义色值（如 `#5b8def`），该值不会随主题翻转 —— 暗色下请改用 `var(--sn-mp-*)` 形式的颜色。

## 相关

- 底部动作面板：[`sn-action-sheet`](/components/uni/action-sheet)
- 轻提示：[`sn-toast`](/components/uni/toast)
