# 中后台布局 SnProLayout

把中后台的**布局壳**做成一个可安装的模板：logo、侧栏、顶栏、内容区、页脚的位置与几何、四种布局形态、折叠状态——全部装进一个 `SnProLayout`。已在使用 `@snui/vue-web` 的项目安装后，用自己的 `layout.vue` 换掉即可。

> 平台：`Web` · 包：`@snui/admin-layout` · 状态：`@experimental`

> **职责边界（先读这一段）**
>
> 这个模板**只处理布局问题，不处理功能业务**：不做登录鉴权、不发请求、
> 不管 Token / Store、不注册路由。菜单数据从哪来（本地静态路由 or 后端接口）、
> 点了菜单之后跳到哪（`router.push`），全部由宿主决定——模板只 emit
> `select(key)`。

## 何时使用

- 新建中后台项目，不想每次重抄「侧栏 + 顶栏 + 面包屑」的壳
- 已有项目想换布局形态（经典侧栏 ↔ 顶部菜单 ↔ 混合），或想让用户自己切
- 菜单来自本地静态路由表，或来自后端动态菜单接口
- 需要保留业务接线（鉴权、请求、store）——它们继续留在宿主，模板不碰

## 安装

```bash
pnpm add @snui/admin-layout
```

前置依赖：`@snui/vue-web`（token 层与其组件来自它，本包不重复产出）。
入口按需引入，样式一条：

```ts
import { SnProLayout, routesToMenuOptions } from '@snui/admin-layout';
import '@snui/admin-layout/styles'; // 仅布局壳类；token 已由 @snui/vue-web/styles 提供
```

## 布局形态

参考 vue-element-admin / vben-admin / ant-design-pro 的常见形态，内置四种，
`v-model:layout` 受控可切换：

| `layout` | 结构                                                        | 参考原型                 |
| -------- | ----------------------------------------------------------- | ------------------------ |
| `side`   | 左侧栏（logo + 纵向菜单）+ 顶栏（折叠钮 / 面包屑 / 操作区）  | vue-element-admin 经典款 |
| `top`    | 顶栏（logo + 横向一级菜单 + 操作区）+ 内容                   | ant-design-pro top       |
| `mix`    | 顶栏放一级菜单，侧栏只放当前一级的二级菜单                   | vben-admin mixed-nav     |
| `dual`   | 图标栏（一级）+ 二级菜单列 + 内容                            | vben mixed-sidebar 系    |

<Demo name="pro-layout-web-side" description="side — 经典侧栏形态，面包屑按菜单路径自动推导。" />

<Demo name="pro-layout-web-top" description="top — 顶部菜单形态，一级菜单收进顶栏。" />

<Demo name="pro-layout-web-mix" description="mix — 顶部一级 + 侧栏二级联动；一级无子级时侧栏自动收起。" />

<Demo name="pro-layout-web-dual" description="dual — 图标栏 + 二级菜单列，条带上的折叠钮收起第二列。" />

## 形态切换

宿主用一个受控状态绑定 `v-model:layout`，设置面板随时切：

<Demo name="pro-layout-web-switch" description="四种形态共用同一份菜单数据，切换只动几何。" />

## 设置抽屉与标签栏

两条纯受控的 additive 能力，宿主不接就完全不渲染：

- **设置抽屉**（`show-settings`）——齿轮打开偏好面板：四形态卡片、
  亮暗模式、主色色板、标签栏样式。齿轮在每个形态都可达（side/top/mix 在页头，
  dual 无页头则放条带右侧）；`mode` / `primaryId` / `tabType` 任一省略
  即隐藏对应分区；文案经 `settingsLabels` 本地化，结果只通过
  `update:mode` / `update:primaryId` / `update:tabType` 事件交还宿主持久化；
- **访问路由标签栏**（`show-tabs`）——`tabs: { key, label, closable? }[]`
  由宿主按访问路由维护（固定签传 `closable: false`），点击 / 关闭分别抛
  `tab-select` / `tab-close`，导航与关闭后的路由收敛都在宿主。

