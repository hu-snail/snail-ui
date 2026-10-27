/**
 * sn-slider unit tests — uni-end slider with touch dragging.
 *
 * Behaviour only (AGENTS.md §46): snapping, clamping, range mode knob
 * crossing, the dragstart / dragmove / dragend trio, disabled blocking, the
 * marks rendering and the color forwarding. No rpx numbers in assertions.
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SnSlider from './sn-slider.vue';

/** Give the track a deterministic 100px-wide box so ratios are exact. */
function withTrackBox(w: ReturnType<typeof mount>, width = 100, height = 100): void {
  const track = w.find('.sn-slider__track');
  const element = track.element as HTMLElement;
  element.getBoundingClientRect = () =>
    ({
      left: 0,
      top: 0,
      width,
      height,
      right: width,
      bottom: height,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }) as DOMRect;
}

const lastValue = (w: ReturnType<typeof mount>): unknown =>
  w.emitted('update:modelValue')?.at(-1)?.[0];

describe('sn-slider', () => {
  describe('structure', () => {
    it('renders a track with role="slider" and aria bounds', () => {
      const w = mount(SnSlider, { props: { modelValue: 40, min: 10, max: 90 } });
      const track = w.find('.sn-slider__track');
      expect(track.attributes('role')).toBe('slider');
      expect(track.attributes('aria-valuemin')).toBe('10');
      expect(track.attributes('aria-valuemax')).toBe('90');
      expect(track.attributes('aria-valuenow')).toBe('40');
    });

    it('positions the knob by percentage', () => {
      const w = mount(SnSlider, { props: { modelValue: 25, min: 0, max: 100 } });
      expect(w.find('.sn-slider__knob').attributes('style')).toContain('left: 25%');
    });

    it('leaves line centering to the stylesheet instead of inline overrides', () => {
      // Regression: an inline `top: 0` (horizontal) / `left: 0` (vertical)
      // overrode the scoped `top: 50%` / `left: 50%` centering and pinned the
      // active fill to the track edge, 12px off the knob center.
      const horizontal = mount(SnSlider, { props: { modelValue: 40 } });
      const style = horizontal.find('.sn-slider__line').attributes('style') ?? '';
      expect(style).toContain('left: 0%');
      expect(style).toContain('width: 40%');
      expect(style).not.toContain('top');
      expect(style).not.toContain('bottom');

      const vertical = mount(SnSlider, { props: { modelValue: 40, vertical: true } });
      const verticalStyle = vertical.find('.sn-slider__line').attributes('style') ?? '';
      expect(verticalStyle).toContain('bottom: 0%');
      expect(verticalStyle).toContain('height: 40%');
      expect(verticalStyle).not.toContain('left');
      expect(verticalStyle).not.toContain('right');
    });

    it('renders two knobs in range mode', () => {
      const w = mount(SnSlider, { props: { modelValue: [20, 60], range: true } });
      expect(w.findAll('.sn-slider__knob')).toHaveLength(2);
      expect(w.classes()).toContain('sn-slider--range');
    });

    it('applies the theme / vertical / disabled classes', () => {
      expect(mount(SnSlider, { props: { theme: 'capsule' } }).classes()).toContain(
        'sn-slider--capsule',
      );
      expect(mount(SnSlider, { props: { vertical: true } }).classes()).toContain(
        'sn-slider--vertical',
      );
      expect(mount(SnSlider, { props: { disabled: true } }).classes()).toContain(
        'sn-slider--disabled',
      );
    });

    it('renders the extreme captions when showExtremeValue is set', () => {
      const w = mount(SnSlider, { props: { showExtremeValue: true, min: 5, max: 95 } });
      const extremes = w.findAll('.sn-slider__extreme');
      expect(extremes).toHaveLength(2);
      expect(extremes[0]?.text()).toBe('5');
      expect(extremes[1]?.text()).toBe('95');
    });

    it('shows the value bubble only while dragging by default', () => {
      // `normal` (default) matches wd-slider: the bubble appears for the knob
      // being dragged, never permanently.
      expect(mount(SnSlider).find('.sn-slider__popover').exists()).toBe(false);
      expect(
        mount(SnSlider, { props: { popoverVisible: 'never' } })
          .find('.sn-slider__popover')
          .exists(),
      ).toBe(false);
    });

    it('pins the bubble with popoverVisible="always"', () => {
      expect(
        mount(SnSlider, { props: { popoverVisible: 'always' } })
          .find('.sn-slider__popover')
          .exists(),
      ).toBe(true);
    });

    it('shows the bubble for the dragged knob and hides it on release', async () => {
      const wrapper = mount(SnSlider, { props: { modelValue: 40 } });
      const track = wrapper.find('.sn-slider__track');
      expect(wrapper.find('.sn-slider__popover').exists()).toBe(false);

      await track.trigger('touchstart', { touches: [{ clientX: 200, clientY: 0 }] });
      await track.trigger('touchmove', { touches: [{ clientX: 260, clientY: 0 }] });
      expect(wrapper.find('.sn-slider__popover').exists()).toBe(true);

      await track.trigger('touchend', { changedTouches: [{ clientX: 260, clientY: 0 }] });
      expect(wrapper.find('.sn-slider__popover').exists()).toBe(false);
    });

    it('normalizes a reversed range pair', () => {
      const w = mount(SnSlider, { props: { modelValue: [80, 20], range: true } });
      const knobs = w.findAll('.sn-slider__knob');
      expect(knobs[0]?.attributes('style')).toContain('left: 20%');
      expect(knobs[1]?.attributes('style')).toContain('left: 80%');
    });
  });

  describe('dragging', () => {
    it('emits dragstart / dragmove / dragend with the current value', async () => {
      const w = mount(SnSlider, { props: { modelValue: 20 } });
      withTrackBox(w);
      const knob = w.find('.sn-slider__knob');
      await knob.trigger('touchstart', { touches: [{ clientX: 20 }] });
      await w.find('.sn-slider__track').trigger('touchmove', { touches: [{ clientX: 50 }] });
      await w.find('.sn-slider__track').trigger('touchend', { touches: [{ clientX: 50 }] });
      expect(w.emitted('dragstart')).toHaveLength(1);
      expect(w.emitted('dragmove')).toHaveLength(1);
      expect(w.emitted('dragend')).toHaveLength(1);
    });

    it('snaps the dragged value to the step grid', async () => {
      const w = mount(SnSlider, { props: { modelValue: 0, step: 10 } });
      withTrackBox(w);
      await w.find('.sn-slider__knob').trigger('touchstart', { touches: [{ clientX: 0 }] });
      await w.find('.sn-slider__track').trigger('touchend', { touches: [{ clientX: 47 }] });
      expect(lastValue(w)).toBe(50);
    });

    it('clamps to max', async () => {
      const w = mount(SnSlider, { props: { modelValue: 90, max: 100 } });
      withTrackBox(w);
      await w.find('.sn-slider__knob').trigger('touchstart', { touches: [{ clientX: 90 }] });
      await w.find('.sn-slider__track').trigger('touchend', { touches: [{ clientX: 400 }] });
      expect(lastValue(w)).toBe(100);
    });

    it('clamps to min', async () => {
      const w = mount(SnSlider, { props: { modelValue: 10, min: 10 } });
      withTrackBox(w);
      await w.find('.sn-slider__knob').trigger('touchstart', { touches: [{ clientX: 10 }] });
      await w.find('.sn-slider__track').trigger('touchend', { touches: [{ clientX: -400 }] });
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });

    it('moves only the right knob past the left one in range mode', async () => {
      const w = mount(SnSlider, { props: { modelValue: [20, 60], range: true } });
      withTrackBox(w);
      await w.findAll('.sn-slider__knob')[1]?.trigger('touchstart', { touches: [{ clientX: 60 }] });
      await w.find('.sn-slider__track').trigger('touchend', { touches: [{ clientX: 5 }] });
      expect(lastValue(w)).toEqual([20, 20]);
    });

    it('moves only the left knob before the right one in range mode', async () => {
      const w = mount(SnSlider, { props: { modelValue: [20, 60], range: true } });
      withTrackBox(w);
      await w.findAll('.sn-slider__knob')[0]?.trigger('touchstart', { touches: [{ clientX: 20 }] });
      await w.find('.sn-slider__track').trigger('touchend', { touches: [{ clientX: 95 }] });
      expect(lastValue(w)).toEqual([60, 60]);
    });

    it('does not emit while disabled', async () => {
      const w = mount(SnSlider, { props: { modelValue: 20, disabled: true } });
      withTrackBox(w);
      await w.find('.sn-slider__knob').trigger('touchstart', { touches: [{ clientX: 20 }] });
      await w.find('.sn-slider__track').trigger('touchmove', { touches: [{ clientX: 60 }] });
      await w.find('.sn-slider__track').trigger('touchend', { touches: [{ clientX: 60 }] });
      expect(w.emitted('update:modelValue')).toBeUndefined();
      expect(w.emitted('dragstart')).toBeUndefined();
    });

    it('stops the drag on touchcancel', async () => {
      const w = mount(SnSlider, { props: { modelValue: 20 } });
      withTrackBox(w);
      await w.find('.sn-slider__knob').trigger('touchstart', { touches: [{ clientX: 20 }] });
      await w.find('.sn-slider__track').trigger('touchcancel');
      expect(w.emitted('dragend')).toHaveLength(1);
      await w.find('.sn-slider__track').trigger('touchmove', { touches: [{ clientX: 70 }] });
      expect(w.emitted('dragmove')).toBeUndefined();
    });
  });

  describe('vertical mode', () => {
    it('maps the pointer position from the bottom edge', async () => {
      const w = mount(SnSlider, { props: { modelValue: 0, vertical: true } });
      withTrackBox(w, 100, 100);
      await w.find('.sn-slider__knob').trigger('touchstart', { touches: [{ clientY: 100 }] });
      await w.find('.sn-slider__track').trigger('touchend', { touches: [{ clientY: 25 }] });
      expect(lastValue(w)).toBe(75);
    });

    it('exposes aria-orientation="vertical"', () => {
      expect(
        mount(SnSlider, { props: { vertical: true } })
          .find('.sn-slider__track')
          .attributes('aria-orientation'),
      ).toBe('vertical');
    });
  });

  describe('marks', () => {
    it('renders array marks', () => {
      const w = mount(SnSlider, {
        props: {
          modelValue: 30,
          marks: [
            { value: 0, label: 'low' },
            { value: 100, label: 'high' },
          ],
        },
      });
      const marks = w.findAll('.sn-slider__mark');
      expect(marks).toHaveLength(2);
      expect(marks[0]?.text()).toBe('low');
    });

    it('renders record marks and marks the reached ones active', () => {
      const w = mount(SnSlider, { props: { modelValue: 30, marks: { 0: 'a', 50: 'b' } } });
      const marks = w.findAll('.sn-slider__mark');
      expect(marks[0]?.classes()).toContain('sn-slider__mark--active');
      expect(marks[1]?.classes()).not.toContain('sn-slider__mark--active');
    });

    it('adds the with-marks class and the scale ticks', () => {
      const w = mount(SnSlider, { props: { marks: [{ value: 25 }] } });
      expect(w.classes()).toContain('sn-slider--with-marks');
      expect(w.findAll('.sn-slider__scale')).toHaveLength(1);
    });
  });

  describe('colors', () => {
    it('forwards activeColor / inactiveColor as custom properties', () => {
      const w = mount(SnSlider, {
        props: { activeColor: 'rgb(1, 2, 3)', inactiveColor: 'rgb(4, 5, 6)' },
      });
      const style = w.attributes('style') ?? '';
      expect(style).toContain('--sn-slider-line-bg: rgb(1, 2, 3)');
      expect(style).toContain('--sn-slider-bar-bg: rgb(4, 5, 6)');
    });
  });

  describe('exposed API', () => {
    it('initSlider re-measures the track without throwing', () => {
      const w = mount(SnSlider);
      const vm = w.vm as unknown as { initSlider(): void };
      expect(() => {
        vm.initSlider();
      }).not.toThrow();
    });
  });

  /* ── Extended coverage: tap-to-jump, payloads, a11y, snap precision ── */

  describe('tap to jump', () => {
    it('jumps the single knob to the tapped position', async () => {
      const w = mount(SnSlider, { props: { modelValue: 0, step: 10 } });
      withTrackBox(w);
      await w.find('.sn-slider__track').trigger('tap', { detail: { x: 47 } });
      expect(w.emitted('update:modelValue')?.[0]).toEqual([50]);
      expect(w.emitted('change')?.[0]).toEqual([50]);
    });

    it('jumps the nearest range knob to the tapped position', async () => {
      const w = mount(SnSlider, { props: { modelValue: [20, 60], range: true } });
      withTrackBox(w);
      await w.find('.sn-slider__track').trigger('tap', { detail: { x: 80 } });
      // nearest knob is the end (60) → it moves to 80
      expect(w.emitted('update:modelValue')?.[0]).toEqual([[20, 80]]);
    });

    it('emits change exactly once per range tap (regression: stale duplicate)', async () => {
      const w = mount(SnSlider, { props: { modelValue: [20, 60], range: true } });
      withTrackBox(w);
      await w.find('.sn-slider__track').trigger('tap', { detail: { x: 80 } });
      const changes = w.emitted('change') ?? [];
      expect(changes).toHaveLength(1);
      expect(changes[0]).toEqual([[20, 80]]);
    });

    it('does not emit on a track tap while disabled', async () => {
      const w = mount(SnSlider, { props: { modelValue: 20, disabled: true } });
      withTrackBox(w);
      await w.find('.sn-slider__track').trigger('tap', { detail: { x: 80 } });
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });
  });

  describe('event payloads', () => {
    it('carries the model value in dragstart / dragmove / dragend payloads', async () => {
      const w = mount(SnSlider, { props: { modelValue: 20 } });
      withTrackBox(w);
      await w.find('.sn-slider__knob').trigger('touchstart', { touches: [{ clientX: 20 }] });
      await w.find('.sn-slider__track').trigger('touchmove', { touches: [{ clientX: 50 }] });
      await w.find('.sn-slider__track').trigger('touchend', { touches: [{ clientX: 50 }] });
      expect(w.emitted('dragstart')?.[0]).toEqual([{ value: 20 }]);
      expect(w.emitted('dragmove')?.[0]).toEqual([{ value: 20 }]);
      expect(w.emitted('dragend')?.[0]).toEqual([{ value: 20 }]);
    });

    it('emits update:modelValue and change with the committed drag value', async () => {
      const w = mount(SnSlider, { props: { modelValue: 0, step: 10 } });
      withTrackBox(w);
      await w.find('.sn-slider__knob').trigger('touchstart', { touches: [{ clientX: 0 }] });
      await w.find('.sn-slider__track').trigger('touchend', { touches: [{ clientX: 50 }] });
      expect(w.emitted('update:modelValue')?.[0]).toEqual([50]);
      expect(w.emitted('change')?.[0]).toEqual([50]);
    });

    it('snaps 0.1-step drags without floating-point drift', async () => {
      const w = mount(SnSlider, {
        props: { modelValue: 0, min: 0, max: 1, step: 0.1 },
      });
      withTrackBox(w);
      await w.find('.sn-slider__knob').trigger('touchstart', { touches: [{ clientX: 0 }] });
      await w.find('.sn-slider__track').trigger('touchend', { touches: [{ clientX: 30 }] });
      expect(lastValue(w)).toBe(0.3);
    });
  });

  describe('a11y + forwarding', () => {
    it('exposes the knob as a labelled button in the tab order', () => {
      const w = mount(SnSlider, { props: { modelValue: 40 } });
      const knob = w.find('.sn-slider__knob');
      expect(knob.attributes('role')).toBe('button');
      expect(knob.attributes('aria-label')).toBe('slider knob 40');
      expect(knob.attributes('tabindex')).toBe('0');
    });

    it('drops both knobs from the tab order while disabled', () => {
      const w = mount(SnSlider, { props: { modelValue: [20, 60], range: true, disabled: true } });
      const knobs = w.findAll('.sn-slider__knob');
      expect(knobs).toHaveLength(2);
      for (const knob of knobs) {
        expect(knob.attributes('tabindex')).toBe('-1');
      }
      expect(w.find('.sn-slider__track').attributes('aria-disabled')).toBe('true');
      expect(w.attributes('aria-disabled')).toBe('true');
    });

    it('hides the extreme captions in vertical mode', () => {
      const w = mount(SnSlider, { props: { showExtremeValue: true, vertical: true } });
      expect(w.findAll('.sn-slider__extreme')).toHaveLength(0);
    });

    it('forwards customClass and customStyle', () => {
      const w = mount(SnSlider, {
        props: { customClass: 'my-slider', customStyle: 'margin: 4px;' },
      });
      expect(w.classes()).toContain('my-slider');
      expect(w.attributes('style')).toContain('margin: 4px');
    });
  });

  describe('marks (extended)', () => {
    it('activates marks inside the selected range', () => {
      const w = mount(SnSlider, {
        props: {
          modelValue: [20, 60],
          range: true,
          marks: { 0: 'a', 30: 'b', 50: 'c', 100: 'd' },
        },
      });
      const marks = w.findAll('.sn-slider__mark');
      expect(marks[0]?.classes()).not.toContain('sn-slider__mark--active');
      expect(marks[1]?.classes()).toContain('sn-slider__mark--active');
      expect(marks[2]?.classes()).toContain('sn-slider__mark--active');
      expect(marks[3]?.classes()).not.toContain('sn-slider__mark--active');
    });

    it('drops non-finite array marks', () => {
      const w = mount(SnSlider, {
        props: {
          modelValue: 30,
          marks: [
            { value: Number.NaN, label: 'bad' },
            { value: 50, label: 'ok' },
          ],
        },
      });
      const marks = w.findAll('.sn-slider__mark');
      expect(marks).toHaveLength(1);
      expect(marks[0]?.text()).toBe('ok');
    });
  });
});

