/**
 * sn-form / sn-form-item unit tests — uni-end form (AUI-MP-004).
 *
 * Mirror of packages/vue-web/src/form/SnForm.test.ts. Same coverage.
 *
 * Untestable via the public API:
 *   - sn-form-item.vue 234-235 (`statusGlyph` warning / empty branches) — the
 *     status state machine only ever produces 'default' | 'error' today; the
 *     'warning' state is part of the shared `FormItemState` contract for
 *     forward compatibility and no producer assigns it yet. The empty-glyph
 *     branch is guarded by `showStatusIcon && statusGlyph !== ''`, which can
 *     only evaluate once a message exists — and a message only exists with
 *     status 'error'.
 *   - sn-form-validator.ts 85-86 (`matchesType` exhaustive fallback) — the
 *     `type` discriminator is a closed 4-value union; every member returns
 *     before the trailing `return true`.
 */

import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, reactive, ref } from 'vue';
import SnForm from './sn-form.vue';
import SnFormItem from './sn-form-item.vue';
import SnInput from '../sn-input/sn-input.vue';
import SnButton from '../sn-button/sn-button.vue';
import type { FormRule } from './sn-form-types';

const App = defineComponent({
  props: ['model', 'rules', 'required'],
  setup(props) {
    const formRef = ref<InstanceType<typeof SnForm> | null>(null);
    return () =>
      h(
        SnForm,
        {
          ref: formRef,
          model: props.model,
          rules: props.rules,
        },
        {
          default: () => [
            h(
              SnFormItem,
              { prop: 'email', label: 'Email', required: props.required },
              {
                default: () =>
                  h(SnInput, {
                    modelValue: props.model.email,
                    'onUpdate:modelValue': (v: string) => {
                      props.model.email = v;
                    },
                  }),
              },
            ),
            h(
              SnFormItem,
              { prop: 'password', label: 'Password' },
              {
                default: () =>
                  h(SnInput, {
                    modelValue: props.model.password,
                    'onUpdate:modelValue': (v: string) => {
                      props.model.password = v;
                    },
                  }),
              },
            ),
            h(SnButton, {}, { default: () => 'Submit' }),
          ],
        },
      );
  },
});

