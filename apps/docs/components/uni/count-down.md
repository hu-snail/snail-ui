# CountDown 倒计时（uni 端 / 移动端）

`sn-count-down` 是 `@snui/uni`（移动端 / 小程序 / H5）的倒计时：用 `format` 字符串渲染天 / 时 / 分 / 秒 / 毫秒，支持 `millisecond` 亚秒级刷新，并暴露 `start` / `pause` / `reset` 方法。基于 easycom 自动注册（`components/sn-count-down/sn-count-down.vue` → `<sn-count-down>`），样式几何值走 `rpx`。

## 基础用法

`format` 支持 `DD`（天，不补零）/ `DDD`（天，补到 3 位）/ `HH` / `mm` / `ss` / `S`（毫秒，补到 3 位），其余字符原样保留。

<Demo name="count-down-mp-basic" description="三种格式与 finish 回调。" />

## 控制方法与毫秒

`ref` 拿到实例后可调用 `start()` / `pause()` / `reset()`；`millisecond` 打开后每 ~16ms 刷新并暴露 `S`。

<Demo name="count-down-mp-control" description="开始 / 暂停 / 重置，以及毫秒级渲染。" />

## auto-start 与自定义类名

`autoStart` 默认 `true`：挂载即开始计时，`time` 变化会重置并继续。传 `false` 后组件保持静止，`reset()` 也不会自动跑，必须显式调用 `start()`。`customClass` / `customStyle` 作用于根节点。

<Demo name="count-down-mp-autostart" description="auto-start=false 手动开始、reset 不自动跑，以及 customClass / customStyle。" />

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| time | number | 0 | 倒计时时长（ms） |
| millisecond | boolean | false | 是否开启毫秒级渲染（约 16ms 一跳） |
| format | string | 'HH:mm:ss' | 倒计时格式化字符串 |
| autoStart | boolean | true | 是否在初始化和 `time` 变化后自动开始 |
| customClass | string | '' | 根节点自定义类名 |
| customStyle | string | '' | 根节点自定义样式 |

暴露方法：`start()` / `pause()` / `reset()`。`SnCountDownTimeData` = `{ total, days, hours, minutes, seconds, milliseconds }`。

## Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| change | 每次跳秒（或跳毫秒）时 | SnCountDownTimeData |
| finish | 倒计时归零时 | — |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| default | 自定义渲染，插槽 props 为 `SnCountDownTimeData` |

## 主题变量

| 变量 | 用途 |
| --- | --- |
| --sn-mp-color-text-primary | 倒计时文字 |
| --sn-mp-font-size-md | 文字字号 |
| --sn-mp-font-line-height-normal | 文字行高 |

## 无障碍

- 根节点：`role="timer"`，`aria-label` 为当前格式化后的文本

## 暗色模式

文字颜色走 `--sn-mp-color-text-primary`，该变量在 `@snui/tokens-mp/styles` 的暗色块里覆盖过，因此自动适配。可用 sn-config-provider 的 theme 设为 dark 包裹验证：


## 相关

- 数字滚动：[`sn-count-to`](/components/uni/count-to)
- 进度条：[`sn-progress`](/components/uni/progress)
