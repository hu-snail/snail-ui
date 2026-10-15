# Anchor 锚点（Web 端）

`SnAnchor` / `SnAnchorLink` 做页内导航：滚动时高亮当前所在章节的链接，点击链接平滑跳到对应章节。props 与语义按 [naive-ui `n-anchor`](https://www.naiveui.com/zh-CN/light/components/anchor) 1:1 对齐（AGENTS.md §112）。

典型场景：文档侧边目录、长文大纲、设置页的分组跳转。

## 实时预览

<Demo name="anchor-web-basic" description="导轨锚点跟随三个章节，点击跳转" />

<Demo name="anchor-web-variants" description="type=block / showRail=false / affix 三种形态" />

## 基础用法

```ts
import { SnAnchor, SnAnchorLink } from '@snui/vue-web'
import '@snui/tokens-web/styles'
```

```html
<SnAnchor :bound="12">
  <SnAnchorLink title="简介" href="#intro" />
  <SnAnchorLink title="用法" href="#usage">
    <SnAnchorLink title="进阶" href="#advanced" />
  </SnAnchorLink>
</SnAnchor>

<h2 id="intro">简介</h2>
<h2 id="usage">用法</h2>
<h3 id="advanced">进阶</h3>
```

子级 `SnAnchorLink` 放在 `default` 插槽里即可形成两级目录。

## 激活判定

**当前激活的链接 = 最后一个「章节顶部已越过 `bound`」的链接**（`bound` 默认 `12`，即距滚动容器顶部 12px 内视为已到达）。

`ignoreGap` 控制「整段已滚出视口上方」时的行为：

| `ignoreGap` | 章节完全滚过顶部时 |
| --- | --- |
| `false`（默认） | 保持上一个链接激活 |
| `true` | 激活这个已滚过的链接 |

## 形态

```html
<!-- 无导轨的纯列表 -->
<SnAnchor type="block">…</SnAnchor>

<!-- 保留列表结构但隐藏导轨 -->
<SnAnchor :show-rail="false">…</SnAnchor>

<!-- 滚动时把锚点固定在视口 -->
<SnAnchor affix :trigger-top="80" :top="80">…</SnAnchor>
```

`affix` 时其余 affix 相关 props（`listenTo` / `top` / `bottom` / `triggerTop` / `triggerBottom`）会透传给内部 [`SnAffix`](/components/web/affix)。

## 自定义测量基准

默认以 `document` 为基准测量章节位置。锚点位于某个内部滚动容器内时，把 `offsetTarget` 指过去：

```html
<SnAnchor :offset-target="() => scrollRef">…</SnAnchor>
```

接受 `string` 选择器、`Window` / `Document` / `HTMLElement`，或返回元素的 getter。

## API

### SnAnchor Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `type` | `'block' \| 'rail'` | `'rail'` | `rail` 带导轨与滑动指示条；`block` 为普通列表 |
| `showRail` | `boolean` | `true` | 是否显示导轨（`type="block"` 时忽略） |
| `showBackground` | `boolean` | `true` | 是否绘制激活项背后的高亮 |
| `bound` | `number` | `12` | 章节顶部越过多少像素后视为激活 |
| `internalScrollable` | `boolean` | `false` | 为 API 对齐保留，内容按普通文档流渲染 |
| `ignoreGap` | `boolean` | `false` | 整段滚出上方时是否仍激活该链接 |
| `offsetTarget` | `string \| Window \| Document \| HTMLElement \| (() => HTMLElement)` | `document` | 测量章节位置的基准元素 |
| `affix` | `boolean` | `false` | 是否用 `SnAffix` 包裹 |
| `listenTo` | `string \| HTMLElement \| Document \| (() => HTMLElement \| Document)` | `undefined` | 透传给 `SnAffix` |
| `top` / `bottom` | `number` | `undefined` | 透传给 `SnAffix` |
| `triggerTop` / `triggerBottom` | `number` | `undefined` | 透传给 `SnAffix` |
| `offsetTop` / `offsetBottom` | `number` | `undefined` | **@deprecated**，透传给 `SnAffix` |

### SnAnchorLink Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | `''` | 链接文字 |
| `href` | `string` | `undefined` | 目标章节 id，如 `#intro` |

### Slots

| 组件 | 名称 | 说明 |
| --- | --- | --- |
| `SnAnchor` | `default` | `SnAnchorLink` 子项 |
| `SnAnchorLink` | `title` | 链接文字，替代 `title` prop |
| `SnAnchorLink` | `default` | 嵌套的 `SnAnchorLink` 子项 |

### Exposed

| 组件 | 名称 | 类型 | 说明 |
| --- | --- | --- | --- |
| `SnAnchor` | `scrollTo` | `(href: string) => void` | 跳转并激活指定链接 |

## 行为细节

- 滚动监听注册在 `document` 的**捕获阶段**，因此同样能观察到内部滚动容器发出的事件
- 滚动处理按 128ms 做**尾沿节流**
- 点击链接后跳转，并在一个 tick 内抑制滚动处理，避免导轨闪烁
- 挂载时若页面带 `#hash`，会用该 hash 做一次测量，支持深链直达
- `document.fonts.ready` 解析后重测一次 —— Web 字体可能改变章节高度
- 监听器与未执行的节流定时器在卸载时全部释放（AGENTS.md §41 / §82）

## 无障碍

- 每个链接是真实 `<a href="#section">`，可键盘操作，并被朗读为「指向该章节的链接」
- `title` 会同步到锚点的 `title` 属性，提供悬停提示
- 激活态目前仅视觉呈现（颜色与字重），尚未设置 `aria-current`
- 导轨与高亮为纯装饰元素，不参与交互

## 与 n-anchor 的差异（§112 future markers）

- `internalScrollable` 不会把内容包进 `NScrollbar`：本库尚无滚动条组件，该 prop 为 API 对齐保留，内容按普通文档流渲染。
- n-anchor 的后置字体测量走 vooks 的 `onFontsReady`；本实现用 `document.fonts.ready`，不可用时静默跳过。
- 导轨颜色、导轨宽度、链接字号、内边距、圆角为硬编码值，未接入 `AnchorTheme`（`railColor` / `linkColor` / `linkFontSize` / `linkPadding`…），SnConfigProvider 尚未建模。
- 导轨指示条与高亮用 `transition: 0.2s ease`，未使用主题的 `cubicBezierEaseInOut`。

## 相关

- [`SnAffix`](/components/web/affix) —— 锚点的 `affix` 属性由其提供
- [`SnBackTop`](/components/web/back-top) —— 长文的「回到顶部」按钮
