# 中后台布局 @snui/admin-layout

把中后台的**布局壳**做成一个可安装的官方插件包：logo、侧栏、顶栏、内容区、页脚的位置与几何、
折叠状态，以及**多种布局风格**——已在使用 `@snui/vue-web` 的项目安装后，用自己的 `layout.vue` 换掉即可。

> 平台：`Web` · 包：`@snui/admin-layout` · 状态：`@experimental`

> **职责边界（先读这一段）**
>
> 这个包**只处理布局问题，不处理功能业务**：不做登录鉴权、不发请求、
> 不管 Token / Store、不注册路由、不内置 i18n 与主题引擎。菜单数据从哪来（本地静态路由 or
> 后端接口）、点了菜单之后跳到哪（`router.push`）、切了亮暗之后怎么换肤，全部由宿主决定——
> 布局只 emit 事件。

## 何时使用

- 新建中后台项目，不想每次重抄「侧栏 + 顶栏 + 面包屑」的壳
- 已有项目想换布局形态或换整套布局风格，或想让用户自己切
- 菜单来自本地静态路由表，或来自后端动态菜单接口
- 需要保留业务接线（鉴权、请求、store）——它们继续留在宿主，布局不碰

## 安装

```bash
pnpm add @snui/admin-layout
```

前置依赖：`@snui/vue-web`（token 层与其组件来自它，本包不重复产出）。

```ts
// ① 全量：一个入口拿到所有风格 + 一份全量样式（最省心，产物最大）
import { SnProLayout, SnProLayoutClassic, SnProLayoutAurora } from '@snui/admin-layout';
import '@snui/admin-layout/styles'; // 仅布局壳类；token 已由 @snui/vue-web/styles 提供
```

## 布局风格

同一个包里并存多种布局风格：每种风格是**独立入口 + 独立样式文件**（按需加载），只引你要的那一种。

<LayoutShowcase
  :styles="[
    { key: 'standard', name: 'pro-layout-web-side', label: 'standard', blurb: '四形态壳：side / top / mix / dual' },
    { key: 'classic', name: 'pro-layout-web-classic', label: 'classic', blurb: '分类侧栏 + 内容区顶部通栏 + 模块标题带' },
    { key: 'aurora', name: 'pro-layout-web-aurora', label: 'aurora', blurb: '通屏背景 + 顶部条 + 悬浮一级图标栏' },
  ]"
  initial="standard"
/>

> 上面这个演示台一次只渲染一种风格：点胶囊切换。布局壳是横向铺开的，并排显示会被挤扁，
> 所以每种风格在文档里都是**独占一行**的演示。

| 风格       | 组件                 | 入口                                    | 样式文件                                        | 结构                                                           |
| ---------- | -------------------- | --------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------- |
| `standard` | `SnProLayout`        | `@snui/admin-layout/layouts/standard`   | `@snui/admin-layout/layouts/standard/style.css` | 四形态壳（side / top / mix / dual）：侧栏 / 顶栏 / 条带 + 内容区 |
| `classic`  | `SnProLayoutClassic` | `@snui/admin-layout/layouts/classic`    | `@snui/admin-layout/layouts/classic/style.css`  | 经典企业后台：分类侧栏 + 内容区顶部通栏 + 模块标题带             |
| `aurora`   | `SnProLayoutAurora`  | `@snui/admin-layout/layouts/aurora`     | `@snui/admin-layout/layouts/aurora/style.css`   | 通屏背景 + 顶部条（logo / 二级模块 / 工具区）+ 悬浮一级图标栏   |

每种风格各有一页详细文档（结构、独立引入、完整 API 与演示）：

| 风格                                | 说明                                                       |
| ----------------------------------- | ---------------------------------------------------------- |
| [standard 四形态壳](./standard)      | 一个组件四种形态：side / top / mix / dual，设置抽屉 + 标签栏 |
| [classic 经典企业后台](./classic)    | 分类侧栏 + 底部用户卡片 + 内容区顶部通栏 + 模块标题带       |
| [aurora 通屏背景](./aurora)          | 背景四预设（纯色 / 图 / 光晕 / 弥散）+ 悬浮一级图标栏       |
| [workbench 工作台](./workbench)      | 通用统计页（ECharts）：账户卡 / 交易记录 / 资金流水 / 收入来源 |

三种风格的 demo 内容区放的是**同一个工作台**（`@snui/admin-layout/workbench`）：换壳时内容一个数字都不动，
这就是「布局只负责壳」的可视证明。工作台是独立入口（它牵 `@snui/echarts`），所以不在整包 barrel 里。

