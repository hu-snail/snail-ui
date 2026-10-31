# sn-icon 图标

跨端图标基础组件。四条渲染路径：**iconfont 字形**（`name` + `classPrefix`）、**内置图标目录**（string `icon`）、**第三方图标源按需加载**（Iconify / 自定义 Provider）、**inline SVG 数据**（`IconData` 对象）。全部路径共用同一个 `size` / `color` / 描边契约。

## 用法

### 方式 1：string icon — 内置图标库（推荐）

```vue
<script setup lang="ts">
import { SnIcon } from '@snui/uni';
</script>

<template>
  <SnIcon icon="arrow-down" />
  <SnIcon icon="search" :size="20" />
  <SnIcon icon="circle-check" color="#34d399" />
</template>
```

`icon` 为字符串时按顺序解析：`registerSnIcons()` 注册表 → 内置目录。内置目录收录 **111 个常用图标 × 7 个分类**（方向 / 操作 / 提示 / 编辑 / 界面 / 文件 / 数据），数据来自 lucide（ISC 协议）， stroke 风格与 lucide 渲染一致。

同名注册可覆盖目录条目（品牌定制不改组件）：

```ts
import { registerSnIcons, type IconData } from '@snui/uni';

const BrandStar: IconData = { paths: ['M12 2l2.94 5.95 ...'] };
registerSnIcons({ star: BrandStar }); // 此后 <SnIcon icon="star" /> 渲染 BrandStar
```

<Demo name="icon-mp-string" description="string icon API：内置目录名称直接渲染；registry 同名覆盖；与 SnButton 的 #icon slot 集成。" />

### 内置图标库总览（搜索 + 分类）

Showcase 页内置完整目录浏览：搜索框（匹配英文名 / 中文标签 / 关键词）+ 分类筛选 + 网格卡片，点击卡片复制图标名。

<Demo name="icon-mp-gallery" description="内置 111 个图标 × 7 分类总览：搜索（中英文/关键词）、分类 chips、网格卡片（点击复制名称）。" />

目录 API（自定义面板复用同一数据源）：

```ts
import {
  SN_ICON_CATALOG,          // 全部条目 { name, category, zh, keywords, data }
  SN_ICON_CATEGORY_LABELS,  // 分类元数据（key → { zh, en }）
  searchSnIconCatalog,      // (query, category?) => SnIconCatalogEntry[]
} from '@snui/uni';
```

### 方式 2：Iconify 按需加载（第三方图标库）

