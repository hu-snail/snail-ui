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

  it('should emit error for an unimplemented format instead of wrong output', async () => {
    const wrapper = mount(SnBarcode, { props: { text: '590123412345', format: 'CODE128' } });
    await wrapper.vm.$nextTick();
    const errors = wrapper.emitted('error');
    expect(errors).toHaveLength(1);
    expect((errors![0] as unknown[])[0]).toMatchObject({ code: 'BARCODE_FORMAT_UNSUPPORTED' });
  });
});
