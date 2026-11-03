# @snui/admin-layout — 中后台布局模板

> **职责边界（先读这一段）**
>
> 本包**只处理布局问题**：区域编排（logo / 侧栏 / 顶栏 / 内容 / 页脚）、
> 布局形态与切换、折叠状态、菜单的渲染与点击事件。
>
> 本包**不处理任何功能业务**：不做登录鉴权、不发请求、不管 Token / Store、
> 不注册路由、不解析权限。菜单数据从哪来（静态路由 or 后端接口）、点了菜单
> 之后跳到哪，全部由宿主应用决定——本包只 emit `select(key)`。

## 安装

```bash
pnpm add @snui/admin-layout
# 前置依赖（已使用 @snui/vue-web 的项目天然满足）：
#   @snui/vue-web >= 0.1（含其 styles，token 层从它来，本包不重复产出）
```

## 布局形态

参考 vue-element-admin / vben-admin / ant-design-pro 的常见形态，内置四种：

| `layout`  | 结构                                                       | 参考原型                  |
| --------- | ---------------------------------------------------------- | ------------------------- |
| `side`    | 左侧栏（logo + 纵向菜单）+ 顶栏（折叠钮 / 面包屑 / 操作区） | vue-element-admin 经典款  |
| `top`     | 顶栏（logo + 横向一级菜单 + 操作区）+ 内容                  | ant-design-pro top        |
| `mix`     | 顶栏放一级菜单，侧栏只放当前一级的二级菜单                  | vben-admin mixed-nav      |
| `dual`    | 图标栏（一级）+ 二级菜单列 + 内容                           | vben-admin mixed-sidebar 系 |

`v-model:layout` 受控，宿主可以在设置面板里做形态切换器（见文档站 demo）。

## 快速开始：替换你的 layout.vue

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { SnProLayout, routesToMenuOptions } from '@snui/admin-layout';

const route = useRoute();
const router = useRouter();

// 静态路由：从本地路由表读菜单（meta.title / meta.icon / meta.hidden / meta.order）
const menus = routesToMenuOptions(router.options.routes);
const layout = ref<'side' | 'top' | 'mix' | 'dual'>('side');
</script>

<template>
  <SnProLayout
    v-model:layout="layout"
    logo="https://example.com/logo.png"
    title="Admin"
    :menus="menus"
    :active-key="route.name"
    :breadcrumb="['工作台', '首页']"
    @select="(key) => router.push({ name: key })"
  >
    <RouterView />
  </SnProLayout>
</template>
```

## 组件

| 组件            | 职责                                                                       |
| --------------- | -------------------------------------------------------------------------- |
| `SnProLayout`   | 主编排：四种形态的几何与菜单位置、折叠状态、面包屑、页脚插槽、设置抽屉与标签栏接线 |
| `SnProLogo`     | logo 组件：图标 / 图片 + 标题，折叠时收起标题，插槽可整体替换              |
| `SnProSider`    | 左侧栏组件：logo + 纵向 SnMenu，折叠 / 深色（inverted）                    |
| `SnProHeader`   | 顶部导航组件：折叠钮 + 横向菜单 + 面包屑 + 操作区插槽 + 设置齿轮            |
| `SnProTabbar`   | 访问路由标签栏：基于 SnTabs 的五种样式，逐签关闭（affix 签由宿主传 `closable: false`） |
| `SnProSettings` | 布局偏好抽屉：四形态卡片 / 亮暗模式 / 主色色板 / 标签栏样式，受控 props 省略即隐藏对应分区 |

六个组件都可单独引入自行编排（`SnProLayout` 内部就是用它们拼的）。

## 标签栏与设置面板

两者都走「包管渲染、宿主管状态」的受控模式——标签列表、主题模式、主色
预设全部由宿主持有并持久化，包只 emit 事件：

```vue
<SnProLayout
  v-model:layout="layout" v-model:mode="mode" v-model:primary-id="primaryId"
  v-model:tab-type="tabType"
  show-settings :settings-labels="labels" :primary-colors="colors"
  show-tabs :tabs="tabs"
  @tab-select="(key) => router.push({ name: key })"
  @tab-close="closeTab"
>
```

- `tabs: SnProTabItem[]`（`{ key, label, closable? }`）由宿主按访问路由维护，
  固定签传 `closable: false`；
- 设置面板文案经 `settingsLabels` 本地化（包内不内置 i18n，未传的键用内置中文兜底）；
- `mode` / `primaryId` / `tabType` 省略时对应分区隐藏（纯 additive）。

## 菜单来源

```ts
// A. 静态路由读取（纯函数，不依赖 vue-router 实例）
import { routesToMenuOptions } from '@snui/admin-layout';
const menus = routesToMenuOptions(routes, {
  iconMap: { dashboard: DashboardIcon }, // meta.icon 字符串 → 图标组件
});

// B. 动态菜单（后端返回）：宿主自己映射成 SnMenuOption[] 结构
//    { key, label, children?, icon?, disabled? }
//    本包不内置任何请求 / store 逻辑。
```

两种来源最终都是同一份 `SnMenuOption[]`，布局对来源无感知。

## 完整契约

组件级机器可读契约见 [`src/pro-layout/ai-description.md`](./src/pro-layout/ai-description.md)；
文档站「模板 → 中后台布局」页含四形态实时预览与切换 demo。

## 状态

`@experimental`（v0.1，Public API 未冻结）。
