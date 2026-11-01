# PasswordInput 密码输入框（uni 端 / 移动端）

`sn-password-input` 是 `@snui/uni` 的方框密码框：一个视觉隐藏的原生 `<input>` 驱动软键盘，可见部分是排成一行的 token 化方框。easycom 自动注册（`components/sn-password-input/sn-password-input.vue` → `<sn-password-input>`），几何值使用 `rpx`。光标是纯 CSS（静态 2rpx 竖条，仅在 `focused` 时显示），没有定时器，因此无需清理。

## 基础用法

方框密码框：`length` 控制格子数，`mask` 控制是否显示圆点，`focused` 与键盘显隐联动；默认 `gutter=8`（16rpx 格子间距），传 `gutter=0` 可回到贴合布局。

<Demo name="password-input-mp-basic" description="方框密码框：length 控制格子数，mask 控制是否显示圆点，focused 与键盘显隐联动。" />

## 格子形状（`shape`）

`shape='box'` 方框（默认）与 `shape='underline'` 下划线两种格子形状；聚焦 / 错误态边色自动跟随，`background` 在下划线形状下同样生效。

<Demo name="password-input-mp-shape" description="shape='box' 方框（默认）与 shape='underline' 下划线两种格子形状。" />

## 格子背景（`background`）

`background` 给格子自定义背景色：`var(--sn-mp-color-*)` token 或任意 CSS 色均可，落在 `--sn-password-input-box-bg`，暗色主题自动跟随。

<Demo name="password-input-mp-background" description="background 属性给格子自定义背景色（token 或任意 CSS 色均可）。" />

## 明文、错误态与间距（`mask` / `errorInfo` / `gutter`）

`mask=false` 显示明文；`errorInfo` 覆盖 `info` 并把边框切成危险色。默认 16rpx 格子间距，`gutter` 可调（显式传 0 回到贴合布局）。

<Demo name="password-input-mp-error-gutter" description="mask=false 显示明文；errorInfo 覆盖 info 并把边框切成危险色；默认 16rpx 格子间距，gutter 可调。" />

## 根节点自定义类名与样式（`customClass` / `customStyle`）

`custom-class` 追加在根节点上（与 `sn-password-input` 并列），`custom-style` 是根节点的内联样式；组件自己的 `gutter` / `background` 写的变量在前，`custom-style` 追加在后。几何 hook（`--sn-password-input-gap` / `-box-bg` / `-radius`）可由宿主任意祖先重指。

<Demo name="password-input-mp-custom-style" description="customClass 追加在根节点上；customStyle 追加在组件自身变量之后，可继续覆盖其它属性。" />

## Props

| 属性                          | 类型                   | 默认值  | 说明                            |
| ----------------------------- | ---------------------- | ------- | ------------------------------- |
| `modelValue`                  | `string`               | `''`    | 当前输入值                      |
| `mask`                        | `boolean`              | `true`  | 是否隐藏为圆点                  |
| `info` / `errorInfo`          | `string`               | `''`    | 提示 / 错误文案（错误优先）     |
| `gutter`                      | `number \| string`     | `8`     | 方框间距（16rpx；传 0 = 贴合）  |
| `shape`                       | `'box' \| 'underline'` | `'box'` | 格子形状（additive，§112.3a）   |
| `background`                  | `string`               | `''`    | 格子背景色（additive，§112.3a） |
| `length`                      | `number`               | `6`     | 方框数量                        |
| `focused`                     | `boolean`              | `true`  | 是否聚焦（显示光标）            |
| `customClass` / `customStyle` | `string`               | `''`    | 根节点自定义类名 / 样式         |

## Events

| 事件名              | 说明                  | 参数              |
| ------------------- | --------------------- | ----------------- |
| `update:modelValue` | 值变化时              | `(value: string)` |
| `change`            | 值变化时（同 tick）   | `(value: string)` |
| `focus` / `blur`    | 原生输入框聚焦 / 失焦 | `(event: Event)`  |

## Slots

本组件不提供插槽。

## 主题变量

| 变量                                                             | 用途                              |
| ---------------------------------------------------------------- | --------------------------------- |
| `--sn-password-input-gap` / `-box-bg` / `-radius`                | 组件局部 hook（prop 可重指）      |
| `--sn-mp-color-input-bg` / `-border` / `-border-focus` / `-text` | 方框底色 / 边框 / 聚焦边框 / 文字 |
| `--sn-mp-color-feedback-danger`                                  | 错误边框与文案                    |
| `--sn-mp-color-action-primary`                                   | 光标                              |
| `--sn-mp-color-text-tertiary`                                    | 提示文案                          |
| `--sn-mp-radius-md`                                              | 方框圆角（下划线形状为 0）        |
| `--sn-mp-font-size-xl` / `-sm`                                   | 字形 / 文案字号                   |

## 无障碍

- 方框行 `role="group"`，`aria-label` 为 "password, N of M"。
- 每个方框带 `aria-label`（digit N）。
- 原生输入框带 `aria-label="password"`，仅作为键盘来源。

## 暗色模式

所有颜色都通过 `--sn-mp-*` token 解析，没有浅色兜底。`.sn-theme-dark` 下文字、底板、边框与状态色自动翻转。验证方式：
