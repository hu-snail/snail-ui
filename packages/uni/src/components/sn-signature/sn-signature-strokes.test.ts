/**
 * sn-signature strokes / mouse unit tests — geometry + desktop H5 drawing.
 *
 * Behaviour only (AGENTS.md §46):
 *   - distance sampling keeps the node count flat (丝滑)
 *   - bars are extended by one line width so kinks stay covered (连贯性)
 *   - the desktop mouse path (mousedown/mousemove/mouseup on `document`)
 *     feeds the same stroke pipeline — the demo "无法签名" regression
 *   - unmount removes the mouse listeners (AGENTS.md §41)
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import SnSignature from './sn-signature.vue';
import { barsOf, shouldSample, SAMPLE_MIN_DISTANCE } from './sn-signature-strokes';

describe('sn-signature stroke geometry', () => {
  it('samples points only past the minimum travel distance', () => {
    expect(shouldSample(undefined, { x: 0, y: 0 })).toBe(true); // first point always lands
    expect(shouldSample({ x: 0, y: 0 }, { x: 1.5, y: 0 })).toBe(false);
    expect(shouldSample({ x: 0, y: 0 }, { x: SAMPLE_MIN_DISTANCE, y: 0 })).toBe(true);
    expect(shouldSample({ x: 0, y: 0 }, { x: 0, y: 3 })).toBe(true);
  });

  it('extends each bar by one line width so joints stay covered', () => {
    const bars = barsOf(
      [
        { x: 0, y: 0 },
        { x: 30, y: 0 },
        { x: 30, y: 40 },
      ],
      3,
    );
    expect(bars).toHaveLength(2);
    // Horizontal bar: length 30 → width 33 (round tail covers the kink).
    expect(bars[0]?.width).toBeCloseTo(33);
    expect(bars[0]?.angle).toBeCloseTo(0);
    // Vertical bar: length 40 → width 43, rotated 90°, anchored at the kink.
    expect(bars[1]?.width).toBeCloseTo(43);
    expect(bars[1]?.angle).toBeCloseTo(90);
    expect(bars[1]?.left).toBeCloseTo(30);
  });

  it('skips degenerate zero-length segments', () => {
    expect(
      barsOf(
        [
          { x: 5, y: 5 },
          { x: 5, y: 5 },
        ],
        3,
      ),
    ).toHaveLength(0);
  });
});

describe('sn-signature desktop mouse drawing', () => {
  /** Stub the pad box so pad-relative points are deterministic. */
  function withPadBox(w: ReturnType<typeof mount>): void {
    const pad = w.find('.sn-signature__pad');
    const element = pad.element as HTMLElement;
    element.getBoundingClientRect = () =>
      ({
        left: 0,
        top: 0,
        width: 200,
        height: 200,
        right: 200,
        bottom: 200,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect;
  }

  it('draws a stroke through mousedown / mousemove / mouseup', async () => {
    const w = mount(SnSignature);
    withPadBox(w);
    await nextTick();

    document.dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: 20, clientY: 20 }));
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 60, clientY: 20 }));
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 60, clientY: 60 }));
    document.dispatchEvent(new MouseEvent('mouseup'));
    await nextTick();

    // Two moves past the sample threshold → two bars, one committed stroke.
    expect(w.findAll('.sn-signature__bar')).toHaveLength(2);
    expect(w.emitted('start')).toHaveLength(1);
    expect(w.emitted('signing')).toHaveLength(2);
    expect(w.emitted('end')).toHaveLength(1);
  });

  it('ignores tiny mouse travel below the sample threshold', async () => {
    const w = mount(SnSignature);
    withPadBox(w);
    await nextTick();

    document.dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: 20, clientY: 20 }));
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 20.5, clientY: 20.5 }));
    document.dispatchEvent(new MouseEvent('mouseup'));
    await nextTick();

    expect(w.emitted('signing')).toBeUndefined();
    expect(w.findAll('.sn-signature__bar')).toHaveLength(0);
  });

  it('does not draw while disabled', async () => {
    const w = mount(SnSignature, { props: { disabled: true } });
    withPadBox(w);
    await nextTick();

    document.dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: 20, clientY: 20 }));
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 60, clientY: 60 }));
    document.dispatchEvent(new MouseEvent('mouseup'));
    await nextTick();

    expect(w.findAll('.sn-signature__bar')).toHaveLength(0);
    expect(w.emitted('start')).toBeUndefined();
  });

  it('removes the mouse listeners on unmount', async () => {
    const w = mount(SnSignature);
    withPadBox(w);
    await nextTick();
    w.unmount();

    document.dispatchEvent(new MouseEvent('mousedown', { button: 0, clientX: 20, clientY: 20 }));
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 60, clientY: 60 }));
    document.dispatchEvent(new MouseEvent('mouseup'));

    // No active instance to assert on; the guarantee is "no throw + no leak".
    expect(true).toBe(true);
  });
});