三种风格**复用同一批共享件**（`SnProLogo` / `SnProSearch` / `SnProNotice` /
`SnProUser`）与同一份菜单工具（`routesToMenuOptions` / `menuPathTo` / `searchMenuOptions`）——
差异只在「壳」，不在「件」。

### 样式怎么加载

```ts
// ① 全量：barrel 入口牵引全部组件 + 一份全量样式
import '@snui/admin-layout/styles';

// ② 单风格：只引 classic（推荐）
import { SnProLayoutClassic } from '@snui/admin-layout/layouts/classic';
import '@snui/admin-layout/layouts/classic/style.css';

// ③ 多种风格都用：每个子入口各引一次
import { SnProLayout } from '@snui/admin-layout/layouts/standard';
import '@snui/admin-layout/layouts/standard/style.css';
import { SnProLayoutAurora } from '@snui/admin-layout/layouts/aurora';
import '@snui/admin-layout/layouts/aurora/style.css';
```

每个子入口的样式表都**自包含**：`layouts/classic/style.css` 含 classic 壳 + 它用到的共享件
（logo / 搜索 / 通知 / 用户卡片）规则，但不含 standard 独有的 header / sider / 条带 / tabbar /
settings 规则；其它风格同理。

> 取舍：子入口是**独立的 JS 产物**（不共享 chunk），所以同一应用同时引入多种风格时，
> 共享件会在各自产物里各存一份。只用一个风格没有这个问题；多个都用、又在意这份重复时，用 ① 更划算。

## 菜单来源

两种来源，最终都是同一份 `SnMenuOption[]`，布局对来源无感知：

1. **静态路由读取** — `routesToMenuOptions(routes, { iconMap })` 纯函数读本地路由表的
   `meta.title / meta.icon / meta.hidden / meta.order`（结构化类型，`RouteRecordRaw[]` 与
   `router.options.routes` 均可直传，不依赖 vue-router）；
2. **动态菜单（后端返回）** — 宿主把接口数据映射成 `{ key, label, children?, icon? }` 传入。
   映射逻辑（字段名、权限过滤、i18n 翻译）属于业务层，留在宿主。

```ts
import { routesToMenuOptions } from '@snui/admin-layout';

const menus = routesToMenuOptions(router.options.routes); // 或宿主自映射的后端数据
```

## 替换你的 layout.vue

```vue
<script setup lang="ts">
// 替换前：手写 aside / header / menu / breadcrumb 的全部结构与样式，
//         外加 auth store、i18n、登出等业务接线混在同一个文件里。
// 替换后：结构交给布局壳，业务接线原样保留在宿主。
import { useRoute, useRouter } from 'vue-router';
import { SnProLayout } from '@snui/admin-layout/layouts/standard';
import '@snui/admin-layout/layouts/standard/style.css';
import { routesToMenuOptions } from '@snui/admin-layout';

const route = useRoute();
const router = useRouter();
const menus = routesToMenuOptions(router.options.routes); // 或宿主自映射的后端数据
</script>

<template>
  <SnProLayout
    logo="/logo.svg"
    title="Admin"
    :menus="menus"
    :active-key="route.name"
    @select="(key) => router.push({ name: key })"
  >
    <RouterView />
  </SnProLayout>
</template>
```

## 共享件

三种风格复用同一批件，也可以脱离布局单独用：

| 组件          | 说明                                                             |
| ------------- | ---------------------------------------------------------------- |
| `SnProLogo`   | 品牌区：图标 / 图片 + 标题，折叠时收起标题，插槽可整体替换        |
| `SnProSearch` | 通用菜单检索：跨层级命中 + 父级路径 + 键盘可达                    |
| `SnProNotice` | 消息通知：铃铛 + 未读角标（`${max}+` 封顶）+ 面板，`#panel` 整替 |
| `SnProUser`   | 用户卡片：头像 + 名称 / 描述 + 下拉，折叠时只剩头像               |

<Demo name="pro-layout-web-search" description="SnProSearch — 跨层级命中菜单、显示父级路径、键盘可达；右侧是同一份纯函数的结果。" />

### SnProSearch Props

