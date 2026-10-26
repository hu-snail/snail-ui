/**
 * sn-table unit tests — uni-end data table (wd-table parity).
 *
 * Tests verify observable behaviour, not internals (AGENTS.md §46):
 *   - columns register from `sn-table-column` children in DOM order
 *   - `border` / `stripe` / `show-header` / `ellipsis` / `fixed-header` modifiers
 *   - `index` renders the ordinal column, and an object config customises it
 *   - `height` switches the vertical scroller on (design px → rpx)
 *   - `sortable` cycles none → asc → desc → none and emits `sort-method`
 *   - `row-click` payloads; `value` slot renders custom cell content
 *   - `empty` slot / built-in empty row
 *
 * Columns register in their own `onMounted` (so the container's render is not
 * mutated mid-flight), which means the harness must await one tick before
 * asserting — the same pattern `sn-tabs` / `sn-sidebar` use.
 *
 * No `rpx` numbers in assertions: happy-dom drops CSS lengths it cannot parse.
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import SnTable from './sn-table.vue';
import SnTableColumn from './sn-table-column.vue';
import type { SnTableRow } from './sn-table-types';

const rows: SnTableRow[] = [
  { name: '小蜗牛', amount: 128, status: 'paid' },
  { name: '大蜗牛', amount: 256, status: 'pending' },
  { name: '慢蜗牛', amount: 64, status: 'paid' },
];

interface MountOptions {
  slots?: Record<string, string>;
  columnSlots?: Record<string, string>;
}

/** Mount a table with the given columns (mirrors real usage). */
async function mountTable(
  tableProps: Record<string, unknown> = {},
  columns: Array<Record<string, unknown>> = [
    { prop: 'name', label: '名称' },
    { prop: 'amount', label: '金额' },
  ],
  options: MountOptions = {},
) {
  const Harness = defineComponent({
    setup() {
      return () =>
        h(
          SnTable,
          { data: rows, ...tableProps },
          {
            default: () =>
              columns.map((column, index) =>
                h(
                  SnTableColumn,
                  { key: index, ...column },
                  options.columnSlots?.[column.prop as string]
                    ? { value: () => h('text', options.columnSlots?.[column.prop as string]) }
                    : undefined,
                ),
              ),
            ...(options.slots
              ? Object.fromEntries(
                  Object.entries(options.slots).map(([name, content]) => [
                    name,
                    () => h('text', content),
                  ]),
                )
              : {}),
          },
        );
    },
  });
  const wrapper = mount(Harness);
  await nextTick();
  return wrapper;
}

/** The rendered header cells. */
function headerCells(wrapper: Awaited<ReturnType<typeof mountTable>>) {
  return wrapper.findAll('.sn-table__row--header .sn-table__cell');
}

