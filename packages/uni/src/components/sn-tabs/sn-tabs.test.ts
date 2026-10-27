/**
 * sn-tabs / sn-tab unit tests — uni-end tab navigation.
 *
 * Behaviour only (AGENTS.md §46): the v-model contract, name-vs-index
 * resolution, the disabled guard, the lazy pane latch and the tablist / tab
 * roles. No rpx numbers in assertions — happy-dom discards lengths it cannot
 * parse.
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import SnTabs from './sn-tabs.vue';
import SnTab from './sn-tab.vue';

/** Harness: a container with N named panes; returns the mount wrapper. */
function mountTabs(props: Record<string, unknown> = {}, panes = 3) {
  const Harness = defineComponent({
    setup() {
      return () =>
        h(SnTabs, props, {
          default: () =>
            Array.from({ length: panes }, (_, i) =>
              h(SnTab, { title: `Pane ${i}`, name: i }, { default: () => `body ${i}` }),
            ),
        });
    },
  });
  return mount(Harness);
}

describe('sn-tabs', () => {
  describe('press feedback (hover-class)', () => {
    it('wires the pressed class on enabled items', async () => {
      const wrapper = mountTabs();
      await wrapper.vm.$nextTick();
      for (const item of wrapper.findAll('.sn-tabs__item')) {
        expect(item.attributes('hover-class')).toBe('sn-tabs__item--pressed');
      }
    });

    it('keeps disabled items inert', async () => {
      const Harness = defineComponent({
        setup() {
          return () => h(SnTabs, {}, { default: () => [h(SnTab, { title: 'A', disabled: true })] });
        },
      });
      const wrapper = mount(Harness);
      await wrapper.vm.$nextTick();
      expect(wrapper.find('.sn-tabs__item').attributes('hover-class')).toBe('none');
    });
  });

  describe('nav strip', () => {
    it('renders one nav item per pane title', async () => {
      const wrapper = mountTabs();
      await wrapper.vm.$nextTick();
      const items = wrapper.findAll('.sn-tabs__item');
      expect(items).toHaveLength(3);
      expect(items[0]!.text()).toContain('Pane 0');
    });

    it('marks the active item by modelValue', async () => {
      const wrapper = mountTabs({ modelValue: 1 });
      await wrapper.vm.$nextTick();
      const items = wrapper.findAll('.sn-tabs__item');
      expect(items[0]!.classes()).not.toContain('sn-tabs__item--active');
      expect(items[1]!.classes()).toContain('sn-tabs__item--active');
    });

    it('renders the active bar only on the active item', async () => {
      const wrapper = mountTabs({ modelValue: 0 });
      await wrapper.vm.$nextTick();
      const items = wrapper.findAll('.sn-tabs__item');
      expect(items[0]!.find('.sn-tabs__line').exists()).toBe(true);
      expect(items[1]!.find('.sn-tabs__line').exists()).toBe(false);
    });

    it('resolves the active item by name', async () => {
      const Harness = defineComponent({
        setup() {
          return () =>
            h(
              SnTabs,
              { modelValue: 'b' },
              {
                default: () => [
                  h(SnTab, { title: 'A', name: 'a' }),
                  h(SnTab, { title: 'B', name: 'b' }),
                ],
              },
            );
        },
      });
      const wrapper = mount(Harness);
      await wrapper.vm.$nextTick();
      expect(wrapper.findAll('.sn-tabs__item')[1]!.classes()).toContain('sn-tabs__item--active');
    });

    it('applies the line theme class', () => {
      const wrapper = mountTabs({ lineTheme: 'dot' });
      expect(wrapper.find('.sn-tabs').classes()).toContain('sn-tabs--line-dot');
    });

    it('writes the line width / height as px', async () => {
      const wrapper = mountTabs({ modelValue: 0, lineWidth: 40, lineHeight: 4 });
      await wrapper.vm.$nextTick();
      const style = wrapper.find('.sn-tabs__line').attributes('style');
      expect(style).toContain('width: 40px');
      expect(style).toContain('height: 4px');
    });

    it('adds the sticky class and offsetTop only when sticky', () => {
      const sticky = mountTabs({ sticky: true, offsetTop: 44 });
      expect(sticky.find('.sn-tabs__nav').classes()).toContain('sn-tabs__nav--sticky');
      expect(sticky.find('.sn-tabs__nav').attributes('style')).toContain('top: 44px');
      expect(
        mountTabs({ offsetTop: 44 }).find('.sn-tabs__nav').attributes('style'),
      ).toBeUndefined();
    });

    it('marks the strip scrollable when slidable is always', () => {
      expect(mountTabs({ slidable: 'always' }).find('.sn-tabs').classes()).toContain(
        'sn-tabs--scrollable',
      );
    });

    it('marks the strip scrollable past slidableNum', async () => {
      const wrapper = mountTabs({ slidableNum: 2 }, 3);
      await wrapper.vm.$nextTick();
      expect(wrapper.find('.sn-tabs').classes()).toContain('sn-tabs--scrollable');
    });

    it('forwards customClass and customStyle', () => {
      const wrapper = mountTabs({ customClass: 'my-tabs', customStyle: 'margin: 8px;' });
      expect(wrapper.find('.sn-tabs').classes()).toContain('my-tabs');
      expect(wrapper.find('.sn-tabs').attributes('style')).toContain('margin: 8px');
    });
  });

  describe('selection', () => {
    it('emits update:modelValue with the pane index on tap', async () => {
      const wrapper = mountTabs({ modelValue: 0 });
      await wrapper.vm.$nextTick();
      await wrapper.findAll('.sn-tabs__item')[2]!.trigger('tap');
      expect(wrapper.findComponent(SnTabs).emitted('update:modelValue')?.at(-1)).toEqual([2]);
    });

    it('emits change with { index, name } on tap', async () => {
      const wrapper = mountTabs({ modelValue: 0 });
      await wrapper.vm.$nextTick();
      await wrapper.findAll('.sn-tabs__item')[1]!.trigger('tap');
      expect(wrapper.findComponent(SnTabs).emitted('change')?.at(-1)).toEqual([
        { index: 1, name: 1 },
      ]);
    });

    it('emits click for every tap, active or not', async () => {
      const wrapper = mountTabs({ modelValue: 0 });
      await wrapper.vm.$nextTick();
      await wrapper.findAll('.sn-tabs__item')[0]!.trigger('tap');
      expect(wrapper.findComponent(SnTabs).emitted('click')).toHaveLength(1);
      expect(wrapper.findComponent(SnTabs).emitted('update:modelValue')).toBeUndefined();
    });

    it('works uncontrolled', async () => {
      const wrapper = mountTabs({}, 2);
      await wrapper.vm.$nextTick();
      await wrapper.findAll('.sn-tabs__item')[1]!.trigger('tap');
      await wrapper.vm.$nextTick();
      expect(wrapper.findAll('.sn-tabs__item')[1]!.classes()).toContain('sn-tabs__item--active');
    });

    it('follows a later modelValue change (controlled)', async () => {
      const value = ref(0);
      const Harness = defineComponent({
        setup() {
          return () =>
            h(
              SnTabs,
              { modelValue: value.value },
              {
                default: () => [h(SnTab, { title: 'A' }), h(SnTab, { title: 'B' })],
              },
            );
        },
      });
      const wrapper = mount(Harness);
      await wrapper.vm.$nextTick();
      value.value = 1;
      await wrapper.vm.$nextTick();
      expect(wrapper.findAll('.sn-tabs__item')[1]!.classes()).toContain('sn-tabs__item--active');
    });
  });

  describe('disabled panes', () => {
    it('emits disabled instead of changing selection', async () => {
      const Harness = defineComponent({
        setup() {
          return () =>
            h(
              SnTabs,
              { modelValue: 0 },
              {
                default: () => [h(SnTab, { title: 'A' }), h(SnTab, { title: 'B', disabled: true })],
              },
            );
        },
      });
      const wrapper = mount(Harness);
      await wrapper.vm.$nextTick();
      await wrapper.findAll('.sn-tabs__item')[1]!.trigger('tap');
      expect(wrapper.findComponent(SnTabs).emitted('disabled')).toHaveLength(1);
      expect(wrapper.findComponent(SnTabs).emitted('update:modelValue')).toBeUndefined();
    });

    it('marks the disabled item with aria-disabled', async () => {
      const Harness = defineComponent({
        setup() {
          return () =>
            h(
              SnTabs,
              {},
              {
                default: () => [h(SnTab, { title: 'A', disabled: true })],
              },
            );
        },
      });
      const wrapper = mount(Harness);
      await wrapper.vm.$nextTick();
      expect(wrapper.find('.sn-tabs__item').attributes('aria-disabled')).toBe('true');
    });
  });

  describe('accessibility', () => {
    it('exposes role="tablist" on the strip', () => {
      expect(mountTabs().find('.sn-tabs__nav').attributes('role')).toBe('tablist');
    });

    it('exposes role="tab" and aria-selected on each item', async () => {
      const wrapper = mountTabs({ modelValue: 1 });
      await wrapper.vm.$nextTick();
      const items = wrapper.findAll('.sn-tabs__item');
      expect(items[0]!.attributes('role')).toBe('tab');
      expect(items[0]!.attributes('aria-selected')).toBe('false');
      expect(items[1]!.attributes('aria-selected')).toBe('true');
    });

    it('exposes role="tabpanel" on each pane', async () => {
      const wrapper = mountTabs({ modelValue: 0 });
      await wrapper.vm.$nextTick();
      expect(wrapper.find('.sn-tab').attributes('role')).toBe('tabpanel');
    });
  });
});

