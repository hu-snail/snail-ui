/**
 * sn-icon MP rendering helpers — behavior tests (AUI-MP-002).
 *
 * The MP path exists because WXML has no `<svg>` element. These tests pin the
 * data URL contract (`<image src>` must carry a decodable SVG document with
 * the resolved stroke color baked in) and the tolerant computedStyle reader
 * (mini-program hosts wrap NodeInfo differently across base libraries).
 */

import { describe, it, expect } from 'vitest';
import { buildIconDataUrl, isConcreteIconColor, readResolvedIconColor } from './sn-icon-mp';
import type { IconData } from './sn-icon-types';

/** Decode the base64 payload of a `data:image/svg+xml;base64,...` URL. */
function decodeSvg(url: string): string {
  const prefix = 'data:image/svg+xml;base64,';
  expect(url.startsWith(prefix)).toBe(true);
  return Buffer.from(url.slice(prefix.length), 'base64').toString('utf8');
}

const stroked: IconData = {
  viewBox: '0 0 16 16',
  paths: ['M2 8h12', 'M8 2v12'],
};

describe('buildIconDataUrl', () => {
  it('should bake the resolved stroke color into the SVG document', () => {
    const svg = decodeSvg(buildIconDataUrl(stroked, '#ff0000', 2));

    expect(svg).toContain('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">');
    expect(svg).toContain('stroke="#ff0000"');
    expect(svg).toContain('stroke-width="2"');
    expect(svg).toContain('stroke-linecap="round"');
    expect(svg).toContain('fill="none"');
    // One <path> per IconData path.
    expect(svg.match(/<path /g)).toHaveLength(2);
  });

  it('should fall back to the 24x24 grid when the icon has no viewBox', () => {
    const svg = decodeSvg(buildIconDataUrl({ paths: ['M3 3'] }, '#000000', 1.5));
    expect(svg).toContain('viewBox="0 0 24 24"');
    expect(svg).toContain('stroke-width="1.5"');
  });

  it('should fill solid glyphs instead of stroking them', () => {
    const svg = decodeSvg(buildIconDataUrl({ paths: ['M3 3'], render: 'fill' }, '#00ff00', 2));

    expect(svg).toContain('fill="#00ff00"');
    expect(svg).not.toContain('stroke=');
    expect(svg).not.toContain('stroke-width=');
  });

  it('should produce a URL that is safe for WXML attributes', () => {
    const url = buildIconDataUrl(stroked, 'rgba(0, 0, 0, 0.5)', 2);
    // Base64 cannot contain quotes / angle brackets / whitespace.
    expect(url).toMatch(/^data:image\/svg\+xml;base64,[A-Za-z0-9+/]+=*$/);
  });
});

describe('isConcreteIconColor', () => {
  it('should accept colors that can be baked into an SVG document', () => {
    for (const color of ['#fff', '#4c7cf0', '#4c7cf0cc', 'rgb(1,2,3)', 'rgba(0,0,0,.5)', 'black']) {
      expect(isConcreteIconColor(color), color).toBe(true);
    }
  });

  it('should reject cascade references that need computedStyle', () => {
    for (const color of ['currentColor', 'var(--sn-mp-color-text-primary)', '', 'inherit']) {
      expect(isConcreteIconColor(color), color).toBe(false);
    }
  });
});

describe('readResolvedIconColor', () => {
  it('should read a direct NodeInfo object', () => {
    expect(readResolvedIconColor({ color: 'rgb(76, 124, 240)' })).toBe('rgb(76, 124, 240)');
  });

  it('should read the one-element array shape used by classic hosts', () => {
    expect(readResolvedIconColor([{ color: '#4c7cf0' }])).toBe('#4c7cf0');
  });

  it('should probe stringified wrappers (UTSJSONObject / Map)', () => {
    expect(readResolvedIconColor('{"color":"rgb(1, 2, 3)"}')).toBe('rgb(1, 2, 3)');
  });

  it('should reject non-concrete / missing values so the ink fallback wins', () => {
    expect(readResolvedIconColor({ color: 'currentColor' })).toBe('');
    expect(readResolvedIconColor({})).toBe('');
    expect(readResolvedIconColor(null)).toBe('');
  });
});
