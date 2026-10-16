# Anchor 锚点（Web 端）

`SnAnchor` / `SnAnchorLink` 做页内导航：滚动时高亮当前所在章节的链接，点击链接平滑跳到对应章节。

## 何时使用

- 长文档、长表单、设置页，需要一份跟随滚动位置变化的目录。
- 页面被拆成若干可独立定位的章节，用户需要在章节间快速跳转。

不适合：内容只有一两屏时，目录的收益低于它占用的空间。

## 代码演示

### 基础用法

轨道风格的锚点，滚动时高亮跟随。

<Demo name="anchor-web-basic" description="轨道锚点跟踪三个章节" />

### 高亮判定

`ignoreGap` 决定高亮是等章节越过边界，还是跟随精确区域。

<Demo name="anchor-web-ignore-gap" description="ignoreGap 两种判定方式的对照" />

### 吸附固定

`affix` 让锚点像 `SnAffix` 一样固定在视口。

<Demo name="anchor-web-affix" description="affix 模式下的粘性导航" />

### 程序化跳转

宿主自己驱动滚动，与链接点击保持同步。

<Demo name="anchor-web-scrollto" description="宿主按钮触发跳转，锚点高亮跟随" />

### 样式变体

`type` / `showRail` / `showBackground` 的视觉组合。

<Demo name="anchor-web-variants" description="rail 与 block 风格 + 轨道/背景开关" />

## API

### SnAnchor Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `type` | `'rail' \| 'block'` | `'rail'` | 风格。`'rail'` 为轨道风格，`'block'` 为块状风格。 |
| `showRail` | `boolean` | `true` | 是否展示侧面的轨道。 |
| `showBackground` | `boolean` | `true` | 是否展示链接的背景。 |
| `bound` | `number` | `12` | 触发锚点切换的偏移量。 |
| `ignoreGap` | `boolean` | `false` | 设为 `true` 时导航显示在准确的 `href` 区域。 |
| `internalScrollable` | `boolean` | `false` | 是否由锚点自身承载滚动。 |
| `offsetTarget` | `string \| HTMLElement \| (() => HTMLElement)` | `document` | 计算偏移位置所相对的元素。 |
| `affix` | `boolean` | `false` | 是否像 `SnAffix` 一样展示。为 `true` 时额外接受 `SnAffix` 的 props。 |
| `listenTo` | `string \| HTMLElement \| Document \| Window \| (() => HTMLElement)` | `document` | 需要监听滚动的元素。 |
| `top` | `number` | `undefined` | 触发顶部固定后的 CSS `top`。 |
| `bottom` | `number` | `undefined` | 触发底部固定后的 CSS `bottom`。 |
| `triggerTop` | `number` | `undefined` | 触发顶部固定时与目标元素顶部的距离。 |
| `triggerBottom` | `number` | `undefined` | 触发底部固定时与目标元素底部的距离。 |
| `offsetTop` | `number` | `undefined` | 顶部偏移量。 |
| `offsetBottom` | `number` | `undefined` | 底部偏移量。 |

### SnAnchorLink Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | `''` | 链接文字。 |
| `href` | `string` | `undefined` | 目标锚点，形如 `#section-id`。 |

### Slots

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `default` | `()` | 锚点链接列表。 |
| `sub` / `default`（Link） | `()` | 链接内的自定义内容。 |

## 高亮判定

默认情况下，锚点会在章节越过容器顶部边界时才切换高亮 —— 这样在章节较长时高亮更稳定。

`ignoreGap` 设为 `true` 后，高亮改为跟随读者当前所处的精确 `href` 区域，章节边界一进入视口就切换。

`bound` 是这套判定的偏移量，用来抵消固定头部遮挡的高度。

## 吸附模式

`affix` 为 `true` 时，锚点会像 `SnAffix` 一样吸附在视口内，并额外接受 `top` / `bottom` / `triggerTop` / `triggerBottom` 等 props 控制吸附行为。

## 无障碍

- 锚点容器是一组链接，可用键盘 Tab 遍历。
- 链接使用原生 `<a href>`，无 JS 时仍能跳转。
- 激活项有视觉区分。

## 已知取舍

- 激活链接未设置 `aria-current`，可访问性标注待补。
- 后置字体测量使用 `document.fonts.ready`，在不支持该 API 的环境静默跳过。
