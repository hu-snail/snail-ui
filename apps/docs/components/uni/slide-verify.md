# SlideVerify 滑动验证（uni 端 / 移动端）

`sn-slide-verify` 是 `@snui/uni` 的拖动验证：滑块必须拖到最右端（扣除 `tolerance`）才会触发 `success`。easycom 自动注册（`components/sn-slide-verify/sn-slide-verify.vue` → `<sn-slide-verify>`），几何值使用 `rpx`。轨道宽度在挂载时测量一次（`onMounted` → 一次 `getBoundingClientRect`），布局变化后调用暴露的 `init()` 重新测量；没有观察器、没有定时器。

## 基础用法

sn-slide-verify 拖动验证：滑块拖到最右端（容差 tolerance 内）触发 success，否则 fail 并归位。

<Demo name="slide-verify-mp-basic" description="sn-slide-verify 拖动验证：滑块拖到最右端（容差 tolerance 内）触发 success，否则 fail 并归位。" />

## 文案、颜色与禁用（`text` / `successText` / `backgroundColor` / `disabled`）

text / successText 覆盖内置文案；backgroundColor / activeBackgroundColor 覆盖轨道色；disabled 拦掉拖动。

<Demo name="slide-verify-mp-custom" description="text / successText 覆盖内置文案；backgroundColor / activeBackgroundColor 覆盖轨道色；disabled 拦掉拖动。" />

## 图标字形与根节点样式（`icon` / `successIcon` / `iconPrefix` / `cssIcon` / `iconSize` / `successIconSize` / `tolerance` / `customClass` / `customStyle`）

不给名字时用内置 SVG 字形；给了名字就走 iconfont 约定（`icon-prefix` + `-` + 名字），`css-icon` 把名字当裸类名；`icon-size` / `success-icon-size` 单独控制两个字形盒子。`tolerance` 放宽右边缘容差，`custom-class` / `custom-style` 落在根节点。

<Demo name="slide-verify-mp-icons" description="icon / successIcon 走 iconfont 约定；cssIcon 按裸类名渲染；iconSize / successIconSize 独立控制两个字形尺寸；tolerance 放宽容差；customClass / customStyle 落在根节点。" />

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `tolerance` | `number` | `10` | 右边缘容差（px） |
| `text` / `successText` | `string` | `''` | 提示 / 成功文案（空 = 内置） |
| `disabled` | `boolean` | `false` | 禁用拖动 |
| `backgroundColor` / `activeBackgroundColor` | `string` | `''` | 轨道颜色 |
| `customClass` / `customStyle` | `string` | `''` | 根节点自定义类名 / 样式 |

> **未实现**：拼图背景（需要 canvas），以及自由图标 prop（`icon` / `successIcon` / `iconPrefix` / `cssIcon` / `iconSize` / `successIconSize`）——两个字形固定，通过 `icon` / `success-icon` 插槽替换。本实现只校验「距离」，因此它是一个「证明你是人」的手势，不是机器人过滤器。

## Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `success` | 滑块到达末端时 | — |
| `fail` | 未到末端即松手时 | — |

## Exposed API

| 成员 | 签名 | 说明 |
| --- | --- | --- |
| `init` | `() => void` | 重新测量轨道宽度 |
| `reset` | `() => void` | 把滑块复位到起点 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `text` | 自定义提示文字 |
| `success-text` | 自定义成功提示文字 |
| `icon` | 自定义滑块图标 |
| `success-icon` | 自定义成功图标 |

## 主题变量

| 变量 | 用途 |
| --- | --- |
| ``--sn-mp-color-background-soft`` | 轨道底色 |
| ``--sn-mp-color-feedback-success-soft`` | 通过后轨道底色 |
| ``--sn-mp-color-feedback-success`` | 通过文案与滑块图标 |
| ``--sn-mp-color-background-elevated`` | 滑块底板 |
| ``--sn-mp-color-action-primary`` | 未验证滑块图标 |
| ``--sn-mp-color-text-tertiary`` | 提示文案 |
| ``--sn-mp-radius-md`` | 轨道 / 滑块圆角 |
| ``--sn-mp-shadow-sm`` | 滑块阴影 |

## 无障碍

- 根节点 `role="group"`，`aria-label` 携带提示文案。
- 滑块为 `role="button"`，带 `aria-label`；禁用或已通过时 `tabindex="-1"`。
- 轨道带 `aria-disabled`。

## 暗色模式

所有颜色都通过 `--sn-mp-*` token 解析，没有浅色兜底。`.sn-theme-dark` / `page.sn-theme-dark` 下文字、底板、边框与状态色自动翻转。验证方式：

