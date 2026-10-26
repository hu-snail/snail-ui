# Token 总览

snail-aui 的样式系统核心是 Token（设计变量）。组件不写硬编码颜色 / 间距 / 圆角 —— 所有视觉属性通过 Token 引用。

## 端独立 Token 架构（v3.1）

每端消费各自的 Token 别名：

```text
统一底层：@snui/tokens
   ↓  --aui-* CSS 变量（端无关原始层）
   ├──→  @snui/tokens-web    --sn-web-*    →  @snui/vue-web 消费
   └──→  @snui/tokens-mp     --sn-mp-*     →  @snui/uni 消费
```

- Web 端组件只能用 `var(--sn-web-*)` 变量
- uni 端组件只能用 `var(--sn-mp-*)` 变量
- 跨端 0 行源代码复用
- 底层 `--aui-*` 端无关

## 三层级联

```text
Primitive   →  Semantic   →  Component   →  --aui-* 原始层（统一）
原始值          语义名          组件级          （端无关）
   ↓
   @snui/tokens-web 生成 --sn-web-* 别名  →  Web 端消费
   @snui/tokens-mp  生成 --sn-mp-* 别名   →  uni 端消费（含 rpx）
```

## 三轴独立

Token 系统有三个独立维度：

| 轴 | 改什么 | 禁止改 |
|---|---|---|
| **Theme** | 颜色 | 圆角、间距、尺寸 |
| **Style** | 圆角 + 阴影 + Component Token | 颜色、间距、字号 |
| **Density** | 间距 + 尺寸 + 字号 | 颜色、圆角 |

切换 Theme 不影响组件形状；切换 Style 不影响颜色；切换 Density 不影响颜色或圆角。

## 默认值

| Token | 默认 |
|---|---|
| `--aui-color-action-primary` | `#1677ff` |
| `--aui-color-text-primary` | `#18181b` |
| `--aui-color-background-surface` | `#ffffff` |
| `--aui-button-radius` | `6px` → Web `--sn-web-button-radius: 6px` / uni `--sn-mp-button-radius: 24rpx` |
| `--aui-button-height-medium` | `36px` → Web `36px` / uni `72rpx` |
| `--aui-card-shadow` | `0 1px 3px rgba(0,0,0,0.08)` |

切换暗色主题：颜色变化，圆角间距不变。
切换 iOS 风格：圆角变大、阴影消失，颜色不变。

## 端专属 Token

不同端可有不同 Component Token 字段：

| 字段 | Web（`--sn-web-*`） | uni（`--sn-mp-*`） |
|---|---|---|
| `button-radius` | ✅ 6px | ✅ 24rpx |
| `table-row-height` | ✅ 32px | ❌（Web 桌面专属）|
| `list-item-height` | ❌ | ✅ 88rpx |
| `dropdown-item-padding` | ✅ 8px 16px | ❌ |
| `sidebar-item-height` | ❌ | ✅ 100rpx |

## 下一步

- [Theme · 浅色 / 暗色](/theme/theme)
- [Style · 形状轴](/theme/style)
- [Density · 紧凑 / 舒适](/theme/density)
- [Token 级联](/theme/cascade)
- [风格包（跨端共用）](/style-packs/overview)