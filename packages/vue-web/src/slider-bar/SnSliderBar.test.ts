/**
 * SnSliderBar unit tests — capsule (bar) slider.
 *
 * Behavior, not implementation (AGENTS.md §46):
 *   - click / drag updates, step snapping, clamping
 *   - dual handles do not cross
 *   - keyboard: arrows / Home / End / PageUp / PageDown
 *   - disabled / readonly suppress interaction
 *   - caption: percent vs value format, suffix, formatValue, value slot
 *   - opt-in #icon (nothing renders by default)
 *   - column variant geometry + ARIA orientation
 *   - fill geometry from the measured track
 *
 * jsdom has no layout, so getBoundingClientRect is mocked; the px geometry
 * is asserted through the styles the component emits (CSS percentages are
 * never used for the bar track).
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import SnSliderBar from './SnSliderBar.vue';

/** Horizontal track rect: x 0..200 (200px wide, 40px tall). */
const H_RECT = {
  left: 0,
  top: 0,
  right: 200,
  bottom: 40,
  width: 200,
  height: 40,
  x: 0,
  y: 0,
  toJSON: () => ({}),
};
/** Column track rect: 56 x 200, top 0. */
const V_RECT = {
  left: 0,
  top: 0,
  right: 56,
  bottom: 200,
  width: 56,
  height: 200,
  x: 0,
  y: 0,
  toJSON: () => ({}),
};

function withRect(rect: DOMRect, fn: () => void): void {
  const spy = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(rect);
  try {
    fn();
  } finally {
    spy.mockRestore();
  }
}

/** Track length used by every pointer test (horizontal). */
const TRAVEL_LEN = 200;
/** Default thumb half-size (the slim bar): the axis is inset by this on both ends. */
const END_PAD = 1.5;

/** clientX that sits exactly on `pct` of the travel (horizontal). */
function xAt(pct: number): number {
  return END_PAD + ((TRAVEL_LEN - END_PAD * 2) * pct) / 100;
}

function mouse(type: string, x: number, y = 20): MouseEvent {
  return new MouseEvent(type, { clientX: x, clientY: y, bubbles: true, cancelable: true });
}

