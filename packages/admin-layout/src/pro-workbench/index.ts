/**
 * `@snui/admin-layout/workbench` — 通用工作台统计页入口。
 *
 * ## 为什么是独立子入口，而不是塞进 barrel
 *
 * 工作台要画图，依赖 `@snui/echarts`（一份 ECharts 封装）。barrel（`src/index.ts`）
 * 是「所有布局风格一起引」的路径，`apps/admin-basic` 这类宿主只想要布局壳 —— 如果
 * 工作台挂在 barrel 上，它们会被动把图表依赖拖进包里（AGENTS.md §81 bundle size）。
 *
 * 所以：工作台只有这一条入口，按需引：
 *
 *   import { ProWorkbench } from '@snui/admin-layout/workbench';
 *   import '@snui/admin-layout/workbench/style.css';
 *
 * 样式与 echarts 的分工：本入口的 stylesheet 只含 `ProWorkbench` 自己的规则；
 * `SnChart` 的样式来自宿主已引的 `@snui/echarts/styles`，token 层来自
 * `@snui/vue-web/styles`（和布局入口同一条约定，不重复发 token）。
 */

/** 通用工作台统计页 —— 三种布局风格共用同一份内容。 */
export { default as ProWorkbench } from './ProWorkbench.vue';

// ── Types ────────────────────────────────────────────────────────────────
export type {
  ProWorkbenchIncomeSource,
  ProWorkbenchKpi,
  ProWorkbenchKpiAction,
  ProWorkbenchKpiStat,
  ProWorkbenchMoneyFlow,
  ProWorkbenchRange,
  ProWorkbenchTransaction,
  ProWorkbenchTransactionStatus,
  ProWorkbenchTrend,
} from './sn-pro-workbench-types';