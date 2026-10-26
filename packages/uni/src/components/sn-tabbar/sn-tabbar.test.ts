/**
 * sn-tabbar / sn-tabbar-item unit tests — uni-end bottom tab bar.
 *
 * Behaviour only (AGENTS.md §46): the v-model contract, the index fallback
 * for items without `name`, the beforeChange veto, badge rendering and the
 * tablist / tab roles. No rpx numbers in assertions — happy-dom discards
 * lengths it cannot parse.
 */

import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import SnTabbar from './sn-tabbar.vue';
import SnTabbarItem from './sn-tabbar-item.vue';

/** Harness that mounts a bar with N items so provide/inject is exercised. */
function mountBar(props: Record<string, unknown> = {}, itemCount = 3) {
  const Harness = defineComponent({
    setup() {
      return () =>
        h(SnTabbar, props, {
          default: () =>
            Array.from({ length: itemCount }, (_, i) => h(SnTabbarItem, { title: `Tab ${i}` })),
        });
    },
  });
  return mount(Harness);
}

describe('sn-tabbar', () => {
  describe('v-model', () => {
    it('marks the item matching modelValue as active', () => {
      const wrapper = mountBar({ modelValue: 1 });
      const items = wrapper.findAll('.sn-tabbar-item');
      expect(items[0]!.classes()).not.toContain('sn-tabbar-item--active');
      expect(items[1]!.classes()).toContain('sn-tabbar-item--active');
    });

    it('emits update:modelValue with the item index on tap', async () => {
      const wrapper = mountBar({ modelValue: 0 });
      await wrapper.findAll('.sn-tabbar-item')[2]!.trigger('tap');
      expect(wrapper.findComponent(SnTabbar).emitted('update:modelValue')?.at(-1)).toEqual([2]);
    });

    it('emits change with a { value } payload on tap', async () => {
      const wrapper = mountBar({ modelValue: 0 });
      await wrapper.findAll('.sn-tabbar-item')[1]!.trigger('tap');
      expect(wrapper.findComponent(SnTabbar).emitted('change')?.at(-1)).toEqual([{ value: 1 }]);
    });

    it('matches items by name when the name is given', async () => {
      const Harness = defineComponent({
        setup() {
          return () =>
            h(
              SnTabbar,
              { modelValue: 'home' },
              {
                default: () => [
                  h(SnTabbarItem, { title: 'Home', name: 'home' }),
                  h(SnTabbarItem, { title: 'Mine', name: 'mine' }),
                ],
              },
            );
        },
      });
      const wrapper = mount(Harness);
      const items = wrapper.findAll('.sn-tabbar-item');
      expect(items[0]!.classes()).toContain('sn-tabbar-item--active');
      await items[1]!.trigger('tap');
      expect(wrapper.findComponent(SnTabbar).emitted('update:modelValue')?.at(-1)).toEqual([
        'mine',
      ]);
    });

    it('works uncontrolled — tracks the selection internally', async () => {
      const wrapper = mountBar({}, 2);
      await wrapper.findAll('.sn-tabbar-item')[1]!.trigger('tap');
      await wrapper.vm.$nextTick();
      expect(wrapper.findAll('.sn-tabbar-item')[1]!.classes()).toContain('sn-tabbar-item--active');
    });

    it('follows a later modelValue change (controlled)', async () => {
      const value = ref(0);
      const Harness = defineComponent({
        setup() {
          return () =>
            h(
              SnTabbar,
              { modelValue: value.value },
              {
                default: () => [h(SnTabbarItem, { title: 'A' }), h(SnTabbarItem, { title: 'B' })],
              },
            );
        },
      });
      const wrapper = mount(Harness);
      value.value = 1;
      await wrapper.vm.$nextTick();
      expect(wrapper.findAll('.sn-tabbar-item')[1]!.classes()).toContain('sn-tabbar-item--active');
    });

    it('does not emit when the tapped item is already active', async () => {
      const wrapper = mountBar({ modelValue: 0 });
      await wrapper.findAll('.sn-tabbar-item')[0]!.trigger('tap');
      expect(wrapper.findComponent(SnTabbar).emitted('update:modelValue')).toBeUndefined();
    });
  });

  describe('beforeChange', () => {
    it('commits when beforeChange resolves true', async () => {
      const beforeChange = vi.fn(() => true);
      const wrapper = mountBar({ modelValue: 0, beforeChange });
      await wrapper.findAll('.sn-tabbar-item')[1]!.trigger('tap');
      await vi.waitFor(() => {
        expect(wrapper.findComponent(SnTabbar).emitted('update:modelValue')?.at(-1)).toEqual([1]);
      });
      expect(beforeChange).toHaveBeenCalledWith(1);
    });

    it('does not commit when beforeChange resolves false', async () => {
      const beforeChange = vi.fn(async () => false);
      const wrapper = mountBar({ modelValue: 0, beforeChange });
      await wrapper.findAll('.sn-tabbar-item')[1]!.trigger('tap');
      await vi.waitFor(() => expect(beforeChange).toHaveBeenCalled());
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(SnTabbar).emitted('update:modelValue')).toBeUndefined();
    });

    it('does not commit when beforeChange rejects', async () => {
      const beforeChange = vi.fn(async () => {
        throw new Error('denied');
      });
      const wrapper = mountBar({ modelValue: 0, beforeChange });
      await wrapper.findAll('.sn-tabbar-item')[1]!.trigger('tap');
      await vi.waitFor(() => expect(beforeChange).toHaveBeenCalled());
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(SnTabbar).emitted('update:modelValue')).toBeUndefined();
    });
  });

  describe('layout', () => {
    it('adds the fixed / bordered / safe-area classes', () => {
      const wrapper = mountBar({ fixed: true, bordered: true, safeAreaInsetBottom: true });
      const bar = wrapper.find('.sn-tabbar');
      expect(bar.classes()).toContain('sn-tabbar--fixed');
      expect(bar.classes()).toContain('sn-tabbar--bordered');
      expect(bar.classes()).toContain('sn-tabbar--safe-area');
    });

    it('writes z-index only when fixed', () => {
      expect(
        mountBar({ fixed: true, zIndex: 30 }).find('.sn-tabbar').attributes('style'),
      ).toContain('z-index: 30');
      expect(mountBar({ zIndex: 30 }).find('.sn-tabbar').attributes('style')).toBeUndefined();
    });

    it('renders the placeholder only when fixed and placeholder are both on', () => {
      expect(
        mountBar({ fixed: true, placeholder: true }).find('.sn-tabbar__placeholder').exists(),
      ).toBe(true);
      expect(mountBar({ placeholder: true }).find('.sn-tabbar__placeholder').exists()).toBe(false);
    });

    it('adds the round shape class on the bar and its items', () => {
      const wrapper = mountBar({ shape: 'round' });
      expect(wrapper.find('.sn-tabbar').classes()).toContain('sn-tabbar--round');
      expect(wrapper.find('.sn-tabbar-item').classes()).toContain('sn-tabbar-item--round');
    });

    it('forwards customClass and customStyle', () => {
      const wrapper = mountBar({ customClass: 'my-bar', customStyle: 'margin: 6px;' });
      expect(wrapper.find('.sn-tabbar').classes()).toContain('my-bar');
      expect(wrapper.find('.sn-tabbar').attributes('style')).toContain('margin: 6px');
    });
  });

  describe('accessibility', () => {
    it('exposes role="tablist" on the bar', () => {
      expect(mountBar().find('.sn-tabbar').attributes('role')).toBe('tablist');
    });

    it('exposes role="tab" and aria-selected on each item', () => {
      const items = mountBar({ modelValue: 1 }).findAll('.sn-tabbar-item');
      expect(items[0]!.attributes('role')).toBe('tab');
      expect(items[0]!.attributes('aria-selected')).toBe('false');
      expect(items[1]!.attributes('aria-selected')).toBe('true');
    });
  });
});

