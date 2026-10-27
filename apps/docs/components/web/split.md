# Split · Web（PC 端）

分栏容器。拖拽调整面板比例，键盘可达，支持折叠。

分隔条默认隐藏，鼠标移入 / 键盘聚焦 / 拖拽时在居中位置出现圆角竖条；面板之间建议用不同背景色区分模块。

## 基础用法

<Demo name="split-web-basic" description="双面板拖拽 + min/max，两种背景区分面板。" />

## 垂直分栏

<Demo name="split-web-vertical" description="direction='vertical'。" />

## 可折叠面板（collapsible）

<Demo name="split-web-collapse" description="拖到 min 以下 snap 收起，双击手柄恢复。" />

## API

### SnSplit Props

| Prop      | 类型                       | 默认值         | 说明     |
| --------- | -------------------------- | -------------- | -------- |
| direction | `'horizontal'\|'vertical'` | `'horizontal'` | 分栏方向 |
| disabled  | `boolean`                  | `false`        | 禁用拖拽 |

事件：`resize`（拖拽/折叠结束后 emit）。

### SnSplitPanel Props

| Prop              | 类型                   | 默认值  | 说明                   |
| ----------------- | ---------------------- | ------- | ---------------------- |
| defaultSize       | `number \| 'N%'`       | —       | 初始百分比（未设均分） |
| minSize / maxSize | `number \| 'N%'`       | —       | 拖拽边界               |
| collapsible       | `boolean`              | `false` | 可收起（snap 到 0）    |
| collapsed         | `boolean \| undefined` | —       | v-model:collapsed      |

divider `role="separator"`；键盘 Arrow ±2%、Home/End 到边界；双击 divider 恢复 default。

完整契约见组件 `ai-description.md`。
