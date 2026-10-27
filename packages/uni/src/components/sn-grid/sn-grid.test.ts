/**
 * sn-grid / sn-grid-item unit tests — uni-end icon grid.
 *
 * Behaviour only (AGENTS.md §46): the column-driven cell width, the gutter
 * plumbing, the square / direction / reverse / center flags, the badge and the
 * clickable guard. No rpx numbers in assertions — happy-dom discards lengths
 * it cannot parse.
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import SnGrid from './sn-grid.vue';
import SnGridItem from './sn-grid-item.vue';

/** Harness: a grid with N items. */
function mountGrid(
  gridProps: Record<string, unknown> = {},
  items: Record<string, unknown>[] = [{ text: 'One' }, { text: 'Two' }, { text: 'Three' }],
) {
  const Harness = defineComponent({
    setup() {
      return () =>
        h(SnGrid, gridProps, {
          default: () => items.map((item) => h(SnGridItem, item)),
        });
    },
  });
  return mount(Harness);
}

describe('sn-grid', () => {
  describe('columns', () => {
    it('renders one cell per item', () => {
      expect(mountGrid().findAll('.sn-grid-item')).toHaveLength(3);
    });

    it('splits the row by the default column count', () => {
      const style = mountGrid().find('.sn-grid-item').attributes('style');
      /* 3 columns → 33.33…%. */
      expect(style).toContain('flex-basis');
      expect(style).toContain('33.33');
    });

    it('splits the row by a custom column count', () => {
      const style = mountGrid({ column: 4 }).find('.sn-grid-item').attributes('style');
      expect(style).toContain('25%');
    });

    it('treats column 0 as a single column', () => {
      const style = mountGrid({ column: 0 }, [{ text: 'A' }])
        .find('.sn-grid-item')
        .attributes('style');
      expect(style).toContain('100%');
    });
  });

  describe('layout flags', () => {
    it('adds the border class on the grid', () => {
      expect(mountGrid({ border: true }).find('.sn-grid').classes()).toContain('sn-grid--border');
    });

    it('pads the grid by half a gutter and the cells by half too', () => {
      const wrapper = mountGrid({ gutter: 20 });
      expect(wrapper.find('.sn-grid').attributes('style')).toContain('padding: 10px');
      expect(wrapper.find('.sn-grid-item').attributes('style')).toContain('padding: 10px');
    });

    it('applies the square class on grid and cells', () => {
      const wrapper = mountGrid({ square: true });
      expect(wrapper.find('.sn-grid').classes()).toContain('sn-grid--square');
      expect(wrapper.find('.sn-grid-item').classes()).toContain('sn-grid-item--square');
      expect(wrapper.find('.sn-grid-item__content').classes()).toContain(
        'sn-grid-item__content--square',
      );
    });

    it('switches the content direction to horizontal', () => {
      expect(
        mountGrid({ direction: 'horizontal' }).find('.sn-grid-item__content').classes(),
      ).toContain('sn-grid-item__content--horizontal');
    });

    it('defaults to the vertical direction', () => {
      expect(mountGrid().find('.sn-grid-item__content').classes()).not.toContain(
        'sn-grid-item__content--horizontal',
      );
    });

    it('applies the reverse class', () => {
      expect(mountGrid({ reverse: true }).find('.sn-grid-item__content').classes()).toContain(
        'sn-grid-item__content--reverse',
      );
    });

    it('centers content by default and can opt out', () => {
      expect(mountGrid().find('.sn-grid-item__content').classes()).toContain(
        'sn-grid-item__content--center',
      );
      expect(mountGrid({ center: false }).find('.sn-grid-item__content').classes()).not.toContain(
        'sn-grid-item__content--center',
      );
    });

    it('applies bgColor inline on the grid', () => {
      expect(mountGrid({ bgColor: 'rgb(1, 2, 3)' }).find('.sn-grid').attributes('style')).toContain(
        'background-color: rgb(1, 2, 3)',
      );
    });

    it('forwards customClass / customStyle', () => {
      const wrapper = mountGrid({ customClass: 'my-grid', customStyle: 'margin: 4px;' });
      expect(wrapper.find('.sn-grid').classes()).toContain('my-grid');
      expect(wrapper.find('.sn-grid').attributes('style')).toContain('margin: 4px');
    });
  });

  describe('events', () => {
    it('does not emit while not clickable and without a url', async () => {
      const wrapper = mountGrid({}, [{ text: 'A' }]);
      await wrapper.find('.sn-grid-item').trigger('tap');
      expect(wrapper.findComponent(SnGridItem).emitted('click')).toBeUndefined();
    });

    it('emits click when clickable', async () => {
      const wrapper = mountGrid({ clickable: true }, [{ text: 'A' }]);
      await wrapper.find('.sn-grid-item').trigger('tap');
      expect(wrapper.findComponent(SnGridItem).emitted('click')).toHaveLength(1);
    });

    it('forwards url / linkType through the click payload', async () => {
      const wrapper = mountGrid({}, [{ text: 'A', url: '/detail', linkType: 'switchTab' }]);
      await wrapper.find('.sn-grid-item').trigger('tap');
      expect(wrapper.findComponent(SnGridItem).emitted('click')?.at(-1)).toEqual([
        { url: '/detail', linkType: 'switchTab' },
      ]);
    });

    it('marks a clickable cell with the clickable class', () => {
      expect(mountGrid({ clickable: true }).find('.sn-grid-item').classes()).toContain(
        'sn-grid-item--clickable',
      );
    });
  });

  describe('cells', () => {
    it('renders the text prop', () => {
      expect(
        mountGrid({}, [{ text: 'Label' }])
          .find('.sn-grid-item__text')
          .text(),
      ).toBe('Label');
    });

    it('applies the ellipsis class', () => {
      expect(
        mountGrid({}, [{ text: 'A', ellipsis: true }])
          .find('.sn-grid-item__text')
          .classes(),
      ).toContain('sn-grid-item__text--ellipsis');
    });

    it('renders a registry-resolved icon', async () => {
      const { registerSnIcons, clearSnIcons } = await import('../sn-icon/sn-icon-registry');
      const { Star } = await import('../sn-icon/sn-icon-set');
      registerSnIcons({ Star });
      const wrapper = mountGrid({}, [{ text: 'A', icon: 'Star' }]);
      expect(wrapper.find('.sn-grid-item__icon.sn-icon').exists()).toBe(true);
      clearSnIcons();
    });

    it('applies iconColor inline on the resolved icon', async () => {
      const { registerSnIcons, clearSnIcons } = await import('../sn-icon/sn-icon-registry');
      const { Star } = await import('../sn-icon/sn-icon-set');
      registerSnIcons({ Star });
      const wrapper = mountGrid({}, [{ text: 'A', icon: 'Star', iconColor: 'rgb(9, 9, 9)' }]);
      expect(wrapper.find('.sn-grid-item__icon').attributes('style')).toContain(
        'color: rgb(9, 9, 9)',
      );
      clearSnIcons();
    });

    it('renders a font icon when cssIcon is on', () => {
      const wrapper = mountGrid({}, [{ text: 'A', icon: 'star', iconPrefix: 'sn', cssIcon: true }]);
      expect(wrapper.find('.sn-grid-item__icon').classes()).toContain('sn-star');
    });

    it('renders a numeric badge', () => {
      expect(
        mountGrid({}, [{ text: 'A', value: 5 }])
          .find('.sn-grid-item__badge-text')
          .text(),
      ).toBe('5');
    });

    it('caps the badge at max', () => {
      expect(
        mountGrid({}, [{ text: 'A', value: 200, max: 99 }])
          .find('.sn-grid-item__badge-text')
          .text(),
      ).toBe('99+');
    });

    it('renders a dot badge when isDot is on', () => {
      const wrapper = mountGrid({}, [{ text: 'A', isDot: true }]);
      expect(wrapper.find('.sn-grid-item__badge--dot').exists()).toBe(true);
      expect(wrapper.find('.sn-grid-item__badge-text').exists()).toBe(false);
    });

    it('renders no badge without a value', () => {
      expect(
        mountGrid({}, [{ text: 'A' }])
          .find('.sn-grid-item__badge')
          .exists(),
      ).toBe(false);
    });

    it('renders the default slot instead of icon and text', () => {
      const Harness = defineComponent({
        setup() {
          return () =>
            h(
              SnGrid,
              {},
              {
                default: () => [
                  h(SnGridItem, {}, { default: () => h('text', { class: 'custom' }, 'slot') }),
                ],
              },
            );
        },
      });
      const wrapper = mount(Harness);
      expect(wrapper.find('.custom').text()).toBe('slot');
      expect(wrapper.find('.sn-grid-item__text').exists()).toBe(false);
    });

    it('forwards customClass / customStyle on the cell', () => {
      const wrapper = mountGrid({}, [
        { text: 'A', customClass: 'my-cell', customStyle: 'color: red;' },
      ]);
      expect(wrapper.find('.sn-grid-item').classes()).toContain('my-cell');
      expect(wrapper.find('.sn-grid-item').attributes('style')).toContain('color: red');
    });

    it('exposes role="list" / role="listitem"', () => {
      const wrapper = mountGrid();
      expect(wrapper.find('.sn-grid').attributes('role')).toBe('list');
      expect(wrapper.find('.sn-grid-item').attributes('role')).toBe('listitem');
    });

    it('renders the icon slot over the icon prop', async () => {
      const { registerSnIcons, clearSnIcons } = await import('../sn-icon/sn-icon-registry');
      const { Star } = await import('../sn-icon/sn-icon-set');
      registerSnIcons({ Star });
      const Harness = defineComponent({
        setup() {
          return () =>
            h(SnGrid, {}, {
              default: () => [
                h(SnGridItem, { text: 'A', icon: 'Star' }, {
                  icon: () => h('text', { class: 'custom-icon' }, 'slot icon'),
                }),
              ],
            });
        },
      });
      const wrapper = mount(Harness);
      expect(wrapper.find('.custom-icon').exists()).toBe(true);
      expect(wrapper.find('.sn-grid-item__icon').exists()).toBe(false);
      clearSnIcons();
    });

    it('renders the text slot over the text prop', () => {
      const Harness = defineComponent({
        setup() {
          return () =>
            h(SnGrid, {}, {
              default: () => [
                h(SnGridItem, { text: 'prop text' }, {
                  text: () => h('text', { class: 'custom-text' }, 'slot text'),
                }),
              ],
            });
        },
      });
      const wrapper = mount(Harness);
      expect(wrapper.find('.custom-text').text()).toBe('slot text');
      expect(wrapper.find('.sn-grid-item__text').exists()).toBe(false);
    });

    it('sizes the resolved icon from the grid iconSize', async () => {
      const { registerSnIcons, clearSnIcons } = await import('../sn-icon/sn-icon-registry');
      const { Star } = await import('../sn-icon/sn-icon-set');
      registerSnIcons({ Star });
      const wrapper = mountGrid({ iconSize: '40px' }, [{ text: 'A', icon: 'Star' }]);
      expect(wrapper.find('.sn-grid-item__icon').attributes('style')).toContain('width: 40px');
      clearSnIcons();
    });

    it('defaults the resolved icon size to 28px', async () => {
      const { registerSnIcons, clearSnIcons } = await import('../sn-icon/sn-icon-registry');
      const { Star } = await import('../sn-icon/sn-icon-set');
      registerSnIcons({ Star });
      const wrapper = mountGrid({}, [{ text: 'A', icon: 'Star' }]);
      expect(wrapper.find('.sn-grid-item__icon').attributes('style')).toContain('width: 28px');
      clearSnIcons();
    });

    it('renders no badge text for a string value above max', () => {
      // Only numeric values honour the max ceiling; strings render verbatim.
      expect(
        mountGrid({}, [{ text: 'A', value: '200', max: 99 }])
          .find('.sn-grid-item__badge-text')
          .text(),
      ).toBe('200');
    });

    it('renders an empty string value as no badge', () => {
      expect(
        mountGrid({}, [{ text: 'A', value: '' }])
          .find('.sn-grid-item__badge')
          .exists(),
      ).toBe(false);
    });
  });

  describe('cell borders', () => {
    it('marks every cell when the grid draws borders', () => {
      expect(mountGrid().find('.sn-grid-item').classes()).not.toContain(
        'sn-grid-item--border',
      );
      expect(mountGrid({ border: true }).find('.sn-grid-item').classes()).toContain(
        'sn-grid-item--border',
      );
    });

    it('tracks a border flip on the grid', async () => {
      const wrapper = mountGrid({ border: false });
      await wrapper.setProps({ border: true });
      expect(wrapper.find('.sn-grid-item').classes()).toContain('sn-grid-item--border');
    });
  });

  describe('hover feedback', () => {
    it('attaches the hover class only to clickable cells', () => {
      expect(mountGrid().find('.sn-grid-item').attributes('hover-class')).toBe('none');
      expect(mountGrid({ clickable: true }).find('.sn-grid-item').attributes('hover-class')).toBe(
        'sn-grid-item__content--hover',
      );
    });

    it('accepts a custom hover class from the grid', () => {
      const wrapper = mountGrid({ clickable: true, hoverClass: 'my-hover' });
      expect(wrapper.find('.sn-grid-item').attributes('hover-class')).toBe('my-hover');
    });
  });
});
