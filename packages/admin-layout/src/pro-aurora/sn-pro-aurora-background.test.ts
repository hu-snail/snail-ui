import { describe, expect, it } from 'vitest';
import {
  AURORA_BG_IMAGE_VAR,
  AURORA_GLOW_COUNT,
  AURORA_GLOW_VARS,
  auroraBackgroundVars,
  auroraGlowColors,
  cssUrl,
} from './sn-pro-aurora-background';

const DEFAULT_A = 'var(--sn-web-color-action-primary)';
const DEFAULT_B = 'var(--sn-web-color-feedback-info)';

describe('auroraBackgroundVars · solid', () => {
  it('should emit no variables for the solid preset', () => {
    expect(auroraBackgroundVars({ type: 'solid' })).toEqual({});
  });

  it('should ignore colors and image on the solid preset', () => {
    expect(auroraBackgroundVars({ type: 'solid', image: '/a.png', colors: ['#f00'] })).toEqual({});
  });
});

describe('auroraBackgroundVars · image', () => {
  it('should expose the image as a css url variable', () => {
    expect(auroraBackgroundVars({ type: 'image', image: '/bg/aurora.png' })).toEqual({
      [AURORA_BG_IMAGE_VAR]: 'url("/bg/aurora.png")',
    });
  });

  it('should trim the url', () => {
    expect(auroraBackgroundVars({ type: 'image', image: '  /bg.png  ' })).toEqual({
      [AURORA_BG_IMAGE_VAR]: 'url("/bg.png")',
    });
  });

  it('should escape characters that would terminate the url token', () => {
    const vars = auroraBackgroundVars({ type: 'image', image: '/a"b(c).png' });
    expect(vars[AURORA_BG_IMAGE_VAR]).toBe('url("/a%22b%28c%29.png")');
  });

  it('should emit nothing when the image is missing or blank', () => {
    expect(auroraBackgroundVars({ type: 'image' })).toEqual({});
    expect(auroraBackgroundVars({ type: 'image', image: '   ' })).toEqual({});
  });
});

describe('auroraBackgroundVars · gradient (光晕)', () => {
  it('should fall back to the token accent pair', () => {
    expect(auroraBackgroundVars({ type: 'gradient' })).toEqual({
      '--sn-pro-aurora-glow-1': DEFAULT_A,
      '--sn-pro-aurora-glow-2': DEFAULT_B,
    });
  });

  it('should paint exactly two glows', () => {
    const vars = auroraBackgroundVars({ type: 'gradient', colors: ['#111', '#222', '#333'] });
    expect(Object.keys(vars)).toHaveLength(AURORA_GLOW_COUNT.gradient);
    expect(vars['--sn-pro-aurora-glow-1']).toBe('#111');
    expect(vars['--sn-pro-aurora-glow-2']).toBe('#222');
    expect(vars['--sn-pro-aurora-glow-3']).toBeUndefined();
  });
});

describe('auroraBackgroundVars · mesh (弥散)', () => {
  it('should paint four glows, cycling the defaults', () => {
    const vars = auroraBackgroundVars({ type: 'mesh' });
    expect(Object.keys(vars)).toHaveLength(AURORA_GLOW_COUNT.mesh);
    expect(vars['--sn-pro-aurora-glow-1']).toBe(DEFAULT_A);
    expect(vars['--sn-pro-aurora-glow-2']).toBe(DEFAULT_B);
    expect(vars['--sn-pro-aurora-glow-3']).toBe(DEFAULT_A);
    expect(vars['--sn-pro-aurora-glow-4']).toBe(DEFAULT_B);
  });

  it('should top up a partial host palette with defaults', () => {
    const vars = auroraBackgroundVars({ type: 'mesh', colors: ['#0af'] });
    expect(vars['--sn-pro-aurora-glow-1']).toBe('#0af');
    expect(vars['--sn-pro-aurora-glow-2']).toBe(DEFAULT_B);
    expect(vars['--sn-pro-aurora-glow-3']).toBe(DEFAULT_A);
  });

  it('should drop blank entries instead of rendering an empty gradient stop', () => {
    const vars = auroraBackgroundVars({ type: 'mesh', colors: ['  ', '#0af'] });
    expect(vars['--sn-pro-aurora-glow-1']).toBe('#0af');
  });
});

describe('aurora background helpers · determinism', () => {
  it('should be pure — equal input yields an equal result', () => {
    const input = { type: 'mesh' as const, colors: ['#0af', '#f0a'] };
    expect(auroraBackgroundVars(input)).toEqual(auroraBackgroundVars(input));
  });

  it('should resolve one color per requested glow', () => {
    expect(auroraGlowColors(undefined, 3)).toHaveLength(3);
    expect(auroraGlowColors(['#1', '#2'], 1)).toEqual(['#1']);
  });

  it('should letter the css url helper', () => {
    expect(cssUrl('')).toBeUndefined();
    expect(cssUrl('/x.png')).toBe('url("/x.png")');
    expect(AURORA_GLOW_VARS).toHaveLength(4);
  });
});
