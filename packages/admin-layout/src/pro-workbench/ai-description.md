# ProWorkbench · ai-description

## 它是什么

一屏**布局无关**的后台统计页：标题带 + 指标区（高亮账户卡 + 收入/支出堆叠卡）+ 交易记录表 +
资金流水（面积 + 折线）+ 收入来源（环形）。所有区域数据驱动，插槽可整替。

入口：`@snui/admin-layout/workbench`（**不在 barrel 里**）。

```
import { ProWorkbench } from '@snui/admin-layout/workbench';
import '@snui/admin-layout/workbench/style.css';
```

## 为什么是独立入口

它依赖 `@snui/echarts`（`@snui/admin-layout` 的 dependency，`echarts` 为 peer）。barrel 是「所有布局
风格一起引」的路径，只想要布局壳的宿主（如 `apps/admin-basic`）不该被动把图表引擎拖进产物（§81）。
样式同理独立：`workbench/style.css` 只含工作台规则，`SnChart` 样式来自宿主已引的 `@snui/echarts/styles`。

## 关键设计

1. **位置决定强调**：`kpis[0]` 渲染成高亮账户卡，`kpis[1..]` 纵向堆叠成中性卡。组件不判断「哪张卡重要」——
   那是宿主的语义。
2. **颜色是数据，不是样式**：图表画在 canvas 上，zrender 不认 `var(--sn-web-*)`，默认的
   `colorSource: 'tokens'` 会让序列与网格线全部退化成黑色。所以这里给 `SnChart` 传
   `:theme="{ colorSource: 'resolved' }"`（读 DOM token 再传字面量），并且显式指定两条序列色。
   其余 UI 颜色仍是 `--sn-pro-workbench-*` 钩子 → `--sn-web-*` token。
3. **周期选择受控是显式的**：`flowRange` **没有默认值**。给了默认值就等于永远受控，内部 `ref` 改了也不
   生效（这个 bug 在实现时真实发生过，测试 `should emit range-change and move the active segment` 覆盖）。
4. **`:show-heading="false"`**：aurora 自己就有标题带，工作台再画一遍页面标题会出现两次。

## 数据契约（数据即 props）

| prop                                        | 说明                                                                                        |
| ------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `kpis: ProWorkbenchKpi[]`                   | 第一张高亮卡：`delta` / `trend` / `hint` / `actions`（药丸）/ `stats`（副指标）/ `footNote` |
| `moneyFlow: ProWorkbenchMoneyFlow`          | `labels` + `income` + `expense`（同轴同长）                                                 |
| `incomeSources: ProWorkbenchIncomeSource[]` | 环形分段，只比值有意义；`display` 是环形下方的格式化金额                                    |
| `transactions: ProWorkbenchTransaction[]`   | `time` / `amount` / `category` / `status`；`status` ∈ success / failed / pending            |

## 事件

`action(kind)` / `kpi-action(kpi, action)` / `kpi-select(key, kpi)` / `range-change(range)` /
`transaction-select(key, row)` —— 全部只 emit，行为在宿主（ADR-0006）。

## 插槽

`#actions`（标题带工具）、`#kpi`（整块指标区）、`#chart`、`#income`、`#transactions`。

## 改动它时注意

- 不要给 `flowRange` 加默认值（见上）；
- 不要用 `var(--sn-*)` 给 ECharts option 上色（canvas 解析不了）；
- 不要把 `@snui/echarts` 改回内联打包，也不要把它挂到 barrel 上；
- 文案默认中文、无 i18n（§18），新增文案同样走 props 默认值。

## 测试

`ProWorkbench.test.ts`：结构 / 强调位 / 状态点 / 空态 / 环形中心 / 五类事件 / 五个插槽 / 图表选项透传。
`SnChart` 在测试里被 stub —— 这里验的是工作台契约，不是 canvas 渲染（后者归 `packages/echarts`）。
