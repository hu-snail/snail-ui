import {
  computed,
  defineComponent,
  h,
  inject,
  provide,
  ref,
  type EmitsOptions,
  type InjectionKey,
  type PropType,
  type Ref,
} from 'vue';
import {
  FormTokens,
  FormItemTokens,
  type FormItemProps,
  type FormLayout,
} from '@snui/protocol';

/**
 * AUI Vue 3 Form — schema-driven form container.
 *
 * Per AGENTS.md §32, this component handles Rendering / Interaction / DOM /
 * Platform Integration. Schema validation (FormPropsSchema) happens upstream;
 * the form itself is a thin renderer that:
 *   - renders a native `<form>` element so platform submit / reset work
 *   - cascades `disabled` / `loading` to descendant FormItems via provide/inject
 *   - reads collected values from the native FormData on submit
 *
 * Validation lives in the rules attached to `FormField` definitions; the
 * renderer's `validate()` walks fields and applies rules to the collected
 * FormData. If validation fails it dispatches `validate` with `{ valid: false,
 * errors }`; the parent decides whether to proceed.
 *
 * Form-level emit `submit` carries the cleaned values object (not raw
 * FormData) so consumers don't have to convert.
 */

export interface FormContext {
  /** Disabled state cascading from Form to descendants. */
  disabled: Ref<boolean>;
  /** Loading state cascading from Form to descendants. */
  loading: Ref<boolean>;
  /** Optional map of `prop path → error string` from validate(). */
  errors: Ref<Readonly<Record<string, string>>>;
}

export const FormContextKey: InjectionKey<FormContext> = Symbol('AUIFormContext');

export interface FormFieldDescriptor {
  prop: string;
  label?: string | undefined;
  required?: boolean | undefined;
  rules?: ReadonlyArray<{
    required?: boolean | undefined;
    minLength?: number | undefined;
    maxLength?: number | undefined;
    pattern?: string | undefined;
    message?: string | undefined;
  }> | undefined;
  placeholder?: string | undefined;
  type?: string | undefined;
  disabled?: boolean | undefined;
}

/** Public type used by renderers when auto-rendering from a `fields` array. */
export type FormFields = ReadonlyArray<FormFieldDescriptor>;

export interface ValidateResult {
  valid: boolean;
  errors: Record<string, string>;
}

export const Form = defineComponent({
  name: 'SnuiForm',

  props: {
    layout: {
      type: String as PropType<FormLayout>,
      default: 'vertical',
    },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    initialValues: {
      type: Object as PropType<Record<string, unknown>>,
      default: () => ({}),
    },
    fields: {
      type: Array as PropType<FormFields>,
      default: () => [],
    },
    formId: { type: String, default: undefined },
  },

  emits: {
    submit: (_values: Record<string, string>) => true,
    validate: (_result: ValidateResult) => true,
  } satisfies EmitsOptions,

  setup(props, { slots, emit, attrs }) {
    const errorsState = ref<Record<string, string>>({});

    provide<FormContext>(FormContextKey, {
      disabled: computed(() => props.disabled),
      loading: computed(() => props.loading),
      errors: errorsState,
    });

    const styleMap = computed<Record<string, string>>(() => ({
      background: FormTokens.background,
      gap: FormTokens.itemGap,
    }));

    const onSubmit = (event: Event) => {
      // Native form submit triggers a full page reload; prevent it.
      event.preventDefault();
      const formEl = event.target as HTMLFormElement;
      const formData = new FormData(formEl);
      const values: Record<string, string> = {};
      for (const [key, value] of formData.entries()) {
        if (typeof value === 'string') {
          values[key] = value;
        }
      }
      const result = validateValues(values);
      emit('validate', result);
      if (result.valid) {
        emit('submit', values);
      } else {
        errorsState.value = { ...result.errors };
      }
    };

    const onReset = (event: Event) => {
      // Allow native reset to run first, then propagate the event.
      const formEl = event.target as HTMLFormElement;
      if (formEl && typeof formEl.reset === 'function') {
        // formEl.reset() already happened via the browser; collect nothing.
      }
      errorsState.value = {};
    };

    const validateValues = (values: Record<string, string>): ValidateResult => {
      const errs: Record<string, string> = {};
      for (const field of props.fields ?? []) {
        const value = values[field.prop] ?? '';
        for (const rule of field.rules ?? []) {
          if (rule.required && value.length === 0) {
            errs[field.prop] = rule.message ?? `${field.label ?? field.prop} is required`;
            break;
          }
          if (rule.minLength !== undefined && value.length < rule.minLength) {
            errs[field.prop] =
              rule.message ?? `Minimum length is ${rule.minLength}`;
            break;
          }
          if (rule.maxLength !== undefined && value.length > rule.maxLength) {
            errs[field.prop] =
              rule.message ?? `Maximum length is ${rule.maxLength}`;
            break;
          }
          if (rule.pattern !== undefined && value.length > 0) {
            try {
              const re = new RegExp(rule.pattern);
              if (!re.test(value)) {
                errs[field.prop] = rule.message ?? 'Invalid format';
                break;
              }
            } catch {
              // Bad regex from caller — surface as format error.
              errs[field.prop] = rule.message ?? 'Invalid format';
              break;
            }
          }
        }
      }
      return { valid: Object.keys(errs).length === 0, errors: errs };
    };

    return () => {
      const slotNodes = slots.default?.() ?? [];
      return h(
        'form',
        {
          id: props.formId,
          class: ['snui-form', `snui-form--${props.layout}`],
          style: styleMap.value,
          'aria-busy': props.loading,
          'aria-disabled': props.disabled,
          novalidate: true,
          onSubmit,
          onReset,
          ...attrs,
        },
        slotNodes,
      );
    };
  },
});

/**
 * AUI Vue 3 FormItem — leaf component inside a Form. Cascades context, renders
 * a label + slot + error message.
 *
 * It does NOT know about its inner Input — the slot (provided by the parent
 * schema's children) renders the actual control. The renderer exposes the
 * current error for this `prop` via inject so inner controls can wire
 * `aria-invalid` if they want (Phase 2 simplification: leave it to consumers).
 */
export const FormItem = defineComponent({
  name: 'SnuiFormItem',

  props: {
    prop: { type: String, required: true },
    label: { type: String, default: undefined },
    required: { type: Boolean, default: false },
    error: { type: String, default: undefined },
  },

  setup(props: FormItemProps, { slots, attrs }) {
    const ctx = inject(FormContextKey, null);

    const resolvedError = computed<string | undefined>(() => {
      if (props.error) return props.error;
      return ctx?.errors.value[props.prop];
    });

    const hasError = computed<boolean>(() => Boolean(resolvedError.value));

    return () => {
      const slotNodes = slots.default?.() ?? [];
      const labelNode = props.label
        ? h(
            'label',
            { class: 'snui-form-item__label', for: props.prop },
            [
              props.label,
              props.required
                ? h('span', {
                    class: 'snui-form-item__required',
                    'aria-hidden': 'true',
                  }, '*')
                : null,
            ],
          )
        : null;
      const errorNode = resolvedError.value
        ? h(
            'div',
            {
              class: 'snui-form-item__error',
              role: 'alert',
            },
            resolvedError.value,
          )
        : null;
      return h(
        'div',
        {
          class: [
            'snui-form-item',
            hasError.value ? 'snui-form-item--invalid' : '',
          ],
          style: { gap: FormItemTokens.gap },
          'aria-required': props.required,
          'aria-invalid': hasError.value,
          ...attrs,
        },
        [labelNode, ...slotNodes, errorNode].filter(Boolean) as ReturnType<typeof h>[],
      );
    };
  },
});