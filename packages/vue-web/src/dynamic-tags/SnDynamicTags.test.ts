/**
 * SnDynamicTags unit tests — web-end dynamic tags (naive-ui parity).
 *
 * Behavior-focused (AGENTS.md §46): rendering, add flow (Enter / Esc /
 * blur), remove, max cap, closable, slots, disabled / readonly.
 */

import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { h, ref } from 'vue';
import SnDynamicTags from './SnDynamicTags.vue';

/** Mount helper — keeps tests focused on props. */
function mountTags(props: Record<string, unknown> = {}) {
  return mount(SnDynamicTags, { props });
}

/**
 * Mount with a live v-model so consecutive adds accumulate (the component
 * is controlled — modelValue must sync back for the second add to count).
 */
function mountVModel(initial: Array<string | number>, props: Record<string, unknown> = {}) {
  const value = ref<Array<string | number>>(initial);
  const wrapper = mount({
    setup() {
      return () =>
        h(SnDynamicTags, {
          ...props,
          modelValue: value.value,
          'onUpdate:modelValue': (v: Array<string | number>) => {
            value.value = v;
          },
        });
    },
  });
  return { wrapper: wrapper.findComponent(SnDynamicTags), value };
}

/** Open the inline input via the add trigger, then type a value. */
async function openAndType(wrapper: ReturnType<typeof mount>, text: string): Promise<void> {
  await wrapper.find('.sn-dynamic-tags__trigger').trigger('click');
  await wrapper.find('.sn-dynamic-tags__input').setValue(text);
}

