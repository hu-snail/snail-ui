/**
 * sn-tabs / sn-tab unit tests — uni-end tab navigation.
 *
 * Behaviour only (AGENTS.md §46): the v-model contract, name-vs-index
 * resolution, the disabled guard, the lazy pane latch, the tablist / tab
 * roles, and the AUI-OPT-10 additions (nav forms, active emphasis,
 * scroll-into-view, nav icons, nav badges, the native swiper body).
 * No rpx numbers in assertions — happy-dom discards lengths it cannot parse.
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import SnTabs from './sn-tabs.vue';
import SnTab from './sn-tab.vue';
import type { IconData } from '../sn-icon/sn-icon.vue';

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

    it('binds the fixed modifier only while the strip is not scrollable', async () => {
      /* Equal-width items key off this class instead of
       * `:not(.sn-tabs--scrollable)` (§116.2 — App has no pseudo-classes). */
      const fixed = mountTabs({}, 2);
      await fixed.vm.$nextTick();
      expect(fixed.find('.sn-tabs').classes()).toContain('sn-tabs--fixed');
      expect(fixed.find('.sn-tabs').classes()).not.toContain('sn-tabs--scrollable');

      const scrollable = mountTabs({ slidable: 'always' }, 2);
      await scrollable.vm.$nextTick();
      expect(scrollable.find('.sn-tabs').classes()).toContain('sn-tabs--scrollable');
      expect(scrollable.find('.sn-tabs').classes()).not.toContain('sn-tabs--fixed');
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

