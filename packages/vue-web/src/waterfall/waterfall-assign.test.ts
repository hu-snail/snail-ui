import { describe, expect, it } from 'vitest';
import {
  allocateWaterfallColumns,
  columnHeight,
  hasMeasurement,
  parsePx,
  resolveResponsiveColumnCount,
} from './waterfall-assign';

/** Heights map from a plain record. */
function heightsOf(record: Record<string, number>): Map<string, number> {
  return new Map(Object.entries(record));
}

describe('columnHeight', () => {
  it('should sum the item heights plus the gaps between them', () => {
    const heights = heightsOf({ a: 100, b: 50 });
    expect(columnHeight(['a', 'b'], heights, 10)).toBe(160);
  });

  it('should not count a trailing gap for a single item', () => {
    expect(columnHeight(['a'], heightsOf({ a: 100 }), 10)).toBe(100);
    expect(columnHeight([], heightsOf({}), 10)).toBe(0);
  });

  it('should treat unmeasured items as zero height', () => {
    expect(columnHeight(['a', 'b'], heightsOf({ a: 40 }), 0)).toBe(40);
  });
});

describe('hasMeasurement', () => {
  it('should report false until a non-zero height arrives', () => {
    expect(hasMeasurement(new Map())).toBe(false);
    expect(hasMeasurement(heightsOf({ a: 0 }))).toBe(false);
    expect(hasMeasurement(heightsOf({ a: 0, b: 1 }))).toBe(true);
  });
});

describe('allocateWaterfallColumns — first placement', () => {
  it('should distribute round-robin while nothing is measured', () => {
    const columns = allocateWaterfallColumns(
      ['a', 'b', 'c', 'd', 'e', 'f'],
      null,
      3,
      new Map(),
      16,
    );
    expect(columns).toEqual([
      ['a', 'd'],
      ['b', 'e'],
      ['c', 'f'],
    ]);
  });

  it('should pack into the shortest column once heights are known', () => {
    // Tall first item, then two short ones: they must not pile under it.
    const heights = heightsOf({ a: 300, b: 100, c: 100, d: 100 });
    const columns = allocateWaterfallColumns(['a', 'b', 'c', 'd'], null, 2, heights, 10);

    expect(columns[0]).toEqual(['a']);
    expect(columns[1]).toEqual(['b', 'c', 'd']);
  });

  it('should resolve ties to the leftmost column', () => {
    const heights = heightsOf({ a: 100, b: 100 });
    const columns = allocateWaterfallColumns(['a', 'b', 'c'], null, 2, heights, 10);
    expect(columns).toEqual([['a', 'c'], ['b']]);
  });

  it('should drop duplicate keys', () => {
    const columns = allocateWaterfallColumns(['a', 'a', 'b'], null, 2, new Map(), 8);
    expect(columns).toEqual([['a'], ['b']]);
  });

  it('should coerce the column count to at least one', () => {
    const columns = allocateWaterfallColumns(['a', 'b'], null, 0, new Map(), 8);
    expect(columns).toEqual([['a', 'b']]);
  });
});

describe('allocateWaterfallColumns — append-only diffing', () => {
  it('should keep existing keys in their columns and append the new one', () => {
    const previous = [['a', 'c'], ['b']];
    // Column 0 currently stands 20px taller than column 1.
    const heights = heightsOf({ a: 100, b: 100, c: 60, d: 100 });
    const columns = allocateWaterfallColumns(['a', 'b', 'c', 'd'], previous, 2, heights, 0);

    expect(columns[0]).toEqual(['a', 'c']);
    expect(columns[1]).toEqual(['b', 'd']);
  });

  it('should never move an existing item because a later one grew a column', () => {
    const previous = [['a'], ['b']];
    // `a` turns out to be enormous — `b` must stay in column 1 regardless.
    const heights = heightsOf({ a: 900, b: 10 });
    const columns = allocateWaterfallColumns(['a', 'b'], previous, 2, heights, 0);
    expect(columns).toEqual([['a'], ['b']]);
  });

  it('should drop keys that disappeared from the slot', () => {
    const previous = [['a', 'c'], ['b']];
    const columns = allocateWaterfallColumns(['a', 'b'], previous, 2, new Map(), 0);
    expect(columns).toEqual([['a'], ['b']]);
  });

  it('should append new keys round-robin while unmeasured', () => {
    const previous = [['a'], ['b']];
    const columns = allocateWaterfallColumns(['a', 'b', 'c', 'd', 'e'], previous, 2, new Map(), 0);
    expect(columns).toEqual([
      ['a', 'c', 'e'],
      ['b', 'd'],
    ]);
  });

  it('should redistribute from scratch when the column count changes', () => {
    const previous = [['a', 'b', 'c'], ['d']];
    const columns = allocateWaterfallColumns(['a', 'b', 'c', 'd'], previous, 3, new Map(), 0);
    expect(columns).toEqual([['a', 'd'], ['b'], ['c']]);
  });
});

describe('resolveResponsiveColumnCount', () => {
  it('should derive the count from the available width', () => {
    expect(resolveResponsiveColumnCount(1000, 200, 16)).toBe(4); // (1016) / 216 = 4.70
    expect(resolveResponsiveColumnCount(420, 200, 16)).toBe(2); // 436 / 216 = 2.01
  });

  it('should never return less than one column', () => {
    expect(resolveResponsiveColumnCount(0, 200, 16)).toBe(1);
    expect(resolveResponsiveColumnCount(-500, 200, 16)).toBe(1);
    expect(resolveResponsiveColumnCount(Number.NaN, 200, 16)).toBe(1);
    expect(resolveResponsiveColumnCount(1000, 0, 16)).toBe(1);
  });

  it('should tolerate a missing gap', () => {
    expect(resolveResponsiveColumnCount(1000, 250, Number.NaN)).toBe(4);
  });
});

describe('parsePx', () => {
  it('should pass numbers through and coerce invalid ones to zero', () => {
    expect(parsePx(12)).toBe(12);
    expect(parsePx(Number.NaN)).toBe(0);
  });

  it('should read the numeric part of a css length', () => {
    expect(parsePx('24px')).toBe(24);
    expect(parsePx('2rem')).toBe(2);
    expect(parsePx('auto')).toBe(0);
  });
});
