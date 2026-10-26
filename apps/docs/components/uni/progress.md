# Progress 进度条（uni 端 / 移动端）

`sn-progress` 是 `@snui/uni`（移动端 / 小程序 / H5）的线性进度条：0–100 的数值映射为填充宽度，可选百分比文案（内嵌 / 外置），填充色支持纯色、渐变色标与阈值色。基于 easycom 自动注册（`components/sn-progress/sn-progress.vue` → `<sn-progress>`），样式几何值走 `rpx`。

## 基础用法

`percentage` 超出 0–100 会被截断；默认在外置右侧显示四舍五入后的百分比。

<Demo name="progress-mp-basic" description="0 / 30 / 68 / 100 与 hide-text 五档。" />

## 状态与自定义颜色

- `status`：`success` / `warning` / `danger`，优先级高于 `color`
- `color`：字符串（纯色）、字符串数组（渐变）、`{ color, percentage }[]`（阈值色，达到阈值后生效，取最高已达成阈值）
- `duration`：进度每增加 1% 的毫秒数，整体过渡时长 = `percentage × duration`

<Demo name="progress-mp-color" description="success / warning / danger 三档状态色，以及 color 字符串与渐变数组。" />

## 文案位置与对齐

`percentPosition` 控制百分比文案：

- `type: 'outer'`（默认）—— 文案在进度条右侧
- `type: 'inner'` —— 文案在填充区域内（轨道自动加高）
- `align: 'left' | 'center' | 'right'` —— 外置文案的对齐方式

<Demo name="progress-mp-label" description="outer left / outer center / inner right / inner center，以及 duration 动画。" />

## 自定义类名与样式

`customClass` 追加根节点类名，`customStyle` 写根节点内联样式，两者可叠加。

<Demo name="progress-mp-custom" description="custom-class 加虚线外框 / custom-style 加内边距 / 两者叠加。" />

## Props

| 属性              | 类型                                                                   | 默认值                              | 说明                                 |
| ----------------- | ---------------------------------------------------------------------- | ----------------------------------- | ------------------------------------ |
| `percentage`      | `number`                                                               | `0`                                 | 进度数值，最大值 100（越界截断）     |
| `hideText`        | `boolean`                                                              | `false`                             | 是否隐藏进度文字                     |
| `color`           | `string \| string[] \| SnProgressColor[]`                              | `''`                                | 进度条颜色：纯色 / 渐变色标 / 阈值色 |
| `status`          | `'success' \| 'danger' \| 'warning' \| ''`                             | `''`                                | 进度条状态，优先级高于 `color`       |
| `duration`        | `number`                                                               | `30`                                | 进度增加 1% 所需毫秒数               |
| `percentPosition` | `{ type?: 'inner' \| 'outer'; align?: 'left' \| 'center' \| 'right' }` | `{ type: 'outer', align: 'right' }` | 百分比显示位置配置                   |
| `customClass`     | `string`                                                               | `''`                                | 根节点自定义类名                     |
| `customStyle`     | `string`                                                               | `''`                                | 根节点自定义样式                     |

`SnProgressColor` = `{ color: string; percentage?: number }`。

## Events

无。`sn-progress` 是纯展示组件，不发事件。

## Slots

无。

## 主题变量

| 变量                              | 用途                         |
| --------------------------------- | ---------------------------- |
| `--sn-mp-color-action-primary`    | 默认填充色                   |
| `--sn-mp-color-feedback-success`  | `status="success"` 填充色    |
| `--sn-mp-color-feedback-warning`  | `status="warning"` 填充色    |
| `--sn-mp-color-feedback-danger`   | `status="danger"` 填充色     |
| `--sn-mp-color-background-subtle` | 轨道底色                     |
| `--sn-mp-color-text-secondary`    | 外置文案 / 0% 时内嵌文案颜色 |
| `--sn-mp-color-text-on-primary`   | 填充区内的内嵌文案颜色       |
| `--sn-mp-font-size-sm`            | 文案字号                     |
| `--sn-mp-font-line-height-normal` | 文案行高                     |
| `--sn-mp-spacing-3`               | 文案内边距 / 外边距          |
| `--sn-mp-radius-full`             | 轨道与填充圆角               |
| `--sn-mp-radius-xs`               | Doodle 皮肤下的圆角          |

## 无障碍

- 根节点挂 `role="progressbar"`，并设置 `aria-valuenow` / `aria-valuemin` / `aria-valuemax`
- `aria-label` 与渲染出的百分比文案一致
- 无键盘交互（只读指示器）

## 暗色模式

填充色与轨道色全部来自语义色 token（`--sn-mp-color-action-primary` / `--sn-mp-color-feedback-*` / `--sn-mp-color-background-subtle` / `--sn-mp-color-text-*`），这些都在 `@snui/tokens-mp/styles` 的暗色块里覆盖过，因此自动适配。可用 sn-config-provider 的 theme 设为 dark 包裹验证：

> 如果通过 `color` 传了自定义色值（如 `#5b8def`），该值不会随主题翻转 —— 这与 wot-ui 行为一致，暗色下请改用 `var(--sn-mp-*)` 形式的颜色。

## 相关

- 不定态加载：[`sn-loading`](/components/uni/loading)
