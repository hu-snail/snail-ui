/**
 * sn-pagination unit tests — uni-end page stepper.
 *
 * Behaviour only (AGENTS.md §46): the total / totalPage resolution order, the
 * clamped page window with ellipses, the boundary guards and the v-model
 * contract. No rpx numbers in assertions — happy-dom discards lengths it
 * cannot parse.
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SnPagination from './sn-pagination.vue';

describe('sn-pagination', () => {
  describe('page count resolution', () => {
    it('uses totalPage when total is not given', () => {
      const wrapper = mount(SnPagination, { props: { totalPage: 5, modelValue: 1 } });
      const pages = wrapper.findAll('.sn-pagination__page');
      expect(pages).toHaveLength(5);
    });

    it('derives the page count from total + pageSize', () => {
      const wrapper = mount(SnPagination, {
        props: { total: 95, pageSize: 10, modelValue: 1, showMessage: true },
      });
      /* 95 / 10 rounds up to 10 pages. */
      expect(wrapper.find('.sn-pagination__message-text').text()).toBe('1 / 10');
    });

    it('gives total + pageSize precedence over totalPage', () => {
      const wrapper = mount(SnPagination, {
        props: { total: 20, pageSize: 10, totalPage: 99, modelValue: 1 },
      });
      /* 20 / 10 → 2 pages: both fit, so both are rendered without ellipses. */
      const pages = wrapper.findAll('.sn-pagination__page');
      expect(pages).toHaveLength(2);
      expect(wrapper.find('.sn-pagination__ellipsis').exists()).toBe(false);
    });

    it('never drops below one page', () => {
      const wrapper = mount(SnPagination, { props: { totalPage: 0, modelValue: 1 } });
      expect(wrapper.findAll('.sn-pagination__page')).toHaveLength(1);
    });
  });

  describe('page window', () => {
    it('renders every page when the count fits the window', () => {
      const wrapper = mount(SnPagination, { props: { totalPage: 5, modelValue: 3 } });
      expect(wrapper.findAll('.sn-pagination__page')).toHaveLength(5);
      expect(wrapper.find('.sn-pagination__ellipsis').exists()).toBe(false);
    });

    it('adds ellipses on both sides in the middle of a long run', () => {
      const wrapper = mount(SnPagination, { props: { totalPage: 20, modelValue: 10 } });
      expect(wrapper.findAll('.sn-pagination__ellipsis')).toHaveLength(2);
    });

    it('drops the left ellipsis near the start', () => {
      const wrapper = mount(SnPagination, { props: { totalPage: 20, modelValue: 2 } });
      expect(wrapper.findAll('.sn-pagination__ellipsis')).toHaveLength(1);
    });

    it('drops the right ellipsis near the end', () => {
      const wrapper = mount(SnPagination, { props: { totalPage: 20, modelValue: 19 } });
      expect(wrapper.findAll('.sn-pagination__ellipsis')).toHaveLength(1);
    });

    it('always keeps the first and last page visible', () => {
      const wrapper = mount(SnPagination, { props: { totalPage: 20, modelValue: 10 } });
      const pages = wrapper.findAll('.sn-pagination__page-text').map((node) => node.text());
      expect(pages[0]).toBe('1');
      expect(pages.at(-1)).toBe('20');
    });
  });

  describe('v-model', () => {
    it('marks the current page with aria-current', () => {
      const wrapper = mount(SnPagination, { props: { totalPage: 5, modelValue: 3 } });
      const active = wrapper
        .findAll('.sn-pagination__page')
        .filter((node) => node.attributes('aria-current') === 'page');
      expect(active).toHaveLength(1);
      expect(active[0]!.text()).toBe('3');
    });

    it('emits update:modelValue on page tap', async () => {
      const wrapper = mount(SnPagination, { props: { totalPage: 5, modelValue: 1 } });
      await wrapper.findAll('.sn-pagination__page')[2]!.trigger('tap');
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([3]);
    });

    it('emits change with { value } on page tap', async () => {
      const wrapper = mount(SnPagination, { props: { totalPage: 5, modelValue: 1 } });
      await wrapper.findAll('.sn-pagination__page')[1]!.trigger('tap');
      expect(wrapper.emitted('change')?.at(-1)).toEqual([{ value: 2 }]);
    });

    it('does not emit when the current page is tapped again', async () => {
      const wrapper = mount(SnPagination, { props: { totalPage: 5, modelValue: 2 } });
      await wrapper.findAll('.sn-pagination__page')[1]!.trigger('tap');
      expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });

    it('clamps an out-of-range modelValue into the window', () => {
      const wrapper = mount(SnPagination, { props: { totalPage: 5, modelValue: 99 } });
      const active = wrapper
        .findAll('.sn-pagination__page')
        .filter((node) => node.attributes('aria-current') === 'page');
      expect(active[0]!.text()).toBe('5');
    });
  });

  describe('prev / next', () => {
    it('steps back from the current page', async () => {
      const wrapper = mount(SnPagination, { props: { totalPage: 5, modelValue: 3 } });
      await wrapper.find('.sn-pagination__prev').trigger('tap');
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([2]);
    });

    it('steps forward from the current page', async () => {
      const wrapper = mount(SnPagination, { props: { totalPage: 5, modelValue: 3 } });
      await wrapper.find('.sn-pagination__next').trigger('tap');
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([4]);
    });

    it('disables prev on the first page', async () => {
      const wrapper = mount(SnPagination, { props: { totalPage: 5, modelValue: 1 } });
      expect(wrapper.find('.sn-pagination__prev').attributes('aria-disabled')).toBe('true');
      await wrapper.find('.sn-pagination__prev').trigger('tap');
      expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });

    it('disables next on the last page', async () => {
      const wrapper = mount(SnPagination, { props: { totalPage: 5, modelValue: 5 } });
      expect(wrapper.find('.sn-pagination__next').attributes('aria-disabled')).toBe('true');
      await wrapper.find('.sn-pagination__next').trigger('tap');
      expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });

    it('renders prevText / nextText', () => {
      const wrapper = mount(SnPagination, {
        props: { totalPage: 3, modelValue: 2, prevText: 'Prev', nextText: 'Next' },
      });
      expect(wrapper.find('.sn-pagination__prev').text()).toBe('Prev');
      expect(wrapper.find('.sn-pagination__next').text()).toBe('Next');
    });

    it('renders the chevron icons when showIcon is on', () => {
      const wrapper = mount(SnPagination, {
        props: { totalPage: 3, modelValue: 2, showIcon: true },
      });
      expect(wrapper.find('.sn-pagination__prev .sn-icon').exists()).toBe(true);
      expect(wrapper.find('.sn-pagination__next .sn-icon').exists()).toBe(true);
    });

    it('hides the icons by default', () => {
      const wrapper = mount(SnPagination, { props: { totalPage: 3, modelValue: 2 } });
      expect(wrapper.find('.sn-pagination__prev .sn-icon').exists()).toBe(false);
    });
  });

  describe('message / hide / variants', () => {
    it('renders the message only when showMessage is on', () => {
      const on = mount(SnPagination, {
        props: { totalPage: 5, modelValue: 2, showMessage: true },
      });
      expect(on.find('.sn-pagination__message').exists()).toBe(true);
      expect(on.find('.sn-pagination__message-text').text()).toBe('2 / 5');
      expect(
        mount(SnPagination, { props: { totalPage: 5, modelValue: 2 } })
          .find('.sn-pagination__message')
          .exists(),
      ).toBe(false);
    });

    it('hides entirely for a single page when hideIfOnePage is on', () => {
      const wrapper = mount(SnPagination, {
        props: { totalPage: 1, modelValue: 1, hideIfOnePage: true },
      });
      expect(wrapper.find('.sn-pagination').exists()).toBe(false);
    });

    it('still renders a single page when hideIfOnePage is off', () => {
      const wrapper = mount(SnPagination, { props: { totalPage: 1, modelValue: 1 } });
      expect(wrapper.find('.sn-pagination').exists()).toBe(true);
    });

    it('applies the button variant class', () => {
      expect(mount(SnPagination, { props: { buttonVariant: 'dashed' } }).classes()).toContain(
        'sn-pagination--dashed',
      );
    });

    it('forwards customClass and customStyle', () => {
      const wrapper = mount(SnPagination, {
        props: { customClass: 'my-pager', customStyle: 'margin: 4px;' },
      });
      expect(wrapper.classes()).toContain('my-pager');
      expect(wrapper.attributes('style')).toContain('margin: 4px');
    });
  });

  describe('slots / accessibility', () => {
    it('exposes the slot scope to the size slot', () => {
      const wrapper = mount(SnPagination, {
        props: { totalPage: 4, modelValue: 2 },
        slots: {
          size: `<template #size="{ modelValue, totalPageNum }">
            <text class="custom-size">{{ modelValue }}/{{ totalPageNum }}</text>
          </template>`,
        },
      });
      expect(wrapper.find('.custom-size').text()).toBe('2/4');
    });

    it('exposes role="navigation" on the root', () => {
      expect(mount(SnPagination).attributes('role')).toBe('navigation');
    });

    it('marks the page buttons as role="button"', () => {
      const wrapper = mount(SnPagination, { props: { totalPage: 3, modelValue: 1 } });
      expect(wrapper.find('.sn-pagination__page').attributes('role')).toBe('button');
    });

    it('marks ellipses as decorative', () => {
      const wrapper = mount(SnPagination, { props: { totalPage: 20, modelValue: 10 } });
      expect(wrapper.find('.sn-pagination__ellipsis').attributes('aria-hidden')).toBe('true');
    });
  });
});
