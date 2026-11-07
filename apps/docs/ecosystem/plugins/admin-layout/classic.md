# classic｜经典企业后台

`classic` 是 `@snui/admin-layout` 的第二种布局风格：**分类侧栏 + 内容区顶部通栏 + 模块标题带**。

> 平台：`Web` · 组件：`SnProLayoutClassic` · 入口：`@snui/admin-layout/layouts/classic` · 状态：`@experimental`

## 独立引入

```ts
import { SnProLayoutClassic } from '@snui/admin-layout/layouts/classic';
import '@snui/admin-layout/layouts/classic/style.css'; // 只含 classic 的壳与样式
```

整包入口（`@snui/admin-layout` + `@snui/admin-layout/styles`）同样可用，见[概览](../admin-layout#样式怎么加载)。

## 结构

| 区域       | 内容                                                                                                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- |
| 左侧栏     | 顶部品牌（`SnProLogo`）→ 菜单分类 + 子菜单（`SnMenu` vertical）→ 底部用户卡片（`SnProUser`，折叠时只剩头像）      |
| 内容区顶栏 | 折叠钮 · 面包屑（省略时按菜单路径自动推导）· 菜单搜索（`SnProSearch`）· 消息通知（`SnProNotice`）· `#actions` 插槽 |
| 模块标题带 | 大标题 `pageTitle`（或 `#title` 插槽整体替换）                                                                    |
| 内容区     | 浅色通屏 + 默认插槽（`<RouterView />`），可选 `#footer`                                                           |

<Demo name="pro-layout-web-classic" description="classic — 分类侧栏 + 用户卡片 + 顶部面包屑 / 搜索 / 通知；模块标题随菜单切换。" />

## 用法

```vue
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { SnProLayoutClassic } from '@snui/admin-layout/layouts/classic';
import '@snui/admin-layout/layouts/classic/style.css';
import { routesToMenuOptions } from '@snui/admin-layout';

const route = useRoute();
const router = useRouter();
const menus = routesToMenuOptions(router.options.routes);
</script>

<template>
  <SnProLayoutClassic
    v-model:collapsed="collapsed"
    title="Admin"
    :menus="menus"
    :active-key="route.name"
    :page-title="String(route.meta.title ?? '')"
    :user="user"
    :user-menus="userMenus"
    :notice-count="unread"
    :notice-items="notices"
    @select="(key) => router.push({ name: key })"
    @search-select="(key) => router.push({ name: key })"
    @notice-select="openNotice"
    @notice-read-all="markAllRead"
    @user-select="onUserMenu"
  >
    <RouterView />
  </SnProLayoutClassic>
</template>
```

## API

### SnProLayoutClassic Props

| Prop                | 类型                       | 默认值   | 说明                                        |
| ------------------- | -------------------------- | -------- | ------------------------------------------- |
| menus               | `SnMenuOption[]`           | `[]`     | 菜单树（分类 + 子菜单）                     |
| activeKey           | `string \| number \| null` | `null`   | 当前选中菜单 key（通常 `route.name`）       |
| collapsed           | `boolean \| undefined`     | —        | 折叠态，`v-model:collapsed`；省略非受控     |
| siderWidth          | `number`                   | `224`    | 侧栏展开宽度（px）                          |
| siderCollapsedWidth | `number`                   | `56`     | 侧栏折叠宽度（px）                          |
| fixed               | `boolean`                  | `true`   | 铺满视口（100vh）；`false` 时高度 100%      |
| showCollapse        | `boolean`                  | `true`   | 顶栏折叠钮开关                              |
| collapseLabel       | `string`                   | 内置中文 | 折叠钮的无障碍标签                          |
| logo / title / mark | `string`                   | —        | 品牌三件套（图片 / 标题 / 字母牌）          |
| breadcrumb          | `string[]`                 | 自动推导 | 显式面包屑；省略时按菜单路径推导            |
| pageTitle           | `string`                   | —        | 模块大标题（`#title` 插槽可整体替换）       |
| showSearch          | `boolean`                  | `true`   | 顶栏内置菜单搜索（`SnProSearch`）           |
| searchPlaceholder   | `string`                   | 内置中文 | 搜索框占位文案                              |
| showNotice          | `boolean`                  | `true`   | 顶栏内置消息通知（`SnProNotice`）           |
| noticeCount         | `number`                   | `0`      | 未读角标数（`0` 不显示）                    |
| noticeItems         | `SnProNoticeItem[]`        | `[]`     | 消息列表（宿主数据）                        |
| user                | `SnProUserProfile`         | —        | 侧栏底部用户卡片；省略则不渲染              |
| userMenus           | `SnMenuOption[]`           | `[]`     | 用户卡片下拉项                              |

### SnProLayoutClassic Events

| 事件                | 参数          | 说明                                    |
| ------------------- | ------------- | --------------------------------------- |
| `select`            | `(key, item)` | 菜单点击——**导航由宿主实现**            |
| `update:collapsed`  | `(collapsed)` | `v-model:collapsed`                     |
| `search-select`     | `(key, item)` | 搜索结果点击——**导航由宿主实现**        |
| `notice-select`     | `(key, item)` | 消息点击——**打开 / 标记已读由宿主实现** |
| `notice-read-all`   | —             | 「全部已读」——**由宿主执行**            |
| `user-select`       | `(key, item)` | 用户卡片菜单点击——**含义由宿主决定**    |

### SnProLayoutClassic Slots

| 插槽      | 说明                                   |
| --------- | -------------------------------------- |
| default   | 路由内容（`<RouterView />`）           |
| `logo`    | 品牌区整体替换                         |
| `title`   | 模块大标题整体替换                     |
| `search`  | 顶栏搜索区整体替换（默认 SnProSearch） |
| `notice`  | 顶栏通知区整体替换（默认 SnProNotice） |
| `actions` | 顶栏右侧附加动作区（搜索 / 通知之后）  |
| `user`    | 侧栏底部整体替换（默认 SnProUser）     |
| `footer`  | 内容区下方的页脚                       |

## 主题与暗色

全部颜色走 `--sn-web-*` token，跟随宿主暗色机制自动翻转。壳级覆写 hook：
`--sn-pro-classic-sider-width` / `--sn-pro-classic-sider-collapsed-width` /
`--sn-pro-classic-sider-bg` / `--sn-pro-classic-sider-border-color` /
`--sn-pro-classic-header-bg` / `--sn-pro-classic-body-bg`。

## AI 契约

机器可读契约见包内 `src/pro-classic/ai-description.md`（`classic` 壳的 Patch Boundary：
菜单 / 面包屑 / `pageTitle` / 品牌三件套 / 用户卡片 / 通知与搜索开关可 patch；导航、已读状态、
登出、换肤、鉴权永远不可 patch）。
