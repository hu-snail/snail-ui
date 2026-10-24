# Notify 消息通知（uni 端 / 移动端）

`sn-notify` 是 `@snui/uni`（移动端 / 小程序 / H5）的条幅通知：从顶部或底部滑入、停留一段时间后滑出。支持多行文案、关闭按钮与 `floating` 悬浮卡片形态。基于 easycom 自动注册（`components/sn-notify/sn-notify.vue` → `<sn-notify>`），样式几何值走 `rpx`。

> **未实现**
>
> - **函数式 API**（`useNotify()`）本轮未实现，请用 `v-model:visible` 的组件写法。
> - `root-portal` 未实现（小程序没有 portal 宿主）。
> - `selector` 仅为 API 对齐保留，组件式下无效果。

## 基础用法

`type` 决定填充色与默认图标；`message` 中的 `\n` 会渲染为换行。

<Demo name="notify-mp-basic" description="primary / success / warning / danger 四种类型。" />

## 形态与位置

`variant="floating"` 渲染带圆角与阴影的内缩卡片；`closable` 加关闭按钮（配合 `duration=0` 可让通知常驻）；`position="bottom"` 从底部滑入。

<Demo name="notify-mp-variant" description="floating 悬浮卡片、可关闭（不自动消失）、底部弹出。" />

## 颜色、层级与安全区

`color` / `background` 分别覆盖文字色与底色；`safeHeight` 追加顶部偏移（为自定义导航栏留位）；`zIndex` 控制层级，`customStyle` 写在根节点。

<Demo name="notify-mp-style" description="自定义底色与文字色 / safe-height=88 / zIndex=300 + custom-style。" />

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| visible | boolean | false | 是否显示（`v-model:visible`） |
| type | 'primary' \| 'success' \| 'warning' \| 'danger' | 'danger' | 类型（填充色 + 默认图标） |
| message | string \| number | '' | 展示文案，`\n` 换行 |
| duration | number | 3000 | 展示时长（ms），`0` 表示不消失 |
| position | 'top' \| 'bottom' | 'top' | 弹出位置 |
| color | string | '' | 字体颜色 |
| background | string | '' | 背景颜色 |
| zIndex | number | 99 | 层级 |
| safeHeight | number \| string | — | 顶部额外偏移（数字按 px） |
| closable | boolean | false | 是否显示关闭按钮 |
| variant | 'filled' \| 'floating' | 'filled' | 展示形态 |
| selector | string | '' | 唯一标识（对齐用） |
| customClass | string | '' | 根节点自定义类名 |
| customStyle | string | '' | 根节点自定义样式 |

## Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| update:visible | `v-model` 同步（自动消失 / 关闭时也会触发） | boolean |
| click | 点击条幅内容 | Event |
| opened | 完全展示后 | — |
| closed | 滑出结束、节点卸载后 | — |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| default | 自定义通知内容（替代 `message`） |

## 主题变量

| 变量 | 用途 |
| --- | --- |
| --sn-mp-color-action-primary | `type="primary"` 填充色 |
| --sn-mp-color-feedback-success` / `-warning` / `-danger | 其余类型的填充色 / floating 图标色 |
| --sn-mp-color-text-on-primary | filled 形态文案 |
| --sn-mp-color-text-primary | floating 形态文案 |
| --sn-mp-color-background-elevated | floating 卡片背景 |
| --sn-mp-shadow-md | floating 卡片阴影 |
| --sn-mp-font-size-md | 文案字号 |
| --sn-mp-font-line-height-normal | 文案行高 |
| --sn-mp-spacing-3` / `--sn-mp-spacing-4` / `--sn-mp-spacing-5 | 内边距与图标间距 |
| --sn-mp-radius-lg | floating 卡片圆角 |

## 无障碍

- 条幅内容：`role="alert"` + `aria-live="assertive"`
- 关闭按钮：`role="button"` + `aria-label="close"`
- 状态图标：`aria-hidden="true"`（语义由文案承担）

## 暗色模式

填充色与文字色全部来自语义色 token（`--sn-mp-color-action-primary` / `--sn-mp-color-feedback-*` / `--sn-mp-color-text-*` / `--sn-mp-color-background-elevated`），这些都在 `@snui/tokens-mp/styles` 的暗色块里覆盖过，因此自动适配。可用 sn-config-provider 的 theme 设为 dark 包裹验证：


> 若通过 `background` / `color` 传了自定义色值，该值不会随主题翻转 —— 暗色下请改用 `var(--sn-mp-*)` 形式。

## 相关

- 无停留的轻提示：[`sn-toast`](/components/uni/toast)
- 横向滚动通知栏：[`sn-notice-bar`](/components/uni/notice-bar)