describe('sn-tabbar-item', () => {
  it('renders the title', () => {
    const wrapper = mountBar({}, 1);
    expect(wrapper.find('.sn-tabbar-item__title').text()).toBe('Tab 0');
  });

  it('renders the numeric badge value', () => {
    const Harness = defineComponent({
      setup() {
        return () =>
          h(
            SnTabbar,
            {},
            {
              default: () => [h(SnTabbarItem, { title: 'A', value: 8 })],
            },
          );
      },
    });
    const wrapper = mount(Harness);
    expect(wrapper.find('.sn-tabbar-item__badge-text').text()).toBe('8');
  });

  it('caps the badge at max', () => {
    const Harness = defineComponent({
      setup() {
        return () =>
          h(
            SnTabbar,
            {},
            {
              default: () => [h(SnTabbarItem, { title: 'A', value: 120, max: 99 })],
            },
          );
      },
    });
    expect(mount(Harness).find('.sn-tabbar-item__badge-text').text()).toBe('99+');
  });

  it('renders a text-less dot badge when isDot is on', () => {
    const Harness = defineComponent({
      setup() {
        return () =>
          h(
            SnTabbar,
            {},
            {
              default: () => [h(SnTabbarItem, { title: 'A', isDot: true })],
            },
          );
      },
    });
    const wrapper = mount(Harness);
    expect(wrapper.find('.sn-tabbar-item__badge--dot').exists()).toBe(true);
    expect(wrapper.find('.sn-tabbar-item__badge-text').exists()).toBe(false);
  });

  it('renders no badge without a value', () => {
    const wrapper = mountBar({}, 1);
    expect(wrapper.find('.sn-tabbar-item__badge').exists()).toBe(false);
  });

  it('renders a registry-resolved icon', async () => {
    const { registerSnIcons, clearSnIcons } = await import('../sn-icon/sn-icon-registry');
    const { Home } = await import('../sn-icon/sn-icon-set');
    registerSnIcons({ Home });
    const Harness = defineComponent({
      setup() {
        return () =>
          h(
            SnTabbar,
            {},
            {
              default: () => [h(SnTabbarItem, { title: 'A', icon: 'Home' })],
            },
          );
      },
    });
    const wrapper = mount(Harness);
    expect(wrapper.find('.sn-tabbar-item__icon .sn-icon').exists()).toBe(true);
    clearSnIcons();
  });

  it('renders a font icon when cssIcon is on', () => {
    const Harness = defineComponent({
      setup() {
        return () =>
          h(
            SnTabbar,
            {},
            {
              default: () => [
                h(SnTabbarItem, { title: 'A', icon: 'home', iconPrefix: 'sn', cssIcon: true }),
              ],
            },
          );
      },
    });
    const wrapper = mount(Harness);
    expect(wrapper.find('.sn-tabbar-item__css-icon').classes()).toContain('sn-home');
  });

  it('applies the bar activeColor inline on the active item only', () => {
    const wrapper = mountBar({ modelValue: 0, activeColor: 'rgb(1, 2, 3)' });
    const items = wrapper.findAll('.sn-tabbar-item');
    expect(items[0]!.find('.sn-tabbar-item__title').attributes('style')).toContain(
      'color: rgb(1, 2, 3)',
    );
    expect(items[1]!.find('.sn-tabbar-item__title').attributes('style')).toBeUndefined();
  });

  it('exposes the active flag through the default slot scope', () => {
    const Harness = defineComponent({
      setup() {
        return () =>
          h(
            SnTabbar,
            { modelValue: 0 },
            {
              default: () => [
                h(
                  SnTabbarItem,
                  { title: 'A' },
                  {
                    default: ({ active }: { active: boolean }) =>
                      h('text', { class: 'slot-flag' }, String(active)),
                  },
                ),
              ],
            },
          );
      },
    });
    expect(mount(Harness).find('.slot-flag').text()).toBe('true');
  });

  it('is inert when mounted outside a bar', async () => {
    const wrapper = mount(SnTabbarItem, { props: { title: 'orphan' } });
    await wrapper.trigger('tap');
    expect(wrapper.classes()).not.toContain('sn-tabbar-item--active');
  });

  describe('sn-tabbar extras', () => {
    it('commits a selection through the exposed select() method', async () => {
      const wrapper = mountBar({ modelValue: 0 });
      const bar = wrapper.findComponent(SnTabbar).vm as unknown as {
        select: (value: number) => Promise<void>;
      };
      await bar.select(2);
      expect(wrapper.findComponent(SnTabbar).emitted('update:modelValue')?.at(-1)).toEqual([2]);
      await wrapper.vm.$nextTick();
      expect(wrapper.findAll('.sn-tabbar-item')[2]!.classes()).toContain('sn-tabbar-item--active');
    });

    it('does not commit when a sync beforeChange returns false', async () => {
      const beforeChange = vi.fn(() => false);
      const wrapper = mountBar({ modelValue: 0, beforeChange });
      await wrapper.findAll('.sn-tabbar-item')[1]!.trigger('tap');
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(SnTabbar).emitted('update:modelValue')).toBeUndefined();
    });

    it('marks the placeholder as decorative', () => {
      const wrapper = mountBar({ fixed: true, placeholder: true });
      expect(wrapper.find('.sn-tabbar__placeholder').attributes('aria-hidden')).toBe('true');
    });

    it('applies inactiveColor to non-active item titles', () => {
      const wrapper = mountBar({ modelValue: 0, inactiveColor: 'rgb(7, 8, 9)' });
      const items = wrapper.findAll('.sn-tabbar-item');
      expect(items[0]!.find('.sn-tabbar-item__title').attributes('style')).toBeUndefined();
      expect(items[1]!.find('.sn-tabbar-item__title').attributes('style')).toContain(
        'color: rgb(7, 8, 9)',
      );
    });

    it('applies activeColor over inactiveColor per item state', () => {
      const wrapper = mountBar({
        modelValue: 0,
        activeColor: 'rgb(1, 2, 3)',
        inactiveColor: 'rgb(7, 8, 9)',
      });
      const titles = wrapper.findAll('.sn-tabbar-item__title');
      expect(titles[0]!.attributes('style')).toContain('color: rgb(1, 2, 3)');
      expect(titles[1]!.attributes('style')).toContain('color: rgb(7, 8, 9)');
    });
  });
});

