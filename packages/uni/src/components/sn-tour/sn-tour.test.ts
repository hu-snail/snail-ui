/**
 * sn-tour unit tests — uni-end guided tour.
 *
 * Behaviour only (AGENTS.md §46): the open flag, the step cursor contract,
 * prev / next / finish / skip wiring, the mask tap option and the clamping of
 * a stale index. No rpx numbers in assertions — happy-dom discards lengths it
 * cannot parse.
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SnTour from './sn-tour.vue';

const STEPS = [
  { element: '#a', content: 'First step' },
  { element: '#b', content: 'Second step' },
  { element: '#c', content: 'Third step' },
];

describe('sn-tour', () => {
  describe('visibility', () => {
    it('renders nothing while modelValue is false', () => {
      const wrapper = mount(SnTour, { props: { modelValue: false, steps: STEPS } });
      expect(wrapper.find('.sn-tour').exists()).toBe(false);
    });

    it('renders the panel while modelValue is true', () => {
      const wrapper = mount(SnTour, { props: { modelValue: true, steps: STEPS } });
      expect(wrapper.find('.sn-tour__panel').exists()).toBe(true);
    });

    it('renders the mask by default', () => {
      const wrapper = mount(SnTour, { props: { modelValue: true, steps: STEPS } });
      expect(wrapper.find('.sn-tour__mask').exists()).toBe(true);
    });

    it('drops the mask when mask is off', () => {
      const wrapper = mount(SnTour, {
        props: { modelValue: true, steps: STEPS, mask: false },
      });
      expect(wrapper.find('.sn-tour__mask').exists()).toBe(false);
    });

    it('applies maskColor inline', () => {
      const wrapper = mount(SnTour, {
        props: { modelValue: true, steps: STEPS, maskColor: 'rgba(1, 2, 3, 0.5)' },
      });
      expect(wrapper.find('.sn-tour__mask').attributes('style')).toContain(
        'background-color: rgba(1, 2, 3, 0.5)',
      );
    });
  });

  describe('step content', () => {
    it('renders the first step content', () => {
      const wrapper = mount(SnTour, { props: { modelValue: true, steps: STEPS } });
      expect(wrapper.find('.sn-tour__text').text()).toBe('First step');
    });

    it('renders the step selected by current', () => {
      const wrapper = mount(SnTour, {
        props: { modelValue: true, steps: STEPS, current: 2 },
      });
      expect(wrapper.find('.sn-tour__text').text()).toBe('Third step');
    });

    it('clamps an out-of-range current', () => {
      const wrapper = mount(SnTour, {
        props: { modelValue: true, steps: STEPS, current: 99 },
      });
      expect(wrapper.find('.sn-tour__text').text()).toBe('Third step');
    });

    it('renders the progress indicator', () => {
      const wrapper = mount(SnTour, {
        props: { modelValue: true, steps: STEPS, current: 1 },
      });
      expect(wrapper.find('.sn-tour__progress').text()).toBe('2 / 3');
    });

    it('exposes the step through the default slot', () => {
      const wrapper = mount(SnTour, {
        props: { modelValue: true, steps: STEPS },
        slots: {
          default: `<template #default="{ step, current, total }">
            <text class="custom-step">{{ step?.content }}|{{ current }}|{{ total }}</text>
          </template>`,
        },
      });
      expect(wrapper.find('.custom-step').text()).toBe('First step|0|3');
    });
  });

  describe('navigation', () => {
    it('advances the step and emits update:current + change', async () => {
      const wrapper = mount(SnTour, { props: { modelValue: true, steps: STEPS } });
      await wrapper.find('.sn-tour__next').trigger('tap');
      expect(wrapper.emitted('update:current')?.at(-1)).toEqual([1]);
      expect(wrapper.emitted('change')?.at(-1)).toEqual([{ current: 1 }]);
    });

    it('emits next with the navigation payload', async () => {
      const wrapper = mount(SnTour, { props: { modelValue: true, steps: STEPS } });
      await wrapper.find('.sn-tour__next').trigger('tap');
      expect(wrapper.emitted('next')?.at(-1)).toEqual([
        { prevCurrent: 0, current: 1, total: 3, isElementInTop: false },
      ]);
    });

    it('hides the prev button on the first step', () => {
      const wrapper = mount(SnTour, { props: { modelValue: true, steps: STEPS } });
      expect(wrapper.find('.sn-tour__prev').exists()).toBe(false);
    });

    it('shows prev from the second step and steps back', async () => {
      const wrapper = mount(SnTour, {
        props: { modelValue: true, steps: STEPS, current: 1 },
      });
      expect(wrapper.find('.sn-tour__prev').exists()).toBe(true);
      await wrapper.find('.sn-tour__prev').trigger('tap');
      expect(wrapper.emitted('update:current')?.at(-1)).toEqual([0]);
      expect(wrapper.emitted('prev')?.at(-1)).toEqual([
        { prevCurrent: 1, current: 0, total: 3, isElementInTop: true },
      ]);
    });

    it('finishes on the last step instead of advancing', async () => {
      const wrapper = mount(SnTour, {
        props: { modelValue: true, steps: STEPS, current: 2 },
      });
      await wrapper.find('.sn-tour__next').trigger('tap');
      expect(wrapper.emitted('finish')?.at(-1)).toEqual([{ current: 2, total: 3 }]);
      expect(wrapper.emitted('update:current')).toBeUndefined();
    });

    it('closes on finish', async () => {
      const wrapper = mount(SnTour, {
        props: { modelValue: true, steps: STEPS, current: 2 },
      });
      await wrapper.find('.sn-tour__next').trigger('tap');
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false]);
    });

    it('labels the last step button with finishText', () => {
      const wrapper = mount(SnTour, {
        props: { modelValue: true, steps: STEPS, current: 2, finishText: 'Done' },
      });
      expect(wrapper.find('.sn-tour__next').text()).toBe('Done');
    });

    it('uses nextText before the last step', () => {
      const wrapper = mount(SnTour, {
        props: { modelValue: true, steps: STEPS, nextText: 'Forward' },
      });
      expect(wrapper.find('.sn-tour__next').text()).toBe('Forward');
    });

    it('skips and closes', async () => {
      const wrapper = mount(SnTour, { props: { modelValue: true, steps: STEPS } });
      await wrapper.find('.sn-tour__skip').trigger('tap');
      expect(wrapper.emitted('skip')?.at(-1)).toEqual([{ current: 0, total: 3 }]);
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false]);
    });

    it('renders custom button copy', () => {
      const wrapper = mount(SnTour, {
        props: {
          modelValue: true,
          steps: STEPS,
          current: 1,
          prevText: 'Back',
          skipText: 'Dismiss',
        },
      });
      expect(wrapper.find('.sn-tour__prev').text()).toBe('Back');
      expect(wrapper.find('.sn-tour__skip').text()).toBe('Dismiss');
    });

    it('hides the buttons when showTourButtons is off', () => {
      const wrapper = mount(SnTour, {
        props: { modelValue: true, steps: STEPS, showTourButtons: false },
      });
      expect(wrapper.find('.sn-tour__actions').exists()).toBe(false);
    });

    it('advances on mask tap only when clickMaskNext is on', async () => {
      const off = mount(SnTour, { props: { modelValue: true, steps: STEPS } });
      await off.find('.sn-tour__mask').trigger('tap');
      expect(off.emitted('update:current')).toBeUndefined();

      const on = mount(SnTour, {
        props: { modelValue: true, steps: STEPS, clickMaskNext: true },
      });
      await on.find('.sn-tour__mask').trigger('tap');
      expect(on.emitted('update:current')?.at(-1)).toEqual([1]);
    });
  });

  describe('layout / accessibility', () => {
    it('writes z-index only when given', () => {
      expect(
        mount(SnTour, { props: { modelValue: true, steps: STEPS, zIndex: 200 } }).attributes(
          'style',
        ),
      ).toContain('z-index: 200');
      expect(
        mount(SnTour, { props: { modelValue: true, steps: STEPS } }).attributes('style'),
      ).toBeUndefined();
    });

    it('forwards customClass and customStyle', () => {
      const wrapper = mount(SnTour, {
        props: {
          modelValue: true,
          steps: STEPS,
          customClass: 'my-tour',
          customStyle: 'margin: 4px;',
        },
      });
      expect(wrapper.classes()).toContain('my-tour');
      expect(wrapper.attributes('style')).toContain('margin: 4px');
    });

    it('exposes role="dialog" with aria-modal', () => {
      const wrapper = mount(SnTour, { props: { modelValue: true, steps: STEPS } });
      expect(wrapper.attributes('role')).toBe('dialog');
      expect(wrapper.attributes('aria-modal')).toBe('true');
    });

    it('marks the buttons as role="button" with labels', () => {
      const wrapper = mount(SnTour, { props: { modelValue: true, steps: STEPS } });
      expect(wrapper.find('.sn-tour__next').attributes('role')).toBe('button');
      expect(wrapper.find('.sn-tour__next').attributes('aria-label')).toBe('下一步');
    });
  });

  describe('empty / imperative', () => {
    it('renders an empty panel without steps', () => {
      const wrapper = mount(SnTour, { props: { modelValue: true } });
      expect(wrapper.find('.sn-tour__panel').exists()).toBe(true);
      expect(wrapper.find('.sn-tour__progress').text()).toBe('1 / 0');
    });

    it('exposes the navigation methods', async () => {
      const wrapper = mount(SnTour, { props: { modelValue: true, steps: STEPS } });
      const vm = wrapper.vm as unknown as { handleNext: () => void };
      vm.handleNext();
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('update:current')?.at(-1)).toEqual([1]);
    });
  });

  /* ── Added coverage ──────────────────────────────────────────────────── */

  describe('imperative edges', () => {
    it('ignores handlePrev on the first step', async () => {
      const wrapper = mount(SnTour, { props: { modelValue: true, steps: STEPS } });
      const vm = wrapper.vm as unknown as { handlePrev: () => void };
      vm.handlePrev();
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('prev')).toBeUndefined();
      expect(wrapper.emitted('update:current')).toBeUndefined();
    });

    it('finishes through handleFinish with the payload and closes', async () => {
      const wrapper = mount(SnTour, { props: { modelValue: true, steps: STEPS, current: 1 } });
      const vm = wrapper.vm as unknown as { handleFinish: () => void };
      vm.handleFinish();
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('finish')?.at(-1)).toEqual([{ current: 1, total: 3 }]);
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false]);
    });

    it('closes through handleSkip from any step', async () => {
      const wrapper = mount(SnTour, { props: { modelValue: true, steps: STEPS, current: 2 } });
      const vm = wrapper.vm as unknown as { handleSkip: () => void };
      vm.handleSkip();
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('skip')?.at(-1)).toEqual([{ current: 2, total: 3 }]);
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false]);
    });
  });

  describe('controlled current', () => {
    it('follows an externally updated current prop', async () => {
      const wrapper = mount(SnTour, { props: { modelValue: true, steps: STEPS, current: 0 } });
      await wrapper.setProps({ current: 2 });
      expect(wrapper.find('.sn-tour__text').text()).toBe('Third step');
      expect(wrapper.find('.sn-tour__progress').text()).toBe('3 / 3');
    });

    it('emits change for each step of a full run', async () => {
      const wrapper = mount(SnTour, { props: { modelValue: true, steps: STEPS } });
      await wrapper.find('.sn-tour__next').trigger('tap');
      await wrapper.find('.sn-tour__next').trigger('tap');
      await wrapper.find('.sn-tour__next').trigger('tap'); // last step → finish
      expect(wrapper.emitted('change')?.map((entry) => entry)).toEqual([
        [{ current: 1 }],
        [{ current: 2 }],
      ]);
      expect(wrapper.emitted('finish')?.at(-1)).toEqual([{ current: 2, total: 3 }]);
    });
  });

  describe('mask tap edges', () => {
    it('finishes instead of advancing when the mask is tapped on the last step', async () => {
      const wrapper = mount(SnTour, {
        props: { modelValue: true, steps: STEPS, current: 2, clickMaskNext: true },
      });
      await wrapper.find('.sn-tour__mask').trigger('tap');
      expect(wrapper.emitted('finish')?.at(-1)).toEqual([{ current: 2, total: 3 }]);
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false]);
    });

    it('does not close when the mask is tapped without clickMaskNext', async () => {
      const wrapper = mount(SnTour, { props: { modelValue: true, steps: STEPS } });
      await wrapper.find('.sn-tour__mask').trigger('tap');
      expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });
  });

  describe('slots', () => {
    it('exposes the step through the footer slot', () => {
      const wrapper = mount(SnTour, {
        props: { modelValue: true, steps: STEPS, current: 1 },
        slots: {
          footer: `<template #footer="{ step, current, total }">
            <text class="custom-footer">{{ step?.content }}|{{ current }}|{{ total }}</text>
          </template>`,
        },
      });
      expect(wrapper.find('.custom-footer').text()).toBe('Second step|1|3');
      expect(wrapper.find('.sn-tour__actions').exists()).toBe(false);
    });
  });

  describe('layout knobs', () => {
    it('writes the duration custom property only when it differs from the default', () => {
      const custom = mount(SnTour, { props: { modelValue: true, steps: STEPS, duration: 500 } });
      expect(custom.attributes('style')).toContain('--snui-tour-duration: 500ms');

      const legacy = mount(SnTour, { props: { modelValue: true, steps: STEPS } });
      expect(legacy.attributes('style')).toBeUndefined();
    });

    it('exposes the border radius as a custom property', () => {
      const wrapper = mount(SnTour, {
        props: { modelValue: true, steps: STEPS, borderRadius: 12 },
      });
      expect(wrapper.find('.sn-tour__panel').attributes('style')).toContain(
        '--snui-tour-radius: 12px',
      );
    });
  });

  describe('accessibility (added)', () => {
    it('labels the dialog and the skip / finish buttons', () => {
      const first = mount(SnTour, { props: { modelValue: true, steps: STEPS, skipText: 'Skip' } });
      expect(first.attributes('aria-label')).toBe('Guide');
      expect(first.find('.sn-tour__skip').attributes('aria-label')).toBe('Skip');

      const last = mount(SnTour, {
        props: { modelValue: true, steps: STEPS, current: 2, finishText: 'Done' },
      });
      expect(last.find('.sn-tour__next').attributes('aria-label')).toBe('Done');
    });

    it('labels the prev button with the prevText', () => {
      const wrapper = mount(SnTour, {
        props: { modelValue: true, steps: STEPS, current: 1, prevText: 'Back' },
      });
      expect(wrapper.find('.sn-tour__prev').attributes('aria-label')).toBe('Back');
    });
  });

  describe('accepted parity props', () => {
    it('accepts the measurement-dependent props without effect', () => {
      // element / padding / offset / placement / missingStrategy are part of
      // the frozen wd-tour contract but need element measurement (unavailable
      // on the uni end); accepting them without effect is the documented
      // behaviour, so they must not break rendering.
      const wrapper = mount(SnTour, {
        props: {
          modelValue: true,
          steps: [{ ...STEPS[0], placement: 'top', padding: 4, offset: 8 }],
          missingStrategy: 'skip',
          customNav: true,
          highlightStyle: { border: '2px solid red' },
          bottomSafetyOffset: 50,
          topSafetyOffset: 10,
        },
      });
      expect(wrapper.find('.sn-tour__text').text()).toBe('First step');
    });
  });

  describe('press feedback (hover-class)', () => {
    it('wires the pressed class on every built-in tour button', () => {
      const wrapper = mount(SnTour, { props: { modelValue: true, steps: STEPS, current: 1 } });
      for (const button of wrapper.findAll('.sn-tour__button')) {
        expect(button.attributes('hover-class')).toBe('sn-tour__button--pressed');
      }
      expect(wrapper.findAll('.sn-tour__button').length).toBeGreaterThanOrEqual(2);
    });
  });
});
