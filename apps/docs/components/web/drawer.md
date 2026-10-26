# Drawer 抽屉（Web 端）

`SnDrawer` 是从屏幕四边滑入的浮层外壳：遮罩 + 面板 + 方向定位 + 滚动锁 + 焦点管理。面板内部的标题 / 正文 / 底部由配套的 `SnDrawerContent` 渲染。

## 何时使用

- 需要在当前页面上方承载辅助内容，同时保留对背景页面的上下文感。
- 内容量超过对话框能舒适承载的范围（长表单、多段说明、配置面板）。
- 需要用户在一个不离开当前页面的独立空间里完成一段操作。

不适合：只需要一句确认时，用 `SnDialog`；内容需要用户完全沉浸且不返回时，用独立路由。

## 两个组件的分工

抽屉被拆成外壳与内容两层：

| 组件              | 职责                                                         |
| ----------------- | ------------------------------------------------------------ |
| `SnDrawer`        | 遮罩、进出场动画、方向定位、滚动锁、焦点陷阱、尺寸与拖拽调整 |
| `SnDrawerContent` | 面板内的头部（标题 + 关闭按钮）、可滚动主体、底部操作区      |

`SnDrawer` 通过 `default` 插槽接收面板内容，通常传入一个 `<SnDrawerContent>`。不传内容时是一个空白面板。

## 代码演示

### 基础用法

从右侧滑入的标准抽屉。

<Demo name="drawer-web-basic" description="右侧滑入的基础抽屉" />

### 内容骨架

`SnDrawerContent` 的头部 / 主体 / 底部三段结构。

<Demo name="drawer-web-content" description="SnDrawerContent 的三段结构与插槽" />

### 拖拽调整尺寸

开启 `resizable` 后可拖拽或键盘调整面板宽度。

<Demo name="drawer-web-resizable" description="resizable 拖拽与键盘调整，受 min/max 约束" />

### 多层嵌套

每一层抽屉持有独立状态，关闭内层不影响外层。

<Demo name="drawer-web-multiple" description="两层嵌套抽屉，状态彼此独立" />

### 指定挂载容器

用 `to` 把抽屉限制在局部容器内渲染。

<Demo name="drawer-web-target" description="to 指定挂载容器，抽屉被限制在局部区域内" />

### 内容滚动

头部与底部固定，主体区域独立滚动。

<Demo name="drawer-web-scroll" description="长内容下的三段布局：固定头尾 + 滚动主体" />

### 关闭按钮

`closable` 控制标题右侧的关闭按钮，也可以完全交给底部操作区。

<Demo name="drawer-web-closable" description="closable 开关与底部操作区两种退出路径" />

## API

### SnDrawer Props

| 名称               | 类型                                     | 默认值      | 说明                                                                     |
| ------------------ | ---------------------------------------- | ----------- | ------------------------------------------------------------------------ |
| `show`             | `boolean`                                | `false`     | 是否展示抽屉。                                                           |
| `placement`        | `'top' \| 'right' \| 'bottom' \| 'left'` | `'right'`   | 抽屉展示的位置。                                                         |
| `width`            | `number \| string`                       | `undefined` | 抽屉宽度，在位置是 `left` 和 `right` 时生效。                            |
| `height`           | `number \| string`                       | `undefined` | 抽屉高度，在位置是 `top` 和 `bottom` 时生效。                            |
| `defaultWidth`     | `number \| string`                       | `251`       | 拖拽调整的起始宽度，在位置是 `left` 和 `right` 时生效。                  |
| `defaultHeight`    | `number \| string`                       | `251`       | 拖拽调整的起始高度，在位置是 `top` 和 `bottom` 时生效。                  |
| `resizable`        | `boolean`                                | `false`     | 是否允许拖拽调整面板宽高。                                               |
| `maxWidth`         | `number`                                 | `undefined` | 拖拽时的最大宽度（px）。                                                 |
| `maxHeight`        | `number`                                 | `undefined` | 拖拽时的最大高度（px）。                                                 |
| `minWidth`         | `number`                                 | `undefined` | 拖拽时的最小宽度（px）。                                                 |
| `minHeight`        | `number`                                 | `undefined` | 拖拽时的最小高度（px）。                                                 |
| `showMask`         | `boolean \| 'transparent'`               | `true`      | 是否显示遮罩。`'transparent'` 展示透明遮罩；`false` 会同时禁用焦点陷阱。 |
| `maskClosable`     | `boolean`                                | `true`      | 点击遮罩时是否关闭抽屉。                                                 |
| `closeOnEsc`       | `boolean`                                | `true`      | 按下 Escape 是否关闭抽屉。                                               |
| `autoFocus`        | `boolean`                                | `true`      | 打开时是否自动聚焦面板内第一个可聚焦元素。                               |
| `trapFocus`        | `boolean`                                | `true`      | 是否将 Tab 焦点锁定在面板内部。                                          |
| `blockScroll`      | `boolean`                                | `true`      | 打开时是否禁用 `<html>` 滚动。                                           |
| `displayDirective` | `'if' \| 'show'`                         | `'if'`      | 控制内容渲染的指令。`'if'` 用 `v-if`，`'show'` 用 `v-show` 保留节点。    |
| `nativeScrollbar`  | `boolean`                                | `true`      | 是否使用原生滚动容器。                                                   |
| `scrollbarProps`   | `SnDrawerScrollbarProps`                 | `undefined` | 传给滚动容器的属性，支持 `trigger` / `xScrollable` / `onScroll`。        |
| `to`               | `string \| HTMLElement`                  | `'body'`    | 抽屉渲染的目标容器。                                                     |
| `zIndex`           | `number`                                 | `undefined` | 抽屉的层级。                                                             |
| `contentClass`     | `string`                                 | `undefined` | 可滚动内容节点的类名。                                                   |
| `contentStyle`     | `string \| CSSProperties`                | `undefined` | 可滚动内容节点的样式。                                                   |
| `onMaskClick`      | `(e: MouseEvent) => void`                | `undefined` | 点击遮罩时调用（在关闭判定之前）。                                       |
| `onEsc`            | `() => void`                             | `undefined` | 按下 Escape 时调用（在关闭判定之前）。                                   |
| `onAfterEnter`     | `() => void`                             | `undefined` | 进场过渡结束后调用。                                                     |
| `onAfterLeave`     | `() => void`                             | `undefined` | 离场过渡结束后调用。                                                     |

