# Skeleton 骨架屏（Web 端）

`SnSkeleton` 是内容加载期间的占位块。一个标签覆盖常见形状：`text` 让它落进一行文字里、`circle` 变成头像、`repeat` 变多行段落。props 与语义按 [naive-ui `n-skeleton`](https://www.naiveui.com/zh-CN/light/components/skeleton) 1:1 对齐（AGENTS.md §112）。

典型场景：列表首屏、卡片详情、头像 + 标题 + 正文组合。

## 实时预览

<Demo name="skeleton-web-basic" description="行内 / 块级 / 圆形 / 段落四种形状" />

<Demo name="skeleton-web-card" description="拼一个卡片占位，并切换 animated / sharp" />

## 基础用法

```ts
import { SnSkeleton } from '@snui/vue-web'
import '@snui/tokens-web/styles'
```

```html
<SnSkeleton height="24px" width="60%" />
<SnSkeleton circle :height="48" />
<SnSkeleton text width="4em" />
```

`width` / `height` 接受数字（按 px 处理）或任意 CSS 长度。不给尺寸时，高度落回 `size` 档位，再没有就用样式表里的 `1em` / `100%`。

## 尺寸解析顺序

按以下顺序取第一个命中的值：

1. `circle` 会把占位块变成正方形 —— 显式 `width` 同时充当高度，反之亦然（两者都给时 `width` 获胜）。
2. 显式的 `width` / `height` 按原值使用。
3. `size` 档位高度补齐仍然缺失的那一维。

## 圆角

`circle` → `50%`，否则 `round` → `4096px`，否则 `sharp`（默认）→ 交给样式表，否则 `--sn-web-skeleton-radius`。所以 `sharp: false` 才是"用 token 圆角"。

## 形状与动画

```html
<!-- 行内：落在标题里 -->
<h1>标题<SnSkeleton text width="4em" /></h1>

<!-- 段落：重复 3 行 -->
<SnSkeleton repeat="3" height="1em" />

<!-- 关掉闪烁 -->
<SnSkeleton :animated="false" height="1em" />
```

`repeat` 渲染 N 个**并列**块（不是嵌套），每个块独立一个元素。

## API

### SnSkeleton Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `text` | `boolean` | `false` | 行内块，基线偏移 `-0.125em`，可嵌入文本行 |
| `round` | `boolean` | `false` | 两端全圆角（`4096px`） |
| `circle` | `boolean` | `false` | 正方形占位 + `border-radius: 50%` |
| `height` | `string \| number` | `undefined` | 数字按 px，CSS 长度原样透传 |
| `width` | `string \| number` | `undefined` | 数字按 px，CSS 长度原样透传 |
| `size` | `'small' \| 'medium' \| 'large'` | `undefined` | 高度档位，仅在未显式给尺寸时生效 |
| `repeat` | `number` | `1` | 并列块数量，小于 2 按 1 处理 |
| `animated` | `boolean` | `true` | 是否播放闪烁动画 |
| `sharp` | `boolean` | `true` | 保持直角；设 `false` 读取 token 圆角 |

### Tokens

组件消费 `--sn-web-skeleton-*`，它们是 `--aui-*` 的别名：

| Token | 说明 |
| --- | --- |
| `--sn-web-skeleton-color` | 基础填充色 |
| `--sn-web-skeleton-color-end` | 闪烁峰值色 |
| `--sn-web-skeleton-radius` | `sharp: false` 时使用的圆角 |
| `--sn-web-skeleton-height-small` / `-medium` / `-large` | 三档高度 |

## 无障碍

- 每个占位块带 `aria-hidden="true"`，屏幕阅读器直接跳过
- 不给 `role` —— 骨架屏靠布局传达"还没加载"，真正内容挂载后由内容自身的语义接管
- 闪烁动画是背景色渐变而非位移，未加 `prefers-reduced-motion` 抑制；需要关闭时用 `:animated="false"`

## 与 n-skeleton 的差异（§112 future markers）

- 上游按实例输出 `--n-color-start` / `--n-color-end` / `--n-bezier`；本库改为在 CSS 里读取 `--sn-web-skeleton-*` token 块，因此 inline style 只承载几何属性。
- 上游 `repeat` 分支返回 fragment（`<>{...}</>`）；这里外层是一个 `display: contents` 的普通元素，单根模板仍能产出并列块而不引入额外布局盒。
- 上游的 `animation: 2s skeleton-loading infinite cubic-bezier(...)` 与过渡时长（`0.3s`）为硬编码值，未接入 theme token —— tokens 包尚无 motion 别名，SnConfigProvider 也尚未建模。
- 未复刻上游 `useHoudini()` 调用（其为 CSS `@property` 注册准备，本库直接读 token）。

## 相关

- [`SnLoading`](/components/web/loading) —— 请求进行中的阻塞遮罩，而非"内容未到位"的占位
- [`SnCard`](/components/web/card) —— 常作为被骨架化的容器
