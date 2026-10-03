# Style · 风格轴

Style 轴掌管**形状个性**：圆角、阴影、Component Token。Style 不会触及颜色或尺寸 primitive。

## 内置默认

```ts
import { MODERN_STYLE } from '@snui/tokens'
```

| Style | 风格 |
| --- | --- |
| `MODERN_STYLE` | 6px 控件圆角，微妙阴影，平面 |
| `GLASS_STYLE` | （Phase 2）— 12px 圆角，浮起阴影，毛玻璃 |
| `MINIMAL_STYLE` | （Phase 2）— 0 圆角，无阴影，细线边框 |

## 端独立 Style

Web 端和 uni 端有各自的 Style 字段（但共用底层 `--aui-*`）：

- **Web Style**：`--sn-web-button-radius` / `--sn-web-card-shadow`
- **uni Style**：`--sn-mp-button-radius` / `--sn-mp-card-shadow`

切换 Style 不影响 Theme 与 Density。

## 自定义 Style

```ts
import type { StyleDefinition } from '@snui/tokens'

const glass: StyleDefinition = {
  name: 'glass',
  primitive: {
    radius: { md: '12px', lg: '16px' },
    shadow: { md: '0 12px 32px rgba(0,0,0,0.12)' },
  },
  component: {
    button: { radius: 'var(--aui-radius-lg)' },
    card: { radius: 'var(--aui-radius-lg)' },
  },
}
```

## Style 不得做的事

| 禁止 | 原因 |
| --- | --- |
| 覆盖颜色 token | 属于 Theme |
| 覆盖间距 / 尺寸 | 属于 Density |
| 与特定 Theme 强耦合 | 独立轴 |

## 下一步

- [Density · 紧凑 / 舒适](/theme/density)
- [Token 级联](/theme/cascade)
- [风格包](/style-packs/overview)