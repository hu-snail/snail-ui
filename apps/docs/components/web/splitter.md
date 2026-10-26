# Splitter · Web（PC 端）

分栏容器。拖拽调整面板比例，键盘可达，支持折叠。

## 基础用法

<Demo name="splitter-web-basic" description="双面板拖拽 + min/max。" />

## 垂直分栏

<Demo name="splitter-web-vertical" description="direction='vertical'。" />

## 可折叠面板（collapsible）

<Demo name="splitter-web-collapse" description="拖到 min 以下 snap 收起，双击手柄恢复。" />

## API

### SnSplitter Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| direction | `'horizontal'\|'vertical'` | `'horizontal'` | 分栏方向 |
| disabled | `boolean` | `false` | 禁用拖拽 |

事件：`resize`（拖拽/折叠结束后 emit）。

### SnSplitterPanel Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| defaultSize | `number \| 'N%'` | — | 初始百分比（未设均分） |
| minSize / maxSize | `number \| 'N%'` | — | 拖拽边界 |
| collapsible | `boolean` | `false` | 可收起（snap 到 0） |
| collapsed | `boolean \| undefined` | — | v-model:collapsed |

divider `role="separator"`；键盘 Arrow ±2%、Home/End 到边界；双击 divider 恢复 default。

完整契约见组件 `ai-description.md`。
