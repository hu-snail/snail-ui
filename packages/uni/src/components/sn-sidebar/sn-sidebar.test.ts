/**
 * sn-sidebar / sn-sidebar-item unit tests — uni-end vertical side navigation.
 *
 * Behaviour only (AGENTS.md §46): the v-model contract, the value / label
 * fallback, the beforeChange veto, the disabled guard, the badge / icon
 * rendering and the scroll-spy linkage (additive — AUI-OPT-08). No rpx numbers
 * in assertions — happy-dom discards lengths it cannot parse.
 */

import { afterEach, describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, ref, type Ref } from 'vue';
import SnSidebar from './sn-sidebar.vue';
import SnSidebarItem from './sn-sidebar-item.vue';

/** Harness that mounts a sidebar with the given items. */
function mountSidebar(
  props: Record<string, unknown> = {},
  items: Record<string, unknown>[] = [
    { label: 'All', value: 0 },
    { label: 'Todo', value: 1 },
    { label: 'Done', value: 2 },
  ],
) {
  const Harness = defineComponent({
    setup() {
      return () =>
        h(SnSidebar, props, {
          default: () => items.map((item) => h(SnSidebarItem, item)),
        });
    },
  });
  return mount(Harness);
}

/** One rect as the scroll-spy measurement adapter consumes it. */
interface SpyRect {
  id?: string;
  top: number;
}

/** Install a `uni.createSelectorQuery` stub returning the given rects. */
function installUniQuery(readRects: () => Array<SpyRect | null> | undefined): void {
  (globalThis as { uni?: unknown }).uni = {
    createSelectorQuery: () => ({
      selectAll: () => ({
        fields: (
          _options: unknown,
          callback: (rects: Array<SpyRect | null> | undefined) => void,
        ) => ({ exec: () => callback(readRects()) }),
      }),
    }),
  };
}

/** Three sections laid out 0 / 200 / 400 px down the scroll content. */
const SPY_SECTIONS: SpyRect[] = [
  { id: 'sec-a', top: 0 },
  { id: 'sec-b', top: 200 },
  { id: 'sec-c', top: 400 },
];

/**
 * Mount a scroll-spy sidebar (three anchored items over `SPY_SECTIONS` by
 * default) whose `scrollTop` input can be driven from the test.
 *
 * `anchors` optionally supplies the three item anchors as a reactive ref, so a
 * test can rename one and observe the re-measurement.
 */
function mountSpySidebar(
  readRects: () => Array<SpyRect | null> | undefined,
  sidebarProps: Record<string, unknown> = {},
  anchors?: Ref<[string, string, string]>,
) {
  installUniQuery(readRects);
  const scrollTop = ref(0);
  const defaultAnchors: [string, string, string] = ['sec-a', 'sec-b', 'sec-c'];
  const anchorSource = anchors ?? ref(defaultAnchors);
  const Harness = defineComponent({
    setup() {
      return () => {
        const labels = ['A', 'B', 'C'] as const;
        const values = [0, 1, 2] as const;
        return h(
          SnSidebar,
          {
            modelValue: 0,
            scrollSpy: true,
            anchorSelector: '.sec',
            scrollTop: scrollTop.value,
            ...sidebarProps,
          },
          {
            default: () =>
              labels.map((label, index) =>
                h(SnSidebarItem, {
                  label,
                  value: values[index],
                  anchor: anchorSource.value[index],
                }),
              ),
          },
        );
      };
    },
  });
  return { wrapper: mount(Harness), scrollTop, anchors: anchorSource };
}

afterEach(() => {
  delete (globalThis as { uni?: unknown }).uni;
});

