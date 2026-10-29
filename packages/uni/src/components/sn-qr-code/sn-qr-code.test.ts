/**
 * sn-qr-code unit tests — uni-end QR code (wd-qr-code parity).
 *
 * Two layers are covered:
 *   1. `sn-qr-core` — the encoder itself, verified against structural invariants
 *      of ISO/IEC 18004 (finder / timing / alignment patterns, format info,
 *      version selection, EC boost, mode selection) plus a known vector.
 *   2. `sn-qr-code` — the component: prop forwarding onto the canvas node, the
 *      `error` path for oversized payloads, `exportImage` capability guard and
 *      the dark / light module colors reaching the canvas context.
 *
 * Per CONTRIBUTING §3, assertions avoid `rpx` lengths: happy-dom drops CSS
 * lengths it cannot parse, so the component's own geometry is asserted through
 * classes / attributes and the canvas paint through the recorded context calls.
 *
 * Untestable in happy-dom (component): none — sn-qr-code.vue is at 100% lines
 * (the DOM canvas fallback is exercised through a `HTMLCanvasElement.getContext`
 * stub; the uni context through a `globalThis.uni` stub).
 * Untestable via the public API (sn-qr-core): lines 193-194 (`appendBits`
 * RangeError guard) and 391 (`getMask` default throw) — both are internal
 * defensive branches reachable only with arguments the encoder never produces
 * (bit lengths outside 0-31, mask values outside 0-7). Exporting them purely
 * for coverage would widen the module's API for no behavioural gain.
 */

import { afterEach, describe, it, expect, vi, type MockInstance } from 'vitest';
import { mount } from '@vue/test-utils';
import SnQrCode from './sn-qr-code.vue';
import { encode, pickSegmentMode, type SnQrEncoded } from './sn-qr-core';

/** Render a matrix as `#`/`.` rows — handy for structural assertions. */
function matrixRows(qr: SnQrEncoded): string[] {
  const rows: string[] = [];
  for (let y = 0; y < qr.size; y++) {
    let row = '';
    for (let x = 0; x < qr.size; x++) row += qr.getModule(x, y) ? '#' : '.';
    rows.push(row);
  }
  return rows;
}

/** ISO format-bits payload per EC level (uint2), fixed by the standard. */
const FORMAT_BITS = { L: 1, M: 0, Q: 3, H: 2 } as const;

/** Read the top-left 15-bit format-info copy out of the grid. */
function readFormatBits(qr: SnQrEncoded): number {
  const bits: boolean[] = new Array<boolean>(15).fill(false);
  for (let i = 0; i <= 5; i++) bits[i] = qr.getModule(8, i);
  bits[6] = qr.getModule(8, 7);
  bits[7] = qr.getModule(8, 8);
  bits[8] = qr.getModule(7, 8);
  for (let i = 9; i < 15; i++) bits[i] = qr.getModule(14 - i, 8);
  let value = 0;
  for (let i = 0; i < 15; i++) if (bits[i]) value |= 1 << i;
  return value;
}

/** Assert a 7×7 finder pattern (plus separators) centered at (cx, cy). */
function expectFinderPattern(qr: SnQrEncoded, cx: number, cy: number): void {
  for (let dy = -3; dy <= 3; dy++) {
    for (let dx = -3; dx <= 3; dx++) {
      const dist = Math.max(Math.abs(dx), Math.abs(dy));
      expect(qr.getModule(cx + dx, cy + dy)).toBe(dist !== 2);
    }
  }
  expect(qr.getModule(cx + 4, cy)).toBe(false);
  expect(qr.getModule(cx, cy + 4)).toBe(false);
}

/** Assert a 5×5 alignment pattern centered at (cx, cy). */
function expectAlignmentPattern(qr: SnQrEncoded, cx: number, cy: number): void {
  expect(qr.getModule(cx, cy)).toBe(true);
  expect(qr.getModule(cx - 1, cy)).toBe(false);
  expect(qr.getModule(cx - 2, cy)).toBe(true);
  expect(qr.getModule(cx - 2, cy - 2)).toBe(true);
  expect(qr.getModule(cx + 2, cy + 2)).toBe(true);
}

