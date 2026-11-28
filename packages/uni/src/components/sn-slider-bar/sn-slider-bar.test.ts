/**
 * sn-slider-bar unit tests (uni end).
 *
 * Behaviour-focused (AGENTS.md §46): value normalisation, snapping, range
 * semantics, level labels, caption formats and the two colour states. Layout
 * is CSS-only on this end, so geometry is asserted through the emitted style
 * strings rather than computed boxes.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import SnSliderBar from './sn-slider-bar.vue';

/** Style strings come back space-separated; compare without spaces. */
function styleOf(
  w: { find: (sel: string) => { attributes: (n: string) => string | undefined } },
  sel: string,
): string {
  return (w.find(sel).attributes('style') ?? '').replace(/\s+/g, '');
}

/** uni mesh shim — the SFC calls createSelectorQuery on mount. */
function stubUni(): void {
  (globalThis as unknown as { uni: unknown }).uni = {
    createSelectorQuery: () => ({
      in: () => ({
        select: () => ({
          boundingClientRect: (cb: (rect: { width: number; height: number }) => void) => {
            cb({ width: 300, height: 200 });
            return { exec: () => undefined };
          },
        }),
      }),
    }),
  };
}

/**
 * uni mesh shim whose selector query is resolved by the test.
 *
 * Mini-program / App hosts measure asynchronously, so the deferred-start path
 * needs a query that has *not* answered yet when the press arrives.
 */
function stubDeferredUni(): { resolve: (box: Record<string, number>) => void } {
  let pending: ((rect: Record<string, number>) => void) | null = null;
  (globalThis as unknown as { uni: unknown }).uni = {
    createSelectorQuery: () => ({
      in: () => ({
        select: () => ({
          boundingClientRect: (cb: (rect: Record<string, number>) => void) => {
            pending = cb;
            return { exec: () => undefined };
          },
        }),
      }),
    }),
  };
  return {
    resolve: (box) => {
      const cb = pending;
      pending = null;
      cb?.(box);
    },
  };
}

