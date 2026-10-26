# sn-icon — uni 端图标组件

> 跨端图标基础组件。接收 SVG path 数据对象，渲染成 inline SVG。**按需加载**：每个图标作为独立 ESM 数据模块 named export，Rollup / esbuild tree-shake 掉未引用的图标。

## 来源

官方参考：[lucide.dev/guide/packages/lucide-vue-next](https://lucide.dev/guide/packages/lucide-vue-next) + [lucide.dev/icons](https://lucide.dev/icons)

Lucide 是 Feather Icons 的社区 fork，1500+ 个统一 24×24 / 2px 描边风格的 SVG 图标，ISC 协议商用免费。`lucide-vue-next` 是 web Vue 3 包装（uni-app 不能用），所以 uni 端采取 **SVG 数据对象** 方案：把 lucide 图标的 `<path d="...">` 数据提取出来作为 named export，sn-icon 在运行时渲染。

## 为什么不用 iconfont / Sprite

| 方案 | 问题 |
|---|---|
| iconfont | 单个 woff 文件几百 KB，无法 tree-shake，新增要重新生成字体 |
| SVG Sprite (`<use>`) | sprite 文件会越来越大，新增需重新 build |
| lucide-vue-next | web Vue 3 only，不能跨端到 uni-app |

sn-icon 走「每个图标 = 一个 ESM 数据模块」路线。命名 export 让按需加载成为编译期静态分析 —— bundler 看到 `import { ChevronRight } from '@snui/uni'` 只打包这一个 path 数据。

## 用法

### 用法 1：直接传 IconData（最大灵活度）

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SnIcon, type IconData } from '@snui/uni'

const myIcon: IconData = {
  viewBox: '0 0 24 24',
  paths: ['m9 18 6-6-6-6'],
}
</script>

<template>
  <SnIcon :icon="myIcon" :size="32" />
</template>
```

### 用法 2：使用内置 shortcut icon set（按需打包）

```vue
<script setup lang="ts">
import { SnIcon, ChevronRight, Search, Settings } from '@snui/uni'
</script>

<template>
  <SnIcon :icon="ChevronRight" :size="32" />
  <SnIcon :icon="Search" />
  <SnIcon :icon="Settings" />
</template>
```

打包结果：bundle 里只有 ChevronRight + Search + Settings 三个 path 字符串。其余 19 个内置图标全部 tree-shake 掉。

### 用法 3：自定义 icon pack

每个图标一个文件 `src/components/sn-icon/icons/chevron-right.ts`：

```ts
import type { IconData } from '../sn-icon.vue'

export const ChevronRight: IconData = {
  viewBox: '0 0 24 24',
  paths: ['m9 18 6-6-6-6'],
}
```

用户：

```vue
<script setup lang="ts">
import { SnIcon } from '@snui/uni'
import { ChevronRight } from './icons/chevron-right'
</script>

<template>
  <SnIcon :icon="ChevronRight" />
</template>
```

## 跨端渲染

| 端 | 行为 |
|---|---|
| H5 | inline SVG，浏览器原生渲染 |
| 微信小程序 | SVG 编译为 image 标签，部分平台非像素完美 |
| App (uni-app x) | 原生 SVG，Webview 层 |
| 抖音 / 支付宝小程序 | 各家 SVG 兼容性不同，通常能渲染 |

## API

### Props

| 名称 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `icon` | `IconData` | — | 必填，SVG path 数据对象 |
| `size` | `number \| string` | `32` | 图标尺寸（uni 端推荐 rpx） |
| `color` | `string` | `'currentColor'` | 描边颜色（继承父元素 color） |
| `strokeWidth` | `number \| string` | `2` | 描边宽度 |
| `strokeWidthAbsolute` | `boolean` | `false` | 描边是否按绝对像素 |

`IconData` 接口：

```ts
interface IconData {
  viewBox?: string      // 默认 '0 0 24 24'
  paths: string[]       // 一或多条 SVG <path d="...">
}
```

## 可访问性

图标默认 `aria-hidden="true"`，是装饰元素。需要语义时把 aria-label 写在包裹图标的外层按钮 / 链接 / 文字标签上。

## 升级路径

Lucide 偶尔会移除个别图标（特别是品牌图标）。升级前 grep 一遍项目中引用的 icon 名，必要时把旧 path 数据贴到自定义 icon pack 文件继续使用 —— 不要 hack 绕过版本检查。