`icon` 写成 `collection:name`（或显式 `iconify:collection:name`）即可使用 [Iconify](https://iconify.design) 的 20 万+ 图标（mdi / tabler / ph / logos…）。组件按需请求 SVG 文档并渲染，内置 **模块级缓存**（同 URL 只请求一次）、**15s 超时**、**卸载中断**（AbortSignal）与失败降级（结构化警告 + 空渲染，不打断页面）。

```vue
<template>
  <SnIcon icon="mdi:home" :size="28" color="#0052d9" />
  <SnIcon icon="logos:vue" :size="28" />
</template>
```

- 显式 `color` 通过 Iconify 的 `color` 参数烘焙进请求；`currentColor`（默认）在远程 SVG 文档中无法继承，会渲染为黑色 —— 需要主题色请显式传。
- 离线 / 内网应用可关闭网络回退：`configSnIcons({ iconify: false })`；也可 `configSnIconify({ apiBase, timeout, request })` 指向自建代理或注入自有请求实现。

<Demo name="icon-mp-iconify" description="Iconify 按需加载：mdi/tabler/logos/ph 四个第三方图标，显式 color 烘焙，重新加载按钮验证缓存。" />

### 方式 3：自定义图标源 Provider

任意 `prefix:rest` 形式路由到注册的 Provider，可返回 `IconData`（inline SVG 渲染）或图片 URL 字符串（background-image / `<image>` 渲染）：

```ts
import { registerSnIconProvider } from '@snui/uni';

registerSnIconProvider('app', {
  resolve: (name, ctx) => fetchMyIcon(name, ctx), // IconData | string | Promise<...>
});
```

```vue
<SnIcon icon="app:logo" />
```

### 方式 4：阿里 iconfont（字体图标）

`name` 走 wot-ui 兼容的字形路径：渲染 `<view class="{classPrefix}-{name}">`，字体文件与样式表由宿主 app 提供。阿里 [iconfont.cn](https://www.iconfont.cn) 项目生成的类名符合 `{prefix}-{name}` 约定（默认前缀 `sn-icon`），建好项目后把 `@font-face` + 类样式引入全局样式即可；要兼容 `wd-icon-*` 字体改 `class-prefix="wd-icon"`。颜色走 CSS `color` 继承，跨端一致性最好。

<Demo name="icon-mp-name" description="name + class-prefix 生成的 iconfont 类名：默认 sn-icon-home，class-prefix 改成 wd-icon 后为 wd-icon-home。" />

`css-icon` 传字符串时该 class 原样挂载（无前缀），适合自定义命名的图标子集 / 背景图方案。

<Demo name="icon-mp-css" description="css-icon 传字符串 class 原样渲染；css-icon 布尔形式 + name 同时挂两个类名。" />

### 方式 5：IconData 对象（tree-shakeable）

```vue
<script setup lang="ts">
import { SnIcon, ChevronRight, type IconData } from '@snui/uni';

const MyFlag: IconData = {
  viewBox: '0 0 24 24',
  paths: ['M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z', 'M4 22V15'],
};
</script>

<template>
  <SnIcon :icon="ChevronRight" :size="32" />
  <SnIcon :icon="MyFlag" />
</template>
```

`@snui/uni` 主入口的 shortcut set（`ChevronRight`、`Search`、`Settings` 等 ~22 个）保持 tree-shakeable：named import 只打包引用到的图标。

`IconData` 支持可选字段 `render: 'stroke' | 'fill'`（默认 `'stroke'`）。lucide 形态的路径是轮廓线，按 stroke 描出；Material Symbols / Material Icons 的路径是实心轮廓面，必须声明 `render: 'fill'` 才会按填充渲染（`strokeWidth` 不参与）。

## 基础用法

<Demo name="icon-mp-basic" description="5 个内置 shortcut 图标（ChevronRight / Search / Settings / Heart / Trash）。每个 named import 是一个独立的 ESM 数据模块。" />

## 尺寸与描边

<Demo name="icon-mp-size" description="五档尺寸（14 / 18 / 24 / 32 / 48）+ 三档描边宽度（1 / 2 / 3）。移动端推荐 32rpx 为默认点击目标。" />

## 自定义 + 按钮集成

<Demo name="icon-mp-registry" description="自定义 IconData + SnButton 的 #icon slot 集成（Plus / 自定义 / X）。" />

## 根节点自定义类名与样式（`customClass` / `customStyle`）

`customClass` 追加到 sn-icon 根节点类名，`customStyle` 与尺寸盒子合并 —— 字符串形式整体写入根节点样式（会覆盖默认 `width` / `height`），对象形式与尺寸合并。需要给图标加边框、内边距或底色时用它们；只改颜色优先用 `color`。

<Demo name="icon-mp-custom" description="customClass 加虚线框；customStyle 字符串改颜色 / 内边距 / 底色；两者叠加；color prop 对照。" />

## API

### Props

| 名称                | 类型                              | 默认值           | 说明                                                                                       |
| ------------------- | --------------------------------- | ---------------- | ------------------------------------------------------------------------------------------ |
| icon                | `IconData \| string`              | —                | SVG 数据对象；或字符串：registry → 内置目录 → Provider（`prefix:rest`）依次解析             |
| size                | `number \| string`                | `32`             | 图标尺寸（推荐 rpx）                                                                       |
| color               | `string`                          | `'currentColor'` | 描边颜色（继承父元素 color；Iconify 路径会烘焙进请求）                                     |
| strokeWidth         | `number \| string`                | `2`              | 描边宽度                                                                                   |
| strokeWidthAbsolute | `boolean`                         | `false`          | 描边按绝对像素                                                                             |
| name                | `string`                          | `''`             | iconfont 字形名，渲染 `{classPrefix}-{name}`（与 `icon` 同时给出时优先）                    |
| classPrefix         | `string`                          | `'sn-icon'`      | iconfont 类名前缀                                                                          |
| cssIcon             | `boolean \| string`               | `false`          | 传字符串时该 class 原样渲染（不加前缀）；布尔值 + name 时两种类名同时挂                    |
| customClass         | `string`                          | `''`             | 根节点追加类名                                                                             |
| customStyle         | `string \| Record<string,string>` | `''`             | 根节点内联样式                                                                             |

`IconData` 接口：

```ts
interface IconData {
  viewBox?: string; // 默认 '0 0 24 24'
  paths: string[]; // 一或多条 SVG <path d="...">
}
```

### 模块级 API

| 函数 / 常量                                                  | 说明                                                          |
| ------------------------------------------------------------ | ------------------------------------------------------------- |
| `SN_ICON_CATALOG`                                            | 内置目录全部条目（name / category / zh / keywords / data）    |
| `SN_ICON_CATEGORY_LABELS`                                    | 分类元数据（key → `{ zh, en }`）                              |
| `searchSnIconCatalog(query, category?)`                      | 目录搜索（英文名 / 中文 / 关键词，大小写不敏感子串匹配）      |
| `registerSnIcons(map)` / `clearSnIcons()` / `resolveIconByName(name)` | IconData 注册表（优先级高于目录）                    |
| `registerSnIconProvider(prefix, provider)`                   | 注册 `prefix:rest` 图标源                                     |
| `configSnIcons({ iconify })`                                 | `false` 关闭 Iconify 回退；对象形式透传 Iconify 配置          |
| `configSnIconify({ apiBase, timeout, request })`             | Iconify 服务配置（默认官方 API / 15s / fetch→uni.request）    |

## 跨端渲染

| 端              | 行为                                                                        |
| --------------- | ---------------------------------------------------------------------------- |
| H5              | inline SVG，浏览器原生渲染，`currentColor` 生效                             |
| 微信小程序      | SVG 数据经 image 语义渲染；Iconify / 远程路径走 background-image data URL    |
| App (uni-app x) | 转换管线把两条 SVG 路径统一替换为 `<image>` + SVG data URL（补丁见 uni-x）   |

## 无障碍

- 默认 `aria-hidden="true"`：图标是装饰元素
- 需要语义时把 `aria-label` 写在包裹图标的外层按钮 / 链接 / 文字标签上

## 相关

- [web 端 SnIcon](/components/web/icon)
- [lucide 官方图标库](https://lucide.dev/icons)
- [Iconify](https://iconify.design) / [iconfont.cn](https://www.iconfont.cn)

