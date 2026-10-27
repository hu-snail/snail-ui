/**
 * sn-collapse / sn-collapse-item unit tests — uni-end collapse panels.
 *
 * Behaviour only (AGENTS.md §46): the three v-model shapes (normal /
 * accordion / view-more), the disabled guard, the beforeExpend veto and the
 * toggleAll method. No rpx numbers in assertions — happy-dom discards lengths
 * it cannot parse.
 */

import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import SnCollapse from './sn-collapse.vue';
import SnCollapseItem from './sn-collapse-item.vue';

/** Harness: a collapse container with N named panels. */
function mountCollapse(
  props: Record<string, unknown> = {},
  items: Record<string, unknown>[] = [
    { name: 'a', title: 'A' },
    { name: 'b', title: 'B' },
    { name: 'c', title: 'C' },
  ],
) {
  const Harness = defineComponent({
    setup() {
      return () =>
        h(SnCollapse, props, {
          default: () =>
            items.map((item) =>
              h(SnCollapseItem, item, { default: () => `body ${String(item.name)}` }),
            ),
        });
    },
  });
  return mount(Harness);
}

describe('sn-collapse', () => {
  describe('press feedback (hover-class)', () => {
    it('wires the pressed class on enabled panel headers', () => {
      const wrapper = mountCollapse({ modelValue: [] }, [{ name: 'a', title: 'A' }]);
      expect(wrapper.find('.sn-collapse-item__header').attributes('hover-class')).toBe(
        'sn-collapse-item__header--pressed',
      );
    });

    it('keeps disabled panel headers inert', () => {
      const wrapper = mountCollapse({ modelValue: [] }, [
        { name: 'a', title: 'A', disabled: true },
      ]);
      expect(wrapper.find('.sn-collapse-item__header').attributes('hover-class')).toBe('none');
    });

    it('wires the pressed class on the view-more toggle', () => {
      const wrapper = mountCollapse({ viewmore: true, modelValue: false }, [{ name: 'a' }]);
      expect(wrapper.find('.sn-collapse__more').attributes('hover-class')).toBe(
        'sn-collapse__more--pressed',
      );
    });
  });

  describe('normal mode', () => {
    it('renders every panel header', () => {
      const wrapper = mountCollapse();
      expect(wrapper.findAll('.sn-collapse-item__header')).toHaveLength(3);
    });

    it('opens the panels listed in the bound array', () => {
      const wrapper = mountCollapse({ modelValue: ['a', 'c'] });
      const items = wrapper.findAll('.sn-collapse-item');
      expect(items[0]!.classes()).toContain('sn-collapse-item--expanded');
      expect(items[1]!.classes()).not.toContain('sn-collapse-item--expanded');
      expect(items[2]!.classes()).toContain('sn-collapse-item--expanded');
    });

    it('emits the opened-name array on tap', async () => {
      const wrapper = mountCollapse({ modelValue: ['a'] });
      await wrapper.findAll('.sn-collapse-item__header')[1]!.trigger('tap');
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(SnCollapse).emitted('update:modelValue')?.at(-1)).toEqual([
        ['a', 'b'],
      ]);
    });

    it('closes an open panel', async () => {
      const wrapper = mountCollapse({ modelValue: ['a', 'b'] });
      await wrapper.findAll('.sn-collapse-item__header')[0]!.trigger('tap');
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(SnCollapse).emitted('update:modelValue')?.at(-1)).toEqual([
        ['b'],
      ]);
    });

    it('emits change with { value }', async () => {
      const wrapper = mountCollapse({ modelValue: [] });
      await wrapper.findAll('.sn-collapse-item__header')[0]!.trigger('tap');
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(SnCollapse).emitted('change')?.at(-1)).toEqual([
        { value: ['a'] },
      ]);
    });

    it('works uncontrolled', async () => {
      const wrapper = mountCollapse();
      await wrapper.findAll('.sn-collapse-item__header')[0]!.trigger('tap');
      await wrapper.vm.$nextTick();
      expect(wrapper.findAll('.sn-collapse-item')[0]!.classes()).toContain(
        'sn-collapse-item--expanded',
      );
    });
  });

  describe('accordion mode', () => {
    it('opens the single named panel', () => {
      const wrapper = mountCollapse({ accordion: true, modelValue: 'b' });
      const items = wrapper.findAll('.sn-collapse-item');
      expect(items[1]!.classes()).toContain('sn-collapse-item--expanded');
      expect(items[0]!.classes()).not.toContain('sn-collapse-item--expanded');
    });

    it('replaces the open panel instead of adding', async () => {
      const wrapper = mountCollapse({ accordion: true, modelValue: 'a' });
      await wrapper.findAll('.sn-collapse-item__header')[2]!.trigger('tap');
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(SnCollapse).emitted('update:modelValue')?.at(-1)).toEqual(['c']);
      const items = wrapper.findAll('.sn-collapse-item');
      expect(items[2]!.classes()).toContain('sn-collapse-item--expanded');
      expect(items[0]!.classes()).not.toContain('sn-collapse-item--expanded');
    });

    it('closes the open panel when tapped again', async () => {
      const wrapper = mountCollapse({ accordion: true, modelValue: 'a' });
      await wrapper.findAll('.sn-collapse-item__header')[0]!.trigger('tap');
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(SnCollapse).emitted('update:modelValue')?.at(-1)).toEqual(['']);
    });

    it('adds the accordion class', () => {
      expect(mountCollapse({ accordion: true }).find('.sn-collapse').classes()).toContain(
        'sn-collapse--accordion',
      );
    });
  });

  describe('view-more mode', () => {
    it('shows the body without expanding a panel', () => {
      const wrapper = mountCollapse({ viewmore: true, modelValue: false }, [{ name: 'a' }]);
      expect(wrapper.find('.sn-collapse-item__body').isVisible()).toBe(true);
    });

    it('clamps the body while collapsed', () => {
      const wrapper = mountCollapse({ viewmore: true, modelValue: false, lineNum: 3 }, [
        { name: 'a' },
      ]);
      const body = wrapper.find('.sn-collapse-item__body');
      expect(body.classes()).toContain('sn-collapse-item__body--clamped');
      expect(body.attributes('style')).toContain('-webkit-line-clamp: 3');
    });

    it('drops the clamp once expanded', () => {
      const wrapper = mountCollapse({ viewmore: true, modelValue: true }, [{ name: 'a' }]);
      expect(wrapper.find('.sn-collapse-item__body').classes()).not.toContain(
        'sn-collapse-item__body--clamped',
      );
    });

    it('renders the more control and flips the flag', async () => {
      const wrapper = mountCollapse({ viewmore: true, modelValue: false }, [{ name: 'a' }]);
      const more = wrapper.find('.sn-collapse__more');
      expect(more.exists()).toBe(true);
      await more.trigger('tap');
      expect(wrapper.findComponent(SnCollapse).emitted('update:modelValue')?.at(-1)).toEqual([
        true,
      ]);
    });

    it('exposes the expanded flag to the more slot', () => {
      const Harness = defineComponent({
        setup() {
          return () =>
            h(
              SnCollapse,
              { viewmore: true, modelValue: true },
              {
                default: () => [h(SnCollapseItem, { name: 'a' })],
                more: ({ expanded }: { expanded: boolean }) =>
                  h('text', { class: 'custom-more' }, String(expanded)),
              },
            );
        },
      });
      expect(mount(Harness).find('.custom-more').text()).toBe('true');
    });
  });

  describe('disabled / beforeExpend', () => {
    it('does not toggle a disabled panel', async () => {
      const wrapper = mountCollapse({ modelValue: [] }, [
        { name: 'a', title: 'A', disabled: true },
      ]);
      await wrapper.find('.sn-collapse-item__header').trigger('tap');
      expect(wrapper.findComponent(SnCollapse).emitted('update:modelValue')).toBeUndefined();
    });

    it('marks a disabled panel with aria-disabled', () => {
      const wrapper = mountCollapse({}, [{ name: 'a', disabled: true }]);
      expect(wrapper.find('.sn-collapse-item__header').attributes('aria-disabled')).toBe('true');
    });

    it('opens when beforeExpend resolves true', async () => {
      const beforeExpend = vi.fn(() => true);
      const wrapper = mountCollapse({ modelValue: [] }, [{ name: 'a', beforeExpend }]);
      await wrapper.find('.sn-collapse-item__header').trigger('tap');
      await vi.waitFor(() => {
        expect(wrapper.findComponent(SnCollapse).emitted('update:modelValue')?.at(-1)).toEqual([
          ['a'],
        ]);
      });
      expect(beforeExpend).toHaveBeenCalledWith('a');
    });

    it('stays closed when beforeExpend resolves false', async () => {
      const beforeExpend = vi.fn(async () => false);
      const wrapper = mountCollapse({ modelValue: [] }, [{ name: 'a', beforeExpend }]);
      await wrapper.find('.sn-collapse-item__header').trigger('tap');
      await vi.waitFor(() => expect(beforeExpend).toHaveBeenCalled());
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(SnCollapse).emitted('update:modelValue')).toBeUndefined();
    });

    it('stays closed when beforeExpend rejects', async () => {
      const beforeExpend = vi.fn(async () => {
        throw new Error('denied');
      });
      const wrapper = mountCollapse({ modelValue: [] }, [{ name: 'a', beforeExpend }]);
      await wrapper.find('.sn-collapse-item__header').trigger('tap');
      await vi.waitFor(() => expect(beforeExpend).toHaveBeenCalled());
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(SnCollapse).emitted('update:modelValue')).toBeUndefined();
    });

    it('closes without consulting beforeExpend', async () => {
      const beforeExpend = vi.fn(() => false);
      const wrapper = mountCollapse({ modelValue: ['a'] }, [{ name: 'a', beforeExpend }]);
      await wrapper.find('.sn-collapse-item__header').trigger('tap');
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(SnCollapse).emitted('update:modelValue')?.at(-1)).toEqual([[]]);
      expect(beforeExpend).not.toHaveBeenCalled();
    });
  });

  describe('toggleAll', () => {
    function collapseVm(wrapper: ReturnType<typeof mount>) {
      return wrapper.findComponent(SnCollapse).vm as unknown as {
        toggleAll: (options?: { expanded?: boolean; skipDisabled?: boolean }) => void;
      };
    }

    it('opens every panel with expanded: true', async () => {
      const wrapper = mountCollapse({ modelValue: [] });
      await wrapper.vm.$nextTick();
      collapseVm(wrapper).toggleAll({ expanded: true });
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(SnCollapse).emitted('update:modelValue')?.at(-1)).toEqual([
        ['a', 'b', 'c'],
      ]);
    });

    it('closes every panel with expanded: false', async () => {
      const wrapper = mountCollapse({ modelValue: ['a', 'b'] });
      await wrapper.vm.$nextTick();
      collapseVm(wrapper).toggleAll({ expanded: false });
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(SnCollapse).emitted('update:modelValue')?.at(-1)).toEqual([[]]);
    });

    it('opens every panel when omitted and all are closed', async () => {
      const wrapper = mountCollapse({ modelValue: [] });
      await wrapper.vm.$nextTick();
      collapseVm(wrapper).toggleAll();
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(SnCollapse).emitted('update:modelValue')?.at(-1)).toEqual([
        ['a', 'b', 'c'],
      ]);
    });

    it('closes every panel when omitted and some are open', async () => {
      const wrapper = mountCollapse({ modelValue: ['b'] });
      await wrapper.vm.$nextTick();
      collapseVm(wrapper).toggleAll();
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(SnCollapse).emitted('update:modelValue')?.at(-1)).toEqual([[]]);
    });

    it('opens only the enabled panels with skipDisabled', async () => {
      const wrapper = mountCollapse({ modelValue: [] }, [
        { name: 'a', title: 'A' },
        { name: 'b', title: 'B', disabled: true },
        { name: 'c', title: 'C' },
      ]);
      await wrapper.vm.$nextTick();
      collapseVm(wrapper).toggleAll({ expanded: true, skipDisabled: true });
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(SnCollapse).emitted('update:modelValue')?.at(-1)).toEqual([
        ['a', 'c'],
      ]);
      expect(wrapper.findAll('.sn-collapse-item')[1]!.classes()).not.toContain(
        'sn-collapse-item--expanded',
      );
    });

    it('keeps open disabled panels open when closing with skipDisabled', async () => {
      const wrapper = mountCollapse({ modelValue: ['a', 'b'] }, [
        { name: 'a', title: 'A' },
        { name: 'b', title: 'B', disabled: true },
      ]);
      await wrapper.vm.$nextTick();
      collapseVm(wrapper).toggleAll({ expanded: false, skipDisabled: true });
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(SnCollapse).emitted('update:modelValue')?.at(-1)).toEqual([
        ['b'],
      ]);
      expect(wrapper.findAll('.sn-collapse-item')[1]!.classes()).toContain(
        'sn-collapse-item--expanded',
      );
    });

    it('flips only the enabled panels with skipDisabled', async () => {
      const wrapper = mountCollapse({ modelValue: ['a'] }, [
        { name: 'a', title: 'A' },
        { name: 'b', title: 'B', disabled: true },
      ]);
      await wrapper.vm.$nextTick();
      // 'a' (enabled) is open → enabled panels close, the disabled one stays.
      collapseVm(wrapper).toggleAll({ skipDisabled: true });
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(SnCollapse).emitted('update:modelValue')?.at(-1)).toEqual([[]]);

      collapseVm(wrapper).toggleAll({ skipDisabled: true });
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(SnCollapse).emitted('update:modelValue')?.at(-1)).toEqual([
        ['a'],
      ]);
    });

    it('re-reads the disabled state when an item flips disabled later', async () => {
      const disabled = ref(false);
      const Harness = defineComponent({
        setup() {
          return () =>
            h(
              SnCollapse,
              { modelValue: [] },
              {
                default: () => [
                  h(SnCollapseItem, { name: 'a', title: 'A', disabled: disabled.value }),
                  h(SnCollapseItem, { name: 'b', title: 'B' }),
                ],
              },
            );
        },
      });
      const wrapper = mount(Harness);
      await wrapper.vm.$nextTick();
      disabled.value = true;
      await wrapper.vm.$nextTick();
      collapseVm(wrapper).toggleAll({ expanded: true, skipDisabled: true });
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(SnCollapse).emitted('update:modelValue')?.at(-1)).toEqual([
        ['b'],
      ]);
    });

    it('forgets unmounted panels', async () => {
      const show = ref(true);
      const Harness = defineComponent({
        setup() {
          return () =>
            h(
              SnCollapse,
              { modelValue: [] },
              {
                default: () => [
                  h(SnCollapseItem, { name: 'a', title: 'A' }),
                  show.value ? h(SnCollapseItem, { name: 'b', title: 'B' }) : null,
                ],
              },
            );
        },
      });
      const wrapper = mount(Harness);
      await wrapper.vm.$nextTick();
      show.value = false;
      await wrapper.vm.$nextTick();
      collapseVm(wrapper).toggleAll({ expanded: true });
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(SnCollapse).emitted('update:modelValue')?.at(-1)).toEqual([
        ['a'],
      ]);
    });

    it('flips the view-more flag in view-more mode', async () => {
      const wrapper = mountCollapse({ viewmore: true, modelValue: false }, [{ name: 'a' }]);
      await wrapper.vm.$nextTick();
      collapseVm(wrapper).toggleAll({ expanded: true });
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(SnCollapse).emitted('update:modelValue')?.at(-1)).toEqual([
        true,
      ]);
      collapseVm(wrapper).toggleAll();
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(SnCollapse).emitted('update:modelValue')?.at(-1)).toEqual([
        false,
      ]);
    });
  });

  describe('slots / accessibility', () => {
    it('renders the title slot over the title prop', () => {
      const Harness = defineComponent({
        setup() {
          return () =>
            h(
              SnCollapse,
              { modelValue: [] },
              {
                default: () => [
                  h(
                    SnCollapseItem,
                    { name: 'a', title: 'ignored' },
                    {
                      title: () => h('text', { class: 'custom-title' }, 'slot'),
                    },
                  ),
                ],
              },
            );
        },
      });
      const wrapper = mount(Harness);
      expect(wrapper.find('.custom-title').text()).toBe('slot');
      expect(wrapper.find('.sn-collapse-item__title-text').exists()).toBe(false);
    });

    it('exposes the expanded / disabled flags to the title slot', () => {
      const Harness = defineComponent({
        setup() {
          return () =>
            h(
              SnCollapse,
              { modelValue: ['a'] },
              {
                default: () => [
                  h(
                    SnCollapseItem,
                    { name: 'a', title: 'A', disabled: true },
                    {
                      title: ({ expanded, disabled }: { expanded: boolean; disabled: boolean }) =>
                        h('text', { class: 'custom-title' }, `${expanded}-${disabled}`),
                    },
                  ),
                ],
              },
            );
        },
      });
      expect(mount(Harness).find('.custom-title').text()).toBe('true-true');
    });

    it('marks the header as role="button" with aria-expanded', () => {
      const wrapper = mountCollapse({ modelValue: ['a'] });
      const header = wrapper.find('.sn-collapse-item__header');
      expect(header.attributes('role')).toBe('button');
      expect(header.attributes('aria-expanded')).toBe('true');
    });

    it('closes the panel to aria-expanded="false" when the header is tapped', async () => {
      const wrapper = mountCollapse({ modelValue: ['a'] }, [{ name: 'a', title: 'A' }]);
      await wrapper.find('.sn-collapse-item__header').trigger('tap');
      expect(wrapper.find('.sn-collapse-item__header').attributes('aria-expanded')).toBe('false');
    });

    it('names the header after the title', () => {
      const wrapper = mountCollapse({ modelValue: [] }, [{ name: 'a', title: 'Pricing' }]);
      expect(wrapper.find('.sn-collapse-item__header').attributes('aria-label')).toBe('Pricing');
    });

    it('marks the body as a region', () => {
      const wrapper = mountCollapse({ modelValue: ['a'] });
      expect(wrapper.find('.sn-collapse-item__body').attributes('role')).toBe('region');
    });

    it('hides the body of a closed panel in normal mode', () => {
      // happy-dom's getComputedStyle does not feed VTU's isVisible() for the
      // v-show contract here, so assert the inline style v-show writes.
      const closed = mountCollapse({ modelValue: [] }, [{ name: 'a' }]);
      expect(closed.find('.sn-collapse-item__body').attributes('style')).toContain('display: none');

      const open = mountCollapse({ modelValue: ['a'] }, [{ name: 'a' }]);
      expect(open.find('.sn-collapse-item__body').attributes('style') ?? '').not.toContain(
        'display: none',
      );
    });

    it('forwards customClass on the container and the item', () => {
      const Harness = defineComponent({
        setup() {
          return () =>
            h(
              SnCollapse,
              { customClass: 'my-collapse' },
              {
                default: () => [h(SnCollapseItem, { name: 'a', customClass: 'my-item' })],
              },
            );
        },
      });
      const wrapper = mount(Harness);
      expect(wrapper.find('.sn-collapse').classes()).toContain('my-collapse');
      expect(wrapper.find('.sn-collapse-item').classes()).toContain('my-item');
    });

    it('drops the item border when border is off', () => {
      const wrapper = mountCollapse({ modelValue: [] }, [{ name: 'a', border: false }]);
      expect(wrapper.find('.sn-collapse-item').classes()).not.toContain('sn-collapse-item--border');
    });

    it('forwards customBodyClass / customBodyStyle on the body', () => {
      const wrapper = mountCollapse({ modelValue: ['a'] }, [
        { name: 'a', customBodyClass: 'my-body', customBodyStyle: 'padding: 8px' },
      ]);
      const body = wrapper.find('.sn-collapse-item__body');
      expect(body.classes()).toContain('my-body');
      expect(body.attributes('style')).toContain('padding: 8px');
    });

    it('rotates the arrow 180 degrees while expanded', () => {
      const closed = mountCollapse({ modelValue: [] }, [{ name: 'a' }]);
      expect(closed.find('.sn-collapse-item__arrow .sn-icon').attributes('style')).toContain(
        'rotate(0deg)',
      );

      const open = mountCollapse({ modelValue: ['a'] }, [{ name: 'a' }]);
      expect(open.find('.sn-collapse-item__arrow .sn-icon').attributes('style')).toContain(
        'rotate(180deg)',
      );
    });
  });

  describe('item change event', () => {
    it('emits change with the panel name and its new state', async () => {
      const wrapper = mountCollapse({ modelValue: [] }, [{ name: 'a', title: 'A' }]);
      await wrapper.findAll('.sn-collapse-item__header')[0]!.trigger('tap');
      expect(wrapper.findComponent(SnCollapseItem).emitted('change')?.[0]).toEqual([
        { name: 'a', expanded: true },
      ]);

      await wrapper.findAll('.sn-collapse-item__header')[0]!.trigger('tap');
      expect(wrapper.findComponent(SnCollapseItem).emitted('change')?.[1]).toEqual([
        { name: 'a', expanded: false },
      ]);
    });

    it('does not emit change for a disabled panel', async () => {
      const wrapper = mountCollapse({ modelValue: [] }, [
        { name: 'a', title: 'A', disabled: true },
      ]);
      await wrapper.find('.sn-collapse-item__header').trigger('tap');
      expect(wrapper.findComponent(SnCollapseItem).emitted('change')).toBeUndefined();
    });
  });

  describe('view-more presentation', () => {
    it('marks the more control aria-expanded and restyles it', async () => {
      const wrapper = mountCollapse(
        { viewmore: true, modelValue: false, customMoreSlotClass: 'my-more' },
        [{ name: 'a' }],
      );
      const more = wrapper.find('.sn-collapse__more');
      expect(more.classes()).toContain('my-more');
      expect(more.attributes('role')).toBe('button');
      expect(more.attributes('aria-expanded')).toBe('false');
      expect(more.text()).toBe('展开');
      await more.trigger('tap');
      expect(wrapper.find('.sn-collapse__more').attributes('aria-expanded')).toBe('true');
      expect(wrapper.find('.sn-collapse__more').text()).toBe('收起');
    });

    it('starts view-more mode from a true bound value', () => {
      const wrapper = mountCollapse({ viewmore: true, modelValue: true }, [{ name: 'a' }]);
      expect(wrapper.find('.sn-collapse__more').attributes('aria-expanded')).toBe('true');
    });

    it('adds the viewmore container class', () => {
      const wrapper = mountCollapse({ viewmore: true, modelValue: false }, [{ name: 'a' }]);
      expect(wrapper.find('.sn-collapse').classes()).toContain('sn-collapse--viewmore');
    });
  });

  describe('accordion defaults', () => {
    it('starts closed with the default empty-string model', async () => {
      const wrapper = mountCollapse({ accordion: true });
      expect(wrapper.findAll('.sn-collapse-item--expanded')).toHaveLength(0);
      await wrapper.findAll('.sn-collapse-item__header')[0]!.trigger('tap');
      expect(wrapper.findComponent(SnCollapse).emitted('update:modelValue')?.at(-1)).toEqual(['a']);
    });
  });
});

describe('sn-collapse model sync and disabled registry cleanup', () => {
  it('follows an external modelValue write', async () => {
    const wrapper = mountCollapse({ modelValue: [] });
    await wrapper.setProps({ modelValue: ['b'] });
    await wrapper.vm.$nextTick();
    const expanded = wrapper.findAll('.sn-collapse-item--expanded');
    expect(expanded).toHaveLength(1);
    expect(expanded[0]!.text()).toContain('B');
  });

  it('drops a disabled name from the registry when its item unmounts', async () => {
    const items = ref([{ name: 'a', title: 'A', disabled: true }]);
    const Harness = defineComponent({
      setup() {
        return () =>
          h(
            SnCollapse,
            { modelValue: [], border: true },
            {
              default: () =>
                items.value.map((item) =>
                  h(SnCollapseItem, item, { default: () => `body ${item.name}` }),
                ),
            },
          );
      },
    });
    const wrapper = mount(Harness);
    await wrapper.vm.$nextTick();
    // Removing the disabled item must not leave it in the skip set.
    items.value = [];
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('.sn-collapse-item')).toHaveLength(0);
  });
});
