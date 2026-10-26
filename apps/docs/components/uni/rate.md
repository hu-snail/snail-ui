# Rate 评分（uni 端 / 移动端）

`sn-rate` 是 `@snui/uni` 的评分组件：一排可点击的图标，支持半星、逐图标颜色、再次点击清空。easycom 自动注册（`components/sn-rate/sn-rate.vue` → `<sn-rate>`），几何值使用 `rpx`，颜色全部走 `--sn-mp-*` token。半星不是额外字形，而是把同一个图标裁到 50% 宽再叠在未选中图标上。

## 基础用法

sn-rate 基础评分：num 控制图标数量，tap 图标写回 v-model。

<Demo name="rate-mp-basic" description="sn-rate 基础评分：num 控制图标数量，tap 图标写回 v-model。" />

## 半星、可清空与颜色（`allowHalf` / `clearable` / `activeColor`）

allowHalf 允许半星；clearable 再次点击当前分数清空为 null；activeColor 支持逐图标数组；readonly 拦掉点击。

<Demo name="rate-mp-half-color" description="allowHalf 允许半星；clearable 再次点击当前分数清空为 null；activeColor 支持逐图标数组；readonly 拦掉点击。" />

## 间距、图标与整行铺满（`space` / `icon` / `activeIcon` / `iconPrefix` / `block`）

`space` 控制图标间距（数字按 rpx 设计值 ×2）；`icon` / `active-icon` 是 sn-icon 注册表名字；`icon-prefix` 仅为对齐保留；`block` 把图标均分整行。

<Demo name="rate-mp-icon-space" description="space 控制图标间距；icon / activeIcon 走 sn-icon 注册表；iconPrefix 仅为对齐；block 均分整行宽度。" />

## 自定义图标、禁用与根节点样式（`cssIcon` / `disabled` / `customClass` / `customStyle`）

`css-icon` 传字符串时把该 class 原样挂在字形节点上；布尔形式同时挂 `icon` 与 `active-icon`；`disabled` 拦掉点击；`custom-class` / `custom-style` 落在根节点。

<Demo name="rate-mp-css-icon-disabled" description="cssIcon 传字符串按裸类名渲染、布尔形式挂两个类名；disabled 拦掉点击；customClass / customStyle 落在根节点。" />

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `number \| null` | `null` | 当前分数 |
| `num` | `number` | `5` | 图标数量 |
| `readonly` | `boolean` | `false` | 只读 |
| `size` | `string \| number` | `undefined` | 图标尺寸（px 设计值） |
| `space` | `string \| number` | `undefined` | 图标间距（数字按 rpx） |
| `color` | `string` | `''` | 未选中颜色 |
| `activeColor` | `string \| string[]` | `''` | 选中颜色，支持逐图标数组 |
| `icon` / `activeIcon` | `string` | `'star'` | 未选中 / 选中图标名（注册表解析） |
| `iconPrefix` | `string` | `''` | 图标类名前缀（仅对齐 wot-ui） |
| `cssIcon` | `boolean \| string` | `false` | 把图标名当 CSS 类名使用 |
| `disabled` | `boolean` | `false` | 禁用 |
| `allowHalf` | `boolean` | `false` | 允许半选 |
| `clearable` | `boolean` | `false` | 再次点击当前分数清空为 null |
| `block` | `boolean` | `false` | 块级撑满整行 |
| `customClass` / `customStyle` | `string` | `''` | 根节点自定义类名 / 样式 |

## Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 分数变化时 | `(value: number \| null)` |
| `change` | 分数变化时（同 tick） | `{ value }` |

## Slots

本组件不提供插槽。

## 主题变量

| 变量 | 用途 |
| --- | --- |
| ``--sn-mp-color-feedback-warning`` | 默认选中色 |
| ``--sn-mp-color-text-disabled`` | 默认未选中色 |
| ``--sn-mp-spacing-2`` | 默认图标间距 |

## 无障碍

- 根节点 `role="slider"`，带 `aria-valuemin` / `aria-valuemax` / `aria-valuenow`，以及 `aria-readonly` / `aria-disabled`。
- 每个图标为 `role="button"`，带 `aria-pressed`；禁用 / 只读时 `tabindex` 降为 `-1`。

## 暗色模式

所有颜色都通过 `--sn-mp-*` token 解析，没有浅色兜底。`.sn-theme-dark` / `page.sn-theme-dark` 下文字、底板、边框与状态色自动翻转。验证方式：

