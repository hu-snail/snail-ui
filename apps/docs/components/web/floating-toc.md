# FloatingToc 悬浮目录（Web 端）

`SnFloatingToc` 是贴在页面边缘的悬浮目录：收起时是一列短横线的浮标，跟随滚动位置高亮当前章节；悬停、聚焦或点击后展开成可点击的章节列表。

## 何时使用

- 长文档、规范、条款页需要持续可见的定位控件。
- 正文区域不宜放常驻侧边栏（宽度紧张）时，用悬浮目录节省版面。

不适合：页面本身较短（不需要滚动）时，不要引入这个组件。

## 代码演示

### 基础用法

浮标跟随滚动容器高亮当前章节，悬停展开章节列表。

<Demo name="floating-toc-web-basic" description="浮标跟随滚动高亮，悬停展开章节列表" />

### 左右两侧与触发方式

`placement` 控制浮标贴哪一侧，`trigger-mode="press"` 改为点击展开。

<Demo name="floating-toc-web-placements" description="左侧 hover 与右侧 press 两种形态" />

### 分层目录

`level` 让深层条更短、面板条目缩进，用来表达章节层级。

<Demo name="floating-toc-web-hierarchical" description="level 1/2/3 的层级表达" />

### 单条预览模式

`hover-action="preview"` 让悬停只浮出单条的标题与摘要，完整列表留给点击或键盘聚焦 —— 两种浮层互斥，不会叠在一起。

<Demo name="floating-toc-web-preview" description="悬停单条出摘要，点击展开完整列表" />

### 受控展开

传 `open` 完全接管展开状态，`open-change` 回显每次变化。

<Demo name="floating-toc-web-controlled" description="open 受控 + open-change 回显" />

## 组合结构

`SnFloatingToc` 是复合组件，四件套按下面的层级组合：

```vue
<SnFloatingToc placement="right">
  <SnFloatingTocTrigger>
    <SnFloatingTocBar href="#intro" title="简介" />
    <SnFloatingTocBar href="#usage" title="用法" :level="2" />
  </SnFloatingTocTrigger>
  <SnFloatingTocContent aria-label="页面目录">
    <SnFloatingTocItem href="#intro" />
    <SnFloatingTocItem href="#usage" :level="2" />
  </SnFloatingTocContent>
</SnFloatingToc>
```

| 部件                   | 职责                                               |
| ---------------------- | -------------------------------------------------- |
| `SnFloatingToc`        | 根：展开状态、placement、延迟、章节登记与滚动测量  |
| `SnFloatingTocTrigger` | 浮标的指针 / 聚焦 / 键盘交互目标                   |
| `SnFloatingTocBar`     | 单条指示线，同时是章节登记入口（`href` / `title`） |
| `SnFloatingTocContent` | 展开后的浮层面板                                   |
| `SnFloatingTocItem`    | 面板中可点击的章节条目                             |

## API

### SnFloatingToc Props

| 名称              | 类型                      | 默认值      | 说明                                                                                                              |
| ----------------- | ------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------- |
| `placement`       | `'left' \| 'right'`       | `'right'`   | 浮标所在的一侧。                                                                                                  |
| `triggerMode`     | `'hover' \| 'press'`      | `'hover'`   | `hover` 悬停 / 聚焦按延迟展开；`press` 点击切换。                                                                 |
| `hoverAction`     | `'open' \| 'preview'`     | `'open'`    | 指针停在浮标上时做什么：`open` 展开完整面板（HeroUI 行为）；`preview` 只显示单条标题与摘要，面板留给点击 / 键盘。 |
| `open`            | `boolean`                 | `undefined` | 受控展开状态。不传则由组件自己管理。                                                                              |
| `defaultOpen`     | `boolean`                 | `false`     | 非受控时的初始展开状态。                                                                                          |
| `openDelay`       | `number`                  | `200`       | 悬停 / 聚焦后展开的延迟（毫秒，仅 hover 模式）。                                                                  |
| `closeDelay`      | `number`                  | `300`       | 指针 / 聚焦离开后收起的延迟（毫秒，仅 hover 模式）。                                                              |
| `scrollContainer` | `string \| HTMLElement`   | `undefined` | 滚动容器。省略时取章节最近的可滚动祖先，兜底为 document。                                                         |
| `bound`           | `number`                  | `0`         | 判定激活的基准线距容器顶部的距离。正值让切换更晚，负值更早。                                                      |
| `onOpenChange`    | `(open: boolean) => void` | `undefined` | 展开状态变化时调用。                                                                                              |

