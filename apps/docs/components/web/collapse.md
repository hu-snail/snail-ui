# Collapse 折叠面板（Web 端）

`SnCollapse` + `SnCollapseItem` 是 `@snui/vue-web`（PC 桌面端）的折叠面板组。手风琴（accordion）模式、箭头位置（arrowPlacement）、触发方式（hover / click）按 [naive-ui `n-collapse`](https://www.naiveui.com/zh-CN/light/components/collapse) 1:1 对齐（AGENTS.md §112）。

n-collapse 的高级参数（`displayDirective` 懒渲染策略、`lazyRender`、展开时机动画曲线等）当前未实现（doc-roadmap 列），需要时再加。

## 实时预览

<Demo name="collapse-web-basic" description="basic 模式（多组可同时展开）" />

<Demo name="collapse-web-accordion" description="accordion 模式（互斥展开）+ arrowPlacement='right'" />

<Demo name="collapse-web-bordered" description="bordered: true — 卡片化外框，组间共享分隔线" />

<Demo name="collapse-web-trigger" description="trigger='hover' + displayDirective='show' — 鼠标悬停展开 / DOM 常驻 toggle" />

## 基础用法

```ts
import { ref } from 'vue'
import { SnCollapse, SnCollapseItem } from '@snui/vue-web'
import '@snui/tokens-web/styles'
```

```html
<SnCollapse
  v-model:expanded-names="open"
  :accordion="false"
  arrow-placement="left"
>
  <SnCollapseItem title="概览" name="1">
    端云一组功能、组件清单、Token 用法。
  </SnCollapseItem>
  <SnCollapseItem title="架构" name="2">
    pnpm workspace + 双端别名包。
  </SnCollapseItem>
  <SnCollapseItem title="FAQ" name="faq">
    常见问题。
  </SnCollapseItem>
</SnCollapse>
```

## API

### SnCollapse Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `expandedNames` | `Array<string \| number>` | `[]` | 受控展开 name 列表 |
| `defaultExpandedNames` | `Array<string \| number>` | `[]` | 非受控初始展开 |
| `accordion` | `boolean` | `false` | 一次只展开一个 |
| `arrowPlacement` | `'left' \| 'right'` | `'left'` | 箭头位置 |
| `trigger` | `'click' \| 'hover'` | `'click'` | 展开触发方式 |
| `bordered` | `boolean` | `false` | 卡片化外框（共享分隔线） |
| `displayDirective` | `'show' \| 'if'` | `'if'` | 折叠区切换策略（'show'=常驻 DOM toggle display；'if'=v-if unmount） |

### SnCollapse Props Events

| 名称 | 载荷 | 触发时机 |
| --- | --- | --- |
| `update:expandedNames` | `(names: Array<string \| number>)` | 展开变化（v-model） |
| `itemHeaderClick` | `(name: string \| number)` | 任意 header 点击 |

### SnCollapseItem Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `name` | `string \| number` | `''` | 唯一标识（accordion 时去重） |
| `title` | `string` | `''` | 标题文本 |
| `disabled` | `boolean` | `false` | 禁用展开 |
| `arrow` | `string \| boolean` | `''` | 自定义箭头（true 显示默认 ▸ / 字符串覆盖） |

### SnCollapseItem Slots

| 名称 | 说明 |
| --- | --- |
| `default` | 折叠内容 |
| `header` | 覆盖 `title` prop（高级用法） |
| `header-extra` | 头部右侧追加内容 |

## 无障碍

- 根 `role="region"`
- header `<button>` 自动 `aria-expanded`
- 禁用项 `aria-disabled="true"`
- 键盘：Tab 进入 header → Enter/Space 切换

## 相关

- 常作为 FAQ / Settings 区域的容器，与 [`SnCard`](/components/web/card) 嵌套使用