describe('sn-slider track-start and vertical coordinate fallbacks', () => {
  it('starts a single-knob drag from the track itself', async () => {
    const w = mount(SnSlider, { props: { modelValue: 20 } });
    withTrackBox(w);
    await w.find('.sn-slider__track').trigger('touchstart', { touches: [{ clientX: 40 }] });
    expect(w.emitted('dragstart')?.[0]).toEqual([{ value: 20 }]);
    await w.find('.sn-slider__track').trigger('touchend', { touches: [{ clientX: 40 }] });
    expect(w.emitted('update:modelValue')).toBeDefined();
  });

  it('ignores a second track touchstart while a drag is active', async () => {
    const w = mount(SnSlider, { props: { modelValue: 20 } });
    withTrackBox(w);
    await w.find('.sn-slider__track').trigger('touchstart', { touches: [{ clientX: 40 }] });
    await w.find('.sn-slider__track').trigger('touchstart', { touches: [{ clientX: 90 }] });
    expect(w.emitted('dragstart')).toHaveLength(1);
  });

  it('resolves a vertical drag from clientY', async () => {
    const w = mount(SnSlider, { props: { modelValue: 20, vertical: true } });
    withTrackBox(w);
    await w.find('.sn-slider__knob').trigger('touchstart', { touches: [{ clientY: 20 }] });
    await w.find('.sn-slider__track').trigger('touchend', { touches: [{ clientY: 90 }] });
    expect(w.emitted('update:modelValue')).toBeDefined();
  });
});
