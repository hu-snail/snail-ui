import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import SnTable from './SnTable.vue';

/** Mount SnTable through a wrapper component, mirroring real usage. */
function mountTable(props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) {
  return mount(
    defineComponent({
      components: { SnTable },
      setup() {
        return () => h(SnTable, props as never, slots as never);
      },
    }),
  );
}

const basicSlots = {
  default: () => [
    h('thead', [h('tr', [h('th', '名称'), h('th', '数量')])]),
    h('tbody', [
      h('tr', [h('td', '苹果'), h('td', '3')]),
      h('tr', [h('td', '香蕉'), h('td', '5')]),
    ]),
  ],
};

describe('SnTable (AUI-WEB-DD-017)', () => {
  describe('rendering', () => {
    it('renders a bordered single-line medium table by default', () => {
      const w = mountTable({}, basicSlots);
      const root = w.find('table');
      expect(root.element.tagName).toBe('TABLE');
      expect(root.classes()).toContain('sn-table');
      expect(root.classes()).toContain('sn-table--medium');
      expect(root.classes()).toContain('sn-table--bordered');
      // naive semantics: bottom-bordered is ineffective while bordered=true
      expect(root.classes()).not.toContain('sn-table--bottom-bordered');
      expect(root.classes()).toContain('sn-table--single-line');
      expect(root.classes()).not.toContain('sn-table--single-column');
      expect(root.classes()).not.toContain('sn-table--striped');
      expect(root.attributes('data-snui-component')).toBe('table');
    });

    it('renders the slotted thead/tbody markup inside the table root', () => {
      const w = mountTable({}, basicSlots);
      expect(w.find('thead th').exists()).toBe(true);
      expect(w.findAll('tbody tr')).toHaveLength(2);
      expect(w.find('tbody td').text()).toBe('苹果');
    });

    it('applies the size modifier classes', () => {
      for (const size of ['small', 'medium', 'large'] as const) {
        const w = mountTable({ size });
        expect(w.find('table').classes()).toContain(`sn-table--${size}`);
      }
    });

    it('drops the border when bordered is false and keeps bottom border', () => {
      const w = mountTable({ bordered: false });
      const root = w.find('table');
      expect(root.classes()).not.toContain('sn-table--bordered');
      // bottom-bordered defaults to true -> still applied when not bordered
      expect(root.classes()).toContain('sn-table--bottom-bordered');
    });

    it('drops the bottom border when bordered and bottom-bordered are both false', () => {
      const w = mountTable({ bordered: false, bottomBordered: false });
      const root = w.find('table');
      expect(root.classes()).not.toContain('sn-table--bordered');
      expect(root.classes()).not.toContain('sn-table--bottom-bordered');
    });

    it('marks single-column and striped variants', () => {
      const w = mountTable({ singleColumn: true, striped: true, singleLine: false });
      const root = w.find('table');
      expect(root.classes()).toContain('sn-table--single-column');
      expect(root.classes()).toContain('sn-table--striped');
      expect(root.classes()).not.toContain('sn-table--single-line');
    });
  });
});
