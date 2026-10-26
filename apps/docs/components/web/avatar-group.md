# AvatarGroup 头像组（Web 端）

把多个头像叠放成组，溢出部分自动折叠为「+N」汇总头像。

## 何时使用

- 成员列表、协作编辑者、群聊等需要紧凑展示多个头像。
- 头像数量不确定，超出上限时需要「+N」收起。
- 点击「+N」时展开完整成员列表。

## 代码演示

### 基础头像组

默认收紧叠放（负 margin 重叠），也可以切换为逐个缩小的尺寸渐变布局。

<Demo name="avatar-group-web-basic" description="收紧叠放 / shrink 逐个缩小 / maxOptions 溢出折叠 + onExpand。" />

### 数量上限与展开回调

`maxOptions` 传 `{ max, onExpand }` 时，只渲染前 `max − 1` 个头像并追加「+k」汇总（k = 总数 − max + 1）；点击汇总触发 `onExpand`。只传数字时汇总为静态元素，不派发回调。

<Demo name="avatar-group-web-max" description="max / onExpand 点击汇总展示全部 + 纯数字上限对照。" />

### 尺寸渐变与收紧叠放

`sizeBehavior` 控制叠放方式：`tightening` 用负 margin 重叠且尺寸一致，`shrink` 让后续头像按步长缩小（最小 0.7）。`size` 只作用于「+k」汇总头像。

<Demo name="avatar-group-web-shrink" description="tightening 与 shrink 对照 + 汇总头像尺寸。" />

## API

### Props

所有 Props 均为可选。

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| maxOptions | `{ max: number; onExpand?: () => void } \| number` | `undefined` | 溢出控制：`max: n` 时显示前 `n − 1` 个头像 + 「+k」汇总（k = 总数 − n + 1）；点击汇总触发 `onExpand`，纯数字形式无点击回调 |
| size | `number \| 'small' \| 'medium' \| 'large'` | `'medium'` | 汇总头像尺寸；子头像尺寸由各自的 `SnAvatar` 决定 |
| sizeBehavior | `'tightening' \| 'shrink'` | `'tightening'` | `tightening` 负 margin 重叠；`shrink` 逐个缩小（每级 0.06，最小 0.7） |

### Slots

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| default | — | 头像列表，渲染 `SnAvatar` 元素（片段与嵌套数组会被展平，注释节点不计入） |

无事件（展开回调经 `maxOptions.onExpand` 传入）。插槽头像数量超过上限时，`+k` 汇总渲染为 `<button type="button">`（有回调时带 `aria-label` 并可点击），无回调时为静态元素。

## Tokens

| Token | 用途 |
| --- | --- |
| `--sn-web-color-background-surface` | 收紧叠放时的头像描边 |
| `--sn-web-color-background-subtle` | 汇总头像背景 |
| `--sn-web-color-text-secondary` | 汇总头像文字 |
| `--sn-web-focus-ring` | 展开按钮键盘焦点 |

## 无障碍

- 带 `onExpand` 的汇总头像渲染为 `<button type="button">`，`aria-label` 说明剩余头像数量；无回调时为静态元素。
- 子头像的无障碍语义由 `SnAvatar` 自身提供。

## AI Patch Boundary

- AI 可通过 Patch 修改 `maxOptions` / `size` / `sizeBehavior`。
- 成员列表属于业务数据；Patch 只应调整展示配置，不应直接增删插槽内容结构。
- 「+N」数量是运行时计算结果，Patch 不应试图直接写入。

完整契约见组件 `ai-description.md`。
