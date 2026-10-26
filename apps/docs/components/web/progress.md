# Progress 进度条（Web 端）

展示操作或任务的当前进度，支持线形、环形与多环三种形态。

## 何时使用

- 需要展示某个任务的完成百分比（上传、下载、步骤执行等）。
- 处理中的任务需要条纹动画或呼吸效果暗示「仍在进行」。
- 一组相关指标需要用多环 + 图例对照展示。

## 代码演示

### 线形与状态色

线形进度条默认在轨道右侧显示百分比指示器，`status` 决定填充色，`processing` 叠加滚动条纹。

<Demo name="progress-web-basic" description="线形 / 状态色 / 指示器位置 / 处理中条纹 / 自定义指示器。" />

### 指示器位置对照

`indicatorPlacement` 仅对线形生效：`outside` 在轨道右侧、`inside` 在填充内部、`top` 在轨道上方。`showIndicator` 为 `false` 时完全不渲染指示器。

<Demo name="progress-web-indicator" description="outside / inside / top 三种位置对照 + showIndicator 关闭 + default 插槽。" />

### 处理中与状态四态

`processing` 在线形上叠加滚动条纹，在环形上让填充弧呼吸；状态四态为 success / error / warning / info。环形的成功与失败状态默认显示内置图标，也可以用 `icon` 插槽替换。

<Demo name="progress-web-processing" description="processing 条纹与呼吸 / 状态四态 / icon 插槽自定义图标。" />

### 动态改变进度

通过步进按钮、滑块与自动推进定时器实时改变 `percentage`；达到 100% 时自动切换为成功态，回到 0 时切换为失败态。

<Demo name="progress-web-dynamic" description="按钮步进 / 滑块拖动 / 自动推进（定时器在组件卸载时清理）。" />

### 环形进度

环形使用 SVG 圆环绘制，`offsetDegree` 控制起始角度，`strokeWidth` 控制描边宽度。

<Demo name="progress-web-circle" description="环形 / 起始角度 / 成功与失败图标 / 多环 + 图例。" />

### 多环对照

`percentage` 传数组即进入多环形态；`color` 传颜色数组时按环序号取色（越界时复用最后一个颜色），并在下方渲染图例。

<Demo name="progress-web-multiple" description="多环百分比数组 + 按环取色 + 关闭图例。" />

## API

### Props

所有 Props 均为可选。

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| type | `'line' \| 'circle' \| 'multiple-circle'` | `'line'` | 进度条形态 |
| percentage | `number \| number[]` | `0` | 进度值，自动收敛到 0–100；多环形态传数组 |
| height | `number \| string` | `undefined` | 线形轨道高度，数字为 px |
| borderRadius | `number \| string` | `undefined` | 线形轨道圆角 |
| fillBorderRadius | `number \| string` | `undefined` | 线形填充圆角，缺省跟随 `borderRadius` |
| strokeWidth | `number` | `6` | 环形描边宽度（px） |
| indicatorPlacement | `'inside' \| 'outside' \| 'top'` | `'outside'` | 指示器位置（仅线形生效） |
| color | `string \| { color: string; stop?: number }[] \| (percentage: number) => string` | `undefined` | 填充色：纯色 / 渐变 / 函数；设置后覆盖 `status` 色 |
| railColor | `string \| { color: string; stop?: number }[]` | `undefined` | 轨道色 |
| showIndicator | `boolean` | `true` | 是否显示指示器与多环图例 |
| status | `'default' \| 'success' \| 'error' \| 'info' \| 'warning'` | `'default'` | 状态，决定默认填充色与环形状态图标 |
| processing | `boolean` | `false` | 处理中：线形显示条纹动画，环形填充弧呼吸 |
| offsetDegree | `number` | `0` | 环形起始角度偏移（0 = 12 点方向） |

### Slots

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| default | `{ percentage: number }` | 自定义指示器内容；多环形态下逐环调用 |
| icon | — | 自定义环形成功 / 失败图标 |

无事件。

状态色映射：success → `--sn-web-color-feedback-success`，error → danger，warning → warning，info → info，default → `--sn-web-color-action-primary`。度量：轨道高 8px、圆角 6px、环形描边 6px、环径 120px、多环相邻间隔 2px、指示器字号 14px。

## Tokens

| Token | 用途 |
| --- | --- |
| `--sn-web-color-action-primary` | 默认填充 |
| `--sn-web-color-feedback-success / -danger / -info / -warning` | 状态填充与状态图标 |
| `--sn-web-color-background-subtle` | 轨道色 |
| `--sn-web-color-text-secondary` | 指示器文字 |
| `--sn-web-color-text-on-primary` | 轨道内部的指示器文字 |

## 无障碍

- 线形 / 环形：根元素携带 `role="progressbar"` 与 `aria-valuemin` / `aria-valuemax` / `aria-valuenow`。
- 多环：根元素 `role="img"` + `aria-label` 汇总所有值。
- SVG 装饰部分均为 `aria-hidden="true"`。

## AI Patch Boundary

- AI 可通过 Patch 修改 `percentage` / `status` / `type` / `color` 等展示属性。
- 指示器与图标支持插槽自定义；Patch 不应直接改写内部 SVG 结构。
- `percentage` 超出 0–100 会被收敛，不会报错，也不产生额外节点。

完整契约见组件 `ai-description.md`。
