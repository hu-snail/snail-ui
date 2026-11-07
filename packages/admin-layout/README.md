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

## 布局风格（按需引入）

本包支持**多种布局风格并存**，每种风格是独立入口 + 独立样式文件，按需加载：

| 风格       | 组件                 | 入口 / 样式                                                                  | 结构                                                       |
| ---------- | -------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `standard` | `SnProLayout`        | `@snui/admin-layout/layouts/standard` + `.../layouts/standard/style.css`      | 四形态壳（side / top / mix / dual）                        |
| `classic`  | `SnProLayoutClassic` | `@snui/admin-layout/layouts/classic` + `.../layouts/classic/style.css`        | 经典企业后台：分类侧栏 + 内容区顶部通栏 + 模块标题带        |
| `aurora`   | `SnProLayoutAurora`  | `@snui/admin-layout/layouts/aurora` + `.../layouts/aurora/style.css`          | 通屏背景 + 顶部条（logo / 二级模块 / 工具区）+ 悬浮一级图标栏 |
| —          | `ProWorkbench`       | `@snui/admin-layout/workbench` + `.../workbench/style.css`                   | 通用工作台统计页（ECharts）：布局无关，三种风格共用              |

```ts
// 只引一种风格（推荐）：产物里只带这一种壳的代码与样式
import { SnProLayoutClassic } from '@snui/admin-layout/layouts/classic';
import '@snui/admin-layout/layouts/classic/style.css';

// 或者整包 + 全量样式（旧用法，仍然可用）
import { SnProLayout, SnProLayoutClassic } from '@snui/admin-layout';
import '@snui/admin-layout/styles';
```

三种风格复用同一批**共享件**（`SnProLogo` / `SnProSearch` / `SnProNotice` /
`SnProUser`）与同一份菜单工具，差异只在「壳」。每个子入口的样式表都是自包含的
（只含该风格的壳 + 它用到的共享件规则）；子入口是各自独立的 JS 产物，因此同时
引入多种风格时共享件会各存一份——只用一个风格时无此问题。

### classic 风格

```
[左侧栏 siderWidth/siderCollapsedWidth]     [内容区]
 ├ 品牌区 SnProLogo                         ├ 顶栏：折叠钮 · 面包屑 · 搜索 · 通知 · #actions
 ├ 菜单 SnMenu(vertical, 分类 + 子菜单)      ├ 模块标题带：pageTitle / #title
 └ 用户卡片 SnProUser（#user 可替换）        ├ 内容：浅色通屏 + 默认插槽
                                             └ 页脚（可选 #footer）
```

菜单点击 / 搜索命中 / 通知点击 / 用户卡片点击分别 emit `select` /
`search-select` / `notice-select` / `user-select`，导航与业务仍在宿主。
架构决策见 [`.ai/decisions/0008-admin-layout-multi-style.md`](../../.ai/decisions/0008-admin-layout-multi-style.md)。

### aurora 风格

```
[顶部条 header]  品牌 SnProLogo(#logo) · 二级菜单模块(#modules) · 右侧工具区
                 └ 亮暗切换(#theme-toggle) · 搜索(#search) · 中英切换(#locale)
                   · 消息通知(#notice) · 个人信息(#user) · #actions
[悬浮图标栏 rail] 一级菜单图标（拉平层级，悬浮圆角面板，#rail-menu 可替换）
                 └ 底部：退出登录(#logout) · 帮助说明(#help)
[内容区 main]     模块标题带(#title / pageTitle) · 默认插槽 · 页脚(#footer)
```

半透明浮层，背景从面板后面、圆角外的缝隙里都透出来）—— 背景属于布局内部，不是把布局放在一张页面上。
半透明浮层，背景从面板后面、圆角外的缝隙里都透出来）—— 背景属于布局内部，不是把布局放在一张页面上。

**通屏背景可配置**（`background`）：

| `background` | 效果             | 配置                                   |
| ------------ | ---------------- | -------------------------------------- |
| `solid`      | 纯色（token 面） | —                                      |
| `image`      | 背景图（cover）  | `backgroundImage`                      |
| `gradient`   | 渐变光晕（默认） | `backgroundColors?`（默认取 token 主色） |
| `mesh`       | 弥散（四向色斑） | `backgroundColors?`                    |

`backgroundColors` 只给调色板，形状与模糊在样式里；纯函数 `auroraBackgroundVars()`
负责把预设翻译成 CSS 变量（`--sn-pro-aurora-glow-*` / `--sn-pro-aurora-bg-image`），
宿主任意祖先都可覆写这些变量或 `--sn-pro-aurora-glow-opacity` / `-mesh-opacity` / `-glow-blur`。

