# Theme · 浅色 / 暗色

Theme 轴掌管**颜色**：Primitive 调色板 + Semantic 颜色名。

## 内置默认

```ts
import { LIGHT_THEME, DARK_THEME } from '@snui/tokens'
```

| Theme | 用途 |
| --- | --- |
| `LIGHT_THEME` | 浅色背景，深色文字（默认） |
| `DARK_THEME` | 深色背景，浅色文字 |

## 切换 Theme

```ts
import { snCssVars } from '@snui/tokens'

const el = document.createElement('style')
el.textContent = snCssVars({
  theme: DARK_THEME,    // ← 切换 Theme
  style: MODERN_STYLE,  // 保留 Style
  density: COMFORTABLE_DENSITY,  // 保留 Density
})
document.head.appendChild(el)
```

按 ADR-0002：切换 Theme 时保留 Style 与 Density，只重算颜色。

## 通过 data-theme 切换

snail-aui 还支持 CSS 原生的属性选择器方式：

```html
<html data-theme="dark">
```

```css
:root {
  --sn-color-action-primary: #1677ff;
}

[data-theme="dark"] {
  --sn-color-action-primary: #3b82f6;
}
```

这种方式适合 uni 小程序以外的环境（Web / H5）。

## 自定义 Theme

```ts
import type { ThemeDefinition } from '@snui/tokens'

const myBrand: ThemeDefinition = {
  name: 'my-brand',
  semantic: {
    action: {
      primary: '#ff5722',
      primaryHover: '#ff7043',
    },
    background: {
      surface: '#fffaf0',
    },
  },
}
```

应用后，所有 `var(--sn-color-action-primary)` 引用自动变成新值。

## Theme 不得做的事

| 禁止 | 原因 |
| --- | --- |
| 覆盖圆角 token | 属于 Style 轴 |
| 覆盖间距 / 尺寸 primitive | 属于 Density 轴 |
| 与特定 Style 绑定 | Theme 与 Style 是独立的两轴 |

## 下一步

- [Style · 风格轴](/theme/style)
- [Density · 紧凑 / 舒适](/theme/density)
- [Token 级联](/theme/cascade)