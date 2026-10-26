import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import SnDataTable from './SnDataTable.vue';
import type { DataTableColumns, DataTableRowData } from './sn-data-table-types';

interface Row {
  key: number;
  name: string;
  age: number;
  address: string;
}

const baseData: Row[] = [
  { key: 1, name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park' },
  { key: 2, name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park' },
  { key: 3, name: 'Joe Black', age: 32, address: 'London No. 2 Lake Park' },
];

const baseColumns: DataTableColumns = [
  { title: 'Name', key: 'name' },
  { title: 'Age', key: 'age' },
  { title: 'Address', key: 'address' },
];

/** Mount SnDataTable through a wrapper component, mirroring real usage. */
function mountTable(props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) {
  return mount(
    defineComponent({
      components: { SnDataTable },
      setup() {
        return () => h(SnDataTable, props as never, slots as never);
      },
    }),
  );
}

function findTh(w: ReturnType<typeof mountTable>, index: number) {
  return w.findAll('.sn-data-table__th')[index];
}

function rowTexts(w: ReturnType<typeof mountTable>): string[] {
  return w
    .findAll(
      'tbody .sn-data-table__tr:not(.sn-data-table__tr--expand-row):not(.sn-data-table__tr--summary):not(.sn-data-table__tr--empty)',
    )
    .map((tr) => tr.text());
}

describe('SnDataTable (AUI-WEB-DD-004)', () => {
  describe('rendering', () => {
    it('renders header cells and body rows for the given columns/data', () => {
      const w = mountTable({ columns: baseColumns, data: baseData });
      const root = w.find('.sn-data-table');
      expect(root.attributes('data-snui-component')).toBe('data-table');
      expect(root.classes()).toContain('sn-data-table--medium');
      expect(w.findAll('.sn-data-table__th')).toHaveLength(3);
      expect(rowTexts(w)).toHaveLength(3);
      expect(rowTexts(w)[0]).toContain('John Brown');
    });

    it('applies column align to cells and titleAlign to headers', () => {
      const columns: DataTableColumns = [
        { title: 'Name', key: 'name', align: 'center' },
        { title: 'Age', key: 'age', align: 'left', titleAlign: 'right' },
      ];
      const w = mountTable({ columns, data: baseData });
      expect((w.findAll('.sn-data-table__td')[0].element as HTMLElement).style.textAlign).toBe(
        'center',
      );
      expect((findTh(w, 0).element as HTMLElement).style.textAlign).toBe('center');
      expect((findTh(w, 1).element as HTMLElement).style.textAlign).toBe('right');
    });

    it('applies numeric width / minWidth styles to header and cells', () => {
      const columns: DataTableColumns = [{ title: 'Name', key: 'name', width: 120, minWidth: 80 }];
      const w = mountTable({ columns, data: baseData });
      const th = findTh(w, 0);
      expect((th.element as HTMLElement).style.width).toBe('120px');
      expect((th.element as HTMLElement).style.minWidth).toBe('80px');
      const td = w.find('.sn-data-table__td');
      expect((td.element as HTMLElement).style.width).toBe('120px');
    });

    it('marks fixed columns and stacks sticky offsets for multiple fixed-left columns', () => {
      const columns: DataTableColumns = [
        { title: 'A', key: 'name', width: 100, fixed: 'left' },
        { title: 'B', key: 'age', width: 100, fixed: 'left' },
        { title: 'C', key: 'address', width: 100, fixed: 'right' },
      ];
      const w = mountTable({ columns, data: baseData });
      const ths = w.findAll('.sn-data-table__th');
      expect(ths[0].classes()).toContain('sn-data-table__th--fixed-left');
      expect((ths[0].element as HTMLElement).style.left).toBe('0px');
      expect(ths[1].classes()).toContain('sn-data-table__th--fixed-left');
      expect((ths[1].element as HTMLElement).style.left).toBe('100px');
      expect(ths[2].classes()).toContain('sn-data-table__th--fixed-right');
      expect((ths[2].element as HTMLElement).style.right).toBe('0px');
      const tds = w.findAll('tbody .sn-data-table__td');
      expect(tds[0].classes()).toContain('sn-data-table__td--fixed-left');
      expect((tds[1].element as HTMLElement).style.left).toBe('100px');
    });

    it('renders an index column with 1-based page row numbers', () => {
      const columns: DataTableColumns = [{ type: 'index' }, { title: 'Name', key: 'name' }];
      const w = mountTable({ columns, data: baseData });
      const firstCell = w.find('tbody .sn-data-table__td');
      expect(firstCell.classes()).toContain('sn-data-table__td--index');
      expect(firstCell.text()).toBe('1');
    });

    it('applies rowClassName and rowProps to tr elements', () => {
      const w = mountTable({
        columns: baseColumns,
        data: baseData,
        rowClassName: (row: DataTableRowData) => `row-${String(row.key)}`,
        rowProps: (row: DataTableRowData) => ({ 'data-row-id': String(row.key) }),
      });
      const firstTr = w.find('tbody .sn-data-table__tr');
      expect(firstTr.classes()).toContain('row-1');
      expect(firstTr.attributes('data-row-id')).toBe('1');
    });

    it('adds modifier classes for bordered / striped / size / line variants', () => {
      const w = mountTable({
        columns: baseColumns,
        data: baseData,
        bordered: false,
        bottomBordered: false,
        singleLine: false,
        singleColumn: true,
        striped: true,
        size: 'small',
      });
      const root = w.find('.sn-data-table');
      expect(root.classes()).toContain('sn-data-table--small');
      expect(root.classes()).not.toContain('sn-data-table--bordered');
      expect(root.classes()).not.toContain('sn-table--bordered');
      expect(root.classes()).not.toContain('sn-data-table--bottom-bordered');
      expect(root.classes()).not.toContain('sn-data-table--single-line');
      expect(root.classes()).toContain('sn-data-table--single-column');
      expect(w.findAll('.sn-data-table__tr--striped').length).toBeGreaterThan(0);
    });

    it('constrains the scroll container with maxHeight and enables fixed layout', () => {
      const w = mountTable({ columns: baseColumns, data: baseData, maxHeight: 300 });
      expect((w.find('.sn-data-table__scroll').element as HTMLElement).style.maxHeight).toBe(
        '300px',
      );
      expect((w.find('.sn-data-table__table').element as HTMLElement).style.tableLayout).toBe(
        'fixed',
      );
    });

    it('sets the scroll-x container class and inner min-width', () => {
      const w = mountTable({ columns: baseColumns, data: baseData, scrollX: 1000 });
      expect(w.find('.sn-data-table').classes()).toContain('sn-data-table--scroll-x');
      expect((w.find('.sn-data-table__inner').element as HTMLElement).style.minWidth).toBe(
        '1000px',
      );
    });

    it('shows the loading state with an inline svg spinner', () => {
      const w = mountTable({ columns: baseColumns, data: baseData, loading: true });
      expect(w.find('.sn-data-table').classes()).toContain('sn-data-table--loading');
      const spinner = w.find('.sn-data-table__loading');
      expect(spinner.exists()).toBe(true);
      expect(spinner.find('svg').exists()).toBe(true);
    });
  });

  describe('selection', () => {
    const selectionColumns: DataTableColumns = [{ type: 'selection' }, ...baseColumns];

    it('emits checked keys with meta when a row checkbox is clicked', async () => {
      const w = mountTable({ columns: selectionColumns, data: baseData });
      const checkboxes = w.findAll('tbody .sn-data-table__checkbox');
      await checkboxes[1].trigger('click');
      const emitted = w.findComponent(SnDataTable).emitted('update:checkedRowKeys');
      expect(emitted).toHaveLength(1);
      expect(emitted?.[0]?.[0]).toEqual([2]);
      const meta = (emitted?.[0]?.[2] as { action: string }).action;
      expect(meta).toBe('check');
    });

    it('unchecks a checked row on the next click', async () => {
      const w = mountTable({ columns: selectionColumns, data: baseData });
      const checkbox = w.findAll('tbody .sn-data-table__checkbox')[1];
      await checkbox.trigger('click');
      await checkbox.trigger('click');
      const emitted = w.findComponent(SnDataTable).emitted('update:checkedRowKeys');
      expect(emitted).toHaveLength(2);
      expect(emitted?.[1]?.[0]).toEqual([]);
      expect(emitted?.[1]?.[2] && (emitted?.[1]?.[2] as { action: string }).action).toBe('uncheck');
    });

    it('does not toggle disabled rows', async () => {
      const columns: DataTableColumns = [
        { type: 'selection', disabled: (row: DataTableRowData) => row.key === 2 },
        ...baseColumns,
      ];
      const w = mountTable({ columns, data: baseData });
      const checkbox = w.findAll('tbody .sn-data-table__checkbox')[1];
      expect(checkbox.classes()).toContain('sn-data-table__checkbox--disabled');
      await checkbox.trigger('click');
      expect(w.findComponent(SnDataTable).emitted('update:checkedRowKeys')).toBeUndefined();
    });

    it('check-all selects every non-disabled row, uncheck-all clears them', async () => {
      const columns: DataTableColumns = [
        { type: 'selection', disabled: (row: DataTableRowData) => row.key === 2 },
        ...baseColumns,
      ];
      const w = mountTable({ columns, data: baseData });
      const headerCheckbox = w.find('thead .sn-data-table__checkbox');
      await headerCheckbox.trigger('click');
      let emitted = w.findComponent(SnDataTable).emitted('update:checkedRowKeys');
      expect(emitted?.[0]?.[0]).toEqual([1, 3]);
      expect((emitted?.[0]?.[2] as { action: string }).action).toBe('checkAll');
      await headerCheckbox.trigger('click');
      emitted = w.findComponent(SnDataTable).emitted('update:checkedRowKeys');
      expect(emitted?.[1]?.[0]).toEqual([]);
      expect((emitted?.[1]?.[2] as { action: string }).action).toBe('uncheckAll');
    });

    it('marks the header checkbox indeterminate on partial selection', async () => {
      const w = mountTable({ columns: selectionColumns, data: baseData });
      const headerCheckbox = w.find('thead .sn-data-table__checkbox');
      expect(headerCheckbox.attributes('aria-checked')).toBe('false');
      await w.findAll('tbody .sn-data-table__checkbox')[0].trigger('click');
      expect(headerCheckbox.attributes('aria-checked')).toBe('mixed');
      await w.findAll('tbody .sn-data-table__checkbox')[1].trigger('click');
      await w.findAll('tbody .sn-data-table__checkbox')[2].trigger('click');
      expect(headerCheckbox.attributes('aria-checked')).toBe('true');
    });

    it('resolves default-checked-row-keys uncontrolled', () => {
      const w = mountTable({
        columns: selectionColumns,
        data: baseData,
        defaultCheckedRowKeys: [1, 3],
      });
      const checked = w
        .findAll('tbody .sn-data-table__checkbox')
        .filter((node) => node.classes().includes('sn-data-table__checkbox--checked'));
      expect(checked).toHaveLength(2);
    });

    it('supports v-model:checked-row-keys controlled mode', async () => {
      const checked = ref<Array<string | number>>([]);
      const w = mount(
        defineComponent({
          components: { SnDataTable },
          setup() {
            return () =>
              h(SnDataTable, {
                columns: selectionColumns,
                data: baseData,
                checkedRowKeys: checked.value,
                'onUpdate:checkedRowKeys': (keys: Array<string | number>) => {
                  checked.value = keys;
                },
              } as never);
          },
        }),
      );
      await w.findAll('tbody .sn-data-table__checkbox')[0].trigger('click');
      expect(checked.value).toEqual([1]);
      expect(w.findAll('tbody .sn-data-table__checkbox')[0].classes()).toContain(
        'sn-data-table__checkbox--checked',
      );
    });

    it('replaces the checked row in single-selection mode and hides check-all', async () => {
      const columns: DataTableColumns = [{ type: 'selection', multiple: false }, ...baseColumns];
      const w = mountTable({ columns, data: baseData });
      expect(w.find('thead .sn-data-table__checkbox').exists()).toBe(false);
      const checkboxes = w.findAll('tbody .sn-data-table__checkbox');
      await checkboxes[0].trigger('click');
      await checkboxes[1].trigger('click');
      const emitted = w.findComponent(SnDataTable).emitted('update:checkedRowKeys');
      expect(emitted?.[0]?.[0]).toEqual([1]);
      expect(emitted?.[1]?.[0]).toEqual([2]);
    });
  });

  describe('sorting', () => {
    it('cycles descend -> ascend -> false and reorders the data', async () => {
      const columns: DataTableColumns = [
        { title: 'Age', key: 'age', sorter: (row1: Row, row2: Row) => row1.age - row2.age },
        { title: 'Name', key: 'name' },
      ];
      const w = mountTable({ columns, data: baseData });
      const th = findTh(w, 0);
      const component = w.findComponent(SnDataTable);

      await th.trigger('click');
      let emitted = component.emitted('update:sorter');
      expect((emitted?.[0]?.[0] as { order: string }).order).toBe('descend');
      expect(rowTexts(w)[0]).toContain('Jim Green');

      await th.trigger('click');
      emitted = component.emitted('update:sorter');
      expect((emitted?.[1]?.[0] as { order: string }).order).toBe('ascend');
      expect(rowTexts(w)[0]).toContain('John Brown');

      await th.trigger('click');
      emitted = component.emitted('update:sorter');
      expect((emitted?.[2]?.[0] as { order: string | false }).order).toBe(false);
      expect(rowTexts(w)[0]).toContain('John Brown');
    });

    it('marks the sorting header and cells', async () => {
      const columns: DataTableColumns = [
        { title: 'Age', key: 'age', sorter: true },
        { title: 'Name', key: 'name' },
      ];
      const w = mountTable({ columns, data: baseData });
      const th = findTh(w, 0);
      expect(th.classes()).toContain('sn-data-table__th--sortable');
      await th.trigger('click');
      expect(th.classes()).toContain('sn-data-table__th--sorting');
      expect(w.findAll('tbody .sn-data-table__td')[0].classes()).toContain(
        'sn-data-table__td--sorting',
      );
    });

    it("sorts with the 'default' comparator and ignores sorter=true for local data", async () => {
      const columns: DataTableColumns = [
        { title: 'Age', key: 'age', sorter: 'default', defaultSortOrder: 'descend' },
        { title: 'Name', key: 'name', sorter: true, defaultSortOrder: 'descend' },
      ];
      const w = mountTable({ columns, data: baseData });
      // Age: default comparator, descend -> 42 first.
      expect(rowTexts(w)[0]).toContain('Jim Green');
      // Name column sorter=true renders the icon but must not reorder.
      const nameTh = findTh(w, 1);
      expect(nameTh.classes()).toContain('sn-data-table__th--sortable');
    });

    it('supports controlled sortOrder', () => {
      const columns: DataTableColumns = [
        { title: 'Name', key: 'name', sorter: 'default', sortOrder: 'ascend' },
      ];
      const w = mountTable({ columns, data: baseData });
      // 'default' comparator -> localeCompare on the name column.
      expect(rowTexts(w)[0]).toContain('Jim Green');
    });
  });

  describe('filtering', () => {
    const filterColumns: DataTableColumns = [
      {
        title: 'Address',
        key: 'address',
        filter: 'default',
        filterOptions: [
          { label: 'London', value: 'London' },
          { label: 'New York', value: 'New York' },
        ],
      },
      { title: 'Name', key: 'name' },
    ];

    it('opens the menu, applies multiple options on confirm and emits filters', async () => {
      const w = mountTable({
        columns: filterColumns,
        data: baseData,
      });
      await w.find('.sn-data-table__filter').trigger('click');
      const menu = w.find('.sn-data-table__filter-menu');
      expect(menu.exists()).toBe(true);
      expect(w.findAll('.sn-data-table__filter-option')).toHaveLength(2);

      await w.findAll('.sn-data-table__filter-option')[0].trigger('click');
      await menu.find('.sn-data-table__filter-action').trigger('click');

      const emitted = w.findComponent(SnDataTable).emitted('update:filters');
      expect(emitted).toHaveLength(1);
      expect(emitted?.[0]?.[0]).toEqual({ address: ['London'] });
      expect(rowTexts(w)).toHaveLength(2);
      expect(w.find('.sn-data-table__filter-menu').exists()).toBe(false);
    });

    it('resets the filter from the menu', async () => {
      const w = mountTable({
        columns: filterColumns,
        data: baseData,
      });
      await w.find('.sn-data-table__filter').trigger('click');
      await w.findAll('.sn-data-table__filter-option')[0].trigger('click');
      await w.find('.sn-data-table__filter-menu').trigger('click');
      const actions = w.findAll('.sn-data-table__filter-action');
      await actions[1].trigger('click');
      const emitted = w.findComponent(SnDataTable).emitted('update:filters');
      expect(emitted?.[0]?.[0]).toEqual({ address: [] });
      expect(rowTexts(w)).toHaveLength(3);
    });

    it('applies single-mode filters immediately on option click', async () => {
      const columns: DataTableColumns = [
        {
          title: 'Address',
          key: 'address',
          filter: 'default',
          filterMultiple: false,
          filterOptions: [{ label: 'London', value: 'London' }],
        },
      ];
      const w = mountTable({ columns, data: baseData });
      await w.find('.sn-data-table__filter').trigger('click');
      await w.findAll('.sn-data-table__filter-option')[0].trigger('click');
      const emitted = w.findComponent(SnDataTable).emitted('update:filters');
      expect(emitted?.[0]?.[0]).toEqual({ address: 'London' });
      expect(rowTexts(w)).toHaveLength(2);
    });

    it('supports controlled filterOptionValues', () => {
      const columns: DataTableColumns = [
        {
          title: 'Address',
          key: 'address',
          filter: 'default',
          filterOptionValues: ['London'],
          filterOptions: [{ label: 'London', value: 'London' }],
        },
      ];
      const w = mountTable({ columns, data: baseData });
      expect(rowTexts(w)).toHaveLength(2);
    });
  });

  describe('expand', () => {
    const expandColumns: DataTableColumns = [
      {
        type: 'expand',
        renderExpand: (row: DataTableRowData) => `${String(row.name)} 详情`,
      },
      { title: 'Name', key: 'name' },
    ];

    it('toggles the expand row and emits expanded keys', async () => {
      const w = mountTable({ columns: expandColumns, data: baseData });
      const trigger = w.find('.sn-data-table__expand-trigger');
      expect(w.find('.sn-data-table__tr--expand-row').exists()).toBe(false);
      await trigger.trigger('click');
      expect(w.find('.sn-data-table__tr--expand-row').exists()).toBe(true);
      expect(w.find('.sn-data-table__tr--expand-row').text()).toContain('John Brown 详情');
      const emitted = w.findComponent(SnDataTable).emitted('update:expandedRowKeys');
      expect(emitted?.[0]?.[0]).toEqual([1]);
      await trigger.trigger('click');
      expect(w.find('.sn-data-table__tr--expand-row').exists()).toBe(false);
      expect(w.findComponent(SnDataTable).emitted('update:expandedRowKeys')?.[1]?.[0]).toEqual([]);
    });

    it('renders default-expanded-row-keys uncontrolled', () => {
      const w = mountTable({
        columns: expandColumns,
        data: baseData,
        defaultExpandedRowKeys: [2],
      });
      expect(w.find('.sn-data-table__tr--expand-row').text()).toContain('Jim Green 详情');
    });

    it('renders a placeholder for non-expandable rows', async () => {
      const columns: DataTableColumns = [
        {
          type: 'expand',
          renderExpand: (row: DataTableRowData) => String(row.name),
          expandable: (row: DataTableRowData) => row.key !== 2,
        },
      ];
      const w = mountTable({ columns, data: baseData });
      const triggers = w.findAll('.sn-data-table__expand-trigger');
      expect(triggers).toHaveLength(2);
      expect(w.findAll('.sn-data-table__expand-placeholder')).toHaveLength(1);
      // placeholder cell carries no trigger -> row 2 cannot expand
      await triggers[1].trigger('click');
      const expandedRows = w.findAll('.sn-data-table__tr--expand-row');
      expect(expandedRows).toHaveLength(1);
      expect(expandedRows[0].text()).toContain('Joe Black');
    });
  });

  describe('summary', () => {
    it('renders the summary row with colSpan below the body', () => {
      const w = mountTable({
        columns: baseColumns,
        data: baseData,
        summary: () => ({ name: { value: '合计 3 人', colSpan: 2 } }),
      });
      const summaryTds = w.findAll('.sn-data-table__td--summary');
      expect(summaryTds).toHaveLength(1);
      expect(summaryTds[0].attributes('colspan')).toBe('2');
      expect(summaryTds[0].text()).toBe('合计 3 人');
    });

    it('supports multiple summary rows and top placement', () => {
      const w = mountTable({
        columns: baseColumns,
        data: baseData,
        summaryPlacement: 'top',
        summary: () => [
          { name: { value: '第一行', colSpan: 3 } },
          { name: { value: '第二行', colSpan: 3 } },
        ],
      });
      expect(w.findAll('.sn-data-table__td--summary')).toHaveLength(2);
      const firstBodyTr = w.find('tbody .sn-data-table__tr');
      expect(firstBodyTr.classes()).toContain('sn-data-table__tr--summary');
    });
  });

  describe('pagination', () => {
    it('slices the current page and shows the total', () => {
      const w = mountTable({
        columns: baseColumns,
        data: baseData,
        pagination: { pageSize: 2 },
      });
      expect(rowTexts(w)).toHaveLength(2);
      expect(w.find('.sn-data-table__pagination-total').text()).toContain('共 3 条');
    });

    it('emits update:page and advances pages', async () => {
      const w = mountTable({
        columns: baseColumns,
        data: baseData,
        pagination: { pageSize: 2 },
      });
      const arrows = w.findAll('.sn-data-table__pagination-arrow');
      await arrows[1].trigger('click');
      const emitted = w.findComponent(SnDataTable).emitted('update:page');
      expect(emitted?.[0]?.[0]).toBe(2);
      expect(rowTexts(w)).toHaveLength(1);
      expect(rowTexts(w)[0]).toContain('Joe Black');
    });

    it('emits update:page-size from the size picker (controlled pageSize keeps the display)', async () => {
      const w = mountTable({
        columns: baseColumns,
        data: baseData,
        pagination: { pageSize: 2, showSizePicker: true, pageSizes: [1, 2] },
      });
      const select = w.find('.sn-data-table__pagination-size');
      expect(select.exists()).toBe(true);
      await select.setValue('1');
      const emitted = w.findComponent(SnDataTable).emitted('update:pageSize');
      expect(emitted?.[0]?.[0]).toBe(1);
      // pagination.pageSize is controlled -> display stays until the
      // consumer updates the pagination object (naive-ui semantics).
      expect(rowTexts(w)).toHaveLength(2);
    });

    it('applies the new page size uncontrolled via defaultPageSize', async () => {
      const w = mountTable({
        columns: baseColumns,
        data: baseData,
        pagination: { defaultPageSize: 2, showSizePicker: true, pageSizes: [1, 2] },
      });
      await w.find('.sn-data-table__pagination-size').setValue('1');
      expect(w.findComponent(SnDataTable).emitted('update:pageSize')?.[0]?.[0]).toBe(1);
      expect(rowTexts(w)).toHaveLength(1);
    });

    it('calls pagination.onChange in controlled mode', async () => {
      const seen: number[] = [];
      const w = mountTable({
        columns: baseColumns,
        data: baseData,
        pagination: {
          page: 1,
          pageSize: 2,
          onChange: (page: number) => {
            seen.push(page);
          },
        },
      });
      const arrows = w.findAll('.sn-data-table__pagination-arrow');
      await arrows[1].trigger('click');
      expect(seen).toEqual([2]);
      expect(w.findComponent(SnDataTable).emitted('update:page')?.[0]?.[0]).toBe(2);
    });
  });

  describe('empty', () => {
    it('renders the default empty state with an inline svg', () => {
      const w = mountTable({ columns: baseColumns, data: [] });
      expect(w.find('.sn-data-table').classes()).toContain('sn-data-table--empty');
      const empty = w.find('.sn-data-table__empty');
      expect(empty.exists()).toBe(true);
      expect(empty.find('svg').exists()).toBe(true);
      expect(empty.text()).toContain('无数据');
    });

    it('renders the empty slot instead of the default', () => {
      const w = mountTable(
        { columns: baseColumns, data: [] },
        { empty: () => h('div', { class: 'custom-empty' }, '暂无数据') },
      );
      expect(w.find('.custom-empty').exists()).toBe(true);
      expect(w.find('.custom-empty').text()).toBe('暂无数据');
      expect(w.find('.sn-data-table__empty').exists()).toBe(false);
    });
  });
});
