/**
 * SnSlider unit tests — web-end slider (naive-ui n-slider parity).
 *
 * Tests cover behavior, not implementation detail (AGENTS.md §46):
 *   - click-to-set and mouse drag update
 *   - range dual-handle drag + ordering guard
 *   - step snapping
 *   - disabled / readonly suppress interaction
 *   - keyboard: arrows / Home / End / PageUp / PageDown
 *   - marks render and are clickable
 *   - vertical orientation geometry
 *   - tooltip / formatTooltip
 *   - ARIA slider semantics
 *   - visual regression: computed styles (rail positioning, fill track
 *     sizing) and the active-handle class on hover/focus
 *
 * vitest runs with CSS processing off, so the SFC <style> is never injected;
 * the visual-regression block injects the real stylesheet into the document
 * itself before asserting on getComputedStyle (happy-dom cascades it).
 *
 * jsdom has no layout: getBoundingClientRect is mocked to a fixed rect.
 */

import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import SnSlider from './SnSlider.vue';

/** Horizontal track rect: x 0..200. Vertical: y 0..200 (top 0). */
const H_RECT = {
  left: 0,
  top: 0,
  right: 200,
  bottom: 6,
  width: 200,
  height: 6,
  x: 0,
  y: 0,
  toJSON: () => ({}),
};
const V_RECT = {
  left: 0,
  top: 0,
  right: 6,
  bottom: 200,
  width: 6,
  height: 200,
  x: 0,
  y: 0,
  toJSON: () => ({}),
};

function withRect(rect: DOMRect, fn: () => void): void {
  const spy = vi
    .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
    .mockReturnValue(rect as DOMRect);
  try {
    fn();
  } finally {
    spy.mockRestore();
  }
}

function mouse(type: string, x: number, y = 3): MouseEvent {
  return new MouseEvent(type, { clientX: x, clientY: y, bubbles: true, cancelable: true });
}

/**
 * Stateful host so `update:modelValue` actually flows back into the slider
 * (real-world v-model behavior — consecutive updates accumulate).
 */
import { defineComponent, h, ref } from 'vue';

