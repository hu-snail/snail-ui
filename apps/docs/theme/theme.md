# Theme · Light / Dark

Theme 轴掌管 **颜色** 系统：text、background、border、action、feedback 颜色。

Theme 覆盖 primitive color + semantic color。它**不会**触及 radius、shadow、spacing 或字号（那些归 Style + Density）。

## 内置默认

```ts
import { LIGHT_THEME, DARK_THEME } from '@snui/tokens';
```

| Theme | 事实源 |
| --- | --- |
| `LIGHT_THEME` | 默认 — semantic.text.primary → `var(--aui-color-gray-900)` |
| `DARK_THEME` | semantic.text.primary → `var(--aui-color-gray-100)` |

## 切换 Theme 时的行为

```
Theme 切换
   ↓
保留 Style
   ↓
保留 Density
   ↓
重新解析 Token
```

按 AUI-PRD-v1.2.md §38：切换 Theme 时保留 Style 与 Density 轴。只重算颜色层。

## 自定义 Theme

```ts
import type { ThemeDefinition } from '@snui/tokens';

const brand: ThemeDefinition = {
  name: 'brand',
  primitive: {
    blue: {
      500: '#5b21b6', // 品牌紫
    },
  },
  semantic: {
    text: {
      primary: 'var(--aui-color-blue-500)',
    },
  },
};
```

当用户选择 `brand` 时，所有引用 `--aui-color-action-primary` 的组件会基于新 primitive 颜色重新渲染（`--aui-color-blue-500` 的绑定被替换），无需任何代码改动。

## Theme 不得做的事

| 禁止 | 原因 |
| --- | --- |
| 覆盖 radius / shadow / spacing | 属于 Style / Density |
| 引用 `window` / `document` / 全局状态 | Tokens 是纯数据 |
| 引用 Style 或 Density 轴 | 三轴互相独立 |

如果你发现自己想做上述事情，那其实是在设计 Style 或 Density——把它拆出来。

## Live 对比

下面两个 preview 用同一份 Button 分别挂载 LIGHT_THEME 与 DARK_THEME。Schema 完全一致，只有绑定表不同。

<script setup>
import ComponentPreview from '../.vitepress/components/ComponentPreview.vue';
</script>

<ComponentPreview name="button" variant="primary" text="Light theme" />

> Dark theme preview 在文档站支持夜间模式切换后即上线。契约完全一致，只是 resolver 输出不同。

## 下一步

- [Style（Modern / Glass / Minimal）](/theme/style)
- [Density（Compact / Comfortable）](/theme/density)
- [Token 级联](/theme/cascade)