describe('sn-table', () => {
  it('should render one header cell and one body cell per column', async () => {
    const wrapper = await mountTable();
    expect(wrapper.find('.sn-table__row--header').exists()).toBe(true);
    expect(headerCells(wrapper)).toHaveLength(2);
    // 3 rows × 2 columns.
    expect(wrapper.findAll('.sn-table__body .sn-table__row')).toHaveLength(3);
    expect(wrapper.findAll('.sn-table__body .sn-table__cell')).toHaveLength(6);
  });

  it('should render the column labels in DOM order', async () => {
    const wrapper = await mountTable({}, [
      { prop: 'name', label: '名称' },
      { prop: 'amount', label: '金额' },
      { prop: 'status', label: '状态' },
    ]);
    const headers = wrapper.findAll('.sn-table__row--header .sn-table__cell-text');
    expect(headers.map((node) => node.text())).toEqual(['名称', '金额', '状态']);
  });

  it('should render cell values from the row objects', async () => {
    const wrapper = await mountTable();
    const firstRowText = wrapper.find('.sn-table__body .sn-table__row').text();
    expect(firstRowText).toContain('小蜗牛');
    expect(firstRowText).toContain('128');
  });

  it('should JSON-encode object cell values instead of [object Object]', async () => {
    const wrapper = await mountTable({ data: [{ name: 'x', amount: { a: 1 } }] });
    expect(wrapper.text()).toContain('{"a":1}');
    expect(wrapper.text()).not.toContain('[object Object]');
  });

  it('should apply border and stripe classes by default', async () => {
    const wrapper = await mountTable();
    expect(wrapper.find('.sn-table').classes()).toContain('sn-table--border');
    expect(wrapper.findAll('.sn-table__row--stripe')).toHaveLength(1);
    expect(wrapper.findAll('.sn-table__row--stripe')[0]?.text()).toContain('大蜗牛');
  });

  it('should drop border and stripe when disabled', async () => {
    const wrapper = await mountTable({ border: false, stripe: false });
    expect(wrapper.find('.sn-table').classes()).not.toContain('sn-table--border');
    expect(wrapper.findAll('.sn-table__row--stripe')).toHaveLength(0);
  });

  it('should hide the header when showHeader is false', async () => {
    const wrapper = await mountTable({ showHeader: false });
    expect(wrapper.find('.sn-table__row--header').exists()).toBe(false);
    expect(wrapper.findAll('.sn-table__body .sn-table__row')).toHaveLength(3);
  });

  it('should add the ellipsis modifier when ellipsis is on', async () => {
    const wrapper = await mountTable({ ellipsis: true });
    expect(wrapper.find('.sn-table').classes()).toContain('sn-table--ellipsis');
  });

  it('should render the index column with ordinal numbers', async () => {
    const wrapper = await mountTable({ index: true });
    const firstRowCells = wrapper
      .findAll('.sn-table__body .sn-table__row')[0]
      ?.findAll('.sn-table__cell');
    expect(firstRowCells).toHaveLength(3);
    expect(firstRowCells?.[0]?.text()).toBe('1');
    expect(headerCells(wrapper)).toHaveLength(3);
  });

  it('should customise the index column from an object config', async () => {
    const wrapper = await mountTable({ index: { label: '序号', width: '60px', align: 'right' } });
    const header = headerCells(wrapper)[0];
    expect(header?.text()).toBe('序号');
    expect(header?.attributes('style')).toContain('60px');
    expect(header?.classes()).toContain('sn-table__cell--right');
  });

  it('should resolve a string column width verbatim and a number as design px', async () => {
    const stringy = await mountTable({}, [{ prop: 'name', label: '名称', width: '160px' }]);
    expect(headerCells(stringy)[0]?.attributes('style')).toContain('width: 160px');

    // A numeric width becomes `320rpx`, which happy-dom drops; assert it does
    // not silently collapse to the default string instead.
    const numeric = await mountTable({}, [{ prop: 'name', label: '名称', width: 160 }]);
    expect(headerCells(numeric)[0]?.attributes('style')).not.toContain('width: 100px');
  });

  it('should turn on the vertical scroller when height is set', async () => {
    const wrapper = await mountTable({ height: 300 });
    expect(wrapper.find('.sn-table__scroller--vertical').exists()).toBe(true);
    expect(wrapper.find('.sn-table').attributes('style')).toContain('--sn-table-height');

    const auto = await mountTable();
    expect(auto.find('.sn-table__scroller--vertical').exists()).toBe(false);
  });

  it('should pin the header by default and drop it when fixedHeader is off', async () => {
    expect((await mountTable()).find('.sn-table').classes()).toContain('sn-table--fixed-header');
    expect((await mountTable({ fixedHeader: false })).find('.sn-table').classes()).not.toContain(
      'sn-table--fixed-header',
    );
  });

  it('should pin a fixed column with a cumulative left offset', async () => {
    const wrapper = await mountTable({}, [
      { prop: 'name', label: '名称', width: '120px', fixed: true },
      { prop: 'amount', label: '金额' },
    ]);
    const pinned = wrapper.find('.sn-table__body .sn-table__cell');
    expect(pinned.classes()).toContain('sn-table__cell--fixed');
    expect(pinned.attributes('style')).toContain('left: 0px');
  });

  it('should emit row-click with the row index and row object', async () => {
    const wrapper = await mountTable();
    await wrapper.findAll('.sn-table__body .sn-table__row')[1]?.trigger('tap');
    const emitted = wrapper.findComponent(SnTable).emitted('row-click');
    expect(emitted).toHaveLength(1);
    expect(emitted?.[0]?.[0]).toMatchObject({ rowIndex: 1, row: rows[1] });
  });

  it('should cycle sort order none → asc → desc → none and emit sort-method', async () => {
    const wrapper = await mountTable({}, [
      { prop: 'name', label: '名称' },
      { prop: 'amount', label: '金额', sortable: true },
    ]);
    const tapHeader = async () => {
      await headerCells(wrapper)[1]?.trigger('tap');
    };
    await tapHeader();
    await tapHeader();
    await tapHeader();

    const emitted = wrapper.findComponent(SnTable).emitted('sort-method');
    expect(emitted?.map((call) => (call[0] as { order: string }).order)).toEqual([
      'asc',
      'desc',
      'none',
    ]);
    expect(emitted?.[0]?.[0]).toMatchObject({ prop: 'amount', label: '金额' });
  });

  it('should expose aria-sort on a sortable header only', async () => {
    const wrapper = await mountTable({}, [
      { prop: 'name', label: '名称' },
      { prop: 'amount', label: '金额', sortable: true },
    ]);
    expect(headerCells(wrapper)[0]?.attributes('aria-sort')).toBeUndefined();
    expect(headerCells(wrapper)[1]?.attributes('aria-sort')).toBe('none');

    await headerCells(wrapper)[1]?.trigger('tap');
    expect(headerCells(wrapper)[1]?.attributes('aria-sort')).toBe('ascending');
  });

  it('should not emit sort-method when a non-sortable header is tapped', async () => {
    const wrapper = await mountTable();
    await headerCells(wrapper)[0]?.trigger('tap');
    expect(wrapper.findComponent(SnTable).emitted('sort-method')).toBeUndefined();
  });

  it('should render custom cell content from the column value slot', async () => {
    const wrapper = await mountTable({}, [{ prop: 'name', label: '名称' }], {
      columnSlots: { name: '自定义内容' },
    });
    expect(wrapper.find('.sn-table__body .sn-table__cell').text()).toContain('自定义内容');
  });

  it('should render the built-in empty row when data is empty', async () => {
    const wrapper = await mountTable({ data: [] });
    expect(wrapper.find('.sn-table__empty-text').text()).toBe('暂无数据');
    expect(wrapper.findAll('.sn-table__body .sn-table__row')).toHaveLength(0);
  });

  it('should render the empty slot instead of the built-in text', async () => {
    const wrapper = await mountTable({ data: [] }, undefined, { slots: { empty: '没有数据' } });
    expect(wrapper.find('.sn-table__empty').text()).toBe('没有数据');
    expect(wrapper.find('.sn-table__empty-text').exists()).toBe(false);
  });

  it('should forward customClass and customStyle to the root', async () => {
    const wrapper = await mountTable({ customClass: 'my-table', customStyle: 'padding: 8px' });
    expect(wrapper.find('.sn-table').classes()).toContain('my-table');
    expect(wrapper.find('.sn-table').attributes('style')).toContain('padding: 8px');
  });

  it('should expose the table role on the root node', async () => {
    const wrapper = await mountTable();
    expect(wrapper.find('.sn-table').attributes('role')).toBe('table');
    expect(wrapper.findAll('[role="row"]').length).toBeGreaterThan(0);
    expect(wrapper.findAll('[role="columnheader"]')).toHaveLength(2);
  });
});
