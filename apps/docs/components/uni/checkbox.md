# Checkbox 复选框（uni 端 / 移动端）

跨 uni-app 多端的复选组件对：`sn-checkbox-group`（父，持有数组 `v-model`）+ `sn-checkbox`（子，`name` 为标识）。easycom 自动注册（同目录下 `sn-checkbox/`），几何值使用 `rpx`，颜色全部走 `--sn-mp-*` token。

子组件里所有标为「继承自 CheckboxGroup」的属性都声明为 `undefined`，未设置时从父组件读取 —— 与 wot-ui 的继承契约一致。

## 基础用法

父组件用数组 `v-model`，子组件用 `name` 标识自己。

<Demo name="checkbox-mp-basic" description="sn-checkbox-group 数组 v-model + sn-checkbox name。" />

## 形状（`type`：`circle` / `square` / `button` / `dot`）

`type` 可设置在父组件（子组件继承）或单个子组件（覆盖父级）。

<Demo name="checkbox-mp-type" description="四种形状：circle / square / button / dot。" />

## 数量限制与状态（`min` / `max` / `disabled` / `readonly` / `indeterminate` / `toggleAll`）

`max > 0` 时超出不再选中；`min > 0` 时低于下限不再取消。`indeterminate` 为半选态（样式优先级最高，`aria-checked="mixed"`）。父组件 expose 了 `toggle` / `toggleAll` / `isChecked`，可通过 ref 调用。

<Demo name="checkbox-mp-group-limits" description="min/max 限制；整组 disabled / readonly；indeterminate 半选；toggleAll 全选 / 全不选。" />

## 独立用法与剩余属性（`v-model` / `trueValue` / `falseValue` / `checkedColor` / `size` / `placement` / `maxWidth`）

不在 group 内时 `v-model` 直接生效，`true-value` / `false-value` 可自定义取值；`checked-color` / `unchecked-color`、`size="large"`、`placement="right"`、`max-width` + `custom-label-class`、`custom-class` / `custom-style` 各自独立生效。

<Demo name="checkbox-mp-standalone-style" description="独立 v-model 与 trueValue / falseValue；checkedColor / uncheckedColor；size large、placement right；maxWidth + customLabelClass；customClass / customStyle。" />

## Props（sn-checkbox）

| 属性               | 类型                                        | 默认值                   | 说明                             |
| ------------------ | ------------------------------------------- | ------------------------ | -------------------------------- |
| `modelValue`       | `string \| number \| boolean`               | `false`                  | 单独使用时的绑定值。             |
| `name`             | `string \| number \| boolean`               | `''`                     | 组内唯一标识。                   |
| `type`             | `'circle' \| 'square' \| 'button' \| 'dot'` | 继承父级（`'circle'`）   | 形状。                           |
| `checkedColor`     | `string`                                    | 继承父级（`''`）         | 选中颜色（CSS 颜色，内联覆盖）。 |
| `uncheckedColor`   | `string`                                    | 继承父级（`''`）         | 未选中颜色。                     |
| `disabled`         | `boolean`                                   | 继承父级（`false`）      | 禁用当前项。                     |
| `readonly`         | `boolean`                                   | 继承父级（`false`）      | 只读当前项。                     |
| `indeterminate`    | `boolean`                                   | `false`                  | 半选状态。                       |
| `trueValue`        | `string \| number \| boolean`               | `true`                   | 单独使用时的选中值。             |
| `falseValue`       | `string \| number \| boolean`               | `false`                  | 单独使用时的非选中值。           |
| `size`             | `'large' \| undefined`                      | 继承父级                 | 尺寸。                           |
| `placement`        | `'left' \| 'right'`                         | 继承父级（`'left'`）     | 勾选图标位置。                   |
| `direction`        | `'horizontal' \| 'vertical'`                | 继承父级（`'vertical'`） | 布局方向。                       |
| `maxWidth`         | `string`                                    | `''`                     | 文本最大宽度。                   |
| `customLabelClass` | `string`                                    | `''`                     | label 自定义类名。               |
| `customClass`      | `string`                                    | `''`                     | 根节点类名。                     |
| `customStyle`      | `string`                                    | `''`                     | 根节点 inline style。            |