### SnDrawer Events

| 名称            | 参数         | 说明                 |
| --------------- | ------------ | -------------------- |
| `update:show`   | `boolean`    | 显示状态变化。       |
| `update:width`  | `number`     | 拖拽产生了新的宽度。 |
| `update:height` | `number`     | 拖拽产生了新的高度。 |
| `mask-click`    | `MouseEvent` | 遮罩被点击。         |
| `esc`           | `()`         | 按下了 Escape。      |
| `after-enter`   | `()`         | 进场过渡结束。       |
| `after-leave`   | `()`         | 离场过渡结束。       |

### SnDrawer Slots

| 名称      | 参数 | 说明                                   |
| --------- | ---- | -------------------------------------- |
| `default` | `()` | 面板内容，通常是 `<SnDrawerContent>`。 |

### SnDrawerContent Props

| 名称               | 类型                      | 默认值      | 说明                         |
| ------------------ | ------------------------- | ----------- | ---------------------------- |
| `title`            | `string`                  | `undefined` | 标题文字。                   |
| `closable`         | `boolean`                 | `false`     | 是否显示标题右侧的关闭按钮。 |
| `nativeScrollbar`  | `boolean`                 | `true`      | 主体部分是否使用原生滚动条。 |
| `bodyClass`        | `string`                  | `undefined` | 主体区域的类名。             |
| `bodyStyle`        | `string \| CSSProperties` | `undefined` | 主体区域的样式。             |
| `bodyContentClass` | `string`                  | `undefined` | 主体内容节点的类名。         |
| `bodyContentStyle` | `string \| CSSProperties` | `undefined` | 主体内容节点的样式。         |
| `headerClass`      | `string`                  | `undefined` | 头部区域的类名。             |
| `headerStyle`      | `string \| CSSProperties` | `undefined` | 头部区域的样式。             |
| `footerClass`      | `string`                  | `undefined` | 底部区域的类名。             |
| `footerStyle`      | `string \| CSSProperties` | `undefined` | 底部区域的样式。             |

### SnDrawerContent Events

| 名称    | 参数 | 说明             |
| ------- | ---- | ---------------- |
| `close` | `()` | 关闭按钮被点击。 |

### SnDrawerContent Slots

| 名称      | 参数 | 说明                     |
| --------- | ---- | ------------------------ |
| `default` | `()` | 主体内容。               |
| `header`  | `()` | 头部行，替代 `title`。   |
| `footer`  | `()` | 底部行，仅在填充时渲染。 |

## 尺寸与拖拽

`width` / `height` 只在对应方向生效：`width` 作用于 `left` / `right`，`height` 作用于 `top` / `bottom`。

两者都未设置时，面板尺寸交给样式表 —— 此时 `defaultWidth` / `defaultHeight` 不参与。只有在 `resizable` 打开时，它们才作为拖拽的起始值。拖拽过程中组件实时更新面板尺寸，指针抬起时通过 `update:width` / `update:height` 把结果交回宿主，由宿主持有最终值。

拖拽带也可以键盘操作：聚焦后按方向键每次调整 16px，`Home` 跳到最小、`End` 跳到最大。所有结果都会经过 `minWidth` / `minHeight` / `maxWidth` / `maxHeight` 收敛。

## 焦点管理

打开时，`autoFocus` 会把焦点移到面板内第一个可聚焦元素（没有可聚焦内容时落在面板本身）。`trapFocus` 让 Tab 与 Shift+Tab 在面板内循环，`autoFocus` 关闭时陷阱依然生效。

`showMask` 为 `false` 时焦点陷阱会被强制关闭 —— 没有可见的模态边界时，劫持 Tab 会让用户失去对页面的控制。关闭抽屉后，焦点归还给打开它之前持有焦点的元素。

## 无障碍

- 面板 `role="dialog"` + `aria-modal="true"`。
- 开启焦点陷阱时面板带 `tabindex="-1"`，让陷阱有一个可回落的锚点。
- 拖拽带 `role="separator"`，带 `aria-orientation` 与本地化 `aria-label`，可聚焦并支持方向键。
- 关闭按钮是真实的 `<button type="button">`，带 `aria-label="关闭"`。
- 遮罩 `aria-hidden="true"`，不进入可访问性树。

## 主题

两个组件的 token 面都落在样式表里（`--sn-web-drawer-*`），**不输出任何内联主题样式** —— 改主题靠覆盖 token。唯一的内联样式是受 placement 约束的 `width` / `height`，以及调用方自己传的 `contentStyle` 之类的透传。

## 已知取舍

- `nativeScrollbar` 为 `false` 时不做虚拟滚动条替换，只保留原生容器与类名钩子。
- `scrollbarProps` 只应用滚动相关的子集（`trigger` / `xScrollable` / `onScroll`），虚拟滚动条几何参数不适用。
- 全局 drawer 默认值未建模，`placement` 等逐实例读取。
