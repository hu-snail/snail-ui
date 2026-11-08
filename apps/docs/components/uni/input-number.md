# InputNumber 计数器（uni 端 / 移动端）

`sn-input-number` 是 `@snui/uni`（移动端 / 小程序 / H5）的数字计数器：一个可编辑输入框加一对加减按钮。easycom 自动注册（`components/sn-input-number/sn-input-number.vue` → `<sn-input-number>`），几何值使用 `rpx`，颜色全部走 `--sn-mp-*` token。所有提交路径（按钮 / 输入 / 失焦）都经过同一套规范化：先夹进 `[min, max]`，再按 `stepStrictly` 对齐步进，最后按 `precision` 取整，然后询问 `beforeChange`。

## 基础用法

sn-input-number 基础计数器：min / max 边界、step 步进、precision 精度。

<Demo name="input-number-mp-basic" description="sn-input-number 基础计数器：min / max 边界、step 步进、precision 精度。" />

## 主题与状态（`theme` / `round` / `disabled` / `longPress`）

default / outline / outline-split / primary 四种主题；round 圆角；disabled 拦掉全部交互；longPress 按住连续加减。

<Demo name="input-number-mp-theme-state" description="default / outline / outline-split / primary 四种主题；round 圆角；disabled 拦掉全部交互；longPress 按住连续加减。" />
## 按钮与输入框独立开关（`disableInput` / `disableMinus` / `disablePlus` / `withoutInput` / `inputWidth`）

`disabled` 锁整个控件，这三个 `disable*` 只锁单个部分；`withoutInput` 只留加减按钮；`inputWidth` 调输入框宽度（数字按 rpx 设计值）。

<Demo name="input-number-mp-controls" description="disableInput / disableMinus / disablePlus；withoutInput 只留按钮；inputWidth。" />

## 取值规则与提交时机（`stepStrictly` / `allowNull` / `placeholder` / `beforeChange` / `immediateChange` / `updateOnInit` / `inputType` / `adjustPosition` / `custom*`）

`stepStrictly` 把值吸附到 `step` 网格；`allowNull` 允许输入框留空；`beforeChange` 可拦每次改动；`immediateChange=false` 只在失焦 / 按钮时提交；`updateOnInit` 挂载即纠正越界值；`inputType` / `adjustPosition` 透传给原生输入框；`customClass` / `customStyle` 挂根节点。

<Demo name="input-number-mp-commit-hooks" description="stepStrictly；allowNull + placeholder；beforeChange 拦截；immediateChange=false；updateOnInit；inputType；adjustPosition。" />

## 自定义样式（`customClass` / `customStyle`）

<Demo name="input-number-mp-custom-class" description="customClass 与 customStyle 两个挂载点。" />

## Props

| 属性                          | 类型                                                     | 默认值                    | 说明                               |
| ----------------------------- | -------------------------------------------------------- | ------------------------- | ---------------------------------- |
| `modelValue`                  | `number \| string`                                       | `0`                       | 绑定值                             |
| `min`                         | `number`                                                 | `1`                       | 最小值                             |
| `max`                         | `number`                                                 | `Number.MAX_SAFE_INTEGER` | 最大值                             |
| `step`                        | `number`                                                 | `1`                       | 步进值                             |
| `stepStrictly`                | `boolean`                                                | `false`                   | 是否严格按步进值对齐               |
| `precision`                   | `number \| string`                                       | `0`                       | 小数精度                           |
| `disabled`                    | `boolean`                                                | `false`                   | 禁用整个计数器                     |
| `disableInput`                | `boolean`                                                | `false`                   | 禁用输入框（按钮仍可用）           |
| `disableMinus`                | `boolean`                                                | `false`                   | 禁用减号按钮                       |
| `disablePlus`                 | `boolean`                                                | `false`                   | 禁用加号按钮                       |
| `withoutInput`                | `boolean`                                                | `false`                   | 不显示输入框，只保留按钮           |
| `inputWidth`                  | `number \| string`                                       | `undefined`               | 输入框宽度，数字按 rpx 设计值处理  |
| `allowNull`                   | `boolean`                                                | `false`                   | 允许值为空字符串                   |
| `placeholder`                 | `string`                                                 | `''`                      | 占位文本                           |
| `adjustPosition`              | `boolean`                                                | `true`                    | 键盘弹起时自动上推页面             |
| `beforeChange`                | `(value) => boolean \| Promise<boolean>`                 | `undefined`               | 变更前钩子，返回 false 阻止更新    |
| `longPress`                   | `boolean`                                                | `false`                   | 长按连续加减                       |
| `immediateChange`             | `boolean`                                                | `true`                    | 输入时立即提交；false 仅在失焦提交 |
| `updateOnInit`                | `boolean`                                                | `true`                    | 初始化时回写修正后的值             |
| `inputType`                   | `'number' \| 'digit'`                                    | `'digit'`                 | 输入框类型                         |
| `theme`                       | `'default' \| 'outline' \| 'outline-split' \| 'primary'` | `'default'`               | 主题风格                           |
| `round`                       | `boolean`                                                | `false`                   | 圆角样式                           |
| `customClass` / `customStyle` | `string`                                                 | `''`                      | 根节点自定义类名 / 样式            |

## Events

| 事件名              | 说明                          | 参数                        |
| ------------------- | ----------------------------- | --------------------------- |
| `update:modelValue` | 值变化时                      | `(value: number \| string)` |
| `change`            | 值变化时（与 update 同 tick） | `{ value }`                 |
| `focus`             | 输入框聚焦时                  | `{ value, height }`         |
| `blur`              | 输入框失焦时                  | `{ value }`                 |

## Slots

本组件不提供插槽。

## 主题变量

| 变量                                                        | 用途                    |
| ----------------------------------------------------------- | ----------------------- |
| `--sn-mp-color-background-soft`                             | 计数器底色              |
| `--sn-mp-color-background-elevated`                         | 按钮底板                |
| ``--sn-mp-color-text-primary` / `-secondary` / `-disabled`` | 数值 / 按钮 / 禁用      |
| ``--sn-mp-color-action-primary` / `-soft``                  | `primary` 主题填充      |
| `--sn-mp-color-text-on-primary`                             | `primary` 加号图标      |
| ``--sn-mp-color-border-default` / `-subtle``                | `outline` 边框 / 分割线 |
| ``--sn-mp-radius-md` / `-sm` / `-full``                     | 圆角                    |

## 无障碍

- 根节点 `role="group"` + `aria-disabled`。
- 加减按钮为 `role="button"`，带 `aria-label`（increase / decrease）；到边界时 `aria-disabled="true"` 且 `tabindex="-1"`。
- 输入框 `aria-label` 取 placeholder，否则为 "number input"。

## 暗色模式

所有颜色都通过 `--sn-mp-*` token 解析，没有浅色兜底。`.sn-theme-dark` 下文字、底板、边框与状态色自动翻转。验证方式：