describe('sn-tab', () => {
  it('shows only the active pane content', async () => {
    const wrapper = mountTabs({ modelValue: 0 });
    await wrapper.vm.$nextTick();
    const panes = wrapper.findAll('.sn-tab');
    expect(panes[0]!.text()).toContain('body 0');
    expect(panes[1]!.attributes('style')).toContain('display: none');
  });

  it('lazily defers inactive pane content until first activation', async () => {
    const value = ref(0);
    const Harness = defineComponent({
      setup() {
        return () =>
          h(
            SnTabs,
            { modelValue: value.value },
            {
              default: () => [
                h(SnTab, { title: 'A' }, { default: () => 'first' }),
                h(SnTab, { title: 'B' }, { default: () => 'second' }),
              ],
            },
          );
      },
    });
    const wrapper = mount(Harness);
    await wrapper.vm.$nextTick();
    const panes = wrapper.findAll('.sn-tab');
    expect(panes[1]!.text()).toBe('');
    value.value = 1;
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('.sn-tab')[1]!.text()).toBe('second');
  });

  it('renders all pane content when lazy is off', async () => {
    const Harness = defineComponent({
      setup() {
        return () =>
          h(
            SnTabs,
            { modelValue: 0 },
            {
              default: () => [
                h(SnTab, { title: 'A', lazy: false }, { default: () => 'first' }),
                h(SnTab, { title: 'B', lazy: false }, { default: () => 'second' }),
              ],
            },
          );
      },
    });
    const wrapper = mount(Harness);
    await wrapper.vm.$nextTick();
    const panes = wrapper.findAll('.sn-tab');
    expect(panes[0]!.text()).toBe('first');
    expect(panes[1]!.text()).toBe('second');
  });

  it('forwards customClass on the pane', async () => {
    const Harness = defineComponent({
      setup() {
        return () =>
          h(
            SnTabs,
            {},
            {
              default: () => [h(SnTab, { title: 'A', customClass: 'my-pane' })],
            },
          );
      },
    });
    const wrapper = mount(Harness);
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.sn-tab').classes()).toContain('my-pane');
  });
});