## Props（sn-checkbox-group）

| 属性                              | 类型                                        | 默认值       | 说明                       |
| --------------------------------- | ------------------------------------------- | ------------ | -------------------------- |
| `modelValue`                      | `Array<string \| number \| boolean>`        | `[]`         | 选中值数组。               |
| `type`                            | `'circle' \| 'square' \| 'button' \| 'dot'` | `'circle'`   | 子组件继承的形状。         |
| `checkedColor` / `uncheckedColor` | `string`                                    | `''`         | 子组件继承的颜色。         |
| `disabled`                        | `boolean`                                   | `false`      | 禁用全部选项。             |
| `readonly`                        | `boolean`                                   | `false`      | 只读全部选项。             |
| `min`                             | `number`                                    | `0`          | 最小可选数量，`0` 不限制。 |
| `max`                             | `number`                                    | `0`          | 最大可选数量，`0` 不限制。 |
| `size`                            | `'large' \| undefined`                      | `undefined`  | 子组件继承的尺寸。         |
| `placement`                       | `'left' \| 'right'`                         | `'left'`     | 子组件继承的图标位置。     |
| `direction`                       | `'horizontal' \| 'vertical'`                | `'vertical'` | 子组件布局方向。           |
| `customClass` / `customStyle`     | `string`                                    | `''`         | 根节点转发。               |

## Events

| 事件名              | 组件              | 说明                            | 参数             |
| ------------------- | ----------------- | ------------------------------- | ---------------- |
| `update:modelValue` | sn-checkbox       | 单独使用时的绑定值变化          | `(value)`        |
| `change`            | sn-checkbox       | 切换（组内时载荷为 `name`）     | `(value)`        |
| `update:modelValue` | sn-checkbox-group | 选中数组变化                    | `(value: Array)` |
| `change`            | sn-checkbox-group | 与 `update:modelValue` 同时触发 | `(value: Array)` |

## Exposed API（sn-checkbox-group）

| 成员        | 签名                                                 | 说明                        |
| ----------- | ---------------------------------------------------- | --------------------------- |
| `toggle`    | `(name, nextChecked: boolean) => void`               | 应用单项选中变化。          |
| `toggleAll` | `(checked: boolean, skipDisabled?: boolean) => void` | 全选 / 全不选已注册的子项。 |
| `isChecked` | `(name) => boolean`                                  | 查询当前是否选中。          |

## Slots

| 插槽名    | 组件              | 说明                                 |
| --------- | ----------------- | ------------------------------------ |
| `default` | sn-checkbox       | 文本内容。                           |
| `icon`    | sn-checkbox       | 自定义图标，作用域 `{ isChecked }`。 |
| `default` | sn-checkbox-group | 子项列表。                           |

## 主题变量

| 变量                                | 用途                    |
| ----------------------------------- | ----------------------- |
| `--sn-mp-color-control-unchecked`   | 未选中边框 / 圆环       |
| `--sn-mp-color-action-primary`      | 选中底板 / 按钮态选中边 |
| `--sn-mp-color-action-primary-soft` | 按钮态选中底色          |
| `--sn-mp-color-control-knob`        | 勾选图标底板            |
| `--sn-mp-color-text-on-primary`     | 勾选图标描边            |
| `--sn-mp-color-text-primary`        | 文本颜色                |
| `--sn-mp-color-background-soft`     | 按钮态背景              |

## 无障碍

- 根节点 `role="checkbox"`，`aria-checked` 为 `"true"` / `"false"` / `"mixed"`（`indeterminate` 时为 `mixed`）。
- `aria-disabled` / `aria-readonly` 反映继承后的实际状态。
- 禁用 / 只读时 `tabindex` 降为 `-1`。
- 父组件为 `role="group"`。

## 暗色模式

所有颜色通过 `--sn-mp-color-*` 解析，无浅色兜底。`.sn-theme-dark` 下未选中边框、选中底板、按钮态底色、文本颜色自动翻转。验证方式：
