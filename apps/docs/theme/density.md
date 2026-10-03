# Density · Compact / Comfortable

Density 轴掌管 **尺寸**：控件高度、内边距、字号、行高。

Density 不会触及 token（那归 Style）或颜色（那归 Theme）。

## 内置默认

```ts
import { COMPACT_DENSITY, COMFORTABLE_DENSITY } from '@snui/tokens';
```

| Density | 样例差值 |
| --- | --- |
| `COMPACT_DENSITY` | `--aui-spacing-4: 10px`（原 12px），`--aui-size-control-md: 20px`（原 32px） |
| `COMFORTABLE_DENSITY` | 默认 — 不覆盖 |

## 切换 Density 时的行为

```
Density 切换
   ↓
保留 Theme
   ↓
保留 Style
   ↓
只重算尺寸类 Token
```

按 AUI-PRD-v1.2.md §38：切换 Density 时保留 Theme 与 Style。只重算尺寸 primitive。

## 自定义 Density

```ts
import type { DensityDefinition } from '@snui/tokens';

const cozy: DensityDefinition = {
  name: 'cozy',
  primitive: {
    spacing: {
      '3': '10px',
      '4': '14px',
      '5': '18px',
    },
    size: {
      control: { sm: '28px', md: '36px', lg: '44px' },
    },
    font: {
      size: { md: '15px' },
    },
  },
};
```

`cozy` 介于 `compact` 与 `comfortable` 之间。它不会动任何颜色 / 圆角 token。

## Density 不得做的事

| 禁止 | 原因 |
| --- | --- |
| 覆盖颜色 token | 属于 Theme |
| 覆盖圆角 / 阴影 | 属于 Style |
| 与特定 Style 强耦合 | Style 与 Density 是独立的两轴 |

## Live 对比

<script setup>
import ComponentPreview from '../.vitepress/components/ComponentPreview.vue';
</script>

<ComponentPreview name="button" variant="primary" size="medium" text="Comfortable · medium" />

> Compact density 的 preview 在文档站支持 density 切换后即上线。契约面一致，只有 primitive `spacing` / `size` 覆盖会变。

## 下一步

- [Token 级联](/theme/cascade)
- [Theme（Light / Dark）](/theme/theme)
- [Style（Modern / Glass / Minimal）](/theme/style)