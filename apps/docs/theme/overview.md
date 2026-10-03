# Token 总览

snail-aui 的样式系统核心是 Token（设计变量）。组件不写硬编码颜色/间距/圆角——所有视觉属性通过 Token 引用。

## 三层级联

```text
Primitive   →  Semantic   →  Component   →  --sn-* 别名
原始值          语义名          组件级          品牌消费入口
```

唯一消费规则：**组件只能用 `var(--sn-*)` 变量**。

## 三轴独立

Token 系统有三个独立维度，互相不交叉：

| 轴 | 改什么 | 禁止改 |
|---|---|---|
| **Theme** | 颜色（Primitive + Semantic） | 圆角、间距、尺寸 |
| **Style** | 圆角 + 阴影 + Component Token | 颜色、间距、字号 |
| **Density** | 间距 + 尺寸 + 字号 | 颜色、圆角 |

切换 Theme 不影响组件形状；切换 Style 不影响颜色；切换 Density 不影响颜色或圆角。

## 默认值示例

| Token | 默认值 |
|---|---|
| `--sn-color-action-primary` | `#1677ff`（蓝色） |
| `--sn-color-text-primary` | `#18181b`（深灰） |
| `--sn-color-background-surface` | `#ffffff`（白） |
| `--sn-button-radius` | `6px` |
| `--sn-button-height-medium` | `36px` |
| `--sn-card-shadow` | `0 1px 3px rgba(0,0,0,0.08)` |

切换暗色主题时：

- `--sn-color-action-primary` 变为 `#3b82f6`（亮蓝）
- `--sn-color-background-surface` 变为 `#18181b`（深灰）
- 圆角和间距保持不变

切换 iOS 风格时：

- `--sn-button-radius` 变为 `12px`
- `--sn-button-shadow` 变为 `none`
- 颜色保持默认

## 完整 Token 名空间

### 颜色（Semantic）

```css
--sn-color-text-{primary, secondary, disabled, inverse, on-accent}
--sn-color-background-{surface, elevated, sunken, overlay, accent, subtle}
--sn-color-border-{subtle, default, strong, accent, focus}
--sn-color-action-{primary, primary-hover, primary-active, secondary, secondary-hover}
--sn-color-feedback-{success, warning, danger, info}
```

### 组件（Component）

```css
/* Button */
--sn-button-height-{tiny, small, medium, large}
--sn-button-padding-x
--sn-button-radius
--sn-button-font-size
--sn-button-shadow

/* Input */
--sn-input-height-{small, medium, large}
--sn-input-padding-x
--sn-input-radius

/* Card */
--sn-card-padding
--sn-card-radius
--sn-card-shadow

/* Focus ring */
--sn-focus-ring
```

## 下一步

- [Theme · 浅色 / 暗色](/theme/theme)
- [Style · 风格轴](/theme/style)
- [Density · 紧凑 / 舒适](/theme/density)
- [Token 级联](/theme/cascade)
- [风格包（Style Pack）](/style-packs/overview)