<Demo name="pro-layout-web-prefs" description="设置抽屉（形态 / 亮暗 / 主色 / 标签样式）+ 访问路由标签栏，固定签不可关。" />

## 菜单来源

两种来源，最终都是同一份 `SnMenuOption[]`，布局对来源无感知：

1. **静态路由读取** — `routesToMenuOptions(routes, { iconMap })` 纯函数读本地
   路由表的 `meta.title / meta.icon / meta.hidden / meta.order`（结构化类型，
   `RouteRecordRaw[]` 与 `router.options.routes` 均可直传，不依赖 vue-router）；
2. **动态菜单（后端返回）** — 宿主把接口数据映射成 `{ key, label, children?, icon? }`
   传入。映射逻辑（字段名、权限过滤、i18n 翻译）属于业务层，留在宿主。

<Demo name="pro-layout-web-routes" description="静态路由表推导菜单：redirect 父级折叠、hidden 剔除、order 排序。" />

菜单点击只抛 `select(key, item)`，导航在宿主：

```vue
<SnProLayout :menus="menus" :active-key="route.name" @select="(key) => router.push({ name: key })">
  <RouterView />
</SnProLayout>
```

## 替换你的 layout.vue

以一个典型中后台项目为例，替换前后的差异：

```vue
<script setup lang="ts">
// 替换前：手写 aside / header / menu / breadcrumb 的全部结构与样式，
//         外加 auth store、i18n、登出等业务接线混在同一个文件里。
// 替换后：结构交给 SnProLayout，业务接线原样保留在宿主。
import { useRoute, useRouter } from 'vue-router';
import { SnProLayout, routesToMenuOptions } from '@snui/admin-layout';
import { menuToNavOptions } from '@/router/dynamic'; // 你的动态菜单映射（业务，保留在宿主）

const route = useRoute();
const router = useRouter();
const menus = routesToMenuOptions(router.options.routes); // 或 menuToNavOptions(后端数据)
</script>

<template>
  <SnProLayout
    logo="/logo.svg"
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

品牌区、顶栏操作区、页脚都有插槽（`#logo` / `#actions` / `#footer`）；六个子
组件（`SnProLogo` / `SnProSider` / `SnProHeader` / `SnProTabbar` /
`SnProSettings`）也可单独引入自行编排。

## API

### SnProLayout Props

| Prop                 | 类型                                    | 默认值    | 说明                                     |
| -------------------- | --------------------------------------- | --------- | ---------------------------------------- |
| layout               | `'side' \| 'top' \| 'mix' \| 'dual'`    | `'side'`  | 布局形态，`v-model:layout` 可切换        |
| logo / title / mark  | `string`                                | —         | 品牌三件套（图片 / 标题 / 字母牌）       |
| menus                | `SnMenuOption[]`                        | `[]`      | 菜单树（静态路由推导或后端映射）         |
| activeKey            | `string \| number \| null`              | `null`    | 当前选中菜单 key（通常 `route.name`）    |
| collapsed            | `boolean \| undefined`                  | —         | 折叠态，`v-model:collapsed`；省略非受控  |
| siderWidth           | `number`                                | `224`     | 侧栏展开宽度（px）                       |
| siderCollapsedWidth  | `number`                                | `56`      | 侧栏折叠宽度（px）                       |
| fixed                | `boolean`                               | `true`    | 铺满视口（100vh）；`false` 时高度 100%   |
| showCollapse         | `boolean`                               | `true`    | 折叠按钮开关                             |
| invertedSider        | `boolean`                               | `false`   | 侧栏深色面（对齐 n-menu inverted）       |
| breadcrumb           | `string[]`                              | 自动推导  | 显式面包屑；省略时按菜单路径推导         |
| accordion            | `boolean`                               | `false`   | 手风琴展开                               |
| expandedKeys         | `(string \| number)[]`                  | —         | 受控展开；省略时菜单自持                 |
| showSettings         | `boolean`                               | `false`   | 页头显示设置齿轮                         |
| settingsLabel        | `string`                                | 内置中文  | 齿轮的无障碍标签                         |
| settingsLabels       | `Partial<SnProSettingsLabels>`          | 内置中文  | 设置面板文案（面板 i18n 由宿主传入）     |
| mode                 | `'light' \| 'dark'`                     | —         | 亮暗模式，`v-model:mode`；省略隐藏该分区 |
| primaryId            | `string`                                | —         | 主色预设 id，`v-model:primaryId`；省略隐藏该分区 |
| primaryColors        | `SnProPrimaryColor[]`                   | `[]`      | 主色色板（`{ id, color }`）              |
| showTabs             | `boolean`                               | `false`   | 显示访问路由标签栏                       |
| tabs                 | `SnProTabItem[]`                        | `[]`      | 标签列表（宿主维护；`closable: false` 为固定签） |
| tabType              | `'line' \| 'card' \| 'bar' \| 'segment' \| 'chrome'` | `'chrome'` | 标签样式，`v-model:tabType` 可从设置面板切换 |

