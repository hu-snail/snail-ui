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
  describe('press feedback (hover-class)', () => {
    it('wires the pressed class on page buttons', () => {
      const wrapper = mount(SnPagination, { props: { totalPage: 3, modelValue: 2 } });
      for (const page of wrapper.findAll('.sn-pagination__page')) {
        expect(page.attributes('hover-class')).toBe('sn-pagination__page--pressed');
      }
    });

    it('wires the pressed class on enabled stepper buttons', () => {
      const wrapper = mount(SnPagination, { props: { totalPage: 3, modelValue: 2 } });
      expect(wrapper.find('.sn-pagination__prev').attributes('hover-class')).toBe(
        'sn-pagination__button--pressed',
      );
      expect(wrapper.find('.sn-pagination__next').attributes('hover-class')).toBe(
        'sn-pagination__button--pressed',
      );
    });

    it('keeps the boundary stepper buttons inert', () => {
      const wrapper = mount(SnPagination, { props: { totalPage: 3, modelValue: 1 } });
      expect(wrapper.find('.sn-pagination__prev').attributes('hover-class')).toBe('none');
      expect(wrapper.find('.sn-pagination__next').attributes('hover-class')).toBe(
        'sn-pagination__button--pressed',
      );
    });
  });

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

    it('labels the prev / next buttons, honouring the custom texts', () => {
      const custom = mount(SnPagination, {
        props: { totalPage: 3, modelValue: 2, prevText: 'Prev', nextText: 'Next' },
      });
      expect(custom.find('.sn-pagination__prev').attributes('aria-label')).toBe('Prev');
      expect(custom.find('.sn-pagination__next').attributes('aria-label')).toBe('Next');
      const fallback = mount(SnPagination, { props: { totalPage: 3, modelValue: 2 } });
      expect(fallback.find('.sn-pagination__prev').attributes('aria-label')).toBe('Previous page');
      expect(fallback.find('.sn-pagination__next').attributes('aria-label')).toBe('Next page');
    });

    it('labels each page button with its number', () => {
      const wrapper = mount(SnPagination, { props: { totalPage: 3, modelValue: 1 } });
      expect(wrapper.findAll('.sn-pagination__page')[1]!.attributes('aria-label')).toBe('Page 2');
    });
  });

  describe('window shape', () => {
    it('renders the exact centred window for a mid run', () => {
      const wrapper = mount(SnPagination, { props: { totalPage: 20, modelValue: 10 } });
      const texts = wrapper.findAll('.sn-pagination__pages').map((node) => node.text())[0] ?? '';
      expect(texts).toBe('1…89101112…20');
    });

    it('keeps pages 1-4 without a left ellipsis near the start', () => {
      const wrapper = mount(SnPagination, { props: { totalPage: 20, modelValue: 2 } });
      const texts = wrapper.findAll('.sn-pagination__pages').map((node) => node.text())[0] ?? '';
      expect(texts).toBe('1234…20');
    });

    it('derives a single page when total is under pageSize', () => {
      const wrapper = mount(SnPagination, {
        props: { total: 5, pageSize: 10, modelValue: 1, showMessage: true },
      });
      expect(wrapper.find('.sn-pagination__message-text').text()).toBe('1 / 1');
    });

    it('guards against a zero pageSize without crashing', () => {
      const wrapper = mount(SnPagination, {
        props: { total: 95, pageSize: 0, modelValue: 1, showMessage: true },
      });
      expect(wrapper.find('.sn-pagination__message-text').text()).toBe('1 / 95');
    });
  });

  describe('prev / next / message slots', () => {
    it('replaces the prev and next buttons through their slots', () => {
      const wrapper = mount(SnPagination, {
        props: { totalPage: 3, modelValue: 2 },
        slots: {
          prev: '<text class="custom-prev">‹ back</text>',
          next: '<text class="custom-next">fwd ›</text>',
        },
      });
      expect(wrapper.find('.custom-prev').exists()).toBe(true);
      expect(wrapper.find('.custom-next').exists()).toBe(true);
      expect(wrapper.find('.sn-pagination__prev').text()).toBe('‹ back');
      expect(wrapper.find('.sn-pagination__next').text()).toBe('fwd ›');
    });

    it('exposes the scope to the message slot', () => {
      const wrapper = mount(SnPagination, {
        props: { total: 45, pageSize: 10, modelValue: 2, showMessage: true },
        slots: {
          message:
            '<template #message="{ modelValue, totalPageNum, total, pageSize }"><text class="custom-msg">{{ modelValue }}/{{ totalPageNum }}/{{ total }}/{{ pageSize }}</text></template>',
        },
      });
      expect(wrapper.find('.custom-msg').text()).toBe('2/5/45/10');
    });

    it('keeps prev / next working while a size slot is in use', async () => {
      const wrapper = mount(SnPagination, {
        props: { totalPage: 3, modelValue: 1 },
        slots: { size: '<text class="custom-size">pages</text>' },
      });
      await wrapper.find('.sn-pagination__next').trigger('tap');
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([2]);
      expect(wrapper.find('.custom-size').exists()).toBe(true);
    });
  });

  describe('disabled state', () => {
    it('blocks all page taps while disabled', async () => {
      const wrapper = mount(SnPagination, { props: { totalPage: 5, modelValue: 2, disabled: true } });
      await wrapper.findAll('.sn-pagination__page')[3]!.trigger('tap');
      await wrapper.find('.sn-pagination__prev').trigger('tap');
      await wrapper.find('.sn-pagination__next').trigger('tap');
      expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });

    it('marks the root and steppers aria-disabled', () => {
      const wrapper = mount(SnPagination, { props: { totalPage: 5, modelValue: 2, disabled: true } });
      expect(wrapper.attributes('aria-disabled')).toBe('true');
      expect(wrapper.find('.sn-pagination__prev').attributes('aria-disabled')).toBe('true');
      expect(wrapper.find('.sn-pagination__next').attributes('aria-disabled')).toBe('true');
      expect(wrapper.classes()).toContain('sn-pagination--disabled');
    });

    it('keeps steppers interactive when not disabled', () => {
      const wrapper = mount(SnPagination, { props: { totalPage: 5, modelValue: 2 } });
      expect(wrapper.attributes('aria-disabled')).toBeUndefined();
    });
  });

  describe('simple mode', () => {
    it('renders the 1 / n text instead of the page strip', () => {
      const wrapper = mount(SnPagination, { props: { totalPage: 8, modelValue: 3, simple: true } });
      expect(wrapper.find('.sn-pagination__simple-text').text()).toBe('3 / 8');
      expect(wrapper.find('.sn-pagination__pages').exists()).toBe(false);
    });

    it('keeps prev / next working in simple mode', async () => {
      const wrapper = mount(SnPagination, { props: { totalPage: 8, modelValue: 3, simple: true } });
      await wrapper.find('.sn-pagination__next').trigger('tap');
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([4]);
    });

    it('does not render the simple branch by default', () => {
      const wrapper = mount(SnPagination, { props: { totalPage: 8, modelValue: 3 } });
      expect(wrapper.find('.sn-pagination__simple').exists()).toBe(false);
      expect(wrapper.find('.sn-pagination__pages').exists()).toBe(true);
    });
  });
});