describe('sn-form', () => {
  it('renders the slot content', () => {
    const model = reactive({ email: '', password: '' });
    const wrapper = mount(App, { props: { model, rules: {} } });
    expect(wrapper.find('.sn-form').exists()).toBe(true);
    expect(wrapper.findAll('.sn-form-item')).toHaveLength(2);
  });

  it('validates all fields and returns false when one fails', async () => {
    const model = reactive({ email: '', password: '' });
    const rules = {
      email: [{ required: true, message: 'Email required' } as FormRule],
      password: [{ minLength: 6, message: 'Min 6 chars' } as FormRule],
    };
    const wrapper = mount(App, { props: { model, rules } });
    const form = wrapper.findComponent(SnForm);
    const result = await form.vm.validate();
    expect(result).toBe(false);
  });

  it('returns true when every field passes', async () => {
    const model = reactive({ email: 'a@b.com', password: '123456' });
    const rules = {
      email: [
        { required: true, message: 'Email required' } as FormRule,
        { type: 'email' as const, message: 'Bad email' },
      ],
      password: [{ minLength: 6, message: 'Min 6' } as FormRule],
    };
    const wrapper = mount(App, { props: { model, rules } });
    const result = await wrapper.findComponent(SnForm).vm.validate();
    expect(result).toBe(true);
  });

  it('validateField targets a single prop', async () => {
    const model = reactive({ email: '', password: '' });
    const rules = {
      email: [{ required: true, message: 'Email required' } as FormRule],
      password: [{ required: true, message: 'Password required' } as FormRule],
    };
    const wrapper = mount(App, { props: { model, rules } });
    const ok = await wrapper.findComponent(SnForm).vm.validateField('email');
    expect(ok).toBe(false);
    const items = wrapper.findAllComponents(SnFormItem);
    expect(items[0]!.attributes('data-status')).toBe('error');
    expect(items[1]!.attributes('data-status')).toBe('default');
  });

  it('resetFields restores the initial model values', async () => {
    const model = reactive({ email: 'init@x.com', password: 'init-pw' });
    const wrapper = mount(App, { props: { model, rules: {} } });
    model.email = 'changed@x.com';
    wrapper.findComponent(SnForm).vm.resetFields();
    expect(model.email).toBe('init@x.com');
  });

  it('clearValidate clears messages without resetting values', async () => {
    const model = reactive({ email: '', password: '' });
    const rules = {
      email: [{ required: true, message: 'Email required' } as FormRule],
    };
    const wrapper = mount(App, { props: { model, rules } });
    await wrapper.findComponent(SnForm).vm.validate();
    expect(wrapper.findAll('.sn-form-item__message').length).toBeGreaterThan(0);
    wrapper.findComponent(SnForm).vm.clearValidate();
    await nextTick();
    expect(wrapper.findAll('.sn-form-item__message')).toHaveLength(0);
    expect(model.email).toBe('');
  });

  it('supports async validator', async () => {
    const model = reactive({ email: 'a@b.com', password: '' });
    const rules = {
      email: [
        {
          asyncValidator: async (_v: string) => false,
          message: 'async-fail',
        } as FormRule,
      ],
    };
    const wrapper = mount(App, { props: { model, rules } });
    const ok = await wrapper.findComponent(SnForm).vm.validate();
    expect(ok).toBe(false);
  });

  it('shows required asterisk on FormItem', () => {
    const model = reactive({ email: '', password: '' });
    const wrapper = mount(App, { props: { model, rules: {}, required: true } });
    expect(wrapper.find('.sn-form-item__required').exists()).toBe(true);
  });

  it('applies labelWidth via the grid template columns', () => {
    const model = reactive({ email: '', password: '' });
    const FormHost = defineComponent({
      setup() {
        return () =>
          h(
            SnForm,
            { model, labelWidth: 160 },
            {
              default: () => h(SnFormItem, { prop: 'email' }),
            },
          );
      },
    });
    const wrapper = mount(FormHost);
    const style = wrapper.find('.sn-form-item').attributes('style') ?? '';
    expect(style).toContain('grid-template-columns');
    expect(style).toContain('160rpx');
  });

  it('renders inline label icon when iconData prop is provided', () => {
    const Heart = Object.freeze({
      viewBox: '0 0 24 24',
      paths: ['M19 14 L12 21 L5 14'],
    });
    const model = reactive({ email: '', password: '' });
    const FormHost = defineComponent({
      setup() {
        return () =>
          h(
            SnForm,
            { model },
            {
              default: () => h(SnFormItem, { prop: 'email', label: 'Email', iconData: Heart }),
            },
          );
      },
    });
    const wrapper = mount(FormHost);
    expect(wrapper.find('.sn-form-item__icon').exists()).toBe(true);
    expect(wrapper.find('.sn-form-item').classes()).toContain('sn-form-item--with-icon');
  });

  /* ── wot-ui `wd-form` 1:1 parity ─────────────────────────────────────── */

  it('applies size class on the form root', () => {
    const model = reactive({ email: '' });
    const FormHost = defineComponent({
      setup() {
        return () => h(SnForm, { model, size: 'large' });
      },
    });
    const wrapper = mount(FormHost);
    expect(wrapper.find('.sn-form').classes()).toContain('sn-form--size-large');
  });

  it('applies value-align on the form root', () => {
    const model = reactive({ email: '' });
    const FormHost = defineComponent({
      setup() {
        return () => h(SnForm, { model, valueAlign: 'right' });
      },
    });
    const wrapper = mount(FormHost);
    expect(wrapper.find('.sn-form').classes()).toContain('sn-form--value-align-right');
  });

  it('adds border between items when border is true', () => {
    const model = reactive({ email: '' });
    const FormHost = defineComponent({
      setup() {
        return () =>
          h(
            SnForm,
            { model, border: true },
            {
              default: () => h(SnFormItem, { prop: 'email', label: 'Email' }),
            },
          );
      },
    });
    const wrapper = mount(FormHost);
    expect(wrapper.find('.sn-form').classes()).toContain('sn-form--border');
  });

  it('hides asterisk when hideAsterisk is true', () => {
    const model = reactive({ email: '' });
    const FormHost = defineComponent({
      setup() {
        return () =>
          h(
            SnForm,
            { model, hideAsterisk: true },
            {
              default: () => h(SnFormItem, { prop: 'email', label: 'Email', required: true }),
            },
          );
      },
    });
    const wrapper = mount(FormHost);
    expect(wrapper.find('.sn-form-item').classes()).toContain('sn-form-item--hide-asterisk');
  });

  /* ── wot-ui `wd-form-item` 1:1 parity ────────────────────────────────── */

  it('overrides form size at the FormItem level', () => {
    const model = reactive({ email: '' });
    const FormHost = defineComponent({
      setup() {
        return () =>
          h(
            SnForm,
            { model, size: 'small' },
            {
              default: () => h(SnFormItem, { prop: 'email', label: 'Email', size: 'large' }),
            },
          );
      },
    });
    const wrapper = mount(FormHost);
    expect(wrapper.find('.sn-form-item').classes()).toContain('sn-form-item--size-large');
  });

  it('renders right arrow when isLink is true', () => {
    const model = reactive({ email: '' });
    const FormHost = defineComponent({
      setup() {
        return () =>
          h(
            SnForm,
            { model },
            {
              default: () => h(SnFormItem, { prop: 'email', label: 'Email', isLink: true }),
            },
          );
      },
    });
    const wrapper = mount(FormHost);
    expect(wrapper.find('.sn-form-item').classes()).toContain('sn-form-item--is-link');
    expect(wrapper.find('.sn-form-item__arrow').exists()).toBe(true);
  });

  it('emits click on row tap when clickable is true', async () => {
    const model = reactive({ email: '' });
    const FormHost = defineComponent({
      setup() {
        return () =>
          h(
            SnForm,
            { model },
            {
              default: () => h(SnFormItem, { prop: 'email', label: 'Email', clickable: true }),
            },
          );
      },
    });
    const wrapper = mount(FormHost);
    await wrapper.find('.sn-form-item').trigger('tap');
    expect(wrapper.findComponent(SnFormItem).emitted('click')).toHaveLength(1);
  });

  it('renders description below the field', () => {
    const model = reactive({ email: '' });
    const FormHost = defineComponent({
      setup() {
        return () =>
          h(
            SnForm,
            { model },
            {
              default: () =>
                h(SnFormItem, { prop: 'email', label: 'Email', description: 'No spam' }),
            },
          );
      },
    });
    const wrapper = mount(FormHost);
    expect(wrapper.find('.sn-form-item__description').text()).toContain('No spam');
  });

  it('renders placeholder when no default slot is provided', () => {
    const model = reactive({ email: '' });
    const FormHost = defineComponent({
      setup() {
        return () =>
          h(
            SnForm,
            { model },
            {
              default: () =>
                h(SnFormItem, { prop: 'email', label: 'Email', placeholder: 'Not set' }),
            },
          );
      },
    });
    const wrapper = mount(FormHost);
    expect(wrapper.find('.sn-form-item__placeholder').text()).toBe('Not set');
  });

  it('applies ellipsis class on the FormItem', () => {
    const model = reactive({ email: '' });
    const FormHost = defineComponent({
      setup() {
        return () =>
          h(
            SnForm,
            { model },
            {
              default: () =>
                h(SnFormItem, { prop: 'email', label: 'A very long label', ellipsis: true }),
            },
          );
      },
    });
    const wrapper = mount(FormHost);
    expect(wrapper.find('.sn-form-item').classes()).toContain('sn-form-item--ellipsis');
  });

  it('renders asterisk on the right when asteriskPosition is right', () => {
    const model = reactive({ email: '' });
    const FormHost = defineComponent({
      setup() {
        return () =>
          h(
            SnForm,
            { model },
            {
              default: () =>
                h(SnFormItem, {
                  prop: 'email',
                  label: 'Email',
                  required: true,
                  asteriskPosition: 'right',
                }),
            },
          );
      },
    });
    const wrapper = mount(FormHost);
    expect(wrapper.find('.sn-form-item').classes()).toContain('sn-form-item--asterisk-right');
  });

  /* ── wd-form `schema` / `title-width` / `layout` ─────────────────────── */

  it('applies the layout class on the form root', () => {
    const model = reactive({ email: '' });
    const FormHost = defineComponent({
      setup() {
        return () => h(SnForm, { model, layout: 'vertical' });
      },
    });
    const wrapper = mount(FormHost);
    expect(wrapper.find('.sn-form').classes()).toContain('sn-form--layout-vertical');
  });

  it('defaults the layout to horizontal', () => {
    const model = reactive({ email: '' });
    const FormHost = defineComponent({
      setup() {
        return () => h(SnForm, { model });
      },
    });
    const wrapper = mount(FormHost);
    expect(wrapper.find('.sn-form').classes()).toContain('sn-form--layout-horizontal');
  });

  it('inherits title-width into the FormItem label column', () => {
    const model = reactive({ email: '' });
    const FormHost = defineComponent({
      setup() {
        return () =>
          h(
            SnForm,
            { model, titleWidth: 200 },
            {
              default: () => h(SnFormItem, { prop: 'email' }),
            },
          );
      },
    });
    const wrapper = mount(FormHost);
    expect(wrapper.find('.sn-form-item').attributes('style')).toContain('200rpx');
  });

  it('accepts a schema object without affecting validation', async () => {
    const model = reactive({ email: '' });
    const rules = { email: [{ required: true, message: 'Email required' } as FormRule] };
    const FormHost = defineComponent({
      setup() {
        return () =>
          h(
            SnForm,
            { model, rules, schema: { email: { required: true } } },
            {
              default: () => h(SnFormItem, { prop: 'email', label: 'Email' }),
            },
          );
      },
    });
    const wrapper = mount(FormHost);
    expect(await wrapper.findComponent(SnForm).vm.validate()).toBe(false);
  });
});
describe('SnForm statusIcon', () => {
  it('should render a status glyph when the form enables status-icon', async () => {
    const model = reactive({ email: '' });
    const rules = { email: [{ required: true, message: 'Email required' } as FormRule] };
    const FormHost = defineComponent({
      setup() {
        return () =>
          h(
            SnForm,
            { model, rules, statusIcon: true },
            { default: () => h(SnFormItem, { prop: 'email', label: 'Email' }) },
          );
      },
    });
    const wrapper = mount(FormHost);
    await wrapper.findComponent(SnForm).vm.validate();
    await nextTick();
    expect(wrapper.findAll('.sn-form-item__status-icon')).toHaveLength(1);
  });

  it('should not render a status glyph by default', async () => {
    const model = reactive({ email: '' });
    const rules = { email: [{ required: true, message: 'Email required' } as FormRule] };
    const FormHost = defineComponent({
      setup() {
        return () =>
          h(
            SnForm,
            { model, rules },
            { default: () => h(SnFormItem, { prop: 'email', label: 'Email' }) },
          );
      },
    });
    const wrapper = mount(FormHost);
    await wrapper.findComponent(SnForm).vm.validate();
    await nextTick();
    expect(wrapper.findAll('.sn-form-item__status-icon')).toHaveLength(0);
  });

  it('should let an item override the form-level status-icon', async () => {
    const model = reactive({ email: '' });
    const rules = { email: [{ required: true, message: 'Email required' } as FormRule] };
    const FormHost = defineComponent({
      setup() {
        return () =>
          h(
            SnForm,
            { model, rules, statusIcon: false },
            { default: () => h(SnFormItem, { prop: 'email', label: 'Email', statusIcon: true }) },
          );
      },
    });
    const wrapper = mount(FormHost);
    await wrapper.findComponent(SnForm).vm.validate();
    await nextTick();
    expect(wrapper.findAll('.sn-form-item__status-icon')).toHaveLength(1);
  });
});

