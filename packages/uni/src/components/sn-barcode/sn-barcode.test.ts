import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import SnBarcode from './sn-barcode.vue';

describe('SnBarcode', () => {
  it('should render bar runs for a valid EAN-13', () => {
    const wrapper = mount(SnBarcode, { props: { text: '590123412345' } });
    expect(wrapper.findAll('.sn-barcode__bars view').length).toBeGreaterThan(10);
    expect(wrapper.text()).toContain('5901234123457');
  });

  it('should emit rendered with the display text', async () => {
    const wrapper = mount(SnBarcode, { props: { text: '590123412345' } });
    await wrapper.vm.$nextTick();
    const rendered = wrapper.emitted('rendered');
    expect(rendered).toHaveLength(1);
  });

  it('should emit error and render the failure note for invalid input', async () => {
    const wrapper = mount(SnBarcode, { props: { text: '12345' } });
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('error')).toHaveLength(1);
    expect(wrapper.find('.sn-barcode__bars').exists()).toBe(false);
    expect(wrapper.text()).toContain('EAN-13');
  });

  it('should render CODE128 text and emit the display text', async () => {
    const wrapper = mount(SnBarcode, { props: { text: 'HELLO123', format: 'CODE128' } });
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.sn-barcode__bars').exists()).toBe(true);
    const rendered = wrapper.emitted('rendered');
    expect((rendered![0] as unknown[])[0]).toMatchObject({ displayText: 'HELLO123' });
  });

  it('should render every supported format without errors', async () => {
    const cases: Array<[string, string]> = [
      ['CODE39', 'HELLO1'],
      ['EAN13', '590123412345'],
      ['EAN8', '9638507'],
      ['UPC', '03600029145'],
      ['CODEBAR', 'A123456789B'],
      ['ITF', '12345678'],
    ];
    for (const [format, text] of cases) {
      const wrapper = mount(SnBarcode, { props: { text, format } });
      await wrapper.vm.$nextTick();
      expect(wrapper.find('.sn-barcode__bars').exists(), `${format}`).toBe(true);
      expect(wrapper.emitted('error'), `${format}`).toBeUndefined();
    }
  });

  it('should emit a per-format error for empty text', async () => {
    const wrapper = mount(SnBarcode, { props: { text: '', format: 'ITF' } });
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('error')![0]).toEqual([
      { code: 'BARCODE_TEXT_INVALID', message: 'ITF 需要偶数位数字' },
    ]);
  });
});

describe('SnBarcode events', () => {
  it('should emit rendered with the run sequence and the check-digit-completed display text', () => {
    const wrapper = mount(SnBarcode, { props: { text: '590123412345' } });
    const payload = (wrapper.emitted('rendered')![0] as unknown[])[0] as {
      runs: { modules: number; bar: boolean }[];
      displayText: string;
    };
    expect(payload.displayText).toBe('5901234123457');
    expect(payload.runs.length).toBeGreaterThan(1);
    expect(payload.runs.reduce((sum, run) => sum + run.modules, 0)).toBe(95);
  });

  it('should emit the exact invalid-text error payload', async () => {
    const wrapper = mount(SnBarcode, { props: { text: 'abc' } });
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('error')![0]).toEqual([
      { code: 'BARCODE_TEXT_INVALID', message: 'EAN-13 需要 12 或 13 位数字' },
    ]);
  });

  it('should emit the checksum error payload for a mismatched 13-digit input', async () => {
    const wrapper = mount(SnBarcode, { props: { text: '5901234123458' } });
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('error')![0]).toEqual([
      { code: 'BARCODE_CHECKSUM_INVALID', message: '校验位与内容不匹配' },
    ]);
  });

  it('should emit an error on mount when the default empty text is used', () => {
    const wrapper = mount(SnBarcode);
    expect(wrapper.emitted('error')).toHaveLength(1);
    expect(wrapper.find('.sn-barcode__bars').exists()).toBe(false);
  });

  it('should re-encode and emit rendered again when the text changes', async () => {
    const wrapper = mount(SnBarcode, { props: { text: '590123412345' } });
    await wrapper.setProps({ text: '400638133393' });
    const rendered = wrapper.emitted('rendered')!;
    expect(rendered).toHaveLength(2);
    expect((rendered[1] as unknown[])[0]).toMatchObject({ displayText: '4006381333931' });
  });
});

