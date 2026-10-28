# 时间线 Timeline · Web（PC 端）

事件轨道：节点圆点 + 连接线，每项可带标题、正文、时间与语义色。支持纵向 / 横向、
`mode` 展示类型（left / right / alternate）与跨轴标签。

## 何时使用

- 版本发布、审批流、构建日志等按时间顺序展示的事件
- 需要语义色节点（成功 / 信息 / 警告 / 错误）或自定义节点
- 需要交替展示（alternate）、水平时间线或轴两侧标签

## 代码演示

### 基础用法

<Demo name="timeline-web-basic" description="type 语义色节点 + line-type 虚线段。" />

### 尺寸

<Demo name="timeline-web-size" description="size 加大标题，icon-size 放大节点。" />

### 自定义节点

<Demo name="timeline-web-customize-dot" description="dot-color / dot-type 设置节点颜色与实心/空心，dot 插槽直接传入 DOM（优先级最高）。" />

### 自定义轴线风格

<Demo name="timeline-web-customize-line" description="line-type：default 实线 / dashed 短划 / dotted 点线。" />

### 轨道位置

<Demo name="timeline-web-item-placement" description="item-placement：left（默认）/ right（兼容保留，推荐 mode）。" />

### 时间轴展示类型

<Demo name="timeline-web-mode" description="mode=alternate 按奇偶交替展示；TimelineItem 的 position 可固定某项的位置。" />

### 纵向时间轴（标签）

<Demo name="timeline-web-label" description="mode=alternate + label：标签（日期）显示在轴的对侧。" />

### 横向时间轴

<Demo name="timeline-web-horizontal" description="direction=horizontal；horizontal 模式下 mode 为 top / bottom / alternate。" />

### 标签文本位置

<Demo name="timeline-web-label-position" description="labelPosition：same 与内容同侧（紧贴轴），relative 在轴对侧（默认）。" />

### 自定义图标

<Demo name="timeline-web-customize-icon" description="icon 插槽替换节点圆点，color 自定义颜色。" />

## API

### SnTimeline Props

| 名称           | 类型                                          | 默认值       | 说明                                        |
| -------------- | --------------------------------------------- | ------------ | ------------------------------------------- |
| direction      | `'vertical' \| 'horizontal'`                  | `'vertical'` | 排布方向，设置后覆盖兼容的 `horizontal`     |
| mode           | `'left' \| 'right' \| 'top' \| 'bottom' \| 'alternate'` | `'left'` | 轨道（轴）所在的一侧，内容在轴的另一侧；alternate 按奇偶交替，横向读 top / bottom（离轴值自动归一） |
| label-position | `'same' \| 'relative'`                        | `'relative'` | 标签位置：relative 轴对侧，same 内容同侧紧贴轴 |
| horizontal     | `boolean`                                     | `false`      | 兼容保留：水平排布（推荐 `direction`）      |
| item-placement | `'left' \| 'right'`                           | `'left'`     | 兼容保留：轨道位置（推荐 `mode`）           |
| size           | `'medium' \| 'large'`                         | `'medium'`   | 标题字号（14 / 16px）                       |
| icon-size      | `number`                                      | `undefined`  | 节点边长（px，默认 14）                     |

### SnTimeline Slots

| 名称    | 参数 | 说明                      |
| ------- | ---- | ------------------------- |
| default | `()` | `SnTimelineItem` 条目列表 |

### SnTimelineItem Props

| 名称      | 类型                                                       | 默认值      | 说明                                     |
| --------- | ---------------------------------------------------------- | ----------- | ---------------------------------------- |
| type      | `'default' \| 'success' \| 'info' \| 'warning' \| 'error'` | `'default'` | 节点语义色                               |
| title     | `string`                                                   | `undefined` | 标题，`header` 插槽可覆盖                |
| content   | `string`                                                   | `undefined` | 正文，`default` 插槽可覆盖               |
| time      | `string \| number`                                         | `undefined` | 时间元信息，`footer` 插槽可覆盖          |
| dot-color | `string`                                                   | `undefined` | 自定义节点颜色（优先于 `color`）         |
| color     | `string`                                                   | `undefined` | 兼容保留：自定义节点颜色                 |
| dot-type  | `'solid' \| 'hollow'`                                      | `'solid'`   | 节点填充：实心圆点 / 空心圆环            |
| line-type | `'default' \| 'dashed' \| 'dotted'`                        | `'default'` | 该节点之后的线型                         |
| label     | `string`                                                   | `undefined` | 标签文本（如日期），`label` 插槽可覆盖   |
| position  | `'left' \| 'right' \| 'top' \| 'bottom'`                   | `undefined` | `mode=alternate` 时固定该项内容侧        |

### SnTimelineItem Slots

| 名称    | 参数 | 说明                             |
| ------- | ---- | -------------------------------- |
| default | `()` | 条目正文，覆盖 `content`         |
| dot     | `()` | 完全自定义节点 DOM，优先级最高   |
| icon    | `()` | 自定义节点图标（`dot` 优先）     |
| label   | `()` | 标签文本，覆盖 `label`           |
| header  | `()` | 条目标题，覆盖 `title`           |
| footer  | `()` | 时间元信息，覆盖 `time`          |

节点优先级：`dot` 插槽 > `icon` 插槽 > 圆点。最后一个条目不画轨道线。

完整契约见组件 `ai-description.md`。
