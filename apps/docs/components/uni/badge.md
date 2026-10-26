# Badge 徽标（uni 端 / 移动端）

`sn-badge` 是 `@snui/uni`（移动端 / 小程序 / H5）的角标组件，用于在图标、头像、Tab 上标注数量或状态。它包裹目标内容并自动锚定在右上角，宿主尺寸变化时角标不会漂移。基于 easycom 自动注册，几何值走 `rpx`。

## 基础用法

数值角标，配合 `max` 做溢出收敛：

<Demo name="badge-mp-basic" description="数值角标：普通数值、max 溢出显示 99+、五种语义类型。" />

## 形态与偏移

`isDot` 圆点、`shape` 三种形状、`border` 描边环、`top` / `right` 偏移：

<Demo name="badge-mp-shape" description="isDot 圆点；shape 圆 / 方 / 气泡；border 描边；top / right 偏移；bgColor 自定义底色。" />

## 显隐规则

角标的显示由四条规则决定，`hidden` 优先级最高：

<Demo name="badge-mp-visibility" description="value=0 默认不显示；showZero 显示 0；hidden 强制隐藏；数值变化实时反映。" />

规则顺序：

1. `hidden` 为 true → 不渲染角标。
2. `isDot` 为 true → 渲染圆点（不需要 `value`）。
3. `value` 为空或空字符串 → 不渲染角标。
4. `value === 0` 且 `showZero` 为 false → 不渲染角标。


## 根节点自定义类名与样式（`customClass` / `customStyle`）

两个 prop 都落在**包裹容器**（根节点）上，不是角标节点：`customClass` 追加根节点类名，`customStyle` 直接作为根节点 inline style。角标自身的外观（`type` / `bgColor` / `top` / `right` / `shape`）不受影响，需要改角标底色仍用 `bgColor`。

<Demo name="badge-mp-custom" description="customClass 给包裹容器加虚线框；customStyle 加内边距与底色；两者叠加；角标自身 type / bgColor / 偏移的对照。" />

## 自动注册（easycom）

```vue
<sn-badge :value="8">
  <sn-avatar text="AU" />
</sn-badge>
```

如需显式 import：

```ts
import { SnBadge } from '@snui/uni/components/sn-badge/sn-badge.vue'
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `string \| number` | `undefined` | 显示值；数字超出 `max` 时显示 `{max}+` |
| `max` | `number` | `undefined` | 溢出阈值，仅对数字 `value` 生效 |
| `top` | `string \| number` | `undefined` | 相对默认锚点向下偏移；数字按 px |
| `right` | `string \| number` | `undefined` | 相对默认锚点向左偏移；数字按 px |
| `isDot` | `boolean` | `false` | 圆点模式，不显示数值 |
| `hidden` | `boolean` | `false` | 隐藏角标（被包裹内容照常渲染） |
| `type` | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `undefined` | 角标颜色；不设置时用危险色（红） |
| `bgColor` | `string` | `''` | 角标背景色（内联覆盖） |
| `showZero` | `boolean` | `false` | 是否显示 `0` |
| `shape` | `'circle' \| 'square' \| 'bubble'` | `'circle'` | 徽标形状 |
| `border` | `boolean` | `false` | 是否显示描边环（用页面底色分隔） |
| `customClass` | `string` | `''` | 根节点自定义类名 |
| `customStyle` | `string` | `''` | 根节点自定义 inline style |

## Events

无。角标是装饰元素，点击事件属于被包裹的内容。

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 被锚定的内容（图标 / 头像 / 文本） |

## 主题变量

| 变量 | 用途 |
| --- | --- |
| `--sn-mp-color-action-primary` | `primary` 类型角标底色 |
| `--sn-mp-color-feedback-success` | `success` 类型 |
| `--sn-mp-color-feedback-warning` | `warning` 类型 |
| `--sn-mp-color-feedback-danger` | `danger` 类型（也是默认色） |
| `--sn-mp-color-feedback-info` | `info` 类型 |
| `--sn-mp-color-text-on-primary` | 角标文字色 |
| `--sn-mp-color-background-surface` | `border` 描边环颜色 |
| `--sn-mp-color-text-primary` | Doodle 皮肤描边 |
| `--sn-mp-font-size-xs` | 角标字号 |
| `--sn-mp-font-weight-{medium,bold}` | 角标字重 |
| `--sn-mp-radius-{sm,lg,full}` | 圆形 / 方形 / 气泡形状 |

## 无障碍

- 圆点模式给角标挂 `aria-hidden="true"`：一个纯圆点没有可播报的文本，暴露出来只会增加噪音。
- 数值角标保留在无障碍树中；被包裹元素应自行携带可访问名称。
- 无交互，因此没有键盘契约。

## 暗色模式

`sn-badge` 的填充色与文字色全部来自 `--sn-mp-color-*`，没有浅色兜底：

- 五种 `type` 的填充色在暗色下保持品牌色本身，白字对比度不受影响。
- `border` 描边环使用 `--sn-mp-color-background-surface`，暗色下该变量翻为近黑色，因此描边环在深色页面上依然是一圈可见的分隔线。
- `bgColor` 内联覆盖会被原样使用；如果传入浅色字面量，暗色下不会自动翻转 —— 这类覆盖请使用 `var(--sn-mp-*)`。

用 sn-config-provider 的 theme 设为 dark 包裹验证：


## 相关

- 标签文本：[`sn-tag`](/components/uni/tag)
- 头像：[`sn-avatar`](/components/uni/avatar)