describe('sn-tabs swipeable', () => {
  /** Mount a tabs body primed for swipe tests. */
  function mountSwipeable(props: Record<string, unknown> = {}) {
    const Harness = defineComponent({
      setup() {
        return () =>
          h(
            SnTabs,
            { modelValue: 1, ...props },
            {
              default: () => [
                h(SnTab, { title: 'A' }),
                h(SnTab, { title: 'B' }),
                h(SnTab, { title: 'C' }),
              ],
            },
          );
      },
    });
    return mount(Harness);
  }

  it('advances to the next pane on a left swipe past the threshold', async () => {
    const wrapper = mountSwipeable({ swipeable: true });
    const body = wrapper.find('.sn-tabs__body');
    await body.trigger('touchstart', { touches: [{ clientX: 200 }] });
    await body.trigger('touchend', { changedTouches: [{ clientX: 140 }] });
    expect(wrapper.findComponent(SnTabs).emitted('update:modelValue')?.at(-1)).toEqual([2]);
  });

  it('steps back on a right swipe past the threshold', async () => {
    const wrapper = mountSwipeable({ swipeable: true });
    const body = wrapper.find('.sn-tabs__body');
    await body.trigger('touchstart', { touches: [{ clientX: 140 }] });
    await body.trigger('touchend', { changedTouches: [{ clientX: 200 }] });
    expect(wrapper.findComponent(SnTabs).emitted('update:modelValue')?.at(-1)).toEqual([0]);
  });

  it('ignores a swipe shorter than the threshold', async () => {
    const wrapper = mountSwipeable({ swipeable: true });
    const body = wrapper.find('.sn-tabs__body');
    await body.trigger('touchstart', { touches: [{ clientX: 200 }] });
    await body.trigger('touchend', { changedTouches: [{ clientX: 180 }] });
    expect(wrapper.findComponent(SnTabs).emitted('update:modelValue')).toBeUndefined();
  });

  it('ignores swipes while swipeable is off', async () => {
    const wrapper = mountSwipeable();
    const body = wrapper.find('.sn-tabs__body');
    await body.trigger('touchstart', { touches: [{ clientX: 200 }] });
    await body.trigger('touchend', { changedTouches: [{ clientX: 100 }] });
    expect(wrapper.findComponent(SnTabs).emitted('update:modelValue')).toBeUndefined();
  });

  it('does not swipe past the first pane', async () => {
    const wrapper = mountSwipeable({ swipeable: true, modelValue: 0 });
    const body = wrapper.find('.sn-tabs__body');
    await body.trigger('touchstart', { touches: [{ clientX: 200 }] });
    await body.trigger('touchend', { changedTouches: [{ clientX: 300 }] });
    expect(wrapper.findComponent(SnTabs).emitted('update:modelValue')).toBeUndefined();
  });

  it('does not swipe past the last pane', async () => {
    const wrapper = mountSwipeable({ swipeable: true, modelValue: 2 });
    const body = wrapper.find('.sn-tabs__body');
    await body.trigger('touchstart', { touches: [{ clientX: 200 }] });
    await body.trigger('touchend', { changedTouches: [{ clientX: 100 }] });
    expect(wrapper.findComponent(SnTabs).emitted('update:modelValue')).toBeUndefined();
  });
});