交互一律 emit，业务留在宿主：`select` / `search-select` / `notice-select` /
`notice-read-all` / `user-select` / `update:mode` / `update:locale` / `logout` / `help`。
布局只做「切到另一面 / 另一语种」的受控或非受控开关，不引主题引擎、不内置 i18n。

## 工作台（ProWorkbench）

三种布局风格的 demo 内容区都是**同一个工作台**：一屏统计（高亮账户卡 + 收入 / 支出卡 + 交易记录表 +
资金流水面积图 + 收入来源环形图），换壳时内容一个数字都不动 —— 这就是「布局只负责壳」的可视证明。

```ts
import { ProWorkbench } from '@snui/admin-layout/workbench';
import '@snui/admin-layout/workbench/style.css';
```

它**不在整包 barrel 里**，因为它牵 `@snui/echarts`；只要布局壳的宿主不该被动背上图表引擎
（AGENTS.md §81）。样式也是独立的：`workbench/style.css` 只含工作台自己的规则，`SnChart` 的样式来自
宿主已引的 `@snui/echarts/styles`。

数据全走 props（`kpis` / `moneyFlow` / `incomeSources` / `transactions`），交互全走 emit
（`action` / `kpi-action` / `kpi-select` / `range-change` / `transaction-select`），
`#kpi` / `#chart` / `#income` / `#transactions` / `#actions` 可整替。
aurora 这类自带标题带的壳传 `:show-heading="false"`，避免同一个标题出现两次。

图表配色是**数据**不是组件样式（canvas 里没有 CSS 变量），所以序列色写在 option 里；
其余颜色都是 `--sn-pro-workbench-*` 钩子，默认取 `--sn-web-*` token，跟随宿主主题。

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
| `SnProLayout`   | `standard` 风格主编排：四种形态的几何与菜单位置、折叠状态、面包屑、页脚插槽、设置抽屉与标签栏接线 |
| `SnProLayoutClassic` | `classic` 风格编排：分类侧栏 + 用户卡片 + 内容区顶部通栏（面包屑 / 搜索 / 通知 / 动作）+ 模块标题带 |
| `SnProLayoutAurora` | `aurora` 风格编排：通屏背景（纯色 / 背景图 / 光晕 / 弥散）+ 顶部条（logo / 二级模块 / 亮暗 · 搜索 · 中英 · 通知 · 个人信息）+ 悬浮一级图标栏（底部退出 / 帮助） |
| `SnProSearch`   | 通用菜单检索：跨层级命中 + 父级路径 + 键盘可达；匹配规则在纯函数 `searchMenuOptions` |
| `SnProNotice`   | 消息通知：铃铛 + 未读角标（`${max}+` 封顶）+ 面板，`#panel` 可整体替换 |
| `SnProUser`     | 侧栏底部用户卡片：头像 + 名称 / 描述 + 下拉，折叠时只剩头像 |
| `SnProLogo`     | logo 组件：图标 / 图片 + 标题，折叠时收起标题，插槽可整体替换              |
| `SnProSider`    | 左侧栏组件：logo + 纵向 SnMenu，折叠 / 深色（inverted）                    |
| `SnProHeader`   | 顶部导航组件：折叠钮 + 横向菜单 + 面包屑 + 操作区插槽 + 设置齿轮            |
| `SnProTabbar`   | 访问路由标签栏：基于 SnTabs 的五种样式，逐签关闭（affix 签由宿主传 `closable: false`） |
| `SnProSettings` | 布局偏好抽屉：四形态卡片 / 亮暗模式 / 主色色板 / 标签栏样式，受控 props 省略即隐藏对应分区 |

以上组件都可单独引入自行编排（三个风格壳内部就是用它们拼的）。

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

组件级机器可读契约：`standard` → [`src/pro-layout/ai-description.md`](./src/pro-layout/ai-description.md)、
`classic` → [`src/pro-classic/ai-description.md`](./src/pro-classic/ai-description.md)、
检索件 → [`src/pro-search/ai-description.md`](./src/pro-search/ai-description.md)；
文档站「模板 → 中后台布局」页含各风格的实时预览（四形态 / 形态切换 / 设置抽屉与标签栏 / classic / 菜单检索）。

## 状态

`@experimental`（v0.1，Public API 未冻结）。
