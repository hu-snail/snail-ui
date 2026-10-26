<script setup lang="ts">
/**
 * SnSplitterPanel — panel inside SnSplitter (naive-ui n-splitter-panel parity).
 *
 * Renders as a multi-root fragment: its divider (every panel after the first)
 * followed by the panel body, so both become direct flex items of the
 * splitter container and percent sizes stay exact. Size (percent width or
 * height) is owned by the parent splitter through the injection context.
 */
import { computed, inject, onBeforeUnmount } from 'vue';
import { SN_SPLITTER_INJECTION_KEY } from './splitter-context';
import type { SnSplitterBoundaryAria } from './splitter-context';
import type { SnSplitterPanelPublicProps } from './splitter-context';

defineOptions({ name: 'SnSplitterPanel', inheritAttrs: false });

const props = defineProps<SnSplitterPanelPublicProps>();

const emit = defineEmits<{
  /** v-model:collapsed sync (collapse snap / expand restore / host change). */
  (e: 'update:collapsed', collapsed: boolean): void;
}>();

defineSlots<{
  /** Panel content. */
  default?(): unknown;
}>();

const api = inject(SN_SPLITTER_INJECTION_KEY);

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

const dividerAria = computed<SnSplitterBoundaryAria | null>(() =>
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
    class="sn-splitter__divider"
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
    <span class="sn-splitter__divider-line" />
  </div>
  <div class="sn-splitter__panel" :style="bodyStyle" v-bind="$attrs">
    <slot />
  </div>
</template>

<style scoped>
.sn-splitter__panel {
  flex: 0 1 auto;
  min-width: 0;
  min-height: 0;
  box-sizing: border-box;
  overflow: hidden;
}

/* Divider: the interactive bar between two panels. The visible grip line
   highlights on hover / focus / active drag (via the container's
   --dragging class); the hit area is wider than the line. */
.sn-splitter__divider {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: var(--sn-web-splitter-divider-size, 10px);
  padding: 0;
  border: none;
  background: transparent;
  cursor: col-resize;
  touch-action: none;
  outline: none;
}

.sn-splitter__divider-line {
  width: var(--sn-web-splitter-divider-line-size, 2px);
  height: 100%;
  background-color: var(--sn-web-splitter-divider-line-color, var(--sn-web-color-border-default));
  transition: background-color 0.15s ease;
}

.sn-splitter__divider:hover .sn-splitter__divider-line,
.sn-splitter__divider:focus-visible .sn-splitter__divider-line,
.sn-splitter--dragging .sn-splitter__divider-line {
  background-color: var(
    --sn-web-splitter-divider-line-color-active,
    var(--sn-web-color-action-primary)
  );
}

.sn-splitter__divider:focus-visible {
  box-shadow: var(--sn-web-focus-ring, 0 0 0 3px rgba(22, 119, 255, 0.15));
}

.sn-splitter__divider[aria-disabled='true'] {
  cursor: default;
}

/* Vertical container: the divider is a horizontal bar across the column. */
.sn-splitter--vertical .sn-splitter__divider {
  width: auto;
  height: var(--sn-web-splitter-divider-size, 10px);
  cursor: row-resize;
}

.sn-splitter--vertical .sn-splitter__divider-line {
  width: 100%;
  height: var(--sn-web-splitter-divider-line-size, 2px);
}
</style>
