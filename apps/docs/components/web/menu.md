# Menu 菜单（Web 端）

`SnMenu` 是 `@snui/vue-web`（PC 桌面端）的层级导航菜单，支持 horizontal / vertical 两种模式。v-model:value 同步当前选中项、v-model:expandedKeys 同步展开组（vertical 模式）。

按 AGENTS.md §112，prop 名义对齐 [naive-ui `n-menu`](https://www.naiveui.com/zh-CN/light/components/menu)。n-menu 的高级 prop（`suffix` / `collapsed` / `collapsedWidth` / `layoutSiderInjection` / 树状 label remap 等）当前未实现（doc-roadmap 列），需要时再加。

## 实时预览

<Demo name="menu-web-basic" description="horizontal 模式 + selected state (v-model:value)" />

<Demo name="menu-web-vertical" description="vertical 模式（侧边栏风格）+ accordion 互斥展开" />

<Demo name="menu-web-icons" description="options.icon — 用 SnIcon / lucide 给每项加图标" />

<Demo name="menu-web-inverted" description="inverted: true — 深色背景顶导航（适合 colorful nav bar）" />

<Demo name="menu-web-field-remap" description="label-field / key-field / children-field — 适配 API 树形（不用 reshape 数据）" />

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
| `mode` | `'horizontal' \| 'vertical'` | `'vertical'` | 展示模式（顶导航 vs 侧边栏） |
| `options` | `SnMenuOption[]` | `[]` | 选项树（详见下文） |
| `value` | `string \| number \| null` | `null` | 受控选中 key |
| `defaultValue` | `string \| number \| null` | `null` | 非受控初始 key |
| `expandedKeys` | `Array<string \| number>` | `[]` | 受控展开 key 列表（vertical） |
| `defaultExpandedKeys` | `Array<string \| number>` | `[]` | 非受控初始展开列表 |
| `defaultExpandAll` | `boolean` | `false` | 默认展开所有有子节点的组 |
| `accordion` | `boolean` | `false` | 同时只允许一个 group 展开（手风琴） |
| `indent` | `number` | `32` | 每层 indent 像素（vertical 模式） |
| `inverted` | `boolean` | `false` | 深色背景变体（适合 gradient / dark surface 顶导航） |
| `keyField` | `string` | `'key'` | 树节点的 key 字段名（API 树 remap） |
| `labelField` | `string` | `'label'` | 树节点的 label 字段名 |
| `childrenField` | `string` | `'children'` | 树节点的 children 字段名 |

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
| `select` | `(value, item: SnMenuOption)` | 点击叶子项 |

## 无障碍

- 根 `<nav>` 根据 mode 设置 `role="menubar"` (horizontal) 或 `role="menu"` (vertical)
- 叶子项渲染为 `<a href>` 或 `<button>`，按 `href` 是否有值切换
- 选中叶子项 `aria-current="page"`
- 禁用项 `aria-disabled="true"`
- vertical 子组 header 含 `aria-expanded`

## 相关

- 路由级面包屑：[`SnBreadcrumb`](/components/web/breadcrumb)