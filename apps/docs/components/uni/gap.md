# Gap 间隔槽（uni 端 / 移动端）

`sn-gap` 是 `@snui/uni`（移动端 / 小程序 / H5）的垂直间隔组件。移动端布局节奏常由显式间隔元素承担，而不是容器 margin —— 小程序 WXSS 对 `gap` 与 margin 折叠的支持并不一致。基于 easycom 自动注册。

## 基础用法

默认 14px，可传数字（按 px）或带单位的字符串：

<Demo name="gap-mp-basic" description="默认 14px 间隔；height=24 的数值间隔；height='20px' 带背景色的间隔。" />

## 底部安全区

`safeAreaBottom` 在间隔自身高度之外，额外叠加 `env(safe-area-inset-bottom)`：

<Demo name="gap-mp-safe-area" description="safeAreaBottom 为页面底部叠加手势条安全区，避免最后一行内容被遮挡。" />

用 `padding-bottom` 而非更高的盒子：间隔的 `height` 仍是调用方给的值，安全区叠加在它之上。`env()` 在不支持安全区的目标上回落为 `0px`，因此普通高度在任何环境都是下限。

## rpx 高度与自定义样式

`height` 传字符串时原样转发，因此可以直接写 `24rpx` 保持移动端节奏；`custom-class` / `custom-style` 落在根节点上：

<Demo name="gap-mp-custom" description="height=&quot;24rpx&quot; 字符串原样转发；数字仍按 px；customClass / customStyle 与 bg-color 叠加。" />

## 自动注册（easycom）

```vue
<sn-gap />
<sn-gap :height="24" />
<sn-gap height="40rpx" safe-area-bottom />
```

如需显式 import：

```ts
import { SnGap } from '@snui/uni/components/sn-gap/sn-gap.vue'
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `height` | `string \| number` | `14` | 间隔高度；数字按 px，字符串原样转发 |
| `bgColor` | `string` | `'transparent'` | 背景色；`transparent` 时不写内联背景 |
| `safeAreaBottom` | `boolean` | `false` | 是否叠加底部安全区 inset |
| `customClass` | `string` | `''` | 根节点自定义类名 |
| `customStyle` | `string` | `''` | 根节点自定义 inline style |

## Events

无。间隔槽是装饰元素。

## Slots

无。传入 default 插槽的内容不会被渲染 —— 带子节点的间隔元素属于布局容器，是另一个组件。

## 主题变量

无。间隔的几何来自 `height` 与可选的 safe-area inset，背景默认 `transparent`，因此没有颜色或间距 token 可消费。

这是刻意的：间隔槽必须继承页面底色，否则会在暗色模式下画出一条可见的浅色带。

## 无障碍

- `aria-hidden="true"` + `role="presentation"`：该元素不携带任何信息，不应进入无障碍树。
- 无交互，因此没有键盘契约。

## 暗色模式

`sn-gap` 不消费任何颜色 token，默认 `transparent` 背景直接继承页面底色，因此在 `.sn-theme-dark` 下无需额外处理。

需要注意的一点：如果给 `bgColor` 传了浅色字面量（例如 `#f4f4f5`），暗色下会保留该浅色 —— 这与组件无关，而是内联覆盖的语义。需要跟随主题时请传 `var(--sn-mp-color-*)`：

```vue
<sn-gap height="20px" bg-color="var(--sn-mp-color-background-subtle)" />
```

用 sn-config-provider 的 theme 设为 dark 包裹验证默认透明间隔：


## 相关

- 分隔线：[`sn-divider`](/components/uni/divider)
- 卡片容器：[`sn-card`](/components/uni/card)
