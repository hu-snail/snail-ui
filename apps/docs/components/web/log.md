# Log 日志

固定高度的滚动日志查看器，支持按行渲染、触边加载与加载指示。

## 何时使用

- 需要展示持续追加的运行日志、构建输出。
- 日志量大，需要滚动到顶部 / 底部时增量加载。
- 加载中需要在日志上给出明确的进行中指示。

## 代码演示

### 尺寸

`rows` 决定可视行数，容器高度 = rows × line-height × font-size。

<Demo name="log-web-size" description="rows 控制日志高度。" />

### 事件

滚动到顶部 / 底部触发 `reach-top` / `reach-bottom`；继续朝边缘滚动会重复触发 `require-more`，用于增量加载。

<Demo name="log-web-event" description="require-more / reach-top / reach-bottom。" />

### 滚动控制

通过实例方法 `scrollTo` 滚到指定位置；`silent: true` 时不触发相关事件。

<Demo name="log-web-scroll" description="scrollTo 四种调用方式。" />

### 加载中

`loading` 在日志右上角显示加载指示。

<Demo name="log-web-loading" description="loading 开关。" />

### 滚动到最新

日志持续追加时自动滚动到底部。

<Demo name="log-web-auto-bottom" description="追加数据自动滚底。" />

## API

### SnLog Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| log | `string` | `undefined` | 日志内容，按 `\n` 分行；非空时优先于 `lines` |
| lines | `string[]` | `[]` | 按行传入日志内容 |
| trim | `boolean` | `false` | 是否去掉每行首尾空白 |
| loading | `boolean` | `false` | 是否显示加载中 |
| font-size | `number` | `14` | 文字大小 |
| line-height | `number` | `1.25` | 行高（无单位倍数） |
| rows | `number` | `15` | 可视行数，决定容器高度 |
| offset-top | `number` | `0` | 顶部触边判定容差（px） |
| offset-bottom | `number` | `0` | 底部触边判定容差（px） |

### Events

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| reach-top | — | 滚动到顶部（容差内） |
| reach-bottom | — | 滚动到底部（容差内） |
| require-more | `'top' \| 'bottom'` | 越过顶部 / 底部容差，可重复触发 |

### Methods

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| scrollTo | `(options: { top?: number, position?: 'top' \| 'bottom', silent?: boolean })` | 滚动到指定偏移或命名位置；`silent` 抑制事件 |

完整契约见组件 `ai-description.md`。