describe('sn-form (extended: events, rules matrix, message gating)', () => {
  const makeHost = (
    formProps: Record<string, unknown>,
    itemProps: Record<string, unknown> = { prop: 'email', label: 'Email' },
  ) => {
    const model = reactive({ email: '', password: '' });
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            SnForm,
            { model, ...formProps },
            {
              default: () => [
                h(SnFormItem, itemProps, {
                  default: () =>
                    h(SnInput, {
                      modelValue: model.email,
                      'onUpdate:modelValue': (v: string) => {
                        model.email = v;
                      },
                    }),
                }),
                h(SnFormItem, { prop: 'password', label: 'Password' }),
              ],
            },
          );
      },
    });
    return { wrapper: mount(Host), model };
  };

  it('emits validate with the per-prop error map', async () => {
    const { wrapper } = makeHost({
      rules: {
        email: [{ required: true, message: 'Email required' } as FormRule],
        password: [{ required: true, message: 'Password required' } as FormRule],
      },
    });
    const form = wrapper.findComponent(SnForm);
    const valid = await form.vm.validate();
    await nextTick();
    expect(valid).toBe(false);
    const payload = form.emitted('validate')?.at(-1)?.[0] as {
      valid: boolean;
      errors: Record<string, string>;
    };
    expect(payload.valid).toBe(false);
    expect(payload.errors).toEqual({
      email: 'Email required',
      password: 'Password required',
    });
  });

  it('emits submit with the aggregate valid flag', async () => {
    const { wrapper } = makeHost({
      rules: { email: [{ required: true, message: 'Email required' } as FormRule] },
    });
    const form = wrapper.findComponent(SnForm);
    form.vm.submit();
    await vi.waitFor(() => {
      expect(form.emitted('submit')?.at(-1)).toEqual([{ valid: false }]);
    });
  });

  it('emits submit with valid=true when every field passes', async () => {
    const { wrapper } = makeHost({ rules: {} });
    const form = wrapper.findComponent(SnForm);
    form.vm.submit();
    await vi.waitFor(() => {
      expect(form.emitted('submit')?.at(-1)).toEqual([{ valid: true }]);
    });
  });

  it('emits reset when resetFields runs', () => {
    const { wrapper } = makeHost({});
    wrapper.findComponent(SnForm).vm.resetFields();
    expect(wrapper.findComponent(SnForm).emitted('reset')).toHaveLength(1);
  });

  it('validateField accepts an array of props', async () => {
    const { wrapper } = makeHost({
      rules: {
        email: [{ required: true, message: 'Email required' } as FormRule],
        password: [{ required: true, message: 'Password required' } as FormRule],
      },
    });
    const ok = await wrapper.findComponent(SnForm).vm.validateField(['email', 'password']);
    expect(ok).toBe(false);
    const items = wrapper.findAllComponents(SnFormItem);
    expect(items[0]!.attributes('data-status')).toBe('error');
    expect(items[1]!.attributes('data-status')).toBe('error');
  });

  it('validateField reports valid for an unregistered prop', async () => {
    const { wrapper } = makeHost({});
    const ok = await wrapper.findComponent(SnForm).vm.validateField('nonexistent');
    expect(ok).toBe(true);
  });

  it('clearValidate targets a single prop without touching the other', async () => {
    const { wrapper } = makeHost({
      rules: {
        email: [{ required: true, message: 'Email required' } as FormRule],
        password: [{ required: true, message: 'Password required' } as FormRule],
      },
    });
    await wrapper.findComponent(SnForm).vm.validate();
    await nextTick();
    wrapper.findComponent(SnForm).vm.clearValidate('email');
    await nextTick();
    const items = wrapper.findAllComponents(SnFormItem);
    expect(items[0]!.attributes('data-status')).toBe('default');
    expect(items[1]!.attributes('data-status')).toBe('error');
  });

  it('clearValidate accepts a prop array', async () => {
    const { wrapper } = makeHost({
      rules: {
        email: [{ required: true, message: 'Email required' } as FormRule],
        password: [{ required: true, message: 'Password required' } as FormRule],
      },
    });
    await wrapper.findComponent(SnForm).vm.validate();
    await nextTick();
    wrapper.findComponent(SnForm).vm.clearValidate(['email', 'password']);
    await nextTick();
    expect(wrapper.findAll('.sn-form-item__message')).toHaveLength(0);
  });

  it('validates a nested dotted prop path', async () => {
    const model = reactive({ profile: { name: '' } });
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            SnForm,
            { model, rules: { 'profile.name': [{ required: true, message: 'Name required' }] } },
            { default: () => h(SnFormItem, { prop: 'profile.name', label: 'Name' }) },
          );
      },
    });
    const wrapper = mount(Host);
    const form = wrapper.findComponent(SnForm);
    expect(await form.vm.validate()).toBe(false);
    model.profile.name = 'Ada';
    expect(await form.vm.validate()).toBe(true);
  });

  it('honours the pattern rule', async () => {
    const model = reactive({ email: 'abc' });
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            SnForm,
            { model, rules: { email: [{ pattern: /^\d+$/, message: 'Digits only' }] } },
            { default: () => h(SnFormItem, { prop: 'email' }) },
          );
      },
    });
    const wrapper = mount(Host);
    expect(await wrapper.findComponent(SnForm).vm.validate()).toBe(false);
    model.email = '123';
    expect(await wrapper.findComponent(SnForm).vm.validate()).toBe(true);
  });

  it('honours the min/max numeric rule', async () => {
    const model = reactive<{ qty: number | string }>({ qty: 1 });
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            SnForm,
            { model, rules: { qty: [{ min: 5, max: 10, message: 'Between 5 and 10' }] } },
            { default: () => h(SnFormItem, { prop: 'qty' }) },
          );
      },
    });
    const wrapper = mount(Host);
    expect(await wrapper.findComponent(SnForm).vm.validate()).toBe(false);
    model.qty = 7;
    expect(await wrapper.findComponent(SnForm).vm.validate()).toBe(true);
    model.qty = 99;
    expect(await wrapper.findComponent(SnForm).vm.validate()).toBe(false);
  });

  it('honours the url type rule', async () => {
    const model = reactive({ email: 'not a url' });
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            SnForm,
            { model, rules: { email: [{ type: 'url', message: 'Bad url' }] } },
            { default: () => h(SnFormItem, { prop: 'email' }) },
          );
      },
    });
    const wrapper = mount(Host);
    expect(await wrapper.findComponent(SnForm).vm.validate()).toBe(false);
    model.email = 'https://aui.dev';
    expect(await wrapper.findComponent(SnForm).vm.validate()).toBe(true);
  });

  it('merges item-level rules with form rules (item rules evaluate first)', async () => {
    const model = reactive({ email: '' });
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            SnForm,
            { model, rules: { email: [{ type: 'email', message: 'Bad email' }] } },
            {
              default: () =>
                h(SnFormItem, { prop: 'email', rules: [{ required: true, message: 'Required' }] }),
            },
          );
      },
    });
    const wrapper = mount(Host);
    // both rules would fail for '', the item-level required fires first
    const form = wrapper.findComponent(SnForm);
    await form.vm.validate();
    await nextTick();
    expect(wrapper.find('.sn-form-item__message').text()).toBe('Required');
    // a valid email passes both rules
    model.email = 'a@b.com';
    expect(await form.vm.validate()).toBe(true);
  });

  it('uses a custom string returned by the validator as the message', async () => {
    const model = reactive({ email: 'x' });
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            SnForm,
            {
              model,
              rules: {
                email: [
                  { validator: (v) => (v === 'ok' ? true : 'custom message'), message: 'fallback' },
                ],
              },
            },
            { default: () => h(SnFormItem, { prop: 'email' }) },
          );
      },
    });
    const wrapper = mount(Host);
    await wrapper.findComponent(SnForm).vm.validate();
    await nextTick();
    expect(wrapper.find('.sn-form-item__message').text()).toBe('custom message');
  });

  it('hides messages when the form-level showMessage is false (regression)', async () => {
    const { wrapper } = makeHost({
      showMessage: false,
      rules: { email: [{ required: true, message: 'Email required' } as FormRule] },
    });
    const form = wrapper.findComponent(SnForm);
    // validation still runs and still fails — only the display is gated
    expect(await form.vm.validate()).toBe(false);
    await nextTick();
    expect(wrapper.findAll('.sn-form-item__message')).toHaveLength(0);
    expect(wrapper.findAllComponents(SnFormItem)[0]!.attributes('data-status')).toBe('error');
  });

  it('lets the item-level showMessage override the form-level flag', async () => {
    const { wrapper } = makeHost(
      {
        showMessage: false,
        rules: { email: [{ required: true, message: 'Email required' } as FormRule] },
      },
      { prop: 'email', label: 'Email', showMessage: true },
    );
    await wrapper.findComponent(SnForm).vm.validate();
    await nextTick();
    expect(wrapper.findAll('.sn-form-item__message')).toHaveLength(1);
  });

  it('hides messages when errorType is none', async () => {
    const { wrapper } = makeHost({
      errorType: 'none',
      rules: { email: [{ required: true, message: 'Email required' } as FormRule] },
    });
    expect(await wrapper.findComponent(SnForm).vm.validate()).toBe(false);
    await nextTick();
    expect(wrapper.findAll('.sn-form-item__message')).toHaveLength(0);
  });

  it('applies the form-level label position class', () => {
    const { wrapper } = makeHost({ labelPosition: 'top' });
    expect(wrapper.find('.sn-form-item').classes()).toContain('sn-form-item--top');
  });

  it('lets the item override the label position', () => {
    const { wrapper } = makeHost({ labelPosition: 'top' }, { prop: 'email', labelPosition: 'left' });
    expect(wrapper.find('.sn-form-item').classes()).toContain('sn-form-item--left');
  });

  it('applies the disabled class from the form', () => {
    const { wrapper } = makeHost({ disabled: true });
    expect(wrapper.find('.sn-form').classes()).toContain('sn-form--disabled');
    expect(wrapper.find('.sn-form-item').classes()).toContain('sn-form-item--disabled');
  });

  it('centers items from the form-level center flag', () => {
    const { wrapper } = makeHost({ center: true });
    expect(wrapper.find('.sn-form-item').classes()).toContain('sn-form-item--center');
  });

  it('adds a border at the item level while the form has none', () => {
    const { wrapper } = makeHost({}, { prop: 'email', border: true });
    expect(wrapper.find('.sn-form').classes()).not.toContain('sn-form--border');
    expect(wrapper.find('.sn-form-item').classes()).toContain('sn-form-item--border');
  });

  it('accepts a string labelWidth verbatim', () => {
    const { wrapper } = makeHost({ labelWidth: '120px' });
    const style = wrapper.find('.sn-form-item').attributes('style') ?? '';
    expect(style).toContain('120px');
  });

  it('marks static items without a prop', () => {
    const model = reactive({});
    const Host = defineComponent({
      setup() {
        return () => h(SnForm, { model }, { default: () => h(SnFormItem, { label: 'Info' }) });
      },
    });
    const wrapper = mount(Host);
    expect(wrapper.find('.sn-form-item').attributes('data-snui-component')).toBe(
      'form-item-static',
    );
  });

  it('stops validating an item after it unmounts', async () => {
    const model = reactive({ email: '', password: 'fine' });
    const showEmail = ref(true);
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            SnForm,
            {
              model,
              rules: {
                email: [{ required: true, message: 'Email required' } as FormRule],
                password: [{ required: true, message: 'Password required' } as FormRule],
              },
            },
            {
              default: () => [
                showEmail.value
                  ? h(SnFormItem, { prop: 'email', label: 'Email' })
                  : null,
                h(SnFormItem, { prop: 'password', label: 'Password' }),
              ],
            },
          );
      },
    });
    const wrapper = mount(Host);
    // email is empty → fails while mounted
    expect(await wrapper.findComponent(SnForm).vm.validate()).toBe(false);
    showEmail.value = false;
    await nextTick();
    // only the passing password item remains registered
    expect(await wrapper.findComponent(SnForm).vm.validate()).toBe(true);
  });

  it('labels the error message assertive and renders the error slot', async () => {
    const { wrapper } = makeHost(
      { rules: { email: [{ required: true, message: 'Email required' } as FormRule] } },
      { prop: 'email' },
    );
    const form = wrapper.findComponent(SnForm);
    await form.vm.validate();
    await nextTick();
    const msg = wrapper.find('.sn-form-item__message');
    expect(msg.attributes('aria-live')).toBe('assertive');
    expect(msg.text()).toBe('Email required');
  });

  it('overrides the message text with the error slot', async () => {
    const model = reactive({ email: '' });
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            SnForm,
            { model, rules: { email: [{ required: true, message: 'Email required' }] } },
            {
              default: () =>
                h(SnFormItem, { prop: 'email' }, { error: () => h('text', 'custom error view') }),
            },
          );
      },
    });
    const wrapper = mount(Host);
    await wrapper.findComponent(SnForm).vm.validate();
    await nextTick();
    expect(wrapper.find('.sn-form-item__message').text()).toBe('custom error view');
  });

  it('overrides the label text with the label slot', () => {
    const model = reactive({ email: '' });
    const Host = defineComponent({
      setup() {
        return () =>
          h(SnForm, { model }, { default: () => h(SnFormItem, { prop: 'email', label: 'Prop' }, { label: () => 'Slotted' }) });
      },
    });
    const wrapper = mount(Host);
    expect(wrapper.find('.sn-form-item__label').text()).toBe('Slotted');
  });

  it('resolves the label icon through the registry by name', async () => {
    const { registerSnIcons, clearSnIcons } = await import('../sn-icon/sn-icon-registry');
    const { Star } = await import('../sn-icon/sn-icon-set');
    registerSnIcons({ Star });
    const model = reactive({ email: '' });
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            SnForm,
            { model },
            { default: () => h(SnFormItem, { prop: 'email', label: 'Email', iconName: 'Star' }) },
          );
      },
    });
    const wrapper = mount(Host);
    expect(wrapper.find('.sn-form-item__icon').exists()).toBe(true);
    clearSnIcons();
  });
});

