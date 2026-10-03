/**
 * AUI Uni Adapter (Phase 3 placeholder).
 *
 * The full uni-app implementation lands in AUI-UNI-001..006. For now this
 * module exports the same registry + renderer SHAPE as `@snui/vue-web` so
 * the docs site can mount previews without depending on uni-app's runtime.
 *
 * Behavior:
 *   - createUniRegistry / createUniRenderer mirror the Web API.
 *   - Button (UniButton) renders a real `<button>` DOM element (uni-app H5
 *     builds use the DOM; native builds proxy through, but the DOM is the
 *     canonical target during Phase 1 development).
 *   - Real uni-app event mapping + capability gating land in Phase 3.
 *
 * Per AGENTS.md §59: AUI MUST NOT re-implement uni-app's H5 / MiniProgram /
 * App runtime. The actual uni-app binding is the host application's job;
 * AUI consumes it via the `platform` adapter interface.
 */

export const AUI_UNI_VERSION = '0.1.0';

/* ─── ComponentRegistry (mirror of @snui/vue-web) ────────────── */

import { createComponentRegistry as createWebComponentRegistry } from './registry.js';
export const createComponentRegistry = createWebComponentRegistry;
export type { ComponentRegistry, Component } from './registry.js';

/* ─── Renderer (mirror) ─────────────────────────────────────── */

import { createVueRenderer as createWebVueRenderer } from './renderer.js';
export const createVueRenderer = createWebVueRenderer;
export type { VueRenderer, VueRendererOptions } from './renderer.js';

/* ─── Button (UniButton) ────────────────────────────────────── */

import { defineComponent, h, computed, type PropType, type EmitsOptions } from 'vue';
import type { ButtonSize, ButtonType, ButtonVariant } from '@snui/protocol';

export const Button = defineComponent({
  name: 'UniButton',
  props: {
    variant: { type: String as PropType<ButtonVariant>, default: 'primary' },
    size: { type: String as PropType<ButtonSize>, default: 'medium' },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    icon: { type: String, default: undefined },
    text: { type: String, default: undefined },
    type: { type: String as PropType<ButtonType>, default: 'button' },
  },
  emits: {
    click: (_event: MouseEvent) => true,
  } satisfies EmitsOptions,
  setup(props, { slots, emit, attrs }) {
    const classList = computed<string[]>(() => [
      'snui-button',
      `snui-button--${props.variant}`,
      `snui-button--${props.size}`,
      ...(props.disabled ? ['snui-button--disabled'] : []),
      ...(props.loading ? ['snui-button--loading'] : []),
    ]);
    return () => {
      const content: ReturnType<typeof h>[] = [];
      if (props.loading) content.push(h('span', { class: 'snui-button__spinner' }));
      if (props.icon) content.push(h('span', { class: 'snui-button__icon', 'data-icon': props.icon }));
      const slotNodes = slots.default?.();
      if (slotNodes && slotNodes.length > 0) content.push(...slotNodes);
      else if (props.text !== undefined) content.push(h('span', { class: 'snui-button__text' }, props.text));
      return h(
        'button',
        {
          type: props.type,
          class: classList.value,
          disabled: props.disabled || props.loading,
          'aria-disabled': props.disabled || props.loading,
          'aria-busy': props.loading,
          role: 'button',
          onClick: (event: MouseEvent) => {
            if (props.disabled || props.loading) return;
            emit('click', event);
          },
          ...attrs,
        },
        content,
      );
    };
  },
});