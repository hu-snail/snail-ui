import { describe, expect, it } from 'vitest';
import {
  SCALE_STEPS,
  buildRamp,
  hexToRgb,
  hslToRgb,
  isConcreteColor,
  normalizeHex,
  rgbToHex,
  rgbToHsl,
  tint,
} from './palette';

describe('theme-editor/palette', () => {
  describe('hex <-> rgb', () => {
    it('should parse #rrggbb and #rgb', () => {
      expect(hexToRgb('#ff4d24')).toEqual({ r: 255, g: 77, b: 36 });
      expect(hexToRgb('#f42')).toEqual({ r: 255, g: 68, b: 34 });
    });

    it('should reject malformed values', () => {
      expect(hexToRgb('not-a-color')).toBeNull();
      expect(hexToRgb('#12345')).toBeNull();
    });

    it('should round-trip through hsl', () => {
      const rgb = { r: 255, g: 77, b: 36 };
      expect(rgbToHex(hslToRgb(rgbToHsl(rgb)))).toBe('#ff4d24');
    });
  });

  describe('buildRamp', () => {
    it('should emit every scale step', () => {
      const ramp = buildRamp('#ff4d24');
      expect(Object.keys(ramp)).toHaveLength(SCALE_STEPS.length);
      for (const step of SCALE_STEPS) {
        expect(isConcreteColor(ramp[step])).toBe(true);
      }
    });

    it('should be monotonic: 50 is lighter than 950', () => {
      const ramp = buildRamp('#ff4d24');
      const lum = (hex: string): number => {
        const rgb = hexToRgb(hex);
        if (!rgb) throw new Error('bad hex');
        return 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
      };
      for (let i = 1; i < SCALE_STEPS.length; i += 1) {
        const prev = SCALE_STEPS[i - 1] as (typeof SCALE_STEPS)[number];
        const curr = SCALE_STEPS[i] as (typeof SCALE_STEPS)[number];
        expect(lum(ramp[prev])).toBeGreaterThan(lum(ramp[curr]));
      }
    });

    it('should fall back to the zinc ramp for a grey brand colour', () => {
      const ramp = buildRamp('#71717a');
      expect(ramp[500]).toBe('#71717a');
      expect(ramp[50]).toBe('#fafafa');
    });

    it('should fall back to zinc for an invalid colour instead of throwing', () => {
      expect(buildRamp('nope')[500]).toBe('#71717a');
    });
  });

  describe('tint / normalizeHex', () => {
    it('should mix towards white', () => {
      expect(tint('#ff4d24', 1)).toBe('#ffffff');
      expect(tint('#ff4d24', 0)).toBe('#ff4d24');
    });

    it('should normalize shorthand and keep the fallback when invalid', () => {
      expect(normalizeHex('#f42')).toBe('#ff4422');
      expect(normalizeHex('zzzzzz', '#123456')).toBe('#123456');
    });
  });
});
