import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SnFlex from './SnFlex.vue';

describe('SnFlex (AUI-WEB-LAYOUT-004)', () => {
  it('renders a horizontal flex container with medium gap by default', () => {
    const w = mount(SnFlex);
    expect(w.classes()).toContain('sn-flex');
    const style = w.attributes('style') ?? '';
    expect(style).toMatch(/display:\s*flex/);
    expect(style).toMatch(/flex-direction:\s*row/);
    expect(style).toMatch(/row-gap:\s*var\(--sn-web-space-gap-medium,\s*12px\)/);
    expect(style).toMatch(/column-gap:\s*var\(--sn-web-space-gap-medium,\s*12px\)/);
    // n-flex: wrap defaults to true, horizontal stays wrap.
    expect(style).toMatch(/flex-wrap:\s*wrap/);
    // n-flex passes justify through as-is ('start' stays 'start').
    expect(style).toMatch(/justify-content:\s*start/);
    expect(style).not.toMatch(/align-items/);
  });

  it('renders children as direct flex items', () => {
    const w = mount(SnFlex, {
      slots: { default: '<div>a</div><div>b</div>' },
    });
    expect(w.text()).toContain('a');
    expect(w.text()).toContain('b');
    expect(w.findAll('div')).toHaveLength(3);
  });

  it('resolves numeric gap to px on both axes', () => {
    const w = mount(SnFlex, { props: { gap: 16 } });
    const style = w.attributes('style') ?? '';
    expect(style).toMatch(/row-gap:\s*16px/);
    expect(style).toMatch(/column-gap:\s*16px/);
  });

  it('maps gap presets to --sn-web-space-gap-* tokens (8/12/16 fallbacks)', () => {
    const small = mount(SnFlex, { props: { gap: 'small' } });
    expect(small.attributes('style')).toMatch(
      /column-gap:\s*var\(--sn-web-space-gap-small,\s*8px\)/,
    );
    const large = mount(SnFlex, { props: { gap: 'large' } });
    expect(large.attributes('style')).toMatch(/row-gap:\s*var\(--sn-web-space-gap-large,\s*16px\)/);
  });

  it('maps [horizontal, vertical] tuple to column-gap / row-gap', () => {
    const w = mount(SnFlex, { props: { gap: [2, 16] } });
    const style = w.attributes('style') ?? '';
    expect(style).toMatch(/column-gap:\s*2px/);
    expect(style).toMatch(/row-gap:\s*16px/);
  });

  it('falls back to medium preset on invalid gap values', () => {
    const w = mount(SnFlex, { props: { gap: 'huge' as unknown as number } });
    expect(w.attributes('style')).toMatch(/row-gap:\s*var\(--sn-web-space-gap-medium,\s*12px\)/);
  });

  it('vertical stacks in a column and forces nowrap (n-flex semantics)', () => {
    const w = mount(SnFlex, { props: { vertical: true } });
    expect(w.classes()).toContain('sn-flex--vertical');
    const style = w.attributes('style') ?? '';
    expect(style).toMatch(/flex-direction:\s*column/);
    // n-flex: `!wrap || vertical` → nowrap, even with wrap=true.
    expect(style).toMatch(/flex-wrap:\s*nowrap/);
  });

  it('wrap=false forces nowrap on horizontal layout', () => {
    const w = mount(SnFlex, { props: { wrap: false } });
    expect(w.classes()).toContain('sn-flex--nowrap');
    expect(w.attributes('style')).toMatch(/flex-wrap:\s*nowrap/);
  });

  it('passes justify through without normalization (n-flex semantics)', () => {
    const start = mount(SnFlex, { props: { justify: 'start' } });
    expect(start.attributes('style')).toMatch(/justify-content:\s*start/);
    expect(start.attributes('style')).not.toMatch(/justify-content:\s*flex-start/);

    const end = mount(SnFlex, { props: { justify: 'end' } });
    expect(end.attributes('style')).toMatch(/justify-content:\s*end/);

    const evenly = mount(SnFlex, { props: { justify: 'space-evenly' } });
    expect(evenly.attributes('style')).toMatch(/justify-content:\s*space-evenly/);
  });

  it('applies align to align-items', () => {
    const w = mount(SnFlex, { props: { align: 'center' } });
    expect(w.attributes('style')).toMatch(/align-items:\s*center/);

    const baseline = mount(SnFlex, { props: { align: 'baseline' } });
    expect(baseline.attributes('style')).toMatch(/align-items:\s*baseline/);
  });

  it('renders as inline-flex when inline is true', () => {
    const w = mount(SnFlex, { props: { inline: true } });
    expect(w.classes()).toContain('sn-flex--inline');
    expect(w.attributes('style')).toMatch(/display:\s*inline-flex/);
  });

  it('marks expand on the container class (children grow via scoped CSS)', () => {
    const on = mount(SnFlex, { props: { expand: true } });
    expect(on.classes()).toContain('sn-flex--expand');

    const off = mount(SnFlex, { props: { expand: false } });
    expect(off.classes()).not.toContain('sn-flex--expand');
  });

  it('appends customClass and customStyle to the container', () => {
    const w = mount(SnFlex, {
      props: { customClass: 'my-row', customStyle: 'min-height: 64px' },
    });
    expect(w.classes()).toContain('my-row');
    expect(w.attributes('style')).toMatch(/min-height:\s*64px/);
  });
});
