# 0010 — `@snui/admin-layout`：新增通用工作台 `ProWorkbench`（独立入口 + ECharts）

## Status

Accepted（Human 直接指令：参考 Finexis 金融仪表盘截图，新增一个**通用工作台统计页**并接入 ECharts 图表，
且「其他的布局组件全部接入这个」）

## Context

三种布局风格（`standard` / `classic` / `aurora`）此前各自 demo 里只放一段说明文字，读者看不到
「布局只负责壳、内容可以换」这件事的真实样子——壳换了，内容也跟着换，什么都证明不了。

需求同时给了参考稿（金融仪表盘：高亮账户卡 + 收入/支出卡 + 交易记录表 + 资金流水面积图 +
收入来源环形图）与三条硬约束：

- **通用**：一份实现，三种布局风格都能用，宿主也能直接拿它当起始页；
- **接 ECharts**：图表是这屏内容的主体，不是装饰；
- **布局无关**：不能假设壳的 class / 尺寸 / 背景，否则「通用」就只是「给 aurora 定制的」。
- 包边界不变（ADR-0006 / 0008）：不做请求 / store / 路由 / 业务口径，交互只 emit。

## Options

1. **每个 demo 各写一份统计页**——三份重复代码，且不可能一致，"换壳不换内容" 无从证明；
2. **放进 barrel（`@snui/admin-layout`）**——会牵 `@snui/echarts`（含 `echarts` peer），
   只想要布局壳的宿主（`apps/admin-basic` 就是）被动背上图表引擎，违反 §81 bundle size；
3. **独立入口 `@snui/admin-layout/workbench` + 独立样式 + `@snui/echarts` 声明为 dependency**，
   `echarts` 作为 peer 交给宿主，构建时 external。

## Decision

采用方案 3：

- `src/pro-workbench/`：
  - `ProWorkbench.vue` —— 内容组件（标题带 / 指标区 / 交易记录 / 资金流水 / 收入来源）；
  - `sn-pro-workbench-types.ts` —— `ProWorkbenchKpi` / `ProWorkbenchKpiStat` / `ProWorkbenchKpiAction` /
    `ProWorkbenchMoneyFlow` / `ProWorkbenchIncomeSource` / `ProWorkbenchTransaction` /
    `ProWorkbenchTransactionStatus` / `ProWorkbenchTrend` / `ProWorkbenchRange`；
  - `index.ts` —— 子入口（组件 + 全部类型）；`ai-description.md` —— 机器可读契约；
  - `ProWorkbench.test.ts` —— 19 个用例（`SnChart` 被 stub）。
- 入口接线：`vite.config.js` 第 5 次独立构建（`pro-workbench/index` → `dist/pro-workbench/index.js` +
  `dist/styles/pro-workbench.css`）；`package.json` 增 `./workbench` + `./workbench/style.css`；
  **barrel 不导出**（这是与三种布局风格唯一不同的地方，理由见上）。
- 构建外部化：`external` 增加 `@snui/echarts` 与 `/^echarts(\/|\b)/` —— 宿主拥有 echarts 版本与
  模块注册（同 `@snui/echarts` 自己的约定），`dist/pro-workbench/index.js` 只 `import { SnChart }`。
- 数据面：`kpis` / `moneyFlow` / `incomeSources` / `transactions` 全走 props，格式化留在宿主；
  交互全 emit：`action` / `kpi-action` / `kpi-select` / `range-change` / `transaction-select`。
- 插槽：`#actions` / `#kpi` / `#chart` / `#income` / `#transactions`，图表可整替。
- 强调位是**位置**而非语义：`kpis[0]` 是参考稿的账户卡，`kpis[1..]` 堆叠成中性卡。

## Reason

- 「通用」的可验证定义是：换壳时内容零改动。独立入口 + 纯 props 让这一点在三个 demo 里直接成立
  （它们引同一份 `apps/docs/.vitepress/utils/workbench-demo.ts`）。
- 不挂 barrel 是 bundle 边界的必然：一个图表引擎不该跟着布局壳走（§57 / §81）。
- 颜色钩子化（`--sn-pro-workbench-*` → `--sn-web-*`）让壳能整体改色而不用碰组件；图表序列色因为
  canvas 限制必须写成字面量，用插槽兜底（见「坑」）。

## Trade-offs

- **多一次构建 / 多一个样式文件**：与 ADR-0008 相同的取舍，换来按需与体积可控。
- **默认文案是中文**：包内不做 i18n（§18），与 `SnProLayoutAurora` 的 `themeToggleLabel` 同一约定，
  英文站靠 demo 影子或宿主传 props。
- **`@snui/echarts` 成为 dependency**：只引布局壳的宿主不会执行到它（不 import workbench 入口即可），
  但 `pnpm install` 会装上——这是「图表可选但声明清晰」的代价。
- 未做：图表下钻、导出、真实周期切换数据（都留给宿主）。

## 坑（实现时真实踩到，记录以免重犯）

1. **canvas 不认 CSS 变量**：`SnChart` 默认 `colorSource: 'tokens'`，主题色是 `var(--sn-web-*)`；
   zrender 把无效值静默保留为黑，于是整张图（含网格线）全黑。工作台传
   `:theme="{ colorSource: 'resolved' }"` 并显式给两条序列色。
2. **`flowRange` 不能有默认值**：给了默认值 = 永远受控，内部 `ref` 改了也不生效（`activeRange` 是
   `props.flowRange ?? innerRange.value`）。回归测试锁住这一条。
3. **标题重复**：aurora 自己有标题带，工作台默认也画一遍 → 同一标题出现两次。加 `showHeading` prop，
   aurora demo 传 `false`。

## Consequences

- 公开面新增（**不进 barrel**）：`ProWorkbench` + 9 个类型，入口 `@snui/admin-layout/workbench` /
  `@snui/admin-layout/workbench/style.css`；既有导出语义不变。
- 产物体积（实测）：`pro-workbench/index.js` 29.80 kB（gzip 5.14 kB）+
  `styles/pro-workbench.css` 14.67 kB（gzip 2.64 kB）；`@snui/echarts` / `echarts` 不进产物。
- 测试：包内 14 文件 224 测试 → **15 文件 244 测试**（+19 工作台、+1 aurora 背景层结构）。
- 文档：新增 `apps/docs/ecosystem/plugins/admin-layout/workbench.md`（zh + en）与侧栏条目；
  aurora / classic / standard 的排版全部换成工作台，demo 高度由 360–520px 提到
  `clamp(560px, 78vh, 900px)`（真实后台窗口比例）；`aurora.md` 补充「内容接入工作台」示例。
- 后续（follow-up）：`apps/admin-basic` 起始页可换成 `ProWorkbench`（需先在其依赖里加 `echarts`）。
