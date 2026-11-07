# SnProLayoutClassic — `classic` 布局风格（`@snui/admin-layout`）

> **机器可读契约（`classic` 风格）** · 版本 0.1.0 · `@experimental`（Public API 未冻结） · ADR-0006 / ADR-0008
>
> 独立入口：`import { SnProLayoutClassic } from '@snui/admin-layout/layouts/classic'` +
> `import '@snui/admin-layout/layouts/classic/style.css'`（barrel + `@snui/admin-layout/styles`
> 亦可）。`standard` 风格见 `src/pro-layout/ai-description.md`。

## 定位与硬边界（必读）

**本组件只处理布局问题，不处理功能业务**（与 ADR-0006 一致）。

| 属于本组件（布局域）                       | 不属于本组件（宿主业务域）                     |
| ------------------------------------------ | ---------------------------------------------- |
| 分类侧栏 + 用户卡片 + 内容区顶部通栏的编排 | 登录、鉴权、Token、权限过滤                    |
| 折叠状态（受控 + 非受控）                  | 任何 HTTP 请求、Mock、SDK 调用                  |
| 菜单树的渲染、展开、选中高亮               | Pinia / Vuex 等任何 Store                       |
| 面包屑展示（显式传入或按菜单路径推导）     | 路由注册、路由守卫、动态路由 addRoute           |
| 模块标题带（`pageTitle` / `#title`）       | 未读消息的获取、已读状态的持久化                |
| 四个 emit：`select` / `search-select` / `notice-select` / `user-select`（+ `notice-read-all`、`update:collapsed`） | 点击后的导航（`router.push`）、登出、标记已读（都在宿主） |

## 结构几何

```text
[aside siderWidth→siderCollapsedWidth]        [body]
 ├ brand : SnProLogo                          ├ header : 折叠钮 · SnBreadcrumb · SnProSearch · SnProNotice · #actions
 ├ nav   : SnMenu(vertical, 分类 + 子菜单)     ├ title  : pageTitle / #title（模块大标题带）
 └ foot  : SnProUser（#user 整体替换）         ├ content: 浅色通屏 + 默认插槽
                                               └ footer : #footer（可选）
```

- 侧栏宽度是受控几何：`siderWidth`(224) / `siderCollapsedWidth`(56)，经 CSS 变量
  `--sn-pro-classic-sider-width` / `--sn-pro-classic-sider-collapsed-width` 下发；
- `#user` 插槽存在**或** `user` prop 存在时才渲染底部区域；`showSearch` / `showNotice`
  为 false 时不渲染对应共享件；
- 标题带仅在 `#title` 插槽存在或 `pageTitle !== ''` 时渲染。

## 复用关系（不要在本组件里再写一遍）

| 共享件        | 用途                                       |
| ------------- | ------------------------------------------ |
| `SnProLogo`   | 品牌区（折叠收起标题）                     |
| `SnProSearch` | 顶栏菜单检索（规则来自 `searchMenuOptions`） |
| `SnProNotice` | 顶栏消息通知（角标 `${max}+` 封顶）         |
| `SnProUser`   | 侧栏底部用户卡片（折叠仅头像）             |
| `SnMenu` / `SnBreadcrumb`（`@snui/vue-web`） | 菜单与面包屑 |

新增风格时同样复用这批件，**只在壳的几何上做差异**。

## AI Patch Boundary

| 字段 / 插槽               | patchable | 说明                                                       |
| ------------------------- | --------- | ---------------------------------------------------------- |
| `menus`                   | ✅        | 数据来源宿主决定；本组件只渲染                             |
| `activeKey`               | ✅        | 受控；通常是 `route.name`                                  |
| `collapsed`               | ✅        | `v-model:collapsed` 受控，或省略走内部非受控               |
| `breadcrumb`              | ✅        | 显式传入优先；省略时按菜单路径自动推导                     |
| `pageTitle` / `#title`    | ✅        | 模块大标题                                                 |
| `logo/title/mark` / `#logo` | ✅      | 品牌三件套（`#logo` 整体替换）                             |
| `user` / `userMenus` / `#user` | ✅   | 侧栏底部用户卡片的数据与整体替换                           |
| `siderWidth` / `siderCollapsedWidth` / `fixed` / `showCollapse` | ✅ | 几何与开关 |
| `showSearch` / `searchPlaceholder` / `#search` | ✅ | 检索件开关、文案与整体替换             |
| `showNotice` / `noticeCount` / `noticeItems` / `#notice` | ✅ | 通知开关、角标、宿主数据与整体替换 |
| `#actions` / `#footer`    | ✅        | 宿主动作区与页脚                                           |
| 菜单点击后的导航          | ❌        | 永远 emit `select`，宿主实现                               |
| 搜索命中后的导航          | ❌        | 永远 emit `search-select`，宿主实现                        |
| 通知打开 / 标记已读       | ❌        | emit `notice-select` / `notice-read-all`，宿主持久化       |
| 用户菜单语义（登出等）    | ❌        | emit `user-select`，宿主决定含义                           |
| 登录态 / 权限过滤         | ❌        | 宿主在传入 `menus` 前自行过滤                              |
| 真实换肤                  | ❌        | 只暴露 CSS 变量 hook，变量覆写在宿主                       |

## 样式契约

- 全部走 `--sn-web-*` token（暗色随宿主自动翻转），无硬编码色值；
- 壳级 hook：`--sn-pro-classic-sider-width` / `--sn-pro-classic-sider-collapsed-width` /
  `--sn-pro-classic-sider-bg` / `--sn-pro-classic-sider-border-color` /
  `--sn-pro-classic-header-bg` / `--sn-pro-classic-body-bg`；
- 样式文件：`@snui/admin-layout/layouts/classic/style.css`（自包含：classic 壳 + 它用到的
  共享件规则，不含 standard 专属规则）。

## 测试

行为级（`SnProLayoutClassic.test.ts`）：结构渲染、面包屑推导与显式优先、折叠受控 / 非受控、
菜单 / 搜索 / 通知 / 用户事件转发、`title` / `actions` / `user` / `footer` 插槽、
`fixed` 开关、几何变量下发。
