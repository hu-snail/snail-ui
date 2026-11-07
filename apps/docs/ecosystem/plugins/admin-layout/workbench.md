# 工作台｜通用统计页（接 ECharts）

`ProWorkbench` 是一屏**布局无关**的统计页：左侧一张高亮账户卡 + 收入 / 支出中性卡，右侧交易记录表，
下方是资金流水（面积 + 折线）与收入来源（环形）。三种布局风格（`standard` / `classic` / `aurora`）
的 demo 用的都是同一份数据 —— 换壳时内容一个数字都不动，这就是「布局只负责壳」的可视证明。

> 平台：`Web` · 组件：`ProWorkbench` · 入口：`@snui/admin-layout/workbench` · 状态：`@experimental`

## 独立引入

```ts
import { ProWorkbench } from '@snui/admin-layout/workbench';
import '@snui/admin-layout/workbench/style.css';
```

工作台**不在整包 barrel 里**，这是刻意的：它牵 `@snui/echarts`（一份 ECharts 封装），而只要布局壳的宿主
不该被动背上一个图表引擎。样式同理：`workbench/style.css` 只含工作台自己的规则，`SnChart` 的样式来自你已引的
`@snui/echarts/styles`，token 层来自 `@snui/vue-web/styles`。

## 结构

| 区域     | 内容                                                                                                       |
| -------- | ---------------------------------------------------------------------------------------------------------- |
| 标题带   | `title` / `subtitle` · 右侧主/次行动（`#actions` 整替；默认「创建报告 / 添加钱包」都只 emit）             |
| 指标区   | `kpis[0]` 高亮账户卡（趋势药丸 / 药丸按钮 / 副指标 / 脚注）· `kpis[1..]` 纵向堆叠的中性卡（`#kpi` 整替）    |
| 交易记录 | `transactions` 表（时间 / 金额 / 分类 / 状态；状态是彩点 + 文案，`#transactions` 整替）                   |
| 资金流水 | `moneyFlow` 面积 + 折线（图例 / 周期切换）· ECharts（`#chart` 整替）                                     |
| 收入来源 | `incomeSources` 环形 + 中心占比 + 三项金额 · ECharts（`#income` 整替）                                   |

## 用法

```vue
<script setup lang="ts">
import { ProWorkbench } from '@snui/admin-layout/workbench';
import '@snui/admin-layout/workbench/style.css';
import type { ProWorkbenchKpi } from '@snui/admin-layout/workbench';

const kpis: ProWorkbenchKpi[] = [
  {
    key: 'balance',
    label: '总余额',
    value: '¥540,841.00',
    delta: '4%',
    trend: 'up',
    hint: '较上月',
    actions: [
      { key: 'transfer', label: '转账' },
      { key: 'request', label: '收款' },
    ],
    stats: [
      { key: 'earnings', label: '总收益', value: '¥123,521.00' },
      { key: 'rate', label: '活期利率', value: '3.2%' },
    ],
    footNote: '5 分钟前更新',
  },
  { key: 'income', label: '总收入', value: '¥15,500.00', delta: '8%', trend: 'up' },
  { key: 'expense', label: '总支出', value: '¥11,129.00', delta: '6%', trend: 'down' },
];

const moneyFlow = {
  labels: ['1月', '2月', '3月'],
  income: [28, 42, 36],
  expense: [33, 30, 41],
};
</script>

<template>
  <ProWorkbench
    :kpis="kpis"
    :money-flow="moneyFlow"
    :income-sources="[{ key: 'main', label: '主业收入', value: 84, display: '¥10,000.00' }]"
    :transactions="[{ key: 't1', time: '06:12', amount: '-¥22.00', category: '外卖', status: 'success' }]"
    @action="(kind) => (kind === 'primary' ? openWallet() : openReport())"
    @range-change="loadRange"
    @transaction-select="openTransaction"
  />
</template>
```

## Props

