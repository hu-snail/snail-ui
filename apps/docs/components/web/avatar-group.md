# AvatarGroup 头像组（Web 端）

把多个头像叠放成组，溢出部分自动折叠为「+N」汇总头像。

## 何时使用

- 成员列表、协作编辑者、群聊等需要紧凑展示多个头像。
- 头像数量不确定，超出上限时需要「+N」收起。
- 点击「+N」时展开完整成员列表。

## 代码演示

### 基础用法

默认收紧叠放（负 margin 重叠）；设置 `maxOptions` 后超出部分折叠为「+N」汇总头像，点击触发 `onExpand`。

<Demo name="avatar-group-web-basic" description="收紧叠放 / shrink 逐个缩小 / maxOptions 溢出折叠 + onExpand。" />

## API

### SnAvatarGroup Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| maxOptions | `{ max: number; onExpand?: () => void } \| number` | — | 溢出控制：`max: n` 时显示前 `n − 1` 个头像 + 「+k」汇总（k = 总数 − n + 1）；点击汇总触发 `onExpand`；纯数字形式无点击回调 |
| size | `number \| 'small' \| 'medium' \| 'large'` | `'medium'` | 汇总头像尺寸 |
| sizeBehavior | `'tightening' \| 'shrink'` | `'tightening'` | `tightening` 负 margin 重叠；`shrink` 逐个缩小 |

### SnAvatarGroup Slots

| Slot | 说明 |
| --- | --- |
| default | 头像列表，渲染 `SnAvatar` 元素（支持片段 / 嵌套数组） |

无事件（展开回调经 `maxOptions.onExpand` 传入）。注意：`size` 仅作用于汇总头像，子头像尺寸由各自的 `SnAvatar` 决定。

## Tokens

| Token | 用途 |
| --- | --- |
| `--sn-web-color-background-surface` | 收紧叠放时的头像描边 |
| `--sn-web-color-background-subtle` | 汇总头像背景 |
| `--sn-web-color-text-secondary` | 汇总头像文字 |
| `--sn-web-focus-ring` | 展开按钮键盘焦点 |

## 无障碍

- 带 `onExpand` 的汇总头像渲染为 `<button type="button">`，带 `aria-label="还有 k 个头像"`；无回调时为静态元素。
- 子头像的无障碍语义由 `SnAvatar` 自身提供。

## AI Patch 边界

- AI 可通过 Patch 修改 `maxOptions` / `size` / `sizeBehavior`。
- 成员列表属于业务数据；Patch 只应调整展示配置，不应直接增删插槽内容结构。
- 「+N」数量是运行时计算结果，Patch 不应试图直接写入。

完整契约见组件 `ai-description.md`。