| Prop          | 类型                             | 默认值     | 说明                                     |
| ------------- | -------------------------------- | ---------- | ---------------------------------------- |
| menus         | `SnMenuOption[]`                 | `[]`       | 被检索的菜单树（一般就是布局的 `menus`）  |
| modelValue    | `string`                         | —          | 查询词，`v-model`；省略非受控            |
| placeholder   | `string`                         | 内置中文   | 占位文案                                 |
| minLength     | `number`                         | `1`        | 面板打开所需的最短（trim 后）长度        |
| maxResults    | `number`                         | `10`       | 最多给出的命中条数                       |
| size          | `'small' \| 'medium' \| 'large'` | `'medium'` | 输入框尺寸（透传 SnInput）               |
| clearable     | `boolean`                        | `true`     | 清空按钮                                 |
| disabled      | `boolean`                        | `false`    | 禁用                                     |
| searchLabel   | `string`                         | 内置中文   | 输入框 / 结果列表的无障碍标签            |
| emptyText     | `string`                         | 内置中文   | 无命中时的文案                           |
| includeGroups | `boolean`                        | `false`    | 是否把带子级的分类节点也作为命中返回     |
| filter        | `(query, hit) => boolean`        | —          | 额外过滤（比如按权限裁剪命中）           |
| closeOnSelect | `boolean`                        | `true`     | 选中后是否关闭面板                       |

### SnProSearch Events

| 事件                | 参数          | 说明                                    |
| ------------------- | ------------- | --------------------------------------- |
| `update:modelValue` | `(value)`     | `v-model`                               |
| `search`            | `(query)`     | 每次输入（宿主可在此打点 / 拉远端候选） |
| `select`            | `(key, item)` | 命中被激活——**导航由宿主实现**          |
| `open` / `close`    | —             | 结果面板开合                            |

> 纯函数版本：`searchMenuOptions(menus, query, { maxResults, includeGroups, filter })` →
> `{ key, label, path }[]`，与组件同一套规则（大小写不敏感、匹配自身或祖先标签、默认只返回叶子、
> 跳过 disabled、结果顺序稳定），可用于宿主的命令面板或远端检索。

### SnProNotice Props

| Prop        | 类型                | 默认值   | 说明                          |
| ----------- | ------------------- | -------- | ----------------------------- |
| count       | `number`            | `0`      | 未读角标（`0` 不显示）        |
| max         | `number`            | `99`     | 角标封顶，超出显示 `${max}+`  |
| items       | `SnProNoticeItem[]` | `[]`     | 消息列表（宿主数据）          |
| label       | `string`            | 内置中文 | 铃铛按钮的无障碍标签          |
| panelTitle  | `string`            | 内置中文 | 面板标题                      |
| readAllText | `string`            | 内置中文 | 「全部已读」文案              |
| emptyText   | `string`            | 内置中文 | 无消息文案                    |

Events：`select(key, item)`（打开 / 标记已读由宿主实现）、`read-all`。
Slots：`#panel` 整体替换面板内容（头部与列表一起换成宿主自己的实现）。

### SnProUser Props

| Prop        | 类型                   | 默认值        | 说明                                   |
| ----------- | ---------------------- | ------------- | -------------------------------------- |
| name        | `string`               | —             | 显示名（无头像图时取首字做字母牌）      |
| description | `string`               | —             | 第二行（角色 / 邮箱）                  |
| avatar      | `string`               | —             | 头像图 URL                             |
| collapsed   | `boolean`              | `false`       | 折叠：只留头像                         |
| menus       | `SnMenuOption[]`       | `[]`          | 下拉项                                 |
| trigger     | `'click' \| 'hover' …` | `'click'`     | 展开方式（透传 SnDropdown）            |
| placement   | `SnDropdownPlacement`  | `'top-start'` | 面板位置（卡片在侧栏底部，默认向上弹） |
| menuLabel   | `string`               | 内置中文      | 触发按钮的无障碍标签                   |

Events：`select(key, item)`——**含义由宿主决定（登出 / 个人中心）**；默认插槽整体替换卡片内容。

## 主题与暗色

全部颜色走 `--sn-web-*` token，跟随宿主暗色机制自动翻转。各风格自己的覆写 hook 写在对应页面里。

## AI 契约

机器可读契约按风格拆分在包内：

- `src/pro-layout/ai-description.md`（`standard`）
- `src/pro-classic/ai-description.md`（`classic`）
- `src/pro-aurora/ai-description.md`（`aurora`）
- `src/pro-search/ai-description.md`（共享检索件与 `searchMenuOptions` 规则）

共同边界：**可 patch** 布局数据与几何（`menus` / `activeKey` / `collapsed` / 品牌三件套 /
面包屑 / 各区域的 `show*` 与文案 / 插槽）；**永远不可 patch** 导航、请求、鉴权、权限过滤、
真实换肤、i18n 翻译与安装逻辑。

架构决策：[ADR-0006](/decisions) 建立本包、ADR-0008 多风格与按需样式、
ADR-0009 `aurora` 风格与背景预设（见仓库 `.ai/decisions/`）。
