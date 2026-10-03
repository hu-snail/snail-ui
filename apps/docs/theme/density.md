# Density · 紧凑 / 舒适

Density 轴掌管**尺寸密度**：间距、尺寸、字号。三轴独立，Density 不影响颜色或圆角。

## 内置默认

```ts
import { COMPACT_DENSITY, COMFORTABLE_DENSITY } from '@snui/tokens'
```

| Density | 用途 |
| --- | --- |
| `COMFORTABLE_DENSITY` | 默认 — 宽松间距、大尺寸，适合触屏 / 移动端 |
| `COMPACT_DENSITY` | 紧凑 — 缩小间距、控件高度，适合桌面端 / 信息密集场景 |

## 切换 Density 时的行为

```text
Density 切换
   ↓
保留 Theme
   ↓
保留 Style
   ↓
重新计算 Primitive size / spacing / fontSize
```

按 ADR-0002：Density 切换只重新计算尺寸相关的 primitive。

## 自定义 Density

```ts
import type { DensityDefinition } from '@snui/tokens'

const dense: DensityDefinition = {
  name: 'dense',
  primitive: {
    spacing: {
      '3': '4px',     // 原 default 8px
      '4': '8px',     // 原 default 12px
      '5': '12px',    // 原 default 16px
    },
    size: {
      control: {
        sm: '20px',
        md: '28px',
        lg: '36px',
      },
    },
    font: {
      size: {
        body: '13px',     // 原 default 14px
      },
    },
  },
}
```

应用 `dense` 后，按钮高度从 `36px` 变 `28px`，文字 `14px` 变 `13px`，间距全面缩紧。颜色和圆角保持不变。

## Density 不得做的事

| 禁止 | 原因 |
| --- | --- |
| 覆盖颜色 token | 属于 Theme |
| 覆盖圆角 / 阴影 | 属于 Style |
| 与特定 Theme / Style 强耦合 | 三轴独立 |

## 下一步

- [Token 级联](/theme/cascade)
- [风格包](/style-packs/overview)