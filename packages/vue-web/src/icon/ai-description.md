# SnIcon — web 端图标组件

> 包装 Lucide 等基于 Vue 3 的图标库。**真正的按需加载**：通过静态 `import { A, B, C } from 'lucide-vue-next'` 让 bundler (Rollup / esbuild) tree-shake 掉未引用的图标，bundle 里只出现实际用到的几个。

## 来源

官方参考：[lucide.dev/guide/packages/lucide-vue-next](https://lucide.dev/guide/packages/lucide-vue-next)

Lucide 是 Feather Icons 的社区 fork，1500+ 个统一 24×24 / 2px 描边风格的 SVG 图标，ISC 协议商用免费。Vue 3 包装 `lucide-vue-next` 把每个图标做成独立 ESM 导出，天然支持 tree-shaking。

## 两种用法

### 用法 1：直接传 icon 组件（最直接，最 tree-shake）

```vue
<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'
import { SnIcon } from '@snui/vue-web'
</script>

<template>
  <SnIcon :icon="ChevronRight" :size="20" />
</template>
```

打包结果：bundle 里只有 `ChevronRight` 这一个图标的 SVG path，其他 1500+ 个图标全被 tree-shake 掉。

### 用法 2：字符串名 + 注册表（动态场景）

适合菜单 / 路由配置由后端返回 icon name 字符串的场景。

```vue
<!-- app entry / once at bootstrap -->
<script setup lang="ts">
import { ChevronRight, Settings, Search } from 'lucide-vue-next'
import { registerSnIcons } from '@snui/vue-web'

registerSnIcons({ ChevronRight, Settings, Search })
</script>

<!-- anywhere in the app -->
<template>
  <SnIcon name="ChevronRight" />
</template>
```

注册表是 plain object literal，bundler 静态分析 `import { A, B, C } from 'lucide-vue-next'` 同样能 tree-shake。

## 为什么不用 `import * as`

```ts
// ✗ 反面：把整个图标库打进 bundle
import * as Icons from 'lucide-vue-next'
const icon = computed(() => Icons[props.name])
```

这种写法 vite/Rollup 都无法 tree-shake —— `Icons` 是个完整 namespace 对象，bundler 没法静态推断哪些 key 会被用到。结果就是 1500+ 个 SVG 全部进 bundle，体积膨胀几百 KB。

## API

### Props

| 名称 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `icon` | `Component` | — | 直接传入图标组件（推荐） |
| `name` | `string` | — | 从注册表查图标 |
| `size` | `number \| string` | `16` | 图标尺寸（px 或 CSS 长度） |
| `color` | `string` | `'currentColor'` | 描边颜色（默认继承父元素 color） |
| `strokeWidth` | `number \| string` | `2` | 描边宽度（设计单位） |
| `strokeWidthAbsolute` | `boolean` | `false` | true: 描边宽度按绝对像素（不随 size 缩放） |
| `defaultClass` | `string` | — | 传给 SVG 内部的 class |

`icon` 与 `name` 同时传入时 `icon` 优先；都不传则渲染 placeholder（开发态提示「icon not registered」，生产环境可通过 CSS 隐藏）。

### 注册表 API

```ts
import { registerSnIcons, clearSnIcons } from '@snui/vue-web'

registerSnIcons({ ChevronRight, Settings, Search })  // 注册（合并）
clearSnIcons()                                       // 清空（测试用）
```

## 与 SnButton 配合

```vue
<SnButton type="primary">
  <template #icon>
    <SnIcon :icon="ChevronRight" :size="16" />
  </template>
  下一步
</SnButton>
```

## 可访问性

图标默认 `aria-hidden="true"`，是装饰元素。**需要为屏幕阅读器提供语义时，把 aria-label 写在包裹图标的按钮 / 链接 / 文字标签上**，而不是图标本身。

```vue
<button aria-label="关闭">
  <SnIcon :icon="X" />
</button>
```

## Token 规划（待定）

后续会把 icon size / stroke 提到 token 层（`--sn-web-icon-size-{tiny/small/medium/large}`），目前 props 直传即可。

## 升级路径

lucide 偶尔会移除个别图标（特别是品牌图标 GitHub、Chrome 等）。升级前先在项目内 grep 一遍 deprecated 名称，必要时把旧 SVG 文件作为自定义图标继续使用 —— 不要 hack 绕过版本检查。