describe('sn-tabs swipeable (native swiper body)', () => {
  /** Mount a tabs pair with a native swiper content area. */
  function mountSwipeable(
    props: Record<string, unknown> = {},
    panes: Array<Record<string, unknown>> = [{ title: 'A' }, { title: 'B' }, { title: 'C' }],
  ) {
    const Harness = defineComponent({
      setup() {
        return () =>
          h(
            SnTabs,
            { modelValue: 1, ...props },
            {
              default: () => panes.map((pane) => h(SnTab, pane)),
            },
          );
      },
    });
    return mount(Harness);
  }

  it('renders the body as a swiper only while swipeable', () => {
    expect(mountSwipeable({ swipeable: true }).find('swiper.sn-tabs__body').exists()).toBe(true);
    expect(mountSwipeable().find('swiper.sn-tabs__body').exists()).toBe(false);
  });

  it('renders every pane as a swiper-item, keeping the panes in the flow body otherwise', async () => {
    const swiper = mountSwipeable({ swipeable: true });
    await swiper.vm.$nextTick();
    expect(swiper.findAll('swiper-item')).toHaveLength(3);
    expect(swiper.findAll('swiper-item')[1]!.classes()).toContain('sn-tab');
    expect(swiper.find('.sn-tabs__body').element.tagName).toBe('SWIPER');

    const flow = mountSwipeable();
    await flow.vm.$nextTick();
    expect(flow.findAll('swiper-item')).toHaveLength(0);
    expect(flow.findAll('.sn-tab')).toHaveLength(3);
  });

  it('renders every slide eagerly in swiper mode (the gesture can reveal them)', async () => {
    const Harness = defineComponent({
      setup() {
        return () =>
          h(
            SnTabs,
            { modelValue: 0, swipeable: true },
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
    const slides = wrapper.findAll('swiper-item');
    expect(slides[0]!.text()).toBe('first');
    /* The lazy latch would leave the off-screen slide empty mid-drag. */
    expect(slides[1]!.text()).toBe('second');
  });

  it('drives the native swiper position from the active index', async () => {
    const wrapper = mountSwipeable({ swipeable: true, modelValue: 1 });
    await wrapper.vm.$nextTick();
    expect(wrapper.find('swiper.sn-tabs__body').attributes('current')).toBe('1');
  });

  it('commits the pane a swipe landed on', async () => {
    const wrapper = mountSwipeable({ swipeable: true, modelValue: 1 });
    await wrapper.vm.$nextTick();
    await wrapper.find('swiper.sn-tabs__body').trigger('change', { detail: { current: 2 } });
    expect(wrapper.findComponent(SnTabs).emitted('update:modelValue')?.at(-1)).toEqual([2]);
    expect(wrapper.findComponent(SnTabs).emitted('change')?.at(-1)).toEqual([
      { index: 2, name: undefined },
    ]);
  });

  it('ignores a swipe that landed on the current pane', async () => {
    const wrapper = mountSwipeable({ swipeable: true, modelValue: 1 });
    await wrapper.vm.$nextTick();
    await wrapper.find('swiper.sn-tabs__body').trigger('change', { detail: { current: 1 } });
    expect(wrapper.findComponent(SnTabs).emitted('update:modelValue')).toBeUndefined();
  });

  it('ignores a swipe that landed on an unknown pane index', async () => {
    const wrapper = mountSwipeable({ swipeable: true, modelValue: 1 });
    await wrapper.vm.$nextTick();
    await wrapper.find('swiper.sn-tabs__body').trigger('change', { detail: { current: 9 } });
    expect(wrapper.findComponent(SnTabs).emitted('update:modelValue')).toBeUndefined();
  });

  it('snaps back off a disabled pane instead of committing it', async () => {
    const wrapper = mountSwipeable({ swipeable: true, modelValue: 1 }, [
      { title: 'A' },
      { title: 'B' },
      { title: 'C', disabled: true },
    ]);
    await wrapper.vm.$nextTick();
    await wrapper.find('swiper.sn-tabs__body').trigger('change', { detail: { current: 2 } });
    expect(wrapper.findComponent(SnTabs).emitted('update:modelValue')).toBeUndefined();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wrapper.find('swiper.sn-tabs__body').attributes('current')).toBe('1');
  });

  it('forwards duration and the named easing to the swiper', async () => {
    const wrapper = mountSwipeable({
      swipeable: true,
      duration: 600,
      swiperEasing: 'easeInOutCubic',
    });
    await wrapper.vm.$nextTick();
    const swiper = wrapper.find('swiper.sn-tabs__body');
    expect(swiper.attributes('duration')).toBe('600');
    expect(swiper.attributes('easing-function')).toBe('easeInOutCubic');
  });

  it('leaves easing-function unset for the default easing', () => {
    const wrapper = mountSwipeable({ swipeable: true, swiperEasing: 'default' });
    expect(wrapper.find('swiper.sn-tabs__body').attributes('easing-function')).toBeUndefined();
  });

  it('sizes the swiper from swiperHeight (numbers are px, strings verbatim)', () => {
    expect(
      mountSwipeable({ swipeable: true, swiperHeight: 320 })
        .find('swiper.sn-tabs__body')
        .attributes('style'),
    ).toContain('height: 320px');
    /* A string is forwarded verbatim (`rpx` would be dropped by the DOM style
     * parser under happy-dom, so the verbatim case uses a CSS length it keeps). */
    expect(
      mountSwipeable({ swipeable: true, swiperHeight: '50vh' })
        .find('swiper.sn-tabs__body')
        .attributes('style'),
    ).toContain('height: 50vh');
    expect(
      mountSwipeable({ swipeable: true }).find('swiper.sn-tabs__body').attributes('style'),
    ).toBeUndefined();
  });

  it('keeps the flow body free of the active display modifier', async () => {
    const flow = mountSwipeable({ modelValue: 1 });
    await flow.vm.$nextTick();
    expect(flow.findAll('.sn-tab')[1]!.classes()).toContain('sn-tab--active');
    expect(flow.findAll('.sn-tab')[0]!.attributes('style')).toContain('display: none');
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

describe('sn-tabs nav forms (type) and active emphasis (activeTheme)', () => {
  it('marks the card form on the strip and on every item', async () => {
    const wrapper = mountTabs({ type: 'card', modelValue: 0 });
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.sn-tabs__nav-inner').classes()).toContain('sn-tabs__nav-inner--card');
    for (const item of wrapper.findAll('.sn-tabs__item')) {
      expect(item.classes()).toContain('sn-tabs__item--card');
    }
  });

  it('marks the tag form on the strip and on every item', async () => {
    const wrapper = mountTabs({ type: 'tag', modelValue: 0 });
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.sn-tabs__nav-inner').classes()).toContain('sn-tabs__nav-inner--tag');
    expect(wrapper.findAll('.sn-tabs__item')[0]!.classes()).toContain('sn-tabs__item--tag');
  });

  it('leaves the strip unmarked for the default line form', async () => {
    const wrapper = mountTabs({ modelValue: 0 });
    await wrapper.vm.$nextTick();
    const navClasses = wrapper.find('.sn-tabs__nav-inner').classes();
    expect(navClasses).not.toContain('sn-tabs__nav-inner--card');
    expect(navClasses).not.toContain('sn-tabs__nav-inner--tag');
    expect(wrapper.findAll('.sn-tabs__item')[0]!.classes()).not.toContain('sn-tabs__item--card');
  });

  it('adds the fill emphasis to the active item only', async () => {
    const wrapper = mountTabs({ activeTheme: 'fill', modelValue: 1 });
    await wrapper.vm.$nextTick();
    const items = wrapper.findAll('.sn-tabs__item');
    expect(items[1]!.classes()).toContain('sn-tabs__item--fill');
    expect(items[0]!.classes()).not.toContain('sn-tabs__item--fill');
  });

  it('adds the pill emphasis to the active item only', async () => {
    const wrapper = mountTabs({ activeTheme: 'pill', type: 'tag', modelValue: 2 });
    await wrapper.vm.$nextTick();
    const items = wrapper.findAll('.sn-tabs__item');
    expect(items[2]!.classes()).toContain('sn-tabs__item--pill');
    expect(items[2]!.classes()).toContain('sn-tabs__item--tag');
    expect(items[0]!.classes()).not.toContain('sn-tabs__item--pill');
  });

  it('keeps the disabled pane free of the active emphasis', async () => {
    const Harness = defineComponent({
      setup() {
        return () =>
          h(
            SnTabs,
            { modelValue: 1, activeTheme: 'pill' },
            {
              default: () => [h(SnTab, { title: 'A' }), h(SnTab, { title: 'B', disabled: true })],
            },
          );
      },
    });
    const wrapper = mount(Harness);
    await wrapper.vm.$nextTick();
    const item = wrapper.findAll('.sn-tabs__item')[1]!;
    expect(item.classes()).toContain('sn-tabs__item--active');
    expect(item.classes()).toContain('sn-tabs__item--disabled');
    expect(item.classes()).not.toContain('sn-tabs__item--pill');
  });

  it('inverts the label colour under the pill emphasis', async () => {
    /* App renders `<text>` without inheriting the item's colour, so the pill
     * has to set the inverted colour on the label itself (§116.2). */
    const wrapper = mountTabs({ activeTheme: 'pill', modelValue: 1 });
    await wrapper.vm.$nextTick();
    const titles = wrapper.findAll('.sn-tabs__title');
    expect(titles[1]!.attributes('style')).toContain('--sn-mp-color-text-on-primary');
    expect(titles[0]!.attributes('style')).toBeUndefined();
  });

  it('lets an explicit color override the pill inversion', async () => {
    const wrapper = mountTabs({
      activeTheme: 'pill',
      modelValue: 0,
      color: 'rgb(9, 9, 9)',
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('.sn-tabs__title')[0]!.attributes('style')).toContain(
      'color: rgb(9, 9, 9)',
    );
  });

  it('drops the bottom bar outside the line + text look', async () => {
    const tag = mountTabs({ type: 'tag', activeTheme: 'pill', modelValue: 0 });
    await tag.vm.$nextTick();
    expect(tag.find('.sn-tabs__line').exists()).toBe(false);

    const filled = mountTabs({ activeTheme: 'fill', modelValue: 0 });
    await filled.vm.$nextTick();
    expect(filled.find('.sn-tabs__line').exists()).toBe(false);

    const plain = mountTabs({ modelValue: 0 });
    await plain.vm.$nextTick();
    expect(plain.find('.sn-tabs__line').exists()).toBe(true);
  });
});

describe('sn-tabs nav scroll-into-view', () => {
  it('points the strip at the active item id', async () => {
    const wrapper = mountTabs({ modelValue: 1 });
    await wrapper.vm.$nextTick();
    const target = wrapper.findAll('.sn-tabs__item')[1]!.attributes('id');
    expect(target).toBeTruthy();
    expect(wrapper.find('.sn-tabs__nav').attributes('scroll-into-view')).toBe(target);
  });

  it('moves the target to the tapped item', async () => {
    const wrapper = mountTabs({ modelValue: 0 });
    await wrapper.vm.$nextTick();
    await wrapper.findAll('.sn-tabs__item')[2]!.trigger('tap');
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.sn-tabs__nav').attributes('scroll-into-view')).toBe(
      wrapper.findAll('.sn-tabs__item')[2]!.attributes('id'),
    );
  });

  it('animates the strip scroll only while animated', () => {
    expect(
      mountTabs({ animated: true }).find('.sn-tabs__nav').attributes('scroll-with-animation'),
    ).toBe('true');
    expect(mountTabs().find('.sn-tabs__nav').attributes('scroll-with-animation')).toBe('false');
  });

  it('leaves the target empty with no panes registered', () => {
    const Harness = defineComponent({
      setup() {
        return () => h(SnTabs, { modelValue: 0 });
      },
    });
    expect(mount(Harness).find('.sn-tabs__nav').attributes('scroll-into-view')).toBe('');
  });
});

describe('sn-tabs nav icons and badges', () => {
  /** A minimal IconData so the icon path stays off the network. */
  const STAR: IconData = { viewBox: '0 0 24 24', paths: ['M12 2 3 7l1 7 6 3 6-3 1-7z'] };

  /** Mount a single-pane container with the pane options under test. */
  function mountPane(paneProps: Record<string, unknown>) {
    const Harness = defineComponent({
      setup() {
        return () =>
          h(SnTabs, { modelValue: 0 }, { default: () => [h(SnTab, { title: 'A', ...paneProps })] });
      },
    });
    return mount(Harness);
  }

  it('renders the pane icon inside the nav item', async () => {
    const wrapper = mountPane({ icon: STAR });
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.sn-tabs__item .sn-tabs__icon').exists()).toBe(true);
    expect(wrapper.find('.sn-tabs__item svg path').exists()).toBe(true);
  });

  it('renders an image for iconImage and lets it win over icon', async () => {
    const wrapper = mountPane({ icon: STAR, iconImage: 'https://cdn.example/flag.png' });
    await wrapper.vm.$nextTick();
    const image = wrapper.find('.sn-tabs__icon-image');
    expect(image.exists()).toBe(true);
    expect(image.attributes('src')).toBe('https://cdn.example/flag.png');
    expect(wrapper.find('.sn-tabs__icon').exists()).toBe(false);
  });

  it('renders neither icon nor image when the pane sets none', async () => {
    const wrapper = mountPane({});
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.sn-tabs__icon').exists()).toBe(false);
    expect(wrapper.find('.sn-tabs__icon-image').exists()).toBe(false);
  });

  it('forwards badgeProps to the badge marker', async () => {
    const wrapper = mountPane({ badgeProps: { value: 120, max: 99, type: 'primary' } });
    await wrapper.vm.$nextTick();
    const marker = wrapper.find('.sn-tabs__item .sn-badge__marker');
    expect(marker.exists()).toBe(true);
    expect(marker.text()).toBe('99+');
    expect(marker.classes()).toContain('sn-badge__marker--primary');
  });

  it('renders no badge without badgeProps', async () => {
    const wrapper = mountPane({});
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.sn-tabs__item .sn-badge').exists()).toBe(false);
    expect(wrapper.find('.sn-tabs__title').text()).toBe('A');
  });
});
