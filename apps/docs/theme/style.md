# Style · Modern / Glass / Minimal

Style 轴掌管 **形状个性**：圆角、阴影、组件形状 token（button 圆角、card 内边距等）。

Style 不会触及颜色（那归 Theme）或尺寸 primitive（那归 Density）。

## 内置默认

```ts
import { MODERN_STYLE } from '@snui/tokens';
```

| Style | 风格 |
| --- | --- |
| `MODERN_STYLE` | 6px 控件圆角，微妙阴影，平面表面 |
| `GLASS_STYLE` | （Phase 2）— 12px 圆角，浮起阴影，毛玻璃 |
| `MINIMAL_STYLE` | （Phase 2）— 0 圆角，无阴影，细线边框 |

## 切换 Style 时的行为

```
Style 切换
   ↓
保留 Theme
   ↓
保留 Density
   ↓
重新计算 Component Token
```

按 AUI-PRD-v1.2.md §38：切换 Style 时保留 Theme 与 Density。只重算组件形状 token。

## 自定义 Style

```ts
import type { StyleDefinition } from '@snui/tokens';

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
};
```

应用 `glass` 后，Button 的 `--aui-button-radius` 从 `6px` 切换到 `16px`，阴影深度增加。颜色和间距保持不变。

## Style 不得做的事

| 禁止 | 原因 |
| --- | --- |
| 覆盖颜色 token | 属于 Theme |
| 覆盖间距 / 尺寸 primitive | 属于 Density |
| 与特定 Theme 强耦合 | Theme 与 Style 是独立的两轴 |

## Live 对比

<script setup>
import ComponentPreview from '../.vitepress/components/ComponentPreview.vue';
</script>

<ComponentPreview name="button" variant="primary" text="Modern" />

<ComponentPreview name="button" variant="primary" text="Modern · large" size="large" />

> Glass / Minimal 的 preview 会在相应样式实现后上线。契约面一致，只有 `component.*` 覆盖会变。

## 下一步

- [Density（Compact / Comfortable）](/theme/density)
- [Token 级联](/theme/cascade)
- [Theme（Light / Dark）](/theme/theme)