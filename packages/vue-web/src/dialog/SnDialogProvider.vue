<script setup lang="ts">
/**
 * SnDialogProvider — imperative dialog host (naive `n-dialog-provider`
 * parity, AUI-WEB-FB-001). Wrap the app (or any subtree) and call
 * `useDialog()` below it to open typed dialogs programmatically.
 *
 * Each dialog renders in its own overlay — a fixed mask with a centred
 * `SnDialog` card — teleported to `body` so nothing clips it. The overlay
 * fades with the card's own pop transition; a confirm handler returning a
 * Promise shows the confirm button's loading state and closes when it
 * settles (naive parity).
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnDialogProvider>
 *     <App />
 *   </SnDialogProvider>
 *
 *   // anywhere below:
 *   const dialog = useDialog();
 *   dialog.warning({ title: '警告', content: '你确定?', … });
 */
import { provide, reactive, ref } from 'vue';
import SnDialog from './SnDialog.vue';
import {
  snDialogApiInjectionKey,
  type DialogApiInjection,
  type SnDialogOptions,
  type DialogReactive,
} from './use-dialog';

defineOptions({ name: 'SnDialogProvider' });

const props = withDefaults(
  defineProps<{
    /** Teleport target for the overlay container. Default `'body'`. */
    to?: string | HTMLElement;
    /** Base stacking order; stacked dialogs increment from here. */
    zIndex?: number;
    /** Close when the mask itself is clicked. Default `true`. */
    maskClosable?: boolean;
    /** Gap (px) between the mask appearing and the node being dropped. */
    leaveDuration?: number;
  }>(),
  {
    to: 'body',
    zIndex: 2000,
    maskClosable: true,
    leaveDuration: 220,
  },
);

const dialogs = ref<DialogReactive[]>([]);
let nextId = 1;

/** Drop a hidden dialog from the list after its leave transition plays. */
function removeLater(dialog: DialogReactive): void {
  window.setTimeout(() => {
    const at = dialogs.value.indexOf(dialog);
    if (at >= 0) dialogs.value.splice(at, 1);
  }, props.leaveDuration);
}

function hide(dialog: DialogReactive): void {
  if (!dialog.show) return;
  dialog.show = false;
  removeLater(dialog);
}

function handlePositiveClick(dialog: DialogReactive): void {
  const ret = dialog.onPositiveClick?.();
  if (ret === false) return;
  if (ret instanceof Promise) {
    dialog.loading = true;
    void ret
      .then((keepOpen) => {
        dialog.loading = false;
        if (keepOpen !== false) hide(dialog);
      })
      .catch(() => {
        dialog.loading = false;
      });
    return;
  }
  hide(dialog);
}

function handleNegativeClick(dialog: DialogReactive): void {
  const ret = dialog.onNegativeClick?.();
  if (ret === false) return;
  hide(dialog);
}

function handleClose(dialog: DialogReactive): void {
  dialog.onClose?.();
  hide(dialog);
}

function handleOverlayClick(dialog: DialogReactive, event: MouseEvent): void {
  if (!props.maskClosable) return;
  // Only the mask itself — clicks inside the card must not dismiss.
  if (event.target !== event.currentTarget) return;
  handleClose(dialog);
}

const api: DialogApiInjection = {
  info: (options) => create({ ...options, type: 'info' }),
  success: (options) => create({ ...options, type: 'success' }),
  warning: (options) => create({ ...options, type: 'warning' }),
  error: (options) => create({ ...options, type: 'error' }),
  create,
  destroyAll: () => {
    for (const dialog of [...dialogs.value]) hide(dialog);
  },
};

function create(options: SnDialogOptions): DialogReactive {
  const id = nextId;
  nextId += 1;
  const dialog = reactive<DialogReactive>({
    ...options,
    id,
    show: true,
    loading: false,
    destroy: () => hide(dialog),
  });
  dialogs.value.push(dialog);
  return dialog;
}

/**
 * Props for the card. Built as a function so `exactOptionalPropertyTypes`
 * only receives fields that are actually set (no explicit `undefined`).
 */
function cardProps(dialog: DialogReactive) {
  return {
    type: dialog.type ?? ('default' as const),
    ...(dialog.icon !== undefined ? { icon: dialog.icon } : {}),
    ...(dialog.title !== undefined ? { title: dialog.title } : {}),
    ...(dialog.content !== undefined && typeof dialog.content === 'string'
      ? { content: dialog.content }
      : {}),
    ...(dialog.showIcon !== undefined ? { showIcon: dialog.showIcon } : {}),
    ...(dialog.closable !== undefined ? { closable: dialog.closable } : {}),
    ...(dialog.iconPlacement !== undefined ? { iconPlacement: dialog.iconPlacement } : {}),
    ...(dialog.positiveText !== undefined ? { positiveText: dialog.positiveText } : {}),
    ...(dialog.negativeText !== undefined ? { negativeText: dialog.negativeText } : {}),
    ...(dialog.positiveButtonProps !== undefined
      ? { positiveButtonProps: dialog.positiveButtonProps }
      : {}),
    ...(dialog.negativeButtonProps !== undefined
      ? { negativeButtonProps: dialog.negativeButtonProps }
      : {}),
    loading: dialog.loading,
    ...(dialog.bordered !== undefined ? { bordered: dialog.bordered } : {}),
  };
}

provide(snDialogApiInjectionKey, api);
</script>

<template>
  <slot />

  <Teleport :to="to">
    <Transition v-for="dialog in dialogs" :key="dialog.id" name="sn-dialog-provider-fade">
      <div
        v-if="dialog.show"
        class="sn-dialog-provider__overlay"
        :style="{ zIndex: (zIndex ?? 2000) + dialogs.indexOf(dialog) }"
        @click="handleOverlayClick(dialog, $event)"
      >
        <SnDialog
          v-bind="cardProps(dialog)"
          @positive-click="handlePositiveClick(dialog)"
          @negative-click="handleNegativeClick(dialog)"
          @close="handleClose(dialog)"
        >
          <template v-if="typeof dialog.content === 'function'">
            <component :is="dialog.content" />
          </template>
        </SnDialog>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.sn-dialog-provider__overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--sn-web-color-background-overlay, rgba(0, 0, 0, 0.5));
}

/* Upstream keeps the dialog width on the provider's overlay, not the card. */
.sn-dialog-provider__overlay :deep(.sn-dialog) {
  width: 446px;
  max-width: calc(100vw - 32px);
}

/* Mask + card fade together; the card's own pop transition plays on top. */
.sn-dialog-provider-fade-enter-active,
.sn-dialog-provider-fade-leave-active {
  transition: opacity 0.2s ease;
}

.sn-dialog-provider-fade-enter-from,
.sn-dialog-provider-fade-leave-to {
  opacity: 0;
}
</style>
