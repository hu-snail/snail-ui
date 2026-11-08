# standard｜四形态壳

`standard` 是 `@snui/admin-layout` 的第一种布局风格：**一个组件装四种形态**，`v-model:layout` 受控切换。

> 平台：`Web` · 组件：`SnProLayout` · 入口：`@snui/admin-layout/layouts/standard` · 状态：`@experimental`

## 独立引入

```ts
import { SnProLayout } from '@snui/admin-layout/layouts/standard';
import '@snui/admin-layout/layouts/standard/style.css'; // 只含四形态壳的样式
```

整包入口（`@snui/admin-layout` + `@snui/admin-layout/styles`）同样可用，见[概览](../admin-layout#样式怎么加载)。

## 四种形态

参考 vue-element-admin / vben-admin / ant-design-pro 的常见形态，内置四种，`v-model:layout` 受控可切换：

| `layout` | 结构                                                        | 参考原型                 |
| -------- | ----------------------------------------------------------- | ------------------------ |
| `side`   | 左侧栏（logo + 纵向菜单）+ 顶栏（折叠钮 / 面包屑 / 操作区） | vue-element-admin 经典款 |
| `top`    | 顶栏（logo + 横向一级菜单 + 操作区）+ 内容                  | ant-design-pro top       |
| `mix`    | 顶栏放一级菜单，侧栏只放当前一级的二级菜单                  | vben-admin mixed-nav     |
| `dual`   | 图标栏（一级）+ 二级菜单列 + 内容                           | vben mixed-sidebar 系    |

<LayoutShowcase
  :styles="[
    { key: 'side', name: 'pro-layout-web-side', label: 'side', blurb: '经典侧栏：面包屑按菜单路径自动推导' },
    { key: 'top', name: 'pro-layout-web-top', label: 'top', blurb: '顶部菜单：一级菜单收进顶栏' },
    { key: 'mix', name: 'pro-layout-web-mix', label: 'mix', blurb: '顶部一级 + 侧栏二级联动' },
    { key: 'dual', name: 'pro-layout-web-dual', label: 'dual', blurb: '图标栏 + 二级菜单列' },
  ]"
  initial="side"
/>

> 四种形态一次显示一个：形态之间几何差别很大，并排会被挤扁，所以这里也用**独占一行**的演示台。

## 形态切换

宿主用一个受控状态绑定 `v-model:layout`，设置面板随时切：

<Demo name="pro-layout-web-switch" description="四种形态共用同一份菜单数据，切换只动几何。" />

## 设置抽屉与标签栏

两条纯受控的 additive 能力，宿主不接就完全不渲染：

- **设置抽屉**（`show-settings`）——齿轮打开偏好面板：四形态卡片、亮暗模式、主色色板、标签栏样式。
  齿轮在每个形态都可达（side/top/mix 在页头，dual 无页头则放条带右侧）；`mode` / `primaryId` /
  `tabType` 任一省略即隐藏对应分区；文案经 `settingsLabels` 本地化，结果只通过
  `update:mode` / `update:primaryId` / `update:tabType` 事件交还宿主持久化；
- **访问路由标签栏**（`show-tabs`）——`tabs: { key, label, closable? }[]` 由宿主按访问路由维护
  （固定签传 `closable: false`），点击 / 关闭分别抛 `tab-select` / `tab-close`，导航与关闭后的
  路由收敛都在宿主。

<Demo name="pro-layout-web-prefs" description="设置抽屉（形态 / 亮暗 / 主色 / 标签样式）+ 访问路由标签栏，固定签不可关。" />

## 菜单来源

<Demo name="pro-layout-web-routes" description="静态路由表推导菜单：redirect 父级折叠、hidden 剔除、order 排序。" />

两种来源，最终都是同一份 `SnMenuOption[]`，布局对来源无感知：

1. **静态路由读取** — `routesToMenuOptions(routes, { iconMap })` 纯函数读本地路由表的
   `meta.title / meta.icon / meta.hidden / meta.order`（结构化类型，`RouteRecordRaw[]` 与
   `router.options.routes` 均可直传，不依赖 vue-router）；
2. **动态菜单（后端返回）** — 宿主把接口数据映射成 `{ key, label, children?, icon? }` 传入。

菜单点击只抛 `select(key, item)`，导航在宿主：

```vue
<SnProLayout :menus="menus" :active-key="route.name" @select="(key) => router.push({ name: key })">
  <RouterView />
</SnProLayout>
```

## API

### SnProLayout Props

