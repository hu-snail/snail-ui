/**
 * sn-icon-iconify tests — Iconify 按需加载行为（注入假 fetcher，零网络）。
 *
 * 覆盖：URL 构造（apiBase / color / height）、target 校验、缓存去重、
 * 失败驱逐重试、非 SVG 响应拒绝、配置注入。
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  configSnIconify,
  resetSnIconifyConfig,
  getSnIconifyConfig,
  buildIconifySvgUrl,
  resolveIconifyIcon,
  clearSnIconifyCache,
  type SnIconifyOptions,
} from './sn-icon-iconify';

const CTX = (color = 'currentColor', size = 24) => ({
  color,
  size,
  signal: new AbortController().signal,
});

beforeEach(() => {
  resetSnIconifyConfig();
  clearSnIconifyCache();
});

afterEach(() => {
  resetSnIconifyConfig();
  clearSnIconifyCache();
});

describe('buildIconifySvgUrl', () => {
  it('should hit the svg endpoint with a default height of 24', () => {
    expect(buildIconifySvgUrl('mdi', 'home', { color: 'currentColor', size: 24 })).toBe(
      'https://api.iconify.design/mdi/home.svg?height=24',
    );
  });

  it('should bake an explicit color and round fractional sizes', () => {
    expect(buildIconifySvgUrl('mdi', 'home', { color: '#ff0000', size: 17.6 })).toBe(
      'https://api.iconify.design/mdi/home.svg?height=18&color=%23ff0000',
    );
  });

  it('should fall back to height 24 for invalid sizes', () => {
    expect(buildIconifySvgUrl('mdi', 'home', { color: 'currentColor', size: Number.NaN })).toBe(
      'https://api.iconify.design/mdi/home.svg?height=24',
    );
  });

  it('should omit the color param for currentColor (inheritance is impossible in an svg document)', () => {
    const url = buildIconifySvgUrl('mdi', 'home', { color: 'currentColor', size: 24 });
    expect(url).not.toContain('color=');
  });
});

describe('resolveIconifyIcon', () => {
  it('should reject invalid targets with ICON_SOURCE_UNRESOLVED', async () => {
    await expect(resolveIconifyIcon('no-colon', CTX())).rejects.toMatchObject({
      code: 'ICON_SOURCE_UNRESOLVED',
    });
    await expect(resolveIconifyIcon(':name', CTX())).rejects.toMatchObject({
      code: 'ICON_SOURCE_UNRESOLVED',
    });
    await expect(resolveIconifyIcon('mdi:', CTX())).rejects.toMatchObject({
      code: 'ICON_SOURCE_UNRESOLVED',
    });
  });

  it('should wrap the fetched svg document into a data url', async () => {
    const requests: string[] = [];
    configSnIconify({
      request: async (url) => {
        requests.push(url);
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 3"/></svg>';
      },
    });
    const url = await resolveIconifyIcon('mdi:home', CTX('#00ff00', 32));
    expect(url).toMatch(/^data:image\/svg\+xml;charset=utf8,/);
    expect(decodeURIComponent(url)).toContain('<svg');
    expect(requests).toEqual(['https://api.iconify.design/mdi/home.svg?height=32&color=%2300ff00']);
  });

  it('should deduplicate concurrent and repeated requests through the cache', async () => {
    let calls = 0;
    configSnIconify({
      request: async () => {
        calls++;
        return '<svg viewBox="0 0 24 24"></svg>';
      },
    });
    const [a, b] = await Promise.all([
      resolveIconifyIcon('mdi:home', CTX()),
      resolveIconifyIcon('mdi:home', CTX()),
    ]);
    const c = await resolveIconifyIcon('mdi:home', CTX());
    expect(calls).toBe(1);
    expect(a).toBe(b);
    expect(b).toBe(c);
  });

  it('should evict failed entries so a retry requests again', async () => {
    let calls = 0;
    configSnIconify({
      request: async () => {
        calls++;
        if (calls === 1) throw new Error('network down');
        return '<svg viewBox="0 0 24 24"></svg>';
      },
    });
    await expect(resolveIconifyIcon('mdi:home', CTX())).rejects.toBeInstanceOf(Error);
    const url = await resolveIconifyIcon('mdi:home', CTX());
    expect(url).toMatch(/^data:image\/svg\+xml/);
    expect(calls).toBe(2);
  });

  it('should reject non-svg responses with ICON_FETCH_FAILED', async () => {
    configSnIconify({ request: async () => 'not found' });
    await expect(resolveIconifyIcon('mdi:home', CTX())).rejects.toMatchObject({
      code: 'ICON_FETCH_FAILED',
    });
  });

  it('should apply configured apiBase and timeout', () => {
    const seen: Array<{ url: string; timeout: number }> = [];
    configSnIconify({
      apiBase: 'https://icon.example.com/api/',
      timeout: 1234,
      request: async (url, ms) => {
        seen.push({ url, timeout: ms });
        return '<svg viewBox="0 0 24 24"></svg>';
      },
    });
    expect(getSnIconifyConfig().apiBase).toBe('https://icon.example.com/api');
    void resolveIconifyIcon('ph:star', CTX());
    expect(seen[0]?.url).toBe('https://icon.example.com/api/ph/star.svg?height=24');
    expect(seen[0]?.timeout).toBe(1234);
  });
});

describe('configSnIconify request injection type', () => {
  it('should accept the documented request signature', () => {
    const options: SnIconifyOptions = {
      request: (url: string, timeoutMs: number, signal: AbortSignal) =>
        Promise.resolve(url).then(() => (signal.aborted ? '' : '<svg/>')),
    };
    configSnIconify(options);
    expect(getSnIconifyConfig().request).toBeTypeOf('function');
  });
});
