# aurora｜通屏背景 + 顶部条 + 悬浮一级图标栏

`aurora` 是 `@snui/admin-layout` 的第三种布局风格：**通屏可配置背景 + 顶部条 + 左侧悬浮一级图标栏**，
每个区域都能用插槽换成自定义按钮。

> 平台：`Web` · 组件：`SnProLayoutAurora` · 入口：`@snui/admin-layout/layouts/aurora` · 状态：`@experimental`

## 独立引入

```ts
import { SnProLayoutAurora } from '@snui/admin-layout/layouts/aurora';
import '@snui/admin-layout/layouts/aurora/style.css'; // 只含 aurora 的壳与样式
```

整包入口（`@snui/admin-layout` + `@snui/admin-layout/styles`）同样可用，见[概览](../admin-layout#样式怎么加载)。

## 结构

| 区域       | 内容                                                                                                                                                                                     |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 背景层     | 通屏背景铺满**布局自身**（顶栏后面、面板圆角外、浮层缝隙里都看得见），不透明的内容面只覆盖浮层面板                                                                                       |
| 顶部条     | 品牌（`#logo`）· **胶囊导航**（`#modules`，一级菜单，选中是深色药丸）· 右侧：亮暗圆钮（`#theme-toggle`）· 中英（`#locale`）· 消息（`#notice`，红点）· 头像（`#user`）· `#header-actions` |
| 悬浮图标栏 | 一级菜单图标（64px 半透明圆角浮层，选中是深色方块；`#rail-menu` 整替）· 底部：退出登录（`#logout`）· 帮助说明（`#help`）                                                                 |
| 标题带     | 大标题 `pageTitle`（`#title`）+ 副标题 `pageSubtitle`（`#subtitle`）· 右侧：搜索（`#search`）· 筛选（`#filter`）· 主行动（`#actions`）                                                   |
| 内容模块   | 透明滚动容器；**标题带与每个内容模块各自是一张玻璃浮层卡片**，卡与卡之间露出布局背景 · 默认插槽 · 页脚（`#footer`）                                                                      |
| 通屏背景   | `background` 四选一：`solid` 纯色 / `image` 背景图 / `gradient` 渐变光晕 / `mesh` 弥散；调色板 `backgroundColors`                                                                        |

<Demo name="pro-layout-web-aurora" description="aurora — 上方可切换纯色 / 背景图 / 光晕 / 弥散；胶囊导航、圆形工具区、悬浮图标栏与标题带都含在内，内容区是通用工作台（同一份数据换壳不变）。" />

## 内容接入工作台

aurora 的内容区默认插槽放的是**通用工作台**（`@snui/admin-layout/workbench`，接 ECharts）——
它布局无关：standard / classic / aurora 三种风格用的是同一份数据，换壳时内容一个数字都不动。

```vue
<script setup lang="ts">
import { SnProLayoutAurora } from '@snui/admin-layout/layouts/aurora';
import '@snui/admin-layout/layouts/aurora/style.css';
import { ProWorkbench } from '@snui/admin-layout/workbench';
import '@snui/admin-layout/workbench/style.css';

import { demoKpis, demoMoneyFlow, demoIncomeSources, demoTransactions } from './workbench-demo';
</script>

<template>
  <SnProLayoutAurora page-title="工作台" page-subtitle="这里是今天的经营概览。" ...>
    <ProWorkbench
      :kpis="demoKpis"
      :money-flow="demoMoneyFlow"
      :income-sources="demoIncomeSources"
      :transactions="demoTransactions"
      :show-heading="false"
    />
  </SnProLayoutAurora>
</template>
```

`:show-heading="false"` 是刻意的：aurora 自己有标题带，工作台再画一遍就是同一个标题出现两次；
换成没有标题带的壳（classic / standard）时保留默认值即可。工作台的 props / 插槽 / 事件见[工作台](./workbench)。

## 背景预设

几何（位置 / 半径 / 模糊）在样式里，调色板在 props 里：

```vue
<!-- 渐变光晕 / 弥散：只换品牌色，不改形状 -->
<SnProLayoutAurora background="mesh" :background-colors="['#7c5cff', '#22c1a4']" … />

<!-- 背景图 -->
<SnProLayoutAurora background="image" background-image="/bg/aurora.png" … />
```

| `background` | 效果             | 配置                                     |
| ------------ | ---------------- | ---------------------------------------- |
| `solid`      | 纯色（token 面） | —                                        |
| `image`      | 背景图（cover）  | `backgroundImage`                        |
| `gradient`   | 渐变光晕（默认） | `backgroundColors?`（默认取 token 主色） |
| `mesh`       | 弥散（四向色斑） | `backgroundColors?`                      |

也可以用纯函数 `auroraBackgroundVars()` 自己在宿主侧算这组 CSS 变量（`--sn-pro-aurora-glow-1..4` /
`--sn-pro-aurora-bg-image`），或从任意祖先覆写 `--sn-pro-aurora-glow-opacity` /
`--sn-pro-aurora-mesh-opacity` / `--sn-pro-aurora-glow-blur` 调强度。

## 用法

```vue
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { SnProLayoutAurora } from '@snui/admin-layout/layouts/aurora';
import '@snui/admin-layout/layouts/aurora/style.css';

const route = useRoute();
const router = useRouter();
</script>

<template>
  <SnProLayoutAurora
    v-model:mode="mode"
    v-model:locale="locale"
    background="mesh"
    :background-colors="brandGlow"
    :menus="menus"
    :active-key="route.name"
    :page-title="pageTitle"
    :user="user"
    :notice-count="unread"
    :notice-items="notices"
    @select="(key) => router.push({ name: key })"
    @update:mode="applyTheme"
    @update:locale="switchI18n"
    @logout="logout"
    @help="openHelp"
  >
    <template #actions>
      <button type="button" @click="createSomething">＋创建</button>
    </template>

    <RouterView />
  </SnProLayoutAurora>
</template>
```

## API

### SnProLayoutAurora Props

| Prop                | 类型                                         | 默认值              | 说明                                            |
| ------------------- | -------------------------------------------- | ------------------- | ----------------------------------------------- |
| menus               | `SnMenuOption[]`                             | `[]`                | 菜单树：一级进图标栏，其子级进顶栏模块区        |
| activeKey           | `string \| number \| null`                   | `null`              | 当前选中菜单 key（通常 `route.name`）           |
| background          | `'solid' \| 'image' \| 'gradient' \| 'mesh'` | `'gradient'`        | 通屏背景预设（纯色 / 背景图 / 渐变光晕 / 弥散） |
| backgroundImage     | `string`                                     | —                   | 背景图 URL（`background='image'` 时使用）       |
| backgroundColors    | `string[]`                                   | `[]`                | 光晕 / 弥散的调色板；缺省用 token 主色对并补足  |
| fixed               | `boolean`                                    | `true`              | 铺满视口（100vh）；`false` 时高度 100%          |
| railWidth           | `number`                                     | `64`                | 悬浮一级图标栏宽度（px）                        |
| headerHeight        | `number`                                     | `64`                | 顶部条最小高度（px）                            |
| logo / title / mark | `string`                                     | —                   | 品牌三件套                                      |
| pageTitle           | `string`                                     | —                   | 标题带大标题（`#title` 可整替）                 |
| pageSubtitle        | `string`                                     | —                   | 标题带副标题（`#subtitle` 可整替）              |
| showThemeToggle     | `boolean`                                    | `true`              | 显示亮暗切换按钮                                |
| mode                | `'light' \| 'dark'`                          | —                   | 亮暗态，`v-model:mode`；省略即非受控            |
| themeToggleLabel    | `string`                                     | 内置中文            | 亮暗按钮的无障碍标签                            |
| showSearch          | `boolean`                                    | `true`              | 显示菜单搜索                                    |
| searchPlaceholder   | `string`                                     | 内置中文            | 搜索占位                                        |
| searchLabel         | `string`                                     | 内置中文            | 搜索框无障碍标签                                |
| showFilter          | `boolean`                                    | `true`              | 标题带显示筛选按钮                              |
| filterLabel         | `string`                                     | 内置中文            | 筛选按钮无障碍标签                              |
| showLocale          | `boolean`                                    | `true`              | 显示中英切换按钮                                |
| locale              | `'zh' \| 'en'`                               | —                   | 语言，`v-model:locale`；省略即非受控            |
| localeLabel         | `string`                                     | 内置中文            | 语言按钮的无障碍标签                            |
| localeLabels        | `{ zh?: string; en?: string }`               | `{zh:'中',en:'EN'}` | 按钮字形（显示的是「另一个」语种）              |
| showNotice          | `boolean`                                    | `true`              | 显示消息通知                                    |
| noticeCount         | `number`                                     | `0`                 | 未读角标数                                      |
| noticeMax           | `number`                                     | `99`                | 角标封顶                                        |
| noticeItems         | `SnProNoticeItem[]`                          | `[]`                | 消息列表（宿主数据）                            |
| showUser            | `boolean`                                    | `true`              | 显示个人信息                                    |
| user                | `SnProUserProfile`                           | —                   | 个人信息（省略则不渲染）                        |
| userMenus           | `SnMenuOption[]`                             | `[]`                | 个人信息下拉项                                  |
| showLogout          | `boolean`                                    | `true`              | 一级栏底部「退出登录」按钮                      |
| logoutLabel         | `string`                                     | 内置中文            | 退出按钮的无障碍标签                            |
| showHelp            | `boolean`                                    | `true`              | 一级栏底部「帮助说明」按钮                      |
| helpLabel           | `string`                                     | 内置中文            | 帮助按钮的无障碍标签                            |

### SnProLayoutAurora Events

| 事件              | 参数          | 说明                                        |
| ----------------- | ------------- | ------------------------------------------- |
| `select`          | `(key, item)` | 一级图标 / 二级模块点击——**导航由宿主实现** |
| `update:mode`     | `(mode)`      | `v-model:mode`，**换肤由宿主实现**          |
| `update:locale`   | `(locale)`    | `v-model:locale`，**i18n 由宿主实现**       |
| `search-select`   | `(key, item)` | 搜索命中——**导航由宿主实现**                |
| `notice-select`   | `(key, item)` | 通知点击——**打开 / 标记已读由宿主实现**     |
| `notice-read-all` | —             | 「全部已读」——**由宿主执行**                |
| `user-select`     | `(key, item)` | 个人信息菜单——**含义由宿主决定**            |
| `filter`          | —             | 标题带筛选按钮——**筛选面板由宿主实现**      |
| `logout`          | —             | 退出登录——**清 session / 跳登录由宿主实现** |
| `help`            | —             | 帮助说明——**打开帮助中心由宿主实现**        |

### SnProLayoutAurora Slots（每个区域都可换自定义按钮）

| 插槽             | 说明                                                        |
| ---------------- | ----------------------------------------------------------- |
| default          | 路由内容（`<RouterView />`）                                |
| `logo`           | 品牌区整体替换                                              |
| `modules`        | 二级菜单模块区整体替换                                      |
| `theme-toggle`   | 亮暗切换按钮替换                                            |
| `search`         | 标题带搜索区替换（默认 SnProSearch）                        |
| `filter`         | 标题带筛选按钮替换                                          |
| `locale`         | 中英切换按钮替换                                            |
| `notice`         | 通知区替换（默认 SnProNotice）                              |
| `user`           | 个人信息区替换（默认 SnProUser）                            |
| `header-actions` | 顶栏最右的附加动作                                          |
| `rail-menu`      | 一级图标菜单整体替换                                        |
| `logout`         | 退出登录按钮替换                                            |
| `help`           | 帮助说明按钮替换                                            |
| `title`          | 标题带大标题替换                                            |
| `subtitle`       | 标题带副标题替换                                            |
| `actions`        | 标题带右侧的主行动（截图里的 Create a Report / Add Wallet） |
| `footer`         | 内容区下方页脚                                              |

## 主题与暗色

颜色以 `--sn-web-*` token 为基础，另有壳级调色板 hook：`--sn-pro-aurora-page`（页面底色）、
`-app`（应用卡片）、`-panel`（浮动面板）、`-ink` / `-ink-contrast`（选中药丸 / 方块与前景）、
`-muted`（次要文字）；几何 hook：`-inset` / `-radius-app` / `-radius-pill` / `-rail-width` /
`-header-height` / `-gap`；环境光强度：`-glow-opacity` / `-mesh-opacity` / `-glow-blur`。

应用卡片与浮动面板都是**不透明**面：环境光只出现在卡片外圈的留白里，不会渗进内容区。

`mode` 只是外观开关：真正切 `.dark` 类 / 换 token 由宿主在 `update:mode` 里做。

## AI 契约

机器可读契约见包内 `src/pro-aurora/ai-description.md`（背景预设 / 顶部条工具区 / 悬浮一级栏 /
退出与帮助 可 patch；导航、登出、换肤、i18n、鉴权永远不可 patch）。
