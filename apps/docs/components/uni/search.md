# Search 搜索框（uni 端 / 移动端）

跨 uni-app 多端的搜索输入框。easycom 自动注册（`components/sn-search/sn-search.vue` → `<sn-search>`），几何值使用 `rpx`，颜色全部走 `--sn-mp-*` token。组件只负责输入与事件，真正的查询由宿主在 `search` 事件里执行。

## 基础用法

`v-model` 绑定查询词；软键盘「搜索」键或右侧按钮触发 `search` 事件。

<Demo name="search-mp-basic" description="v-model 绑定 + search 事件。" />

## 变体（`variant`：`plain` / `filled` / `light`）

`plain`（默认）带边框；`filled` 使用浅底块；`light` 更浅，适合嵌在带色块里。

<Demo name="search-mp-variant" description="三种 variant：plain / filled / light。" />

## 取消文案与状态（`cancelTxt` / `hideCancel` / `placeholderLeft` / `disabled`）

`cancelTxt` 自定义右侧文案并触发 `cancel`；`hideCancel` 隐藏它；`placeholderLeft` 让占位符左对齐；`disabled` 阻断输入 / 搜索 / 取消 / 清空，只在根节点 emit `click`。

<Demo name="search-mp-cancel-states" description="cancelTxt + cancel 事件；hideCancel；placeholderLeft；disabled。" />

## 输入属性（`maxlength` / `focus` / `focusWhenClear` / `customInputClass`）

`maxlength` 限制字符数（`-1` 不限制）；`focus` 挂载即聚焦；`focus-when-clear` 保留清空后重新聚焦的开关；`custom-input-class` 追加到内部原生输入节点。

<Demo name="search-mp-input-attrs" description="maxlength 限制字符数；focus 挂载即聚焦；focusWhenClear 清空后重新聚焦；customInputClass 追加到内部输入节点。" />

## 占位文本与根节点样式（`placeholderStyle` / `placeholderClass` / `customClass` / `customStyle`）

`placeholder-style` 是内联声明串、`placeholder-class` 是占位伪元素的类名，两者只作用于占位文本；`custom-class` / `custom-style` 落在根包装节点。

<Demo name="search-mp-placeholder-style" description="placeholderStyle / placeholderClass 只作用于占位文本；customClass / customStyle 改根包装的外框与底色。" />

## Props

| 属性               | 类型                             | 默认值    | 说明                                 |
| ------------------ | -------------------------------- | --------- | ------------------------------------ |
| `modelValue`       | `string`                         | `''`      | 绑定查询词。                         |
| `customInputClass` | `string`                         | `''`      | 内层 `<input>` 类名。                |
| `placeholder`      | `string`                         | `'搜索'`  | 占位文本。                           |
| `cancelTxt`        | `string`                         | `'取消'`  | 右侧取消文案。                       |
| `variant`          | `'plain' \| 'filled' \| 'light'` | `'plain'` | 视觉变体。                           |
| `hideCancel`       | `boolean`                        | `false`   | 隐藏右侧取消文案。                   |
| `disabled`         | `boolean`                        | `false`   | 禁用，阻断所有交互事件。             |
| `maxlength`        | `number \| string`               | `-1`      | 最大长度，`-1` 不限制。              |
| `placeholderLeft`  | `boolean`                        | `false`   | 占位符左对齐（默认居中）。           |
| `focus`            | `boolean`                        | `false`   | 挂载即聚焦。                         |
| `focusWhenClear`   | `boolean`                        | `false`   | 清空后自动聚焦（uni 端为占位实现）。 |
| `placeholderStyle` | `string`                         | `''`      | 占位符内联样式。                     |
| `placeholderClass` | `string`                         | `''`      | 占位符样式类。                       |
| `customClass`      | `string`                         | `''`      | 根节点类名。                         |
| `customStyle`      | `string`                         | `''`      | 根节点 inline style。                |

## Events

| 事件名              | 说明                                   | 参数              |
| ------------------- | -------------------------------------- | ----------------- |
| `update:modelValue` | 输入时同步                             | `(value: string)` |
| `change`            | 内容变化（`update:modelValue` 的别名） | `(value: string)` |
| `search`            | 点击键盘搜索键                         | `(value: string)` |
| `cancel`            | 点击右侧取消文案                       | `(value: string)` |
| `clear`             | 点击 × 清空按钮                        | —                 |
| `focus`             | 聚焦                                   | `(event: Event)`  |
| `blur`              | 失焦                                   | `(event: Event)`  |
| `click`             | 禁用态下点击根节点                     | `(event: Event)`  |

## Slots

| 插槽名         | 说明                 |
| -------------- | -------------------- |
| `prefix`       | 输入框左侧外部内容。 |
| `input-suffix` | 输入框内部右侧内容。 |
| `suffix`       | 取消文案之后的内容。 |

## 主题变量

| 变量                               | 用途             |
| ---------------------------------- | ---------------- |
| `--sn-mp-color-input-bg`           | `plain` 输入框底 |
| `--sn-mp-color-input-text`         | 输入文字         |
| `--sn-mp-color-input-placeholder`  | 占位符           |
| `--sn-mp-color-input-border`       | 默认边框         |
| `--sn-mp-color-input-border-focus` | 聚焦边框         |
| `--sn-mp-color-background-soft`    | `filled` 底色    |
| `--sn-mp-color-background-subtle`  | `light` 底色     |
| `--sn-mp-color-action-primary`     | 取消文案颜色     |
| `--sn-mp-color-text-secondary`     | 搜索 / 清空图标  |
| `--sn-mp-radius-full`              | 胶囊圆角         |

## 无障碍

- 根节点 `role="search"`。
- 原生 `<input type="text">` 带 `confirm-type="search"`。
- `aria-label` 默认取 `placeholder`；`disabled` 时设置 `aria-disabled`。
- × 按钮是装饰节点（`aria-hidden`），禁用时 `tabindex` 降为 `-1`。

## 暗色模式

所有颜色通过 `--sn-mp-color-*` 解析，无浅色兜底。`.sn-theme-dark` 下输入框底、边框、占位符、取消文案颜色会自动翻转。验证方式：