| Prop                | 类型                                                 | 默认值     | 说明                                             |
| ------------------- | ---------------------------------------------------- | ---------- | ------------------------------------------------ |
| layout              | `'side' \| 'top' \| 'mix' \| 'dual'`                 | `'side'`   | 布局形态，`v-model:layout` 可切换                |
| logo / title / mark | `string`                                             | —          | 品牌三件套（图片 / 标题 / 字母牌）               |
| menus               | `SnMenuOption[]`                                     | `[]`       | 菜单树（静态路由推导或后端映射）                 |
| activeKey           | `string \| number \| null`                           | `null`     | 当前选中菜单 key（通常 `route.name`）            |
| collapsed           | `boolean \| undefined`                               | —          | 折叠态，`v-model:collapsed`；省略非受控          |
| siderWidth          | `number`                                             | `224`      | 侧栏展开宽度（px）                               |
| siderCollapsedWidth | `number`                                             | `56`       | 侧栏折叠宽度（px）                               |
| fixed               | `boolean`                                            | `true`     | 铺满视口（100vh）；`false` 时高度 100%           |
| showCollapse        | `boolean`                                            | `true`     | 折叠按钮开关                                     |
| invertedSider       | `boolean`                                            | `false`    | 侧栏深色面（对齐 n-menu inverted）               |
| breadcrumb          | `string[]`                                           | 自动推导   | 显式面包屑；省略时按菜单路径推导                 |
| accordion           | `boolean`                                            | `false`    | 手风琴展开                                       |
| expandedKeys        | `(string \| number)[]`                               | —          | 受控展开；省略时菜单自持                         |
| showSettings        | `boolean`                                            | `false`    | 页头显示设置齿轮                                 |
| settingsLabel       | `string`                                             | 内置中文   | 齿轮的无障碍标签                                 |
| settingsLabels      | `Partial<SnProSettingsLabels>`                       | 内置中文   | 设置面板文案（面板 i18n 由宿主传入）             |
| mode                | `'light' \| 'dark'`                                  | —          | 亮暗模式，`v-model:mode`；省略隐藏该分区         |
| primaryId           | `string`                                             | —          | 主色预设 id，`v-model:primaryId`；省略隐藏该分区 |
| primaryColors       | `SnProPrimaryColor[]`                                | `[]`       | 主色色板（`{ id, color }`）                      |
| showTabs            | `boolean`                                            | `false`    | 显示访问路由标签栏                               |
| tabs                | `SnProTabItem[]`                                     | `[]`       | 标签列表（宿主维护；`closable: false` 为固定签） |
| tabType             | `'line' \| 'card' \| 'bar' \| 'segment' \| 'chrome'` | `'chrome'` | 标签样式，`v-model:tabType` 可从设置面板切换     |

### Events

| 事件                  | 参数          | 说明                                     |
| --------------------- | ------------- | ---------------------------------------- |
| `select`              | `(key, item)` | 菜单点击——**导航由宿主实现**             |
| `update:layout`       | `(mode)`      | `v-model:layout`                         |
| `update:collapsed`    | `(collapsed)` | `v-model:collapsed`                      |
| `update:expandedKeys` | `(keys)`      | 受控展开同步                             |
| `update:mode`         | `(mode)`      | 设置面板亮暗切换                         |
| `update:primaryId`    | `(id)`        | 设置面板主色切换                         |
| `update:tabType`      | `(type)`      | 设置面板标签样式切换                     |
| `tab-select`          | `(key)`       | 标签点击——**导航由宿主实现**             |
| `tab-close`           | `(key)`       | 标签关闭——**关闭后的路由收敛由宿主实现** |

### Slots

| 插槽      | 说明                                                                             |
| --------- | -------------------------------------------------------------------------------- |
| default   | 路由内容（`<RouterView />`）                                                     |
| `actions` | 操作区：side/top/mix 在页头右侧，dual（无页头）在条带右侧（语言切换、用户菜单…） |
| `logo`    | 品牌区整体替换                                                                   |
| `footer`  | 内容区下方的页脚                                                                 |

### 子组件

| 组件            | 关键 Props                                                            | 说明                                |
| --------------- | --------------------------------------------------------------------- | ----------------------------------- |
| `SnProLogo`     | `logo / title / mark / collapsed`                                     | 品牌区；`#icon` 换标、默认插槽整替  |
| `SnProSider`    | `menus / activeKey / collapsed / inverted / showBrand`                | 左侧栏；透传 SnMenu 事件            |
| `SnProHeader`   | `showBrand / menus / activeKey / breadcrumb / showCollapse`           | 顶栏；横向菜单优先于面包屑          |
| `SnProTabbar`   | `tabs / activeKey / type`                                             | 标签栏；基于 SnTabs 五样式          |
| `SnProSettings` | `show / layout / mode / primaryId / primaryColors / tabType / labels` | 偏好抽屉；受控 props 省略即隐藏分区 |

五个子组件都可单独引入自行编排。

## 主题与暗色

全部颜色走 `--sn-web-*` token，跟随宿主暗色机制自动翻转；`invertedSider` 是经典深色侧栏
（与 SnMenu inverted 同面）。组件级覆写 hook：`--sn-pro-sider-bg` /
`--sn-pro-sider-border-color` / `--sn-pro-sider-title-color` / `--sn-pro-logo-title`。

## AI 契约

机器可读契约见包内 `src/pro-layout/ai-description.md`（含 AI Patch Boundary：`layout` /
`menus` / `activeKey` / `collapsed` / `breadcrumb` / 品牌三件套 / `showSettings` 系 /
`showTabs` 系可 patch；导航、标签关闭后的路由收敛、真实换肤、鉴权、请求永远不可 patch）。