### SnFloatingTocBar Props

| 名称      | 类型      | 默认值      | 说明                                                          |
| --------- | --------- | ----------- | ------------------------------------------------------------- |
| `href`    | `string`  | `''`        | 章节锚点（`'#intro'`），同时是章节登记的唯一键。              |
| `title`   | `string`  | `''`        | 章节标题，展开面板中对应条目会复用它。                        |
| `level`   | `number`  | `1`         | 层级，1 为顶层。层级越深指示线越短。                          |
| `active`  | `boolean` | `undefined` | 强制高亮。省略时由根组件按滚动位置判定。                      |
| `summary` | `string`  | `''`        | 悬停预览中的一行摘要。省略时自动取该章节元素文本的前 120 字。 |

### SnFloatingTocContent Props

| 名称        | 类型                | 默认值      | 说明                                                              |
| ----------- | ------------------- | ----------- | ----------------------------------------------------------------- |
| `offset`    | `number`            | `8`         | 面板与浮标之间的距离（px）。                                      |
| `placement` | `'left' \| 'right'` | `undefined` | 面板所在一侧。默认取根组件 placement 的**反面**，即朝向页面正文。 |
| `ariaLabel` | `string`            | `undefined` | 面板的无障碍名称（`role="dialog"`）。                             |

### SnFloatingTocItem Props

| 名称     | 类型      | 默认值      | 说明                                      |
| -------- | --------- | ----------- | ----------------------------------------- |
| `href`   | `string`  | `''`        | 点击后跳转的章节锚点。                    |
| `title`  | `string`  | `''`        | 条目文案，省略时复用同名 bar 的 `title`。 |
| `level`  | `number`  | `1`         | 层级，越深层级缩进越多。                  |
| `active` | `boolean` | `undefined` | 强制高亮。                                |

### SnFloatingTocTrigger Props

无自有 props，只负责指针、聚焦与键盘交互；原生 `span` 属性透传。

### Events

| 名称          | 参数      | 说明           |
| ------------- | --------- | -------------- |
| `open-change` | `boolean` | 展开状态变化。 |

### Slots

| 部件    | 名称      | 说明                   |
| ------- | --------- | ---------------------- |
| 根      | `default` | Trigger + Content。    |
| Trigger | `default` | 指示线（Bar）列表。    |
| Bar     | `default` | 自定义指示线内容。     |
| Content | `default` | 章节条目（Item）列表。 |
| Item    | `default` | 自定义条目文案。       |

### Exposed

| 名称         | 类型                      | 说明                                      |
| ------------ | ------------------------- | ----------------------------------------- |
| `activeHref` | `string \| null`          | 当前激活章节的 `href`。                   |
| `setOpen`    | `(open: boolean) => void` | 程序化展开 / 收起。                       |
| `refresh`    | `() => void`              | 重新测量章节位置。                        |
| `preview`    | `object \| null`          | 当前显示的单条预览；面板展开后为 `null`。 |

## 激活判定

当前章节 = 视口顶越过 `bound` 线的最后一个章节；在没有任何章节越过之前，第一条保持激活，浮标不会“空着”。

`bound` 与 `SnAnchor` 同名同符号：`0` 即视口顶部，正值把基准线下移（切换更晚），负值上移（切换更早）。

## 两种悬停模式

`hoverAction` 决定指针停在浮标上时出现什么，两种模式互斥，不会同时叠出两个浮层：

| 值             | 悬停时                      | 展开完整列表            |
| -------------- | --------------------------- | ----------------------- |
| `open`（默认） | 展开完整面板（HeroUI 行为） | 悬停即展开              |
| `preview`      | 浮出单条标题 + 摘要卡片     | 点击 Trigger 或键盘聚焦 |

`open` 模式下指针进入即展开，卡片会与面板重复，所以此时不渲染预览。`preview` 模式下指针只出卡片，面板不会自动展开；但**键盘聚焦始终能打开完整面板**，保证只用键盘的用户也能拿到全部章节。

摘要有两个来源：显式传入的 `summary` 优先；否则取章节元素自身的文本，压缩空白并截断到 120 字。所以页面上只要写了标题和段落，就不必额外维护一份摘要。

卡片是 `pointer-events: none`（不会抢走产生它的悬停），并在面板展开时自动消失。

## 受控与非受控