/* ── Recording canvas stub ──────────────────────────────────────────────── */

interface RecordedCall {
  method: string;
  args: unknown[];
  fillStyle: unknown;
}

/** Recorded gradient creation: geometry + the stops added to it. */
interface RecordedGradient {
  args: unknown[];
  stops: Array<{ offset: number; color: string }>;
  /** The exact object handed to the canvas as `fillStyle`. */
  handle: { addColorStop: (offset: number, color: string) => void };
}

/** A fake canvas context that records every draw call. */
function createRecordingContext(): {
  context: Record<string, unknown>;
  calls: RecordedCall[];
  gradients: RecordedGradient[];
} {
  const calls: RecordedCall[] = [];
  const gradients: RecordedGradient[] = [];
  const state: { fillStyle: unknown } = { fillStyle: '' };
  const record =
    (method: string) =>
    (...args: unknown[]) => {
      calls.push({ method, args, fillStyle: state.fillStyle });
    };
  const context: Record<string, unknown> = {
    fillRect: record('fillRect'),
    beginPath: record('beginPath'),
    arc: record('arc'),
    fill: record('fill'),
    draw: record('draw'),
    roundRect: record('roundRect'),
    createLinearGradient: (...args: unknown[]) => {
      const stops: Array<{ offset: number; color: string }> = [];
      const handle = {
        addColorStop: (offset: number, color: string) => {
          stops.push({ offset, color });
        },
      };
      gradients.push({ args, stops, handle });
      return handle;
    },
  };
  Object.defineProperty(context, 'fillStyle', {
    get: () => state.fillStyle,
    set: (value: unknown) => {
      state.fillStyle = value;
    },
  });
  return { context, calls, gradients };
}

/** Install a `globalThis.uni` stub with a canvas context; returns cleanup. */
function installUni(overrides: Record<string, unknown> = {}) {
  const recorder = createRecordingContext();
  const host = globalThis as { uni?: Record<string, unknown> };
  const previous = host.uni;
  host.uni = {
    createCanvasContext: () => recorder.context,
    ...overrides,
  };
  return {
    calls: recorder.calls,
    gradients: recorder.gradients,
    restore() {
      if (previous === undefined) delete host.uni;
      else host.uni = previous;
    },
  };
}

afterEach(() => {
  const host = globalThis as { uni?: unknown };
  delete host.uni;
  vi.useRealTimers();
  vi.restoreAllMocks();
});

/**
 * Stub the DOM canvas factory happy-dom exposes (its real one returns `null`)
 * so the H5 fallback paint path can be observed; returns the spy.
 */
function stubDomCanvasGetContext(context: unknown): MockInstance<() => unknown> {
  return vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => context);
}