describe('SnDynamicTags', () => {
  it('renders each tag from modelValue', () => {
    const wrapper = mountTags({ modelValue: ['a', 'b', 'c'] });
    const tags = wrapper.findAll('.sn-dynamic-tags__tag');
    expect(tags).toHaveLength(3);
    expect(tags[0]?.text()).toContain('a');
    expect(tags[2]?.text()).toContain('c');
  });

  it('renders the empty slot when there are no tags', () => {
    const wrapper = mount(SnDynamicTags, {
      props: { modelValue: [] },
      slots: { empty: '<i data-testid="empty">nothing</i>' },
    });
    expect(wrapper.find('[data-testid="empty"]').exists()).toBe(true);
    expect(wrapper.find('.sn-dynamic-tags__tag').exists()).toBe(false);
  });

  it('shows an add trigger with a + glyph by default', () => {
    const wrapper = mountTags();
    const trigger = wrapper.find('.sn-dynamic-tags__trigger');
    expect(trigger.exists()).toBe(true);
    expect(trigger.find('svg').exists()).toBe(true);
  });

  it('opens the inline input when the trigger is clicked', async () => {
    const wrapper = mountTags();
    await wrapper.find('.sn-dynamic-tags__trigger').trigger('click');
    expect(wrapper.find('.sn-dynamic-tags__input').exists()).toBe(true);
    expect(wrapper.find('.sn-dynamic-tags__trigger').exists()).toBe(false);
  });

  it('adds a tag on Enter and emits add / change / update:modelValue', async () => {
    const wrapper = mountTags();
    await openAndType(wrapper, 'new-tag');
    await wrapper.find('.sn-dynamic-tags__input').trigger('keydown', { key: 'Enter' });
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['new-tag']]);
    expect(wrapper.emitted('change')?.at(-1)).toEqual([['new-tag']]);
    expect(wrapper.emitted('add')?.at(-1)).toEqual(['new-tag']);
  });

  it('keeps the input open for continued entry after Enter', async () => {
    const { wrapper, value } = mountVModel([]);
    await openAndType(wrapper, 'one');
    await wrapper.find('.sn-dynamic-tags__input').trigger('keydown', { key: 'Enter' });
    expect(value.value).toEqual(['one']);
    expect(wrapper.find('.sn-dynamic-tags__input').exists()).toBe(true);
    await wrapper.find('.sn-dynamic-tags__input').setValue('two');
    await wrapper.find('.sn-dynamic-tags__input').trigger('keydown', { key: 'Enter' });
    expect(value.value).toEqual(['one', 'two']);
  });

  it('trims input and rejects empty commits on Enter', async () => {
    const wrapper = mountTags({ modelValue: ['a'] });
    await openAndType(wrapper, '  spaced  ');
    await wrapper.find('.sn-dynamic-tags__input').trigger('keydown', { key: 'Enter' });
    expect(wrapper.emitted('add')?.at(-1)).toEqual(['spaced']);

    // After Enter the input stays open (trigger hidden) — type into it directly.
    await wrapper.find('.sn-dynamic-tags__input').setValue('   ');
    await wrapper.find('.sn-dynamic-tags__input').trigger('keydown', { key: 'Enter' });
    expect(wrapper.emitted('add')).toHaveLength(1);
    // Empty Enter closes the input without emitting.
    expect(wrapper.find('.sn-dynamic-tags__input').exists()).toBe(false);
  });

  it('cancels and discards the text on Escape', async () => {
    const wrapper = mountTags();
    await openAndType(wrapper, 'draft');
    await wrapper.find('.sn-dynamic-tags__input').trigger('keydown', { key: 'Escape' });
    expect(wrapper.emitted('add')).toBeUndefined();
    expect(wrapper.find('.sn-dynamic-tags__input').exists()).toBe(false);
    expect(wrapper.find('.sn-dynamic-tags__trigger').exists()).toBe(true);
  });

  it('commits the in-flight text on blur (naive blur-submit)', async () => {
    const wrapper = mountTags();
    await openAndType(wrapper, 'blurred');
    await wrapper.find('.sn-dynamic-tags__input').trigger('blur');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['blurred']]);
    expect(wrapper.emitted('add')?.at(-1)).toEqual(['blurred']);
    // Blur closes the input (unlike Enter).
    expect(wrapper.find('.sn-dynamic-tags__input').exists()).toBe(false);
  });

  it('closes the input on blur with empty text', async () => {
    const wrapper = mountTags();
    await wrapper.find('.sn-dynamic-tags__trigger').trigger('click');
    await wrapper.find('.sn-dynamic-tags__input').trigger('blur');
    expect(wrapper.emitted('add')).toBeUndefined();
    expect(wrapper.find('.sn-dynamic-tags__trigger').exists()).toBe(true);
  });

  it('forwards the placeholder to the inline input', async () => {
    const wrapper = mountTags({ placeholder: '请输入' });
    await wrapper.find('.sn-dynamic-tags__trigger').trigger('click');
    expect(wrapper.find('.sn-dynamic-tags__input').attributes('placeholder')).toBe('请输入');
  });

  it('removes a tag via the × button and emits remove', async () => {
    const wrapper = mountTags({ modelValue: ['a', 'b'] });
    await wrapper.findAll('.sn-dynamic-tags__close')[0]!.trigger('click');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['b']]);
    expect(wrapper.emitted('change')?.at(-1)).toEqual([['b']]);
    expect(wrapper.emitted('remove')?.at(-1)).toEqual(['a']);
  });

  it('emits click with the tag value when a tag is clicked', async () => {
    const wrapper = mountTags({ modelValue: ['a'] });
    await wrapper.find('.sn-dynamic-tags__tag').trigger('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
    expect(wrapper.emitted('click')?.[0]?.[0]).toBe('a');
  });

  it('hides the add trigger at the max cap', () => {
    const wrapper = mountTags({ modelValue: ['a', 'b', 'c'], max: 3 });
    expect(wrapper.find('.sn-dynamic-tags__trigger').exists()).toBe(false);
  });

  it('closes the input after an Enter commit that reaches max', async () => {
    const { wrapper, value } = mountVModel(['a'], { max: 2 });
    await openAndType(wrapper, 'b');
    await wrapper.find('.sn-dynamic-tags__input').trigger('keydown', { key: 'Enter' });
    expect(value.value).toEqual(['a', 'b']);
    expect(wrapper.find('.sn-dynamic-tags__input').exists()).toBe(false);
  });

  it('hides the × close buttons when closable is false', () => {
    const wrapper = mountTags({ modelValue: ['a'], closable: false });
    expect(wrapper.find('.sn-dynamic-tags__close').exists()).toBe(false);
    expect(wrapper.find('.sn-dynamic-tags__tag').text()).toContain('a');
  });

  it('renders no add trigger and no close buttons when disabled', async () => {
    const wrapper = mountTags({ modelValue: ['a'], disabled: true });
    expect(wrapper.find('.sn-dynamic-tags__trigger').exists()).toBe(false);
    expect(wrapper.find('.sn-dynamic-tags__close').exists()).toBe(false);
    expect(wrapper.classes()).toContain('sn-dynamic-tags--disabled');
  });

  it('renders no add trigger when readonly', () => {
    const wrapper = mountTags({ modelValue: ['a'], readonly: true });
    expect(wrapper.find('.sn-dynamic-tags__trigger').exists()).toBe(false);
    expect(wrapper.classes()).toContain('sn-dynamic-tags--readonly');
  });

  it('applies the size class', () => {
    expect(mountTags({ size: 'large' }).classes()).toContain('sn-dynamic-tags--large');
    expect(mountTags({ size: 'small' }).classes()).toContain('sn-dynamic-tags--small');
  });

  it('opens the input from a root click when trigger is focus', async () => {
    const wrapper = mountTags({ modelValue: ['a'], trigger: 'focus' });
    await wrapper.find('.sn-dynamic-tags').trigger('click');
    expect(wrapper.find('.sn-dynamic-tags__input').exists()).toBe(true);
  });

  it('does not open the input from a root click when trigger is click', async () => {
    const wrapper = mountTags({ modelValue: ['a'], trigger: 'click' });
    await wrapper.find('.sn-dynamic-tags').trigger('click');
    expect(wrapper.find('.sn-dynamic-tags__input').exists()).toBe(false);
  });

  it('renders the scoped tag slot with label and index', () => {
    const wrapper = mount(SnDynamicTags, {
      props: { modelValue: ['x', 'y'] },
      slots: {
        tag: `<template #tag="{ label, index }">
          <i data-testid="custom-tag">{{ index }}:{{ label }}</i>
        </template>`,
      },
    });
    const tags = wrapper.findAll('[data-testid="custom-tag"]');
    expect(tags).toHaveLength(2);
    expect(tags[0]?.text()).toBe('0:x');
    expect(tags[1]?.text()).toBe('1:y');
  });

  it('renders the custom trigger slot', () => {
    const wrapper = mount(SnDynamicTags, {
      props: { modelValue: [] },
      slots: { trigger: '<i data-testid="custom-trigger">添加</i>' },
    });
    expect(wrapper.find('[data-testid="custom-trigger"]').exists()).toBe(true);
    expect(wrapper.find('.sn-dynamic-tags__trigger svg').exists()).toBe(false);
  });

  it('renders the custom input slot and commits through its confirm callback', async () => {
    const wrapper = mount(SnDynamicTags, {
      props: { modelValue: [] },
      slots: {
        input: `<template #input="{ value, placeholder, confirm, setValue }">
          <input
            data-testid="custom-input"
            :value="value"
            :placeholder="placeholder"
            @input="setValue($event.target.value)"
            @keydown.enter="confirm"
          >
        </template>`,
      },
    });
    await wrapper.find('.sn-dynamic-tags__trigger').trigger('click');
    expect(wrapper.find('[data-testid="custom-input"]').exists()).toBe(true);
    await wrapper.find('[data-testid="custom-input"]').setValue('via-slot');
    await wrapper.find('[data-testid="custom-input"]').trigger('keydown', { key: 'Enter' });
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['via-slot']]);
  });

  it('supports number tag values end to end', async () => {
    const wrapper = mountTags({ modelValue: [1, 2] });
    expect(wrapper.findAll('.sn-dynamic-tags__tag')).toHaveLength(2);
    await wrapper.findAll('.sn-dynamic-tags__close')[0]!.trigger('click');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[2]]);
    expect(wrapper.emitted('remove')?.at(-1)).toEqual([1]);
  });
});
