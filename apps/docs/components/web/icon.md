# Icon 图标

基于 [lucide-vue-next](https://lucide.dev/guide/packages/lucide-vue-next) 的图标包装组件。**按需加载**：通过静态 `import { A, B, C } from 'lucide-vue-next'` 让 bundler tree-shake 掉未引用的图标，bundle 里只出现实际用到的几个。

## 按需加载的两种方式

### 方式 1：直接传 icon 组件（最直接、最 tree-shake）

```vue
<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'
import { SnIcon } from '@snui/vue-web'
</script>

<template>
  <SnIcon :icon="ChevronRight" :size="20" />
</template>
```

打包结果：bundle 里只有 `ChevronRight` 这一个图标的 SVG path，其他 1500+ 个图标全部 tree-shake。

### 方式 2：字符串名 + 注册表（动态场景）

适合菜单 / 路由配置由后端返回 icon 字符串的场景。

```vue
<script setup lang="ts">
import { ChevronRight, Settings, Search } from 'lucide-vue-next'
import { registerSnIcons } from '@snui/vue-web'

registerSnIcons({ ChevronRight, Settings, Search })
</script>

<template>
  <SnIcon name="ChevronRight" />
</template>
```

注册表是 plain object literal，bundler 静态分析 `import { A, B, C }` 同样能识别。**不要**用 `import * as Icons from 'lucide-vue-next'` —— 那会把整个图标库打进 bundle。

## 基础用法

<Demo name="icon-web-basic" description="直接传 icon 组件：最直接的按需加载方式，4 个图标各自一个 named import。" />

## 尺寸与描边

<Demo name="icon-web-size" description="五档尺寸（14 / 18 / 24 / 32 / 48）+ 三档描边宽度（1 / 2 / 3）+ 绝对描边（不随 size 缩放）。" />

## 注册表用法

<Demo name="icon-web-registry" description="registerSnIcons({ … }) 注册后用 name 字符串查图标。适合数据驱动菜单 / 路由配置。" />

## API

### Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| icon | `Component` | — | 直接传入图标组件（推荐） |
| name | `string` | — | 从注册表查图标（需要先 `registerSnIcons`） |
| size | `number \| string` | `16` | 图标尺寸（px 或 CSS 长度） |
| color | `string` | `'currentColor'` | 描边颜色 |
| strokeWidth | `number \| string` | `2` | 描边宽度 |
| strokeWidthAbsolute | `boolean` | `false` | true: 描边按绝对像素（不随 size 缩放） |
| defaultClass | `string` | — | 传给内层 SVG 的 class |

`icon` 与 `name` 同时传入时 `icon` 优先；都不传则渲染占位符（开发态提示「icon not registered」）。

### 注册表 API

```ts
import { registerSnIcons, clearSnIcons } from '@snui/vue-web'

registerSnIcons({ ChevronRight, Settings, Search })
clearSnIcons()  // 清空（测试用）
```

## 无障碍

- 默认 `aria-hidden="true"`：图标是装饰元素
- 需要语义时，把 `aria-label` 写在包裹图标的按钮 / 链接 / 文字标签上
- `<button aria-label="关闭"><SnIcon :icon="X" /></button>`

## 与 SnButton 配合

```vue
<SnButton type="primary">
  <template #icon>
    <SnIcon :icon="ChevronRight" :size="16" />
  </template>
  下一步
</SnButton>
```

## 相关

- [uni 端 sn-icon](/components/uni/icon)
- [lucide-vue-next 官方文档](https://lucide.dev/guide/packages/lucide-vue-next)