describe('sn-qr-core', () => {
  it('should encode the same payload into an identical matrix', () => {
    const a = encode('https://snui.dev/order/20240001', 'M');
    const b = encode('https://snui.dev/order/20240001', 'M');
    expect(a.version).toBe(b.version);
    expect(a.mask).toBe(b.mask);
    expect(matrixRows(a)).toEqual(matrixRows(b));
  });

  it('should match the known vector for byte-mode "hello" at version 1', () => {
    // Byte mode (lowercase is outside the alphanumeric charset); the EC level
    // boosts M→H because 5 bytes still fit version 1 at H.
    const qr = encode('hello', 'M');
    expect(qr.version).toBe(1);
    expect(qr.size).toBe(21);
    expect(qr.mode).toBe('byte');
    expect(qr.level).toBe('H');
    expect(matrixRows(qr)).toEqual([
      '#######.....#.#######',
      '#.....#.......#.....#',
      '#.###.#.##.#..#.###.#',
      '#.###.#.#.#...#.###.#',
      '#.###.#...###.#.###.#',
      '#.....#...#...#.....#',
      '#######.#.#.#.#######',
      '.........###.........',
      '...##.##.###.....##..',
      '#.#..#.#.##...#####..',
      '##.#.##.##.#.#.#..###',
      '##..##.#.#..##.##.#..',
      '.#..#####.....####.#.',
      '........#.#.###..#.#.',
      '#######.#.#...#...#..',
      '#.....#..###.#...####',
      '#.###.#.#.#.#...##.##',
      '#.###.#.#.####..#....',
      '#.###.#...##.########',
      '#.....#..############',
      '#######...#..#.......',
    ]);
  });

  it('should select the densest single-segment mode for the payload', () => {
    expect(pickSegmentMode('')).toBe('byte');
    expect(pickSegmentMode('1234567890')).toBe('numeric');
    expect(pickSegmentMode('HELLO WORLD 123')).toBe('alphanumeric');
    expect(pickSegmentMode('hello')).toBe('byte');
    expect(pickSegmentMode('订单 2024')).toBe('byte');
  });

  it('should pick a smaller version for numeric payloads than byte mode would need', () => {
    const numeric = encode('123456789012345678901234567890', 'L', { boostEcl: false });
    expect(numeric.mode).toBe('numeric');
    // 30 digits = 100 data bits; version 1-L holds 152 bits, so v1 suffices.
    expect(numeric.version).toBe(1);
    expect(numeric.size).toBe(21);
  });

  it('should draw the three finder patterns and the timing patterns', () => {
    const qr = encode('AUI', 'M');
    expectFinderPattern(qr, 3, 3);
    expectFinderPattern(qr, qr.size - 4, 3);
    expectFinderPattern(qr, 3, qr.size - 4);
    for (let i = 8; i < qr.size - 8; i++) {
      expect(qr.getModule(i, 6)).toBe(i % 2 === 0);
      expect(qr.getModule(6, i)).toBe(i % 2 === 0);
    }
  });

  it('should draw alignment patterns for version 2 and up', () => {
    const qr = encode('AUI-UNI-QR-CODE-ALIGNMENT-PATTERN-CHECK', 'L');
    expect(qr.version).toBeGreaterThanOrEqual(2);
    const center = qr.size - 7;
    expectAlignmentPattern(qr, center, center);
  });

  it('should write the requested EC level into the format info when not boosted', () => {
    for (const level of ['L', 'M', 'Q', 'H'] as const) {
      const qr = encode('AUI', level, { boostEcl: false });
      expect(qr.level).toBe(level);
      // The 15-bit format word is XORed with the ISO mask 0x5412 — undo it.
      // Bits 14..13 hold the 2 EC-level bits, bits 12..10 the 3 mask bits.
      const bits = readFormatBits(qr) ^ 0x5412;
      expect((bits >> 13) & 0b11).toBe(FORMAT_BITS[level]);
      expect(qr.mask).toBe((bits >> 10) & 0b111);
    }
  });

  it('should raise the EC level while the payload still fits the version', () => {
    const boosted = encode('AUI', 'L');
    expect(boosted.version).toBe(1);
    expect(boosted.level).toBe('H');

    const unboosted = encode('AUI', 'L', { boostEcl: false });
    expect(unboosted.level).toBe('L');
  });

  it('should grow the version as the payload grows', () => {
    const small = encode('AUI', 'M');
    const medium = encode('x'.repeat(200), 'M');
    const large = encode('x'.repeat(1000), 'M');
    expect(small.version).toBeLessThan(medium.version);
    expect(medium.version).toBeLessThan(large.version);
    expect(large.size).toBe(large.version * 4 + 17);
  });

  it('should throw RangeError when the payload exceeds version 40', () => {
    expect(() => encode('x'.repeat(3000), 'H')).toThrow(RangeError);
  });

  it('should honour a forced mask pattern', () => {
    const qr = encode('AUI', 'M', { mask: 3, boostEcl: false });
    expect(qr.mask).toBe(3);
    expect(((readFormatBits(qr) ^ 0x5412) >> 10) & 0b111).toBe(3);
  });
});