describe('sn-sidebar', () => {
  describe('press feedback (hover-class)', () => {
    it('wires the pressed class on enabled items', () => {
      const wrapper = mountSidebar({ modelValue: 0 });
      for (const item of wrapper.findAll('.sn-sidebar-item')) {
        expect(item.attributes('hover-class')).toBe('sn-sidebar-item--pressed');
      }
    });

    it('keeps disabled items inert', () => {
      const wrapper = mountSidebar({ modelValue: 0 }, [
        { label: 'All', value: 0 },
        { label: 'Locked', value: 1, disabled: true },
      ]);
      const items = wrapper.findAll('.sn-sidebar-item');
      expect(items[0]!.attributes('hover-class')).toBe('sn-sidebar-item--pressed');
      expect(items[1]!.attributes('hover-class')).toBe('none');
    });
  });

  describe('v-model', () => {
    it('marks the item matching modelValue as active', () => {
      const items = mountSidebar({ modelValue: 1 }).findAll('.sn-sidebar-item');
      expect(items[0]!.classes()).not.toContain('sn-sidebar-item--active');
      expect(items[1]!.classes()).toContain('sn-sidebar-item--active');
    });

    it('renders the active marker as a real element, not a ::before pseudo', () => {
      // App has no pseudo-elements (§116.2).
      const items = mountSidebar({ modelValue: 1 }).findAll('.sn-sidebar-item');
      expect(items[0]!.find('.sn-sidebar-item__marker').exists()).toBe(false);
      expect(items[1]!.find('.sn-sidebar-item__marker').exists()).toBe(true);
    });

    it('emits update:modelValue on tap', async () => {
      const wrapper = mountSidebar({ modelValue: 0 });
      await wrapper.findAll('.sn-sidebar-item')[2]!.trigger('tap');
      expect(wrapper.findComponent(SnSidebar).emitted('update:modelValue')?.at(-1)).toEqual([2]);
    });

    it('emits change with { value, label } on tap', async () => {
      const wrapper = mountSidebar({ modelValue: 0 });
      await wrapper.findAll('.sn-sidebar-item')[1]!.trigger('tap');
      expect(wrapper.findComponent(SnSidebar).emitted('change')?.at(-1)).toEqual([
        { value: 1, label: 'Todo' },
      ]);
    });

    it('does not emit when the tapped item is already active', async () => {
      const wrapper = mountSidebar({ modelValue: 0 });
      await wrapper.findAll('.sn-sidebar-item')[0]!.trigger('tap');
      expect(wrapper.findComponent(SnSidebar).emitted('update:modelValue')).toBeUndefined();
    });

    it('works uncontrolled', async () => {
      const wrapper = mountSidebar();
      await wrapper.findAll('.sn-sidebar-item')[1]!.trigger('tap');
      await wrapper.vm.$nextTick();
      expect(wrapper.findAll('.sn-sidebar-item')[1]!.classes()).toContain(
        'sn-sidebar-item--active',
      );
    });

    it('follows a later modelValue change (controlled)', async () => {
      const value = ref(0);
      const Harness = defineComponent({
        setup() {
          return () =>
            h(
              SnSidebar,
              { modelValue: value.value },
              {
                default: () => [
                  h(SnSidebarItem, { label: 'A', value: 0 }),
                  h(SnSidebarItem, { label: 'B', value: 1 }),
                ],
              },
            );
        },
      });
      const wrapper = mount(Harness);
      value.value = 1;
      await wrapper.vm.$nextTick();
      expect(wrapper.findAll('.sn-sidebar-item')[1]!.classes()).toContain(
        'sn-sidebar-item--active',
      );
    });

    it('falls back to the label as the item value', async () => {
      const wrapper = mountSidebar({ modelValue: 'All' }, [{ label: 'All' }, { label: 'Todo' }]);
      expect(wrapper.findAll('.sn-sidebar-item')[0]!.classes()).toContain(
        'sn-sidebar-item--active',
      );
      await wrapper.findAll('.sn-sidebar-item')[1]!.trigger('tap');
      expect(wrapper.findComponent(SnSidebar).emitted('change')?.at(-1)).toEqual([
        { value: 'Todo', label: 'Todo' },
      ]);
    });
  });

  describe('beforeChange', () => {
    it('commits when beforeChange resolves true', async () => {
      const beforeChange = vi.fn(() => true);
      const wrapper = mountSidebar({ modelValue: 0, beforeChange });
      await wrapper.findAll('.sn-sidebar-item')[1]!.trigger('tap');
      await vi.waitFor(() => {
        expect(wrapper.findComponent(SnSidebar).emitted('update:modelValue')?.at(-1)).toEqual([1]);
      });
      expect(beforeChange).toHaveBeenCalledWith(1);
    });

    it('does not commit when a sync beforeChange returns false', async () => {
      const beforeChange = vi.fn(() => false);
      const wrapper = mountSidebar({ modelValue: 0, beforeChange });
      await wrapper.findAll('.sn-sidebar-item')[1]!.trigger('tap');
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(SnSidebar).emitted('update:modelValue')).toBeUndefined();
    });

    it('does not commit when beforeChange resolves false', async () => {
      const beforeChange = vi.fn(async () => false);
      const wrapper = mountSidebar({ modelValue: 0, beforeChange });
      await wrapper.findAll('.sn-sidebar-item')[1]!.trigger('tap');
      await vi.waitFor(() => expect(beforeChange).toHaveBeenCalled());
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(SnSidebar).emitted('update:modelValue')).toBeUndefined();
    });

    it('does not commit when beforeChange rejects', async () => {
      const beforeChange = vi.fn(async () => {
        throw new Error('denied');
      });
      const wrapper = mountSidebar({ modelValue: 0, beforeChange });
      await wrapper.findAll('.sn-sidebar-item')[1]!.trigger('tap');
      await vi.waitFor(() => expect(beforeChange).toHaveBeenCalled());
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(SnSidebar).emitted('update:modelValue')).toBeUndefined();
    });
  });

  describe('layout / accessibility', () => {
    it('exposes role="tablist" with a vertical orientation', () => {
      const wrapper = mountSidebar();
      expect(wrapper.find('.sn-sidebar').attributes('role')).toBe('tablist');
      expect(wrapper.find('.sn-sidebar').attributes('aria-orientation')).toBe('vertical');
    });

    it('exposes role="tab" and aria-selected on each item', () => {
      const items = mountSidebar({ modelValue: 1 }).findAll('.sn-sidebar-item');
      expect(items[0]!.attributes('role')).toBe('tab');
      expect(items[0]!.attributes('aria-selected')).toBe('false');
      expect(items[1]!.attributes('aria-selected')).toBe('true');
    });

    it('forwards customClass and customStyle on the container', () => {
      const wrapper = mountSidebar({ customClass: 'my-side', customStyle: 'margin: 4px;' });
      expect(wrapper.find('.sn-sidebar').classes()).toContain('my-side');
      expect(wrapper.find('.sn-sidebar').attributes('style')).toContain('margin: 4px');
    });
  });

  describe('scroll linkage (AUI-OPT-08)', () => {
    it('should follow the content position instead of the finger', async () => {
      const { wrapper, scrollTop } = mountSpySidebar(() => SPY_SECTIONS);

      scrollTop.value = 260;
      await wrapper.vm.$nextTick();

      const items = wrapper.findAll('.sn-sidebar-item');
      expect(items[0]!.classes()).not.toContain('sn-sidebar-item--active');
      expect(items[1]!.classes()).toContain('sn-sidebar-item--active');
      expect(wrapper.findComponent(SnSidebar).emitted('update:modelValue')?.at(-1)).toEqual([1]);
      expect(wrapper.findComponent(SnSidebar).emitted('change')?.at(-1)).toEqual([
        { value: 1, label: 'B' },
      ]);
    });

    it('should keep the highlight still past the last section', async () => {
      const { wrapper, scrollTop } = mountSpySidebar(() => SPY_SECTIONS);

      scrollTop.value = 5000;
      await wrapper.vm.$nextTick();

      const items = wrapper.findAll('.sn-sidebar-item');
      expect(items[2]!.classes()).toContain('sn-sidebar-item--active');
      expect(wrapper.findComponent(SnSidebar).emitted('change')?.at(-1)).toEqual([
        { value: 2, label: 'C' },
      ]);
    });

    it('should leave the highlight to user interaction without scroll-spy', async () => {
      const { wrapper, scrollTop } = mountSpySidebar(() => SPY_SECTIONS, { scrollSpy: false });

      scrollTop.value = 260;
      await wrapper.vm.$nextTick();

      expect(wrapper.findAll('.sn-sidebar-item')[1]!.classes()).not.toContain(
        'sn-sidebar-item--active',
      );
      expect(wrapper.findComponent(SnSidebar).emitted('update:modelValue')).toBeUndefined();
    });

    it('should shift the activation line by the threshold', async () => {
      const { wrapper, scrollTop } = mountSpySidebar(() => SPY_SECTIONS, { scrollThreshold: 40 });

      scrollTop.value = 160;
      await wrapper.vm.$nextTick();

      expect(wrapper.findAll('.sn-sidebar-item')[1]!.classes()).toContain(
        'sn-sidebar-item--active',
      );
    });

    it('should bypass beforeChange for a scroll-driven switch', async () => {
      const beforeChange = vi.fn(() => false);
      const { wrapper, scrollTop } = mountSpySidebar(() => SPY_SECTIONS, { beforeChange });

      scrollTop.value = 260;
      await wrapper.vm.$nextTick();

      // A tap veto must not desync the highlight from the visible section.
      expect(beforeChange).not.toHaveBeenCalled();
      expect(wrapper.findAll('.sn-sidebar-item')[1]!.classes()).toContain(
        'sn-sidebar-item--active',
      );
    });

    it('should keep its previous highlight while nothing is measured', async () => {
      const { wrapper, scrollTop } = mountSpySidebar(() => []);

      scrollTop.value = 500;
      await wrapper.vm.$nextTick();

      expect(wrapper.findComponent(SnSidebar).emitted('change')).toBeUndefined();
      expect(wrapper.findAll('.sn-sidebar-item')[0]!.classes()).toContain(
        'sn-sidebar-item--active',
      );
    });

    it('should ignore matched sections no item claims', async () => {
      const { wrapper, scrollTop } = mountSpySidebar(() => [
        ...SPY_SECTIONS,
        { id: 'outside', top: 400 },
      ]);

      scrollTop.value = 400;
      await wrapper.vm.$nextTick();

      // The unclaimed section sits at the same position as sec-c; the reading
      // must stay with the claimed anchors only.
      expect(wrapper.findComponent(SnSidebar).emitted('change')?.at(-1)).toEqual([
        { value: 2, label: 'C' },
      ]);
      expect(wrapper.findAll('.sn-sidebar-item')[2]!.classes()).toContain(
        'sn-sidebar-item--active',
      );
    });

    it('should re-measure when the host calls refresh()', async () => {
      let rects: SpyRect[] = [...SPY_SECTIONS];
      const { wrapper, scrollTop } = mountSpySidebar(() => rects);

      scrollTop.value = 220;
      await wrapper.vm.$nextTick();
      expect(wrapper.findAll('.sn-sidebar-item')[1]!.classes()).toContain(
        'sn-sidebar-item--active',
      );

      // The content grew: sec-b now starts below the current reading.
      rects = [
        { id: 'sec-a', top: 0 },
        { id: 'sec-b', top: 600 },
        { id: 'sec-c', top: 900 },
      ];
      const sidebar = wrapper.findComponent(SnSidebar).vm as unknown as {
        refresh: () => void;
      };
      sidebar.refresh();
      await wrapper.vm.$nextTick();

      expect(wrapper.findAll('.sn-sidebar-item')[0]!.classes()).toContain(
        'sn-sidebar-item--active',
      );
      expect(wrapper.findComponent(SnSidebar).emitted('update:modelValue')?.at(-1)).toEqual([0]);
    });

    it('should re-measure when an item anchor is renamed', async () => {
      const anchors = ref<[string, string, string]>(['sec-a', 'sec-b', 'sec-c']);
      const { wrapper, scrollTop } = mountSpySidebar(() => SPY_SECTIONS, {}, anchors);

      scrollTop.value = 260;
      await wrapper.vm.$nextTick();
      expect(wrapper.findAll('.sn-sidebar-item')[1]!.classes()).toContain(
        'sn-sidebar-item--active',
      );

      // Swap A and B: the sections keep their positions, the entries swap
      // owners, so the highlight must move from B to A without a scroll event.
      anchors.value = ['sec-b', 'sec-a', 'sec-c'];
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      expect(wrapper.findAll('.sn-sidebar-item')[0]!.classes()).toContain(
        'sn-sidebar-item--active',
      );
      expect(wrapper.findAll('.sn-sidebar-item')[1]!.classes()).not.toContain(
        'sn-sidebar-item--active',
      );
    });
  });
});