describe('sn-tabs extras', () => {
  it('applies color to the active title and inactiveColor to the rest', async () => {
    const Harness = defineComponent({
      setup() {
        return () =>
          h(
            SnTabs,
            { modelValue: 0, color: 'rgb(1, 2, 3)', inactiveColor: 'rgb(4, 5, 6)' },
            {
              default: () => [h(SnTab, { title: 'A' }), h(SnTab, { title: 'B' })],
            },
          );
      },
    });
    const wrapper = mount(Harness);
    await wrapper.vm.$nextTick();
    const titles = wrapper.findAll('.sn-tabs__title');
    expect(titles[0]!.attributes('style')).toContain('color: rgb(1, 2, 3)');
    expect(titles[1]!.attributes('style')).toContain('color: rgb(4, 5, 6)');
  });

  it('writes the animation duration CSS var only when animated', () => {
    const animated = mountTabs({ animated: true, duration: 450 });
    expect(animated.find('.sn-tabs').classes()).toContain('sn-tabs--animated');
    expect(animated.find('.sn-tabs').attributes('style')).toContain('--snui-tabs-duration: 450ms');
    expect(mountTabs({ duration: 450 }).find('.sn-tabs').attributes('style')).toBeUndefined();
  });

  it('forwards showScrollbar onto the nav strip', () => {
    expect(
      mountTabs({ showScrollbar: true }).find('.sn-tabs__nav').attributes('show-scrollbar'),
    ).toBe('true');
    expect(mountTabs().find('.sn-tabs__nav').attributes('show-scrollbar')).toBe('false');
  });

  it('labels each nav item with its title', async () => {
    const wrapper = mountTabs();
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('.sn-tabs__item')[1]!.attributes('aria-label')).toBe('Pane 1');
  });

  it('emits change with the string name of a named pane', async () => {
    const Harness = defineComponent({
      setup() {
        return () =>
          h(
            SnTabs,
            { modelValue: 'a' },
            {
              default: () => [
                h(SnTab, { title: 'A', name: 'a' }),
                h(SnTab, { title: 'B', name: 'b' }),
              ],
            },
          );
      },
    });
    const wrapper = mount(Harness);
    await wrapper.vm.$nextTick();
    await wrapper.findAll('.sn-tabs__item')[1]!.trigger('tap');
    expect(wrapper.findComponent(SnTabs).emitted('change')?.at(-1)).toEqual([
      { index: 1, name: 'b' },
    ]);
    expect(wrapper.findComponent(SnTabs).emitted('update:modelValue')?.at(-1)).toEqual(['b']);
  });

  it('does not emit click for a disabled pane tap', async () => {
    const Harness = defineComponent({
      setup() {
        return () =>
          h(
            SnTabs,
            { modelValue: 0 },
            {
              default: () => [h(SnTab, { title: 'A' }), h(SnTab, { title: 'B', disabled: true })],
            },
          );
      },
    });
    const wrapper = mount(Harness);
    await wrapper.vm.$nextTick();
    await wrapper.findAll('.sn-tabs__item')[1]!.trigger('tap');
    expect(wrapper.findComponent(SnTabs).emitted('disabled')?.[0]).toEqual([
      { index: 1, name: undefined },
    ]);
    expect(wrapper.findComponent(SnTabs).emitted('click')).toBeUndefined();
  });

  it('drives the selection through the exposed setActive', async () => {
    const wrapper = mountTabs();
    await wrapper.vm.$nextTick();
    const vm = wrapper.findComponent(SnTabs).vm as unknown as {
      setActive: (value: number) => void;
      activeIndex: number;
    };
    vm.setActive(2);
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('.sn-tabs__item')[2]!.classes()).toContain('sn-tabs__item--active');
    expect(vm.activeIndex).toBe(2);
  });

  it('keeps a lazily rendered pane mounted but hidden after switching away', async () => {
    const value = ref(0);
    const Harness = defineComponent({
      setup() {
        return () =>
          h(
            SnTabs,
            { modelValue: value.value },
            {
              default: () => [
                h(SnTab, { title: 'A' }, { default: () => 'first' }),
                h(SnTab, { title: 'B' }, { default: () => 'second' }),
              ],
            },
          );
      },
    });
    const wrapper = mount(Harness);
    await wrapper.vm.$nextTick();
    value.value = 1;
    await wrapper.vm.$nextTick();
    value.value = 0;
    await wrapper.vm.$nextTick();
    const panes = wrapper.findAll('.sn-tab');
    expect(panes[1]!.text()).toBe('second');
    expect(panes[1]!.attributes('style')).toContain('display: none');
  });

  it('accepts the map parity props without side effects', async () => {
    const wrapper = mountTabs({ mapNum: 3, mapTitle: 'All tabs' });
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('.sn-tabs__item')).toHaveLength(3);
  });
});
