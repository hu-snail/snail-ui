# Countdown · Web（PC 端）

倒计时：从 `duration` 毫秒倒数到 0，渲染 `HH:MM:SS`，支持小数精度与自定义渲染。

## 何时使用

- 秒杀、验证码、考试等剩余时间场景。
- 需要毫秒级精度展示（precision 1-3）。
- 倒计时格式需要完全自定义（`render` 函数）。

## 代码演示

### 基础用法

<Demo name="countdown-web-basic" description="duration 5000ms，active 控制走/停。" />

### 精度

<Demo name="countdown-web-precision" description="precision 0 / 1 / 2 / 3。" />

### 自定义渲染

<Demo name="countdown-web-render" description="render 函数接收剩余时间对象，返回任意内容。" />

### 重置

<Demo name="countdown-web-reset" description="reset() 恢复完整时长并继续走。" />

## API

### SnCountdown Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| duration | `number` | `0` | 倒计时总时长 ms（非响应式） |
| active | `boolean` | `true` | 是否处于计时状态 |
| precision | `0 \| 1 \| 2 \| 3` | `0` | 秒的小数精度 |
| render | `(info: { hours, minutes, seconds, milliseconds }) => VNodeChild` | `undefined` | 自定义渲染函数 |

### SnCountdown Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| finish | — | 倒计时到 0 时触发（每次计时结束触发一次，reset 后可再触发） |

### SnCountdown Methods

| 方法 | 参数 | 说明 |
| --- | --- | --- |
| reset | — | 重置到完整时长 |

显示值在当前精度步进内向上取整（剩余 4999ms 时秒位仍显示 5），与 naive 一致。

完整契约见组件 `ai-description.md`。