不传 `open` 时由组件自己维护展开状态，延迟、点击、键盘都作用于内部状态。

传 `open` 后组件不再改动内部状态，只通过 `open-change` 通知宿主，由宿主决定是否更新。

指针点击与键盘激活的语义不同：hover 模式下点击 Trigger 只“确认”展开（因为指针进入时面板通常已经打开），不会把它关掉；`Enter` / `Space` 在两种模式下都保持切换。press 模式下点击仍是切换。

## 滚动容器

省略 `scrollContainer` 时，组件从第一个章节元素向上寻找最近的可滚动祖先；找不到就用 document。文档站、弹窗、分栏等场景建议显式传入，避免误判。

## 无障碍

- 根节点是 `<nav aria-label="Table of contents">`，浮标是带名称的导航地标。
- Trigger 为 `role="button"`、`tabindex="0"`、`aria-haspopup="dialog"`、`aria-expanded`，`:focus-visible` 有焦点环。
- 面板为 `role="dialog"`，请通过 `aria-label` 或 `aria-labelledby` 命名。
- 条目是真实 `<button type="button">`，激活项带 `aria-current="location"`。
- 收起态的指示线是装饰性的（`aria-hidden`）：它面向鼠标操作，键盘等价路径是 Trigger 的方向键与面板条目，因此不会额外增加 Tab 停留点。
- 键盘：`Enter` / `Space` 切换，`Escape` 关闭，`ArrowUp` / `ArrowDown` 在章节间移动并滚动过去。
- 尊重 `prefers-reduced-motion: reduce`：章节跳转改为瞬时定位。

## 主题

组件消费 `--sn-web-*` token（见下方表格），同时暴露一组 HeroUI 同名的局部变量，可在任意祖先元素上覆盖来调尺寸与配色：

`--floating-toc-bar-width`（16px）、`--floating-toc-bar-active-width`（24px）、`--floating-toc-bar-height`（2px）、`--floating-toc-bar-level-step`（3px）、`--floating-toc-bar-gap`（12px）、`--floating-toc-item-indent`（0.75rem）、`--floating-toc-content-width`（224px）—— 以及 AUI 追加的 `--floating-toc-preview-width`（232px，悬停预览宽度）—— 和 `--floating-toc-color-bar`、`--floating-toc-color-active`。

| Token                                | 用途                   |
| ------------------------------------ | ---------------------- |
| `--sn-web-color-action-primary`      | 激活条 / 激活条目颜色  |
| `--sn-web-color-border-default`      | 未激活指示线、面板描边 |
| `--sn-web-color-background-elevated` | 面板背景               |
| `--sn-web-color-background-subtle`   | 条目悬停背景           |
| `--sn-web-color-background-overlay`  | 条目按下背景           |
| `--sn-web-color-text-primary`        | 条目悬停文字           |
| `--sn-web-color-text-secondary`      | 条目默认文字           |
| `--sn-web-color-text-disabled`       | 禁用条目文字           |
| `--sn-web-font-size-sm`              | 条目字号               |
| `--sn-web-font-weight-medium`        | 激活条目字重           |
| `--sn-web-shadow-lg`                 | 面板阴影               |
| `--sn-web-radius-full`               | 指示线圆角             |
| `--sn-web-spacing-6`                 | 距视口边缘距离         |
| `--sn-web-focus-ring`                | 键盘焦点环             |

## 参考与差异

naive-ui 没有同类组件，本组件属 AUI 追加，API 1:1 对齐 **HeroUI Pro `FloatingToc`**（https://heroui.pro/docs/react/components/floating-toc）。

相对 HeroUI 的差异（均为追加，不改变已有语义）：

- `Bar` / `Item` 增加了 `href` / `title`：React 版从自身树读取章节，Vue 里改由 bar 承担章节登记。
- 增加 `scrollContainer` 与 `bound` 两个 prop（`bound` 沿用 SnAnchor 的命名与符号）。
- 面板不经过 Teleport，直接挂在固定定位的根节点内。
- 悬停预览（`summary` 与自动摘要）及 `--floating-toc-preview-width` 属 AUI 追加，HeroUI 的 Bar 没有 tooltip。

## 已知取舍

- 尚未实现 HeroUI 的浮层碰撞翻转（窄视口下面板不会自动翻到另一侧）。
- 面板尺寸沿用 token 硬编码，`SnConfigProvider` 暂无 FloatingTocTheme。
