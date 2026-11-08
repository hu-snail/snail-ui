/**
 * sn-sidebar scroll-spy unit tests — the active-section resolver, the
 * rect → offset mapping and the guarded `uni` measurement adapter.
 *
 * Behaviour only (AGENTS.md §46): which entry a scroll position resolves to,
 * which rects survive mapping, and how a missing / broken host is tolerated.
 * No rpx / px layout assertions — real values are injected.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  buildSectionOffsets,
  measureSectionOffsets,
  resolveActiveSection,
  type SnSidebarAnchorRef,
  type SnSidebarMeasuredRect,
} from './sn-sidebar-scroll';

const REFS: SnSidebarAnchorRef[] = [
  { value: 0, anchor: 'sec-a' },
  { value: 1, anchor: 'sec-b' },
  { value: 2, anchor: 'sec-c' },
];

/** Three sections laid out 0 / 200 / 400 px down the scroll content. */
const RECTS: SnSidebarMeasuredRect[] = [
  { id: 'sec-a', top: 100 },
  { id: 'sec-b', top: 300 },
  { id: 'sec-c', top: 500 },
];

/** Install a `uni.createSelectorQuery` stub returning the given rects. */
function installUniQuery(readRects: () => Array<SnSidebarMeasuredRect | null> | undefined): void {
  (globalThis as { uni?: unknown }).uni = {
    createSelectorQuery: () => ({
      selectAll: () => ({
        fields: (
          _options: unknown,
          callback: (rects: Array<SnSidebarMeasuredRect | null> | undefined) => void,
        ) => ({ exec: () => callback(readRects()) }),
      }),
    }),
  };
}

afterEach(() => {
  delete (globalThis as { uni?: unknown }).uni;
});

describe('buildSectionOffsets', () => {
  it('should map rects to entry values and offset them from the highest section', () => {
    expect(buildSectionOffsets(RECTS, REFS)).toEqual([
      { value: 0, top: 0 },
      { value: 1, top: 200 },
      { value: 2, top: 400 },
    ]);
  });

  it('should keep offsets scroll-invariant when every rect shifts equally', () => {
    const scrolled = RECTS.map((rect) => ({ ...rect, top: rect.top - 120 }));
    expect(buildSectionOffsets(scrolled, REFS)).toEqual(buildSectionOffsets(RECTS, REFS));
  });

  it('should drop rects whose id matches no anchor', () => {
    const rects = [...RECTS, { id: 'header', top: 20 }];
    expect(buildSectionOffsets(rects, REFS).map((section) => section.value)).toEqual([0, 1, 2]);
  });

  it('should drop anchors that name no section', () => {
    expect(buildSectionOffsets([{ id: 'sec-b', top: 40 }], REFS)).toEqual([{ value: 1, top: 0 }]);
  });

  it('should ignore anchors without a section id', () => {
    const refs = [...REFS, { value: 3, anchor: '' }];
    expect(buildSectionOffsets(RECTS, refs).map((section) => section.value)).toEqual([0, 1, 2]);
  });

  it('should map a duplicated page id to the first registered anchor only', () => {
    const refs: SnSidebarAnchorRef[] = [
      { value: 'first', anchor: 'dup' },
      { value: 'second', anchor: 'dup' },
    ];
    const rects = [
      { id: 'dup', top: 0 },
      { id: 'dup', top: 120 },
    ];
    expect(buildSectionOffsets(rects, refs)).toEqual([{ value: 'first', top: 0 }]);
  });

  it('should order sections by position rather than DOM order', () => {
    const rects: SnSidebarMeasuredRect[] = [
      { id: 'sec-c', top: 400 },
      { id: 'sec-a', top: 0 },
      { id: 'sec-b', top: 200 },
    ];
    expect(buildSectionOffsets(rects, REFS).map((section) => section.value)).toEqual([0, 1, 2]);
  });

  it('should return an empty list when nothing matches', () => {
    expect(buildSectionOffsets([], REFS)).toEqual([]);
    expect(buildSectionOffsets(RECTS, [])).toEqual([]);
  });
});

describe('resolveActiveSection', () => {
  const OFFSETS = buildSectionOffsets(RECTS, REFS);

  it('should resolve nothing without measured sections', () => {
    expect(resolveActiveSection([], 500)).toBeUndefined();
  });

  it('should keep the first section active before its own top', () => {
    expect(resolveActiveSection(OFFSETS, 0)).toBe(0);
  });

  it('should activate the last section starting at or above the position', () => {
    expect(resolveActiveSection(OFFSETS, 199)).toBe(0);
    expect(resolveActiveSection(OFFSETS, 200)).toBe(1);
    expect(resolveActiveSection(OFFSETS, 399)).toBe(1);
    expect(resolveActiveSection(OFFSETS, 400)).toBe(2);
  });

  it('should keep the last section active past the end of the content', () => {
    expect(resolveActiveSection(OFFSETS, 5000)).toBe(2);
  });

  it('should shift the activation line by the threshold', () => {
    expect(resolveActiveSection(OFFSETS, 160, 40)).toBe(1);
    expect(resolveActiveSection(OFFSETS, 160, -40)).toBe(0);
  });

  it('should treat a non-finite threshold as zero', () => {
    expect(resolveActiveSection(OFFSETS, 160, Number.NaN)).toBe(0);
    expect(resolveActiveSection(OFFSETS, 160, Number.POSITIVE_INFINITY)).toBe(0);
  });
});

describe('measureSectionOffsets', () => {
  it('should hand the measured offsets to the callback', () => {
    installUniQuery(() => RECTS);
    const onResult = vi.fn();
    measureSectionOffsets('.sec', REFS, onResult);
    expect(onResult).toHaveBeenCalledWith(buildSectionOffsets(RECTS, REFS));
  });

  it('should skip null rects a host reports for hidden nodes', () => {
    installUniQuery(() => [null, { id: 'sec-b', top: 60 }, null]);
    const onResult = vi.fn();
    measureSectionOffsets('.sec', REFS, onResult);
    expect(onResult).toHaveBeenCalledWith([{ value: 1, top: 0 }]);
  });

  it('should report nothing for an empty rect list', () => {
    installUniQuery(() => undefined);
    const onResult = vi.fn();
    measureSectionOffsets('.sec', REFS, onResult);
    expect(onResult).toHaveBeenCalledWith([]);
  });

  it('should do nothing without a uni host', () => {
    const onResult = vi.fn();
    measureSectionOffsets('.sec', REFS, onResult);
    expect(onResult).not.toHaveBeenCalled();
  });

  it('should do nothing without a selector or without anchors', () => {
    installUniQuery(() => RECTS);
    const onResult = vi.fn();
    measureSectionOffsets('', REFS, onResult);
    measureSectionOffsets('.sec', [], onResult);
    expect(onResult).not.toHaveBeenCalled();
  });

  it('should tolerate a host whose selector query is partially implemented', () => {
    (globalThis as { uni?: unknown }).uni = {
      createSelectorQuery: () => ({}),
    };
    const onResult = vi.fn();
    expect(() => measureSectionOffsets('.sec', REFS, onResult)).not.toThrow();
    expect(onResult).not.toHaveBeenCalled();
  });

  it('should swallow a host that throws mid-query', () => {
    (globalThis as { uni?: unknown }).uni = {
      createSelectorQuery: () => ({
        selectAll: () => {
          throw new Error('unsupported');
        },
      }),
    };
    const onResult = vi.fn();
    expect(() => measureSectionOffsets('.sec', REFS, onResult)).not.toThrow();
    expect(onResult).not.toHaveBeenCalled();
  });
});
