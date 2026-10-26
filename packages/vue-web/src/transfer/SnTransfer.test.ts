import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import SnTransfer from './SnTransfer.vue';
import SnCheckbox from '../checkbox/SnCheckbox.vue';

interface TestOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

const OPTIONS: TestOption[] = [
  { label: '选项 1', value: 'opt-1' },
  { label: '选项 2', value: 'opt-2' },
  { label: '选项 3', value: 'opt-3' },
  { label: '选项 4', value: 'opt-4', disabled: true },
];

/** Mount SnTransfer through a wrapper component, mirroring real usage. */
function mountTransfer(props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) {
  return mount(
    defineComponent({
      components: { SnTransfer },
      setup() {
        return () => h(SnTransfer, props as never, slots as never);
      },
    }),
  );
}

/** The four move buttons in DOM order: → ⇉ ⇇ ⇠. */
function findMoveButtons(wrapper: ReturnType<typeof mountTransfer>) {
  return wrapper.findAll('.sn-transfer__operations button');
}

describe('SnTransfer (AUI-WEB-FORM-017)', () => {
  describe('rendering', () => {
    it('renders the component marker with two panels', () => {
      const w = mountTransfer({ options: OPTIONS });
      const root = w.find('.sn-transfer');
      expect(root.attributes('data-snui-component')).toBe('transfer');
      expect(root.findAll('.sn-transfer__panel').length).toBe(2);
    });

    it('splits options into source (unselected) and target (selected) panels', () => {
      const w = mountTransfer({ options: OPTIONS, value: ['opt-2'] });
      const source = w.find('.sn-transfer__panel--source');
      const target = w.find('.sn-transfer__panel--target');
      expect(source.text()).toContain('选项 1');
      expect(source.text()).not.toContain('选项 2');
      expect(target.text()).toContain('选项 2');
    });

    it('renders default zh titles 源 / 目标 and honors title overrides', () => {
      const w = mountTransfer({ options: OPTIONS });
      expect(w.text()).toContain('源');
      expect(w.text()).toContain('目标');
      const w2 = mountTransfer({
        options: OPTIONS,
        sourceTitle: '候选',
        targetTitle: '已选',
      });
      expect(w2.text()).toContain('候选');
      expect(w2.text()).toContain('已选');
    });

    it('follows value-array order in the target panel', () => {
      const w = mountTransfer({ options: OPTIONS, value: ['opt-3', 'opt-1'] });
      const labels = w
        .findAll('.sn-transfer__panel--target .sn-transfer__option-label')
        .map((node) => node.text());
      expect(labels).toEqual(['选项 3', '选项 1']);
    });
  });

  describe('checkbox selection (internal state)', () => {
    it('toggles a source item when its row is clicked', async () => {
      const w = mountTransfer({ options: OPTIONS });
      const row = w.find('.sn-transfer__panel--source .sn-transfer__option');
      await row.trigger('click');
      expect(row.attributes('aria-selected')).toBe('true');
      await row.trigger('click');
      expect(row.attributes('aria-selected')).toBe('false');
    });

    it('cannot check a disabled option row', async () => {
      const w = mountTransfer({ options: OPTIONS });
      const disabledRow = w
        .findAll('.sn-transfer__panel--source .sn-transfer__option')
        .find((node) => node.text().includes('选项 4'));
      await disabledRow?.trigger('click');
      expect(disabledRow?.attributes('aria-selected')).toBe('false');
    });

    it('marks the header checkbox indeterminate when part of the panel is checked', async () => {
      const w = mountTransfer({ options: OPTIONS });
      const headerCheckbox = w.findComponent(
        '.sn-transfer__panel--source .sn-transfer__header-checkbox',
      );
      expect(headerCheckbox.props('indeterminate')).toBe(false);
      const row = w.find('.sn-transfer__panel--source .sn-transfer__option');
      await row.trigger('click');
      expect(headerCheckbox.props('indeterminate')).toBe(true);
    });

    it('checks every checkable row via the header checkbox', async () => {
      const w = mountTransfer({ options: OPTIONS });
      const header = w.find('.sn-transfer__panel--source .sn-transfer__header-checkbox input');
      await header.setValue(true);
      const selected = w
        .findAll('.sn-transfer__panel--source .sn-transfer__option')
        .map((node) => node.attributes('aria-selected'));
      // 3 checkable rows all selected; the disabled row stays unselected
      expect(selected).toEqual(['true', 'true', 'true', 'false']);
    });
  });

  describe('move operations', () => {
    it('moves checked source items right (single chevron)', async () => {
      const w = mountTransfer({ options: OPTIONS });
      await w.find('.sn-transfer__panel--source .sn-transfer__option').trigger('click');
      await findMoveButtons(w)[0].trigger('click');
      expect(w.findComponent(SnTransfer).emitted('update:value')?.[0]).toEqual([['opt-1']]);
      // Uncontrolled — the item lands in the target panel
      expect(w.find('.sn-transfer__panel--target').text()).toContain('选项 1');
    });

    it('moves all movable source items right (double chevron), skipping disabled', async () => {
      const w = mountTransfer({ options: OPTIONS });
      await findMoveButtons(w)[1].trigger('click');
      expect(w.findComponent(SnTransfer).emitted('update:value')?.[0]).toEqual([
        ['opt-1', 'opt-2', 'opt-3'],
      ]);
    });

    it('moves checked target items left (single chevron)', async () => {
      const w = mountTransfer({ options: OPTIONS, value: ['opt-1', 'opt-2'] });
      const firstTargetRow = w.find('.sn-transfer__panel--target .sn-transfer__option');
      await firstTargetRow.trigger('click');
      await findMoveButtons(w)[2].trigger('click');
      expect(w.findComponent(SnTransfer).emitted('update:value')?.[0]).toEqual([['opt-2']]);
    });

    it('moves all target items left (double chevron)', async () => {
      const w = mountTransfer({ options: OPTIONS, value: ['opt-1', 'opt-2'] });
      await findMoveButtons(w)[3].trigger('click');
      expect(w.findComponent(SnTransfer).emitted('update:value')?.[0]).toEqual([[]]);
    });

    it('disables every move button when nothing is movable', () => {
      // All entries are disabled and already in the target: no direction can move anything.
      const w = mountTransfer({
        options: [{ label: '锁定项', value: 'lock-1', disabled: true }],
        value: ['lock-1'],
      });
      for (const button of findMoveButtons(w)) {
        expect(button.attributes('disabled')).toBeDefined();
      }
    });

    it('does not move disabled options via move-all', async () => {
      const w = mountTransfer({ options: OPTIONS, value: ['opt-4'] });
      // opt-4 is disabled: move-all-right has nothing movable besides opt-4 in source… opt-4 is
      // in target; move-all-left must skip it (it is the only target entry).
      await findMoveButtons(w)[3].trigger('click');
      expect(w.findComponent(SnTransfer).emitted('update:value')).toBeUndefined();
    });
  });

  describe('controlled value', () => {
    it('emits update:value but keeps panels on the prop until the parent syncs', async () => {
      const w = mountTransfer({ options: OPTIONS, value: [] });
      await findMoveButtons(w)[1].trigger('click');
      expect(w.findComponent(SnTransfer).emitted('update:value')?.[0]).toEqual([
        ['opt-1', 'opt-2', 'opt-3'],
      ]);
      // Controlled — target panel still empty
      expect(w.find('.sn-transfer__panel--target').text()).not.toContain('选项 1');
    });
  });

  describe('filterable', () => {
    it('renders filter inputs only when filterable is set', () => {
      const w = mountTransfer({ options: OPTIONS });
      expect(w.findAll('.sn-transfer__filter').length).toBe(0);
      const w2 = mountTransfer({ options: OPTIONS, filterable: true });
      expect(w2.findAll('.sn-transfer__filter').length).toBe(2);
    });

    it('filters the source panel by label', async () => {
      const w = mountTransfer({ options: OPTIONS, filterable: true });
      const input = w.find('.sn-transfer__panel--source .sn-transfer__filter input');
      await input.setValue('选项 2');
      const labels = w
        .findAll('.sn-transfer__panel--source .sn-transfer__option-label')
        .map((node) => node.text());
      expect(labels).toEqual(['选项 2']);
    });

    it('shows the empty state when nothing matches the filter', async () => {
      const w = mountTransfer({ options: OPTIONS, filterable: true });
      const input = w.find('.sn-transfer__panel--source .sn-transfer__filter input');
      await input.setValue('不存在');
      expect(w.find('.sn-transfer__panel--source .sn-empty').exists()).toBe(true);
    });

    it('honors source / target filter placeholders', () => {
      const w = mountTransfer({
        options: OPTIONS,
        filterable: true,
        sourceFilterPlaceholder: '搜索候选',
        targetFilterPlaceholder: '搜索已选',
      });
      const inputs = w.findAll('.sn-transfer__filter input');
      expect(inputs[0]?.attributes('placeholder')).toBe('搜索候选');
      expect(inputs[1]?.attributes('placeholder')).toBe('搜索已选');
    });
  });

  describe('disabled', () => {
    it('disables header checkboxes, rows and move buttons', async () => {
      const w = mountTransfer({ options: OPTIONS, disabled: true });
      for (const button of findMoveButtons(w)) {
        expect(button.attributes('disabled')).toBeDefined();
      }
      const row = w.find('.sn-transfer__panel--source .sn-transfer__option');
      await row.trigger('click');
      expect(row.attributes('aria-selected')).toBe('false');
    });
  });

  describe('render label functions', () => {
    it('renders source / target labels through the render-function props', () => {
      const w = mountTransfer({
        options: OPTIONS,
        value: ['opt-1'],
        renderSourceLabel: ({ option }: { option: TestOption }) =>
          h('strong', `源-${option.label}`),
        renderTargetLabel: ({ option }: { option: TestOption }) => h('em', `标-${option.label}`),
      });
      expect(w.find('.sn-transfer__panel--source .sn-transfer__option-label').text()).toBe(
        '源-选项 2',
      );
      expect(w.find('.sn-transfer__panel--target .sn-transfer__option-label').text()).toBe(
        '标-选项 1',
      );
    });
  });

  describe('checkbox component integration', () => {
    it('renders SnCheckbox in headers and option rows', () => {
      const w = mountTransfer({ options: OPTIONS });
      const checkboxes = w.findAllComponents(SnCheckbox);
      // 2 headers + 4 source options + 0 target = 6
      expect(checkboxes.length).toBe(6);
    });
  });
});