### Events

| 事件                 | 参数                              | 说明                                   |
| -------------------- | --------------------------------- | -------------------------------------- |
| `select`             | `(key, item)`                     | 菜单点击——**导航由宿主实现**           |
| `update:layout`      | `(mode)`                          | `v-model:layout`                       |
| `update:collapsed`   | `(collapsed)`                     | `v-model:collapsed`                    |
| `update:expandedKeys`| `(keys)`                          | 受控展开同步                           |
| `update:mode`        | `(mode)`                          | 设置面板亮暗切换                       |
| `update:primaryId`   | `(id)`                            | 设置面板主色切换                       |
| `update:tabType`     | `(type)`                          | 设置面板标签样式切换                   |
| `tab-select`         | `(key)`                           | 标签点击——**导航由宿主实现**           |
| `tab-close`          | `(key)`                           | 标签关闭——**关闭后的路由收敛由宿主实现** |

### Slots

| 插槽      | 说明                                       |
| --------- | ------------------------------------------ |
| default   | 路由内容（`<RouterView />`）               |
| `actions` | 顶栏右侧操作区（用户菜单、主题切换…）      |
| `logo`    | 品牌区整体替换                             |
| `footer`  | 内容区下方的页脚                           |

### 子组件

| 组件          | 关键 Props                                              | 说明                             |
| ------------- | ------------------------------------------------------- | -------------------------------- |
| `SnProLogo`   | `logo / title / mark / collapsed`                       | 品牌区；`#icon` 换标、默认插槽整替 |
| `SnProSider`  | `menus / activeKey / collapsed / inverted / showBrand`  | 左侧栏；透传 SnMenu 事件         |
| `SnProHeader` | `showBrand / menus / activeKey / breadcrumb / showCollapse` | 顶栏；横向菜单优先于面包屑   |
| `SnProTabbar` | `tabs / activeKey / type`                               | 标签栏；基于 SnTabs 五样式    |
| `SnProSettings` | `show / layout / mode / primaryId / primaryColors / tabType / labels` | 偏好抽屉；受控 props 省略即隐藏分区 |

## 主题与暗色

全部颜色走 `--sn-web-*` token，跟随宿主暗色机制自动翻转；`invertedSider` 是
经典深色侧栏（与 SnMenu inverted 同面）。组件级覆写 hook：
`--sn-pro-sider-bg` / `--sn-pro-sider-border-color` / `--sn-pro-sider-title-color` /
`--sn-pro-logo-title`。

## AI 契约

机器可读契约见包内 `src/pro-layout/ai-description.md`（含 AI Patch Boundary：
`layout / menus / activeKey / collapsed / breadcrumb / 品牌三件套 / showSettings 系 /
showTabs 系` 可 patch，导航、标签关闭后的路由收敛、真实换肤、鉴权、请求永远
readonly-不可 patch）。
