# NumberAnimation · Web（PC 端）

数值动画：数字从 `from` 缓动滚动到 `to`，支持精度、千分位分隔符与国际化。

## 何时使用

- 大屏 / 看板中数字从 0 滚动到目标值，制造「数字增长」的动效。
- 配合 SnStatistic 的 `tabular-nums` 使用，滚动过程不抖动。
- 需要手动重放动画（`play()` 实例方法）。

## 代码演示

### 基础用法

<Demo name="number-animation-web-basic" description="SnStatistic 内滚动 + play() 重放。" />

### 精度

<Demo name="number-animation-web-precision" description="precision 保留小数位。" />

### 分隔符

<Demo name="number-animation-web-separator" description="show-separator 千分位分组。" />

### 国际化

<Demo name="number-animation-web-intl" description="locale 决定小数点与分组符（Intl.NumberFormat）。" />

### 结束回调

<Demo name="number-animation-web-finish" description="滚动到目标值时触发 finish。" />

## API

### SnNumberAnimation Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| from | `number` | `0` | 起始值 |
| to | `number` | `0` | 目标值 |
| precision | `number` | `0` | 小数位数 |
| show-separator | `boolean` | `false` | 整数部分千分位分隔 |
| locale | `string` | `undefined` | BCP-47 语言（默认跟随运行时 locale） |
| active | `boolean` | `true` | 是否播放动画（true 时从头开始） |
| duration | `number` | `2000` | 动画时长 ms（非响应式） |

### SnNumberAnimation Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| finish | — | 动画到达 `to` 时触发 |

### SnNumberAnimation Methods

| 方法 | 参数 | 说明 |
| --- | --- | --- |
| play | — | 重放动画；动画进行中调用会被忽略 |

完整契约见组件 `ai-description.md`。
