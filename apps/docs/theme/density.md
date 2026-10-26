# Density · 紧凑 / 舒适

Density 轴掌管**尺寸密度**。不影响颜色或圆角。

## 内置默认

```ts
import { COMPACT_DENSITY, COMFORTABLE_DENSITY } from '@snui/tokens'
```

| Density | 用途 |
| --- | --- |
| `COMFORTABLE_DENSITY` | 默认 — 宽松间距，大尺寸 |
| `COMPACT_DENSITY` | 紧凑 — 信息密集场景 |

## 端独立的 Density 基准

Web 端和 uni 端 Density 预设映射到不同的 px / rpx 基准：

- **Web**：Density 输出 px 值（32px / 36px / 44px ...）
- **uni**：Density 通过 `@snui/tokens-mp` 自动转 rpx（64rpx / 72rpx / 88rpx ...）

切换 Density 保留 Theme 和 Style。

## 自定义 Density

```ts
import type { DensityDefinition } from '@snui/tokens'

const dense: DensityDefinition = {
  name: 'dense',
  primitive: {
    spacing: { '3': '4px', '4': '8px', '5': '12px' },
    size: { control: { sm: '20px', md: '28px', lg: '36px' } },
  },
}
```

## Density 不得做的事

| 禁止 | 原因 |
| --- | --- |
| 覆盖颜色 token | 属于 Theme |
| 覆盖圆角 / 阴影 | 属于 Style |
| 与特定 Theme / Style 强耦合 | 三轴独立 |

## 下一步

- [Token 级联](/theme/cascade)
- [风格包](/style-packs/overview)