describe('sn-form (lifecycle and defensive paths)', () => {
  it('restores object and array fields from the deep-cloned initial value on resetFields', async () => {
    const model = reactive({ profile: { name: 'aui', tags: ['x', 'y'] } });
    const Host = defineComponent({
      setup() {
        return () =>
          h(SnForm, { model }, { default: () => h(SnFormItem, { prop: 'profile', label: 'Profile' }) });
      },
    });
    const wrapper = mount(Host);
    model.profile.name = 'changed';
    model.profile.tags = ['z'];
    wrapper.findComponent(SnForm).vm.resetFields();
    await nextTick();
    expect(model.profile.name).toBe('aui');
    expect(model.profile.tags).toEqual(['x', 'y']);
  });

  it('unmounts cleanly while fields are registered', async () => {
    const model = reactive({ email: '', password: '' });
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            SnForm,
            { model },
            {
              default: () => [
                h(SnFormItem, { prop: 'email', label: 'Email' }),
                h(SnFormItem, { prop: 'password', label: 'Password' }),
              ],
            },
          );
      },
    });
    const wrapper = mount(Host);
    expect(wrapper.findAll('.sn-form-item')).toHaveLength(2);
    expect(() => wrapper.unmount()).not.toThrow();
  });
});

describe('sn-form-validator (rule fallthrough)', () => {
  it('ignores a rule carrying none of the known constraint keys', async () => {
    const { validateValue } = await import('./sn-form-validator');
    // A rule object with only a message matches no constraint branch — the
    // validator fails open instead of throwing.
    const result = await validateValue('anything', [{ message: 'never' } as FormRule]);
    expect(result).toBe('');
  });
});

describe('sn-form-item press feedback (hover-class)', () => {
  function mountItem(itemProps: Record<string, unknown> = {}) {
    const model = reactive({ email: '' });
    const FormHost = defineComponent({
      setup() {
        return () =>
          h(
            SnForm,
            { model },
            {
              default: () => h(SnFormItem, { prop: 'email', label: 'Email', ...itemProps }),
            },
          );
      },
    });
    return mount(FormHost);
  }

  it('wires the pressed class on clickable rows', () => {
    const wrapper = mountItem({ clickable: true });
    expect(wrapper.find('.sn-form-item').attributes('hover-class')).toBe('sn-form-item--pressed');
  });

  it('stays inert on static rows', () => {
    const wrapper = mountItem();
    expect(wrapper.find('.sn-form-item').attributes('hover-class')).toBe('none');
  });
});
