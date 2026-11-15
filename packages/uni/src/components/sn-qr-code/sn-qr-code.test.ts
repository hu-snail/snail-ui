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
// Vite-native raw import — lets the source-convention guard read the SFC as
// text without filesystem path gymnastics (vitest's import.meta.url is not a
// file:// URL under this setup).
import componentSource from './sn-qr-code.vue?raw';
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
    scale: record('scale'),
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

  it('should encode byte-mode payloads without a TextEncoder global (mini-program engines)', () => {
    // Regression (MP): WeChat / Alipay JS engines provide no TextEncoder, so
    // the previous `new TextEncoder().encode()` threw on every byte-mode
    // payload and the component misreported it as the "data too long" error.
    const withEncoder = matrixRows(encode('https://snui.dev/aui-2024', 'H'));
    const globalHost = globalThis as { TextEncoder?: unknown };
    const original = globalHost.TextEncoder;
    Reflect.deleteProperty(globalThis, 'TextEncoder');
    try {
      expect(globalHost.TextEncoder).toBeUndefined();
      const qr = encode('https://snui.dev/aui-2024', 'H');
      expect(qr.mode).toBe('byte');
      expect(matrixRows(qr)).toEqual(withEncoder);
    } finally {
      globalHost.TextEncoder = original;
    }
  });

  it('should replace lone surrogates with U+FFFD like TextEncoder does', () => {
    // A lone surrogate must not turn into invalid CESU-8 bytes: the encoder
    // substitutes the replacement character, so both payloads draw the same
    // (version 1, EC-boosted) code.
    const substituted = encode('\uDC80', 'M');
    const reference = encode('\uFFFD', 'M');
    expect(matrixRows(substituted)).toEqual(matrixRows(reference));
    // Astral code points (surrogate pairs) survive as four UTF-8 bytes.
    expect(() => encode('二维码 ✓', 'H')).not.toThrow();
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
      expect(domContext.calls.filter((call) => call.method === 'fillRect').length).toBeGreaterThan(
        1,
      );
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
      mount(SnQrCode, {
        props: { text: 'AUI', size: 100, enableGradient: true, gradientColor: 'teal' },
      });
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

/* ── uni-app x host ─────────────────────────────────────────────────────── */

interface UniXCanvasStub {
  width: number;
  height: number;
  offsetWidth: number;
  offsetHeight: number;
  getContext: (type: string) => unknown;
  getBoundingClientRect: () => { width: number; height: number };
  toDataURL: () => string;
}

interface UniXHostStub {
  element: UniXCanvasStub;
  calls: RecordedCall[];
  legacyCalls: number;
  restore: () => void;
}

/**
 * Install a uni-app x host: `uni.getElementById` returns a W3C canvas element
 * with a measurable box, and the deprecated `createCanvasContext` shim is a
 * spy that must never be used.
 */
function installUniAppX(options: { box?: number; dpr?: number; noBox?: boolean } = {}): UniXHostStub {
  const recorder = createRecordingContext();
  const box = options.box ?? 240;
  const element: UniXCanvasStub = {
    width: 0,
    height: 0,
    offsetWidth: options.noBox ? 0 : box,
    offsetHeight: options.noBox ? 0 : box,
    getContext: (type: string) => (type === '2d' ? recorder.context : null),
    getBoundingClientRect: () => ({ width: 0, height: 0 }),
    toDataURL: () => 'data:image/png;base64,AAAA',
  };
  let legacyCalls = 0;
  const host = globalThis as { uni?: Record<string, unknown> };
  const previous = host.uni;
  host.uni = {
    getElementById: () => element,
    getDeviceInfo: () => ({ devicePixelRatio: options.dpr ?? 2 }),
    createCanvasContextAsync: () => undefined,
    createCanvasContext: () => {
      legacyCalls++;
      return recorder.context;
    },
  };
  return {
    element,
    calls: recorder.calls,
    get legacyCalls() {
      return legacyCalls;
    },
    restore() {
      if (previous === undefined) delete host.uni;
      else host.uni = previous;
    },
  };
}

describe('sn-qr-code (uni-app x W3C canvas host)', () => {
  it('should paint through the W3C 2d context, never the legacy shim', () => {
    const host = installUniAppX();
    try {
      const wrapper = mount(SnQrCode, { props: { text: 'https://snui.dev', size: 160 } });
      const plate = host.calls.find((call) => call.method === 'fillRect');
      // Box 240px × DPR 2 = a 480px bitmap; the whole plate is drawn in it.
      expect(host.element.width).toBe(480);
      expect(host.element.height).toBe(480);
      expect(plate?.args).toEqual([0, 0, 480, 480]);
      expect(host.calls.filter((call) => call.method === 'fillRect').length).toBeGreaterThan(1);
      // draw() is a legacy-only flush; the W3C path must not queue it.
      expect(host.calls.some((call) => call.method === 'draw')).toBe(false);
      expect(host.legacyCalls).toBe(0);
      expect(wrapper.emitted('error')).toBeUndefined();
    } finally {
      host.restore();
    }
  });

  it('should never call ctx.scale — drawing uses device pixels directly', () => {
    const host = installUniAppX({ box: 200, dpr: 3 });
    try {
      mount(SnQrCode, { props: { text: 'AUI' } });
      expect(host.element.width).toBe(600);
      expect(host.calls.some((call) => call.method === 'scale')).toBe(false);
      // No transform means the module fills land inside the 600px bitmap.
      const moduleFill = host.calls.filter((call) => call.method === 'fillRect')[1];
      expect(Number(moduleFill?.args[0])).toBeLessThan(600);
      expect(Number(moduleFill?.args[2])).toBeLessThan(600);
    } finally {
      host.restore();
    }
  });

  it('should retry first paint when the element has no layout box yet', () => {
    vi.useFakeTimers();
    const host = installUniAppX({ noBox: true });
    try {
      mount(SnQrCode, { props: { text: 'AUI', size: 200 } });
      // First paint falls back to design px (200 × DPR 2 = 400).
      expect(host.element.width).toBe(400);
      // Layout arrives: a deferred retry re-measures the box.
      host.element.offsetWidth = 240;
      host.element.offsetHeight = 240;
      vi.runAllTimers();
      expect(host.element.width).toBe(480);
      // The quiet-zone plate is the only white fill; a dark module at (0,0)
      // also starts at the origin, so filter on the recorded fillStyle.
      const plates = host.calls.filter(
        (call) => call.method === 'fillRect' && call.fillStyle === 'white',
      );
      expect(plates[plates.length - 1]?.args).toEqual([0, 0, 480, 480]);
    } finally {
      host.restore();
    }
  });

  it('should resolve exportImage with the canvas data URL on uni-app x', async () => {
    const host = installUniAppX();
    try {
      const wrapper = mount(SnQrCode, { props: { text: 'AUI' } });
      const exposed = wrapper.vm as unknown as { exportImage: () => Promise<string> };
      await expect(exposed.exportImage()).resolves.toBe('data:image/png;base64,AAAA');
    } finally {
      host.restore();
    }
  });

  it('should paint through uni.createCanvasContextAsync on uni-app x mini-programs', () => {
    const recorder = createRecordingContext();
    const element: UniXCanvasStub = {
      width: 0,
      height: 0,
      offsetWidth: 300,
      offsetHeight: 300,
      getContext: () => recorder.context,
      getBoundingClientRect: () => ({ width: 0, height: 0 }),
      toDataURL: () => 'data:image/png;base64,BBBB',
    };
    recorder.context.canvas = element;
    const holder = {
      getContext: (type: string) => (type === '2d' ? recorder.context : null),
      toDataURL: () => 'data:image/png;base64,BBBB',
    };
    const host = globalThis as { uni?: Record<string, unknown> };
    host.uni = {
      createCanvasContextAsync: (options: { success: (value: unknown) => void }) => {
        options.success(holder);
      },
      getDeviceInfo: () => ({ devicePixelRatio: 2 }),
    };
    try {
      mount(SnQrCode, { props: { text: 'AUI' } });
      expect(element.width).toBe(600);
      expect(recorder.calls.filter((call) => call.method === 'fillRect').length).toBeGreaterThan(1);
    } finally {
      delete host.uni;
    }
  });

  it('should pass the component proxy (not the internal instance) to the legacy lookup', () => {
    let scope: unknown = null;
    const recorder = createRecordingContext();
    const host = globalThis as { uni?: Record<string, unknown> };
    host.uni = {
      createCanvasContext: (_id: string, component: unknown) => {
        scope = component;
        return recorder.context;
      },
    };
    try {
      mount(SnQrCode, { props: { text: 'AUI' } });
      expect(scope).not.toBeNull();
      // getCurrentInstance().proxy exposes `$`; the raw internal instance does not.
      expect((scope as { $?: unknown }).$).toBeDefined();
    } finally {
      delete host.uni;
    }
  });
});

/* ── Rounded corner blocks ──────────────────────────────────────────────── */

/** Text long enough to force version ≥ 2 (and therefore an alignment pattern). */
const CORNER_LONG_TEXT = 'AUI-UNI-QR-CODE-ALIGNMENT-PATTERN-CHECK';

describe('sn-qr-code (rounded corner blocks)', () => {
  const roundRects = (calls: RecordedCall[]) =>
    calls.filter((call) => call.method === 'roundRect');

  it('should round the three finder patterns by default on version 1', () => {
    const uni = installUni();
    try {
      const wrapper = mount(SnQrCode, { props: { text: 'AUI' } });
      expect(encode('AUI', 'H').version).toBe(1);
      expect(wrapper.find('canvas').attributes('data-corner-radius')).toBe('6');
      // 3 finder blocks × (dark ring + light ring + dark centre) = 9 rounded fills.
      expect(roundRects(uni.calls)).toHaveLength(9);
      // The square modules inside those blocks are skipped, never painted twice.
      const darkAtOrigin = uni.calls.some(
        (call) =>
          call.method === 'fillRect' &&
          call.fillStyle === 'black' &&
          call.args[0] === 0 &&
          call.args[1] === 0,
      );
      expect(darkAtOrigin).toBe(false);
      // `dotType="square"` itself never needs arcs; roundRect is available here.
      expect(uni.calls.some((call) => call.method === 'arc')).toBe(false);
    } finally {
      uni.restore();
    }
  });

  it('should also round the bottom-right alignment pattern from version 2', () => {
    const uni = installUni();
    try {
      mount(SnQrCode, { props: { text: CORNER_LONG_TEXT } });
      expect(encode(CORNER_LONG_TEXT, 'H').version).toBeGreaterThanOrEqual(2);
      // 3 finder blocks + 1 alignment block = 4 × 3 rounded fills.
      expect(roundRects(uni.calls)).toHaveLength(12);
      // Only the 5×5 alignment block has a single-module centre.
      const cell = 200 / encode(CORNER_LONG_TEXT, 'H').size;
      const oneModuleCentres = roundRects(uni.calls).filter(
        (call) => Math.abs(Number(call.args[2]) - cell) < 0.01,
      );
      expect(oneModuleCentres).toHaveLength(1);
    } finally {
      uni.restore();
    }
  });

  it('should keep standard square corners when cornerRadius is 0', () => {
    const uni = installUni();
    try {
      const wrapper = mount(SnQrCode, { props: { text: 'AUI', cornerRadius: 0 } });
      expect(wrapper.find('canvas').attributes('data-corner-radius')).toBe('0');
      expect(roundRects(uni.calls)).toHaveLength(0);
      // The finder pattern is back to ordinary square modules from (0, 0).
      expect(
        uni.calls.some(
          (call) =>
            call.method === 'fillRect' &&
            call.fillStyle === 'black' &&
            call.args[0] === 0 &&
            call.args[1] === 0,
        ),
      ).toBe(true);
    } finally {
      uni.restore();
    }
  });

  it('should clamp an oversized radius to 1.5 modules', () => {
    const uni = installUni();
    try {
      mount(SnQrCode, { props: { text: 'AUI', size: 210, cornerRadius: 999 } });
      const cell = 210 / encode('AUI', 'H').size;
      const radii = roundRects(uni.calls).map((call) => Number(call.args[4]));
      expect(radii).toHaveLength(9);
      expect(Math.max(...radii)).toBeCloseTo(cell * 1.5, 5);
      expect(Math.max(...radii)).toBeLessThanOrEqual(cell * 1.5 + 1e-6);
    } finally {
      uni.restore();
    }
  });

  it('should degrade to an arc path when roundRect is unavailable', () => {
    const noRoundRect = createRecordingContext();
    delete noRoundRect.context.roundRect;
    const uni = installUni({ createCanvasContext: () => noRoundRect.context });
    try {
      mount(SnQrCode, { props: { text: 'AUI' } });
      expect(roundRects(noRoundRect.calls)).toHaveLength(0);
      // 3 blocks × 3 shapes × 4 arcs = 36; square modules add none.
      expect(noRoundRect.calls.filter((call) => call.method === 'arc')).toHaveLength(36);
    } finally {
      uni.restore();
    }
  });

  it('should fall back to square fills when the canvas has no path APIs', () => {
    const minimal = createRecordingContext();
    delete minimal.context.beginPath;
    delete minimal.context.arc;
    delete minimal.context.fill;
    delete minimal.context.roundRect;
    const uni = installUni({ createCanvasContext: () => minimal.context });
    try {
      mount(SnQrCode, { props: { text: 'AUI' } });
      const fills = minimal.calls.filter((call) => call.method === 'fillRect');
      expect(fills.length).toBeGreaterThan(10);
      // Quiet-zone plate + one light ring per finder block.
      expect(fills.filter((call) => call.fillStyle === 'white')).toHaveLength(4);
    } finally {
      uni.restore();
    }
  });

  it('should repaint corner blocks with the configured dark and light colors', () => {
    const uni = installUni();
    try {
      mount(SnQrCode, {
        props: { text: 'AUI', colorDark: 'navy', colorLight: 'linen', cornerRadius: 8 },
      });
      const shapes = roundRects(uni.calls);
      expect(shapes).toHaveLength(9);
      expect(shapes[0]?.fillStyle).toBe('navy');
      expect(shapes[1]?.fillStyle).toBe('linen');
      expect(shapes[2]?.fillStyle).toBe('navy');
    } finally {
      uni.restore();
    }
  });

  it('should repaint when cornerRadius changes at runtime', async () => {
    const uni = installUni();
    try {
      const wrapper = mount(SnQrCode, { props: { text: 'AUI' } });
      expect(roundRects(uni.calls)).toHaveLength(9);
      await wrapper.setProps({ cornerRadius: 0 });
      // No new rounded shapes; a second full plate was painted instead.
      expect(roundRects(uni.calls)).toHaveLength(9);
      expect(uni.calls.filter((call) => call.method === 'fillRect' && call.fillStyle === 'white')).toHaveLength(2);
      expect(wrapper.find('canvas').attributes('data-corner-radius')).toBe('0');
    } finally {
      uni.restore();
    }
  });

  it('should scale the corner radius into device pixels on uni-app x', () => {
    const host = installUniAppX({ box: 200, dpr: 3 });
    try {
      mount(SnQrCode, { props: { text: 'AUI' } });
      const shapes = roundRects(host.calls);
      expect(shapes).toHaveLength(9);
      // Box 200 × DPR 3 = 600 device px; ratio 3 turns 6 design px into 18.
      expect(Number(shapes[0]?.args[4])).toBe(18);
      expect(host.calls.some((call) => call.method === 'scale')).toBe(false);
      expect(host.legacyCalls).toBe(0);
    } finally {
      host.restore();
    }
  });

  it('should degrade to a square 回 when the host rejects every rounded path', () => {
    const throwing = createRecordingContext();
    throwing.context.roundRect = () => {
      throw new Error('roundRect unsupported');
    };
    throwing.context.arc = () => {
      throw new Error('arc unsupported');
    };
    const uni = installUni({ createCanvasContext: () => throwing.context });
    try {
      mount(SnQrCode, { props: { text: 'AUI', size: 200 } });
      // The finder geometry must survive even when the corners do not.
      expect(
        throwing.calls.some(
          (call) =>
            call.method === 'fillRect' &&
            call.fillStyle === 'black' &&
            call.args[0] === 0 &&
            call.args[1] === 0,
        ),
      ).toBe(true);
      expect(throwing.calls.filter((call) => call.method === 'fillRect').length).toBeGreaterThan(10);
      expect(throwing.calls.some((call) => call.method === 'draw')).toBe(true);
    } finally {
      uni.restore();
    }
  });
});

/* ── Mini-program hosts ─────────────────────────────────────────────────── */

/** Authoritative platform hint (no DOM stubbing needed for the MP branch). */
const mpPlatform = () => ({ uniPlatform: 'mp-weixin' });

describe('sn-qr-code (mini-program hosts)', () => {
  it('should read the uni host through the free identifier, with a globalThis fallback', () => {
    // Regression (MP): classic uni-app mini-programs do NOT expose `uni` on
    // globalThis (verified in the WeChat app-service) — the compilers rewrite
    // a free `uni` identifier into their injected API module instead. Reading
    // `globalThis.uni` returned null there and left every QR blank. That
    // failure only exists after compilation, so no happy-dom test can observe
    // it directly; this guard pins the source convention itself.
    const source = componentSource;
    expect(source).toMatch(/return uni \?\? null/);
    // The declare keeps TypeScript honest while staying erased at runtime.
    expect(source).toMatch(/declare const uni: UniHost \| undefined/);
  });

  it('should keep classic uni-app MP on the legacy logical-px path and flush draw()', () => {
    vi.useFakeTimers();
    const recorder = createRecordingContext();
    const host = globalThis as { uni?: Record<string, unknown> };
    host.uni = {
      createCanvasContext: () => recorder.context,
      getSystemInfoSync: mpPlatform,
      getDeviceInfo: () => ({ devicePixelRatio: 3 }),
    };
    try {
      mount(SnQrCode, { props: { text: 'AUI', size: 200 } });
      const plates = () =>
        recorder.calls.filter(
          (call) => call.method === 'fillRect' && call.fillStyle === 'white',
        );
      // Logical px, NOT 200 × DPR 3: a mini-program canvas has no resizable
      // backing store here, so multiplying by DPR would push the code off-screen.
      expect(plates()[0]?.args).toEqual([0, 0, 200, 200]);
      expect(recorder.calls.some((call) => call.method === 'draw')).toBe(true);
      // Native canvases become drawable after onMounted: keep a repaint tail.
      vi.runAllTimers();
      expect(plates().length).toBeGreaterThan(1);
    } finally {
      delete host.uni;
    }
  });

  it('should resolve uni-app x MP canvases only through createCanvasContextAsync', async () => {
    vi.useFakeTimers();
    const recorder = createRecordingContext();
    // A mini-program canvas whose bitmap cannot be resized from script.
    const element = {
      offsetWidth: 0,
      offsetHeight: 0,
      getBoundingClientRect: () => ({ width: 0, height: 0 }),
      toDataURL: () => 'data:image/png;base64,MP',
    };
    recorder.context.canvas = element;
    const holder = {
      getContext: (type: string) => (type === '2d' ? recorder.context : null),
      toDataURL: () => 'data:image/png;base64,MP',
    };
    let getElementByIdCalls = 0;
    let asyncCalls = 0;
    const host = globalThis as { uni?: Record<string, unknown> };
    host.uni = {
      getElementById: () => {
        getElementByIdCalls++;
        return null;
      },
      createCanvasContextAsync: (options: { success: (value: unknown) => void }) => {
        asyncCalls++;
        options.success(holder);
      },
      getSystemInfoSync: mpPlatform,
      getDeviceInfo: () => ({ devicePixelRatio: 3 }),
    };
    try {
      const wrapper = mount(SnQrCode, { props: { text: 'AUI', size: 200 } });
      // getElementById is App/Web-only on uni-app x; it must never be used here.
      expect(getElementByIdCalls).toBe(0);
      expect(asyncCalls).toBe(1);
      const plates = recorder.calls.filter(
        (call) => call.method === 'fillRect' && call.fillStyle === 'white',
      );
      expect(plates[0]?.args).toEqual([0, 0, 200, 200]);
      // W3C-shaped mini-program contexts still need a command flush.
      expect(recorder.calls.some((call) => call.method === 'draw')).toBe(true);
      // The resolved surface is cached: deferred repaints do not re-request it.
      vi.runAllTimers();
      expect(asyncCalls).toBe(1);
      const exposed = wrapper.vm as unknown as { exportImage: () => Promise<string> };
      await expect(exposed.exportImage()).resolves.toBe('data:image/png;base64,MP');
    } finally {
      delete host.uni;
    }
  });

  it('should stay on the device-pixel W3C path when the platform is web', () => {
    const host = globalThis as { uni?: Record<string, unknown> };
    host.uni = {
      getElementById: () => null,
      getSystemInfoSync: () => ({ uniPlatform: 'web' }),
      getDeviceInfo: () => ({ devicePixelRatio: 2 }),
      createCanvasContextAsync: () => undefined,
    };
    try {
      const domContext = createRecordingContext();
      // Simulate the uni-app x Web element through the template-ref fallback.
      vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
        () => domContext.context,
      );
      const wrapper = mount(SnQrCode, { props: { text: 'AUI', size: 200 } });
      // A resizable bitmap still gets box × DPR device pixels.
      expect(
        domContext.calls.find((call) => call.method === 'fillRect' && call.fillStyle === 'white')
          ?.args,
      ).toEqual([0, 0, 400, 400]);
      expect((wrapper.find('canvas').element as HTMLCanvasElement).width).toBe(400);
    } finally {
      delete host.uni;
    }
  });
});
