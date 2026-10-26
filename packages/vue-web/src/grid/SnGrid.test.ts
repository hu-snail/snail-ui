import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import SnGrid from './SnGrid.vue';
import type { ResponsiveCols } from './SnGrid.vue';

describe('SnGrid (AUI-WEB-LAYOUT-002)', () => {
  it('renders a grid with default 24 columns', () => {
    const w = mount(SnGrid);
    expect(w.classes()).toContain('sn-grid');
    expect(w.attributes('style')).toMatch(/grid-template-columns:\s*repeat\(24/);
  });

  it('honors custom cols (numeric)', () => {
    const w = mount(SnGrid, { props: { cols: 3 } });
    expect(w.attributes('style')).toMatch(/grid-template-columns:\s*repeat\(3/);
  });

  it('honors xGap and yGap as px numbers', () => {
    const w = mount(SnGrid, { props: { cols: 2, xGap: 16, yGap: 24 } });
    const style = w.attributes('style') ?? '';
    expect(style).toMatch(/column-gap:\s*16px/);
    expect(style).toMatch(/row-gap:\s*24px/);
  });

  it('honors xGap / yGap as string values', () => {
    const w = mount(SnGrid, { props: { xGap: '32', yGap: '8px' } });
    const style = w.attributes('style') ?? '';
    expect(style).toMatch(/column-gap:\s*32px/);
    expect(style).toMatch(/row-gap:\s*8px/);
  });

  it('falls back to 0px when xGap / yGap are empty', () => {
    const w = mount(SnGrid, { props: { xGap: '', yGap: '' } });
    const style = w.attributes('style') ?? '';
    expect(style).toMatch(/column-gap:\s*0px/);
    expect(style).toMatch(/row-gap:\s*0px/);
  });

  it('falls back to 24 columns when cols is invalid (0, negative, NaN)', () => {
    const w0 = mount(SnGrid, { props: { cols: 0 } });
    expect(w0.attributes('style')).toMatch(/repeat\(24/);

    const wNeg = mount(SnGrid, { props: { cols: -1 } });
    expect(wNeg.attributes('style')).toMatch(/repeat\(24/);

    const wStr = mount(SnGrid, { props: { cols: 'abc' as unknown as number } });
    expect(wStr.attributes('style')).toMatch(/repeat\(24/);
  });

  it('renders children inside the grid container', () => {
    const w = mount(SnGrid, {
      props: { cols: 2 },
      slots: { default: '<div>a</div><div>b</div>' },
    });
    expect(w.findAll('div').length).toBeGreaterThanOrEqual(2);
    expect(w.text()).toContain('a');
    expect(w.text()).toContain('b');
  });

  it('applies itemResponsive class when enabled', () => {
    const w = mount(SnGrid, { props: { itemResponsive: true } });
    expect(w.classes()).toContain('sn-grid--item-responsive');
  });

  /* ─────────── §112 expansion: responsive object / collapsed mode ───────── */

  it('responsive cols object picks the largest matching breakpoint', () => {
    // JSDOM default window.innerWidth is 1024, which satisfies the `xl`
    // bucket (≥1024). With m:1 / l:2 / xl:3 the resolved cols is 3.
    const cols: ResponsiveCols = { m: 1, l: 2, xl: 3 };
    const w = mount(SnGrid, { props: { cols } });
    expect(w.attributes('style')).toMatch(/grid-template-columns:\s*repeat\(3/);
  });

  it('collapsed mode applies max-height + overflow-hidden', () => {
    const w = mount(SnGrid, {
      props: { cols: 2, collapsed: true, collapsedRows: 2, yGap: 8 },
    });
    const style = w.attributes('style') ?? '';
    // 2 rows × 80 + 1 gap = 168
    expect(style).toMatch(/max-height:\s*168px/);
    expect(style).toMatch(/overflow:\s*hidden/);
    expect(w.classes()).toContain('sn-grid--collapsed');
  });

  it('suffix slot renders after children when enabled', () => {
    const w = mount(SnGrid, {
      props: { cols: 3, suffix: true },
      slots: { default: '<div>a</div>', suffix: '<button>+N more</button>' },
    });
    expect(w.text()).toContain('+N more');
  });

  it('suffix slot is skipped when suffix prop is false', () => {
    const w = mount(SnGrid, {
      props: { cols: 3, suffix: false },
      slots: { default: '<div>a</div>', suffix: '<button>hidden</button>' },
    });
    expect(w.text()).not.toContain('hidden');
  });

  /* ─────────── viewport listener lifecycle (leak regression) ───────── */

  it('binds no resize listener for static cols', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const w = mount(SnGrid, { props: { cols: 3 } });
    expect(addSpy.mock.calls.some(([type]) => type === 'resize')).toBe(false);
    w.unmount();
    addSpy.mockRestore();
  });

  it('binds the resize listener for responsive cols and removes it on unmount', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const cols: ResponsiveCols = { l: 2 };
    const w = mount(SnGrid, { props: { cols } });
    expect(addSpy.mock.calls.some(([type]) => type === 'resize')).toBe(true);
    w.unmount();
    expect(removeSpy.mock.calls.some(([type]) => type === 'resize')).toBe(true);
    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it('binds the resize listener lazily when cols switches to responsive', async () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const w = mount(SnGrid, { props: { cols: 3 } });
    expect(addSpy.mock.calls.some(([type]) => type === 'resize')).toBe(false);
    const cols: ResponsiveCols = { s: 1, m: 2 };
    void w.setProps({ cols });
    await Promise.resolve();
    expect(addSpy.mock.calls.some(([type]) => type === 'resize')).toBe(true);
    void w.setProps({ cols: 4 });
    await Promise.resolve();
    expect(removeSpy.mock.calls.some(([type]) => type === 'resize')).toBe(true);
    w.unmount();
    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
