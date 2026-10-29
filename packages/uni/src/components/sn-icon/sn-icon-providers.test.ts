/**
 * sn-icon-providers tests — string icon 解析路由行为。
 *
 * 覆盖：registry 优先级、内置目录命中、自定义 Provider（同步 / 异步）、
 * `collection:name` 回落 Iconify、configSnIcons 开关、clear 恢复内建。
 */

import { describe, it, expect, afterEach } from 'vitest';
import type { IconData } from './sn-icon.vue';
import { registerSnIcons, clearSnIcons } from './sn-icon-registry';
import {
  configSnIcons,
  registerSnIconProvider,
  getSnIconProvider,
  clearSnIconProviders,
  resolveSnIconStringSync,
  resolveSnIconStringAsync,
  SN_ICON_CATALOG_SIZE,
} from './sn-icon-providers';

const fakeData: IconData = { paths: ['M3 12h18'] };

afterEach(() => {
  clearSnIcons();
  clearSnIconProviders();
});

describe('resolveSnIconStringSync', () => {
  it('should resolve from the built-in catalog', () => {
    expect(resolveSnIconStringSync('arrow-down')).not.toBeNull();
  });

  it('should resolve a registry entry registered by the app', () => {
    registerSnIcons({ 'app-logo': fakeData });
    expect(resolveSnIconStringSync('app-logo')).toBe(fakeData);
  });

  it('should let the registry override a built-in catalog name', () => {
    const builtin = resolveSnIconStringSync('search');
    registerSnIcons({ search: fakeData });
    expect(resolveSnIconStringSync('search')).toBe(fakeData);
    expect(resolveSnIconStringSync('search')).not.toBe(builtin);
  });

  it('should return null for an unknown plain name', () => {
    expect(resolveSnIconStringSync('not-an-icon')).toBeNull();
  });
});

describe('custom providers', () => {
  it('should route prefix:rest to a registered provider (sync IconData)', () => {
    registerSnIconProvider('app', { resolve: () => fakeData });
    const result = resolveSnIconStringAsync('app:logo', { color: 'currentColor', size: 24 });
    expect(result).toBe(fakeData);
  });

  it('should route prefix:rest to a registered provider (sync url string)', () => {
    registerSnIconProvider('cdn', { resolve: () => 'https://cdn.example.com/a.svg' });
    const result = resolveSnIconStringAsync('cdn:a', { color: 'currentColor', size: 24 });
    expect(result).toBe('https://cdn.example.com/a.svg');
  });

  it('should await async providers', async () => {
    registerSnIconProvider('slow', {
      resolve: () => Promise.resolve(fakeData),
    });
    const result = await resolveSnIconStringAsync('slow:dot', { color: 'currentColor', size: 24 });
    expect(result).toBe(fakeData);
  });

  it('should match provider prefixes case-insensitively', () => {
    registerSnIconProvider('APP', { resolve: () => fakeData });
    const result = resolveSnIconStringAsync('app:x', { color: 'currentColor', size: 24 });
    expect(result).toBe(fakeData);
  });

  it('should expose providers via getSnIconProvider', () => {
    const provider = { resolve: () => null };
    registerSnIconProvider('mine', provider);
    expect(getSnIconProvider('mine')?.resolve('x', { color: 'currentColor', size: 24 })).toBeNull();
    expect(getSnIconProvider('missing')).toBeUndefined();
  });
});

describe('iconify fallback routing', () => {
  it('should fall back to the built-in iconify provider for collection:name targets', () => {
    // 注册 iconify 占位 Provider，避免真网络请求；只验证路由。
    registerSnIconProvider('iconify', { resolve: () => 'data:image/svg+xml,test' });
    const result = resolveSnIconStringAsync('mdi:home', { color: 'currentColor', size: 24 });
    expect(result).toBe('data:image/svg+xml,test');
  });

  it('should route iconify:collection:name explicitly', () => {
    registerSnIconProvider('iconify', { resolve: () => 'data:image/svg+xml,ok' });
    const result = resolveSnIconStringAsync('iconify:mdi:home', { color: 'currentColor', size: 24 });
    expect(result).toBe('data:image/svg+xml,ok');
  });

  it('should return null for unknown prefixes without a valid collection:name shape', () => {
    expect(
      resolveSnIconStringAsync('nope-not-registered!', { color: 'currentColor', size: 24 }),
    ).toBeNull();
  });

  it('should disable the iconify fallback via configSnIcons({ iconify: false })', () => {
    configSnIcons({ iconify: false });
    expect(getSnIconProvider('iconify')).toBeUndefined();
    expect(
      resolveSnIconStringAsync('mdi:home', { color: 'currentColor', size: 24 }),
    ).toBeNull();
  });

  it('should re-enable the iconify provider via configSnIcons({ iconify: true })', () => {
    configSnIcons({ iconify: false });
    configSnIcons({ iconify: true });
    expect(getSnIconProvider('iconify')).toBeDefined();
  });
});

describe('clearSnIconProviders', () => {
  it('should drop custom providers but restore the built-in iconify provider', () => {
    registerSnIconProvider('app', { resolve: () => fakeData });
    clearSnIconProviders();
    expect(getSnIconProvider('app')).toBeUndefined();
    expect(getSnIconProvider('iconify')).toBeDefined();
  });
});

describe('SN_ICON_CATALOG_SIZE', () => {
  it('should mirror the catalog length', () => {
    expect(SN_ICON_CATALOG_SIZE).toBeGreaterThan(100);
  });
});