describe('SnBarcode rendering contract', () => {
  it('should expose the barcode as an image to assistive tech', () => {
    const wrapper = mount(SnBarcode, { props: { text: '590123412345' } });
    expect(wrapper.attributes('role')).toBe('img');
    expect(wrapper.attributes('aria-label')).toBe('barcode');
  });

  it('should trim surrounding whitespace before encoding', () => {
    const wrapper = mount(SnBarcode, { props: { text: '  590123412345  ' } });
    expect(wrapper.find('.sn-barcode__bars').exists()).toBe(true);
    expect(wrapper.text()).toContain('5901234123457');
  });

  it('should hide the caption when showText is false', () => {
    const wrapper = mount(SnBarcode, { props: { text: '590123412345', showText: false } });
    expect(wrapper.find('.sn-barcode__text').exists()).toBe(false);
    expect(wrapper.find('.sn-barcode__bars').exists()).toBe(true);
  });

  it('should place the caption above the bars with textPosition="top"', () => {
    const wrapper = mount(SnBarcode, { props: { text: '590123412345', textPosition: 'top' } });
    const children = Array.from(wrapper.element.children);
    expect(children[0]?.className).toContain('sn-barcode__text');
    expect(children[1]?.className).toContain('sn-barcode__bars');
  });

  it('should place the caption below the bars by default', () => {
    const wrapper = mount(SnBarcode, { props: { text: '590123412345' } });
    const children = Array.from(wrapper.element.children);
    expect(children[0]?.className).toContain('sn-barcode__bars');
    expect(children[1]?.className).toContain('sn-barcode__text');
  });

  it('should render no caption while the encode failed (no display text exists)', async () => {
    const wrapper = mount(SnBarcode, { props: { text: 'nope' } });
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.sn-barcode__text').exists()).toBe(false);
    expect(wrapper.find('.sn-barcode__empty').exists()).toBe(true);
    expect(wrapper.find('.sn-barcode__empty').text()).toContain('EAN-13 需要 12 或 13 位数字');
  });

  it('should scale each run width by its module count (proportional bar widths)', () => {
    const wrapper = mount(SnBarcode, {
      props: { text: '590123412345', moduleWidth: 3 },
    });
    const bars = wrapper.findAll('.sn-barcode__bars view');
    // EAN-13 首组游程为 101 警戒条：1-1-1 模块。
    expect(bars[0]?.attributes('style')).toContain('width: 3px');
    // 后续存在多模块游程（数字 L 码 0001101 → 游程 1,2,1,1,3 等）。
    const widths = bars.map((b) =>
      Number((b.attributes('style') ?? '').match(/width: (\d+)px/)?.[1]),
    );
    expect(Math.max(...widths)).toBeGreaterThan(3);

    const subPixel = mount(SnBarcode, {
      props: { text: '590123412345', moduleWidth: 0.4 },
    });
    expect(subPixel.findAll('.sn-barcode__bars view')[0]?.attributes('style')).toContain(
      'width: 1px',
    );
  });

  it('should render the full module count across all run widths', () => {
    const wrapper = mount(SnBarcode, { props: { text: '590123412345', moduleWidth: 1 } });
    const bars = wrapper.findAll('.sn-barcode__bars view');
    const widths = bars.map((b) =>
      Number((b.attributes('style') ?? '').match(/width: (\d+)px/)?.[1]),
    );
    // 模块总数 = 各游程宽度之和（moduleWidth=1）。
    expect(widths.reduce((a, b) => a + b, 0)).toBe(95);
  });

  it('should forward height and lineColor into the bar style', () => {
    const wrapper = mount(SnBarcode, {
      props: { text: '590123412345', height: '40px', lineColor: '#112233' },
    });
    const bars = wrapper.findAll('.sn-barcode__bars view');
    expect(bars[0]?.attributes('style')).toContain('height: 40px');
    const firstColored = bars.find((b) => (b.attributes('style') ?? '').includes('background'));
    expect(firstColored?.attributes('style')).toContain('background-color: #112233');
    // Spacer runs stay transparent so the light modules remain light.
    const firstSpacer = bars.find((b) => !(b.attributes('style') ?? '').includes('background'));
    expect(firstSpacer?.attributes('style')).not.toContain('background-color');
  });

  it('should forward fontSize and lineColor into the caption style', () => {
    const wrapper = mount(SnBarcode, {
      props: { text: '590123412345', fontSize: '10px', lineColor: '#112233' },
    });
    const style = wrapper.find('.sn-barcode__text').attributes('style');
    expect(style).toContain('font-size: 10px');
    expect(style).toContain('color: #112233');
  });

  it('should forward customClass and customStyle to the root', () => {
    const wrapper = mount(SnBarcode, {
      props: { text: '590123412345', customClass: 'my-barcode', customStyle: 'padding: 4px' },
    });
    expect(wrapper.classes()).toContain('my-barcode');
    expect(wrapper.attributes('style')).toContain('padding: 4px');
  });
});