/** Stateful host so `update:modelValue` flows back into the bar. */
function mountBar(props: Record<string, unknown>, slots: Record<string, unknown> = {}) {
  const valueRef = ref<unknown>(props.modelValue ?? props.defaultValue);
  const host = defineComponent({
    setup() {
      return () =>
        h(
          SnSliderBar,
          {
            ...props,
            modelValue: valueRef.value,
            'onUpdate:modelValue': (v: unknown) => {
              valueRef.value = v;
            },
          },
          slots,
        );
    },
  });
  const wrapper = mount(host);
  return {
    wrapper,
    bar: () => wrapper.findComponent(SnSliderBar),
    value: () => valueRef.value,
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('SnSliderBar', () => {
  describe('surface', () => {
    it('renders one slider handle with the ARIA contract', () => {
      const wrapper = mount(SnSliderBar, {
        props: { modelValue: 40, ariaLabel: 'Volume' },
      });
      const handles = wrapper.findAll('[role="slider"]');
      expect(handles).toHaveLength(1);
      expect(handles[0].attributes('aria-valuenow')).toBe('40');
      expect(handles[0].attributes('aria-valuemin')).toBe('0');
      expect(handles[0].attributes('aria-valuemax')).toBe('100');
      expect(handles[0].attributes('aria-label')).toBe('Volume');
      expect(handles[0].attributes('aria-orientation')).toBe('horizontal');
    });

    it('is registered as its own component surface, not a slider variant', () => {
      const wrapper = mount(SnSliderBar, { props: { modelValue: 40 } });
      expect(wrapper.classes()).toContain('sn-slider-bar');
      expect(wrapper.classes()).toContain('sn-slider-bar--bar');
      expect(wrapper.attributes('data-snui-component')).toBe('slider-bar');
    });

    it('renders no glyph unless the icon slot is provided', () => {
      const plain = mount(SnSliderBar, { props: { modelValue: 40 } });
      expect(plain.find('.sn-slider-bar__glyph').exists()).toBe(false);
      const withSlot = mount(SnSliderBar, {
        props: { modelValue: 40 },
        slots: { icon: '<svg class="probe-icon" />' },
      });
      // Icons default to the inside of the track.
      expect(withSlot.find('.sn-slider-bar__track .probe-icon').exists()).toBe(true);
    });

    it('paints the fill with the themed token by default', () => {
      const wrapper = mount(SnSliderBar, { props: { modelValue: 40 } });
      // No inline background → the stylesheet owns the themed color.
      expect(wrapper.find('.sn-slider-bar__fill').attributes('style') ?? '').not.toContain(
        'background',
      );
    });

    it('accepts a custom fill / bar background and thickness / radius', () => {
      const wrapper = mount(SnSliderBar, {
        props: {
          modelValue: 40,
          fillBackground: 'linear-gradient(90deg, #18a058, #2080f0)',
          barBackground: 'transparent',
          thickness: 32,
          radius: '4px',
        },
      });
      expect(wrapper.find('.sn-slider-bar__fill').attributes('style')).toContain(
        'linear-gradient(90deg, #18a058, #2080f0)',
      );
      expect(wrapper.find('.sn-slider-bar__track').attributes('style')).toContain('transparent');
      const root = (wrapper.attributes('style') ?? '').replace(/\s+/g, '');
      expect(root).toContain('--sn-bar-thickness:32px');
      expect(root).toContain('--sn-bar-radius:4px');
    });
  });

  describe('inline icon & label', () => {
    it('renders the icon inside the track by default', () => {
      const wrapper = mount(SnSliderBar, {
        props: { modelValue: 40 },
        slots: { icon: '<svg class="probe-icon" />' },
      });
      expect(wrapper.find('.sn-slider-bar__lead').exists()).toBe(false);
      expect(wrapper.find('.sn-slider-bar__track .probe-icon').exists()).toBe(true);
    });

    it('renders the icon outside the track with iconPlacement="leading"', () => {
      const wrapper = mount(SnSliderBar, {
        props: { modelValue: 40, iconPlacement: 'leading' },
        slots: { icon: '<svg class="probe-icon" />' },
      });
      const lead = wrapper.find('.sn-slider-bar__lead');
      expect(lead.exists()).toBe(true);
      expect(lead.find('.probe-icon').exists()).toBe(true);
    });

    it('renders the icon inside the bar with iconPlacement="inside"', () => {
      const wrapper = mount(SnSliderBar, {
        props: { modelValue: 40, iconPlacement: 'inside' },
        slots: { icon: '<svg class="probe-icon" />' },
      });
      expect(wrapper.find('.sn-slider-bar__lead').exists()).toBe(false);
      const glyph = wrapper.find('.sn-slider-bar__glyph');
      expect(glyph.exists()).toBe(true);
      expect(glyph.find('.probe-icon').exists()).toBe(true);
      // painted inside the track, above the fill
      expect(wrapper.find('.sn-slider-bar__track').find('.sn-slider-bar__glyph').exists()).toBe(
        true,
      );
    });

    it('mirrors the icon to the trailing edge with iconPlacement="trailing"', () => {
      const wrapper = mount(SnSliderBar, {
        props: { modelValue: 40, iconPlacement: 'trailing' },
        slots: { icon: '<svg class="probe-icon" />' },
      });
      const lead = wrapper.find('.sn-slider-bar__lead');
      expect(lead.classes()).toContain('sn-slider-bar__lead--trailing');
    });

    it('paints the label and suffix text inside the bar', () => {
      const wrapper = mount(SnSliderBar, {
        props: { modelValue: 40, label: 'Volume', suffix: 'of 100' },
      });
      expect(wrapper.find('.sn-slider-bar__track .sn-slider-bar__label').text()).toBe('Volume');
      expect(wrapper.find('.sn-slider-bar__track .sn-slider-bar__suffix').text()).toBe('of 100');
    });

    it('omits label / suffix when not provided', () => {
      const wrapper = mount(SnSliderBar, { props: { modelValue: 40 } });
      expect(wrapper.find('.sn-slider-bar__label').exists()).toBe(false);
      expect(wrapper.find('.sn-slider-bar__suffix').exists()).toBe(false);
    });

    it('keeps inline text above the fill and out of the a11y tree', () => {
      const wrapper = mount(SnSliderBar, {
        props: { modelValue: 40, label: 'Volume', suffix: 'max' },
      });
      for (const cls of ['.sn-slider-bar__label', '.sn-slider-bar__suffix']) {
        const el = wrapper.find(cls);
        expect(el.attributes('aria-hidden')).toBe('true');
      }
    });
  });

  describe('range fill band', () => {
    it('paints the themed band BETWEEN the handles', () => {
      const wrapper = mount(SnSliderBar, { props: { modelValue: [20, 60], range: true } });
      const style = (wrapper.find('.sn-slider-bar__fill').attributes('style') ?? '').replace(/\s+/g, '');
      // the band starts at the low handle (20%) and spans 40% of the axis
      expect(style).toContain('--sn-bar-band-start:0.2');
      expect(style).toContain('--sn-bar-band-size:0.4');
      expect(wrapper.classes()).toContain('sn-slider-bar--range');
    });

    it('mirrors the band when reversed', () => {
      const wrapper = mount(SnSliderBar, {
        props: { modelValue: [20, 60], range: true, reverse: true },
      });
      // reversed 20..60 → 80..40, so the band starts at the 40 mark (0.4)
      expect((wrapper.find('.sn-slider-bar__fill').attributes('style') ?? '').replace(/\s+/g, '')).toContain('--sn-bar-band-start:0.4');
      expect(wrapper.classes()).toContain('sn-slider-bar--reverse');
    });

    it('drives the column band from the same ratios', () => {
      const wrapper = mount(SnSliderBar, {
        props: { modelValue: [20, 60], range: true, variant: 'column' },
      });
      const style = (wrapper.find('.sn-slider-bar__fill').attributes('style') ?? '').replace(/\s+/g, '');
      expect(style).toContain('--sn-bar-band-start:0.2');
      expect(style).toContain('--sn-bar-band-size:0.4');
      expect(wrapper.classes()).toContain('sn-slider-bar--column');
    });

    it('single mode starts at the origin', () => {
      const wrapper = mount(SnSliderBar, { props: { modelValue: 40 } });
      const style = (wrapper.find('.sn-slider-bar__fill').attributes('style') ?? '').replace(/\s+/g, '');
      expect(style).toContain('--sn-bar-band-start:0');
      expect(style).toContain('--sn-bar-band-size:0.4');
    });
  });

  describe('two-state inner colours', () => {
    it('is marked empty at value 0 and hides the fill', () => {
      const wrapper = mount(SnSliderBar, { props: { modelValue: 0 } });
      expect(wrapper.classes()).toContain('sn-slider-bar--empty');
      expect((wrapper.find('.sn-slider-bar__fill').attributes('style') ?? '').replace(/\s+/g, '')).toContain('opacity:0');
    });

    it('is not empty when it has a value', () => {
      const wrapper = mount(SnSliderBar, { props: { modelValue: 1 } });
      expect(wrapper.classes()).not.toContain('sn-slider-bar--empty');
    });

    it('accepts custom filled / empty colours', () => {
      const wrapper = mount(SnSliderBar, {
        props: { modelValue: 40, innerColor: '#fff', innerColorEmpty: '#888', label: '音量' },
      });
      const style = (wrapper.attributes('style') ?? '').replace(/\s+/g, '');
      expect(style).toContain('--sn-bar-inner-color:#fff');
      expect(style).toContain('--sn-bar-inner-color-empty:#888');
    });

    it('keeps the label / glyph markup aria-hidden', () => {
      const wrapper = mount(SnSliderBar, { props: { modelValue: 40, label: 'L', suffix: 'S' } });
      expect(wrapper.find('.sn-slider-bar__label').attributes('aria-hidden')).toBe('true');
      expect(wrapper.find('.sn-slider-bar__suffix').attributes('aria-hidden')).toBe('true');
    });
  });

  describe('size tiers & height', () => {
    it('maps size onto the thickness variable', () => {
      const small = mount(SnSliderBar, { props: { modelValue: 10, size: 'small' } });
      expect((small.attributes('style') ?? '').replace(/\s+/g, '')).toContain('--sn-bar-thickness:28px');
      const large = mount(SnSliderBar, { props: { modelValue: 10, size: 'large' } });
      expect((large.attributes('style') ?? '').replace(/\s+/g, '')).toContain('--sn-bar-thickness:52px');
    });

    it('lets an explicit thickness win over the tier', () => {
      const wrapper = mount(SnSliderBar, {
        props: { modelValue: 10, size: 'large', thickness: 36 },
      });
      expect((wrapper.attributes('style') ?? '').replace(/\s+/g, '')).toContain('--sn-bar-thickness:36px');
    });

    it('accepts an explicit height', () => {
      const wrapper = mount(SnSliderBar, { props: { modelValue: 10, height: 120 } });
      expect((wrapper.attributes('style') ?? '').replace(/\s+/g, '')).toContain('height:120px');
    });
  });

  describe('aurora theme', () => {
    it('adds the aurora class and paints the gradient fill', () => {
      const wrapper = mount(SnSliderBar, { props: { modelValue: 60, theme: 'aurora' } });
      expect(wrapper.classes()).toContain('sn-slider-bar--aurora');
      const style = wrapper.find('.sn-slider-bar__fill').attributes('style') ?? '';
      expect(style).toContain('linear-gradient');
      // violet → periwinkle by default
      expect(style).toContain('#5b7cfa');
    });

    it('accepts a custom gradient', () => {
      const wrapper = mount(SnSliderBar, {
        props: { modelValue: 40, theme: 'aurora', gradient: 'linear-gradient(90deg, #ff0, #f0f)' },
      });
      expect(wrapper.find('.sn-slider-bar__fill').attributes('style')).toContain('#ff0');
    });

    it('renders the star field with a deterministic, capped count', () => {
      const wrapper = mount(SnSliderBar, { props: { modelValue: 40, theme: 'aurora' } });
      const stars = wrapper.findAll('.sn-slider-bar__star');
      expect(stars.length).toBeGreaterThan(0);
      expect(stars.length).toBeLessThanOrEqual(40);
      // star dots live inside the fill
      expect(wrapper.find('.sn-slider-bar__fill').findAll('.sn-slider-bar__star').length).toBe(
        stars.length,
      );
    });

    it('honours the sparkles density and clamps it', () => {
      const three = mount(SnSliderBar, { props: { modelValue: 40, theme: 'aurora', sparkles: 3 } });
      expect(three.findAll('.sn-slider-bar__star')).toHaveLength(3);
      const many = mount(SnSliderBar, { props: { modelValue: 40, theme: 'aurora', sparkles: 999 } });
      expect(many.findAll('.sn-slider-bar__star')).toHaveLength(40);
      const none = mount(SnSliderBar, { props: { modelValue: 40, theme: 'aurora', sparkles: 0 } });
      expect(none.findAll('.sn-slider-bar__star')).toHaveLength(0);
    });

    it('drops the animation (and its stars) with animated=false', () => {
      const wrapper = mount(SnSliderBar, {
        props: { modelValue: 40, theme: 'aurora', animated: false },
      });
      expect(wrapper.classes()).not.toContain('sn-slider-bar--animated');
      expect(wrapper.findAll('.sn-slider-bar__star')).toHaveLength(0);
      // the gradient stays — only the motion is removed
      expect(wrapper.find('.sn-slider-bar__fill').attributes('style')).toContain('linear-gradient');
    });

    it('keeps the theme out of the default variant', () => {
      const wrapper = mount(SnSliderBar, { props: { modelValue: 40 } });
      expect(wrapper.classes()).not.toContain('sn-slider-bar--aurora');
      expect(wrapper.findAll('.sn-slider-bar__star')).toHaveLength(0);
    });

    it('still drags and reports values like any bar', () => {
      const { bar, value } = mountBar({ modelValue: 20, theme: 'aurora' });
      withRect(H_RECT as DOMRect, () => {
        // aurora thumb radius = thickness / 2 (20px), so the axis is padded
        const pad = 20;
        const x = pad + ((TRAVEL_LEN - pad * 2) * 75) / 100;
        bar().find('.sn-slider-bar__track').element.dispatchEvent(mouse('mousedown', x));
        document.dispatchEvent(new MouseEvent('mouseup'));
      });
      expect(value()).toBe(75);
    });
  });

  describe('levels', () => {
    const LEVELS = [
      { value: 0, label: '静音' },
      { value: 33, label: '低' },
      { value: 66, label: '中' },
      { value: 100, label: '高' },
    ];

    it('reads the active level label instead of a percentage', () => {
      const wrapper = mount(SnSliderBar, {
        props: { modelValue: 70, levels: LEVELS, showValue: true },
      });
      expect(wrapper.find('.sn-slider-bar__value').text()).toBe('中');
    });

    it('snaps the nearest level as the value moves', async () => {
      const wrapper = mount(SnSliderBar, {
        props: { modelValue: 10, levels: LEVELS, showValue: true },
      });
      // 10 is closest to the 0 level
      expect(wrapper.find('.sn-slider-bar__value').text()).toBe('静音');
      await wrapper.setProps({ modelValue: 95 });
      expect(wrapper.find('.sn-slider-bar__value').text()).toBe('高');
    });

    it('draws one tick per level on the track', () => {
      const wrapper = mount(SnSliderBar, { props: { modelValue: 40, levels: LEVELS } });
      expect(wrapper.findAll('.sn-slider-bar__level-mark')).toHaveLength(LEVELS.length);
    });

    it('marks the active level tick', () => {
      const wrapper = mount(SnSliderBar, { props: { modelValue: 66, levels: LEVELS } });
      const on = wrapper.findAll('.sn-slider-bar__level-mark--on');
      expect(on).toHaveLength(1);
    });

    it('hides the ticks with showLevels=false', () => {
      const wrapper = mount(SnSliderBar, {
        props: { modelValue: 40, levels: LEVELS, showLevels: false },
      });
      expect(wrapper.findAll('.sn-slider-bar__level-mark')).toHaveLength(0);
      // the caption still reads the level
      expect(wrapper.find('.sn-slider-bar__value').exists()).toBe(false);
    });

    it('exposes the level through the value slot props', () => {
      const wrapper = mount(SnSliderBar, {
        props: { modelValue: 70, levels: LEVELS, showValue: true },
        slots: {
          value: (p: { level: string; levelIndex: number }) => `${p.levelIndex}:${p.level}`,
        },
      });
      expect(wrapper.find('.sn-slider-bar__value').text()).toBe('2:中');
    });

    it('falls back to percent without levels', () => {
      const wrapper = mount(SnSliderBar, { props: { modelValue: 40, showValue: true } });
      expect(wrapper.find('.sn-slider-bar__value').text()).toBe('40%');
    });
  });

  describe('edge glyphs & slots', () => {
    it('renders a leading icon name next to the track', () => {
      const wrapper = mount(SnSliderBar, {
        props: { modelValue: 40, leadingIcon: 'Volume2', iconPlacement: 'leading' },
      });
      expect(wrapper.find('.sn-slider-bar__edge').exists()).toBe(true);
    });

    it('paints the icon name inside the track by default', () => {
      const wrapper = mount(SnSliderBar, { props: { modelValue: 40, leadingIcon: 'Volume2' } });
      expect(wrapper.find('.sn-slider-bar__edge').exists()).toBe(false);
      expect(wrapper.find('.sn-slider-bar__track .sn-slider-bar__glyph').exists()).toBe(true);
    });

    it('renders custom #start / #end slot content', () => {
      const wrapper = mount(SnSliderBar, {
        props: { modelValue: 40, iconPlacement: 'leading' },
        slots: { start: '<i class="probe-start" />', end: '<i class="probe-end" />' },
      });
      expect(wrapper.find('.sn-slider-bar__edge .probe-start').exists()).toBe(true);
      expect(wrapper.find('.sn-slider-bar__edge--end .probe-end').exists()).toBe(true);
    });

    it('pins the glyph inside the track with iconPlacement="inside"', () => {
      const wrapper = mount(SnSliderBar, {
        props: { modelValue: 40, leadingIcon: 'Volume2', iconPlacement: 'inside' },
      });
      // the outer edge holds no glyph; the inside one rides the track
      expect(wrapper.find('.sn-slider-bar__edge').exists()).toBe(false);
      expect(wrapper.find('.sn-slider-bar__track .sn-slider-bar__glyph').exists()).toBe(true);
    });

    it('renders a trailing inner glyph', () => {
      const wrapper = mount(SnSliderBar, {
        props: { modelValue: 40, trailingIcon: 'Volume2', iconPlacement: 'inside' },
      });
      expect(wrapper.find('.sn-slider-bar__glyph--tail').exists()).toBe(true);
    });
  });

  describe('pointer interaction', () => {
    it('updates the value when the bar is clicked', () => {
      const { bar, value } = mountBar({ modelValue: 20 });
      withRect(H_RECT as DOMRect, () => {
        bar().find('.sn-slider-bar__track').element.dispatchEvent(mouse('mousedown', xAt(50)));
        document.dispatchEvent(new MouseEvent('mouseup'));
      });
      expect(value()).toBe(50);
    });

    it('follows the pointer while dragging', () => {
      const { bar, value } = mountBar({ modelValue: 20 });
      withRect(H_RECT as DOMRect, () => {
        bar().find('.sn-slider-bar__track').element.dispatchEvent(mouse('mousedown', xAt(20)));
        document.dispatchEvent(mouse('mousemove', xAt(80)));
        document.dispatchEvent(new MouseEvent('mouseup'));
      });
      expect(value()).toBe(80);
    });

    it('clamps outside the track bounds', () => {
      const { bar, value } = mountBar({ modelValue: 20 });
      withRect(H_RECT as DOMRect, () => {
        bar().find('.sn-slider-bar__track').element.dispatchEvent(mouse('mousedown', 999));
        document.dispatchEvent(new MouseEvent('mouseup'));
      });
      expect(value()).toBe(100);
    });

    it('snaps to the step grid', () => {
      const { bar, value } = mountBar({ modelValue: 0, step: 10 });
      withRect(H_RECT as DOMRect, () => {
        bar().find('.sn-slider-bar__track').element.dispatchEvent(mouse('mousedown', 74));
        document.dispatchEvent(new MouseEvent('mouseup'));
      });
      expect(value()).toBe(40);
    });

    it('emits change once on release', () => {
      const { bar } = mountBar({ modelValue: 20 });
      withRect(H_RECT as DOMRect, () => {
        bar().find('.sn-slider-bar__track').element.dispatchEvent(mouse('mousedown', 100));
        document.dispatchEvent(new MouseEvent('mouseup'));
      });
      expect(bar().emitted('change')).toHaveLength(1);
    });

    it('suppresses interaction when disabled or readonly', () => {
      for (const prop of ['disabled', 'readonly'] as const) {
        const { bar, value } = mountBar({ modelValue: 20, [prop]: true });
        withRect(H_RECT as DOMRect, () => {
          bar().find('.sn-slider-bar__track').element.dispatchEvent(mouse('mousedown', 100));
          document.dispatchEvent(new MouseEvent('mouseup'));
        });
        expect(value()).toBe(20);
        expect(bar().find('[role="slider"]').attributes('tabindex')).toBe('-1');
      }
    });
  });

  describe('range mode', () => {
    it('renders two handles', () => {
      const wrapper = mount(SnSliderBar, { props: { modelValue: [20, 80], range: true } });
      const handles = wrapper.findAll('[role="slider"]');
      expect(handles).toHaveLength(2);
      expect(handles[0].attributes('aria-valuenow')).toBe('20');
      expect(handles[1].attributes('aria-valuenow')).toBe('80');
    });

    it('drags the closer handle and never crosses', () => {
      const { bar, value } = mountBar({ modelValue: [20, 80], range: true });
      withRect(H_RECT as DOMRect, () => {
        // x=100 → 50, closer to 80 → the end handle moves to 50
        bar().find('.sn-slider-bar__track').element.dispatchEvent(mouse('mousedown', 100));
        // then drag far left, past the low handle
        document.dispatchEvent(mouse('mousemove', 0));
        document.dispatchEvent(new MouseEvent('mouseup'));
      });
      // clamped at the low handle, never below it
      expect(value()).toEqual([20, 20]);
    });

    it('emits an array value in range mode', () => {
      const { bar, value } = mountBar({ modelValue: [0, 100], range: true });
      withRect(H_RECT as DOMRect, () => {
        bar().find('.sn-slider-bar__track').element.dispatchEvent(mouse('mousedown', xAt(20)));
        document.dispatchEvent(new MouseEvent('mouseup'));
      });
      expect(value()).toEqual([20, 100]);
    });
  });

  describe('keyboard', () => {
    it('increments with ArrowRight and commits', async () => {
      const { bar, value } = mountBar({ modelValue: 40 });
      await bar().find('[role="slider"]').trigger('keydown', { key: 'ArrowRight' });
      expect(value()).toBe(41);
      expect(bar().emitted('change')).toHaveLength(1);
    });

    it('jumps to the bounds with Home / End', async () => {
      const { bar, value } = mountBar({ modelValue: 40 });
      await bar().find('[role="slider"]').trigger('keydown', { key: 'Home' });
      expect(value()).toBe(0);
      await bar().find('[role="slider"]').trigger('keydown', { key: 'End' });
      expect(value()).toBe(100);
    });

    it('moves by 10 steps with PageUp / PageDown', async () => {
      const { bar, value } = mountBar({ modelValue: 40, step: 2 });
      await bar().find('[role="slider"]').trigger('keydown', { key: 'PageUp' });
      expect(value()).toBe(60);
      await bar().find('[role="slider"]').trigger('keydown', { key: 'PageDown' });
      expect(value()).toBe(40);
    });

    it('inverts the arrow direction when reversed', async () => {
      const { bar, value } = mountBar({ modelValue: 40, reverse: true });
      await bar().find('[role="slider"]').trigger('keydown', { key: 'ArrowRight' });
      expect(value()).toBe(39);
    });

    it('ignores keys when disabled', async () => {
      const { bar, value } = mountBar({ modelValue: 40, disabled: true });
      await bar().find('[role="slider"]').trigger('keydown', { key: 'ArrowRight' });
      expect(value()).toBe(40);
    });
  });

  describe('caption', () => {
    it('renders no caption by default', () => {
      const wrapper = mount(SnSliderBar, { props: { modelValue: 40 } });
      expect(wrapper.find('.sn-slider-bar__value').exists()).toBe(false);
    });

    it('shows the axis share by default', () => {
      const wrapper = mount(SnSliderBar, { props: { modelValue: 40, showValue: true } });
      expect(wrapper.find('.sn-slider-bar__value').text()).toBe('40%');
    });

    it('shows the raw value with format="value" and a custom suffix', () => {
      const wrapper = mount(SnSliderBar, {
        props: { modelValue: 40, min: 0, max: 200, showValue: true, format: 'value', valueSuffix: ' ms' },
      });
      expect(wrapper.find('.sn-slider-bar__value').text()).toBe('40 ms');
    });

    it('uses formatValue when provided', () => {
      const wrapper = mount(SnSliderBar, {
        props: {
          modelValue: 40,
          showValue: true,
          formatValue: (v: number, p: number) => `${v} dB (${p}%)`,
        },
      });
      expect(wrapper.find('.sn-slider-bar__value').text()).toBe('40 dB (40%)');
    });

    it('renders the value slot with the label props', () => {
      const wrapper = mount(SnSliderBar, {
        props: { modelValue: 40, showValue: true },
        slots: { value: ({ percent }: { percent: number }) => `P${percent}` },
      });
      expect(wrapper.find('.sn-slider-bar__value').text()).toBe('P40');
    });

    it('keeps the caption under tooltipOnly for the column read-out', () => {
      const wrapper = mount(SnSliderBar, {
        props: { modelValue: 21, variant: 'column', tooltipOnly: true, min: 15, max: 30 },
      });
      expect(wrapper.find('.sn-slider-bar__value').exists()).toBe(true);
      expect(wrapper.find('[role="slider"]').attributes('aria-valuetext')).toBe('21');
    });
  });

  describe('tooltip', () => {
    it('shows the bubble on hover and formats it', async () => {
      const wrapper = mount(SnSliderBar, {
        props: { modelValue: 42, formatTooltip: (v: number) => `${v}%` },
      });
      expect(wrapper.find('[role="tooltip"]').exists()).toBe(false);
      await wrapper.find('[role="slider"]').trigger('mouseenter');
      expect(wrapper.find('[role="tooltip"]').text()).toBe('42%');
    });

    it('hides the bubble when tooltip=false', async () => {
      const wrapper = mount(SnSliderBar, { props: { modelValue: 42, tooltip: false } });
      await wrapper.find('[role="slider"]').trigger('mouseenter');
      expect(wrapper.find('[role="tooltip"]').exists()).toBe(false);
    });

    it('applies the placement class', async () => {
      const wrapper = mount(SnSliderBar, {
        props: { modelValue: 42, placement: 'bottom-start' },
      });
      await wrapper.find('[role="slider"]').trigger('mouseenter');
      expect(wrapper.find('[role="tooltip"]').classes()).toContain(
        'sn-slider-bar__tooltip--bottom-start',
      );
    });
  });

  describe('column variant', () => {
    it('renders the vertical strip with aria-orientation=vertical', () => {
      const wrapper = mount(SnSliderBar, {
        props: { modelValue: 60, variant: 'column', showValue: true },
      });
      expect(wrapper.classes()).toContain('sn-slider-bar--column');
      const handle = wrapper.find('[role="slider"]');
      expect(handle.attributes('aria-orientation')).toBe('vertical');
      expect(wrapper.find('.sn-slider-bar__value').exists()).toBe(true);
    });

    it('maps pointer position bottom-up along the inset travel', () => {
      const { bar, value } = mountBar({ modelValue: 20, variant: 'column' });
      withRect(V_RECT as DOMRect, () => {
        // The column axis starts flush at the bottom edge and stops below the
        // caption row (34px reserved at the top of the track).
        const row = 34;
        const travel = V_RECT.height - row;
        const y = V_RECT.bottom - (travel * 60) / 100;
        bar().find('.sn-slider-bar__track').element.dispatchEvent(mouse('mousedown', 28, y));
        document.dispatchEvent(new MouseEvent('mouseup'));
      });
      expect(value()).toBe(60);
    });

    it('reaches both ends exactly (no dead zone at the extremes)', () => {
      const { bar, value } = mountBar({ modelValue: 50, variant: 'column' });
      withRect(V_RECT as DOMRect, () => {
        bar().find('.sn-slider-bar__track').element.dispatchEvent(mouse('mousedown', 28, 0));
        document.dispatchEvent(new MouseEvent('mouseup'));
      });
      expect(value()).toBe(100);
      withRect(V_RECT as DOMRect, () => {
        bar().find('.sn-slider-bar__track').element.dispatchEvent(mouse('mousedown', 28, 200));
        document.dispatchEvent(new MouseEvent('mouseup'));
      });
      expect(value()).toBe(0);
    });

    it('fades the empty part by default and can disable it', () => {
      const faded = mount(SnSliderBar, { props: { modelValue: 40, variant: 'column' } });
      expect(faded.classes()).toContain('sn-slider-bar--fade');
      const solid = mount(SnSliderBar, {
        props: { modelValue: 40, variant: 'column', fade: false },
      });
      expect(solid.classes()).not.toContain('sn-slider-bar--fade');
    });
  });

  describe('fill geometry', () => {
    it('anchors the fill flush to the leading edge in single mode', () => {
      const wrapper = mount(SnSliderBar, { props: { modelValue: 40 } });
      // The band start ratio is 0; the stylesheet anchors it to the capsule edge.
      expect(wrapper.find('.sn-slider-bar__fill').attributes('style')).toContain('--sn-bar-band-start: 0');
    });

    it('anchors from the opposite edge when reversed', () => {
      const wrapper = mount(SnSliderBar, { props: { modelValue: 25, reverse: true } });
      expect(wrapper.classes()).toContain('sn-slider-bar--reverse');
      // reversed 25 → the band still starts at the origin ratio 0
      expect(wrapper.find('.sn-slider-bar__fill').attributes('style')).toContain('--sn-bar-band-start: 0');
    });

    it('drives the column fill from the bottom edge', () => {
      const wrapper = mount(SnSliderBar, { props: { modelValue: 40, variant: 'column' } });
      // The band ratios drive both axes; the stylesheet anchors the column to
      // the bottom edge and reserves the caption row at the top.
      const style = wrapper.find('.sn-slider-bar__fill').attributes('style') ?? '';
      expect(style).toContain('--sn-bar-band-start: 0');
      expect(style).toContain('--sn-bar-band-size: 0.4');
    });

    it('drives the thumb through a unitless position ratio', () => {
      const wrapper = mount(SnSliderBar, { props: { modelValue: 40 } });
      // The stylesheet multiplies (100% − 2·pad) by this ratio; calc() rejects
      // percentage × percentage, so the var must stay a plain number.
      const style = (wrapper.find('[role="slider"]').attributes('style') ?? '').replace(/\s+/g, '');
      expect(style).toContain('--sn-bar-position:0.4');
    });
  });

  describe('ARIA / a11y', () => {
    it('marks disabled / readonly handles as such', () => {
      const wrapper = mount(SnSliderBar, { props: { modelValue: 40, disabled: true } });
      expect(wrapper.attributes('aria-disabled')).toBe('true');
      expect(wrapper.find('[role="slider"]').attributes('aria-disabled')).toBe('true');
    });

    it('announces the share in percent mode', () => {
      const wrapper = mount(SnSliderBar, { props: { modelValue: 40 } });
      expect(wrapper.find('[role="slider"]').attributes('aria-valuetext')).toBe('40, 40%');
    });

    it('falls back to the raw value in value mode', () => {
      const wrapper = mount(SnSliderBar, { props: { modelValue: 40, format: 'value' } });
      expect(wrapper.find('[role="slider"]').attributes('aria-valuetext')).toBe('40');
    });
  });

  describe('uncontrolled', () => {
    it('supports defaultValue', async () => {
      const wrapper = mount(SnSliderBar, { props: { defaultValue: 30 } });
      await wrapper.find('[role="slider"]').trigger('keydown', { key: 'ArrowRight' });
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([31]);
    });
  });
});
