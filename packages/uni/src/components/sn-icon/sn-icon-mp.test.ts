/**
 * sn-icon MP rendering helpers — behavior tests (AUI-MP-002).
 *
 * The MP path exists because WXML has no `<svg>` element. These tests pin the
 * data URL contract (`<image src>` must carry a decodable SVG document with
 * the resolved stroke color baked in) and the tolerant computedStyle reader
 * (mini-program hosts wrap NodeInfo differently across base libraries).
 */

import { describe, it, expect } from 'vitest';
import {
  buildIconDataUrl,
  isConcreteIconColor,
  readResolvedIconColor,
  pickMpQueryHost,
  RETRY_DELAYS_MS,
} from './sn-icon-mp';
import { resolveSnIconStringSync } from './sn-icon-providers';
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

describe('pickMpQueryHost', () => {
  const scopeHost = { createSelectorQuery: () => ({}) };
  const uniHost = { createSelectorQuery: () => ({}) };

  it('should prefer the component $scope query (native scoping over the page-level uni query)', () => {
    // 回归（heart 图标在 MP 上渲染为黑）：232331e5 把 uni 宿主的页面级查询
    // 排到了 $scope 前面 —— 嵌套自定义组件里 `.in(Vue proxy)` 不可靠，部分
    // 图标实例取色失败永落墨色。$scope 必须优先。
    const picked = pickMpQueryHost(scopeHost, uniHost, 'proxy');
    expect(picked.kind).toBe('scope');
    expect(picked.createQuery).toBe(scopeHost.createSelectorQuery);
    expect(picked.queryScope).toBe(scopeHost);
  });

  it('should fall back to the uni host query only without a $scope', () => {
    const picked = pickMpQueryHost(null, uniHost, 'proxy');
    expect(picked.kind).toBe('uni');
    expect(picked.createQuery).toBe(uniHost.createSelectorQuery);
    expect(picked.queryScope).toBe('proxy');
  });

  it('should report no host when neither source exposes createSelectorQuery', () => {
    expect(pickMpQueryHost({}, {}).kind).toBe(null);
    expect(pickMpQueryHost(null, null, 'proxy').kind).toBe(null);
  });
});

describe('RETRY_DELAYS_MS', () => {
  it('should retry the computed-color query multiple times with a bounded budget', () => {
    // 单次 50ms 重试在重型页面上会输给首次渲染（回归：图标永落墨色兜底）。
    expect(RETRY_DELAYS_MS.length).toBeGreaterThanOrEqual(4);
    expect(RETRY_DELAYS_MS.every((ms) => ms > 0)).toBe(true);
    expect(RETRY_DELAYS_MS[RETRY_DELAYS_MS.length - 1]).toBeLessThan(2000);
  });
});

describe('catalog icons bake the resolved color (heart regression)', () => {
  it('should bake the stroke color into catalog-driven string icons', () => {
    // 回归：MP 按钮内嵌 heart 图标曾渲染为黑（取色竞态 + 墨色兜底）。烘焙层
    // 本身必须对任意目录图标把解析色写入 stroke —— 黑色只能来自取色失败，
    // 该条锁定烘焙层不再是嫌疑路径。
    for (const name of ['heart', 'check', 'plus']) {
      const data = resolveSnIconStringSync(name);
      expect(data, name).not.toBeNull();
      const svg = decodeSvg(buildIconDataUrl(data as IconData, '#ffffff', 2));
      expect(svg, name).toContain('stroke="#ffffff"');
      expect(svg, name).toContain('fill="none"');
    }
  });
});
