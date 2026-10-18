# Statistic · Web（PC 端）

统计数据展示（对标 n-statistic）：小号 label 压在大号数值上，支持前缀/后缀装饰与等宽数字排版。

## 何时使用

- 需要突出展示某个统计数值（余额、进度、活跃用户数等）。
- 数值需要前后缀说明（货币符号、单位、分母）。
- 数字滚动场景需要等宽数字避免抖动（配合 tabular-nums）。

## 代码演示

### 基础用法

<Demo name="statistic-web-basic" description="label + value，prefix / suffix 插槽与 default 插槽两种取值方式。" />

## API

### SnStatistic Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| label | `string` | `undefined` | 数值上方的标签 |
| value | `string \| number` | `undefined` | 统计值；传入时优先于 default 插槽，`0` 是合法值 |
| tabular-nums | `boolean` | `false` | 数字等宽（font-variant-numeric: tabular-nums） |

### SnStatistic Slots

| Slot | 说明 |
| --- | --- |
| default | 值内容（仅未传 `value` 时生效） |
| label | 标签（仅未传 `label` 时生效） |
| prefix | 值前缀 |
| suffix | 值后缀 |

无事件。度量对齐 naive cssr：label 14px / 数值 24px / 值区 margin-top 4px / 前后缀间距 4px。

完整契约见组件 `ai-description.md`。
