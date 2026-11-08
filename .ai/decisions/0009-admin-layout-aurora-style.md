# 0009 — `@snui/admin-layout`：新增 `aurora` 布局风格（通屏背景 + 顶部条 + 悬浮一级图标栏）

## Status

Accepted（Human 直接指令：参考截图新增一种布局风格；要求通屏浅色背景且背景类型可配置
（纯色 / 背景图 / 渐变光晕 / 弥散），顶部条放 logo + 二级菜单模块 + 右侧工具区
（亮暗切换 / 搜索 / 中英切换 / 消息通知 / 个人信息），左侧悬浮一级菜单图标、底部退出登录与
帮助说明，并且**每个区域都支持插槽自定义按钮**）

## Context

ADR-0008 已把包拆成「每种布局风格 = 独立入口 + 独立样式文件、按需加载」，并确立
「风格只是壳、共享件（`SnProLogo` / `SnProSearch` / `SnProNotice` / `SnProUser`）复用」的骨架。
菜单工具里已有 `findTopAncestorKey` / `menuChildrenOf` / `stripMenuChildren` 三个纯函数，
正是为「一级图标栏 + 二级模块条」这种几何准备的（`dual` 形态用过）。

新需求与既有两风格（`standard` 四形态、`classic` 分类侧栏）在几何上互不相同：没有常驻侧栏，
一级菜单变成**悬浮圆角图标栏**，二级菜单升到**顶部条**里，且背景从「内容区底色」升级为
**通屏可配置背景**。同时新增两个此前没有的交互：亮暗切换与中英切换（都只是受控/非受控开关）。

约束：

- additive —— 不改既有导出名、不移动既有文件、`standard` / `classic` / `/styles` 行为不变；
- 包边界不变（ADR-0006）：不做鉴权 / 请求 / store / 路由注册 / i18n / 主题引擎；
- 颜色只用 `--sn-web-*` token（暗色随宿主翻转），不新增依赖；
- 每个区域都要能被宿主插槽整替（自定义按钮）。

## Options

1. **复用 `SnProLayout` 的 `top` / `dual` 形态 + 新 props 表达背景**——改动会落在既有公共 API 上，
   且 `dual` 的二级栏是常驻列、与「二级进顶栏」冲突；不满足 additive；
2. **在 `classic` 上加一套 `background` / 顶部条变体**——把两种几何硬塞进一个组件，props 与
   样式分支会迅速失控，也让 `classic` 的契约变模糊；
3. **新增独立风格 `aurora`（独立入口 + 独立样式 + 复用共享件）**，背景预设用纯函数解析成 CSS 变量。

## Decision

采用方案 3：

- 新增 `src/pro-aurora/`：
  - `SnProLayoutAurora.vue` —— 壳：通屏背景层 + 顶部条 + 悬浮图标栏 + 内容区；
  - `sn-pro-aurora-types.ts` —— `SnProLayoutAuroraBackground`（`solid|image|gradient|mesh`）、
    `SnProLayoutAuroraMode`（`light|dark`）、`SnProLayoutAuroraLocale`（`zh|en`）、
    `SnProLayoutAuroraGeometry`、`SnProLayoutAuroraLocaleLabels`；
  - `sn-pro-aurora-background.ts` —— 纯函数 `auroraBackgroundVars()`（预设 → CSS 变量）、
    `cssUrl()`、`auroraGlowColors()`；变量名 `AURORA_BG_IMAGE_VAR` / `AURORA_GLOW_VARS` 公开；
  - `index.ts` —— 子入口；`ai-description.md` —— 机器可读契约；
- 入口接线：`vite.config.js` 增加第 4 次独立构建（`pro-aurora/index` → `dist/pro-aurora/index.js`
  - `dist/styles/pro-aurora.css`）；`package.json` 增加 `./layouts/aurora` +
    `./layouts/aurora/style.css`；barrel 追加导出；
- 背景几何：**形状与模糊在样式里，调色板在 props 里**——`background: 'gradient' | 'mesh'`
  时由 `auroraBackgroundVars()` 产出 `--sn-pro-aurora-glow-1..4`（默认取
  `--sn-web-color-action-primary` 与 `--sn-web-color-feedback-info`），样式表用
  `radial-gradient` 排布；`image` 只产出 `--sn-pro-aurora-bg-image`；
- 亮暗 / 中英：`v-model:mode` / `v-model:locale`，省略即非受控（与 `collapsed` 同一模式），
  只 emit，不引主题引擎、不内置翻译。

## Reason

- 几何差异足够大，硬塞进既有组件会让两个风格的 props 与样式互相污染；独立风格符合 ADR-0008 既定骨架。
- 背景「形状 vs 调色板」分离的好处：宿主要换品牌色只传 `backgroundColors`，要调强度只覆写
  `--sn-pro-aurora-glow-opacity` / `--sn-pro-aurora-mesh-opacity` / `--sn-pro-aurora-glow-blur`，
  两边互不牵连；预设矩阵因此可在 node 环境用纯函数单测（不依赖浏览器）。
- 一级栏用 `stripMenuChildren` + `SnMenu collapsed`、二级模块用 `menuChildrenOf` + `SnMenu
horizontal`、高亮用 `findTopAncestorKey`——全部复用既有纯函数，新代码不重复菜单逻辑。

## Trade-offs

