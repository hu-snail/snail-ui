/**
 * sn-icon-mp-raster unit tests — path interpreter + offscreen rasterizer.
 *
 * The path interpreter is asserted through a recording canvas stub (behavior:
 * which drawing calls a path produces), and the rasterizer through a stubbed
 * uni host. The real device contract (WeChat decodes PNG data URLs, not SVG)
 * is covered by the demo pages, not unit tests.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { drawPathOnCanvas, rasterizeIconDataUrl, tokenizePath } from './sn-icon-mp-raster';
import type { RasterCanvas2d } from './sn-icon-mp-raster';

/** Recording canvas stub — captures draw calls, no real rendering. */
function recordingCanvas(): RasterCanvas2d & { calls: Array<[string, ...unknown[]]> } {
  const calls: Array<[string, ...unknown[]]> = [];
  const record = (name: string) => (...args: unknown[]) => {
    calls.push([name, ...args]);
  };
  return {
    calls,
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
    lineCap: '',
    lineJoin: '',
    scale: record('scale'),
    beginPath: record('beginPath'),
    moveTo: record('moveTo'),
    lineTo: record('lineTo'),
    bezierCurveTo: record('bezierCurveTo'),
    quadraticCurveTo: record('quadraticCurveTo'),
    arc: record('arc'),
    closePath: record('closePath'),
    fill: record('fill'),
    stroke: record('stroke'),
    toDataURL: record('toDataURL') as unknown as RasterCanvas2d['toDataURL'],
  };
}

/** Stub the uni host for the duration of a test. */
function stubHost(host: unknown): void {
  (globalThis as { uni?: unknown }).uni = host;
}

afterEach(() => {
  delete (globalThis as { uni?: unknown }).uni;
});

describe('tokenizePath', () => {
  it('splits commands, numbers, and negative values', () => {
    expect(tokenizePath('M6 8a6 6 0 0 1 12 0c0 7-3 9-3 9z')).toEqual([
      'M', 6, 8, 'a', 6, 6, 0, 0, 1, 12, 0, 'c', 0, 7, -3, 9, -3, 9, 'z',
    ]);
  });

  it('keeps decimal and concatenated-negative forms', () => {
    expect(tokenizePath('M10.3 21a1.94 1.94 0 0 0 3.4 0H3s3-2 3-9')).toEqual([
      'M', 10.3, 21, 'a', 1.94, 1.94, 0, 0, 0, 3.4, 0, 'H', 3, 's', 3, -2, 3, -9,
    ]);
  });
});

describe('drawPathOnCanvas', () => {
  it('maps M/L/Z to move, line and close', () => {
    const ctx = recordingCanvas();
    drawPathOnCanvas(ctx, 'M2 3 L8 5z');
    expect(ctx.calls).toEqual([
      ['moveTo', 2, 3],
      ['lineTo', 8, 5],
      ['closePath'],
    ]);
  });

  it('maps relative c and absolute H onto bezier and line', () => {
    const ctx = recordingCanvas();
    drawPathOnCanvas(ctx, 'M1 1c2 0 3 1 4 2H9');
    expect(ctx.calls).toEqual([
      ['moveTo', 1, 1],
      ['bezierCurveTo', 3, 1, 4, 2, 5, 3],
      ['lineTo', 9, 3],
    ]);
  });

  it('expands the A command into ctx.arc via the center conversion', () => {
    const ctx = recordingCanvas();
    drawPathOnCanvas(ctx, 'M6 8a6 6 0 0 1 12 0');
    const arc = ctx.calls.find(([name]) => name === 'arc') as
      | [string, number, number, number, number, number, boolean]
      | undefined;
    expect(arc).toBeDefined();
    const [, cx, cy, r, a0, a1, ccw] = arc!;
    // Half circle from (6,8) to (18,8): center x must sit at the midpoint,
    // radius must equal 6, and the sweep must run clockwise through the top.
    expect(cx).toBeCloseTo(12, 5);
    expect(cy).toBeCloseTo(8, 5);
    expect(r).toBeCloseTo(6, 5);
    expect(a1 - a0).toBeCloseTo(Math.PI, 5);
    expect(ccw).toBe(false);
  });

  it('survives a malformed path without throwing', () => {
    const ctx = recordingCanvas();
    expect(() => drawPathOnCanvas(ctx, 'M2 3 ? L')).not.toThrow();
  });
});

describe('rasterizeIconDataUrl', () => {
  const icon = {
    paths: ['M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9'],
    viewBox: '0 0 24 24',
  };

  it('returns null when the host has no offscreen canvas', () => {
    stubHost({});
    expect(rasterizeIconDataUrl(icon, '#1677ff', 2, 56)).toBeNull();
  });

  it('returns null when the host factory throws', () => {
    stubHost({
      createOffscreenCanvas: () => {
        throw new Error('unsupported');
      },
    });
    expect(rasterizeIconDataUrl(icon, '#1677ff', 2, 56)).toBeNull();
  });

  it('rasterizes to a png data url and paints every path', () => {
    let created: { w: number; h: number } | null = null;
    const ctx = recordingCanvas();
    stubHost({
      createOffscreenCanvas: (o: { type: string; width: number; height: number }) => {
        created = { w: o.width, h: o.height };
        return {
          getContext: (kind: '2d') => (kind === '2d' ? ctx : undefined),
          toDataURL: (type?: string) => `data:image/png;base64,AAAA-${type ?? ''}`,
        };
      },
    });
    const url = rasterizeIconDataUrl(icon, '#1677ff', 2, 56);
    expect(url).toBe('data:image/png;base64,AAAA-image/png');
    expect(created).toEqual({ w: 56, h: 56 });
    // Scale to the 24-unit viewBox, stroke setup, one path, one export.
    expect(ctx.calls[0]).toEqual(['scale', 56 / 24, 56 / 24]);
    expect(ctx.strokeStyle).toBe('#1677ff');
    expect(ctx.lineWidth).toBe(2);
    expect(ctx.calls.some(([name]) => name === 'stroke')).toBe(true);
  });
});
