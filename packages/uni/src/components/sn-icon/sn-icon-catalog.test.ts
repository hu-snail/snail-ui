/**
 * sn-icon-catalog tests — 内置图标目录数据完整性 + 搜索行为。
 *
 * 数据完整性是 catalog 的用户可见契约：string icon API 与 showcase 页
 * 都假设「每个条目可渲染、可搜索、有分类」。坏条目 = 页面上一个空格子。
 */

import { describe, it, expect } from 'vitest';
import {
  SN_ICON_CATALOG,
  SN_ICON_CATEGORY_LABELS,
  searchSnIconCatalog,
} from './sn-icon-catalog';

describe('sn-icon catalog 数据完整性', () => {
  it('should contain a curated set of at least 100 icons', () => {
    expect(SN_ICON_CATALOG.length).toBeGreaterThanOrEqual(100);
  });

  it('should have unique names across the catalog', () => {
    const names = SN_ICON_CATALOG.map((entry) => entry.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('should only use categories declared in SN_ICON_CATEGORY_LABELS', () => {
    const validCategories = new Set(Object.keys(SN_ICON_CATEGORY_LABELS));
    for (const entry of SN_ICON_CATALOG) {
      expect(validCategories.has(entry.category), entry.name).toBe(true);
    }
  });

  it('should give every entry a zh label, keywords and renderable path data', () => {
    for (const entry of SN_ICON_CATALOG) {
      expect(entry.zh.length, entry.name).toBeGreaterThan(0);
      expect(entry.keywords.length, entry.name).toBeGreaterThan(0);
      expect(entry.data.paths.length, entry.name).toBeGreaterThan(0);
      for (const d of entry.data.paths) {
        expect(d.length, entry.name).toBeGreaterThan(0);
      }
    }
  });

  it('should cover the direction category with the arrows shown in the showcase', () => {
    const directionNames = SN_ICON_CATALOG.filter((e) => e.category === 'direction').map((e) => e.name);
    for (const name of ['arrow-down', 'arrow-up', 'arrow-left', 'arrow-right', 'chevron-down']) {
      expect(directionNames, name).toContain(name);
    }
  });
});

describe('searchSnIconCatalog', () => {
  it('should return the whole catalog for an empty query', () => {
    expect(searchSnIconCatalog('').length).toBe(SN_ICON_CATALOG.length);
    expect(searchSnIconCatalog('   ').length).toBe(SN_ICON_CATALOG.length);
  });

  it('should match by english name (case-insensitive substring)', () => {
    const hits = searchSnIconCatalog('ARROW-DOWN');
    expect(hits.some((e) => e.name === 'arrow-down')).toBe(true);
  });

  it('should match by chinese label', () => {
    const hits = searchSnIconCatalog('关闭');
    expect(hits.some((e) => e.name === 'x')).toBe(true);
  });

  it('should match by keyword synonym', () => {
    const hits = searchSnIconCatalog('放大镜');
    expect(hits.some((e) => e.name === 'search')).toBe(true);
  });

  it('should return nothing for a query that matches nothing', () => {
    expect(searchSnIconCatalog('不存在-xyzzy')).toEqual([]);
  });

  it('should restrict results to a category when one is given', () => {
    const directionOnly = searchSnIconCatalog('arrow', 'direction');
    expect(directionOnly.length).toBeGreaterThan(0);
    expect(directionOnly.every((e) => e.category === 'direction')).toBe(true);
  });
});
