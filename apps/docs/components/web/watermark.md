# Watermark 水印（Web 端）

在页面或指定区域上平铺文字 / 图片水印，用于标记版权、防截图扩散或标注敏感信息。

## 何时使用

- 需要在整个页面或某个内容区平铺版权 / 归属信息。
- 内部系统、报表页面需要标注「内部资料」等敏感提示。
- 全屏模式可覆盖视口，适合对话框、播放器等浮层场景。

## 代码演示

### 基础用法

默认包裹内容并在其上平铺水印；多行文案传入数组。`cross` 让相邻瓦片交错排布。

<Demo name="watermark-web-basic" description="包裹内容平铺 / 多行文案 / 交错瓦片 / 旋转与透明度。" />

### 全屏水印

`fullscreen` 时水印覆盖整个视口（fixed + teleport 到 body），不包裹任何内容。

<Demo name="watermark-web-fullscreen" description="fullscreen 全屏覆盖 + zIndex。" />

## API

### SnWatermark Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| content | `string \| string[]` | — | 水印文字；数组每项一行 |
| image | `string` | — | 水印图片地址（替代文字） |
| cross | `boolean` | `false` | 相邻瓦片交错排布 |
| fullscreen | `boolean` | `false` | 覆盖整个视口 |
| fontSize | `number` | `16` | 文字大小（px） |
| lineHeight | `number` | `16` | 文字行高（px） |
| width | `number` | `128` | 瓦片宽度（px） |
| height | `number` | `64` | 瓦片高度（px） |
| rotate | `number` | `0` | 瓦片旋转角度 |
| x | `number` | `0` | 瓦片内水平偏移（px） |
| y | `number` | `0` | 瓦片内垂直偏移（px） |
| zIndex | `number` | `10` | 覆盖层层级 |
| opacity | `number` | `0.5` | 覆盖层透明度（0–1） |
| fontFamily | `string` | — | 文字字体 |
| fontWeight | `number \| string` | — | 文字字重 |
| fontStyle | `'normal' \| 'italic' \| 'oblique'` | — | 文字样式 |
| fontColor | `string` | — | 文字颜色 |
| background | `string` | — | 瓦片背景色 |
| grayscale | `number` | `0` | 覆盖层灰度（CSS filter，0–1） |
| blend | `CSSProperties['mixBlendMode']` | — | 覆盖层混合模式（CSS mix-blend-mode） |

### SnWatermark Slots

| Slot | 说明 |
| --- | --- |
| default | 被水印覆盖的内容（`fullscreen` 时忽略） |

无事件。实现：单瓦片离屏 canvas 绘制 → `toDataURL` 作为覆盖层 `background-image` 平铺（`pointer-events: none`）。无 canvas 环境（SSR / 测试）自动降级为重复文本网格。

## Tokens

组件完全由 props 驱动（canvas 绘制颜色与降级文本颜色均来自 props），不消费主题 token。

## 无障碍

- 覆盖层 `aria-hidden="true"` 且 `pointer-events: none`，纯装饰、不拦截交互。
- 水印文字不进入无障碍树；重要信息请用真实页面内容承载。

## AI Patch 边界

- AI 可通过 Patch 修改 `content` / `opacity` / `rotate` / `zIndex` 等展示属性。
- 水印不影响内容的可访问性语义；Patch 不应把关键业务信息只放在水印里。
- `fullscreen` 通过 Teleport 挂载到 body；Patch 不应直接操作 Teleport 节点。

完整契约见组件 `ai-description.md`。
