# SwipeAction 滑动操作（uni 端 / 移动端）

`sn-swipe-action` 是 `@snui/uni`（移动端 / 小程序 / H5）的滑动操作行：向左滑露出 `right` 操作区、向右滑露出 `left` 操作区，已展开时点击内容区会收起并触发 `click`。基于 easycom 自动注册（`components/sn-swipe-action/sn-swipe-action.vue` → `<sn-swipe-action>`），样式几何值走 `rpx`。

> **与 wot-ui 的差异**
>
> - 没有 `left` / `right` 插槽的行不能滑开（手势被忽略）。
> - `click` 的语义与 wd 一致：**已展开时**点击内容区会关闭并上报 `{ reason: 'click', position }`。
> - `before-close` 对滑动触发的关闭同样生效，不只是 `close()` 方法。

## 基础用法

内容放默认插槽，操作按钮放 `right` / `left` 插槽。`v-model` 回报 `'left' | 'close' | 'right'`。

<Demo name="swipe-action-mp-basic" description="向左滑动露出删除按钮，状态实时显示。" />

## 左右两侧 / 关闭拦截

- 两侧都提供插槽时左右都能滑开
- `beforeClose(reason, position)` 返回 `false` 或 `Promise<false>` 时阻止关闭
- 手势以 `touchstart` / `touchmove` / `touchend` / `touchcancel` 在组件根节点上完成，不注册任何全局监听

<Demo name="swipe-action-mp-both-sides" description="左右两侧操作区 + before-close 拦截第一次关闭。" />

## 禁用与自定义样式

`disabled` 忽略手势、行保持关闭；`customClass` / `customStyle` 落在根节点。

<Demo name="swipe-action-mp-disabled" description="可滑动 + custom-class / custom-style，以及 disabled 行保持关闭。" />

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `'left' \| 'close' \| 'right'` | `'close'` | 当前滑动状态（`v-model`） |
| `disabled` | `boolean` | `false` | 是否禁用滑动 |
| `beforeClose` | `(reason, position) => boolean \| Promise<boolean>` | — | 关闭前拦截函数，返回 `false` 阻止关闭 |
| `customClass` | `string` | `''` | 根节点自定义类名 |
| `customStyle` | `string` | `''` | 根节点自定义样式 |

### beforeClose 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `reason` | `'click' \| 'swipe' \| 'other'` | 触发关闭的原因 |
| `position` | `'left' \| 'right'` | 当前展开的一侧 |

## Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 滑动状态变化 | `('left' \| 'close' \| 'right')` |
| `click` | 已展开时点击内容区并关闭 | `{ reason: 'click', position: 'left' \| 'right' }` |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 内容区（会滑动的部分） |
| `left` | 左侧操作区（右滑露出） |
| `right` | 右侧操作区（左滑露出） |

## 方法

| 方法名 | 说明 |
| --- | --- |
| `close(reason?, position?)` | 关闭已展开的操作区；被 `beforeClose` 拦下时 resolve `false` |

## 手势行为

- 纵向为主的滑动交给页面滚动；横向滑动会 `preventDefault()`，行跟手移动时页面不跟着滚
- `touchcancel`（系统手势抢走触点）按关闭处理，行不会卡在半开状态
- 展开距离等于操作区真实宽度：每次手势开始时通过 `uni.createSelectorQuery()` → DOM 节点 → 兜底常量三级取值

## 主题变量

| 变量 | 用途 |
| --- | --- |
| `--sn-mp-color-background-elevated` | 行 / 内容区底色 |
| `--sn-mp-color-text-primary` | 内容文字 |
| `--sn-mp-color-text-disabled` | 禁用态文字 |

## 无障碍

- 内容区带 `role="button"` + `aria-expanded`
- 交互用 `@tap` 与触摸事件；移动端无键盘路径

## 暗色模式

行与内容区底色走 `--sn-mp-color-background-elevated`、文字走 `--sn-mp-color-text-primary`，两者都在 `@snui/tokens-mp/styles` 的 `page.sn-theme-dark, .sn-theme-dark` 块里覆盖，因此暗色下自动适配。操作区颜色由使用方决定（demo 里用 `--sn-mp-color-feedback-danger` / `--sn-mp-color-action-primary`）。可用 `<sn-config-provider theme="dark">` 包裹验证。

## 相关

- 列表行容器：[`sn-cell`](/components/uni/cell)
- 底部动作面板：[`sn-action-sheet`](/components/uni/action-sheet)
