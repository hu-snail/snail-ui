# Signature 签名（uni 端 / 移动端）

`sn-signature` 是 `@snui/uni` 的签名板：触摸采样点，确认时通过 `confirm` 返回笔画几何。easycom 自动注册（`components/sn-signature/sn-signature.vue` → `<sn-signature>`），几何值使用 `rpx`。因为跨端元素白名单里没有 `<canvas>`，笔画由一串绝对定位、按段旋转的 `<view>` 条组成——每个相邻点对一条，`width` 为段长加一个线宽（圆头覆盖拐点，笔画连贯无豁口），`transform: rotate(θ)` 以左边缘为轴，形成真实折线。

## 基础用法

sn-signature 签名板：touchstart / touchmove 采样点，确认时通过 confirm 返回笔画几何（paths）。

<Demo name="signature-mp-basic" description="sn-signature 签名板：touchstart / touchmove 采样点，确认时通过 confirm 返回笔画几何（paths）。" />

## 输入与手感

- **触摸**：`touchmove` 按距离采样（≥2 设计 px），高频采样率下节点数量保持平稳，绘制顺滑。
- **桌面鼠标**：桌面浏览器不会把鼠标拖拽转成触摸事件，组件在 H5 宿主上额外绑定 `mousedown / mousemove / mouseup`（`document` 级跟踪，可画出画板边界；触摸后的合成鼠标事件会被时间窗抑制）。文档站右侧预览可直接用鼠标签名。
- **连贯笔画**：每段条向末端延长一个线宽并以圆头收尾，段与段的拐点被圆头覆盖，无楔形豁口。
- **小程序坐标**：画板原点通过选择器查询缓存，模板 ref 无 DOM 盒的小程序端笔画不会整体偏移。

## 撤销 / 恢复与外观（`enableHistory` / `penColor` / `disabled`）

enableHistory 显示撤回 / 恢复按钮；penColor 覆盖笔色；disabled 锁掉画板。

<Demo name="signature-mp-history" description="enableHistory 显示撤回 / 恢复按钮；penColor 覆盖笔色；disabled 锁掉画板。" />
## 按钮文案（`confirmText` / `clearText` / `revokeText` / `restoreText` / `undoText` / `redoText`）

底栏按钮文案全部可改；`undoText` / `redoText` 同时设置时覆盖 `revokeText` / `restoreText`（与 wd-signature 一致）。

<Demo name="signature-mp-button-labels" description="confirmText / clearText；enableHistory 下 revokeText / restoreText；undoText / redoText 覆盖。" />

## 画板外观与滚动（`height` / `width` / `backgroundColor` / `disableScroll` / `step`）

`height` / `width` 接受数字（按 rpx 设计值）或 CSS 长度；`backgroundColor` 覆盖画板底色；`disableScroll` 为 `true` 时拦截 `touchmove`，页面在签名时不会跟着滚；`step` 决定一次撤回多少笔。

<Demo name="signature-mp-pad-look" description="height / width；backgroundColor 覆盖底色；disableScroll=false；step=2 一次撤回两笔。" />

## 导出与压感对齐参数（`fileType` / `quality` / `exportScale` / `pressure` / `maxWidth` / `minWidth` / `minSpeed` / `custom*`）

这组参数为与 wd-signature 对齐而声明：本构建不做栅格化，`fileType` / `quality` / `exportScale` 由宿主在 `confirm` 回调里使用；压感模拟（速度 → 线宽）**未实现**，`pressure` / `maxWidth` / `minWidth` / `minSpeed` 不会改变画板行为。`customClass` / `customStyle` 挂根节点。

<Demo name="signature-mp-export-parity" description="fileType / quality / exportScale（宿主导出用）；pressure / maxWidth / minWidth / minSpeed（未实现）；customClass / customStyle。" />

## Props

| 属性                          | 类型               | 默认值              | 说明                    |
| ----------------------------- | ------------------ | ------------------- | ----------------------- |
| `penColor`                    | `string`           | `''`                | 笔色（空 = token 默认） |
| `lineWidth`                   | `number`           | `3`                 | 笔宽（px 设计值）       |
| `confirmText` / `clearText`   | `string`           | `'确认'` / `'清空'` | 确认 / 清空文案         |
| `revokeText` / `restoreText`  | `string`           | `'撤回'` / `'恢复'` | 撤回 / 恢复文案         |
| `undoText` / `redoText`       | `string`           | `''`                | 覆盖撤回 / 恢复文案     |
| `disabled`                    | `boolean`          | `false`             | 禁用画板与按钮          |
| `height` / `width`            | `string \| number` | `undefined`         | 画板尺寸（数字按 rpx）  |
| `backgroundColor`             | `string`           | `''`                | 画板背景色              |
| `disableScroll`               | `boolean`          | `true`              | 绘制时拦截 touchmove    |
| `enableHistory`               | `boolean`          | `false`             | 是否显示撤回 / 恢复     |
| `step`                        | `number`           | `1`                 | 每次撤回 / 恢复的笔画数 |
| `customClass` / `customStyle` | `string`           | `''`                | 根节点自定义类名 / 样式 |

> **未实现**：`fileType` / `quality` / `exportScale`（图片导出需要 `<canvas>`，不在跨端白名单内），`pressure` / `maxWidth` / `minWidth` / `minSpeed`（速度采样式笔宽在部分小程序渲染器上不可靠）。

## Events

| 事件名                      | 说明         | 参数              |
| --------------------------- | ------------ | ----------------- |
| `start` / `end` / `signing` | 触摸生命周期 | `(event: Event)`  |
| `confirm`                   | 点击确认时   | `SignatureResult` |
| `clear`                     | 清空画板时   | —                 |

## Exposed API

| 成员                 | 签名         | 说明             |
| -------------------- | ------------ | ---------------- |
| `confirm`            | `() => void` | 发出当前笔画几何 |
| `clear`              | `() => void` | 清空画板         |
| `revoke` / `restore` | `() => void` | 撤回 / 恢复      |
| `init`               | `() => void` | 清空重做栈       |

## Slots

本组件不提供插槽。

## 主题变量

| 变量                                    | 用途                   |
| --------------------------------------- | ---------------------- |
| `--sn-mp-color-background-surface`      | 画板底色               |
| `--sn-mp-color-border-default`          | 画板边框               |
| `--sn-mp-color-text-primary`            | 默认笔色               |
| `--sn-mp-color-background-soft`         | 次要按钮底色           |
| `--sn-mp-color-action-primary`          | 确认按钮               |
| `--sn-mp-color-text-on-primary`         | 确认按钮文字           |
| `--sn-mp-color-background-overlay`      | 禁用遮罩               |
| ``--sn-mp-radius-lg` / `-full` / `-md`` | 画板 / 笔画 / 按钮圆角 |

## 无障碍

- 根节点 `role="group"`，`aria-label="signature pad"`。
- 画板带 `aria-disabled`。
- 每个按钮为 `role="button"`，带 `aria-label` / `aria-disabled`；禁用时 `tabindex="-1"`。
- 一个视觉隐藏的 `aria-live="polite"` 文本同步步长与笔画计数。

## 暗色模式

所有颜色都通过 `--sn-mp-*` token 解析，没有浅色兜底。`.sn-theme-dark` 下文字、底板、边框与状态色自动翻转。验证方式：
