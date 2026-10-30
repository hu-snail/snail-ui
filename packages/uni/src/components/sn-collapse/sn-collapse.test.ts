/**
 * sn-collapse / sn-collapse-item unit tests — uni-end collapse panels.
 *
 * Behaviour only (AGENTS.md §46): the three v-model shapes (normal /
 * accordion / view-more), the disabled guard, the beforeExpend veto, the
 * toggleAll method and the additive icon / card surface. No rpx numbers in
 * assertions — happy-dom discards lengths it cannot parse.
 */

import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import SnCollapse from './sn-collapse.vue';
import SnCollapseItem from './sn-collapse-item.vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import { Bell, ChevronDown, Truck } from '../sn-icon/sn-icon-set';
import { clearSnIcons, registerSnIcons } from '../sn-icon/sn-icon-registry';

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
      const wrapper = mountCollapse({ modelValue: [] }, [{ name: 'a', title: 'A', disabled: true }]);
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
            h(SnCollapse, { modelValue: [] }, {
              default: () => [
                h(SnCollapseItem, { name: 'a', title: 'A', disabled: disabled.value }),
                h(SnCollapseItem, { name: 'b', title: 'B' }),
              ],
            });
        },
      });
      const wrapper = mount(Harness);
      await wrapper.vm.$nextTick();
      disabled.value = true;
      await wrapper.vm.$nextTick();
      collapseVm(wrapper).toggleAll({ expanded: true, skipDisabled: true });
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(SnCollapse).emitted('update:modelValue')?.at(-1)).toEqual([['b']]);
    });

    it('forgets unmounted panels', async () => {
      const show = ref(true);
      const Harness = defineComponent({
        setup() {
          return () =>
            h(SnCollapse, { modelValue: [] }, {
              default: () => [
                h(SnCollapseItem, { name: 'a', title: 'A' }),
                show.value ? h(SnCollapseItem, { name: 'b', title: 'B' }) : null,
              ],
            });
        },
      });
      const wrapper = mount(Harness);
      await wrapper.vm.$nextTick();
      show.value = false;
      await wrapper.vm.$nextTick();
      collapseVm(wrapper).toggleAll({ expanded: true });
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(SnCollapse).emitted('update:modelValue')?.at(-1)).toEqual([['a']]);
    });

    it('flips the view-more flag in view-more mode', async () => {
      const wrapper = mountCollapse({ viewmore: true, modelValue: false }, [{ name: 'a' }]);
      await wrapper.vm.$nextTick();
      collapseVm(wrapper).toggleAll({ expanded: true });
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(SnCollapse).emitted('update:modelValue')?.at(-1)).toEqual([true]);
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
                      title: ({
                        expanded,
                        disabled,
                      }: {
                        expanded: boolean;
                        disabled: boolean;
                      }) => h('text', { class: 'custom-title' }, `${expanded}-${disabled}`),
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
      expect(closed.find('.sn-collapse-item__body').attributes('style')).toContain(
        'display: none',
      );

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
      expect(wrapper.find('.sn-collapse-item').classes()).not.toContain(
        'sn-collapse-item--border',
      );
    });

    it('forwards customBodyClass / customBodyStyle on the body', () => {
      const wrapper = mountCollapse({ modelValue: ['a'] }, [
        { name: 'a', customBodyClass: 'my-body', customBodyStyle: 'padding: 8px' },
      ]);
      const body = wrapper.find('.sn-collapse-item__body');
      expect(body.classes()).toContain('my-body');
      expect(body.attributes('style')).toContain('padding: 8px');
    });

    it('marks the panel expanded and rotates the chevron through the class', () => {
      // Rotation rides `.sn-collapse-item--expanded .sn-collapse-item__arrow`
      // instead of an inline transform, so App targets animate it too.
      const closed = mountCollapse({ modelValue: [] }, [{ name: 'a' }]);
      expect(closed.find('.sn-collapse-item').classes()).not.toContain(
        'sn-collapse-item--expanded',
      );
      expect(closed.find('.sn-collapse-item__arrow .sn-icon').exists()).toBe(true);

      const open = mountCollapse({ modelValue: ['a'] }, [{ name: 'a' }]);
      expect(open.find('.sn-collapse-item').classes()).toContain('sn-collapse-item--expanded');
      expect(open.find('.sn-collapse-item__arrow .sn-icon').exists()).toBe(true);
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

  describe('title icons (additive)', () => {
    it('renders an IconData object passed through titleIconData', () => {
      const wrapper = mountCollapse({ modelValue: [] }, [
        { name: 'a', title: 'A', titleIconData: Bell },
      ]);
      expect(wrapper.find('.sn-collapse-item__title-icon svg').exists()).toBe(true);
    });

    it('renders an image when titleIconUrl is set', () => {
      const wrapper = mountCollapse({ modelValue: [] }, [
        { name: 'a', title: 'A', titleIconUrl: 'https://example.com/a.png' },
      ]);
      const img = wrapper.find('.sn-collapse-item__title-image');
      expect(img.exists()).toBe(true);
      expect(img.attributes('src')).toBe('https://example.com/a.png');
    });

    it('resolves a built-in catalogue name without registration', () => {
      const wrapper = mountCollapse({ modelValue: [] }, [
        { name: 'a', title: 'A', titleIcon: 'bell' },
      ]);
      expect(wrapper.find('.sn-collapse-item__title-icon svg').exists()).toBe(true);
    });

    it('resolves a registered name', () => {
      registerSnIcons({ 'collapse-truck': Truck });
      const wrapper = mountCollapse({ modelValue: [] }, [
        { name: 'a', title: 'A', titleIcon: 'collapse-truck' },
      ]);
      expect(wrapper.find('.sn-collapse-item__title-icon svg').exists()).toBe(true);
      clearSnIcons();
    });

    it('prefers titleIconData over the name track', () => {
      const wrapper = mountCollapse({ modelValue: [] }, [
        { name: 'a', title: 'A', titleIcon: 'bell', titleIconData: Truck },
      ]);
      expect(wrapper.findAll('.sn-collapse-item__title-icon')).toHaveLength(1);
      expect(wrapper.find('.sn-collapse-item__title-icon svg').exists()).toBe(true);
    });

    it('prefers titleIconData over titleIconUrl', () => {
      const wrapper = mountCollapse({ modelValue: [] }, [
        { name: 'a', title: 'A', titleIconData: Bell, titleIconUrl: 'https://example.com/a.png' },
      ]);
      expect(wrapper.find('.sn-collapse-item__title-image').exists()).toBe(false);
      expect(wrapper.find('.sn-collapse-item__title-icon').exists()).toBe(true);
    });

    it('prefers titleIconUrl over the name track', () => {
      const wrapper = mountCollapse({ modelValue: [] }, [
        { name: 'a', title: 'A', titleIcon: 'bell', titleIconUrl: 'https://example.com/a.png' },
      ]);
      expect(wrapper.find('.sn-collapse-item__title-image').exists()).toBe(true);
      expect(wrapper.find('.sn-collapse-item__title-icon').exists()).toBe(false);
    });

    it('renders no title icon when all three sources are unset', () => {
      const wrapper = mountCollapse({ modelValue: [] }, [{ name: 'a', title: 'A' }]);
      expect(wrapper.find('.sn-collapse-item__title-icon').exists()).toBe(false);
      expect(wrapper.find('.sn-collapse-item__title-image').exists()).toBe(false);
    });

    it('keeps the title slot usable beside the title icon', () => {
      const Harness = defineComponent({
        setup() {
          return () =>
            h(SnCollapse, { modelValue: ['a'] }, {
              default: () => [
                h(
                  SnCollapseItem,
                  { name: 'a', title: 'ignored', titleIconData: Bell },
                  {
                    title: () => h('text', { class: 'custom-title' }, 'slot'),
                  },
                ),
              ],
            });
        },
      });
      const wrapper = mount(Harness);
      expect(wrapper.find('.custom-title').text()).toBe('slot');
      expect(wrapper.find('.sn-collapse-item__title-icon svg').exists()).toBe(true);
    });
  });

  describe('icon geometry (additive)', () => {
    it('sizes the chevron from the medium icon token by default', () => {
      const wrapper = mountCollapse({ modelValue: [] }, [{ name: 'a', title: 'A' }]);
      expect(wrapper.find('.sn-collapse-item__chevron').attributes('style')).toContain(
        'var(--sn-mp-icon-size-medium)',
      );
    });

    it('maps the item iconSize tier name to the mp icon-size token', () => {
      const wrapper = mountCollapse({ modelValue: [] }, [
        { name: 'a', title: 'A', iconSize: 'large', titleIconData: Bell },
      ]);
      expect(wrapper.find('.sn-collapse-item__chevron').attributes('style')).toContain(
        'var(--sn-mp-icon-size-large)',
      );
      expect(wrapper.find('.sn-collapse-item__title-icon').attributes('style')).toContain(
        'var(--sn-mp-icon-size-large)',
      );
    });

    it('lets the container iconSize reach every panel and the title icons', () => {
      const wrapper = mountCollapse({ modelValue: [], iconSize: 'xlarge' }, [
        { name: 'a', title: 'A', titleIconData: Bell },
        { name: 'b', title: 'B' },
      ]);
      const chevrons = wrapper.findAll('.sn-collapse-item__chevron');
      expect(chevrons).toHaveLength(2);
      for (const chevron of chevrons) {
        expect(chevron.attributes('style')).toContain('var(--sn-mp-icon-size-xlarge)');
      }
      expect(wrapper.find('.sn-collapse-item__title-icon').attributes('style')).toContain(
        'var(--sn-mp-icon-size-xlarge)',
      );
    });

    it('lets an explicit item iconSize win over the container', () => {
      const wrapper = mountCollapse({ modelValue: [], iconSize: 'xlarge' }, [
        { name: 'a', title: 'A', iconSize: 'tiny' },
      ]);
      expect(wrapper.find('.sn-collapse-item__chevron').attributes('style')).toContain(
        'var(--sn-mp-icon-size-tiny)',
      );
    });

    it('passes unknown iconSize strings through', () => {
      const wrapper = mountCollapse({ modelValue: [] }, [
        { name: 'a', title: 'A', iconSize: '2em' },
      ]);
      expect(wrapper.find('.sn-collapse-item__chevron').attributes('style')).toContain('width: 2em');
    });

    it('sizes the image icon with the same resolved length', () => {
      const wrapper = mountCollapse({ modelValue: [], iconSize: 'small' }, [
        { name: 'a', title: 'A', titleIconUrl: 'https://example.com/a.png' },
      ]);
      expect(wrapper.find('.sn-collapse-item__title-image').attributes('style')).toContain(
        'var(--sn-mp-icon-size-small)',
      );
    });

    it('forwards the neutral stroke width to both glyph slots', () => {
      const wrapper = mountCollapse({ modelValue: [] }, [
        { name: 'a', title: 'A', titleIconData: Bell },
      ]);
      const icons = wrapper.findAllComponents(SnIcon);
      // Chevron + title icon.
      expect(icons).toHaveLength(2);
      for (const icon of icons) {
        expect(icon.props('strokeWidth')).toBe(2);
      }
    });

    it('forwards an explicit iconStrokeWidth to both glyph slots', () => {
      const wrapper = mountCollapse({ modelValue: [] }, [
        { name: 'a', title: 'A', titleIconData: Bell, iconStrokeWidth: 1.5 },
      ]);
      for (const icon of wrapper.findAllComponents(SnIcon)) {
        expect(icon.props('strokeWidth')).toBe(1.5);
      }
    });

    it('keeps the chevron on the built-in ChevronDown object', () => {
      const wrapper = mountCollapse({ modelValue: [] }, [{ name: 'a', title: 'A' }]);
      const chevron = wrapper.findComponent('.sn-collapse-item__chevron');
      expect(chevron.props('icon')).toEqual(ChevronDown);
    });
  });

  describe('icon colour (additive)', () => {
    it('applies iconColor to the chevron and the title icon', () => {
      const wrapper = mountCollapse({ modelValue: [] }, [
        { name: 'a', title: 'A', titleIconData: Bell, iconColor: 'var(--sn-mp-color-feedback-warning)' },
      ]);
      expect(wrapper.find('.sn-collapse-item__chevron').attributes('style')).toContain(
        'color: var(--sn-mp-color-feedback-warning)',
      );
      expect(wrapper.find('.sn-collapse-item__title-icon').attributes('style')).toContain(
        'color: var(--sn-mp-color-feedback-warning)',
      );
    });

    it('lets the container iconColor reach a panel that sets none', () => {
      const wrapper = mountCollapse({ modelValue: [], iconColor: 'var(--sn-mp-color-feedback-info)' }, [
        { name: 'a', title: 'A', titleIconData: Bell },
      ]);
      expect(wrapper.find('.sn-collapse-item__chevron').attributes('style')).toContain(
        'color: var(--sn-mp-color-feedback-info)',
      );
      expect(wrapper.find('.sn-collapse-item__title-icon').attributes('style')).toContain(
        'color: var(--sn-mp-color-feedback-info)',
      );
    });

    it('lets an explicit item iconColor win over the container', () => {
      const wrapper = mountCollapse({ modelValue: [], iconColor: 'var(--sn-mp-color-feedback-info)' }, [
        { name: 'a', title: 'A', iconColor: 'var(--sn-mp-color-feedback-danger)' },
      ]);
      expect(wrapper.find('.sn-collapse-item__chevron').attributes('style')).toContain(
        'color: var(--sn-mp-color-feedback-danger)',
      );
    });

    it('leaves the icon colours to the token classes when unset', () => {
      const wrapper = mountCollapse({ modelValue: [] }, [{ name: 'a', title: 'A', titleIconData: Bell }]);
      expect(wrapper.find('.sn-collapse-item__chevron').attributes('style') ?? '').not.toContain(
        'color:',
      );
      expect(wrapper.find('.sn-collapse-item__title-icon').attributes('style') ?? '').not.toContain(
        'color:',
      );
    });

    it('colours the view-more chevron from the container iconColor', () => {
      const wrapper = mountCollapse(
        { viewmore: true, modelValue: false, iconColor: 'var(--sn-mp-color-feedback-info)' },
        [{ name: 'a' }],
      );
      expect(wrapper.find('.sn-collapse__more-chevron').attributes('style')).toContain(
        'color: var(--sn-mp-color-feedback-info)',
      );
    });
  });

  describe('card mode (additive)', () => {
    it('adds the card class on the container and every panel', () => {
      const wrapper = mountCollapse({ modelValue: [], card: true });
      expect(wrapper.find('.sn-collapse').classes()).toContain('sn-collapse--card');
      expect(wrapper.findAll('.sn-collapse-item--card')).toHaveLength(3);
    });

    it('suppresses the shared divider in card mode', () => {
      const wrapper = mountCollapse({ modelValue: [], card: true }, [
        { name: 'a', title: 'A', border: true },
      ]);
      expect(wrapper.find('.sn-collapse-item').classes()).not.toContain(
        'sn-collapse-item--border',
      );
    });

    it('keeps the divider when card mode is off', () => {
      const wrapper = mountCollapse({ modelValue: [] }, [{ name: 'a', title: 'A', border: true }]);
      expect(wrapper.find('.sn-collapse-item').classes()).toContain('sn-collapse-item--border');
    });

    it('lets an explicit item card win over the container', () => {
      const wrapper = mountCollapse({ modelValue: [], card: true }, [
        { name: 'a', title: 'A', card: false },
      ]);
      expect(wrapper.find('.sn-collapse-item').classes()).not.toContain(
        'sn-collapse-item--card',
      );
    });

    it('lets an item turn card mode on without the container', () => {
      const wrapper = mountCollapse({ modelValue: [] }, [{ name: 'a', title: 'A', card: true }]);
      expect(wrapper.find('.sn-collapse-item').classes()).toContain('sn-collapse-item--card');
      expect(wrapper.find('.sn-collapse').classes()).not.toContain('sn-collapse--card');
    });

    it('carries a title icon inside a card header', () => {
      const wrapper = mountCollapse({ modelValue: [], card: true }, [
        { name: 'a', title: 'A', titleIconData: Bell },
      ]);
      expect(wrapper.find('.sn-collapse-item--card .sn-collapse-item__title-icon').exists()).toBe(
        true,
      );
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
          h(SnCollapse, { modelValue: [], border: true }, {
            default: () =>
              items.value.map((item) =>
                h(SnCollapseItem, item, { default: () => `body ${item.name}` }),
              ),
          });
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
