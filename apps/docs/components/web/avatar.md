# Avatar · Web（PC 端）

头像（对标 n-avatar）。图片 / 文字缩略 / 图标三态，加载失败自动 fallback。

## 基础用法

<Demo name="avatar-web-basic" description="src 图片 + 尺寸。" />

## 形状与颜色

<Demo name="avatar-web-shapes" description="round / circle / color。" />

## 失败回退

<Demo name="avatar-web-fallback" description="加载失败 → fallbackText / icon；换 src 自动复位。" />

## API

### SnAvatar Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| src | `string` | — | 图片地址 |
| size | `number \| 'small'\|'medium'\|'large'` | `'medium'` | 尺寸（28/34/40px） |
| round | `boolean` | `false` | 圆角 |
| circle | `boolean` | `false` | 圆形 |
| color | `string` | — | 背景色（fallbackText/icon 时） |
| objectFit | `'cover'\|'contain'\|'fill'\|'none'\|'scale-down'` | `'cover'` | 图片适配 |
| fallbackText | `string` | — | 无图/失败时文字缩略 |
| icon | `string` | — | SnIcon 注册名 |

事件：`error`；Slots：`default`（自定义内容，优先级最高）。fallback 链：slot → fallbackText → icon → 内置 SVG。

完整契约见组件 `ai-description.md`。
