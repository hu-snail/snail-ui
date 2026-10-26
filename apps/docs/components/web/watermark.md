# Watermark 水印（Web 端）

在页面或指定区域上平铺文字 / 图片水印，用于标记版权、抑制截图扩散或标注敏感信息。

## 何时使用

- 需要在整个页面或某个内容区平铺版权 / 归属信息。
- 内部系统、报表页面需要标注「内部资料」等敏感提示。
- 全屏模式可覆盖视口，适合对话框、播放器等浮层场景。

## 代码演示

### 基础水印

默认包裹内容并在其上平铺水印，`rotate` / `opacity` 控制倾斜与浓度。

<Demo name="watermark-web-basic" description="包裹内容平铺 / 旋转与透明度。" />

### 多行文案与交错瓦片

`content` 传数组时每项一行，行距由 `lineHeight` 控制；`cross` 让相邻瓦片错开半个瓦片高度。

<Demo name="watermark-web-content" description="content 多行文本数组 / cross 交错对照。" />

### 样式定制

`fontSize` / `lineHeight` / `rotate` / `opacity` / `fontColor` / `fontWeight` 可实时调整，文字始终以瓦片中心旋转。

<Demo name="watermark-web-style" description="fontSize / rotate / opacity / fontColor 实时定制。" />

### 全屏水印

`fullscreen` 时水印覆盖整个视口（fixed 定位），不包裹任何内容；`zIndex` 控制覆盖层层级。

<Demo name="watermark-web-fullscreen" description="fullscreen 全屏覆盖 + zIndex。" />

## API

### Props

所有 Props 均为可选。

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| content | `string \| string[]` | `undefined` | 水印文字；数组时每项一行，空字符串不绘制文字 |
| image | `string` | `undefined` | 水印图片地址；设置后替代文字绘制 |
| cross | `boolean` | `false` | 相邻瓦片交错排布（错开半个瓦片） |
| fullscreen | `boolean` | `false` | 覆盖整个视口而非包裹内容 |
| fontSize | `number` | `16` | 文字大小（px） |
| lineHeight | `number` | `16` | 文字行高（px） |
| width | `number` | `128` | 瓦片宽度（px） |
| height | `number` | `64` | 瓦片高度（px） |
| rotate | `number` | `0` | 瓦片旋转角度（度） |
| x | `number` | `0` | 瓦片内水平偏移（px） |
| y | `number` | `0` | 瓦片内垂直偏移（px） |
| zIndex | `number` | `10` | 覆盖层层级 |
| opacity | `number` | `0.5` | 覆盖层透明度（0–1） |
| fontFamily | `string` | `undefined` | 水印文字字体 |
| fontWeight | `number \| string` | `undefined` | 水印文字字重 |
| fontStyle | `'normal' \| 'italic' \| 'oblique'` | `undefined` | 水印文字样式 |
| fontColor | `string` | `undefined` | 水印文字颜色 |
| background | `string` | `undefined` | 瓦片背景色 |
| grayscale | `number` | `0` | 覆盖层灰度（CSS filter，0–1） |
| blend | `CSSProperties['mixBlendMode']` | `undefined` | 覆盖层混合模式（CSS mix-blend-mode） |

### Slots

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| default | — | 被水印覆盖的内容；`fullscreen` 时不渲染 |

无事件。

实现说明：单瓦片在离屏 canvas 上绘制后转成覆盖层的重复背景图，覆盖层为 `pointer-events: none`；无 canvas 环境（SSR / 测试）自动降级为同样几何的重复文本网格。因此 `fontColor` / `background` 需要传真实 CSS 颜色值（`var(...)` 变量无法被 canvas 解析）。

## Tokens

组件完全由 props 驱动（canvas 绘制颜色与降级文本颜色均来自 props），不消费主题 token。

## 无障碍

- 覆盖层 `aria-hidden="true"` 且 `pointer-events: none`，纯装饰、不拦截交互。
- 水印文字不进入无障碍树；重要信息请用真实页面内容承载。

## AI Patch Boundary

- AI 可通过 Patch 修改 `content` / `opacity` / `rotate` / `zIndex` 等展示属性。
- 水印不影响内容的可访问性语义；Patch 不应把关键业务信息只放在水印里。
- 瓦片由内部 canvas / 文本网格渲染；Patch 不应直接改写覆盖层节点。

完整契约见组件 `ai-description.md`。
