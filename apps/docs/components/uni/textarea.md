# Textarea 文本域（uni 端 / 移动端）

跨 uni-app 多端的多行文本输入控件。easycom 自动注册（`components/sn-textarea/sn-textarea.vue` → `<sn-textarea>`），几何值使用 `rpx`，颜色全部走 `--sn-mp-*` token。

## 基础用法

`v-model` 双向绑定；`placeholder` 默认与 wot-ui 一致为 `请输入...`。

<Demo name="textarea-mp-basic" description="v-model 双向绑定 + placeholder。" />

## 字数统计与清空（`showWordLimit` / `clearable`）

`showWordLimit` 需要同时设置 `maxlength > 0` 才会渲染计数器（`-1` 表示不限制长度，计数器自动隐藏）。`clearable` 渲染 × 按钮，`clearTrigger` 控制显示时机。

<Demo name="textarea-mp-counter-clear" description="showWordLimit + maxlength 计数；clearable 清空；error 错误态。" />

## 状态（`autoHeight` / `readonly` / `disabled` / `compact`）

`autoHeight` 让高度随内容增长；`readonly` / `disabled` 都会真正拦住事件（不 emit `update:modelValue`）；`compact` 去掉边框与背景，用于表单行内。

<Demo name="textarea-mp-states" description="autoHeight / readonly / disabled / compact。" />
## 前置图标与占位符（`prefixIcon` / `iconPrefix` / `cssIcon` / `placeholderStyle` / `placeholderClass`）

`prefixIcon` 走 sn-icon registry 解析；`iconPrefix` + `cssIcon` 直接把字符串当 CSS 类名挂上（跳过 registry）。`placeholderStyle` 注入占位符内联样式，`placeholderClass` 额外挂一个类名。

<Demo name="textarea-mp-prefix-icon" description="prefixIcon 走 registry；iconPrefix + cssIcon 走 CSS 类；placeholderStyle / placeholderClass 定制占位符。" />

## 清空时机（`clearTrigger` / `focusWhenClear`）

`clearTrigger="always"` 一有值就显示 ×，`"focus"` 只在聚焦时显示。`focusWhenClear` 决定清空后是否尝试回焦（uni 端为占位实现，软键盘已收起）。

<Demo name="textarea-mp-clear-trigger" description="clearTrigger: always / focus 控制 × 显示时机；focusWhenClear 控制清空后回焦。" />

## 小程序原生属性（MP-only）

`focus` / `autoFocus` / `fixed` / `cursor` / `selectionStart` / `selectionEnd` / `cursorSpacing` / `adjustPosition` / `disableDefaultPadding` / `holdKeyboard` / `confirmType` / `confirmHold` / `showConfirmBar` / `ignoreCompositionEvent` / `enableNative` / `inputmode` 全部透传到底层原生 `<textarea>`。

<Demo name="textarea-mp-mp-runtime" description="focus / autoFocus / fixed / cursor / selection-* / cursorSpacing / adjustPosition / disableDefaultPadding / holdKeyboard / confirmType / confirmHold / showConfirmBar / ignoreCompositionEvent / enableNative / inputmode。" />

## 自定义样式挂载点（`customClass` / `customStyle` / `customTextareaClass`）

`customClass` / `customStyle` 作用于根节点，`customTextareaClass` 作用于内层原生 `<textarea>`。

