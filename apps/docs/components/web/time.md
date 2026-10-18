# Time · Web（PC 端）

时间格式化（对标 n-time）：把时间戳 / Date 渲染成日期时间、纯日期或相对时间，默认输出原生 `<time>` 元素。

## 何时使用

- 列表、详情页展示创建 / 更新时间。
- 「3 天前」这类相对时间描述。
- 需要 i18n 时区展示（time-zone）或 unix 秒级时间戳（unix）。
- 富文本内联场景用 `text` 输出纯文本节点。

## 代码演示

### 基础用法

<Demo name="time-web-basic" description="number / Date 输入，默认 datetime。" />

### 类型

<Demo name="time-web-type" description="type = date / datetime。" />

### 格式化

<Demo name="time-web-format" description="format 自定义格式串（date-fns token 子集）。" />

### 相对时间

<Demo name="time-web-relative" description="type = relative，内置中文文案（如「3 天前」）。" />

### Unix 时间戳

<Demo name="time-web-unix" description="unix 表示输入是秒级时间戳。" />

### 时区

<Demo name="time-web-timezone" description="time-zone 按 IANA 时区格式化。" />

## API

### SnTime Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| time | `number \| Date` | `undefined`（取挂载时刻） | 要渲染的时间 |
| to | `number \| Date` | `undefined`（取挂载时刻） | relative 的基准时间 |
| type | `'relative' \| 'date' \| 'datetime'` | `'datetime'` | 渲染类型 |
| unix | `boolean` | `false` | 输入按 unix 秒级时间戳解析 |
| format | `string` | `undefined` | 自定义格式（支持 yyyy yy MMMM MMM MM M dd d EEEE EEE HH H hh h mm m ss s SSS a 与 '…' 字面量） |
| text | `boolean` | `false` | 渲染纯文本节点而非 `<time>` 元素 |
| time-zone | `string` | `undefined` | IANA 时区，仅影响格式化输出 |

无事件、无插槽。与 naive 的差异：不依赖 date-fns（format 为常用 token 子集）、相对时间文案内置中文（formatDistanceStrict 等价算法），详见组件 `ai-description.md`。