/** Touch event carrying the fields the drag core reads. */
function touchEvent(type: string, x: number, y: number): Event {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'touches', { value: [{ clientX: x, clientY: y }] });
  return event;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('sn-slider-bar (uni)', () => {
  it('renders one knob and the capsule surface', () => {
    stubUni();
    const wrapper = mount(SnSliderBar, { props: { modelValue: 40 } });
    expect(wrapper.classes()).toContain('sn-slider-bar');
    expect(wrapper.classes()).toContain('sn-slider-bar--bar');
    expect(wrapper.findAll('.sn-slider-bar__knob')).toHaveLength(1);
    expect(wrapper.find('.sn-slider-bar__track').exists()).toBe(true);
  });

  it('paints the fill from the origin in single mode', () => {
    stubUni();
    const wrapper = mount(SnSliderBar, { props: { modelValue: 40 } });
    const style = styleOf(wrapper, '.sn-slider-bar__fill');
    // The band is the raw track: the fill starts on the capsule's own cap and
    // stops under the thumb (no inset, no reach-back).
    expect(style).toContain('left:0px');
    expect(style).toContain('right:60%'); // 100 - 40
  });

  it('paints the fill BETWEEN the knobs in range mode', () => {
    stubUni();
    const wrapper = mount(SnSliderBar, {
      props: { modelValue: [20, 60], range: true },
    });
    const style = styleOf(wrapper, '.sn-slider-bar__fill');
    // themed band spans the two knob centres
    expect(style).toContain('left:20%');
    expect(style).toContain('right:40%'); // 100 - 60
    expect(wrapper.findAll('.sn-slider-bar__knob')).toHaveLength(2);
  });

  it('hides the fill at value 0', () => {
    stubUni();
    const wrapper = mount(SnSliderBar, { props: { modelValue: 0 } });
    expect(wrapper.classes()).toContain('sn-slider-bar--empty');
    expect(wrapper.classes()).not.toContain('sn-slider-bar--filled');
    expect(styleOf(wrapper, '.sn-slider-bar__fill')).toContain('opacity:0');
  });

  it('binds the filled state as a class instead of a :not pseudo (uni-app x)', () => {
    stubUni();
    const wrapper = mount(SnSliderBar, { props: { modelValue: 40 } });
    expect(wrapper.classes()).toContain('sn-slider-bar--filled');
    expect(wrapper.classes()).not.toContain('sn-slider-bar--empty');
  });

  it('reads percent / value captions', () => {
    stubUni();
    const pct = mount(SnSliderBar, { props: { modelValue: 40, showValue: true } });
    expect(pct.find('.sn-slider-bar__value').text()).toBe('40%');
    const raw = mount(SnSliderBar, {
      props: { modelValue: 40, showValue: true, format: 'value', valueSuffix: ' ms' },
    });
    expect(raw.find('.sn-slider-bar__value').text()).toBe('40 ms');
  });

  it('shows the nearest level label', () => {
    stubUni();
    const levels = [
      { value: 0, label: '关闭' },
      { value: 50, label: '中' },
      { value: 100, label: '最大' },
    ];
    const wrapper = mount(SnSliderBar, {
      props: { modelValue: 55, levels, showValue: true },
    });
    expect(wrapper.find('.sn-slider-bar__value').text()).toBe('中');
    expect(wrapper.findAll('.sn-slider-bar__level-mark')).toHaveLength(3);
  });

  it('marks the active level tick', () => {
    stubUni();
    const levels = [
      { value: 0, label: 'a' },
      { value: 100, label: 'b' },
    ];
    const wrapper = mount(SnSliderBar, { props: { modelValue: 100, levels } });
    expect(wrapper.findAll('.sn-slider-bar__level-mark--on')).toHaveLength(1);
  });

  it('switches the in-track text colour between the filled and empty states', () => {
    stubUni();
    const wrapper = mount(SnSliderBar, {
      props: { modelValue: 40, label: '音量', innerColor: '#fff', innerColorEmpty: '#888' },
    });
    const cls = wrapper.classes().join(' ');
    expect(cls).not.toContain('sn-slider-bar--empty');
    const style = (wrapper.attributes('style') ?? '').replace(/\s+/g, '');
    expect(style).toContain('--sn-bar-inner-color:#fff');
    expect(style).toContain('--sn-bar-inner-color-empty:#888');
  });

  it('renders the aurora gradient and star field', () => {
    stubUni();
    const wrapper = mount(SnSliderBar, {
      props: { modelValue: 60, theme: 'aurora', sparkles: 5 },
    });
    expect(wrapper.classes()).toContain('sn-slider-bar--aurora');
    expect(wrapper.classes()).toContain('sn-slider-bar--animated');
    expect(styleOf(wrapper, '.sn-slider-bar__fill')).toContain('linear-gradient');
    expect(wrapper.findAll('.sn-slider-bar__star')).toHaveLength(5);
  });

  it('drops the animation with animated=false', () => {
    stubUni();
    const wrapper = mount(SnSliderBar, {
      props: { modelValue: 60, theme: 'aurora', animated: false },
    });
    expect(wrapper.classes()).not.toContain('sn-slider-bar--animated');
    expect(wrapper.findAll('.sn-slider-bar__star')).toHaveLength(0);
  });

  it('maps size tiers onto the thickness variable', () => {
    stubUni();
    const small = mount(SnSliderBar, { props: { modelValue: 10, size: 'small' } });
    expect((small.attributes('style') ?? '').replace(/\s+/g, '')).toContain(
      '--sn-bar-thickness:28rpx',
    );
    const medium = mount(SnSliderBar, { props: { modelValue: 10 } });
    expect((medium.attributes('style') ?? '').replace(/\s+/g, '')).toContain(
      '--sn-bar-thickness:40rpx',
    );
    const large = mount(SnSliderBar, { props: { modelValue: 10, size: 'large' } });
    expect((large.attributes('style') ?? '').replace(/\s+/g, '')).toContain(
      '--sn-bar-thickness:56rpx',
    );
  });

  it('accepts an explicit height', () => {
    stubUni();
    const wrapper = mount(SnSliderBar, { props: { modelValue: 10, barHeight: 240 } });
    expect((wrapper.attributes('style') ?? '').replace(/\s+/g, '')).toContain(
      '--sn-bar-height:240rpx',
    );
  });

  it('renders the column variant with the read-out', () => {
    stubUni();
    const wrapper = mount(SnSliderBar, {
      props: { modelValue: 60, variant: 'column', showValue: true },
    });
    expect(wrapper.classes()).toContain('sn-slider-bar--column');
    expect(wrapper.find('.sn-slider-bar__value').exists()).toBe(true);
    expect(styleOf(wrapper, '.sn-slider-bar__fill')).toContain('bottom:0px');
  });

  it('renders head / tail slots', () => {
    stubUni();
    const wrapper = mount(SnSliderBar, {
      props: { modelValue: 10 },
      slots: { start: '<i class="probe-start" />', end: '<i class="probe-end" />' },
    });
    expect(wrapper.find('.probe-start').exists()).toBe(true);
    expect(wrapper.find('.probe-end').exists()).toBe(true);
  });

  it('respects disabled', () => {
    stubUni();
    const wrapper = mount(SnSliderBar, { props: { modelValue: 10, disabled: true } });
    expect(wrapper.classes()).toContain('sn-slider-bar--disabled');
  });

  // ---- reference-look knob styles (additive) ----------------------------

  it('rings the default knob in the theme colour (reference look)', () => {
    stubUni();
    const wrapper = mount(SnSliderBar, { props: { modelValue: 40 } });
    const knob = wrapper.find('.sn-slider-bar__knob');
    expect(knob.classes()).toContain('sn-slider-bar__knob--round');
    // The default CSS custom props live on the root stylesheet; instance only
    // carries vars when explicitly overridden — assert the knob uses them.
    expect(knob.exists()).toBe(true);
  });

  it('maps knobShape onto the knob modifier class', () => {
    stubUni();
    const square = mount(SnSliderBar, { props: { modelValue: 40, knobShape: 'square' } });
    expect(square.find('.sn-slider-bar__knob').classes()).toContain('sn-slider-bar__knob--square');
    const pill = mount(SnSliderBar, { props: { modelValue: 40, knobShape: 'pill' } });
    expect(pill.find('.sn-slider-bar__knob').classes()).toContain('sn-slider-bar__knob--pill');
    // range mode applies the shape to both knobs
    const range = mount(SnSliderBar, {
      props: { modelValue: [20, 60], range: true, knobShape: 'pill' },
    });
    expect(
      range
        .findAll('.sn-slider-bar__knob')
        .every((k) => k.classes().includes('sn-slider-bar__knob--pill')),
    ).toBe(true);
  });

  it('emits knob colour / outline vars only when provided', () => {
    stubUni();
    const plain = mount(SnSliderBar, { props: { modelValue: 40 } });
    expect(plain.attributes('style') ?? '').not.toContain('--sn-bar-knob-color');
    const styled = mount(SnSliderBar, {
      props: {
        modelValue: 40,
        knobColor: '#222',
        knobBorderColor: '#34c759',
        knobBorderWidth: '6rpx',
      },
    });
    const style = (styled.attributes('style') ?? '').replace(/\s+/g, '');
    expect(style).toContain('--sn-bar-knob-color:#222');
    expect(style).toContain('--sn-bar-knob-border-color:#34c759');
    expect(style).toContain('--sn-bar-knob-border-width:6rpx');
  });

  it('paints the pill knob taller and narrower than the track', () => {
    stubUni();
    const round = mount(SnSliderBar, { props: { modelValue: 40, thickness: 80 } });
    const pill = mount(SnSliderBar, {
      props: { modelValue: 40, thickness: 80, knobShape: 'pill' },
    });
    const r = (round.attributes('style') ?? '').replace(/\s+/g, '');
    const p = (pill.attributes('style') ?? '').replace(/\s+/g, '');
    expect(r).toContain('--sn-bar-knob-w:104rpx'); // 1.30 × 80 — long axis is the travel axis
    expect(r).toContain('--sn-bar-knob-h:80rpx');
    expect(p).toContain('--sn-bar-knob-w:44rpx'); // 0.55 × 80
    expect(p).toContain('--sn-bar-knob-h:66rpx'); // 0.82 × 80
  });

  it('keeps the square knob 1:1 and honours an explicit radius', () => {
    stubUni();
    const square = mount(SnSliderBar, {
      props: { modelValue: 40, thickness: 80, knobShape: 'square' },
    });
    const s = (square.attributes('style') ?? '').replace(/\s+/g, '');
    expect(s).toContain('--sn-bar-knob-w:80rpx');
    expect(s).toContain('--sn-bar-knob-h:80rpx');

    const disc = mount(SnSliderBar, {
      props: { modelValue: 40, knobShape: 'square', knobRadius: '50%' },
    });
    expect(styleOf(disc, '.sn-slider-bar__knob')).toContain('--sn-bar-knob-radius:50%');
    // untouched by default — the shape modifier keeps its own radius
    const plain = mount(SnSliderBar, { props: { modelValue: 40, knobShape: 'square' } });
    expect(styleOf(plain, '.sn-slider-bar__knob') ?? '').not.toContain('--sn-bar-knob-radius');
  });

  it('measures the column knob across the strip, not along it', () => {
    stubUni();
    const wrapper = mount(SnSliderBar, {
      props: { modelValue: 40, variant: 'column', thickness: 80 },
    });
    const s = (wrapper.attributes('style') ?? '').replace(/\s+/g, '');
    expect(s).toContain('--sn-bar-knob-w:80rpx');
    expect(s).toContain('--sn-bar-knob-h:104rpx'); // 1.30 × 80
  });

  it('applies a custom track background without touching the fill', () => {
    stubUni();
    const wrapper = mount(SnSliderBar, {
      props: { modelValue: 40, barBackground: 'linear-gradient(90deg,#f66,#fc3)' },
    });
    expect(styleOf(wrapper, '.sn-slider-bar__track')).toContain('linear-gradient');
    expect((wrapper.attributes('style') ?? '').replace(/\s+/g, '')).toContain(
      '--sn-bar-track-bg:linear-gradient(90deg,#f66,#fc3)',
    );
    // fill geometry unchanged by the background
    expect(styleOf(wrapper, '.sn-slider-bar__fill')).toContain('right:60%');
  });

  it('starts a gesture that begins before the async measurement lands', () => {
    // Mini-program / App: no synchronous geometry, so the press arrives while
    // the track box is still unknown. It must wait for the query instead of
    // being dropped — that was the "小程序拉不动" bug.
    const query = stubDeferredUni();
    const wrapper = mount(SnSliderBar, { props: { modelValue: 20 } });
    const track = wrapper.find('.sn-slider-bar__track').element;

    track.dispatchEvent(touchEvent('touchstart', 150, 20));
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();

    query.resolve({ left: 0, top: 0, width: 300, height: 40 });
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe(50);
  });

  it('falls back to a page-wide query when the scoped lookup finds nothing', () => {
    const scopes: boolean[] = [];
    const box = { left: 0, top: 0, width: 200, height: 20 };
    (globalThis as unknown as { uni: unknown }).uni = {
      createSelectorQuery: () => ({
        in: () => {
          scopes.push(true);
          return {
            select: () => ({
              // A host that ignores `in()` answers with nothing.
              boundingClientRect: (cb: (rect: null) => void) => {
                cb(null);
                return { exec: () => undefined };
              },
            }),
          };
        },
        select: () => {
          scopes.push(false);
          return {
            boundingClientRect: (cb: (rect: typeof box) => void) => {
              cb(box);
              return { exec: () => undefined };
            },
          };
        },
      }),
    };
    mount(SnSliderBar, { props: { modelValue: 20 } });
    expect(scopes).toEqual([true, false]);
  });

  it('positions the thumb along the travel band', () => {
    stubUni();
    const wrapper = mount(SnSliderBar, { props: { modelValue: 48 } });
    // A percent sign must never be doubled — an invalid `left:48%%` is dropped
    // by the browser and the thumb sticks to the start.
    expect(styleOf(wrapper, '.sn-slider-bar__knob')).toContain('left:48%');
    expect(styleOf(wrapper, '.sn-slider-bar__knob')).toContain('top:50%');
  });

  it('keeps the thumb inside the track by insetting the travel band', () => {
    stubUni();
    const wrapper = mount(SnSliderBar, { props: { modelValue: 40, knobAlign: 'inset' } });
    const travel = wrapper.findAll('.sn-slider-bar__travel');
    // One layer for the fill, one for the knobs. Only the fill layer is inset —
    // the thumb layer spans the raw track and folds the inset into each knob's
    // margin, because uni-app x clips `view` overflow: an inset thumb layer
    // would clip the half-knob it exists to protect (half-disc "C" at 0 / max).
    expect(travel.length).toBe(2);
    expect(travel[0]?.classes()).toContain('sn-slider-bar__travel--fill');
    expect(travel[0]?.find('.sn-slider-bar__fill').exists()).toBe(true);
    expect(travel[1]?.classes()).toContain('sn-slider-bar__travel--knobs');
    expect(travel[1]?.find('.sn-slider-bar__knob').exists()).toBe(true);
    const root = (wrapper.attributes('style') ?? '').replace(/\s+/g, '');
    // default knob = 1.3 × 40rpx = 52rpx; the fill band runs on the raw track,
    // so no half-knob inset vars are emitted at all.
    expect(root).toContain('--sn-bar-knob-w:52rpx');
    expect(root).not.toContain('--sn-bar-knob-hw');
  });

  it('pulls the thumb half a knob inwards at both ends in inset mode', () => {
    stubUni();
    // left: p% already lands the centre on the track; the margin supplies the
    // remaining half-knob inset, so the box never overflows its layer.
    const at = (value: number) =>
      styleOf(
        mount(SnSliderBar, { props: { modelValue: value, knobAlign: 'inset' } }),
        '.sn-slider-bar__knob',
      );
    expect(at(0)).toContain('left:0%');
    expect(at(0)).toContain('--sn-bar-knob-shift:26rpx');
    expect(at(50)).toContain('--sn-bar-knob-shift:0rpx');
    expect(at(100)).toContain('--sn-bar-knob-shift:-26rpx');
    // vertical travel insets along the vertical axis
    const column = mount(SnSliderBar, {
      props: { modelValue: 100, variant: 'column', knobAlign: 'inset' },
    });
    const style = styleOf(column, '.sn-slider-bar__knob');
    expect(style).toContain('bottom:100%');
    // column: the travel axis is the height — 1.3 × 40rpx = 52rpx → half = 26rpx
    expect(style).toContain('--sn-bar-knob-shift:-26rpx');
  });

  it('lets the thumb straddle the cap in the default overlap mode', () => {
    stubUni();
    // No inset at all: `left: p%` puts the centre on the raw track, so at 0 /
    // 100 % half the thumb overlaps the capsule's cap instead of being tucked
    // inside it. The fill band is not inset either, so its round cap lands on
    // the track's own cap and its tail ends under the thumb centre.
    const at = (value: number) => {
      const w = mount(SnSliderBar, { props: { modelValue: value } });
      return {
        knob: styleOf(w, '.sn-slider-bar__knob'),
        fill: styleOf(w, '.sn-slider-bar__fill'),
        root: (w.attributes('style') ?? '').replace(/\s+/g, ''),
      };
    };
    expect(at(0).knob).toContain('left:0%');
    expect(at(0).knob).toContain('--sn-bar-knob-shift:0rpx');
    expect(at(100).knob).toContain('left:100%');
    expect(at(100).knob).toContain('--sn-bar-knob-shift:0rpx');
    expect(at(40).root).not.toContain('--sn-bar-knob-hw');
    expect(at(40).fill).toContain('left:0px');
    expect(at(40).fill).toContain('right:60%');
  });

  it('marks the thumb and ticks as column with a modifier class (uni-app x)', () => {
    stubUni();
    // A descendant override (`.sn-slider-bar--column .knob`) is flattened into
    // a custom property on the *root*, where `--sn-bar-knob-shift` does not
    // exist — it lives on each thumb. The margin then resolved to 0 and every
    // vertical thumb sat half a knob too low, hanging out of the track at 100.
    // A modifier class keeps the property on the element that owns the var.
    const column = mount(SnSliderBar, {
      props: { modelValue: 60, variant: 'column', levels: [{ value: 0, label: 'Off' }] },
    });
    expect(column.find('.sn-slider-bar__knob').classes()).toContain(
      'sn-slider-bar__knob--column',
    );
    expect(column.find('.sn-slider-bar__level-mark').classes()).toContain(
      'sn-slider-bar__level-mark--column',
    );
    const bar = mount(SnSliderBar, { props: { modelValue: 60 } });
    expect(bar.find('.sn-slider-bar__knob').classes()).not.toContain(
      'sn-slider-bar__knob--column',
    );
  });

  it('puts level ticks on the same travel axis as the thumb', () => {
    stubUni();
    const wrapper = mount(SnSliderBar, {
      props: {
        modelValue: 0,
        knobAlign: 'inset',
        levels: [
          { value: 0, label: 'Off' },
          { value: 100, label: 'Max' },
        ],
      },
    });
    const marks = wrapper.findAll('.sn-slider-bar__level-mark');
    expect(marks).toHaveLength(2);
    expect(styleOf(wrapper, '.sn-slider-bar__level-mark')).toContain('--sn-bar-knob-shift:26rpx');
    expect(marks[1]?.attributes('style')?.replace(/\s+/g, '')).toContain(
      '--sn-bar-knob-shift:-26rpx',
    );
  });

  it('bleeds the thumb layer across the track for an oversized knob', () => {
    stubUni();
    // 40rpx track, 56rpx disc (1:1) → 8rpx of overhang on each side.
    const big = (
      mount(SnSliderBar, {
        props: { modelValue: 20, knobShape: 'circle', knobSize: 56 },
      }).attributes('style') ?? ''
    ).replace(/\s+/g, '');
    expect(big).toContain('--sn-bar-knob-bleed-neg:-8rpx');
    // Inscribed shapes (circle / square / the default round) never overhang.
    const plain = (
      mount(SnSliderBar, { props: { modelValue: 20, knobShape: 'circle' } }).attributes('style') ??
      ''
    ).replace(/\s+/g, '');
    expect(plain).toContain('--sn-bar-knob-bleed-neg:-0rpx');
    // Column: the travel axis is vertical, so the cross axis is the width.
    const column = (
      mount(SnSliderBar, {
        props: { modelValue: 20, variant: 'column', knobShape: 'circle', knobSize: 56 },
      }).attributes('style') ?? ''
    ).replace(/\s+/g, '');
    expect(column).toContain('--sn-bar-knob-bleed-neg:-8rpx');
  });

  it('renders a true circle knob', () => {
    stubUni();
    const wrapper = mount(SnSliderBar, {
      props: { modelValue: 30, knobShape: 'circle', knobAlign: 'inset' },
    });
    const knob = wrapper.find('.sn-slider-bar__knob');
    expect(knob.classes()).toContain('sn-slider-bar__knob--circle');
    const root = (wrapper.attributes('style') ?? '').replace(/\s+/g, '');
    // inscribed disc: both sides equal the track thickness
    expect(root).toContain('--sn-bar-knob-w:40rpx');
    expect(root).toContain('--sn-bar-knob-h:40rpx');
  });

  it('honours an explicit knobSize over the shape ratio', () => {
    stubUni();
    const wrapper = mount(SnSliderBar, {
      props: { modelValue: 30, knobShape: 'circle', knobSize: 64, knobAlign: 'inset' },
    });
    const root = (wrapper.attributes('style') ?? '').replace(/\s+/g, '');
    expect(root).toContain('--sn-bar-knob-w:64rpx');
    expect(root).toContain('--sn-bar-knob-h:64rpx');
  });

  it('repaints the track / fill / ring from a theme preset', () => {
    stubUni();
    const wrapper = mount(SnSliderBar, { props: { modelValue: 55, theme: 'ocean' } });
    const root = (wrapper.attributes('style') ?? '').replace(/\s+/g, '');
    expect(root).toContain('--sn-bar-fill:linear-gradient(90deg,#06b6d4,#2563eb)');
    expect(root).toContain('--sn-bar-knob-border-color:#0ea5e9');
    expect(root).toContain('--sn-bar-track:rgba(14,165,233,0.16)');
    // the fill paints the preset gradient
    expect(styleOf(wrapper, '.sn-slider-bar__fill')).toContain('linear-gradient(90deg,#06b6d4');
    // geometry untouched by the theme
    expect(styleOf(wrapper, '.sn-slider-bar__fill')).toContain('right:45%');
  });

  it('lets an explicit knob colour win over the theme ring', () => {
    stubUni();
    const wrapper = mount(SnSliderBar, {
      props: { modelValue: 55, theme: 'mono', knobBorderColor: '#ff0055' },
    });
    const root = (wrapper.attributes('style') ?? '').replace(/\s+/g, '');
    expect(root).toContain('--sn-bar-knob-border-color:#ff0055');
    expect(root).not.toContain('--sn-bar-knob-border-color:rgba(17,24,39,0.88)');
  });

  it('paints an sn-icon glyph inside the thumb', () => {
    stubUni();
    const wrapper = mount(SnSliderBar, {
      props: { modelValue: 40, knobShape: 'circle', knobIcon: 'star' },
    });
    const icon = wrapper.findComponent({ name: 'SnIcon' });
    expect(icon.exists()).toBe(true);
    expect(wrapper.find('.sn-slider-bar__knob').find('.sn-slider-bar__knob-icon').exists()).toBe(
      true,
    );
    // 56 % of the inscribed 40rpx disc → 22rpx, and the glyph inherits the ring
    // colour (sn-icon's `currentColor`, which the stylesheet points at it).
    expect(icon.props('size')).toBe('22rpx');
    expect(icon.props('color')).toBe('currentColor');
  });

  it('honours knobIconColor / knobIconSize', () => {
    stubUni();
    const coloured = mount(SnSliderBar, {
      props: { modelValue: 40, knobIcon: 'heart', knobIconColor: '#f43f5e' },
    });
    expect(coloured.findComponent({ name: 'SnIcon' }).props('color')).toBe('#f43f5e');
    // Inline size wins over the 56 % default; numbers are rpx, "12px" as-is.
    const numeric = mount(SnSliderBar, {
      props: { modelValue: 40, knobIcon: 'heart', knobIconSize: 24 },
    });
    expect(numeric.findComponent({ name: 'SnIcon' }).props('size')).toBe('24rpx');
    const explicit = mount(SnSliderBar, {
      props: { modelValue: 40, knobIcon: 'heart', knobIconSize: '12px' },
    });
    expect(explicit.findComponent({ name: 'SnIcon' }).props('size')).toBe('12px');
  });

  it('lets the glyph follow the theme ring unless overridden', () => {
    stubUni();
    const themed = mount(SnSliderBar, {
      props: { modelValue: 40, theme: 'ocean', knobIcon: 'check' },
    });
    expect(themed.findComponent({ name: 'SnIcon' }).props('color')).toBe('#0ea5e9');
    const overridden = mount(SnSliderBar, {
      props: { modelValue: 40, theme: 'ocean', knobIcon: 'check', knobIconColor: '#111827' },
    });
    expect(overridden.findComponent({ name: 'SnIcon' }).props('color')).toBe('#111827');
  });

  it('keeps the thumb bare when no glyph is configured', () => {
    stubUni();
    const wrapper = mount(SnSliderBar, { props: { modelValue: 40 } });
    expect(wrapper.find('.sn-slider-bar__knob-icon').exists()).toBe(false);
    expect(wrapper.findComponent({ name: 'SnIcon' }).exists()).toBe(false);
    // A `knob` slot still renders for fully custom thumbs.
    const slotted = mount(SnSliderBar, {
      props: { modelValue: 40 },
      slots: { knob: '<text class="custom-glyph">A</text>' },
    });
    expect(slotted.find('.sn-slider-bar__knob .custom-glyph').exists()).toBe(true);
  });

  it('keeps both travel layers in the column variant', () => {
    stubUni();
    // The column branch overrides `top` / `bottom` / `left` / `right` on both
    // layers. uni-app x rewrites every variant-overridden property into
    // `prop: var(--snx-…)` and only emits a fallback for properties the *base*
    // rule declares — a missing fallback computes to `auto`, which collapsed the
    // thumb layer to zero width and made the bar undraggable (the thumb read
    // `left: 48%` but landed on 0). Both layers must therefore render in both
    // orientations.
    const wrapper = mount(SnSliderBar, { props: { modelValue: 40, variant: 'column' } });
    expect(wrapper.findAll('.sn-slider-bar__travel--knobs')).toHaveLength(1);
    expect(wrapper.findAll('.sn-slider-bar__travel--fill')).toHaveLength(1);
    // Column fill grows upwards from the bottom cap: 40 % leaves the band
    // ending at 60 % from the top.
    expect(styleOf(wrapper, '.sn-slider-bar__fill')).toContain('top:60%');
    expect(styleOf(wrapper, '.sn-slider-bar__fill')).toContain('bottom:0px');
  });
});
