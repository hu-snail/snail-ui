# Theme · 浅色 / 暗色

Theme 轴掌管**颜色**。Theme 输出底层 `--aui-color-*` 原始变量，由每端别名包映射到 `--sn-{end}-color-*`。

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

// Web 端应用
snCssVars({
  end: 'web',
  theme: DARK_THEME,
  style: MODERN_STYLE,
  density: COMFORTABLE_DENSITY,
})

// uni 端应用
snCssVars({
  end: 'mp',
  theme: DARK_THEME,
  style: MODERN_STYLE,
  density: COMFORTABLE_DENSITY,
})
```

切换 Theme 时保留 Style 与 Density。

## 通过 data-theme 切换

```html
<html data-theme="dark">
```

```css
:root { --aui-color-action-primary: #1677ff; }
[data-theme="dark"] { --aui-color-action-primary: #3b82f6; }
```

## 自定义 Theme

```ts
import type { ThemeDefinition } from '@snui/tokens'

const myBrand: ThemeDefinition = {
  name: 'my-brand',
  semantic: { action: { primary: '#ff5722', primaryHover: '#ff7043' } },
}
```

## Theme 不得做的事

| 禁止 | 原因 |
| --- | --- |
| 覆盖圆角 token | 属于 Style 轴 |
| 覆盖间距 / 尺寸 | 属于 Density 轴 |
| 与特定 Style 绑定 | Theme 与 Style 独立 |

## 下一步

- [Style · 形状轴](/theme/style)
- [Density · 紧凑 / 舒适](/theme/density)
- [Token 级联](/theme/cascade)