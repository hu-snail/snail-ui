import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import SnPagination from './SnPagination.vue';
import SnSelect from '../select/SnSelect.vue';

/** Mount SnPagination through a wrapper component, mirroring real usage. */
function mountPagination(props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) {
  return mount(
    defineComponent({
      components: { SnPagination },
      setup() {
        return () => h(SnPagination, props as never, slots as never);
      },
    }),
  );
}

describe('SnPagination (AUI-WEB-NAV-009)', () => {
  describe('rendering', () => {
    it('renders the component marker + navigation role', () => {
      const w = mountPagination({ itemCount: 97 });
      const root = w.find('.sn-pagination');
      expect(root.attributes('data-snui-component')).toBe('pagination');
      expect(root.attributes('role')).toBe('navigation');
      expect(root.attributes('aria-label')).toBe('Pagination');
    });

    it('derives the page count from itemCount / pageSize', () => {
      const w = mountPagination({ itemCount: 97, pageSize: 10 });
      // 97 items / 10 per page = 10 pages
      const buttons = w.findAll('.sn-pagination__item');
      expect(buttons.length).toBeGreaterThanOrEqual(10);
    });

    it('honors pageCount over itemCount', () => {
      const w = mountPagination({ itemCount: 97, pageCount: 3 });
      const buttons = w.findAll('.sn-pagination__item');
      // 3 pages + prev + next = 5 items
      expect(buttons.length).toBe(5);
    });

    it('renders all pages without ellipsis when pageCount <= pageSlot', () => {
      const w = mountPagination({ itemCount: 90, pageSlot: 9 });
      // 9 pages + prev + next = 11
      expect(w.findAll('.sn-pagination__page-item').length).toBe(11);
      expect(w.find('.sn-pagination__ellipsis').exists()).toBe(false);
    });

    it('collapses into first / last / neighborhood + ellipsis when pages > pageSlot', () => {
      const w = mountPagination({ itemCount: 200, pageSlot: 9 });
      // 200 items / 10 per page = 20 pages > 9 → ellipsis
      expect(w.find('.sn-pagination__ellipsis').exists()).toBe(true);
      const texts = w.findAll('.sn-pagination__item').map((b) => b.text());
      expect(texts).toContain('1');
      expect(texts).toContain('20');
    });

    it('renders the current page with aria-current="page"', () => {
      const w = mountPagination({ page: 3, pageCount: 10 });
      const active = w.find('.sn-pagination__item--active');
      expect(active.text()).toBe('3');
      expect(active.attributes('aria-current')).toBe('page');
    });

    it('renders prev / next with Chinese aria-labels and lucide icons', () => {
      const w = mountPagination({ itemCount: 100 });
      const prev = w.findAll('.sn-pagination__item')[0];
      const next = w.findAll('.sn-pagination__item').at(-1) as ReturnType<typeof w.find>;
      expect(prev.attributes('aria-label')).toBe('上一页');
      expect(next.attributes('aria-label')).toBe('下一页');
      expect(w.find('svg').exists()).toBe(true);
    });
  });

  describe('uncontrolled page (defaultPage)', () => {
    it('seeds internal state from defaultPage and advances on next click', async () => {
      const w = mountPagination({ itemCount: 100, defaultPage: 2 });
      const next = w.findAll('.sn-pagination__item').at(-1) as ReturnType<typeof w.find>;
      expect(next.attributes('aria-label')).toBe('下一页');
      await next.trigger('click');
      const emitted = w.findComponent(SnPagination).emitted('update:page');
      expect(emitted?.[0]).toEqual([3]);
      const active = w.find('.sn-pagination__item--active');
      expect(active.text()).toBe('3');
    });

    it('clamps the merged page into [1, pageCount]', () => {
      const w = mountPagination({ page: 99, pageCount: 5 });
      const active = w.find('.sn-pagination__item--active');
      expect(active.text()).toBe('5');
    });
  });

  describe('controlled page', () => {
    it('emits update:page and does not move until the prop changes', async () => {
      const w = mountPagination({ page: 1, pageCount: 10 });
      const page3 = w.findAll('.sn-pagination__item').find((b) => b.text() === '3');
      await page3?.trigger('click');
      expect(w.findComponent(SnPagination).emitted('update:page')?.[0]).toEqual([3]);
      // Controlled — the active page stays on prop value 1 until parent syncs.
      expect(w.find('.sn-pagination__item--active').text()).toBe('1');
    });
  });

  describe('disabled', () => {
    it('disables page buttons and prev/next', () => {
      const w = mountPagination({ itemCount: 100, disabled: true });
      const buttons = w.findAll('.sn-pagination__item');
      for (const b of buttons) {
        expect(b.attributes('disabled')).toBeDefined();
      }
    });
  });

  describe('showTotal', () => {
    it('renders the total item count when showTotal is set', () => {
      const w = mountPagination({ itemCount: 97, showTotal: true });
      expect(w.find('.sn-pagination__total').text()).toBe('共 97 条');
    });

    it('omits the total when showTotal is false', () => {
      const w = mountPagination({ itemCount: 97 });
      expect(w.find('.sn-pagination__total').exists()).toBe(false);
    });
  });

  describe('simple mode', () => {
    it('renders only prev / input / page count / next', () => {
      const w = mountPagination({ itemCount: 100, simple: true });
      expect(w.find('.sn-pagination__simple').exists()).toBe(true);
      expect(w.find('.sn-pagination__pages').exists()).toBe(false);
      expect(w.find('.sn-pagination__simple-separator').text()).toContain('/ 10');
    });

    it('advances via the next button', async () => {
      const w = mountPagination({ itemCount: 100, simple: true });
      const buttons = w.findAll('.sn-pagination__item');
      await buttons[buttons.length - 1].trigger('click');
      expect(w.findComponent(SnPagination).emitted('update:page')?.[0]).toEqual([2]);
    });
  });

  describe('quick jumper', () => {
    it('renders the jumper input only when showQuickJumper is set', () => {
      const w = mountPagination({ itemCount: 100 });
      expect(w.find('.sn-pagination__jumper').exists()).toBe(false);
      const w2 = mountPagination({ itemCount: 100, showQuickJumper: true });
      expect(w2.find('.sn-pagination__jumper').exists()).toBe(true);
    });

    it('jumps to the entered page on Enter (confirm)', async () => {
      const w = mountPagination({ itemCount: 100, showQuickJumper: true });
      const input = w.find('.sn-pagination__jumper-input input');
      await input.setValue('5');
      // SnInput emits `confirm` on Enter; the `.enter` trigger modifier does
      // not set `key` under happy-dom, so pass it explicitly.
      await input.trigger('keydown', { key: 'Enter' });
      expect(w.findComponent(SnPagination).emitted('update:page')?.[0]).toEqual([5]);
    });

    it('clamps an out-of-range jumper value into the page count', async () => {
      const w = mountPagination({ itemCount: 100, showQuickJumper: true });
      const input = w.find('.sn-pagination__jumper-input input');
      await input.setValue('999');
      await input.trigger('keydown', { key: 'Enter' });
      expect(w.findComponent(SnPagination).emitted('update:page')?.[0]).toEqual([10]);
    });
  });

  describe('size picker', () => {
    it('renders the size select when showSizePicker is set', () => {
      const w = mountPagination({
        itemCount: 100,
        showSizePicker: true,
        pageSizes: [10, 20, 50],
      });
      expect(w.find('.sn-pagination__size-select').exists()).toBe(true);
      expect(w.find('.sn-pagination__size-select').text()).toContain('10 / 页');
    });

    it('emits update:pageSize when a size option is chosen', async () => {
      const w = mountPagination({
        itemCount: 100,
        showSizePicker: true,
        pageSizes: [10, 20, 50],
      });
      // The dropdown menu is teleported to body — drive the wiring through
      // the SnSelect component's public update:modelValue event instead.
      await w.findComponent(SnSelect).vm.$emit('update:modelValue', 20);
      const emitted = w.findComponent(SnPagination).emitted('update:pageSize');
      expect(emitted?.[0]).toEqual([20]);
    });
  });

  describe('slots', () => {
    it('renders the label slot with the { page } payload', () => {
      const w = mountPagination(
        { pageCount: 3 },
        { label: ({ page }: { page: number }) => `第${page}页` },
      );
      const texts = w.findAll('.sn-pagination__item').map((b) => b.text());
      expect(texts).toContain('第2页');
    });

    it('renders prefix / suffix slots around the pager', () => {
      const w = mountPagination(
        { itemCount: 50 },
        { prefix: () => 'PREFIX', suffix: () => 'SUFFIX' },
      );
      expect(w.find('.sn-pagination__prefix').text()).toBe('PREFIX');
      expect(w.find('.sn-pagination__suffix').text()).toBe('SUFFIX');
    });
  });

  describe('quick switch (ellipsis jump)', () => {
    it('turns the end ellipsis into a quick-switch button listing its gap', async () => {
      const w = mountPagination({ itemCount: 1000, page: 1 });
      const ellipsis = w.find('.sn-pagination__ellipsis--switch');
      expect(ellipsis.exists()).toBe(true);
      expect(ellipsis.attributes('aria-expanded')).toBe('false');
      await ellipsis.trigger('click');
      await w.vm.$nextTick();
      expect(ellipsis.attributes('aria-expanded')).toBe('true');
      // Gap between the last shown page (7) and page 100 lists every hidden
      // page except 100 itself (it is always rendered as the last button).
      const items = w.findAll('.sn-pagination__quick-item').map((b) => Number(b.text()));
      expect(items.length).toBeGreaterThan(0);
      expect(items[0]).toBe(8);
      expect(items.at(-1)).toBe(99);
    });

    it('jumps to a picked gap page and closes the panel', async () => {
      const w = mountPagination({ itemCount: 1000, page: 1 });
      await w.find('.sn-pagination__ellipsis--switch').trigger('click');
      await w.vm.$nextTick();
      await w.findAll('.sn-pagination__quick-item')[5].trigger('click');
      await w.vm.$nextTick();
      expect(w.findComponent(SnPagination).emitted('update:page')?.at(-1)).toEqual([13]);
      expect(w.find('.sn-pagination__quick-panel').exists()).toBe(false);
    });

    it('closes the panel on an outside mousedown', async () => {
      const w = mountPagination({ itemCount: 1000, page: 1 });
      await w.find('.sn-pagination__ellipsis--switch').trigger('click');
      await w.vm.$nextTick();
      expect(w.find('.sn-pagination__quick-panel').exists()).toBe(true);
      document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      await w.vm.$nextTick();
      expect(w.find('.sn-pagination__quick-panel').exists()).toBe(false);
    });

    it('keeps a static ellipsis when quickSwitch is off', () => {
      const w = mountPagination({ itemCount: 1000, page: 1, quickSwitch: false });
      expect(w.find('.sn-pagination__ellipsis--switch').exists()).toBe(false);
      expect(w.find('.sn-pagination__ellipsis').attributes('aria-hidden')).toBe('true');
    });
  });

  describe('arrow button styling', () => {
    it('gives prev / next arrows the bordered nav style in full mode', () => {
      const w = mountPagination({ pageCount: 5 });
      const nav = w.findAll('.sn-pagination__item--nav');
      expect(nav).toHaveLength(2);
    });

    it('gives prev / next arrows the bordered nav style in simple mode', () => {
      const w = mountPagination({ pageCount: 5, simple: true });
      const nav = w.findAll('.sn-pagination__item--nav');
      expect(nav).toHaveLength(2);
    });
  });
});
