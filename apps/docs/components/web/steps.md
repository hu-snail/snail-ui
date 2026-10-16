# Steps 步骤条（Web 端）

`SnSteps` + `SnStep` 展示一个多步骤流程的进度：每个节点有标题、描述与状态，当前所处位置一目了然。

## 何时使用

- 一个流程被拆成若干有序阶段，用户需要知道自己在哪里。
- 表单分步填写，需要让用户理解整体结构。
- 需要在步骤间自由跳转（配合可点击节点）。

不适合：步骤之间没有先后关系时，用 `SnTabs`。

## 代码演示

### 基础用法

状态由 `current` 推导：之前的为完成、当前的进行中、之后的等待。

<Demo name="steps-web-basic" description="横向基础布局，状态随 current 推导" />

### 垂直布局

`vertical` 改为纵向排列。

<Demo name="steps-web-vertical" description="垂直方向的步骤条" />

### 尺寸

`size` 的两档对照。

<Demo name="steps-web-size" description="small 与 medium 两档对照" />

### 内容位置

`contentPlacement` 决定标题与描述相对指示器的位置。

<Demo name="steps-web-content-placement" description="right 与 bottom 两种内容位置" />

### 富文本内容

默认插槽接管步骤正文。

<Demo name="steps-web-content" description="默认插槽承载列表与结构化内容" />

### 自定义图标

`finish-icon` / `error-icon` / 单步 `icon` 三个替换点。

<Demo name="steps-web-custom-icon" description="完成/错误图标与单步图标替换" />

### 状态总览

四种状态并列展示。

<Demo name="steps-web-status" description="process / finish / error / wait 四态" />

### 可点击切换

`onUpdateCurrent` 让步骤可点击跳转。

<Demo name="steps-web-clickable" description="点击节点切换当前步骤" />

## API

### SnSteps Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `current` | `number` | `undefined` | 当前所处的步骤索引。 |
| `status` | `'process' \| 'finish' \| 'error' \| 'wait'` | `'process'` | 当前步骤的状态。 |
| `size` | `'small' \| 'medium'` | `'medium'` | 尺寸。 |
| `vertical` | `boolean` | `false` | 是否纵向排列。 |
| `contentPlacement` | `'right' \| 'bottom'` | `'right'` | 标题与描述的位置，仅在横向模式下生效。 |

### SnSteps Events

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `update:current` | `number` | 当前步骤变化。提供监听后步骤可点击切换。 |

### SnSteps Slots

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `default` | `()` | 步骤列表。 |
| `finish-icon` | `()` | 完成状态使用的图标。 |
| `error-icon` | `()` | 错误状态使用的图标。 |

### SnStep Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | `''` | 节点标题。 |
| `description` | `string` | `''` | 节点描述。 |
| `status` | `'process' \| 'finish' \| 'error' \| 'wait'` | `undefined` | 节点状态，覆盖父级推导结果。 |
| `disabled` | `boolean` | `false` | 是否禁止点击。 |

### SnStep Slots

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `default` | `()` | 步骤正文，替代 `description`。 |
| `icon` | `()` | 指示器内容，替代序号或状态图标。 |
| `title` | `()` | 步骤标题，替代 `title`。 |

## 状态解析顺序

步骤状态的判定优先级：

1. 节点自身显式设置的 `status`。
2. 由父级 `current` 推导：索引小于 `current` 为 `finish`；等于 `current` 时取父级 `status`；大于 `current` 为 `wait`。

## 可点击步骤

提供 `update:current` 监听后，未禁用的步骤变为可点击，点击会更新当前步骤。用 `disabled` 单独锁住某个节点。

## 无障碍

- 步骤条渲染为有序结构，指示器内的序号对屏幕阅读器可读。
- 可点击步骤为真实可聚焦元素，支持键盘触发。

## 已知取舍

- 激活步骤未设置 `aria-current="step"`，分组容器的 `role="list"` 与 `aria-label` 待补。
- 状态图标由 `SnIcon` 渲染，与本库图标策略一致。
