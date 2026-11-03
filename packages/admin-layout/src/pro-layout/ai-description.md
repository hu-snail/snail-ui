# SnProLayout — 中后台布局壳（`@snui/admin-layout` 主组件）

> **机器可读契约** · 版本 0.1.0 · `@experimental`（Public API 未冻结） · ADR-0006

## 定位与硬边界（必读）

**本包只处理布局问题，不处理功能业务。**

| 属于本包（布局域）                     | 不属于本包（宿主业务域）                       |
| -------------------------------------- | ---------------------------------------------- |
| 区域编排：logo / 侧栏 / 顶栏 / 内容 / 页脚 | 登录、鉴权、Token、权限过滤                    |
| 四种形态（side / top / mix / dual）与切换 | 任何 HTTP 请求、Mock、SDK 调用                  |
| 折叠状态（受控 + 非受控）              | Pinia / Vuex 等任何 Store                       |
| 菜单树的渲染、展开、选中高亮           | 路由注册、路由守卫、动态路由 addRoute           |
| 面包屑展示（显式传入或按菜单路径推导）  | 菜单数据的获取与映射（静态读取助手除外，纯函数） |
| `select(key)` 事件抛出                 | 点击菜单后的导航实现（`router.push` 在宿主）    |

AI 修改本组件时，不得引入上述右列任何能力——那会把业务耦合回布局壳。

## 组件族

| 组件            | 职责                                                                       |
| --------------- | -------------------------------------------------------------------------- |
| `SnProLayout`   | 主编排：四形态几何、菜单位置、折叠、面包屑、页脚、设置抽屉与标签栏接线      |
| `SnProLogo`     | 品牌 logo：图片 / 字母牌 + 标题，折叠收起，双插槽                          |
| `SnProSider`    | 左侧栏：brand + 纵向 SnMenu，折叠 / inverted 深色                          |
| `SnProHeader`   | 顶栏：折叠钮 / 横向菜单 / 面包屑 / 操作区插槽 / 设置齿轮                   |
| `SnProTabbar`   | 访问路由标签栏：SnTabs 五样式（line/card/bar/segment/chrome），逐签关闭     |
| `SnProSettings` | 布局偏好抽屉：四形态卡片 / 亮暗 / 主色 / 标签样式；受控 props 省略即隐藏分区 |

## AI Patch Boundary

| 字段 / 插槽       | patchable | 说明                                            |
| ----------------- | --------- | ----------------------------------------------- |
| `layout`          | ✅        | 四形态枚举，v-model 可切换                      |
| `menus`           | ✅        | 数据来源宿主决定；本包只渲染                    |
| `activeKey`       | ✅        | 受控；通常是 `route.name`                       |
| `collapsed`       | ✅        | 受控（v-model）或省略走内部非受控               |
| `breadcrumb`      | ✅        | 显式传入优先；省略时按菜单路径自动推导          |
| `logo/title/mark` | ✅        | 品牌三件套；`#logo` 插槽可整体替换              |
| `siderWidth` 等   | ✅        | 几何参数                                        |
| `showSettings` 系 | ✅        | 设置抽屉开关 + `settingsLabels` / `mode` / `primaryId` / `primaryColors` / `tabType`（v-model 转发，省略分区隐藏） |
| `showTabs` 系     | ✅        | `tabs: SnProTabItem[]`（宿主维护，affix 传 `closable: false`）+ `tabType`；点击 / 关闭只 emit `tab-select` / `tab-close` |
| 菜单点击后的导航  | ❌        | 永远 emit `select`，宿主实现                    |
| 标签关闭后的路由收敛 | ❌     | 永远 emit `tab-close`，宿主决定跳到哪个邻居签   |
| 主题 / 主色的真实换肤 | ❌    | 只 emit `update:mode` / `update:primaryId`，CSS 变量覆写在宿主 |
| 登录态 / 权限过滤 | ❌        | 宿主在传入 `menus` 前自行过滤                   |

## 形态几何

```text
side  [Sider(brand+menu)] [header(toggle+breadcrumb+actions+gear) / content / footer]
top   [header(brand+horizontal menu+actions+gear)] [strip(breadcrumb)] / content / footer
mix   [header(brand+horizontal top menu+actions+gear)]
      [Sider(active top children, no brand)] [strip(toggle+breadcrumb) / content / footer]
dual  [rail(top icons, brand mark)] [Sider(children, no brand)] [strip(toggle+breadcrumb+gear) / content / footer]
```

mix / dual 下当前一级无可见子级时，二级栏自动消失（vben 行为）。
设置齿轮在每个形态都可达：side/top/mix 在页头，dual（无页头）在条带右侧，
且 `showSettings` 时条带保证渲染（即使无折叠钮与面包屑）。

## 菜单来源（两条合法路径）

1. **静态路由读取**：`routesToMenuOptions(routes, { iconMap })` 读
   `meta.title / meta.icon / meta.hidden / meta.order`（结构化类型，
   `RouteRecordRaw[]` 与 `router.options.routes` 均可直传）；
2. **动态菜单**：宿主把后端数据映射成 `SnMenuOption[]` 传入（映射是业务，
   不进本包）。

点击一律 emit `select(key, item)`。

## 样式契约

- 全部走 `--sn-web-*` token（暗色随宿主 `.dark` 自动翻转）；
- 组件级可覆写 hook：`--sn-pro-sider-bg / -border-color / -title-color`、
  `--sn-pro-logo-title`；
- `invertedSider` 对齐 SnMenu inverted 深色面（`#001529`，与 n-menu 经典侧栏一致）；
- 包样式入口 `@snui/admin-layout/styles`（不含 token 层，token 来自 `@snui/vue-web/styles`）。

## 测试

行为级：形态结构、折叠受控/非受控、select 事件、面包屑推导、插槽、
菜单映射纯函数（含 hidden/order/隐藏子树/幂等）、标签栏渲染 / 关闭事件 /
affix 不可关、设置面板分区显隐 / 各分区事件、labels 覆写。
