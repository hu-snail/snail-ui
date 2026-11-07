import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import ProWorkbench from './ProWorkbench.vue';
import type {
  ProWorkbenchIncomeSource,
  ProWorkbenchKpi,
  ProWorkbenchMoneyFlow,
  ProWorkbenchTransaction,
} from './sn-pro-workbench-types';

/**
 * `SnChart` is stubbed: the assertions here are about the workbench's own
 * contract (data → DOM, slots, emits), not about ECharts' canvas. happy-dom has
 * no 2D context, so a real chart would throw on first paint — the chart
 * component ships its own suite (packages/echarts).
 */
const stubs = { SnChart: { name: 'SnChart', props: ['option', 'height', 'layout'], template: '<div class="chart-stub" />' } };

const kpis: ProWorkbenchKpi[] = [
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
  { key: 'income', label: '总收入', value: '¥15,500.00', delta: '8%', trend: 'up' },
  { key: 'expense', label: '总支出', value: '¥11,129.00', delta: '6%', trend: 'down' },
];

const moneyFlow: ProWorkbenchMoneyFlow = {
  labels: ['1月', '2月', '3月'],
  income: [10, 20, 30],
  expense: [8, 12, 18],
};

const incomeSources: ProWorkbenchIncomeSource[] = [
  { key: 'main', label: '主业收入', value: 84, display: '¥10,000.00' },
  { key: 'free', label: '自由职业', value: 16, display: '¥3,200.00' },
];

const transactions: ProWorkbenchTransaction[] = [
  { key: 't1', time: '06:12', amount: '-¥22.00', category: '外卖', status: 'success' },
  { key: 't2', time: '12:01', amount: '¥20.00', category: '转账给好友', status: 'failed' },
];

const mountWorkbench = (props: Record<string, unknown> = {}, slots: Record<string, string> = {}) =>
  mount(ProWorkbench, {
    props: { kpis, moneyFlow, incomeSources, transactions, ...props } as never,
    slots,
    global: { stubs },
  });

describe('ProWorkbench · structure', () => {
  it('should render the heading, the KPI cluster and the two card grids', () => {
    const wrapper = mountWorkbench({ title: '工作台', subtitle: '今天的概览' });

    expect(wrapper.find('.sn-pro-workbench__title').text()).toBe('工作台');
    expect(wrapper.find('.sn-pro-workbench__subtitle').text()).toBe('今天的概览');
    expect(wrapper.find('.sn-pro-workbench__top').exists()).toBe(true);
    expect(wrapper.find('.sn-pro-workbench__bottom').exists()).toBe(true);
  });

  it('should hide the subtitle when it is empty', () => {
    expect(mountWorkbench({ subtitle: '' }).find('.sn-pro-workbench__subtitle').exists()).toBe(false);
  });

  it('should render the first KPI as the accent card and the rest as neutral cards', () => {
    const wrapper = mountWorkbench();

    const accent = wrapper.findAll('.sn-pro-workbench__kpi--accent');
    expect(accent).toHaveLength(1);
    expect(accent[0]?.text()).toContain('总余额');
    expect(accent[0]?.text()).toContain('¥540,841.00');

    const plain = wrapper.findAll('.sn-pro-workbench__kpi--plain');
    expect(plain).toHaveLength(2);
    expect(plain.map((card) => card.text())).toEqual([
      expect.stringContaining('总收入'),
      expect.stringContaining('总支出'),
    ]);
  });

  it('should render the accent card extras: stats, pills and footnote', () => {
    const wrapper = mountWorkbench();
    const accent = wrapper.find('.sn-pro-workbench__kpi--accent');

    expect(accent.findAll('.sn-pro-workbench__kpi-stat')).toHaveLength(2);
    expect(accent.findAll('.sn-pro-workbench__kpi-btn')).toHaveLength(2);
    expect(accent.find('.sn-pro-workbench__kpi-foot').text()).toBe('5 分钟前更新');
  });

  it('should render the transaction table with a status dot per row', () => {
    const wrapper = mountWorkbench();
    const rows = wrapper.findAll('.sn-pro-workbench__table tbody tr');

    expect(rows).toHaveLength(2);
    expect(rows[0]?.find('.sn-pro-workbench__status--success').exists()).toBe(true);
    expect(rows[1]?.find('.sn-pro-workbench__status--failed').exists()).toBe(true);
    // Defaults are zh, so the status column reads without any props.
    expect(rows[0]?.text()).toContain('成功');
    expect(rows[1]?.text()).toContain('失败');
  });

  it('should fall back to the empty copy when there are no transactions', () => {
    const wrapper = mountWorkbench({ transactions: [] });

    expect(wrapper.find('.sn-pro-workbench__table').exists()).toBe(false);
    expect(wrapper.find('.sn-pro-workbench__empty').text()).toBe('暂无交易记录');
  });

  it('should show the largest income slice share in the ring centre', () => {
    const wrapper = mountWorkbench();

    expect(wrapper.find('.sn-pro-workbench__ring-value').text()).toBe('84%');
    expect(wrapper.findAll('.sn-pro-workbench__legend-item')).toHaveLength(2);
  });

  it('should hide the ring centre when there are no income sources', () => {
    const wrapper = mountWorkbench({ incomeSources: [] });

    expect(wrapper.find('.sn-pro-workbench__ring-value').exists()).toBe(false);
  });
});

