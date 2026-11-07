# SnProSearch — 共享菜单检索件（`@snui/admin-layout`）

> **机器可读契约（共享件）** · 版本 0.1.0 · `@experimental` · ADR-0008

`SnProSearch` 是**跨布局共享**的菜单检索件：任何布局风格需要「搜菜单」都复用它，
匹配规则只存在一处（纯函数 `searchMenuOptions`，可单测）。它不属于某一个风格，
从 barrel 或任一布局入口引入都可用。

## 行为

- 输入框（`SnInput` + 前置 Search 图标）+ **非 teleport** 的绝对定位结果面板；
- 聚焦且 `trim(query).length >= minLength` 时打开；
- `↓` / `↑` 在结果间移动（环绕）、`Enter` 激活、`Esc` 关闭；行内用 `mousedown.prevent`
  抢在 blur 之前，保证点击不被关闭竞态吞掉；
- 命中行展示匹配 label + 祖先路径（`系统管理 / 用户管理`），坐标一眼可见；
- 无命中渲染 `emptyText`；
- 选中只 emit `select(key, item)`，**导航永远在宿主**。

## 匹配规则（`searchMenuOptions(options, query, config)`）

| 规则             | 说明                                                              |
| ---------------- | ----------------------------------------------------------------- |
| 大小写不敏感     | 统一 `trim` + `toLocaleLowerCase` 后做子串匹配                     |
| 匹配范围         | 节点自身 label **或** 任一祖先 label（因此搜分类名能搜到其子级）   |
| 默认只返回叶子   | 带 `children` 的分类节点默认不作为命中（`includeGroups: true` 可选） |
| 跳过 disabled    | disabled 节点不返回，但其子树仍继续遍历（vben/antd 行为一致）      |
| 结果上限         | `maxResults`（默认 10），超出截断                                  |
| 顺序稳定         | 深度优先、兄弟按原序；等价输入两次调用结果深度相等（幂等/确定）     |
| 空 query         | 返回 `[]`（不返回「全部」，避免面板一开就糊满）                     |

返回 `SnProMenuHit { key, label, path: SnMenuOption[] }`，`path` 即祖先链。

## AI Patch Boundary

| 项                          | patchable | 说明                                              |
| --------------------------- | --------- | ------------------------------------------------- |
| `menus` / `placeholder` / `minLength` / `maxResults` / `size` / `clearable` / `disabled` | ✅ | 数据与外观 |
| `includeGroups` / `filter` / `closeOnSelect` | ✅ | 结果集与交互                                  |
| `searchLabel` / `emptyText` | ✅        | 文案（包内不内置 i18n，props 省略时用内置中文兜底） |
| 命中后的导航                | ❌        | 永远 emit `select`，宿主 `router.push`             |
| 远端检索 / 打点             | ❌        | `search` 事件只透传输入，请求逻辑在宿主             |
| 权限过滤                    | ❌        | 宿主用 `filter` 传谓词，包不读权限态                |

## 样式契约

- 全部走 `--sn-web-*` token；类名前缀 `sn-pro-search__*`；
- 面板不使用 teleport（与 `SnMenu` collapsed 的纯 CSS 方案一致），便于单测与 SSR；
- 样式随所属布局入口的样式表一起加载（classic 入口的 `style.css` 已含本件规则）。

## 测试

`SnProSearch.test.ts` + `sn-menu-search.test.ts`：面板开合、过滤、键盘 ↑↓Enter、Esc、
空态、`select` / `search` 事件、`minLength`、清空、命中路径展示，以及纯函数的
命中 label / 命中祖先 / 大小写 / `maxResults` / 空串 / 确定性。