describe('sn-sidebar-item', () => {
  it('renders the label', () => {
    expect(
      mountSidebar({}, [{ label: 'Todo', value: 0 }])
        .find('.sn-sidebar-item__label')
        .text(),
    ).toBe('Todo');
  });

  it('blocks a disabled item', async () => {
    const wrapper = mountSidebar({ modelValue: 0 }, [
      { label: 'A', value: 0 },
      { label: 'B', value: 1, disabled: true },
    ]);
    await wrapper.findAll('.sn-sidebar-item')[1]!.trigger('tap');
    expect(wrapper.findComponent(SnSidebar).emitted('update:modelValue')).toBeUndefined();
    expect(wrapper.findAll('.sn-sidebar-item')[1]!.attributes('aria-disabled')).toBe('true');
  });

  it('renders a numeric badge', () => {
    const wrapper = mountSidebar({}, [{ label: 'A', value: 0, badge: 5 }]);
    expect(wrapper.find('.sn-sidebar-item__badge-text').text()).toBe('5');
  });

  it('caps the badge at max', () => {
    const wrapper = mountSidebar({}, [{ label: 'A', value: 0, badge: 120, max: 99 }]);
    expect(wrapper.find('.sn-sidebar-item__badge-text').text()).toBe('99+');
  });

  it('renders a dot badge when isDot is on', () => {
    const wrapper = mountSidebar({}, [{ label: 'A', value: 0, isDot: true }]);
    expect(wrapper.find('.sn-sidebar-item__badge--dot').exists()).toBe(true);
    expect(wrapper.find('.sn-sidebar-item__badge-text').exists()).toBe(false);
  });

  it('renders no badge without a badge value', () => {
    expect(
      mountSidebar({}, [{ label: 'A', value: 0 }])
        .find('.sn-sidebar-item__badge')
        .exists(),
    ).toBe(false);
  });

  it('renders a registry-resolved icon', async () => {
    const { registerSnIcons, clearSnIcons } = await import('../sn-icon/sn-icon-registry');
    const { Star } = await import('../sn-icon/sn-icon-set');
    registerSnIcons({ Star });
    const wrapper = mountSidebar({}, [{ label: 'A', value: 0, icon: 'Star' }]);
    expect(wrapper.find('.sn-sidebar-item__icon.sn-icon').exists()).toBe(true);
    clearSnIcons();
  });

  it('renders a font icon when cssIcon is on', () => {
    const wrapper = mountSidebar({}, [
      { label: 'A', value: 0, icon: 'star', iconPrefix: 'sn', cssIcon: true },
    ]);
    expect(wrapper.find('.sn-sidebar-item__icon').classes()).toContain('sn-star');
  });

  it('is inert when mounted outside a sidebar', async () => {
    const wrapper = mount(SnSidebarItem, { props: { label: 'orphan', value: 1 } });
    await wrapper.trigger('tap');
    expect(wrapper.classes()).not.toContain('sn-sidebar-item--active');
  });

  describe('sn-sidebar extras', () => {
    it('commits a selection through the exposed select() method', async () => {
      const wrapper = mountSidebar({ modelValue: 0 });
      const sidebar = wrapper.findComponent(SnSidebar).vm as unknown as {
        select: (value: number, label: string) => Promise<void>;
      };
      await sidebar.select(2, 'Done');
      expect(wrapper.findComponent(SnSidebar).emitted('update:modelValue')?.at(-1)).toEqual([2]);
      expect(wrapper.findComponent(SnSidebar).emitted('change')?.at(-1)).toEqual([
        { value: 2, label: 'Done' },
      ]);
      await wrapper.vm.$nextTick();
      expect(wrapper.findAll('.sn-sidebar-item')[2]!.classes()).toContain(
        'sn-sidebar-item--active',
      );
    });

    it('emits one update per tap in a quick item-to-item sequence', async () => {
      const wrapper = mountSidebar({ modelValue: 0 });
      const items = wrapper.findAll('.sn-sidebar-item');
      await items[1]!.trigger('tap');
      await items[2]!.trigger('tap');
      const values = wrapper
        .findComponent(SnSidebar)
        .emitted('update:modelValue')
        ?.map((args) => args[0]);
      expect(values).toEqual([1, 2]);
    });

    it('labels each item with its text', () => {
      const items = mountSidebar({ modelValue: 1 }).findAll('.sn-sidebar-item');
      expect(items[1]!.attributes('aria-label')).toBe('Todo');
    });
  });
});

