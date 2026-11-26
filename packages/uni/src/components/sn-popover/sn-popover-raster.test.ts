/**
 * sn-popover-raster unit tests.
 *
 * Behaviour: the offscreen / holder paths paint the chrome path and export a
 * PNG data URL; the uni-app x App path builds an SVG document data URL with
 * baked colors; every broken host degrades to `null` (the CSS paint keeps).
 */

import { describe, it, expect, vi } from 'vitest';
import {
  rasterizeChromePng,
  rasterizeChromePngOnHolder,
  buildChromeRasterUrl,
} from './sn-popover-raster';
import { buildBubbleChrome } from './sn-popover-chrome';
import type { RasterCanvas2d } from '../sn-icon/sn-icon-mp-raster';

const paint = { fill: '#ffffff', stroke: 'transparent', strokeWidth: 1 };

function makeGeometry() {
  return buildBubbleChrome({
    width: 240,
    height: 96,
    placement: 'bottom',
    arrow: { protrusion: 11, base: 22 },
    arrowInset: 20,
    radius: 8,
    strokeWidth: 1,
  })!;
}

/** Minimal recording 2d context. */
function makeCtx() {
  const calls: string[] = [];
  const ctx: RasterCanvas2d = {
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    lineCap: 'butt',
    lineJoin: 'miter',
    scale(x: number, y: number) {
      calls.push(`scale ${x} ${y}`);
    },
    beginPath() {
      calls.push('beginPath');
    },
    moveTo(x: number, y: number) {
      calls.push(`moveTo ${x} ${y}`);
    },
    lineTo(x: number, y: number) {
      calls.push(`lineTo ${x} ${y}`);
    },
    bezierCurveTo() {
      calls.push('bezier');
    },
    quadraticCurveTo() {
      calls.push('quadratic');
    },
    arc() {
      calls.push('arc');
    },
    closePath() {
      calls.push('closePath');
    },
    fill() {
      calls.push('fill');
    },
    stroke() {
      calls.push('stroke');
    },
    toDataURL() {
      return 'data:image/png;base64,AAAA';
    },
  };
  return { ctx, calls };
}

describe('sn-popover-raster', () => {
  describe('rasterizeChromePng (offscreen path)', () => {
    it('paints and exports a PNG when the host provides an offscreen canvas', () => {
      const { ctx, calls } = makeCtx();
      const host = {
        createOffscreenCanvas: (o: { type: string; width: number; height: number }) => {
          expect(o.type).toBe('2d');
          expect(o.width).toBe(482); // (240 + 1) box × 2 — the 2× crispness rule
          return { getContext: () => ctx, toDataURL: () => 'data:image/png;base64,AAAA' };
        },
      };
      vi.stubGlobal('uni', host);
      try {
        const url = rasterizeChromePng(makeGeometry(), paint, 482);
        expect(url).toBe('data:image/png;base64,AAAA');
        // The chrome path was painted and filled.
        expect(calls).toContain('beginPath');
        expect(calls).toContain('fill');
        expect(calls.some((c) => c.startsWith('moveTo'))).toBe(true);
        // The context was scaled to the chrome-box coordinate system.
        expect(calls.some((c) => c.startsWith('scale '))).toBe(true);
      } finally {
        vi.unstubAllGlobals();
      }
    });

    it('returns null when the host has no offscreen canvas', () => {
      vi.stubGlobal('uni', {});
      try {
        expect(rasterizeChromePng(makeGeometry(), paint, 100)).toBeNull();
      } finally {
        vi.unstubAllGlobals();
      }
    });

    it('returns null when the offscreen context is unavailable', () => {
      const host = {
        createOffscreenCanvas: () => ({ getContext: () => undefined, toDataURL: () => '' }),
      };
      vi.stubGlobal('uni', host);
      try {
        expect(rasterizeChromePng(makeGeometry(), paint, 100)).toBeNull();
      } finally {
        vi.unstubAllGlobals();
      }
    });

    it('returns null when the export is not a PNG', () => {
      const host = {
        createOffscreenCanvas: () => ({
          getContext: () => makeCtx().ctx,
          toDataURL: () => 'data:image/jpeg;base64,AAAA',
        }),
      };
      vi.stubGlobal('uni', host);
      try {
        expect(rasterizeChromePng(makeGeometry(), paint, 100)).toBeNull();
      } finally {
        vi.unstubAllGlobals();
      }
    });

    it('survives a throwing host', () => {
      const host = {
        createOffscreenCanvas: () => {
          throw new Error('no canvas on this host');
        },
      };
      vi.stubGlobal('uni', host);
      try {
        expect(rasterizeChromePng(makeGeometry(), paint, 100)).toBeNull();
      } finally {
        vi.unstubAllGlobals();
      }
    });
  });

  describe('rasterizeChromePngOnHolder (uni-app x MP node path)', () => {
    it('draws on the holder context and exports the holder PNG', () => {
      const { ctx, calls } = makeCtx();
      const holder = {
        getContext: (kind: string) => (kind === '2d' ? ctx : null),
        toDataURL: () => 'data:image/png;base64,BBBB',
      };
      const url = rasterizeChromePngOnHolder(holder, makeGeometry(), paint, 482);
      expect(url).toBe('data:image/png;base64,BBBB');
      expect(calls).toContain('fill');
    });

    it('returns null when the holder lacks a 2d context or a PNG export', () => {
      expect(rasterizeChromePngOnHolder({}, makeGeometry(), paint, 100)).toBeNull();
      expect(
        rasterizeChromePngOnHolder({ getContext: () => makeCtx().ctx }, makeGeometry(), paint, 100),
      ).toBeNull();
      expect(
        rasterizeChromePngOnHolder(
          { getContext: () => makeCtx().ctx, toDataURL: () => 'data:image/gif;base64,x' },
          makeGeometry(),
          paint,
          100,
        ),
      ).toBeNull();
    });

    it('resizes the backing bitmap when the context exposes a canvas element', () => {
      const { ctx } = makeCtx();
      const bitmap = { width: 0, height: 0 };
      const sized = Object.assign(ctx, { canvas: bitmap }) as RasterCanvas2d & {
        canvas: { width: number; height: number };
      };
      const holder = { getContext: () => sized, toDataURL: () => 'data:image/png;base64,C' };
      rasterizeChromePngOnHolder(holder, makeGeometry(), paint, 482);
      expect(bitmap.width).toBe(482);
      expect(bitmap.height).toBe(482);
    });
  });

  describe('buildChromeRasterUrl (uni-app x App channel)', () => {
    it('encodes the SVG document with baked colors', () => {
      const url = buildChromeRasterUrl(makeGeometry(), { fill: '#18181b', stroke: '#27272a', strokeWidth: 1 });
      expect(url.startsWith('data:image/svg+xml;utf8,')).toBe(true);
      const doc = decodeURIComponent(url.slice('data:image/svg+xml;utf8,'.length));
      expect(doc).toContain('fill="#18181b"');
      expect(doc).toContain('stroke="#27272a"');
      expect(doc).toContain('viewBox="0 0 241 108"');
      // No var() ever rides into the document — the baking contract.
      expect(doc).not.toContain('var(');
    });
  });
});