<Demo name="textarea-mp-custom-class" description="customClass + customStyle 挂根节点；customTextareaClass 挂内层 textarea。" />

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string \| number` | `''` | 绑定值，数字按字符串渲染。 |
| `placeholder` | `string` | `'请输入...'` | 占位文本。 |
| `placeholderStyle` | `string` | `''` | 占位符内联样式。 |
| `placeholderClass` | `string` | `''` | 占位符样式类。 |
| `disabled` | `boolean` | `false` | 禁用，原生 `disabled` + 阻断事件。 |
| `readonly` | `boolean` | `false` | 只读，可见不可编辑，阻断事件。 |
| `maxlength` | `number` | `-1` | 最大长度，`-1` 不限制。 |
| `clearable` | `boolean` | `false` | 显示 × 清空按钮。 |
| `prefixIcon` | `string` | `''` | 前置图标名（sn-icon registry 解析）。 |
| `iconPrefix` | `string` | `''` | 前置图标 CSS 类名。 |
| `cssIcon` | `boolean \| string` | `false` | 把 `prefixIcon` 当 CSS 类名。 |
| `showWordLimit` | `boolean` | `false` | 显示字数统计，需 `maxlength > 0`。 |
| `clearTrigger` | `'always' \| 'focus'` | `'always'` | × 按钮显示时机。 |
| `focusWhenClear` | `boolean` | `true` | 清空后自动聚焦（uni 端为占位实现，软键盘已收起）。 |
| `error` | `boolean` | `false` | 错误态（红边框 + `aria-invalid`）。 |
| `focus` | `boolean` | `false` | 挂载即聚焦。 |
| `autoFocus` | `boolean` | `false` | 自动聚焦并拉起键盘。 |
| `autoHeight` | `boolean` | `false` | 高度随内容增长。 |
| `fixed` | `boolean` | `false` | `position: fixed` 区域下的固定模式。 |
| `cursorSpacing` | `number` | `0` | 光标与键盘距离（px）。 |
| `cursor` | `number` | `-1` | 初始光标位置，`-1` 表示不设置。 |
| `confirmType` | `'send' \| 'search' \| 'next' \| 'go' \| 'done'` | — | 键盘右下角按钮文案。 |
| `confirmHold` | `boolean` | `false` | 点确认键时保持键盘。 |
| `showConfirmBar` | `boolean` | `true` | 键盘上方「完成」工具栏。 |
| `selectionStart` | `number` | `-1` | 选区起点。 |
| `selectionEnd` | `number` | `-1` | 选区终点。 |
| `adjustPosition` | `boolean` | `true` | 键盘弹起时自动上推页面。 |
| `disableDefaultPadding` | `boolean` | `false` | 去掉 iOS 默认内边距。 |
| `holdKeyboard` | `boolean` | `false` | 聚焦时点击页面保持键盘。 |
| `ignoreCompositionEvent` | `boolean` | `true` | `false` 时合成期间也触发 `input`。 |
| `inputmode` | `'none' \| 'text' \| 'decimal' \| 'numeric' \| 'tel' \| 'search' \| 'email' \| 'url'` | `'text'` | 输入模式提示。 |
| `enableNative` | `boolean` | `true` | 支付宝小程序启用原生输入框。 |
| `compact` | `boolean` | — | 紧凑模式（未显式设置时由 sn-form-item 决定）。 |
| `customTextareaClass` | `string` | `''` | 内层 `<textarea>` 类名。 |
| `customClass` | `string` | `''` | 根节点类名。 |
| `customStyle` | `string` | `''` | 根节点 inline style。 |

## Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | v-model 同步，每次输入触发 | `(value: string)` |
| `input` | 原生 input 事件 | `(value: string, event: Event)` |
| `change` | 原生 change 事件 | `(value: string, event: Event)` |
| `focus` | 聚焦 | `(event: Event)` |
| `blur` | 失焦 | `(event: Event)` |
| `clear` | 点击 × 清空按钮 | — |
| `linechange` | 行数变化（原生 `linechange`） | `(event: Event)` |
| `confirm` | 点击键盘完成按钮 | `(value: string)` |
| `keyboardheightchange` | 键盘高度变化 | `(event: Event)` |
| `click` | 点击根节点 | `(event: Event)` |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `prefix` | 输入区上方的前置内容（图标 / 自定义节点）。 |
| `count` | 自定义计数器，作用域参数 `{ current, max }`。 |
| `clear-icon` | 自定义 × 图标内容。 |

## 主题变量

| 变量 | 用途 |
| --- | --- |
| `--sn-mp-color-input-bg` | 文本域背景 |
| `--sn-mp-color-input-text` | 文本颜色 |
| `--sn-mp-color-input-placeholder` | 占位符颜色 |
| `--sn-mp-color-input-border` | 默认边框 |
| `--sn-mp-color-input-border-focus` | 聚焦边框 |
| `--sn-mp-color-feedback-danger` | 错误态边框 |
| `--sn-mp-color-text-tertiary` | 计数器文字 |
| `--sn-mp-color-background-soft` | × 按钮底 |
| `--sn-mp-input-padding-x` | 水平内边距 |
| `--sn-mp-input-radius` | 圆角 |
| `--sn-mp-font-size-md` / `--sn-mp-font-line-height-normal` | 正文字号 / 行高 |

## 无障碍

- 原生 `<textarea>`，无需额外 role。
- `error` 时设置 `aria-invalid="true"`；`disabled` / `readonly` 分别设置 `aria-disabled` / `aria-readonly`。
- `aria-label` 默认取 `placeholder` 文案。
- 计数器容器带 `aria-live="polite"`，字数变化会被朗读。

## 暗色模式

所有颜色均通过 `--sn-mp-color-*` token 解析，**没有**浅色兜底，因此 `.sn-theme-dark` 或 `page.sn-theme-dark` 下背景 / 文字 / 边框 / 占位符会自动翻转。可用 sn-config-provider 的 theme 设为 dark 包裹验证：

