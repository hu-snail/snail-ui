# Tabs 标签页（Web 端）

`SnTabs` + `SnTabPane` 是 `@snui/vue-web`（PC 桌面端）的标签页组。四种视觉样式（`bar` / `line` / `card` / `segment`）、标签位置（placement）、触发方式（click / hover）、关闭与新增按 [naive-ui `n-tabs`](https://www.naiveui.com/zh-CN/light/components/tabs) 1:1 对齐（AGENTS.md §112）。

n-tabs 的 `centerActiveTab` / `barWidth`（需 ResizeObserver 测量标签条宽度）与 `SnTabPane` 的 `tab` / `prefix` / `suffix` 富文本 slot 当前未实现，已如实列入 §112 future markers。

## 实时预览

<Demo name="tabs-web-basic" description="默认 type='bar' + v-model:value 受控切换" />

<Demo name="tabs-web-line" description="type='line' — 下划线指示器，最常用于详情页分栏" />

<Demo name="tabs-web-card-segment" description="type='card'（卡片化）与 type='segment'（分段控件）" />

<Demo name="tabs-web-placement-closable" description="placement='left' 竖排 + closable 可关闭 + addable 新增" />

## 基础用法

```ts
import { ref } from 'vue'
import { SnTabs, SnTabPane } from '@snui/vue-web'
import '@snui/tokens-web/styles'

const active = ref('overview')
```

```html
<SnTabs v-model:value="active" type="line">
  <SnTabPane name="overview" tab="概览">
    端云一组功能、组件清单、Token 用法一览。
  </SnTabPane>
  <SnTabPane name="architecture" tab="架构">
    pnpm workspace + 双端别名包。
  </SnTabPane>
  <SnTabPane name="faq" tab="FAQ">
    常见问题与迁移说明。
  </SnTabPane>
</SnTabs>
```

## 切换守卫

`onBeforeLeave` 在切走当前标签前触发，返回 `false` 或 resolve 为 `false` 的 Promise 即可阻止切换（适合「表单未保存」场景）：

```html
<SnTabs v-model:value="active" :on-before-leave="onBeforeLeave">
  <SnTabPane name="edit" tab="编辑">…</SnTabPane>
  <SnTabPane name="preview" tab="预览">…</SnTabPane>
</SnTabs>
```

```ts
async function onBeforeLeave(name: string | number, oldName: string | number) {
  if (oldName !== 'edit') return true
  if (!isDirty.value) return true
  return await confirmDialog('有未保存的改动，确定离开？')
}
```

## API

### SnTabs Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `string \| number` | `undefined` | 当前激活标签名（受控，`v-model:value`） |
| `defaultValue` | `string \| number` | `undefined` | 非受控初始激活标签名 |
| `trigger` | `'click' \| 'hover'` | `'click'` | 标签激活触发方式 |
| `type` | `'line' \| 'card' \| 'bar' \| 'segment'` | `'bar'` | 标签条视觉样式 |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | 标签条尺寸 |
| `placement` | `'top' \| 'right' \| 'bottom' \| 'left' \| 'start' \| 'end'` | `'top'` | 标签条位置（`start`/`end` 为 `left`/`right` 的废弃别名） |
| `closable` | `boolean` | `false` | 每个标签右侧显示关闭按钮 |
| `addable` | `boolean \| { disabled?: boolean }` | `false` | 标签条尾部显示「+」新增标签 |
| `animated` | `boolean` | `false` | 面板切换时附加动画 class |
| `justifyContent` | `'space-between' \| 'space-around' \| 'space-evenly' \| 'center' \| 'start' \| 'end'` | `undefined` | 标签条主轴分布方式 |
| `tabsPadding` | `number` | `0` | 整个标签页容器外层额外内边距（px） |
| `showScrollButton` | `boolean` | `false` | 声明式对齐 n-tabs；当前标签条为裁切而非滚动，此项为 no-op |
| `tabStyle` | `string \| CSSProperties` | `undefined` | 应用于每个标签的内联样式 |
| `tabClass` | `string` | `undefined` | 应用于每个标签的 class |
| `addTabStyle` | `string \| CSSProperties` | `undefined` | 新增标签的内联样式 |
| `addTabClass` | `string` | `undefined` | 新增标签的 class |
| `paneClass` | `string` | `undefined` | 应用于每个面板的 class |
| `paneStyle` | `string \| CSSProperties` | `undefined` | 应用于每个面板的内联样式 |
| `onBeforeLeave` | `(name, oldName) => boolean \| Promise<boolean>` | `undefined` | 切换前守卫，falsy 阻止切换 |

### SnTabPane Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `name` | `string \| number` | — | 父级 SnTabs 内唯一标识（必填） |
| `tab` | `string \| number` | `undefined` | 标签文本，缺省回退到 `name` |
| `disabled` | `boolean` | `false` | 禁用该标签的激活 |
| `displayDirective` | `'if' \| 'show' \| 'show:lazy'` | `'if'` | 隐藏面板策略：卸载 / 保留 DOM / 首次显示后保留 |
| `closable` | `boolean` | `undefined` | 单面板覆盖父级 `closable` |

### SnTabs Events

| 名称 | 载荷 | 触发时机 |
| --- | --- | --- |
| `update:value` | `(value: string \| number)` | 激活标签变化（`v-model:value`） |
| `close` | `(name: string \| number)` | 点击标签关闭按钮 |
| `add` | `()` | 点击新增标签 |

### SnTabs Slots

| 名称 | 说明 |
| --- | --- |
| `default` | 一组 `<SnTabPane>` 子节点 |
| `prefix` | 标签条之前的内容 |
| `suffix` | 标签条之后的内容 |

### SnTabPane Slots

| 名称 | 说明 |
| --- | --- |
| `default` | 面板主体内容 |

## 无障碍

- 标签条 `role="tablist"`，`aria-orientation` 跟随 placement
- 每个标签 `role="tab"` + `aria-selected`
- 禁用标签 `aria-disabled="true"`
- 面板 `role="tabpanel"`，非激活面板 `aria-hidden`
- Roving tabindex：仅当前激活标签可 Tab 聚焦（`tabindex=0`，其余 `-1`）
- 聚焦标签有 `:focus-visible` 焦点环

## 相关

- 与 [`SnMenu`](/components/web/menu) 同属导航组；详情页分栏常配 [`SnCard`](/components/web/card) 使用