| 名称                  | 类型                         | 默认                                    | 说明                                                       |
| --------------------- | ---------------------------- | --------------------------------------- | ---------------------------------------------------------- |
| `title`               | `string`                     | `'工作台'`                              | 标题                                                       |
| `subtitle`            | `string`                     | `'这里是今天的关键指标概览。'`           | 副标题（`''` 不渲染）                                      |
| `showHeading`         | `boolean`                    | `true`                                  | 壳自己已有标题带时置 `false`，避免同一个标题出现两次       |
| `kpis`                | `ProWorkbenchKpi[]`          | `[]`                                    | 第一张是高亮账户卡，其余是中性卡                            |
| `moneyFlow`           | `ProWorkbenchMoneyFlow`      | —                                       | 资金流水两条序列（`undefined` 不画图）                     |
| `incomeSources`       | `ProWorkbenchIncomeSource[]` | `[]`                                    | 环形图分段（只比值有意义）                                  |
| `transactions`        | `ProWorkbenchTransaction[]`  | `[]`                                    | 交易行                                                     |
| `transactionsColumns` | `string[]`                   | `['时间','金额','分类','状态']`          | 表头                                                       |
| `transactionsEmptyText` | `string`                   | `'暂无交易记录'`                        | 空态文案                                                   |
| `flowRange`           | `string`                     | —                                       | 传入即受控（不传时组件自己记住选择）                        |
| `rangeOptions`        | `string[]`                   | `['年度','季度','月度']`                 | 周期选项                                                   |
| `flowTitle` / `incomeTitle` / `transactionsTitle` | `string` | `'资金流水'` / `'收入来源'` / `'交易记录'` | 三张卡的标题                              |
| `primaryActionText` / `secondaryActionText` | `string` | `'添加钱包'` / `'创建报告'`     | 标题带按钮文案                                              |
| `chartHeight`         | `number`                     | `260`                                   | 图表高度（px）                                              |

## 事件

| 事件                 | 参数                             | 何时触发                       |
| -------------------- | -------------------------------- | ------------------------------ |
| `action`             | `(kind: 'primary' \| 'secondary')` | 标题带主/次行动被点             |
| `kpi-action`         | `(kpi, action)`                  | 高亮卡里的药丸按钮被点          |
| `kpi-select`         | `(key, kpi)`                     | 点某张指标卡（下钻是宿主的事）  |
| `range-change`       | `(range: string)`                | 切周期                         |
| `transaction-select` | `(key, row)`                     | 点某行交易                      |

## 插槽

| 插槽           | 替换                            |
| -------------- | ------------------------------- |
| `actions`      | 标题带右侧工具                  |
| `kpi`          | 整个指标区                      |
| `chart`        | 资金流水图                      |
| `income`       | 收入来源环形区                  |
| `transactions` | 交易记录表                      |

## 换肤

每个模块（指标区 / 交易记录 / 资金流水 / 收入来源）都是**独立卡片**，卡与卡之间有间距；卡片面本身也是钩子，
玻璃壳（aurora）把卡片改成半透明浮层，于是模块边界清楚、布局背景从卡后透出：

```css
/* aurora 的做法：内容区里所有卡都变成同一层玻璃 */
.sn-pro-aurora__content {
  --sn-pro-workbench-card: var(--sn-pro-aurora-panel);
  --sn-pro-workbench-card-border: rgba(255, 255, 255, 0.7);
  --sn-pro-workbench-card-blur: var(--sn-pro-aurora-panel-blur);
  --sn-pro-workbench-card-shadow: 0 10px 30px -24px rgba(24, 24, 46, 0.4);
}
```

其余颜色都是 `--sn-pro-workbench-*` 钩子，默认取 `--sn-web-*` token，所以跟随宿主的主题：

```css
.my-shell {
  --sn-pro-workbench-surface: #fff;
  --sn-pro-workbench-soft: #f5f5f8;
  --sn-pro-workbench-accent: #4fb3ae;
  --sn-pro-workbench-radius: 18px;
}
```

图表配色是**数据**而不是组件样式（canvas 里没有 CSS 变量），所以两条序列色写在 option 里；
想换掉整张图就把自己的图表丢进 `#chart` / `#income` 插槽。

## 边界

只做「展示 + emit」：不请求、不存状态、不路由、不带业务口径。demo 数据在
`apps/docs/.vitepress/utils/workbench-demo.ts`，是编的，不是接口契约。