- **不是「自动跟随系统暗色」**：包内不做 `prefers-color-scheme` 监听，`mode` 只是宿主的外观开关；
  真正的换面仍由宿主 `.dark` 类或 token 覆盖决定（与 `standard` 的设置抽屉同一约定）。
- **中英切换只切「按钮字形」**：包内不内置 i18n，字号/文案变化是宿主的事。
- **共享件按入口重复**：与 ADR-0008 相同的取舍，多风格同时引入时共享件各存一份。
- **半透明浮层**（`color-mix` 半透明 + `backdrop-filter: blur`）是本风格的核心视觉语言：
  通屏背景必须从悬浮图标栏与内容面板后面透出来（见「修订 2026-11」）。老引擎不支持
  `backdrop-filter` 时面板退化为半透明纯色，背景仍可见。
- 未做：`aurora` 的偏好抽屉、admin-basic 切换到该风格、英文 demo 影子、真实换肤。

## Consequences

- 公开面新增：`SnProLayoutAurora` / `auroraBackgroundVars` / `AURORA_BG_IMAGE_VAR` /
  `AURORA_GLOW_VARS` 及 5 个类型；既有导出与 `/styles` 语义不变；
- 测试：新增 `sn-pro-aurora-background.test.ts`（14）+ `SnProLayoutAurora.test.ts`（40），
  包内由 12 文件 167 测试 → 14 文件 221 测试；
- 产物体积（实测）：`pro-aurora/index.js` 37.98 kB（gzip 8.09 kB）+
  `styles/pro-aurora.css` 14.67 kB（gzip 2.91 kB），且不含 `sider / header / tabbar /
settings / classic` 任何规则（按需）；
- 文档站「布局风格」章节新增 `aurora` 小节 + live demo（`pro-layout-web-aurora`）。

## 修订 2026-11：背景属于布局自身，浮层半透明

人评：首次实现把「页面底色 + 圆角应用卡片（inset 14px）」当成结构，视觉上读成「一张页面背景围着
一个应用卡片」——即**背景在布局外面**。参考稿的关系相反：背景是布局自己的面，内容浮在它上面。

改法（`SnProLayoutAurora.vue`）：

- `.sn-pro-aurora__bg` 仍然 `inset: 0`，但**内容层不再上色**：`.sn-pro-aurora__app` 从
  `background: var(--sn-pro-aurora-app)` 改为 `transparent`，顶栏也是 `transparent`，所以背景在
  顶栏后面、面板圆角外、浮层之间都看得见；
- 白色只出现在**两块浮层**上：悬浮图标栏 `--sn-pro-aurora-panel`（rgba 白 0.86 + `backdrop-filter`）
  与内容面板（`color-mix(in srgb, --sn-pro-aurora-app 94%, transparent)` + 22px 圆角 + 柔和投影）；
- 去掉布局根上的 inset 留白与整块卡片圆角/投影（`--sn-pro-aurora-inset` 现在只作为 body 的内边距）；
- 光晕默认强度下调到 `-glow-opacity: 0.34` / `-mesh-opacity: 0.45`（原来 0.5 / 0.7 在浅底上过艳）；
- 页面底 `--sn-pro-aurora-page` 从 `#eef0f8` 调到 `#f3f4fa`，贴近参考稿的浅紫灰。

由此得到的三层语义（文档 / README / ai-description 同步更新）：

| 层     | 元素                                                | 上色                                     |
| ------ | --------------------------------------------------- | ---------------------------------------- |
| 背景层 | `.sn-pro-aurora__bg`（`z-index: 0`，`aria-hidden`） | 页面底 + 预设（纯色 / 图 / 光晕 / 弥散） |
| 内容层 | `.sn-pro-aurora__app`（`z-index: 1`）               | transparent                              |
| 浮层   | rail + main                                         | 半透明白 + 模糊                          |

新增回归测试：`sn-pro-aurora__bg` 必须是布局根的第一个子元素、`.sn-pro-aurora__app` 必须挂在根下
（`SnProLayoutAurora.test.ts` · "should paint the background inside the layout"）。

## 修订 2026-11（二次）：模块要有边界，不能糊成一整块面板

人评：内容区仍是一整块白面板把标题带和内容全包住，**看不出模块**。参考稿里标题只是内容里的第一个元素，
各模块（账户卡 / 收入支出 / 交易记录 / 流水 / 收入来源）是各自独立的卡片。

改法：

- `.sn-pro-aurora__main` 去掉 `background` / `border` / `border-radius` / `backdrop-filter` / `box-shadow`，
  变成**透明的滚动容器**（只留内边距与 `overflow: auto`）；
- 标题带 `.sn-pro-aurora__title-band` 升格为一张玻璃浮层卡片（与内容卡片同层、同间距）；
- 内容区 `.sn-pro-aurora__content` 向外提供卡片钩子
  （`--sn-pro-workbench-card` / `-card-border` / `-card-blur` / `-card-shadow`），
  工作台的每张卡片因此变成半透明浮层 —— 卡与卡之间露出布局背景，模块边界清楚；
- `ProWorkbench` 侧把这些值都做成钩子（默认仍是 token 实心面），并在 `.kpi-col` 上用
  `justify-content: space-between; height: 100%` 让「收入 / 支出」列与账户卡同高、两行撑开。

回归测试：`SnProLayoutAurora.test.ts` · "should keep the content area transparent so modules read as
separate cards"（内容模块必须进 `__content` 槽位、与标题带同级）。
