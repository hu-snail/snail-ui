# Button 按钮

最常用的交互组件，触发一个操作。支持多种类型、尺寸、状态、变体。

## 基础用法

<Demo name="button-web-basic" description="6 种语义类型：default / primary / info / success / warning / error。" />

## 尺寸

5 档 `tiny` / `small` / `medium` / `large` / `huge`，对应 `--sn-web-button-height-{size}`。

<Demo name="button-web-size" description="5 档高度，覆盖从紧凑列表到首屏 CTA 的全部场景。" />

## 块级与圆角

<Demo name="button-web-shape" description="block 占满父容器宽度，round 应用胶囊形圆角。" />

## 状态

<Demo name="button-web-state" description="disabled 完全禁用；loading 显示 spinner 且不可点击；可手动触发 loading 状态。" />

## 变体：`text` / `ghost` / `dashed`

<Demo name="button-web-variant" description="text 文字按钮、ghost 透明边框、dashed 虚线边框。" />

## 强调梯度（`circle` / `strong` / `secondary` / `tertiary` / `quaternary`）

<Demo name="button-web-emphasis" description="circle 圆形仅图标；strong 主色阴影；secondary / tertiary / quaternary 文字变体强调梯度。" />

## 自定义颜色（`color`）

<Demo name="button-web-color" description="color prop 设置自定义 CSS 颜色 → `--sn-button-color`。" />

## 根标签切换（`tag` — `<a>` / `<div>` / `<span>`）

<Demo name="button-web-tag" description="tag='a' 渲染为 link；tag='div' 渲染为容器；默认 tag='button'。" />

## 图标位置 + 显示开关（`iconPlacement` + `showIcon`）

<Demo name="button-web-icon-placement" description="iconPlacement 'right' 把图标放右边；showIcon false 完全隐藏图标（loading 仍可显示）。" />

## 原生 type + 可聚焦（`attrType` + `focusable`）

<Demo name="button-web-attr-type" description="attrType 提交表单；focusable false 移除 tab 焦点。" />

## API

### Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `type` | `'default' \| 'primary' \| 'info' \| 'success' \| 'warning' \| 'error' \| 'tertiary'` | `'default'` | 按钮语义类型（naive-ui n-button）。 |
| `size` | `'tiny' \| 'small' \| 'medium' \| 'large' \| 'huge'` | `'medium'` | 按钮尺寸。 |
| `block` | `boolean` | `false` | 块级（占满父容器宽度）。 |
| `round` | `boolean` | `false` | 胶囊形（`border-radius: 999px`）。 |
| `circle` | `boolean` | `false` | 圆形（正方形 padding）。 |
| `text` | `boolean` | `false` | 文字按钮 — 透明背景、无边框。 |
| `ghost` | `boolean` | `false` | 透明背景 + 着色边框。 |
| `dashed` | `boolean` | `false` | 虚线边框。 |
| `secondary` | `boolean` | `false` | 反色 hover（视觉变体）。 |
| `tertiary` | `boolean` | `false` | 弱化主色填充（soft-bg variant）。 |
| `quaternary` | `boolean` | `false` | 文字型 tertiary。 |
| `strong` | `boolean` | `false` | 加重阴影（实心按钮）。 |
| `color` | `string` | — | 自定义 CSS 颜色；`--sn-button-color` token 覆盖 type 配色。 |
| `tag` | `'button' \| 'a' \| 'div' \| 'span'` | `'button'` | 根元素。`a` 时 `disabled` 失效（HTMLAnchorElement 不支持）。 |
| `attrType` | `'button' \| 'submit' \| 'reset'` | `'button'` | 原生 `<button>` 的 type 属性（naive-ui `attr-type`）。 |
| `htmlType` *(deprecated)* | `'button' \| 'submit' \| 'reset'` | — | `attrType` 的 legacy alias。 |
| `disabled` | `boolean` | `false` | 禁用。 |
| `loading` | `boolean` | `false` | 加载中（spinner + 阻止 click）。 |
| `focusable` | `boolean` | `true` | 是否可 tab 聚焦。 |
| `icon` | `IconComponent` | — | 直接传 lucide 组件。 |
| `iconName` | `string` | — | 通过 `registerSnIcons` 解析。 |
| `iconPlacement` | `'left' \| 'right'` | `'left'` | 图标位置（naive-ui `icon-placement`）。 |
| `iconSize` | `number \| string` | `14` | 图标 px / CSS 长度。 |
| `showIcon` | `boolean` | `true` | 是否显示图标。`false` 隐藏（loading 仍显示 spinner）。 |
| `bordered` *(deprecated)* | `boolean` | `true` | 旧 border 标志。naive-ui 没这个 prop，保留仅作 back-compat。 |
| `ariaLabel` | `string` | — | 无障碍标签。 |

### Events

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `click` | `(event: MouseEvent)` | 点击按钮触发；`disabled` / `loading` 时不触发。 |

### Slots

| 名称 | 说明 |
| --- | --- |
| `default` | 按钮内容。 |
| `icon` | 自定义图标（替代默认 icon 渲染）。 |
| `loading` | 自定义加载图标（替代默认 spinner）。 |

## 无障碍

- 使用原生 `<button>` 元素（除非 `tag='a'`），`role="button"`
- `disabled` 时设置 `aria-disabled="true"`
- `loading` 时设置 `aria-busy="true"`
- 支持 `aria-label` 覆盖
- 键盘 Enter / Space 原生触发 click
- `focusable={false}` 时 `tabindex=-1`

## 相关

- [uni 端 sn-button](/components/uni/button)（含 open-type / hover-class / cell 等移动端能力）