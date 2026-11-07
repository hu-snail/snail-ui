/**
 * 布局 demo 共用的工作台数据（docs-only）。
 *
 * ## 为什么单独一个文件
 *
 * 9 个布局 demo（standard 四形态 + classic + aurora + 设置 / 路由 / 搜索）要演的是
 * **同一件事**：壳不同，内容不变。所以内容数据只写一份，每个 demo 都引它 ——
 * 切换布局风格时，工作台里一个数字都不动，读者一眼就能看出「布局只负责壳」。
 *
 * 数据本身是菜谱式的演示数据（金额 / 分类 / 月份都是编的），不含任何业务口径；
 * `ProWorkbench` 只负责渲染，格式化仍在宿主（这里就是 demo 自己）。
 */

import type {
  ProWorkbenchIncomeSource,
  ProWorkbenchKpi,
  ProWorkbenchMoneyFlow,
  ProWorkbenchTransaction,
} from '@snui/admin-layout/workbench';

/** KPI 卡：第一张是高亮的账户卡，其余是中性卡。 */
export const demoKpis: ProWorkbenchKpi[] = [
  {
    key: 'balance',
    label: '总余额',
    value: '¥540,841.00',
    delta: '4%',
    hint: '较上月',
    trend: 'up',
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
  {
    key: 'income',
    label: '总收入',
    value: '¥15,500.00',
    delta: '8%',
    hint: '较上月',
    trend: 'up',
  },
  {
    key: 'expense',
    label: '总支出',
    value: '¥11,129.00',
    delta: '6%',
    hint: '较上月',
    trend: 'down',
  },
];

/** 资金流水：12 个月的两条序列（收入面积 + 支出折线）。 */
export const demoMoneyFlow: ProWorkbenchMoneyFlow = {
  labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  income: [28, 42, 36, 58, 47, 63, 52, 44, 61, 55, 48, 66],
  expense: [33, 30, 41, 39, 52, 44, 58, 49, 42, 50, 57, 46],
  incomeName: '收入',
  expenseName: '支出',
};

/** 收入来源环形图的三段（只比值有意义）。 */
export const demoIncomeSources: ProWorkbenchIncomeSource[] = [
  { key: 'main', label: '主业收入', value: 84, display: '¥10,000.00' },
  { key: 'freelance', label: '自由职业', value: 10, display: '¥3,200.00' },
  { key: 'passive', label: '被动收入', value: 6, display: '¥2,300.00' },
];

/** 交易记录表的四行（参考稿的时间 / 金额 / 分类 / 状态）。 */
export const demoTransactions: ProWorkbenchTransaction[] = [
  { key: 't1', time: '06:12', amount: '-¥22.00', category: '外卖', status: 'success', statusText: '成功' },
  { key: 't2', time: '10:20', amount: '-¥110.00', category: '电费', status: 'success', statusText: '成功' },
  { key: 't3', time: '12:01', amount: '¥20.00', category: '转账给好友', status: 'failed', statusText: '失败' },
  { key: 't4', time: '14:28', amount: '-¥121.00', category: '购物', status: 'success', statusText: '成功' },
];