describe('sn-sidebar-item extras', () => {
  it('renders a string badge verbatim', () => {
    const wrapper = mountSidebar({}, [{ label: 'A', value: 0, badge: 'New' }]);
    expect(wrapper.find('.sn-sidebar-item__badge-text').text()).toBe('New');
  });

  it('renders no badge for an empty-string badge', () => {
    const wrapper = mountSidebar({}, [{ label: 'A', value: 0, badge: '' }]);
    expect(wrapper.find('.sn-sidebar-item__badge').exists()).toBe(false);
  });

  it('marks a disabled item with the disabled class', () => {
    const wrapper = mountSidebar({}, [
      { label: 'A', value: 0 },
      { label: 'B', value: 1, disabled: true },
    ]);
    expect(wrapper.findAll('.sn-sidebar-item')[1]!.classes()).toContain(
      'sn-sidebar-item--disabled',
    );
  });

  it('forwards customClass and customStyle on the item', () => {
    const wrapper = mountSidebar({}, [
      { label: 'A', value: 0, customClass: 'my-item', customStyle: 'margin: 2px;' },
    ]);
    expect(wrapper.find('.sn-sidebar-item').classes()).toContain('my-item');
    expect(wrapper.find('.sn-sidebar-item').attributes('style')).toContain('margin: 2px');
  });

  it('replaces the icon area through the icon slot', () => {
    const Harness = defineComponent({
      setup() {
        return () =>
          h(
            SnSidebar,
            {},
            {
              default: () => [
                h(
                  SnSidebarItem,
                  { label: 'A', value: 0, icon: 'Star' },
                  { icon: () => h('text', { class: 'custom-icon' }, 'X') },
                ),
              ],
            },
          );
      },
    });
    const wrapper = mount(Harness);
    expect(wrapper.find('.custom-icon').exists()).toBe(true);
    expect(wrapper.find('.sn-sidebar-item__icon.sn-icon').exists()).toBe(false);
  });
});