describe('ProWorkbench · interaction', () => {
  it('should emit action when the heading actions are pressed', async () => {
    const wrapper = mountWorkbench();
    const [secondary, primary] = wrapper.findAll('.sn-pro-workbench__btn');

    await secondary?.trigger('click');
    await primary?.trigger('click');

    expect(wrapper.emitted('action')).toEqual([['secondary'], ['primary']]);
  });

  it('should emit kpi-select with the stable key, not the index', async () => {
    const wrapper = mountWorkbench();

    await wrapper.findAll('.sn-pro-workbench__kpi')[1]?.trigger('click');

    expect(wrapper.emitted('kpi-select')?.[0]?.[0]).toBe('income');
  });

  it('should emit kpi-action with the card and the pill', async () => {
    const wrapper = mountWorkbench();

    await wrapper.findAll('.sn-pro-workbench__kpi-btn')[1]?.trigger('click');

    const [kpi, action] = (wrapper.emitted('kpi-action')?.[0] ?? []) as [
      ProWorkbenchKpi,
      { key: string },
    ];
    expect(kpi.key).toBe('balance');
    expect(action.key).toBe('request');
    // The pill lives inside a clickable card: the card must not also fire.
    expect(wrapper.emitted('kpi-select')).toBeUndefined();
  });

  it('should emit range-change and move the active segment', async () => {
    const wrapper = mountWorkbench({ rangeOptions: ['年度', '季度'] });

    await wrapper.findAll('.sn-pro-workbench__range')[1]?.trigger('click');
    await nextTick();

    expect(wrapper.emitted('range-change')).toEqual([['季度']]);
    expect(wrapper.findAll('.sn-pro-workbench__range')[1]?.attributes('aria-pressed')).toBe('true');
  });

  it('should emit transaction-select for the pressed row', async () => {
    const wrapper = mountWorkbench();

    await wrapper.findAll('.sn-pro-workbench__table tbody tr')[1]?.trigger('click');

    expect(wrapper.emitted('transaction-select')?.[0]?.[0]).toBe('t2');
  });
});

describe('ProWorkbench · slots', () => {
  it('should let the host replace the chart and the income ring', () => {
    const wrapper = mountWorkbench(
      { incomeSources: [] },
      { chart: '<div class="own-chart" />', income: '<div class="own-ring" />' },
    );

    expect(wrapper.find('.own-chart').exists()).toBe(true);
    expect(wrapper.find('.own-ring').exists()).toBe(true);
    expect(wrapper.find('.chart-stub').exists()).toBe(false);
  });

  it('should let the host replace the whole KPI band', () => {
    const wrapper = mountWorkbench({}, { kpi: '<div class="own-kpi" />' });

    expect(wrapper.find('.own-kpi').exists()).toBe(true);
    expect(wrapper.find('.sn-pro-workbench__kpi--accent').exists()).toBe(false);
  });

  it('should fall back to the built-in actions unless the slot is filled', () => {
    const withSlot = mountWorkbench({}, { actions: '<button class="own-action" />' });
    expect(withSlot.find('.sn-pro-workbench__btn').exists()).toBe(false);
    expect(withSlot.find('.own-action').exists()).toBe(true);
  });
});

describe('ProWorkbench · chart plumbing', () => {
  it('should hand the money-flow series to the chart component', () => {
    const wrapper = mountWorkbench();
    const chart = wrapper.findAllComponents(stubs.SnChart)[0] as unknown as {
      props: (key: string) => unknown;
    };

    const option = chart.props('option') as {
      series: Array<{ name: string; data: number[] }>;
      xAxis: { data: string[] };
    };
    expect(option.xAxis.data).toEqual(['1月', '2月', '3月']);
    expect(option.series.map((series) => series.name)).toEqual(['收入', '支出']);
    expect(option.series[0]?.data).toEqual([10, 20, 30]);
  });

  it('should not mount a chart when there is no data', () => {
    const wrapper = mountWorkbench({ moneyFlow: undefined, incomeSources: [] });

    expect(wrapper.findAllComponents(stubs.SnChart)).toHaveLength(0);
  });

  it('should render one chart per chart card', async () => {
    const wrapper = mountWorkbench();
    await nextTick();

    expect(wrapper.findAll('.chart-stub')).toHaveLength(2);
  });
});
