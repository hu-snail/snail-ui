# NoticeBar 通知栏（uni 端 / 移动端）

`sn-notice-bar` 是 `@snui/uni`（移动端 / 小程序 / H5）的横向通知条：支持跑马灯、静态 / 换行、以及一次只显示一条的纵向模式，可带前置图标与关闭按钮。基于 easycom 自动注册（`components/sn-notice-bar/sn-notice-bar.vue` → `<sn-notice-bar>`），样式几何值走 `rpx`。

> **未实现**
>
> - `speed` 以「px/s」语义换算成关键帧时长，但宽度是**字符数 × 字号**的估算值（跨端组件拿不到真实文本宽度）；wot-ui 用真实宽度测量。
> - `direction="vertical"` 一次显示一条，按间隔轮换，而不是滚动动画。

## 基础用法

`scrollable` 默认 `true` 走跑马灯；`scrollable=false` 静态展示；配合 `wrapable` 可换行。

<Demo name="notice-bar-mp-basic" description="跑马灯 / 静态 / 换行三种模式。" />

## 类型与关闭

`type` 取 `warning`（默认）/ `info` / `danger`；`closable` 显示关闭按钮，点击后本条隐藏并触发 `close`。

<Demo name="notice-bar-mp-type" description="三种色调 + 可关闭通知（可恢复）。" />

## 纵向轮换

`direction="vertical"` + `text` 数组时一次显示一条，每次轮换触发 `next`。

<Demo name="notice-bar-mp-vertical" description="三条公告轮换展示，并显示当前序号。" />

## 图标、延迟与速度

`prefix` 换成注册表里的图标（未命中时回落到 type 字形）；`delay` 是跑马灯启动前的延迟（秒）；`speed` 是滚动速度（px/s）。

<Demo name="notice-bar-mp-marquee" description="prefix 注册表图标 / delay=3 / speed=120。" />

## 自定义配色与类名

`color` / `backgroundColor` 覆盖默认色调，`customClass` / `customStyle` 落在根节点上。

<Demo name="notice-bar-mp-custom" description="覆盖文字色与底色 / custom-class 加边框 / custom-style 加圆角。" />

## Props

| 属性            | 类型                            | 默认值       | 说明                                       |
| --------------- | ------------------------------- | ------------ | ------------------------------------------ |
| text            | string \| string[]              | ''           | 通知栏文案（字符串或按条）                 |
| type            | 'warning' \| 'info' \| 'danger' | 'warning'    | 类型（底色 + 兜底图标）                    |
| prefix          | string                          | ''           | 左侧图标名（sn-icon 注册表）               |
| scrollable      | boolean                         | true         | 是否开启滚动播放                           |
| delay           | number                          | 1            | 滚动动画初始延时（秒）                     |
| speed           | number                          | 50           | 滚动速度（px/s）                           |
| closable        | boolean                         | false        | 是否显示关闭按钮                           |
| wrapable        | boolean                         | false        | 是否换行展示（仅 `scrollable=false` 生效） |
| color           | string                          | ''           | 文字和图标颜色                             |
| backgroundColor | string                          | ''           | 背景颜色                                   |
| direction       | 'horizontal' \| 'vertical'      | 'horizontal' | 滚动方向                                   |
| customClass     | string                          | ''           | 根节点自定义类名                           |
| customStyle     | string                          | ''           | 根节点自定义样式                           |

## Events

| 事件名 | 说明                         | 参数              |
| ------ | ---------------------------- | ----------------- |
| close  | 点击关闭按钮（条本身会隐藏） | —                 |
| next   | 纵向模式切换到下一条         | index: number     |
| click  | 点击内容区                   | `{ text, index }` |

## Slots

| 插槽名  | 说明                                                     |
| ------- | -------------------------------------------------------- |
| prefix  | 自定义前置内容；传入 `prefix` 属性时该插槽不生效         |
| suffix  | 自定义后置内容；会覆盖默认关闭图标                       |
| default | 自定义通知文本内容；仅在 `direction="horizontal"` 时生效 |

## 主题变量

| 变量                                           | 用途                  |
| ---------------------------------------------- | --------------------- |
| --sn-mp-color-feedback-warning`/`-warning-soft | `type="warning"` 色调 |
| --sn-mp-color-feedback-info                    | `type="info"` 前景色  |
| --sn-mp-color-background-subtle                | `type="info"` 底色    |
| --sn-mp-color-feedback-danger`/`-danger-soft   | `type="danger"` 色调  |
| --sn-mp-font-size-md                           | 文案字号              |
| --sn-mp-font-line-height-normal                | 文案行高              |
| --sn-mp-spacing-3`/`--sn-mp-spacing-4          | 内边距与图标间距      |

## 无障碍

- 根节点：`role="marquee"`，滚动时 `aria-live="off"`、静态时 `polite`
- 前置图标容器：`aria-hidden="true"`
- 关闭按钮：`role="button"` + `aria-label="close"`

## 暗色模式

三种类型的底色与前景色全部来自语义色 token（`--sn-mp-color-feedback-*` / `--sn-mp-color-background-subtle`），这些都在 `@snui/tokens-mp/styles` 的暗色块里覆盖过，因此自动适配。可用 sn-config-provider 的 theme 设为 dark 包裹验证：

> 若通过 `color` / `backgroundColor` 传了自定义色值，该值不会随主题翻转 —— 暗色下请改用 `var(--sn-mp-*)` 形式。

## 相关

- 顶部条幅通知：[`sn-notify`](/components/uni/notify)
- 无停留的轻提示：[`sn-toast`](/components/uni/toast)
