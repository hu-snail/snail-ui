# Menu 菜单（Web 端）

`SnMenu` 是 `@snui/vue-web`（PC 桌面端）的层级导航菜单，支持 horizontal / vertical 两种模式。v-model:value 同步当前选中项、v-model:expandedKeys 同步展开组（vertical 模式）。

prop 命名与语义遵循本库的双端契约。支持 `collapsed` icon-only 折叠模式 + hover popover 子菜单（CSS 实现，不需要 portal）。

## 实时预览

<Demo name="menu-web-basic" description="horizontal 模式 + selected state (v-model:value)" />

<Demo name="menu-web-vertical" description="vertical 模式（侧边栏风格）+ accordion 互斥展开" />

<Demo name="menu-web-icons" description="options.icon — 用 SnIcon / lucide 给每项加图标" />

<Demo name="menu-web-inverted" description="inverted: true — 深色背景顶导航（适合 colorful nav bar）" />

<Demo name="menu-web-field-remap" description="label-field / key-field / children-field — 适配 API 树形（不用 reshape 数据）" />

<Demo name="menu-web-collapsed" description="collapsed icon-only 折叠模式 + hover popover 子菜单" />

<Demo name="menu-web-collapsed-inline" description="通过 collapsed 来指定菜单收起 —— 顶部 toggle 按钮驱动 v-model:collapsed" />

<Demo name="menu-web-responsive-collapse" description="设置 breakpoint 可触发响应式收缩 —— 视口低于阈值时自动折叠成 icon-only 侧栏" />

<Demo name="menu-web-inline-submenu" description="菜单内可以嵌入多个子项，通过 defaultExpandedKeys（文档中常称 openKeys）可以设置默认打开的子项" />

<Demo name="menu-web-pop-button" description="popButton FAB 菜单：默认只显示 trigger，hover 整个区域展开其余圆形按钮，每项 hover 显示 SnTooltip 文字" />

## 基础用法

```ts
import { ref } from 'vue'
import { SnMenu } from '@snui/vue-web'
import type { SnMenuOption } from '@snui/vue-web'

const nav: SnMenuOption[] = [
  { key: '/guide', label: '指南', href: '/guide/web/intro' },
  { key: '/components/web', label: '组件 · Web', href: '/components/web/button' },
  { key: '/style-packs', label: '风格包', href: '/style-packs/overview' },
]

const active = ref<string | null>(null)
```

```html
<SnMenu mode="horizontal" :options="nav" v-model:value="active" />
```

带子节点的 vertical 用法：

```html
<SnMenu
  mode="vertical"
  :options="tree"
  v-model:value="active"
  v-model:expanded-keys="expanded"
  :accordion="true"
  :indent="32"
/>
```

## API

### Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `mode` | `'horizontal' \| 'vertical' \| 'popButton'` | `'vertical'` | 展示模式。`vertical` 侧边栏、`horizontal` 顶导航、`popButton` 浮动按钮菜单：所有项渲染为圆形 icon 按钮，**默认只显示 trigger（options 最后一项，可用 `triggerKey` 覆盖）**，hover 整个 menu 区域后其余按钮淡入上滑展开，单项 hover 显示 `SnTooltip` 文字。组件不再自带 viewport 定位 —— 包一层 `position: relative` 父容器即可放在你想要的任何位置 |
| `triggerKey` | `string \| number` | `''` | popButton 模式下指定哪个 item 是 trigger（默认最后一项）。`key` 必须匹配 `SnMenuOption.key` |
| `options` | `SnMenuOption[]` | `[]` | 选项树（详见下文） |
| `value` | `string \| number \| null` | `null` | 受控选中 key |
| `defaultValue` | `string \| number \| null` | `null` | 非受控初始 key |
| `expandedKeys` | `Array<string \| number>` | `[]` | 受控展开 key 列表（vertical） |
| `defaultExpandedKeys` | `Array<string \| number>` | `[]` | 非受控初始展开列表 |
| `defaultExpandAll` | `boolean` | `false` | 默认展开所有有子节点的组 |
| `accordion` | `boolean` | `false` | 同时只允许一个 group 展开（手风琴） |
| `indent` | `number` | `32` | 每层 indent 像素（vertical 模式） |
| `inverted` | `boolean` | `false` | 深色背景变体（适合 gradient / dark surface 顶导航） |
| `collapsed` | `boolean` | `false` | 折叠模式（vertical）：只显示 icon，子菜单 hover 弹出 popover |
| `collapsedWidth` | `number` | `48` | 折叠模式容器宽度（px） |
| `collapsedIconSize` | `number` | `24` | 折叠模式 icon 尺寸（px） |
| `iconSize` | `number` | `20` | 正常模式 icon 尺寸（px） |
| `dropdownPlacement` | `'right-start' \| 'right' \| 'right-end' \| 'bottom-start' \| 'bottom'` | `'right-start'` | 折叠模式下子菜单 popover 位置 |
| `keyField` | `string` | `'key'` | 树节点的 key 字段名（API 树 remap） |
| `labelField` | `string` | `'label'` | 树节点的 label 字段名 |
| `childrenField` | `string` | `'children'` | 树节点的 children 字段名 |
| `disabledField` | `string` | `'disabled'` | 树节点的 disabled 字段名 |
| `breakpoint` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| number` | `undefined` | 视口宽度响应式断点。`undefined` 表示关闭。设置后：当 `window.innerWidth` 严格小于阈值时菜单自动折叠，并通过 `update:collapsed` 事件回写给消费者。命名断点对应像素值：`xs=480` / `sm=768` / `md=992` / `lg=1200` / `xl=1920`（px）；也可直接传像素数字。SSR / 非浏览器环境不安装 resize 监听 |
| `defaultCollapsed` | `boolean` | `false` | 仅在 `breakpoint` 生效时使用 —— 视口宽度在初始测量时低于阈值时的初始折叠态（受控用 `collapsed` + `v-model:collapsed`） |

### SnMenuOption

```ts
interface SnMenuOption {
  key: string | number
  label: string
  children?: SnMenuOption[]       // vertical 模式生效
  disabled?: boolean
  href?: string                  // 传了就渲染为 <a>
  icon?: Component               // 每项可选图标（SnIcon / lucide 等）
}
```

> 通过 `keyField` / `labelField` / `childrenField` 三个 prop，可直接消费 API
> 返回的树而不必 reshape。详见上面 `menu-web-field-remap` demo。

### Events

| 名称 | 载荷 | 触发时机 |
| --- | --- | --- |
| `update:value` | `(value: string \| number \| null)` | 选中变化（v-model） |
| `update:expandedKeys` | `(keys: Array<string \| number>)` | 展开变化（v-model） |
| `update:collapsed` | `(collapsed: boolean)` | 折叠态变化（v-model）。`breakpoint` 路径在 resize 跨越阈值时触发；消费者也可直接驱动 `collapsed` |
| `select` | `(value, item: SnMenuOption)` | 点击叶子项 |

## 无障碍

- 根 `<nav>` 根据 mode 设置 `role="menubar"` (horizontal) 或 `role="menu"` (vertical)
- 叶子项渲染为 `<a href>` 或 `<button>`，按 `href` 是否有值切换
- 选中叶子项 `aria-current="page"`
- 禁用项 `aria-disabled="true"`
- vertical 子组 header 含 `aria-expanded`

## 相关

- 路由级面包屑：[`SnBreadcrumb`](/components/web/breadcrumb)
- 圆形按钮上的悬浮文字：[`SnTooltip`](/components/web/tooltip)