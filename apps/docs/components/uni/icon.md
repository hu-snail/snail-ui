# sn-icon 图标

跨端图标基础组件。接收 SVG path 数据对象，渲染成 inline SVG。**按需加载**：每个图标作为独立 ESM 数据模块 named export，bundler tree-shake 掉未引用的图标。

## 为什么不用 lucide-vue-next

`lucide-vue-next` 是 web Vue 3 包装（参考 [官方文档](https://lucide.dev/guide/packages/lucide-vue-next)），uni-app 不能直接用。uni 端传统的 iconfont / SVG sprite 方案都有 bundle 膨胀或动态解析的副作用。

`sn-icon` 走「每个图标 = 一个 ESM 数据模块」：把 lucide 图标的 `<path d="...">` 提取为 IconData，按需 named-import 后渲染成内联 SVG。

## 用法

### 方式 1：使用内置 shortcut icon set

```vue
<script setup lang="ts">
import { SnIcon, type IconData } from '@snui/uni'
import { ChevronRight, Search, Settings } from '@snui/uni'
</script>

<template>
  <SnIcon :icon="ChevronRight" :size="32" />
  <SnIcon :icon="Search" />
  <SnIcon :icon="Settings" />
</template>
```

打包结果：bundle 里只有 ChevronRight + Search + Settings 三个 path 字符串。其余 ~19 个内置图标全部 tree-shake。

> 内置 icon data 在 `@snui/uni` 主入口 named export —— `@snui/uni` 把每个图标数据单独 re-export，bundler 静态分析 `import { A, B, C }` 只打包这三个 path。`SnIcon` 组件本体和 icon data 是两个独立的 ESM 模块，所以 demo 文件也可以拆开 import 路径更清晰：
>
> ```ts
> import SnIcon from '@snui/uni'              // 组件
> import { ChevronRight } from '@snui/uni'    // icon data
> ```

### 方式 2：自定义 IconData（拷贝 lucide 任意 SVG）

```vue
<script setup lang="ts">
import { SnIcon, type IconData } from '@snui/uni'

const MyFlag: IconData = {
  viewBox: '0 0 24 24',
  paths: ['M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z', 'M4 22V15'],
}
</script>

<template>
  <SnIcon :icon="MyFlag" :size="32" />
</template>
```

SVG path 从 https://lucide.dev/icons 复制，ISC 协议可商用。

## 基础用法

<Demo name="icon-mp-basic" description="5 个内置 shortcut 图标（ChevronRight / Search / Settings / Heart / Trash）。每个 named import 是一个独立的 ESM 数据模块。" />

## 尺寸与描边

<Demo name="icon-mp-size" description="五档尺寸（14 / 18 / 24 / 32 / 48）+ 三档描边宽度（1 / 2 / 3）。移动端推荐 32rpx 为默认点击目标。" />

## 自定义 + 按钮集成

<Demo name="icon-mp-registry" description="自定义 IconData + SnButton 的 #icon slot 集成（Plus / 自定义 / X）。" />

## API

### Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| icon | `IconData` | — | 必填，SVG path 数据对象 |
| size | `number \| string` | `32` | 图标尺寸（推荐 rpx） |
| color | `string` | `'currentColor'` | 描边颜色（继承父元素 color） |
| strokeWidth | `number \| string` | `2` | 描边宽度 |
| strokeWidthAbsolute | `boolean` | `false` | 描边按绝对像素 |

`IconData` 接口：

```ts
interface IconData {
  viewBox?: string      // 默认 '0 0 24 24'
  paths: string[]       // 一或多条 SVG <path d="...">
}
```

### 内置图标

`@snui/uni` 主入口提供 ~22 个常用图标 named export：`ChevronRight`、`ChevronLeft`、`ChevronDown`、`ChevronUp`、`ArrowRight`、`ArrowLeft`、`Check`、`X`、`Plus`、`Minus`、`Search`、`Settings`、`User`、`Bell`、`Home`、`Heart`、`Star`、`Trash`、`Edit`、`Download`、`Upload`、`Menu`、`MoreHorizontal`。

更多图标按需扩展：在 `components/sn-icon/icons/` 下新建单文件 `chevron-right.ts`，里面 `export const ChevronRight: IconData = { viewBox, paths }`。

## 跨端渲染

| 端 | 行为 |
| --- | --- |
| H5 | inline SVG，浏览器原生渲染 |
| 微信小程序 | SVG 编译为 image 标签（部分平台非像素完美） |
| App (uni-app x) | 原生 SVG，Webview 层 |
| 抖音 / 支付宝 | 各家 SVG 兼容性不同，通常能渲染 |

## 无障碍

- 默认 `aria-hidden="true"`：图标是装饰元素
- 需要语义时把 `aria-label` 写在包裹图标的外层按钮 / 链接 / 文字标签上

## 相关

- [web 端 SnIcon](/components/web/icon)
- [lucide 官方图标库](https://lucide.dev/icons)