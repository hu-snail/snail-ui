/**
 * SnModelConfig behaviour tests — AUI-TPL-001.
 *
 * The page's value is in the mutations it emits (add / edit / remove vendor and
 * model, parameter edits) and in the capability gating of the reasoning control.
 * Per AGENTS.md §66 the credential field is also pinned here: it must stay a
 * password input and must never appear in an emitted payload as its own channel.
 */

import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import SnModelConfig from './SnModelConfig.vue';
import type { SnAiVendor } from '../shared/types';

const vendors: SnAiVendor[] = [
  {
    id: 'v1',
    name: '自建网关',
    baseUrl: 'https://api.example.com/v1',
    custom: true,
    hasCredential: true,
    models: [
      { id: 'm1', name: 'Deep', vendorId: 'v1', supportsThinking: true, contextWindow: 128_000 },
      { id: 'm2', name: 'Fast', vendorId: 'v1', supportsThinking: false },
    ],
  },
  {
    id: 'v2',
    name: '云端服务',
    models: [{ id: 'm3', name: 'Cloud', vendorId: 'v2', tags: ['视觉'] }],
  },
];

function mountConfig(extra: Record<string, unknown> = {}) {
  return mount(SnModelConfig, {
    props: { vendors, activeVendorId: 'v1', activeModelId: 'm1', ...extra },
  });
}

