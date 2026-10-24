# PasswordInput 密码输入框（uni 端 / 移动端）

`sn-password-input` 是 `@snui/uni` 的方框密码框：一个视觉隐藏的原生 `<input>` 驱动软键盘，可见部分是排成一行的 token 化方框。easycom 自动注册（`components/sn-password-input/sn-password-input.vue` → `<sn-password-input>`），几何值使用 `rpx`。光标是纯 CSS（静态 2rpx 竖条，仅在 `focused` 时显示），没有定时器，因此无需清理。

## 基础用法

sn-password-input 方框密码框：length 控制格子数，mask 控制是否显示圆点，focused 与键盘显隐联动。

<Demo name="password-input-mp-basic" description="sn-password-input 方框密码框：length 控制格子数，mask 控制是否显示圆点，focused 与键盘显隐联动。" />

## 明文、错误态与间距（`mask` / `errorInfo` / `gutter`）

mask=false 显示明文；errorInfo 覆盖 info 并把边框切成危险色；gutter 控制格子间距。

<Demo name="password-input-mp-error-gutter" description="mask=false 显示明文；errorInfo 覆盖 info 并把边框切成危险色；gutter 控制格子间距。" />

## 根节点自定义类名与样式（`customClass` / `customStyle`）

`custom-class` 追加在根节点上（与 `sn-password-input` 并列），`custom-style` 是根节点的内联样式；组件自己的 `gutter` 写的变量在前，`custom-style` 追加在后。

<Demo name="password-input-mp-custom-style" description="customClass 追加在根节点上；customStyle 追加在组件自身 gutter 变量之后，可继续覆盖其它属性。" />

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string` | `''` | 当前输入值 |
| `mask` | `boolean` | `true` | 是否隐藏为圆点 |
| `info` / `errorInfo` | `string` | `''` | 提示 / 错误文案（错误优先） |
| `gutter` | `number \| string` | `0` | 方框间距 |
| `length` | `number` | `6` | 方框数量 |
| `focused` | `boolean` | `true` | 是否聚焦（显示光标） |
| `customClass` / `customStyle` | `string` | `''` | 根节点自定义类名 / 样式 |

## Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 值变化时 | `(value: string)` |
| `change` | 值变化时（同 tick） | `(value: string)` |
| `focus` / `blur` | 原生输入框聚焦 / 失焦 | `(event: Event)` |

## Slots

本组件不提供插槽。

## 主题变量

| 变量 | 用途 |
| --- | --- |
| ``--sn-mp-color-input-bg` / `-border` / `-border-focus` / `-text`` | 方框底色 / 边框 / 聚焦边框 / 文字 |
| ``--sn-mp-color-feedback-danger`` | 错误边框与文案 |
| ``--sn-mp-color-action-primary`` | 光标 |
| ``--sn-mp-color-text-tertiary`` | 提示文案 |
| ``--sn-mp-radius-md`` | 方框圆角 |
| ``--sn-mp-font-size-xl` / `-sm`` | 字形 / 文案字号 |

## 无障碍

- 方框行 `role="group"`，`aria-label` 为 "password, N of M"。
- 每个方框带 `aria-label`（digit N）。
- 原生输入框带 `aria-label="password"`，仅作为键盘来源。

## 暗色模式

所有颜色都通过 `--sn-mp-*` token 解析，没有浅色兜底。`.sn-theme-dark` / `page.sn-theme-dark` 下文字、底板、边框与状态色自动翻转。验证方式：

