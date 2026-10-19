# Progress 进度条（Web 端）

展示操作或任务的当前进度，支持线形、环形与多环三种形态。

## 何时使用

- 需要展示某个任务的完成百分比（上传、加载、步骤执行等）。
- 处理中的任务需要流动条纹动画暗示「仍在进行」。
- 一组相关指标需要用多环 + 图例对照展示。

## 代码演示

### 基础用法

线形进度条默认在右侧显示百分比指示器，也支持放在轨道内部或上方。

<Demo name="progress-web-basic" description="线形 / 指示器位置 / 状态色 / 处理中条纹动画。" />

### 环形与多环

环形进度使用 SVG 圆环绘制，`offsetDegree` 控制起始角度；多环形态在下方渲染彩色图例。

<Demo name="progress-web-circle" description="环形 / 多环 + 图例 / 成功失败图标。" />

## API

### SnProgress Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| type | `'line' \| 'circle' \| 'multiple-circle'` | `'line'` | 进度条形态 |
| percentage | `number \| number[]` | `0` | 进度值，自动收敛到 0–100；多环形态传数组 |
| height | `number \| string` | `undefined` | 线形轨道高度，数字为 px |
| borderRadius | `number \| string` | `undefined` | 线形轨道圆角 |
| fillBorderRadius | `number \| string` | `undefined` | 线形填充圆角，缺省跟随 `borderRadius` |
| strokeWidth | `number` | `6` | 环形描边宽度（px） |
| indicatorPlacement | `'inside' \| 'outside' \| 'top'` | `'outside'` | 指示器位置（仅线形生效） |
| color | `string \| { color, stop? }[] \| (percentage) => string` | `undefined` | 填充色：纯色 / 渐变 / 函数，设置后覆盖 `status` 色 |
| railColor | `string \| { color, stop? }[]` | `undefined` | 轨道色 |
| showIndicator | `boolean` | `true` | 是否显示指示器 |
| status | `'default' \| 'success' \| 'error' \| 'info' \| 'warning'` | `'default'` | 状态，决定默认填充色与环形状态图标 |
| processing | `boolean` | `false` | 处理中：线形显示条纹动画，环形填充呼吸动画 |
| offsetDegree | `number` | `0` | 环形起始角度偏移（0 = 12 点方向） |

### SnProgress Slots

| Slot | 参数 | 说明 |
| --- | --- | --- |
| default | `{ percentage }` | 自定义指示器内容 |
| icon | — | 自定义环形成功 / 失败图标 |

无事件。状态色映射：success → `--sn-web-color-feedback-success`，error → danger，warning → warning，info → info，default → `--sn-web-color-action-primary`。度量：轨道高 8px、圆角 6px、环形描边 6px、环径 120px、指示器字号 14px。

## Tokens

| Token | 用途 |
| --- | --- |
| `--sn-web-color-action-primary` | 默认填充 |
| `--sn-web-color-feedback-success / -danger / -info / -warning` | 状态填充与状态图标 |
| `--sn-web-color-background-subtle` | 轨道色 |
| `--sn-web-color-text-secondary` | 指示器文字 |
| `--sn-web-color-text-on-primary` | 轨道内指示器文字 |

## 无障碍

- 线形 / 环形：根元素携带 `role="progressbar"` 与 `aria-valuemin` / `aria-valuemax` / `aria-valuenow`。
- 多环：根元素 `role="img"` + `aria-label` 汇总所有值。
- SVG 装饰部分均为 `aria-hidden="true"`。

## AI Patch 边界

- AI 可通过 Patch 修改 `percentage` / `status` / `type` / `color` 等展示属性。
- 指示器与图标支持插槽自定义；Patch 不应直接改写内部 SVG 结构。
- `percentage` 超出 0–100 会被收敛，不会报错，也不产生额外节点。

完整契约见组件 `ai-description.md`。
