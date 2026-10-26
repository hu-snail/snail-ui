# 时间线 Timeline · Web（PC 端）

事件轨道：节点圆点 + 连接线，每项可带标题、正文、时间与语义色。

## 何时使用

- 版本发布、审批流、构建日志等按时间顺序展示的事件
- 需要语义色节点（成功 / 信息 / 警告 / 错误）
- 需要水平时间线或右置轨道

## 代码演示

### 基础用法

<Demo name="timeline-web-basic" description="type 语义色节点 + line-type 虚线段。" />

### 尺寸

<Demo name="timeline-web-size" description="size 加大标题，icon-size 放大节点。" />

### 轨道位置

<Demo name="timeline-web-item-placement" description="item-placement：left（默认）/ right。" />

### 水平时间线

<Demo name="timeline-web-horizontal" description="horizontal 横向排布。" />

### 自定义图标

<Demo name="timeline-web-customize-icon" description="icon 插槽替换节点圆点，color 自定义颜色。" />

## API

### SnTimeline Props

| 名称           | 类型                  | 默认值      | 说明                     |
| -------------- | --------------------- | ----------- | ------------------------ |
| horizontal     | `boolean`             | `false`     | 水平排布                 |
| item-placement | `'left' \| 'right'`   | `'left'`    | 轨道位置（水平模式忽略） |
| size           | `'medium' \| 'large'` | `'medium'`  | 标题字号（14 / 16px）    |
| icon-size      | `number`              | `undefined` | 节点边长（px，默认 14）  |

### SnTimeline Slots

| 名称    | 参数 | 说明                      |
| ------- | ---- | ------------------------- |
| default | `()` | `SnTimelineItem` 条目列表 |

### SnTimelineItem Props

| 名称      | 类型                                                       | 默认值      | 说明                                |
| --------- | ---------------------------------------------------------- | ----------- | ----------------------------------- |
| type      | `'default' \| 'success' \| 'info' \| 'warning' \| 'error'` | `'default'` | 节点语义色                          |
| title     | `string`                                                   | `undefined` | 标题，`header` 插槽可覆盖           |
| content   | `string`                                                   | `undefined` | 正文，`default` 插槽可覆盖          |
| time      | `string \| number`                                         | `undefined` | 时间元信息，`footer` 插槽可覆盖     |
| color     | `string`                                                   | `undefined` | 自定义节点颜色（圆环描边 / 图标色） |
| line-type | `'default' \| 'dashed'`                                    | `'default'` | 该节点之后的线型                    |

### SnTimelineItem Slots

| 名称    | 参数 | 说明                     |
| ------- | ---- | ------------------------ |
| default | `()` | 条目正文，覆盖 `content` |
| icon    | `()` | 自定义节点图标，替换圆点 |
| header  | `()` | 条目标题，覆盖 `title`   |
| footer  | `()` | 时间元信息，覆盖 `time`  |

最后一个条目不画轨道线；虚线为 10px 渐变短划。

完整契约见组件 `ai-description.md`。
