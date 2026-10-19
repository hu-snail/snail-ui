# Ellipsis 文本省略（Web 端）

把文本截断在一行或 N 行内，溢出时通过 Tooltip 展示完整内容，也可点击原地展开。

## 何时使用

- 表格单元格、卡片标题等空间受限处需要截断长文本。
- 截断后的完整内容需要悬浮可见（Tooltip）。
- 长段落需要点击展开 / 收起的阅读交互。

## 代码演示

### 基础用法

单行与多行截断；溢出时悬浮显示完整文本。溢出检测基于容器尺寸（ResizeObserver + resize 监听）。

<Demo name="ellipsis-web-basic" description="单行 / 多行 lineClamp / 溢出 Tooltip / 点击展开。" />

## API

### SnEllipsis Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| expandTrigger | `'click' \| 'none'` | `'none'` | 点击文本切换展开 / 收起 |
| lineClamp | `number` | `1` | 截断行数，`1` 为单行省略 |
| tooltip | `boolean \| SnTooltip 部分属性对象` | `true` | 溢出时悬浮显示完整文本；对象形式透传 Tooltip 属性 |
| width | `number \| 'screen'` | — | 容器宽度，数字为 px，`'screen'` 为 100vw |

### SnEllipsis Slots

| Slot | 说明 |
| --- | --- |
| default | 被截断的文本内容 |

无事件。tooltip 对象形式支持的属性子集：`content` / `placement` / `trigger` / `delay` / `duration` / `arrow` / `zIndex` / `raw` / `animated` / `keepAliveOnHover` / `overlap` / `width` / `to` / `displayDirective` / `contentClass` / `contentStyle`；`disabled` 由溢出检测接管。

## Tokens

组件本身纯结构（继承上下文文字 token）；Tooltip 部分消费 SnTooltip 自身 token。

## 无障碍

- 截断只是视觉行为，DOM 中保留完整文本，屏幕阅读器可读到全文。
- Tooltip 气泡带 `role="tooltip"`。
- `expandTrigger='click'` 时文本可点击但不可聚焦；关键内容请提供键盘可达的替代。

## AI Patch 边界

- AI 可通过 Patch 修改 `lineClamp` / `width` / `expandTrigger` / `tooltip` 配置。
- 溢出状态是运行时测量结果，不属于 Schema；Patch 不应试图直接写入「是否溢出」。
- 完整文本来自插槽内容；Patch 修改文本即可同步 Tooltip 内容。

完整契约见组件 `ai-description.md`。
