# Grid 网格（Web 端）

`SnGrid` 是 `@snui/vue-web`（PC 桌面端）的 CSS Grid 容器。基于 `display:grid` + `grid-template-columns:repeat(N,minmax(0,1fr))`，适合等宽多列排版（卡片墙、特性区、表单字段等）。

按 AGENTS.md §112，prop 名义对齐 [naive-ui `n-grid`](https://www.naiveui.com/zh-CN/light/components/grid)。n-grid 的高级参数（`suffix / collapsed` / `collapsedRows` / `layoutShiftDisabled` / 自适应断点观察器等）当前未实现（doc-roadmap 列），需要时再加。

## 实时预览

<Demo name="grid-web-basic" description="3 列 / 4 列基础网格 + xGap / yGap 调整" />

## 基础用法

`SnGrid` 是简单的 CSS Grid 容器，子节点直接成为 grid item：

```ts
import { SnGrid, SnCard } from '@snui/vue-web'
import '@snui/tokens-web/styles'
```

```html
<SnGrid :cols="3" :x-gap="16" :y-gap="16">
  <SnCard v-for="i in 6" :key="i">Card {{ i }}</SnCard>
</SnGrid>
```

## API

### Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `cols` | `number \| string` | `24` | grid 列数 |
| `xGap` | `number \| string` | `0` | 列间距（px） |
| `yGap` | `number \| string` | `0` | 行间距（px） |
| `itemResponsive` | `boolean` | `false` | 启用子节点 resize 监听（n-grid 同名） |
| `itemStyle` | `string \| CSSProperties` | — | 透传到每个直接子节点 |

### Slots

| 名称 | 说明 |
| --- | --- |
| `default` | 直接子节点即 grid item；自动 `min-width:0` 允许长文本 wrap |

## 无障碍

- 容器本身无 role（按需在父级加 `role="list"` / `region`
- 子节点自行设置语义化 role

## 相关

- 表格类复杂排版：未来可补 `SnTable`（n-table 同名）