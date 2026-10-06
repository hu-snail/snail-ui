# Card · Web（PC 端）

`<div role="region">` 容器，按顺序区域承载 cover → header → content → footer → action。视觉走 `--sn-web-card-*` Token 别名层（padding / radius / shadow），同时支持 naive-ui `n-card` 1:1 parity 的所有 props 与 slots。

参考库：[naive-ui `n-card`](https://www.naiveui.com/zh-CN/light/components/card)（按 AGENTS.md §112 强约束对齐）。

## 基本用法

<Demo name="card-web" description="默认 variant（带边框）+ elevated variant（无边框 + 阴影）。展示 title + header slot + footer slot + body 内容。" />

## 实时预览

<Demo name="card-web-cover" description="cover 槽位（顶部 banner）+ action 槽位（底部按钮）" />

<Demo name="card-web-footer" description="footer 槽位（时间戳 + 操作）" />

<Demo name="card-web-closable" description="closable: true + @close 事件" />

<Demo name="card-web-hoverable" description="hoverable: true 鼠标悬停上浮（+ elevated 组合）" />

<Demo name="card-web-sizes" description="size 4 档（small / medium / large / huge）— padding + 视觉块体量差异" />

## Props

> 完整 prop 列表与 [naive-ui `n-card`](https://www.naiveui.com/zh-CN/light/components/card) 1:1 对齐。下表标注 `§112 对齐` = naive-ui 同名 prop；`便利 alias` = snail-aui 友好命名，行为映射到对齐 props。

| Prop | Type | Default | 类别 | Description |
| --- | --- | --- | --- | --- |
| `title` | `string \| (() => VNode)` | — | §112 对齐 | 头部标题文本或渲染函数 |
| `contentClass` | `string` | — | §112 对齐 | 内容区 class 名 |
| `contentStyle` | `string \| CSSProperties` | — | §112 对齐 | 内容区 inline style |
| `contentScrollable` | `boolean` | `false` | §112 对齐 | 内容区超长时可滚动（max-height + overflow:auto） |
| `headerClass` | `string` | — | §112 对齐 | 头部 class 名 |
| `headerStyle` | `string \| CSSProperties` | — | §112 对齐 | 头部 inline style |
| `headerExtraClass` | `string` | — | §112 对齐 | 头部右侧区域 class 名 |
| `headerExtraStyle` | `string \| CSSProperties` | — | §112 对齐 | 头部右侧区域 inline style |
| `footerClass` | `string` | — | §112 对齐 | 底部 class 名 |
| `footerStyle` | `string \| CSSProperties` | — | §112 对齐 | 底部 inline style |
| `embedded` | `boolean` | `false` | §112 对齐 | 嵌套卡片模式（去边框 + 阴影） |
| `segmented` | `boolean \| { content?: boolean \| 'soft'; footer?: boolean \| 'soft'; action?: boolean \| 'soft' }` | `false` | §112 对齐 | 区域之间的分割线 |
| `size` | `'small' \| 'medium' \| 'large' \| 'huge'` | `'medium'` | §112 对齐 | padding + font-size 子轴 |
| `bordered` | `boolean` | `true` | §112 对齐 | 是否显示外边框 |
| `closable` | `boolean` | `false` | §112 对齐 | 头部显示关闭按钮（需 `onClose` 才有作用） |
| `hoverable` | `boolean` | `false` | §112 对齐 | hover 时显示上浮视觉效果 |
| `role` | `string` | `'region'` | §112 对齐 | 无障碍 role 属性 |
| `tag` | `keyof HTMLElementTagNameMap` | `'div'` | §112 对齐 | 根节点元素类型 |
| `cover` | `() => VNode` | — | §112 对齐 | 顶部封面区渲染函数 |
| `content` | `string \| (() => VNode)` | — | §112 对齐 | 内容区文本或渲染函数（`default` slot 不传时生效） |
| `footer` | `() => VNode` | — | §112 对齐 | 底部区渲染函数 |
| `action` | `() => VNode` | — | §112 对齐 | 底部下方操作区渲染函数 |
| `headerExtra` | `() => VNode` | — | §112 对齐 | 头部右侧渲染函数 |
| `closeFocusable` | `boolean` | `true` | §112 对齐 | 关闭按钮是否可键盘聚焦 |
| `variant` | `'default' \| 'outlined' \| 'elevated'` | `'default'` | 便利 alias | 映射到 `(bordered, shadow)` 组合（`'elevated'` = 无边框 + 阴影；`'default'`/`'outlined'` = 带边框 + 无阴影） |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | 便利 alias | 映射到 `size`（`'none'` = 不加 size class；`'sm'` = small；`'md'` = medium；`'lg'` = large） |
| `shadow` | `boolean` | `false` | 便利 alias | 是否显示阴影（消费 `--sn-web-card-shadow`） |
| `ariaLabel` | `string` | — | 便利 | 转发到根节点 `aria-label` |

## Events

| Event | Payload | When |
| --- | --- | --- |
| `close` | `()` | 关闭按钮点击（仅当 `closable` 为 true） |

## Slots

| Slot | Description |
| --- | --- |
| `default` | 内容区（与 `content` prop 互斥） |
| `cover` | 顶部封面区（与 `cover` prop 互斥） |
| `header` | 头部区（覆盖 `title` prop） |
| `header-extra` | 头部右侧区（与 `headerExtra` prop 互斥） |
| `footer` | 底部区（与 `footer` prop 互斥） |
| `action` | 底部下方操作区（与 `action` prop 互斥） |

## 区域省略规则

- `header` 仅在 `title` / `header` slot / `headerExtra` / `closable` 任一存在时渲染
- `content` 仅在 default slot / `content` prop 任一存在时渲染
- `footer` 仅在 `footer` slot / `footer` prop 任一存在时渲染
- `action` 仅在 `action` slot / `action` prop 任一存在时渲染
- `cover` 仅在 `cover` slot / `cover` prop 任一存在时渲染

## Accessibility

| Attribute | Value |
| --- | --- |
| `role` | `'region'`（可由 `role` prop 覆盖） |
| `aria-label` | 由 `ariaLabel` prop 转发 |
| `role="heading"` | 头部区域 |
| 关闭按钮 | `aria-label` 来自 `ariaLabel + ' close'` 或默认 `'Close'` |

## 嵌套与子节点

Card 通过 default slot 接收任意子树（按钮、输入、其他 Card 等）。`header` slot 可写自定义标题（含 `<h3>` / `<p>` 子节点）。`header-extra` slot 在头部右侧对齐展示（如时间、标签、链接）。

## Tokens（end: web）

| Token | CSS Variable | 用途 |
| --- | --- | --- |
| Card padding | `--sn-web-card-padding` | 默认内 padding（medium 档） |
| Card radius | `--sn-web-card-radius` | 圆角 |
| Card shadow | `--sn-web-card-shadow` | 阴影（仅当 `shadow=true` 或 `variant='elevated'`） |
| Border default | `--sn-web-color-border-default` | 外边框 / 区域分割线 |
| Text primary | `--sn-web-color-text-primary` | 标题 + 正文 |
| Text secondary | `--sn-web-color-text-secondary` | header-extra + 关闭按钮 |
| Background surface | `--sn-web-color-background-surface` | 卡片背景 |