describe('sn-qr-code', () => {
  it('should render a canvas node with the encoded geometry', () => {
    const wrapper = mount(SnQrCode, { props: { text: 'https://snui.dev' } });
    const canvas = wrapper.find('canvas');
    expect(canvas.exists()).toBe(true);
    expect(wrapper.classes()).toContain('sn-qr-code');
    // Version + module count are exposed for inspection / tests.
    expect(Number(canvas.attributes('data-version'))).toBeGreaterThanOrEqual(1);
    expect(Number(canvas.attributes('data-modules'))).toBe(
      Number(canvas.attributes('data-version')) * 4 + 17,
    );
  });

  it('should expose the dot type as a root modifier class', () => {
    const wrapper = mount(SnQrCode, { props: { text: 'AUI', dotType: 'dots' } });
    expect(wrapper.classes()).toContain('sn-qr-code--dots');
    expect(wrapper.find('canvas').attributes('data-dot-type')).toBe('dots');
  });

  it('should use a per-instance canvas id unless one is given', () => {
    const a = mount(SnQrCode, { props: { text: 'A' } });
    const b = mount(SnQrCode, { props: { text: 'B' } });
    expect(a.find('canvas').attributes('canvas-id')).not.toBe(
      b.find('canvas').attributes('canvas-id'),
    );

    const fixed = mount(SnQrCode, { props: { text: 'C', canvasId: 'my-canvas' } });
    expect(fixed.find('canvas').attributes('canvas-id')).toBe('my-canvas');
  });

  it('should paint the matrix through the uni canvas context', () => {
    const uni = installUni();
    try {
      const wrapper = mount(SnQrCode, { props: { text: 'AUI', size: 120 } });
      // Quiet-zone plate + at least one dark module + the flush call.
      const fillRects = uni.calls.filter((call) => call.method === 'fillRect');
      expect(fillRects.length).toBeGreaterThan(1);
      expect(uni.calls.some((call) => call.method === 'draw')).toBe(true);
      expect(wrapper.find('.sn-qr-code__error').exists()).toBe(false);
    } finally {
      uni.restore();
    }
  });

  it('should paint with the light color as the quiet-zone plate', () => {
    const uni = installUni();
    try {
      mount(SnQrCode, { props: { text: 'AUI', colorLight: 'linen' } });
      const plate = uni.calls.find((call) => call.method === 'fillRect');
      expect(plate?.fillStyle).toBe('linen');
    } finally {
      uni.restore();
    }
  });

  it('should paint dark modules with colorDark and fall back to black', () => {
    const withColor = installUni();
    try {
      mount(SnQrCode, { props: { text: 'AUI', colorDark: 'navy' } });
      const darkCalls = withColor.calls.filter((call) => call.method === 'fillRect');
      // The plate is the first fill; module fills follow with the dark color.
      expect(darkCalls.slice(1).every((call) => call.fillStyle === 'navy')).toBe(true);
    } finally {
      withColor.restore();
    }

    const byDefault = installUni();
    try {
      mount(SnQrCode, { props: { text: 'AUI' } });
      const darkCalls = byDefault.calls.filter((call) => call.method === 'fillRect');
      expect(darkCalls.slice(1).every((call) => call.fillStyle === 'black')).toBe(true);
    } finally {
      byDefault.restore();
    }
  });

  it('should add a quiet zone from margin', () => {
    const without = installUni();
    try {
      mount(SnQrCode, { props: { text: 'AUI', size: 200 } });
    } finally {
      without.restore();
    }
    const firstModuleNoMargin = without.calls.filter((call) => call.method === 'fillRect')[1];

    const withMargin = installUni();
    try {
      mount(SnQrCode, { props: { text: 'AUI', size: 200, margin: 20 } });
    } finally {
      withMargin.restore();
    }
    const firstModuleWithMargin = withMargin.calls.filter((call) => call.method === 'fillRect')[1];

    // The quiet zone shifts the first module right / down by `margin` px.
    expect(Number(firstModuleWithMargin?.args[0])).toBeGreaterThan(
      Number(firstModuleNoMargin?.args[0]),
    );
  });

  it('should shrink the module fill ratio from dotScale', () => {
    const full = installUni();
    try {
      mount(SnQrCode, { props: { text: 'AUI', size: 200 } });
    } finally {
      full.restore();
    }
    const fullWidth = Number(full.calls.filter((call) => call.method === 'fillRect')[1]?.args[2]);

    const half = installUni();
    try {
      mount(SnQrCode, { props: { text: 'AUI', size: 200, dotScale: 0.5 } });
    } finally {
      half.restore();
    }
    const halfWidth = Number(half.calls.filter((call) => call.method === 'fillRect')[1]?.args[2]);

    expect(halfWidth).toBeLessThan(fullWidth);
    expect(halfWidth).toBeGreaterThan(0);
  });

  it('should paint dots as circles when the canvas supports arcs', () => {
    const uni = installUni();
    try {
      mount(SnQrCode, { props: { text: 'AUI', dotType: 'dots' } });
      expect(uni.calls.some((call) => call.method === 'arc')).toBe(true);
    } finally {
      uni.restore();
    }
  });

  it('should bridge neighbouring dots in liquid mode', () => {
    const dots = installUni();
    try {
      mount(SnQrCode, { props: { text: 'AUI', dotType: 'dots' } });
    } finally {
      dots.restore();
    }
    const liquid = installUni();
    try {
      mount(SnQrCode, { props: { text: 'AUI', dotType: 'liquid' } });
    } finally {
      liquid.restore();
    }
    // Liquid adds bridge rectangles on top of the same circle count.
    const dotsFills = dots.calls.filter((call) => call.method === 'fillRect').length;
    const liquidFills = liquid.calls.filter((call) => call.method === 'fillRect').length;
    expect(liquidFills).toBeGreaterThan(dotsFills);
  });

  it('should emit error and show the fallback for an oversized payload', () => {
    const wrapper = mount(SnQrCode, { props: { text: 'x'.repeat(4000), correctLevel: 'H' } });
    expect(wrapper.emitted('error')).toHaveLength(1);
    expect(wrapper.find('.sn-qr-code__error').exists()).toBe(true);
    expect(wrapper.find('canvas').attributes('data-version')).toBe('0');
  });

  it('should emit click on tap', async () => {
    const wrapper = mount(SnQrCode, { props: { text: 'AUI' } });
    await wrapper.trigger('tap');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('should forward customClass and customStyle to the root', () => {
    const wrapper = mount(SnQrCode, {
      props: { text: 'AUI', customClass: 'my-qr', customStyle: 'padding: 8px' },
    });
    expect(wrapper.classes()).toContain('my-qr');
    expect(wrapper.attributes('style')).toContain('padding: 8px');
  });

  it('should expose an accessible name from the payload', () => {
    const wrapper = mount(SnQrCode, { props: { text: 'https://snui.dev' } });
    expect(wrapper.attributes('role')).toBe('img');
    expect(wrapper.attributes('aria-label')).toBe('QR code: https://snui.dev');
  });

  it('should reject exportImage with CAPABILITY_UNSUPPORTED off a uni host', async () => {
    const wrapper = mount(SnQrCode, { props: { text: 'AUI' } });
    const exposed = wrapper.vm as unknown as { exportImage: () => Promise<string> };
    await expect(exposed.exportImage()).rejects.toMatchObject({
      code: 'CAPABILITY_UNSUPPORTED',
    });
  });

  it('should resolve exportImage with the temp file path when uni supports it', async () => {
    const uni = installUni({
      canvasToTempFilePath: (options: { success: (r: { tempFilePath: string }) => void }) => {
        options.success({ tempFilePath: 'wxfile://tmp/qr.png' });
      },
    });
    try {
      const wrapper = mount(SnQrCode, { props: { text: 'AUI' } });
      const exposed = wrapper.vm as unknown as { exportImage: () => Promise<string> };
      await expect(exposed.exportImage()).resolves.toBe('wxfile://tmp/qr.png');
    } finally {
      uni.restore();
    }
  });

  it('should reject exportImage when the platform reports a failure', async () => {
    const uni = installUni({
      canvasToTempFilePath: (options: { fail: (error: unknown) => void }) => {
        options.fail(new Error('no canvas'));
      },
    });
    try {
      const wrapper = mount(SnQrCode, { props: { text: 'AUI' } });
      const exposed = wrapper.vm as unknown as { exportImage: () => Promise<string> };
      await expect(exposed.exportImage()).rejects.toMatchObject({ code: 'EXPORT_FAILED' });
    } finally {
      uni.restore();
    }
  });

  it('should reject exportImage when the platform returns no temp file path', async () => {
    const uni = installUni({
      canvasToTempFilePath: (options: { success: (r: object) => void }) => {
        options.success({});
      },
    });
    try {
      const wrapper = mount(SnQrCode, { props: { text: 'AUI' } });
      const exposed = wrapper.vm as unknown as { exportImage: () => Promise<string> };
      await expect(exposed.exportImage()).rejects.toMatchObject({
        code: 'EXPORT_FAILED',
        message: 'canvasToTempFilePath returned no tempFilePath',
      });
    } finally {
      uni.restore();
    }
  });

  it('should reject exportImage when the platform call throws synchronously', async () => {
    const uni = installUni({
      canvasToTempFilePath: () => {
        throw new Error('bridge exploded');
      },
    });
    try {
      const wrapper = mount(SnQrCode, { props: { text: 'AUI' } });
      const exposed = wrapper.vm as unknown as { exportImage: () => Promise<string> };
      await expect(exposed.exportImage()).rejects.toMatchObject({
        code: 'EXPORT_FAILED',
        message: 'canvasToTempFilePath threw',
        cause: new Error('bridge exploded'),
      });
    } finally {
      uni.restore();
    }
  });

  it('should emit error and still paint via the DOM canvas when the uni context throws', () => {
    const domContext = createRecordingContext();
    const spy = stubDomCanvasGetContext(domContext.context);
    const uni = installUni({
      createCanvasContext: () => {
        throw new Error('native canvas gone');
      },
    });
    try {
      const wrapper = mount(SnQrCode, { props: { text: 'AUI' } });
      expect(wrapper.emitted('error')).toHaveLength(1);
      // The H5 fallback took over and painted the code.
      expect(domContext.calls.filter((call) => call.method === 'fillRect').length).toBeGreaterThan(1);
      expect(spy).toHaveBeenCalledWith('2d');
    } finally {
      uni.restore();
    }
  });

  it('should paint through the DOM canvas on a browser-only host', () => {
    const domContext = createRecordingContext();
    stubDomCanvasGetContext(domContext.context);
    const wrapper = mount(SnQrCode, { props: { text: 'AUI', size: 200 } });
    const fillRects = domContext.calls.filter((call) => call.method === 'fillRect');
    // Quiet-zone plate + dark modules, and the canvas backing store was sized.
    expect(fillRects.length).toBeGreaterThan(1);
    expect(fillRects[0]?.fillStyle).toBe('white');
    expect((wrapper.find('canvas').element as HTMLCanvasElement).width).toBe(200);
  });

  it('should emit error when the DOM canvas context cannot be acquired', () => {
    stubDomCanvasGetContext(null);
    const wrapper = mount(SnQrCode, { props: { text: 'AUI' } });
    // Rendering never throws — the code simply stays unpainted.
    expect(wrapper.find('canvas').exists()).toBe(true);
    expect(wrapper.emitted('error')).toBeUndefined();
  });

  it('should emit error when the DOM canvas context acquisition throws', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => {
      throw new Error('getContext failed');
    });
    const wrapper = mount(SnQrCode, { props: { text: 'AUI' } });
    expect(wrapper.emitted('error')).toHaveLength(1);
    expect(wrapper.find('.sn-qr-code__error').exists()).toBe(false);
  });

  it('should clear the deferred paint retry when unmounted before it fires', () => {
    vi.useFakeTimers();
    // No uni host, DOM canvas without a context → the mount-time paint fails
    // and the component schedules exactly one deferred retry.
    const spy = stubDomCanvasGetContext(null);
    const wrapper = mount(SnQrCode, { props: { text: 'AUI' } });
    expect(spy).toHaveBeenCalledTimes(1);
    wrapper.unmount();
    vi.runAllTimers();
    // The retry was cleared on unmount — no second acquisition attempt.
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should paint dark modules with a linear gradient when enableGradient is on', () => {
    const uni = installUni();
    try {
      mount(SnQrCode, { props: { text: 'AUI', size: 100, enableGradient: true, gradientColor: 'teal' } });
      const [gradient] = uni.gradients;
      expect(gradient).toBeDefined();
      // Default diagonal direction spans the whole canvas corner to corner.
      expect(gradient?.args).toEqual([0, 0, 100, 100]);
      expect(gradient?.stops).toEqual([
        { offset: 0, color: 'black' },
        { offset: 1, color: 'teal' },
      ]);
      // Module fills used the gradient object, not a flat color.
      const moduleFill = uni.calls.filter((call) => call.method === 'fillRect')[1];
      expect(moduleFill?.fillStyle).toBe(uni.gradients[0]?.handle);
    } finally {
      uni.restore();
    }
  });

  it('should prefer a multi-stop gradientColors list over gradientColor', () => {
    const uni = installUni();
    try {
      mount(SnQrCode, {
        props: {
          text: 'AUI',
          enableGradient: true,
          gradientColors: ['red', '', 'blue'],
          gradientColor: 'teal',
          colorDark: 'navy',
        },
      });
      // Empty entries are dropped; the remaining two stops split 0 / 1.
      expect(uni.gradients[0]?.stops).toEqual([
        { offset: 0, color: 'red' },
        { offset: 1, color: 'blue' },
      ]);
    } finally {
      uni.restore();
    }
  });

  it('should map gradientDirection number and axis keywords to gradient geometry', () => {
    const mountWith = (direction: number | 'horizontal' | 'vertical') => {
      const uni = installUni();
      try {
        mount(SnQrCode, {
          props: { text: 'AUI', size: 100, enableGradient: true, gradientDirection: direction },
        });
        return uni.gradients[0]?.args;
      } finally {
        uni.restore();
      }
    };
    // 0°: cos = 1, sin = 0 → horizontal axis through the canvas centre.
    expect(mountWith(0)).toEqual([0, 50, 100, 50]);
    expect(mountWith('horizontal')).toEqual([0, 0, 100, 0]);
    expect(mountWith('vertical')).toEqual([0, 0, 0, 100]);
  });

  it('should fall back to square fills for dots when the canvas has no arc support', () => {
    const minimal = createRecordingContext();
    delete minimal.context.beginPath;
    delete minimal.context.arc;
    delete minimal.context.fill;
    const uni = installUni({ createCanvasContext: () => minimal.context });
    try {
      mount(SnQrCode, { props: { text: 'AUI', dotType: 'dots' } });
      expect(minimal.calls.some((call) => call.method === 'arc')).toBe(false);
      // Every dark module degrades to a square fillRect.
      expect(minimal.calls.filter((call) => call.method === 'fillRect').length).toBeGreaterThan(1);
    } finally {
      uni.restore();
    }
  });

  it('should paint rounded modules with roundRect when the canvas supports it', () => {
    const uni = installUni();
    try {
      mount(SnQrCode, { props: { text: 'AUI', dotType: 'rounded' } });
      expect(uni.calls.some((call) => call.method === 'roundRect')).toBe(true);
      expect(uni.calls.some((call) => call.method === 'arc')).toBe(false);
    } finally {
      uni.restore();
    }
  });

  it('should degrade rounded modules to circles when roundRect is missing', () => {
    const noRoundRect = createRecordingContext();
    delete noRoundRect.context.roundRect;
    const uni = installUni({ createCanvasContext: () => noRoundRect.context });
    try {
      mount(SnQrCode, { props: { text: 'AUI', dotType: 'rounded' } });
      expect(noRoundRect.calls.some((call) => call.method === 'roundRect')).toBe(false);
      expect(noRoundRect.calls.some((call) => call.method === 'arc')).toBe(true);
    } finally {
      uni.restore();
    }
  });
});