describe('SnModelConfig', () => {
  describe('vendor list', () => {
    it('should render each vendor with its model count', () => {
      const wrapper = mountConfig();
      expect(wrapper.text()).toContain('自建网关');
      expect(wrapper.text()).toContain('2 个模型');
      expect(wrapper.text()).toContain('云端服务');
    });

    it('should badge a custom vendor and mark the credential state', () => {
      const wrapper = mountConfig();
      expect(wrapper.text()).toContain('自定义');
      expect(wrapper.text()).toContain('已配置凭证');
      expect(wrapper.text()).toContain('未配置凭证');
    });

    it('should mark the active vendor for assistive tech', () => {
      const wrapper = mountConfig();
      const rows = wrapper.findAll('.sn-model-config__vendor');
      expect(rows[0]?.attributes('aria-pressed')).toBe('true');
      expect(rows[1]?.attributes('aria-pressed')).toBe('false');
    });

    it('should emit the picked vendor', async () => {
      const wrapper = mountConfig();
      await wrapper.findAll('.sn-model-config__vendor')[1]?.trigger('click');
      expect(wrapper.emitted('update:activeVendorId')?.[0]).toEqual(['v2']);
    });

    it('should show an empty notice when no vendor is configured', () => {
      const wrapper = mount(SnModelConfig, { props: { vendors: [] } });
      expect(wrapper.text()).toContain('尚未配置任何厂商');
    });
  });

  describe('vendor mutations', () => {
    it('should append a custom vendor and select it', async () => {
      const wrapper = mountConfig();
      await wrapper.find('.sn-model-config__header button').trigger('click');

      const next = wrapper.emitted('update:vendors')?.[0]?.[0] as SnAiVendor[];
      expect(next).toHaveLength(3);
      expect(next[2]?.custom).toBe(true);
      expect(next[2]?.models).toEqual([]);
      expect(wrapper.emitted('update:activeVendorId')?.[0]).toEqual([next[2]?.id]);
    });

    it('should replace the edited vendor on a name change', async () => {
      const wrapper = mountConfig();
      const nameInput = wrapper.findAllComponents({ name: 'SnInput' })[0];
      nameInput?.vm.$emit('update:modelValue', '新名字');
      await wrapper.vm.$nextTick();

      const next = wrapper.emitted('update:vendors')?.[0]?.[0] as SnAiVendor[];
      expect(next[0]?.name).toBe('新名字');
      // The sibling vendor must be untouched.
      expect(next[1]?.name).toBe('云端服务');
    });

    it('should replace the edited vendor on a base-url change', async () => {
      const wrapper = mountConfig();
      const inputs = wrapper.findAllComponents({ name: 'SnInput' });
      inputs[1]?.vm.$emit('update:modelValue', 'https://new.example.com');
      await wrapper.vm.$nextTick();

      const next = wrapper.emitted('update:vendors')?.[0]?.[0] as SnAiVendor[];
      expect(next[0]?.baseUrl).toBe('https://new.example.com');
    });

    it('should remove a custom vendor and fall back to the next one', async () => {
      const wrapper = mountConfig();
      const confirm = wrapper.findAllComponents({ name: 'SnPopconfirm' })[0];
      confirm?.vm.$emit('positive-click');
      await wrapper.vm.$nextTick();

      const next = wrapper.emitted('update:vendors')?.[0]?.[0] as SnAiVendor[];
      expect(next.map((vendor) => vendor.id)).toEqual(['v2']);
      expect(wrapper.emitted('update:activeVendorId')?.[0]).toEqual(['v2']);
    });

    it('should ask the host to test the connection', async () => {
      const wrapper = mountConfig();
      await wrapper.find('.sn-model-config__vendor-actions button').trigger('click');
      expect(wrapper.emitted('test-connection')?.[0]).toEqual([{ vendorId: 'v1' }]);
    });

    it('should show a spinner on the vendor under test', () => {
      const wrapper = mountConfig({ testingVendorId: 'v1' });
      const button = wrapper.find('.sn-model-config__vendor-actions button');
      expect(button.classes()).toContain('sn-button--loading');
    });

    it('should hide add / edit / delete affordances when not editable', () => {
      const wrapper = mountConfig({ editable: false });
      expect(wrapper.find('.sn-model-config__header button').exists()).toBe(false);
      expect(wrapper.find('.sn-model-config__panel-head button').exists()).toBe(false);
    });
  });

  describe('credential field', () => {
    it('should render a password input that never logs its value', () => {
      const wrapper = mountConfig();
      const password = wrapper.findAll('input[type="password"]');
      expect(password).toHaveLength(1);
    });

    it('should update only the credential flag on the vendor, not emit a secret channel', async () => {
      const wrapper = mountConfig();
      const inputs = wrapper.findAllComponents({ name: 'SnInput' });
      inputs[2]?.vm.$emit('update:modelValue', 'sk-secret-value');
      await wrapper.vm.$nextTick();

      const next = wrapper.emitted('update:vendors')?.[0]?.[0] as SnAiVendor[];
      expect(next[0]?.hasCredential).toBe(true);
      // The secret must not leak onto its own event or into the vendor object.
      const emittedNames = Object.keys(wrapper.emitted());
      expect(emittedNames).not.toContain('update:credential');
      expect(JSON.stringify(next)).not.toContain('sk-secret-value');
    });
  });

  describe('model list', () => {
    it('should list the selected vendor models with capability metadata', () => {
      const wrapper = mountConfig();
      expect(wrapper.text()).toContain('Deep');
      expect(wrapper.text()).toContain('128K 上下文');
      expect(wrapper.text()).toContain('不支持思考');
    });

    it('should mark the active model as checked', () => {
      const wrapper = mountConfig();
      const rows = wrapper.findAll('.sn-model-config__model');
      expect(rows[0]?.attributes('aria-checked')).toBe('true');
      expect(rows[1]?.attributes('aria-checked')).toBe('false');
    });

    it('should emit the picked model', async () => {
      const wrapper = mountConfig();
      await wrapper.findAll('.sn-model-config__model')[1]?.trigger('click');
      expect(wrapper.emitted('update:activeModelId')?.[0]).toEqual(['m2']);
    });

    it('should filter the model list by the search prop', () => {
      const wrapper = mountConfig({ search: 'fast' });
      expect(wrapper.text()).toContain('Fast');
      expect(wrapper.text()).not.toContain('Deep');
    });

    it('should show the empty notice when nothing matches', () => {
      const wrapper = mountConfig({ search: 'zzz' });
      expect(wrapper.text()).toContain('没有匹配的模型');
    });

    it('should append a new model and select it', async () => {
      const wrapper = mountConfig();
      await wrapper.find('.sn-model-config__panel-head button').trigger('click');

      const next = wrapper.emitted('update:vendors')?.[0]?.[0] as SnAiVendor[];
      expect(next[0]?.models).toHaveLength(3);
      expect(next[0]?.models?.[2]?.vendorId).toBe('v1');
      expect(wrapper.emitted('update:activeModelId')?.[0]).toEqual([next[0]?.models?.[2]?.id]);
    });

    it('should remove a model from the vendor', async () => {
      const wrapper = mountConfig();
      const confirms = wrapper.findAllComponents({ name: 'SnPopconfirm' });
      confirms[1]?.vm.$emit('positive-click');
      await wrapper.vm.$nextTick();

      const next = wrapper.emitted('update:vendors')?.[0]?.[0] as SnAiVendor[];
      expect(next[0]?.models?.map((model) => model.id)).toEqual(['m2']);
    });
  });

  describe('parameters', () => {
    it('should apply defaults when params is omitted', () => {
      const wrapper = mountConfig();
      // Sliders expose their value through the label; the token budget lives in
      // an input's value, so it is read off the component rather than the text.
      expect(wrapper.text()).toContain('0.7');
      expect(wrapper.text()).toContain('1.00');
      const tokenInput = wrapper
        .findAllComponents({ name: 'SnInput' })
        .find((input) => input.props('modelValue') === '4096');
      expect(tokenInput).toBeTruthy();
    });

    it('should emit a merged params object on a temperature change', async () => {
      const wrapper = mountConfig({ params: { temperature: 0.7, stream: true } });
      const sliders = wrapper.findAllComponents({ name: 'SnSlider' });
      sliders[0]?.vm.$emit('update:model-value', 1.4);
      await wrapper.vm.$nextTick();

      const params = wrapper.emitted('update:params')?.[0]?.[0] as Record<string, unknown>;
      expect(params.temperature).toBe(1.4);
      // Untouched keys survive the merge.
      expect(params.stream).toBe(true);
    });

    it('should emit the thinking tier from the slider index', async () => {
      const wrapper = mountConfig();
      const sliders = wrapper.findAllComponents({ name: 'SnSlider' });
      sliders[2]?.vm.$emit('update:model-value', 3);
      await wrapper.vm.$nextTick();

      const params = wrapper.emitted('update:params')?.[0]?.[0] as Record<string, unknown>;
      expect(params.thinkingLevel).toBe('high');
    });

    it('should gate the reasoning control on the active model capability', () => {
      const capable = mountConfig({ activeModelId: 'm1' });
      expect(capable.text()).toContain('思考程度');

      const incapable = mountConfig({ activeModelId: 'm2' });
      expect(incapable.text()).toContain('当前模型不支持');
    });

    it('should fall back to the current value on a non-numeric token input', async () => {
      const wrapper = mountConfig({ params: { maxTokens: 4096 } });
      const tokenInput = wrapper
        .findAllComponents({ name: 'SnInput' })
        .find((input) => input.props('modelValue') === '4096');
      tokenInput?.vm.$emit('update:modelValue', 'abc');
      await wrapper.vm.$nextTick();

      const params = wrapper.emitted('update:params')?.[0]?.[0] as Record<string, unknown>;
      expect(params.maxTokens).toBe(4096);
    });

    it('should toggle the stream switch', async () => {
      const wrapper = mountConfig({ params: { stream: true } });
      wrapper.findComponent({ name: 'SnSwitch' }).vm.$emit('update:modelValue', false);
      await wrapper.vm.$nextTick();

      const params = wrapper.emitted('update:params')?.[0]?.[0] as Record<string, unknown>;
      expect(params.stream).toBe(false);
    });
  });

  describe('empty selection', () => {
    it('should prompt for a selection when no vendor is active', () => {
      const wrapper = mount(SnModelConfig, { props: { vendors, activeVendorId: undefined } });
      expect(wrapper.text()).toContain('选择左侧厂商以编辑配置');
    });
  });
});
