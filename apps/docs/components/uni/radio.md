# Radio 单选框（uni 端 / 移动端）

跨 uni-app 多端的单选组件对：`sn-radio-group`（父，持有单值 `v-model`）+ `sn-radio`（子，`value` 为标识）。easycom 自动注册（同目录下 `sn-radio/`），几何值使用 `rpx`，颜色全部走 `--sn-mp-*` token。

子组件只在父组件内使用；标为「继承自 wd-radio-group」的属性声明为 `undefined`，未设置时从父组件读取。

## 基础用法

父组件用单值 `v-model`，子组件用 `value` 标识自己；`v-model` 为 `undefined` 表示未选中。

<Demo name="radio-mp-basic" description="sn-radio-group 单值 v-model + sn-radio value。" />

## 形状（`type`：`circle` / `dot` / `square` / `button`）

`type` 可设置在父组件（子组件继承）或单个子组件（覆盖父级）；`button` 形状会把整行变成胶囊块。

<Demo name="radio-mp-type" description="四种形状：circle / dot / square / button（button 配 direction=horizontal）。" />

## 状态（`allowUncheck` / `disabled` / `readonly` / `placement`）

`allowUncheck` 允许再次点击已选项取消选中（emit `undefined`）；`disabled` / `readonly` 都会真正拦住事件；`placement` 控制标记在文案的左侧或右侧。

<Demo name="radio-mp-states" description="allowUncheck 取消选中；整组 disabled / readonly；placement='right'。" />

## 颜色与自定义类名（`checkedColor` / `uncheckedColor` / `customLabelClass` / `customClass` / `customStyle`）

`checked-color` / `unchecked-color` 可在 group 上统一下发、也可在单个 `sn-radio` 上覆盖；`custom-label-class` 落在标签文本节点，`custom-class` / `custom-style` 落在根节点。

<Demo name="radio-mp-colors-custom" description="checkedColor / uncheckedColor 组级下发与单项覆盖；customLabelClass 落在标签节点；customClass / customStyle 落在根节点。" />

## Props（sn-radio）

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `string \| number \| boolean` | `''` | 本项的值，与父组件 `v-model` 匹配。 |
| `type` | `'circle' \| 'dot' \| 'square' \| 'button'` | 继承父级（`'circle'`） | 形状。 |
| `checkedColor` | `string` | 继承父级（`''`） | 选中颜色（CSS 颜色，内联覆盖）。 |
| `uncheckedColor` | `string` | 继承父级（`''`） | 未选中颜色。 |
| `disabled` | `boolean` | 继承父级（`false`） | 禁用当前项。 |
| `readonly` | `boolean` | 继承父级（`false`） | 只读当前项。 |
| `placement` | `'left' \| 'right'` | 继承父级（`'left'`） | 标记位置。 |
| `direction` | `'horizontal' \| 'vertical'` | 继承父级（`'vertical'`） | 布局方向。 |
| `customLabelClass` | `string` | `''` | label 自定义类名。 |
| `customClass` | `string` | `''` | 根节点类名。 |
| `customStyle` | `string` | `''` | 根节点 inline style。 |

## Props（sn-radio-group）

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| boolean \| undefined` | `undefined` | 当前选中值。 |
| `type` | `'circle' \| 'dot' \| 'square' \| 'button'` | `'circle'` | 子组件继承的形状。 |
| `checkedColor` / `uncheckedColor` | `string` | `''` | 子组件继承的颜色。 |
| `disabled` | `boolean` | `false` | 禁用整组。 |
| `readonly` | `boolean` | `false` | 整组只读。 |
| `placement` | `'left' \| 'right'` | `'left'` | 子组件继承的标记位置。 |
| `direction` | `'horizontal' \| 'vertical'` | `'vertical'` | 子组件布局方向。 |
| `allowUncheck` | `boolean` | `false` | 允许取消当前已选中的值。 |
| `customClass` / `customStyle` | `string` | `''` | 根节点转发。 |

## Events

| 事件名 | 组件 | 说明 | 参数 |
| --- | --- | --- | --- |
| `change` | sn-radio | 本项被选中（载荷为自身 `value`） | `(value)` |
| `update:modelValue` | sn-radio-group | 选中值变化（`allowUncheck` 取消时为 `undefined`） | `(value)` |
| `change` | sn-radio-group | 与 `update:modelValue` 同时触发 | `(value)` |

## Exposed API（sn-radio-group）

| 成员 | 签名 | 说明 |
| --- | --- | --- |
| `select` | `(value) => void` | 代码方式选中某个值。 |
| `isChecked` | `(value) => boolean` | 查询当前是否选中。 |

## Slots

| 插槽名 | 组件 | 说明 |
| --- | --- | --- |
| `default` | sn-radio | 文本内容。 |
| `default` | sn-radio-group | 子项列表。 |

## 主题变量

| 变量 | 用途 |
| --- | --- |
| `--sn-mp-color-control-unchecked` | 未选中圆环 |
| `--sn-mp-color-action-primary` | 选中圆环填充 |
| `--sn-mp-color-control-knob` | 内部圆点底板 |
| `--sn-mp-color-action-primary-soft` | 按钮态选中底色 |
| `--sn-mp-color-background-soft` | 按钮态背景 |
| `--sn-mp-color-text-primary` | 文本颜色 |

## 无障碍

- 根节点 `role="radio"`，`aria-checked` 为 `"true"` / `"false"`。
- `aria-disabled` / `aria-readonly` 反映继承后的实际状态。
- 禁用 / 只读时 `tabindex` 降为 `-1`。
- 父组件为 `role="radiogroup"`。

## 暗色模式

所有颜色通过 `--sn-mp-color-*` 解析，无浅色兜底。`.sn-theme-dark` / `page.sn-theme-dark` 下未选中圆环、选中填充、按钮态底色、文本颜色自动翻转。验证方式：