describe('sn-tabbar-item extras', () => {
  it('renders a string badge verbatim', () => {
    const Harness = defineComponent({
      setup() {
        return () =>
          h(
            SnTabbar,
            {},
            {
              default: () => [h(SnTabbarItem, { title: 'A', value: 'New' })],
            },
          );
      },
    });
    expect(mount(Harness).find('.sn-tabbar-item__badge-text').text()).toBe('New');
  });

  it('replaces the whole item through the default slot and the icon slot scope', () => {
    const Harness = defineComponent({
      setup() {
        return () =>
          h(
            SnTabbar,
            { modelValue: 0 },
            {
              default: () => [
                h(
                  SnTabbarItem,
                  { title: 'A', icon: 'Home' },
                  {
                    icon: ({ active }: { active: boolean }) =>
                      h('text', { class: 'slot-icon' }, String(active)),
                  },
                ),
              ],
            },
          );
      },
    });
    const wrapper = mount(Harness);
    expect(wrapper.find('.slot-icon').text()).toBe('true');
    expect(wrapper.find('.sn-tabbar-item__icon .sn-icon').exists()).toBe(false);
  });

  it('forwards customClass on the item', () => {
    const Harness = defineComponent({
      setup() {
        return () =>
          h(
            SnTabbar,
            {},
            {
              default: () => [h(SnTabbarItem, { title: 'A', customClass: 'my-item' })],
            },
          );
      },
    });
    expect(mount(Harness).find('.sn-tabbar-item').classes()).toContain('my-item');
  });
});
