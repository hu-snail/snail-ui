import {
  computed,
  defineComponent,
  h,
  type EmitsOptions,
  type PropType,
} from 'vue';
import {
  InputTokens,
  type InputProps,
  type InputSize,
  type InputType,
} from '@snui/protocol';

/**
 * AUI Vue 3 Input — rendered via h() (no SFC) so the package compiles with
 * plain `tsc` and tests run under vitest+jsdom without a separate Vite pass.
 *
 * Per AGENTS.md §32, this component handles Rendering / Interaction / DOM /
 * Platform Integration only. Schema validation happens upstream via
 * InputPropsSchema; binding/action resolution lives in the runtime layer.
 *
 * Event semantics:
 *   - `input`  → emitted on every `input` event (per keystroke)
 *   - `change` → emitted when the value is committed (input + blur, or Enter)
 *   - `focus`  → emitted on focus
 *   - `blur`   → emitted on blur (carries the last committed value)
 *   - `clear`  → emitted when the user clicks the clear button (clearable=true)
 *
 * `value` is a controlled prop — the parent re-renders the component with the
 * new value after receiving `input`/`change`. The renderer never mutates
 * internal state, keeping the component stateless and predictable.
 */

export const Input = defineComponent({
  name: 'SnuiInput',

  props: {
    value: { type: String, default: '' },
    placeholder: { type: String, default: undefined },
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    type: {
      type: String as PropType<InputType>,
      default: 'text',
    },
    size: {
      type: String as PropType<InputSize>,
      default: 'medium',
    },
    clearable: { type: Boolean, default: false },
    maxlength: { type: Number, default: undefined },
    minlength: { type: Number, default: undefined },
    name: { type: String, default: undefined },
  },

  emits: {
    input: (_value: string) => true,
    change: (_value: string) => true,
    focus: (_event: FocusEvent) => true,
    blur: (_event: FocusEvent) => true,
    clear: () => true,
  } satisfies EmitsOptions,

  setup(props, { emit, attrs }) {
    const sizeTokens = computed(() => InputTokens.size[props.size]);

    const styleMap = computed<Record<string, string>>(() => ({
      background: props.disabled ? InputTokens.disabledBackground : InputTokens.background,
      color: props.disabled ? InputTokens.disabledColor : InputTokens.color,
      borderColor: InputTokens.borderColor,
      height: sizeTokens.value.height,
      padding: sizeTokens.value.padding,
      fontSize: sizeTokens.value.fontSize,
    }));

    const isInteractive = computed(() => !props.disabled && !props.readonly);

    const showClear = computed(
      () => props.clearable && !props.disabled && !props.readonly && props.value.length > 0,
    );

    const wrapperClass = computed<string[]>(() => {
      const list: string[] = ['snui-input', `snui-input--${props.size}`];
      if (props.disabled) list.push('snui-input--disabled');
      if (props.readonly) list.push('snui-input--readonly');
      return list;
    });

    return () => {
      const inputNode = h('input', {
        class: 'snui-input__control',
        style: styleMap.value,
        type: props.type,
        value: props.value,
        placeholder: props.placeholder,
        disabled: props.disabled,
        readonly: props.readonly,
        maxlength: props.maxlength,
        minlength: props.minlength,
        name: props.name,
        'aria-disabled': props.disabled,
        'aria-readonly': props.readonly,
        onInput: (event: Event) => {
          if (!isInteractive.value) return;
          const target = event.target as HTMLInputElement;
          emit('input', target.value);
        },
        onChange: (event: Event) => {
          if (!isInteractive.value) return;
          const target = event.target as HTMLInputElement;
          emit('change', target.value);
        },
        onFocus: (event: FocusEvent) => emit('focus', event),
        onBlur: (event: FocusEvent) => emit('blur', event),
        ...attrs,
      });

      const children: ReturnType<typeof h>[] = [inputNode];
      if (showClear.value) {
        children.push(
          h(
            'button',
            {
              type: 'button',
              class: 'snui-input__clear',
              'aria-label': 'Clear input',
              tabindex: -1,
              onClick: () => {
                if (!isInteractive.value) return;
                emit('clear');
                emit('input', '');
                emit('change', '');
              },
            },
            '×',
          ),
        );
      }

      return h('span', { class: wrapperClass.value }, children);
    };
  },
});

// Re-export for convenience; some bundlers / generators may want the type.
export type { InputProps };