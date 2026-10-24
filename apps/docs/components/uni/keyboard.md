# Keyboard 虚拟键盘（uni 端 / 移动端）

`sn-keyboard` 是 `@snui/uni` 的虚拟键盘：数字键盘 / 车牌键盘 / 自定义模式。easycom 自动注册（`components/sn-keyboard/sn-keyboard.vue` → `<sn-keyboard>`），几何值使用 `rpx`。`maxlength` 限长，删除键逐字退格并触发 `delete`；`hideOnClickOutside` 同时控制是否渲染遮罩。没有定时器、没有观察器——无需清理。

## 基础用法

sn-keyboard 数字键盘：maxlength 限长，delete 退格，close 收起；搭配只读输入框使用。

<Demo name="keyboard-mp-basic" description="sn-keyboard 数字键盘：maxlength 限长，delete 退格，close 收起；搭配只读输入框使用。" />

## 车牌与自定义模式（`mode` / `extraKey` / `autoSwitchLang`）

mode="car" 出车牌键盘，autoSwitchLang 在选中省份后自动切字母；mode="custom" 右侧加大号操作列，extraKey 追加额外键。

<Demo name="keyboard-mp-car-custom" description="mode=car 出车牌键盘，autoSwitchLang 在选中省份后自动切字母；mode=custom 右侧加大号操作列，extraKey 追加额外键。" />
## 键位文案与删除键（`deleteText` / `closeText` / `showDeleteKey` / `randomKeyOrder` / `zIndex`）

`deleteText` / `closeText` 改删除键与关闭键文案（留空则用图标）；`showDeleteKey=false` 不渲染删除键；`randomKeyOrder` 打乱数字键顺序；`zIndex` 调层级。

<Demo name="keyboard-mp-labels" description="deleteText / closeText；showDeleteKey=false；randomKeyOrder；zIndex。" />

## 遮罩与行为（`modal` / `hideOnClickOutside` / `lockScroll` / `closeButtonLoading` / `safeAreaInsetBottom` / `rootPortal` / `custom*`）

`modal` 渲染不透明遮罩；`hideOnClickOutside=false` 点外部不关闭；`lockScroll=false` 不再拦截 `touchmove`；`closeButtonLoading` 在关闭键上显示 spinner；`rootPortal` 为对齐占位参数（小程序无 portal host）；`customClass` / `customStyle` 挂面板。

<Demo name="keyboard-mp-scrim" description="modal；hideOnClickOutside=false；lockScroll=false；closeButtonLoading；safeAreaInsetBottom；rootPortal；customClass / customStyle。" />

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `visible` | `boolean` | `false` | 键盘显隐（`v-model:visible`） |
| `modelValue` | `string` | `''` | 当前输入值 |
| `title` | `string` | `''` | 键盘标题 |
| `mode` | `'default' \| 'custom' \| 'car'` | `'default'` | 布局预设 |
| `zIndex` | `number` | `100` | 层级 |
| `maxlength` | `number` | `Infinity` | 最大输入长度 |
| `showDeleteKey` | `boolean` | `true` | 是否显示删除键 |
| `randomKeyOrder` | `boolean` | `false` | 随机排序数字键 |
| `closeText` / `deleteText` | `string` | `''` | 关闭 / 删除文案 |
| `closeButtonLoading` | `boolean` | `false` | 关闭按钮加载态 |
| `modal` / `hideOnClickOutside` / `lockScroll` | `boolean` | `false` / `true` / `true` | 遮罩行为 |
| `safeAreaInsetBottom` | `boolean` | `true` | 底部安全区留白 |
| `extraKey` | `string \| string[]` | `undefined` | 额外按键 |
| `carLang` | `'zh' \| 'en'` | `'zh'` | 车牌语言（`v-model:car-lang`） |
| `autoSwitchLang` | `boolean` | `false` | 选省份后自动切字母 |
| `customClass` / `customStyle` | `string` | `''` | 根节点自定义类名 / 样式 |
| `rootPortal` | `boolean` | `false` | 脱离页面渲染——**声明但未实现**（小程序无 portal 宿主，透传给 `sn-popup`）|

> **未实现**：`root-portal`——声明并透传给 `sn-popup`，但 uni-app 小程序没有 portal 宿主，因此没有视觉变化。

## Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 值变化时 | `(value: string)` |
| `update:visible` | 显隐变化时 | `(value: boolean)` |
| `update:carLang` | 车牌语言变化时 | `(lang: 'zh' \| 'en')` |
| `input` | 点击字符键时 | `(key: string)` |
| `delete` | 点击删除键时 | — |
| `close` | 键盘关闭时 | — |

## Slots

本组件不提供插槽。

## 主题变量

| 变量 | 用途 |
| --- | --- |
| ``--sn-mp-color-background-elevated`` | 键盘底色 |
| ``--sn-mp-color-background-soft`` | 按键底板 |
| ``--sn-mp-color-background-sunken`` | custom 模式删除键 |
| ``--sn-mp-color-text-primary` / `-secondary` / `-tertiary`` | 按键与头部文字 |
| ``--sn-mp-radius-md`` | 按键圆角 |
| ``--sn-mp-font-size-md` / `-sm` / `-xl`` | 文案字号 |

## 无障碍

- 每个按键为 `role="button"`，带 `aria-label`（字形，或 delete / 关闭文案）。
- 关闭按钮在 `closeButtonLoading` 时带 `aria-busy`。
- 遮罩 `aria-hidden`；面板由 `sn-popup` 提供 `role="dialog"`。

## 暗色模式

所有颜色都通过 `--sn-mp-*` token 解析，没有浅色兜底。`.sn-theme-dark` / `page.sn-theme-dark` 下文字、底板、边框与状态色自动翻转。验证方式：

