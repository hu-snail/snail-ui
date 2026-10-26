# BackTop 回到顶部（Web 端）

`SnBackTop` 是滚动超过阈值后浮出的「回到顶部」按钮，点击后带平滑动画滚回容器顶部。

## 何时使用

- 页面或容器内容较长，用户需要快速返回顶部。
- 列表浏览到中后段时，提供一个低干扰的返回入口。

不适合：内容本身就是短页面（不需要滚动）时，不要引入这个按钮。

## 代码演示

### 基础用法

滚动超过 200px 后浮出按钮。

<Demo name="back-top-web-basic" description="滚动超过 200px 后浮出按钮" />

### 显示阈值

`visibilityHeight` 控制按钮出现的滚动距离。

<Demo name="back-top-web-visibility-height" description="三档 visibilityHeight 的浮现时机对照" />

### 调整位置

`right` / `bottom` 决定按钮距容器右下角的距离。

<Demo name="back-top-web-change-position" description="四个角落各挂一个按钮" />

### 自动绑定容器

省略 `listen-to` 时，按钮向上寻找最近的可滚动祖先。

<Demo name="back-top-web-target-container" description="不传 listen-to，自动绑定最近的可滚动祖先" />

### 受控显示

用 `show` 完全接管按钮的显隐。

<Demo name="back-top-web-control" description="show 受控模式与事件回显" />

## API

### Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `show` | `boolean` | `undefined` | 是否显示按钮（受控）。`undefined` 表示由滚动位置决定。 |
| `right` | `string \| number` | `40` | 距容器右侧的偏移。 |
| `bottom` | `string \| number` | `40` | 距容器底部的偏移。 |
| `to` | `string \| HTMLElement` | `'body'` | 按钮渲染的目标容器。 |
| `visibilityHeight` | `number` | `180` | 触发显示的滚动高度。 |
| `listenTo` | `() => HTMLElement \| undefined` | `undefined` | 监听滚动的元素。省略时自动寻找最近的可滚动祖先。 |
| `target` | `() => HTMLElement \| undefined` | `undefined` | 滚动容器的取值函数，用于计算偏移基准。 |
| `onUpdateShow` | `(value: boolean) => void` | `undefined` | 显示状态变化时调用。 |
| `onShow` | `() => void` | `undefined` | 按钮出现时调用。 |
| `onHide` | `() => void` | `undefined` | 按钮隐藏时调用。 |

### Events

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `update:show` | `boolean` | 显示状态变化。 |
| `show` | `()` | 按钮出现。 |
| `hide` | `()` | 按钮隐藏。 |

### Slots

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `default` | `()` | 自定义按钮内容，替代内建图标。 |

## 受控与非受控

不给 `show` 时，按钮的显隐由 `listenTo` 容器的滚动位置决定 —— 滚过 `visibilityHeight` 即出现，滚回阈值以上即消失。

显式传入 `show` 会接管这个判定，滚动不再影响显隐，此时完全由宿主控制。

## 容器绑定

两种绑定方式：

- **显式**：传 `listenTo`，返回要监听滚动的元素。适合按钮与滚动容器不在同一子树内的场景。
- **自动**：省略 `listenTo`，组件从自身位置向上走，找到第一个可滚动的祖先节点。适合按钮就挂在滚动容器内部的情况。

`to` 控制按钮自身渲染到哪里，默认挂到 `body`，避免被滚动容器的 `overflow` 裁切。

## 无障碍

- 按钮是真实的 `<button type="button">`，带 `aria-label="回到顶部"`。
- 可用键盘聚焦并触发。
- 尊重 `prefers-reduced-motion: reduce`：滚动回顶部时不再平滑动画。

## 主题

组件消费 `--sn-web-back-top-*` token 别名，改主题靠覆盖 token。

## 已知取舍

- 图标由 `SnIcon` 渲染，与本库图标策略一致。
- 未处理「锁定 `<html>` 滚动条导致的宽度补偿」。
- 出场过渡使用普通淡出，首次绘制的过渡抑制未实现。
