import { defineComponent, h, computed, type PropType, type EmitsOptions } from 'vue';
import {
  ButtonTokens,
  type ButtonSize,
  type ButtonVariant,
  type ButtonType,
} from '@snui/protocol';

/**
 * AUI Vue 3 Button — rendered via h() (no SFC) so the package compiles with
 * plain `tsc` and tests run under vitest+jsdom without a separate Vite pass.
 *
 * Per AGENTS.md §32, this component handles Rendering / Interaction / DOM /
 * Platform Integration only. Schema validation happens upstream via
 * ButtonPropsSchema; binding/action resolution lives in the runtime layer.
 */

export const Button = defineComponent({
  name: 'SnuiButton',

  props: {
    variant: {
      type: String as PropType<ButtonVariant>,
      default: 'primary',
    },
    size: {
      type: String as PropType<ButtonSize>,
      default: 'medium',
    },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    icon: { type: String, default: undefined },
    text: { type: String, default: undefined },
    type: {
      type: String as PropType<ButtonType>,
      default: 'button',
    },
  },

  emits: {
    click: (_event: MouseEvent) => true,
  } satisfies EmitsOptions,

  setup(props, { slots, emit, attrs }) {
    const classList = computed<string[]>(() => {
      const list: string[] = [
        'snui-button',
        `snui-button--${props.variant}`,
        `snui-button--${props.size}`,
      ];
      if (props.disabled) list.push('snui-button--disabled');
      if (props.loading) list.push('snui-button--loading');
      return list;
    });

    const styleMap = computed<Record<string, string>>(() => {
      const variantTokens = ButtonTokens[props.variant];
      const sizeTokens = ButtonTokens.size[props.size];
      return {
        background: variantTokens.background,
        color: variantTokens.color,
        borderColor: variantTokens.borderColor,
        height: sizeTokens.height,
        padding: sizeTokens.padding,
        fontSize: sizeTokens.fontSize,
      };
    });

    const isInteractive = computed<boolean>(() => !props.disabled && !props.loading);

    return () => {
      const content: ReturnType<typeof h>[] = [];
      if (props.loading) {
        content.push(h('span', { class: 'snui-button__spinner' }));
      }
      if (props.icon) {
        content.push(h('span', { class: 'snui-button__icon', 'data-icon': props.icon }));
      }
      const slotNodes = slots.default?.();
      if (slotNodes && slotNodes.length > 0) {
        content.push(...slotNodes);
      } else if (props.text !== undefined) {
        content.push(h('span', { class: 'snui-button__text' }, props.text));
      }

      return h(
        'button',
        {
          type: props.type,
          class: classList.value,
          style: styleMap.value,
          disabled: !isInteractive.value,
          'aria-disabled': !isInteractive.value,
          'aria-busy': props.loading,
          role: 'button',
          onClick: (event: MouseEvent) => {
            if (!isInteractive.value) return;
            emit('click', event);
          },
          ...attrs,
        },
        content,
      );
    };
  },
});