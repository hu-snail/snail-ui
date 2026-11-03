# 0006 — 中后台布局模板：新增 `@snui/admin-layout` 包（布局壳与业务分离）

## Status

Accepted（Human 直接指令：新增 sn-layout 包，服务 admin 中后台布局，安装后直接替换 layout.vue）

## Date

2026-11-03

## Context

`apps/admin-basic` 里有一份手写的 `AdminLayout.vue`：侧栏 brand + SnMenu、
header 折叠钮 + 面包屑 + 控制区。它把**布局几何**与**业务接线**
（auth store、i18n 翻译、路由守卫、登出）揉在同一个 SFC 里——换一个中后台
项目就要把这套结构重抄一遍，再自己拆业务。

用户诉求：

1. 新增独立包（sn-layout），**依赖 @snui/vue-web**，已使用 vue-web 的项目
   安装后直接替换自己的 `layout.vue`；
2. 只处理布局问题，不处理功能业务（无鉴权 / 请求 / store / 路由注册）；
3. 包含 logo、左侧栏、顶部导航三个子组件；
4. 参考优秀开源后台模板提供多种布局形态并支持切换
   （vue-element-admin / vben-admin / ant-design-pro 的 side / top / mix / 双列形态）；
5. 菜单同时支持静态路由读取与后端动态菜单两种来源；
6. 文档站集成配置文档与实时预览。

## Options

1. 把 AdminLayout 下沉进 `@snui/vue-web` —— 拒绝：vue-web 是 naive-ui 对齐的
   原子组件库（§112），塞页面级布局壳会污染参考库边界；
2. 塞进 `@snui/templates` —— 拒绝：templates 的 web/uni 子路径与样式管线
   都按「页面模板」粒度组织，布局壳是持续演进的独立产品线，混进去会让
   两个产品线的发布节奏互相牵制；
3. 新增 `@snui/admin-layout` 包 —— **采纳**：与 templates 同级的组装层包，
   依赖方向 `layout → vue-web → tokens`，无环。

## Decision

- 包名 `@snui/admin-layout`（目录 `packages/admin-layout`），组件前缀 `SnPro*`
  （SnProLayout / SnProLogo / SnProSider / SnProHeader），与 vue-web 的
  `SnLayout` 原语族显式区分；
- 四种形态：`side`（经典侧栏）/ `top`（顶部菜单）/ `mix`（顶部一级 + 侧栏二级，
  vben mixed-nav）/ `dual`（图标栏 + 二级列，vben mixed-sidebar 系），
  `v-model:layout` 供宿主做形态切换器；
- 菜单契约 = `SnMenuOption[]`（vue-web barrel 导出的同类型）：
  静态路由用 `routesToMenuOptions(routes)` 读取 `meta.title/icon/hidden/order`；
  动态菜单由宿主把后端数据映射成 options 传入；点击只 emit `select(key)`，
  导航永远在宿主（包不依赖 vue-router，用结构化 `RouteLike` 类型读取）；
- 样式走组件 scoped CSS + `--sn-web-*` token，构建输出单一
  `dist/styles/index.css`（token 层不重复产出，宿主已有 `@snui/vue-web/styles`）；
- 职责边界写入包 README + `pro-layout/ai-description.md` + 文档页三处。

## Trade-offs

- 不依赖 vue-router：静态路由读取用结构化类型（duck-typing RouteRecordRaw），
  代价是 TS 层面拿不到 vue-router 的字面量类型收窄；
- 形态切换只切几何与菜单位置，不做过渡动画（v0.1 范围裁剪）；
- dual 形态的图标栏复用 SnMenu collapsed 模式，hover 气泡行为跟随 SnMenu。

## Consequences

- admin-basic 可在后续任务把 AdminLayout 替换为 `SnProLayout` + 自行业务接线
  （follow-up，不在本任务）；
- 文档站新增 `/templates/admin-layout/pro-layout`（双语）与 demo 6 例；
- 包标记 `@experimental`（§79），Public API 未冻结。
