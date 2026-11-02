import { describe, expect, it } from 'vitest';
import {
  DEFAULT_PRESET_ID,
  PRIMARY_PRESETS,
  findPreset,
  hexToRgb,
  resolvePrimaryVars,
} from './presets';

describe('findPreset', () => {
  it('should resolve a preset by id', () => {
    expect(findPreset('violet').primary).toBe('#7c3aed');
  });

  it('should fall back to the default preset for unknown ids', () => {
    expect(findPreset('nope').id).toBe(DEFAULT_PRESET_ID);
  });
});

describe('hexToRgb', () => {
  it('should parse 6-digit hex', () => {
    expect(hexToRgb('#1677ff')).toEqual({ r: 22, g: 119, b: 255 });
  });

  it('should return zeros for malformed input', () => {
    expect(hexToRgb('blue')).toEqual({ r: 0, g: 0, b: 0 });
  });
});

describe('resolvePrimaryVars', () => {
  const preset = PRIMARY_PRESETS[0]!;

  it('should use the light hover and a 12% tint in light mode', () => {
    const vars = resolvePrimaryVars(preset, 'light');
    expect(vars.primary).toBe('#1677ff');
    expect(vars.hover).toBe(preset.lightHover);
    expect(vars.soft).toBe('rgba(22, 119, 255, 0.12)');
  });

  it('should use the dark hover and a 22% tint in dark mode', () => {
    const vars = resolvePrimaryVars(preset, 'dark');
    expect(vars.hover).toBe(preset.darkHover);
    expect(vars.soft).toBe('rgba(22, 119, 255, 0.22)');
  });
});

describe('PRIMARY_PRESETS', () => {
  it('should keep ids unique', () => {
    const ids = PRIMARY_PRESETS.map((preset) => preset.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should keep the blue preset aligned with the token default', () => {
    const blue = findPreset(DEFAULT_PRESET_ID);
    expect(blue.primary).toBe('#1677ff');
    expect(blue.darkHover).toBe('#3b82f6');
  });
});
