# CountTo 数字滚动（uni 端 / 移动端）

`sn-count-to` 是 `@snui/uni`（移动端 / 小程序 / H5）的数字滚动：从 `startVal` 补间到 `endVal`，支持千分位、小数位、前后缀与缓动曲线。**动画用 `setInterval`（约 16ms）实现** —— `requestAnimationFrame` 在小程序各端不保证可用。基于 easycom 自动注册（`components/sn-count-to/sn-count-to.vue` → `<sn-count-to>`），样式几何值走 `rpx`。

## 基础用法

`startVal` / `endVal` / `duration` 控制补间；`prefix` / `suffix` 包裹数字，`decimals` + `decimal` 控制小数，`separator` 控制千分位。

<Demo name="count-to-mp-basic" description="基础补间、货币前缀、小数与自定义分隔符。" />

## 主题色与控制方法

`type` 提供 `default` / `primary` / `success` / `warning` / `error` 五档文字色；`ref` 拿到实例后可调用 `start()` / `pause()` / `reset()`。

<Demo name="count-to-mp-type" description="五种主题色，以及手动开始 / 暂停 / 重置。" />

## 缓动曲线与自定义类名

`useEasing` 默认 `true`，用三次 ease-out（`1 - (1 - t)^3`）让数字先快后慢；传 `false` 走线性补间，数值匀速跳动。`customClass` / `customStyle` 作用于根节点。

<Demo name="count-to-mp-easing" description="use-easing 开 / 关的节奏对比，以及 customClass / customStyle。" />

## Props

| 属性        | 类型                                                        | 默认值    | 说明             |
| ----------- | ----------------------------------------------------------- | --------- | ---------------- |
| color       | string                                                      | ''        | 文本颜色         |
| type        | 'default' \| 'primary' \| 'success' \| 'warning' \| 'error' | 'default' | 主题类型         |
| startVal    | number                                                      | 0         | 起始值           |
| endVal      | number                                                      | 2024      | 最终值           |
| duration    | number                                                      | 3000      | 补间时长（ms）   |
| autoStart   | boolean                                                     | true      | 是否自动开始     |
| decimals    | number                                                      | 0         | 保留的小数位数   |
| decimal     | string                                                      | '.'       | 小数点符号       |
| separator   | string                                                      | ','       | 千分位分隔符     |
| prefix      | string                                                      | ''        | 前缀文本         |
| suffix      | string                                                      | ''        | 后缀文本         |
| useEasing   | boolean                                                     | true      | 是否使用缓动动画 |
| customClass | string                                                      | ''        | 根节点自定义类名 |
| customStyle | string                                                      | ''        | 根节点自定义样式 |

暴露方法：`start()` / `pause()` / `reset()`。

## Events

| 事件名  | 说明                         | 参数 |
| ------- | ---------------------------- | ---- |
| mounted | 组件加载完成（与参考库对齐） | —    |
| finish  | 补间到达 `endVal`            | —    |

## Slots

无。

## 主题变量

| 变量                                                | 用途                                          |
| --------------------------------------------------- | --------------------------------------------- |
| --sn-mp-color-text-primary                          | `type="default"` 文字色                       |
| --sn-mp-color-action-primary                        | `type="primary"` 文字色                       |
| --sn-mp-color-feedback-success`/`-warning`/`-danger | `type="success"` / `warning` / `error` 文字色 |
| --sn-mp-font-size-md                                | 文字字号                                      |
| --sn-mp-font-line-height-normal                     | 文字行高                                      |

## 无障碍

- 根节点：`role="status"` + `aria-live="polite"` + `aria-label` 与渲染文本一致

## 暗色模式

五档主题色全部来自语义色 token（`--sn-mp-color-text-primary` / `--sn-mp-color-action-primary` / `--sn-mp-color-feedback-*`），都在 `@snui/tokens-mp/styles` 的暗色块里覆盖过，因此自动适配。可用 sn-config-provider 的 theme 设为 dark 包裹验证：

> 若通过 `color` 传了自定义色值，该值不会随主题翻转 —— 暗色下请改用 `var(--sn-mp-*)` 形式。

## 相关

- 倒计时：[`sn-count-down`](/components/uni/count-down)
- 环形进度：[`sn-circle`](/components/uni/circle)