function mountSlider(props: Record<string, unknown>) {
  const valueRef = ref<unknown>(props.modelValue ?? props.defaultValue);
  const host = defineComponent({
    setup() {
      return () =>
        h(SnSlider, {
          ...props,
          modelValue: valueRef.value,
          'onUpdate:modelValue': (v: unknown) => {
            valueRef.value = v;
          },
        });
    },
  });
  const wrapper = mount(host);
  return {
    wrapper,
    slider: () => wrapper.findComponent(SnSlider),
    value: () => valueRef.value,
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('SnSlider', () => {
  it('renders a slider handle with role=slider and aria values', () => {
    const wrapper = mount(SnSlider, { props: { modelValue: 40, min: 0, max: 100 } });
    const handle = wrapper.find('[role="slider"]');
    expect(handle.exists()).toBe(true);
    expect(handle.attributes('aria-valuemin')).toBe('0');
    expect(handle.attributes('aria-valuemax')).toBe('100');
    expect(handle.attributes('aria-valuenow')).toBe('40');
    expect(handle.attributes('aria-orientation')).toBe('horizontal');
  });

  it('emits update:modelValue when the track is clicked', () => {
    const wrapper = mount(SnSlider, { props: { modelValue: 0 } });
    withRect(H_RECT as DOMRect, () => {
      wrapper.find('.sn-slider__rail').element.dispatchEvent(mouse('mousedown', 100));
      document.dispatchEvent(new MouseEvent('mouseup'));
    });
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([50]);
    expect(wrapper.emitted('change')).toHaveLength(1);
  });

  it('updates value while dragging via mousemove', () => {
    const wrapper = mount(SnSlider, { props: { modelValue: 0 } });
    withRect(H_RECT as DOMRect, () => {
      wrapper.find('.sn-slider__rail').element.dispatchEvent(mouse('mousedown', 40));
      document.dispatchEvent(mouse('mousemove', 120));
      document.dispatchEvent(mouse('mousemove', 180));
      document.dispatchEvent(new MouseEvent('mouseup'));
    });
    const updates = wrapper.emitted('update:modelValue') ?? [];
    expect(updates.at(-1)).toEqual([90]);
    expect(updates.length).toBeGreaterThanOrEqual(3);
  });

  it('clamps clicks outside the track bounds', () => {
    const wrapper = mount(SnSlider, { props: { modelValue: 50 } });
    withRect(H_RECT as DOMRect, () => {
      wrapper.find('.sn-slider__rail').element.dispatchEvent(mouse('mousedown', 999));
      document.dispatchEvent(new MouseEvent('mouseup'));
    });
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([100]);
  });

  it('snaps pointer values to the step grid', () => {
    const wrapper = mount(SnSlider, { props: { modelValue: 0, step: 10 } });
    withRect(H_RECT as DOMRect, () => {
      // 55% of 100 = 55 → snaps to 60
      wrapper.find('.sn-slider__rail').element.dispatchEvent(mouse('mousedown', 110));
      document.dispatchEvent(new MouseEvent('mouseup'));
    });
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([60]);
  });

  it('renders two handles in range mode', () => {
    const wrapper = mount(SnSlider, {
      props: { modelValue: [20, 80], range: true },
    });
    const handles = wrapper.findAll('[role="slider"]');
    expect(handles).toHaveLength(2);
    expect(handles[0].attributes('aria-valuenow')).toBe('20');
    expect(handles[1].attributes('aria-valuenow')).toBe('80');
  });

  it('drags the closer handle when clicking inside a range', () => {
    const wrapper = mount(SnSlider, {
      props: { modelValue: [20, 80], range: true },
    });
    withRect(H_RECT as DOMRect, () => {
      // x=100 → value 50; closer to 80, drags the end handle down to 50
      wrapper.find('.sn-slider__rail').element.dispatchEvent(mouse('mousedown', 100));
      document.dispatchEvent(new MouseEvent('mouseup'));
    });
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[20, 50]]);
  });

  it('clamps the low handle at the high handle (handles do not cross)', () => {
    const { slider } = mountSlider({ modelValue: [20, 80], range: true });
    withRect(H_RECT as DOMRect, () => {
      // Drag the start handle (index 0) past the end handle — clamped at 80
      slider().findAll('[role="slider"]')[0].element.dispatchEvent(mouse('mousedown', 10));
      document.dispatchEvent(mouse('mousemove', 190));
      document.dispatchEvent(new MouseEvent('mouseup'));
    });
    expect(slider().emitted('update:modelValue')?.at(-1)).toEqual([[80, 80]]);
  });

  it('supports defaultValue as uncontrolled initial value', async () => {
    const wrapper = mount(SnSlider, {
      props: { defaultValue: 30 },
      attachTo: document.body,
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.find('[role="slider"]').attributes('aria-valuenow')).toBe('30');
    wrapper.unmount();
  });

  it('suppresses interaction when disabled', () => {
    const wrapper = mount(SnSlider, { props: { modelValue: 10, disabled: true } });
    expect(wrapper.classes()).toContain('sn-slider--disabled');
    expect(wrapper.find('[role="slider"]').attributes('tabindex')).toBe('-1');
    withRect(H_RECT as DOMRect, () => {
      wrapper.find('.sn-slider__rail').element.dispatchEvent(mouse('mousedown', 100));
      document.dispatchEvent(new MouseEvent('mouseup'));
    });
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('suppresses interaction when readonly', () => {
    const wrapper = mount(SnSlider, { props: { modelValue: 10, readonly: true } });
    withRect(H_RECT as DOMRect, () => {
      wrapper.find('.sn-slider__rail').element.dispatchEvent(mouse('mousedown', 100));
      document.dispatchEvent(new MouseEvent('mouseup'));
    });
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('increases value with ArrowRight and commits change', async () => {
    const wrapper = mount(SnSlider, { props: { modelValue: 40, step: 5 } });
    await wrapper.find('[role="slider"]').trigger('keydown', { key: 'ArrowRight' });
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([45]);
    expect(wrapper.emitted('change')?.at(-1)).toEqual([45]);
  });

  it('supports ArrowUp / ArrowLeft / ArrowDown', async () => {
    const { slider } = mountSlider({ modelValue: 50 });
    const handle = slider().find('[role="slider"]');
    await handle.trigger('keydown', { key: 'ArrowUp' });
    expect(slider().emitted('update:modelValue')?.at(-1)).toEqual([51]);
    await handle.trigger('keydown', { key: 'ArrowLeft' });
    expect(slider().emitted('update:modelValue')?.at(-1)).toEqual([50]);
    await handle.trigger('keydown', { key: 'ArrowDown' });
    expect(slider().emitted('update:modelValue')?.at(-1)).toEqual([49]);
  });

  it('jumps to min with Home and max with End', async () => {
    const wrapper = mount(SnSlider, { props: { modelValue: 50 } });
    const handle = wrapper.find('[role="slider"]');
    await handle.trigger('keydown', { key: 'Home' });
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([0]);
    await handle.trigger('keydown', { key: 'End' });
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([100]);
  });

  it('moves by 10 steps with PageUp / PageDown', async () => {
    const { slider } = mountSlider({ modelValue: 50, step: 2 });
    const handle = slider().find('[role="slider"]');
    await handle.trigger('keydown', { key: 'PageUp' });
    expect(slider().emitted('update:modelValue')?.at(-1)).toEqual([70]);
    await handle.trigger('keydown', { key: 'PageDown' });
    expect(slider().emitted('update:modelValue')?.at(-1)).toEqual([50]);
  });

  it('clamps keyboard navigation at the bounds', async () => {
    const wrapper = mount(SnSlider, { props: { modelValue: 100 } });
    await wrapper.find('[role="slider"]').trigger('keydown', { key: 'ArrowRight' });
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([100]);
  });

  it('moves only the focused handle in range mode', async () => {
    const { slider } = mountSlider({ modelValue: [20, 80], range: true });
    const handles = slider().findAll('[role="slider"]');
    await handles[1].trigger('keydown', { key: 'ArrowRight' });
    expect(slider().emitted('update:modelValue')?.at(-1)).toEqual([[20, 81]]);
    await handles[0].trigger('keydown', { key: 'ArrowLeft' });
    expect(slider().emitted('update:modelValue')?.at(-1)).toEqual([[19, 81]]);
  });

  it('renders marks with labels and clickable dots', () => {
    const wrapper = mount(SnSlider, {
      props: { modelValue: 10, marks: { 0: 'Min', 50: 'Mid', 100: 'Max' } },
    });
    const labels = wrapper.findAll('.sn-slider__mark-label');
    expect(labels.map((l) => l.text())).toEqual(['Min', 'Mid', 'Max']);
    expect(wrapper.findAll('.sn-slider__mark')).toHaveLength(3);
  });

  it('jumps to a mark value when the mark dot is clicked', async () => {
    const wrapper = mount(SnSlider, {
      props: { modelValue: 10, marks: { 0: 'Min', 50: 'Mid', 100: 'Max' } },
    });
    await wrapper.findAll('.sn-slider__mark-dot')[1].trigger('click');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([50]);
    expect(wrapper.emitted('change')?.at(-1)).toEqual([50]);
  });

  it('maps pointer position to values in vertical mode', () => {
    const wrapper = mount(SnSlider, { props: { modelValue: 0, vertical: true } });
    expect(wrapper.classes()).toContain('sn-slider--vertical');
    expect(wrapper.find('[role="slider"]').attributes('aria-orientation')).toBe('vertical');
    withRect(V_RECT as DOMRect, () => {
      // y=60 of 200 → 70% down → value 70
      wrapper
        .find('.sn-slider__rail')
        .element.dispatchEvent(
          new MouseEvent('mousedown', { clientX: 3, clientY: 60, bubbles: true, cancelable: true }),
        );
      document.dispatchEvent(new MouseEvent('mouseup'));
    });
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([70]);
  });

  it('inverts the axis when reverse is set', () => {
    const wrapper = mount(SnSlider, { props: { modelValue: 0, reverse: true } });
    withRect(H_RECT as DOMRect, () => {
      // x=50 of 200 → mirrored to 75
      wrapper.find('.sn-slider__rail').element.dispatchEvent(mouse('mousedown', 50));
      document.dispatchEvent(new MouseEvent('mouseup'));
    });
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([75]);
  });

  it('shows a tooltip on handle hover and formats it via formatTooltip', async () => {
    const wrapper = mount(SnSlider, {
      props: { modelValue: 42, formatTooltip: (v: number) => `$${v}` },
    });
    await wrapper.find('[role="slider"]').trigger('mouseenter');
    const tooltip = wrapper.find('[role="tooltip"]');
    expect(tooltip.exists()).toBe(true);
    expect(tooltip.text()).toBe('$42');
  });

  it('hides the tooltip when tooltip=false', async () => {
    const wrapper = mount(SnSlider, { props: { modelValue: 42, tooltip: false } });
    await wrapper.find('[role="slider"]').trigger('mouseenter');
    expect(wrapper.find('[role="tooltip"]').exists()).toBe(false);
  });

  it('renders custom tooltip slot content', async () => {
    const wrapper = mount(SnSlider, {
      props: { modelValue: 42 },
      slots: { tooltip: '<i data-testid="tt">custom</i>' },
    });
    await wrapper.find('[role="slider"]').trigger('mouseenter');
    expect(wrapper.find('[data-testid="tt"]').exists()).toBe(true);
  });

  it('applies the placement class to the tooltip', async () => {
    const wrapper = mount(SnSlider, {
      props: { modelValue: 42, placement: 'bottom' },
    });
    await wrapper.find('[role="slider"]').trigger('mouseenter');
    expect(wrapper.find('.sn-slider__tooltip--bottom').exists()).toBe(true);
  });

  it('forwards ariaLabel to the handle', () => {
    const wrapper = mount(SnSlider, { props: { modelValue: 1, ariaLabel: 'Volume' } });
    expect(wrapper.find('[role="slider"]').attributes('aria-label')).toBe('Volume');
  });

  it('forwards customClass to the root', () => {
    const wrapper = mount(SnSlider, { props: { modelValue: 1, customClass: 'my-slider' } });
    expect(wrapper.classes()).toContain('my-slider');
  });

  it('respects custom min / max bounds', () => {
    const wrapper = mount(SnSlider, { props: { modelValue: 10, min: 10, max: 20 } });
    withRect(H_RECT as DOMRect, () => {
      wrapper.find('.sn-slider__rail').element.dispatchEvent(mouse('mousedown', 100));
      document.dispatchEvent(new MouseEvent('mouseup'));
    });
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([15]);
  });

  describe('visual regression', () => {
    let styleEl: HTMLStyleElement | null = null;

    beforeAll(() => {
      // vitest cwd = packages/vue-web (per-package vitest config).
      const source = readFileSync(join(process.cwd(), 'src/slider/SnSlider.vue'), 'utf8');
      const css = source.match(/<style[^>]*>([\s\S]*?)<\/style>/)?.[1] ?? '';
      expect(css).toContain('.sn-slider__rail');
      styleEl = document.createElement('style');
      styleEl.textContent = css;
      document.head.appendChild(styleEl);
    });

    afterAll(() => {
      styleEl?.remove();
      styleEl = null;
    });

    it('positions the rail as the fill-track origin with a full-height fill', () => {
      const wrapper = mount(SnSlider, { props: { modelValue: 40 }, attachTo: document.body });
      const railStyle = getComputedStyle(wrapper.find('.sn-slider__rail').element);
      const trackStyle = getComputedStyle(wrapper.find('.sn-slider__track').element);
      expect(railStyle.position).toBe('relative');
      expect(trackStyle.position).toBe('absolute');
      expect(trackStyle.top).toBe('0px');
      expect(trackStyle.height).toBe('100%');
      wrapper.unmount();
    });

    it('anchors the vertical fill track to the rail column', () => {
      const wrapper = mount(SnSlider, {
        props: { modelValue: 40, vertical: true },
        attachTo: document.body,
      });
      const trackStyle = getComputedStyle(wrapper.find('.sn-slider__track').element);
      expect(trackStyle.top).toBe('auto');
      expect(trackStyle.width).toBe('100%');
      wrapper.unmount();
    });

    it('toggles the active class on the hovered handle', async () => {
      const wrapper = mount(SnSlider, { props: { modelValue: 40 } });
      const handle = wrapper.find('[role="slider"]');
      expect(handle.classes()).not.toContain('sn-slider__handle--active');
      await handle.trigger('mouseenter');
      expect(handle.classes()).toContain('sn-slider__handle--active');
      await handle.trigger('mouseleave');
      expect(handle.classes()).not.toContain('sn-slider__handle--active');
    });

    it('never activates the handle on hover when disabled or readonly', async () => {
      const disabled = mount(SnSlider, { props: { modelValue: 40, disabled: true } });
      await disabled.find('[role="slider"]').trigger('mouseenter');
      expect(disabled.find('[role="slider"]').classes()).not.toContain('sn-slider__handle--active');
      const readonly = mount(SnSlider, { props: { modelValue: 40, readonly: true } });
      await readonly.find('[role="slider"]').trigger('mouseenter');
      expect(readonly.find('[role="slider"]').classes()).not.toContain('sn-slider__handle--active');
    });
  });
});
