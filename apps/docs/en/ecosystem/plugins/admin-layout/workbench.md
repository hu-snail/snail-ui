# Workbench | shared dashboard (ECharts)

`ProWorkbench` is a **layout-agnostic** dashboard screen: a highlighted account card plus income / expense
cards on the left, a transaction list on the right, and money-flow (area + line) plus income-source (ring)
charts underneath. All three layout styles (`standard` / `classic` / `aurora`) demo the same data — switching
shells changes no number on the page, which is the visual proof that "the layout only owns the shell".

> Platform: `Web` · Component: `ProWorkbench` · Entry: `@snui/admin-layout/workbench` · Status: `@experimental`

## Import it on its own

```ts
import { ProWorkbench } from '@snui/admin-layout/workbench';
import '@snui/admin-layout/workbench/style.css';
```

The workbench is **deliberately not part of the barrel**: it pulls `@snui/echarts` (a thin ECharts wrapper),
and a host that only wants a layout shell should not be forced to ship a chart engine. Same split for styles —
`workbench/style.css` holds only the workbench's own rules; `SnChart`'s styles come from the
`@snui/echarts/styles` you already import, and the token layer from `@snui/vue-web/styles`.

## Structure

| Area         | Content                                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------------------------- |
| Heading      | `title` / `subtitle` · primary / secondary actions on the right (`#actions` replaces both; they only emit)          |
| KPIs         | `kpis[0]` = highlighted account card (trend pill / pill actions / sub-stats / footnote); `kpis[1..]` stack (`#kpi`) |
| Transactions | `transactions` table (time / amount / category / status; status = colored dot + label, `#transactions`)             |
| Money flow   | `moneyFlow` area + line (legend + period switch) · ECharts (`#chart`)                                               |
| Income       | `incomeSources` ring + centre share + three figures · ECharts (`#income`)                                           |

## Usage

```vue
<script setup lang="ts">
import { ProWorkbench } from '@snui/admin-layout/workbench';
import '@snui/admin-layout/workbench/style.css';
import type { ProWorkbenchKpi } from '@snui/admin-layout/workbench';

const kpis: ProWorkbenchKpi[] = [
  {
    key: 'balance',
    label: 'Total balance',
    value: '$540,841.00',
    delta: '4%',
    trend: 'up',
    hint: 'than last month',
    actions: [
      { key: 'transfer', label: 'Transfer' },
      { key: 'request', label: 'Request' },
    ],
    stats: [
      { key: 'earnings', label: 'Earnings', value: '$123,521.00' },
      { key: 'rate', label: 'Rate', value: '3.2%' },
    ],
    footNote: 'Updated 5 min ago',
  },
  { key: 'income', label: 'Income', value: '$15,500.00', delta: '8%', trend: 'up' },
  { key: 'expense', label: 'Expense', value: '$11,129.00', delta: '6%', trend: 'down' },
];
</script>

<template>
  <ProWorkbench
    :kpis="kpis"
    :money-flow="{ labels: ['Jan', 'Feb', 'Mar'], income: [28, 42, 36], expense: [33, 30, 41] }"
    :income-sources="[{ key: 'main', label: 'Main job', value: 84, display: '$10,000.00' }]"
    :transactions="[{ key: 't1', time: '06:12', amount: '-$22.00', category: 'Delivery', status: 'success' }]"
    @action="(kind) => (kind === 'primary' ? openWallet() : openReport())"
    @range-change="loadRange"
    @transaction-select="openTransaction"
  />
</template>
```

## Props

| Name                                              | Type                         | Default                  | Notes                                                  |
| ------------------------------------------------- | ---------------------------- | ------------------------ | ------------------------------------------------------ |
| `title`                                           | `string`                     | `'工作台'`               | Heading                                                |
| `subtitle`                                        | `string`                     | zh default               | Rendered unless `''`                                   |
| `showHeading`                                     | `boolean`                    | `true`                   | Set `false` when the shell already prints a title band |
| `kpis`                                            | `ProWorkbenchKpi[]`          | `[]`                     | First entry is the highlighted card                    |
| `moneyFlow`                                       | `ProWorkbenchMoneyFlow`      | —                        | Two series; `undefined` draws no chart                 |
| `incomeSources`                                   | `ProWorkbenchIncomeSource[]` | `[]`                     | Ring slices (ratios only)                              |
| `transactions`                                    | `ProWorkbenchTransaction[]`  | `[]`                     | Table rows                                             |
| `transactionsColumns`                             | `string[]`                   | zh headers               | Table headers                                          |
| `transactionsEmptyText`                           | `string`                     | zh copy                  | Empty state                                            |
| `flowRange`                                       | `string`                     | —                        | Passing it makes the period controlled                 |
| `rangeOptions`                                    | `string[]`                   | `['年度','季度','月度']` | Period options                                         |
| `flowTitle` / `incomeTitle` / `transactionsTitle` | `string`                     | zh defaults              | Card headings                                          |
| `primaryActionText` / `secondaryActionText`       | `string`                     | zh defaults              | Heading buttons                                        |
| `chartHeight`                                     | `number`                     | `260`                    | Chart height in px                                     |

Copy defaults are Chinese: the package is i18n-free (AGENTS.md §18) — pass your own strings for other locales.

## Events

| Event                | Payload                            | When                          |
| -------------------- | ---------------------------------- | ----------------------------- |
| `action`             | `(kind: 'primary' \| 'secondary')` | Heading action pressed        |
| `kpi-action`         | `(kpi, action)`                    | Pill inside the account card  |
| `kpi-select`         | `(key, kpi)`                       | A KPI card was activated      |
| `range-change`       | `(range: string)`                  | Period switched               |
| `transaction-select` | `(key, row)`                       | A transaction row was clicked |

## Slots

| Slot           | Replaces           |
| -------------- | ------------------ |
| `actions`      | Heading tools      |
| `kpi`          | The whole KPI band |
| `chart`        | Money-flow chart   |
| `income`       | Income ring        |
| `transactions` | Transaction table  |

## Theming

Each module (KPIs / transactions / money flow / income) is a **separate card** with gaps between them; the card
surface is a hook too, so a glass shell (aurora) turns every card into a translucent pane — module boundaries stay
visible and the layout background reads through:

```css
.sn-pro-aurora__content {
  --sn-pro-workbench-card: var(--sn-pro-aurora-panel);
  --sn-pro-workbench-card-border: rgba(255, 255, 255, 0.7);
  --sn-pro-workbench-card-blur: var(--sn-pro-aurora-panel-blur);
  --sn-pro-workbench-card-shadow: 0 10px 30px -24px rgba(24, 24, 46, 0.4);
}
```

Every other colour is a `--sn-pro-workbench-*` hook defaulting to `--sn-web-*` tokens, so it follows the host theme:

```css
.my-shell {
  --sn-pro-workbench-surface: #fff;
  --sn-pro-workbench-soft: #f5f5f8;
  --sn-pro-workbench-accent: #4fb3ae;
  --sn-pro-workbench-radius: 18px;
}
```

Chart colours are **data**, not component styling (a canvas has no CSS variables), so the two series colours
live in the option; drop your own chart into `#chart` / `#income` to replace them entirely.

## Boundary

Display + emit only: no requests, no state store, no routing, no business rules. The demo data lives in
`apps/docs/.vitepress/utils/workbench-demo.ts` — it is made up, not an API contract.
