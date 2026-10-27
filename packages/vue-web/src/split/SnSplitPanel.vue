<script setup lang="ts">
/**
 * SnSplitPanel — panel inside SnSplit (naive-ui n-splitter-panel parity).
 *
 * Renders as a multi-root fragment: its divider (every panel after the first)
 * followed by the panel body, so both become direct flex items of the
  * split container and percent sizes stay exact. Size (percent width or
  * height) is owned by the parent split container through the injection context.
 */
import { computed, inject, onBeforeUnmount } from 'vue';
import { SN_SPLIT_INJECTION_KEY } from './split-context';
import type { SnSplitBoundaryAria } from './split-context';
import type { SnSplitPanelPublicProps } from './split-context';

defineOptions({ name: 'SnSplitPanel', inheritAttrs: false });

const props = defineProps<SnSplitPanelPublicProps>();

const emit = defineEmits<{
  /** v-model:collapsed sync (collapse snap / expand restore / host change). */
  (e: 'update:collapsed', collapsed: boolean): void;
}>();

defineSlots<{
  /** Panel content. */
  default?(): unknown;
}>();

const api = inject(SN_SPLIT_INJECTION_KEY);

let panelId = -1;
let unregister: (() => void) | null = null;
if (api) {
  const registration = api.registerPanel({
    props,
    emitCollapsed: (next: boolean) => {
      emit('update:collapsed', next);
    },
  });
  panelId = registration.id;
  unregister = registration.unregister;
  onBeforeUnmount(() => {
    unregister?.();
  });
}

const entry = computed(() => (api ? api.getEntry(panelId) : undefined));
const panelIndex = computed(() => (api ? api.indexOfPanel(panelId) : -1));

/** Every panel after the first renders the divider above its own body. */
const dividerVisible = computed(() => panelIndex.value > 0);

const bodyStyle = computed<Record<string, string> | undefined>(() => {
  const current = entry.value;
  if (!current) return undefined;
  return api?.direction.value === 'vertical'
    ? { height: `${current.size}%` }
    : { width: `${current.size}%` };
});

const dividerAria = computed<SnSplitBoundaryAria | null>(() =>
  api && dividerVisible.value ? api.getBoundaryAria(panelIndex.value) : null,
);
const isDividerDisabled = computed(() => api?.isDisabled.value ?? false);
const dividerOrientation = computed(() =>
  api?.direction.value === 'vertical' ? 'horizontal' : 'vertical',
);

function onDividerPointerDown(event: PointerEvent): void {
  api?.onDividerPointerDown(panelIndex.value, event);
}

function onDividerKeydown(event: KeyboardEvent): void {
  api?.onDividerKeydown(panelIndex.value, event);
}

function onDividerDblClick(): void {
  api?.onDividerDblClick(panelIndex.value);
}
</script>

<template>
  <div
    v-if="dividerVisible"
    class="sn-split__divider"
    role="separator"
    :tabindex="isDividerDisabled ? -1 : 0"
    :aria-orientation="dividerOrientation"
    :aria-valuenow="dividerAria?.valueNow"
    :aria-valuemin="dividerAria?.valueMin"
    :aria-valuemax="dividerAria?.valueMax"
    :aria-disabled="isDividerDisabled ? 'true' : undefined"
    @pointerdown="onDividerPointerDown"
    @keydown="onDividerKeydown"
    @dblclick="onDividerDblClick"
  >
     <span class="sn-split__divider-bar" />
  </div>
  <div class="sn-split__panel" :style="bodyStyle" v-bind="$attrs">
    <slot />
  </div>
</template>

<style scoped>
.sn-split__panel {
  flex: 0 1 auto;
  min-width: 0;
  min-height: 0;
  box-sizing: border-box;
  overflow: hidden;
}

 /* Divider: the interactive bar between two panels. The grip bar is hidden
    while idle and appears centered in the hit area on hover / keyboard focus
    / active drag (via the container's --dragging class); the hit area is
    wider than the bar, so panels stay visually clean by default. */
 .sn-split__divider {
   flex: none;
   display: flex;
   align-items: center;
   justify-content: center;
   box-sizing: border-box;
   width: var(--sn-web-split-divider-size, 10px);
   padding: 0;
   border: none;
   background: transparent;
   cursor: col-resize;
   touch-action: none;
   outline: none;
 }
 
 .sn-split__divider-bar {
   flex: none;
   width: var(--sn-web-split-divider-bar-size, 3px);
   height: var(--sn-web-split-divider-bar-length, 32px);
   border-radius: var(--sn-web-split-divider-bar-radius, 999px);
   background-color: var(--sn-web-split-divider-bar-color, var(--sn-web-color-border-default));
   opacity: 0;
   transition:
     opacity 0.15s ease,
     background-color 0.15s ease;
 }
 
 .sn-split__divider:hover .sn-split__divider-bar,
 .sn-split__divider:focus-visible .sn-split__divider-bar,
 .sn-split--dragging .sn-split__divider-bar {
   opacity: 1;
 }
 
 .sn-split__divider:focus-visible .sn-split__divider-bar,
 .sn-split--dragging .sn-split__divider-bar {
   background-color: var(
     --sn-web-split-divider-bar-color-active,
     var(--sn-web-color-action-primary)
   );
 }

.sn-split__divider:focus-visible {
  box-shadow: var(--sn-web-focus-ring, 0 0 0 3px rgba(22, 119, 255, 0.15));
}

.sn-split__divider[aria-disabled='true'] {
  cursor: default;
}

/* Vertical container: the divider is a horizontal bar across the column. */
.sn-split--vertical .sn-split__divider {
  width: auto;
  height: var(--sn-web-split-divider-size, 10px);
  cursor: row-resize;
}

 .sn-split--vertical .sn-split__divider-bar {
   width: var(--sn-web-split-divider-bar-length, 32px);
   height: var(--sn-web-split-divider-bar-size, 3px);
 }
</style>
