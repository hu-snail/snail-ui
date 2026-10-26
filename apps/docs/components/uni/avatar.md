# Avatar 头像（uni 端 / 移动端）

`sn-avatar` 是 `@snui/uni`（移动端 / 小程序 / H5）的身份缩略图组件，支持图片、首字母、图标三种内容层，并提供明确的降级链，图片地址失效时不会在布局里留下空洞。基于 easycom 自动注册，几何值走 `rpx`。

## 基础用法

三种内容层与自定义底色：

<Demo name="avatar-mp-basic" description="文字首字母、图标、自定义背景色、图片头像。" />

## 尺寸与形状

四档预设尺寸（`small` 48rpx / `normal` 72rpx / `medium` 96rpx / `large` 112rpx），或传入自定义长度：

<Demo name="avatar-mp-size" description="预设尺寸 small / normal / medium / large；round 圆形与 square 方形；自定义数值与百分比尺寸。" />

数字按 px 解释，字符串原样转发，因此 `:size="56"`、`size="20%"`、`size="64rpx"` 都可用。

## 加载失败回退

图片加载失败时组件自动降级，并 emit `error`：

<Demo name="avatar-mp-fallback" description="图片失败 → alt 文本 → 文字 → 图标，同时触发 error 事件。" />

回退链：

```text
src（图片）→ alt（失败时）→ text → icon（SVG）→ 字体图标（cssIcon）→ default 插槽
```

失败状态绑定在 `src` 上：换一个新的 `src` 会重置该状态，复用的头像实例不会被永久钉在占位层。

## 字体图标与 mode

回退链的倒数第二层是字体图标：`cssIcon` 为 `true` 时用 `iconPrefix` 拼出 `prefix-icon` 类，`cssIcon` 传字符串则直接把该值当前缀。`mode` 透传给内部 `<image>`（`aspectFill` 裁切 / `aspectFit` 留白），`customClass` / `customStyle` 作用于根节点。

<Demo name="avatar-mp-icon-font" description="cssIcon + iconPrefix 字体图标、cssIcon 字符串前缀、mode 裁剪与 customClass / customStyle。" />

## 自动注册（easycom）

```vue
<sn-avatar text="AU" size="large" />
```

如需显式 import：

```ts
import { SnAvatar } from '@snui/uni/components/sn-avatar/sn-avatar.vue';
```

## Props

| 属性          | 类型                  | 默认值         | 说明                                        |
| ------------- | --------------------- | -------------- | ------------------------------------------- |
| `src`         | `string`              | `''`           | 图片地址；失败时按 `alt` → 文字 → 图标 回退 |
| `text`        | `string`              | `''`           | 文本内容（首字母 / 短标签）                 |
| `icon`        | `string`              | `''`           | 图标名（经 `registerSnIcons()` 注册）       |
| `iconPrefix`  | `string`              | `''`           | 字体图标类名前缀，`cssIcon` 开启时使用      |
| `cssIcon`     | `boolean \| string`   | `false`        | 渲染字体图标；字符串值直接作为 class 前缀   |
| `size`        | `string \| number`    | `'normal'`     | 预设尺寸或自定义长度；数字按 px             |
| `shape`       | `'round' \| 'square'` | `'round'`      | 头像形状                                    |
| `bgColor`     | `string`              | `''`           | 背景色（内联覆盖）                          |
| `color`       | `string`              | `''`           | 文字 / 图标颜色（内联覆盖）                 |
| `alt`         | `string`              | `''`           | 图片加载失败时的占位文本                    |
| `mode`        | `string`              | `'aspectFill'` | 图片填充模式，同 uni-app `<image>` 的 mode  |
| `customClass` | `string`              | `''`           | 根节点自定义类名                            |
| `customStyle` | `string`              | `''`           | 根节点自定义 inline style                   |

## Events

| 事件名  | 说明                                       | 参数             |
| ------- | ------------------------------------------ | ---------------- |
| `click` | 点击头像时触发                             | `(event: Event)` |
| `error` | 图片加载失败时触发（此时回退层已经在渲染） | `(event: Event)` |

## Slots

| 插槽名    | 说明                               |
| --------- | ---------------------------------- |
| `default` | 完全自定义内容，覆盖所有内置内容层 |

## 主题变量

| 变量                                  | 用途                       |
| ------------------------------------- | -------------------------- |
| `--sn-mp-color-background-subtle`     | 默认占位底色               |
| `--sn-mp-color-text-secondary`        | 默认首字母颜色             |
| `--sn-mp-color-text-primary`          | Doodle 皮肤描边            |
| `--sn-mp-font-size-{xs,md,lg,xl}`     | 首字母字号，随预设尺寸缩放 |
| `--sn-mp-font-weight-{semibold,bold}` | 首字母字重                 |
| `--sn-mp-radius-{md,full}`            | `square` 与 `round` 形状   |

## 无障碍

- 根节点 `role="img"`，`aria-label` 取可见文案，文字头像会被读成"图片：AU"而不是正文。
- 仅 `@tap` 交互；小程序无键盘焦点概念。

## 暗色模式

`sn-avatar` 的背景色、文字色都来自 `--sn-mp-color-*`，无浅色兜底：

- 默认占位底色使用 `--sn-mp-color-background-subtle`，暗色下翻为深灰，首字母仍然可读。
- 图片内容本身不参与主题切换（由图片资源决定），组件只负责容器底色与文字色。
- `bgColor` / `color` 内联覆盖原样生效；这类覆盖请使用 `var(--sn-mp-*)` 才能在暗色下同步。

用 sn-config-provider 的 theme 设为 dark 包裹验证：

## 相关

- Web 端：[`SnAvatar`](/components/web/avatar)
- 头像叠层：`sn-avatar-group`（待发布）
- 角标：[`sn-badge`](/components/uni/badge)
