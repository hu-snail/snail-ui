/**
 * Public types of `ProWorkbench` (@snui/admin-layout).
 *
 * The workbench is layout-agnostic by design: every layout style
 * (`standard` / `classic` / `aurora`) can host it, and a host can drop it into
 * its own shell. That is only true while the component knows nothing about the
 * shell — so its whole surface is plain data: what to show, never where it
 * comes from.
 *
 * Same contract-file convention as the layout styles (`sn-pro-aurora-types.ts`
 * etc.): types live in their own module so a host importing
 * `@snui/admin-layout/workbench` pulls the data shapes without the SFC.
 */

/** Direction of a KPI's period-over-period change. */
export type ProWorkbenchTrend = 'up' | 'down' | 'flat';

/** One secondary figure inside a KPI card (accent card: 总收益 / 利率). */
export interface ProWorkbenchKpiStat {
  /** Stable key (used for `v-for` and the `kpi-stat` emit). */
  key: string;
  /** Caption above the figure. */
  label: string;
  /** Formatted figure, e.g. `£123.521.00` / `3.2% p.a`. Host owns formatting. */
  value: string;
}

/** One pill button inside a KPI card (accent card: 转账 / 收款). */
export interface ProWorkbenchKpiAction {
  /** Stable key, forwarded on the `kpi-action` emit. */
  key: string;
  /** Button copy. */
  label: string;
}

/**
 * A KPI card.
 *
 * The first entry is rendered as the highlighted "account" card of the
 * reference design (teal gradient); the rest are neutral cards. Which one is
 * highlighted is positional, not semantic — the host decides what matters.
 */
export interface ProWorkbenchKpi {
  /** Stable key. Omitted → the array index is used. */
  key?: string | number | undefined;
  /** Caption, e.g. `Total Balance`. */
  label: string;
  /** Formatted main figure. Host owns currency / locale formatting. */
  value: string;
  /** Change badge, e.g. `4%`. Omitted → no badge. */
  delta?: string | undefined;
  /** Copy after the badge, e.g. `than last month`. */
  hint?: string | undefined;
  /** Badge direction. Default `flat`. */
  trend?: ProWorkbenchTrend | undefined;
  /** Extra secondary figures (accent card only, rendered as a footer row). */
  stats?: ProWorkbenchKpiStat[] | undefined;
  /** Pill actions (accent card: 转账 / 收款). */
  actions?: ProWorkbenchKpiAction[] | undefined;
  /** Footnote under the figures, e.g. `Updated 5 min ago`. */
  footNote?: string | undefined;
}

/**
 * The money-flow series pair.
 *
 * Both series share one category axis, so the arrays must be the same length —
 * a mismatch is the host's bug, and the chart simply draws what it gets.
 */
export interface ProWorkbenchMoneyFlow {
  /** Category axis labels (`Jan` … `Dec`, or 12 months). */
  labels: string[];
  /** Income series values (axis units, e.g. thousands). */
  income: number[];
  /** Expense series values. */
  expense: number[];
  /** Legend copy of the income series. Default `收入`. */
  incomeName?: string | undefined;
  /** Legend copy of the expense series. Default `支出`. */
  expenseName?: string | undefined;
}

/** One slice of the income-source ring. */
export interface ProWorkbenchIncomeSource {
  /** Stable key. */
  key: string;
  /** Slice label (legend + figure caption), e.g. `主业`. */
  label: string;
  /** Slice magnitude — only the ratio matters. */
  value: number;
  /** Formatted figure under the ring. Default → `value` as-is. */
  display?: string | undefined;
}

/** Settlement state of a transaction row. */
export type ProWorkbenchTransactionStatus = 'success' | 'failed' | 'pending';

/** One row of the transaction table. */
export interface ProWorkbenchTransaction {
  /** Stable key. */
  key: string | number;
  /** Time column, e.g. `06.12 am`. */
  time: string;
  /** Amount column, already signed and formatted (`-£22.00`). */
  amount: string;
  /** Category column (`Food Delivery`). */
  category: string;
  /** Status column state (drives the dot colour). */
  status: ProWorkbenchTransactionStatus;
  /** Status copy. Default → a built-in zh label per state. */
  statusText?: string | undefined;
}

/** Period selector option of the money-flow chart (`Yearly` / `Monthly` …). */
export type ProWorkbenchRange = string;