# Affix 固钉（Web 端）

`SnAffix` 把内容吸附在视口（或自定义滚动容器）的顶部/底部，滚动回阈值以上时自动释放。

## 何时使用

- 工具栏、操作条需要在长内容滚动时保持可见。
- 侧边栏目录需要跟随滚动停留在视口内。
- 表格的表头或操作列需要在滚动时固定。

不适合：内容本身不滚动时，直接使用普通定位即可。

## 代码演示

### 基础用法

滚动到达阈值后元素吸附在顶部。

<Demo name="affix-web-basic" description="滚动到达阈值后吸附在顶部" />

### 吸附位置

`position` 与 `top` / `bottom` 决定吸附的表现形式。

<Demo name="affix-web-position" description="fixed 与 absolute 两种吸附方式对照" />

## API

### Props

| 名称            | 类型                                                                 | 默认值      | 说明                                                          |
| --------------- | -------------------------------------------------------------------- | ----------- | ------------------------------------------------------------- |
| `position`      | `'fixed' \| 'absolute'`                                              | `'fixed'`   | 吸附时使用的 CSS 定位方式。                                   |
| `top`           | `number`                                                             | `undefined` | 触发顶部固定后的 CSS `top`。未设定时使用 `triggerTop`。       |
| `bottom`        | `number`                                                             | `undefined` | 触发底部固定后的 CSS `bottom`。未设定时使用 `triggerBottom`。 |
| `triggerTop`    | `number`                                                             | `undefined` | 触发顶部固定时与目标元素顶部的距离。未设定时使用 `top`。      |
| `triggerBottom` | `number`                                                             | `undefined` | 触发底部固定时与目标元素底部的距离。未设定时使用 `bottom`。   |
| `listenTo`      | `string \| HTMLElement \| Document \| Window \| (() => HTMLElement)` | `document`  | 需要监听滚动的元素。                                          |
| `target`        | `() => HTMLElement \| undefined`                                     | `undefined` | 计算偏移基准的目标元素。                                      |

### Slots

| 名称      | 参数 | 说明             |
| --------- | ---- | ---------------- |
| `default` | `()` | 需要吸附的内容。 |

## 触发与释放

吸附由两个阈值共同决定：

- **触发**：容器顶部滚过 `triggerTop` 时进入吸附。
- **释放**：容器滚回阈值以上时退出吸附，元素回到文档流中的原始位置。

`top` / `bottom` 决定吸附后的实际定位值；不设置时会回落到对应的 `trigger*` 值，因此简单场景只需要写 `triggerTop`。

## 滚动容器

默认监听整个文档。当页面中只有局部区域滚动时，用 `listenTo` 指向那个滚动容器 —— 传入元素、选择器或返回元素的函数都可以：

```html
<SnAffix :listen-to="() => scrollRef" :trigger-top="0" :top="0">…</SnAffix>
```

## 无障碍

- 吸附是纯视觉行为，不改变元素的语义角色。
- 吸附后的内容仍可被键盘聚焦 —— 组件不对焦点做任何干预。

## 已知取舍

- 吸附元素的 `z-index` 固定为 `10`，尚未通过 token 暴露。
- `position` 逐实例读取，全局默认值未建模。
