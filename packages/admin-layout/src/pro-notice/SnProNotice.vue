<script setup lang="ts">
/**
 * SnProNotice — message-notification bell of @snui/admin-layout.
 *
 * Shared layout piece: the classic layout puts it in the content header next
 * to the search box, and any other layout can mount it on its own.
 *
 * Deliberately self-contained: the panel is a plain absolutely-positioned
 * element inside this component (no teleport, no portal), so hosts get a
 * predictable stacking context and tests can assert the real DOM. The
 * `#panel` slot replaces the list body for a fully custom notification UI.
 *
 * Boundary (ADR-0006): the package never fetches notifications. `items` come
 * from the host, a row click only emits `select(key, item)`, and "mark all as
 * read" only emits `read-all` so the host owns the request + the unread state.
 */
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { Bell } from 'lucide-vue-next';
import type { SnProNoticeItem } from './sn-pro-notice-types';

defineOptions({ name: 'SnProNotice' });

const props = withDefaults(
  defineProps<{
    /** Unread count. `0` (or omitted) hides the badge. */
    count?: number | undefined;
    /** Badge cap — higher counts render as `${max}+`. Default 99. */
    max?: number | undefined;
    /** Notification rows (host-owned data). */
    items?: SnProNoticeItem[] | undefined;
    /** Accessible label of the bell button. Default '消息通知'. */
    label?: string | undefined;
    /** Panel heading. Default '消息通知'. */
    panelTitle?: string | undefined;
    /** "Mark all read" action copy. Default '全部已读'. */
    readAllText?: string | undefined;
    /** Copy shown when there are no rows. Default '暂无消息'. */
    emptyText?: string | undefined;
  }>(),
  {
    count: 0,
    max: 99,
    items: () => [],
    label: '消息通知',
    panelTitle: '消息通知',
    readAllText: '全部已读',
    emptyText: '暂无消息',
  },
);

const emit = defineEmits<{
  /** A row was activated — the HOST navigates / marks it read. */
  (e: 'select', key: string | number, item: SnProNoticeItem): void;
  /** The "mark all read" action was triggered — the HOST performs it. */
  (e: 'read-all'): void;
}>();

defineSlots<{
  /** Panel body replacement (keeps the heading + read-all row). */
  panel?(): unknown;
}>();

// ── Panel open state ─────────────────────────────────────────────────────
const open = ref(false);
const rootRef = ref<HTMLElement | null>(null);

/** Badge text: hidden at 0, capped at `max` plus a "+" marker. */
const badgeText = computed(() => {
  if (props.count <= 0) return '';
  return props.count > props.max ? `${props.max}+` : String(props.count);
});

function toggle(): void {
  open.value = !open.value;
}

function close(): void {
  open.value = false;
}

function onItemClick(item: SnProNoticeItem): void {
  emit('select', item.key, item);
}

/**
 * Click-outside dismisses the panel. Registered only while open so a closed
 * bell costs no listener; removed on close AND on unmount (§42/§82 — no
 * listener outlives the component).
 */
function onDocumentMousedown(event: MouseEvent): void {
  const root = rootRef.value;
  const target = event.target;
  if (root !== null && target instanceof Node && root.contains(target)) return;
  close();
}

watch(open, (isOpen) => {
  if (isOpen) document.addEventListener('mousedown', onDocumentMousedown);
  else document.removeEventListener('mousedown', onDocumentMousedown);
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocumentMousedown);
});

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && open.value) close();
}
</script>

<template>
  <div
    ref="rootRef"
    class="sn-pro-notice"
    :class="{ 'sn-pro-notice--open': open }"
    @keydown="onKeydown"
  >
    <button
      type="button"
      class="sn-pro-notice__trigger"
      :aria-label="props.label"
      :title="props.label"
      aria-haspopup="dialog"
      :aria-expanded="open ? 'true' : 'false'"
      @click="toggle"
    >
      <Bell :size="18" aria-hidden="true" />
      <span v-if="badgeText !== ''" class="sn-pro-notice__badge">{{ badgeText }}</span>
    </button>

    <div v-if="open" class="sn-pro-notice__panel" role="dialog" :aria-label="props.panelTitle">
      <div class="sn-pro-notice__head">
        <span class="sn-pro-notice__title">{{ props.panelTitle }}</span>
        <button
          v-if="props.items.length > 0"
          type="button"
          class="sn-pro-notice__read-all"
          @click="emit('read-all')"
        >
          {{ props.readAllText }}
        </button>
      </div>

      <slot name="panel">
        <ul class="sn-pro-notice__list">
          <li
            v-for="item in props.items"
            :key="item.key"
            class="sn-pro-notice__item"
            @click="onItemClick(item)"
          >
            <span class="sn-pro-notice__item-main">
              <span class="sn-pro-notice__item-label">{{ item.label }}</span>
              <span v-if="item.description !== undefined" class="sn-pro-notice__item-desc">
                {{ item.description }}
              </span>
            </span>
            <span v-if="item.time !== undefined" class="sn-pro-notice__item-time">
              {{ item.time }}
            </span>
          </li>
        </ul>
        <p v-if="props.items.length === 0" class="sn-pro-notice__empty">{{ props.emptyText }}</p>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.sn-pro-notice {
  position: relative;
  display: inline-flex;
}

.sn-pro-notice__trigger {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: var(--sn-web-radius-md);
  background: transparent;
  color: var(--sn-web-color-text-secondary);
  cursor: pointer;
}

.sn-pro-notice__trigger:hover {
  background-color: var(--sn-web-color-background-subtle);
}

.sn-pro-notice__badge {
  position: absolute;
  top: 2px;
  right: 0;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: var(--sn-web-radius-full);
  background-color: var(--sn-web-color-action-danger, #d03050);
  color: var(--sn-web-color-text-on-primary);
  font-size: 10px;
  line-height: 16px;
  text-align: center;
}

.sn-pro-notice__panel {
  position: absolute;
  top: calc(100% + var(--sn-web-spacing-2));
  right: 0;
  z-index: 20;
  box-sizing: border-box;
  width: 300px;
  padding: var(--sn-web-spacing-2);
  border: 1px solid var(--sn-web-color-border-subtle);
  border-radius: var(--sn-web-radius-md);
  background-color: var(--sn-web-color-background-elevated);
  box-shadow: var(--sn-web-shadow-lg, 0 6px 16px rgba(0, 0, 0, 0.12));
}

.sn-pro-notice__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sn-web-spacing-3);
  padding: var(--sn-web-spacing-2) var(--sn-web-spacing-3);
}

.sn-pro-notice__title {
  font-size: var(--sn-web-font-size-sm);
  font-weight: var(--sn-web-font-weight-semibold);
  color: var(--sn-web-color-text-primary);
}

.sn-pro-notice__read-all {
  padding: 0;
  border: none;
  background: transparent;
  color: var(--sn-web-color-action-primary);
  font-size: var(--sn-web-font-size-xs);
  cursor: pointer;
}

.sn-pro-notice__list {
  max-height: 280px;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  list-style: none;
}

.sn-pro-notice__item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--sn-web-spacing-3);
  padding: var(--sn-web-spacing-2) var(--sn-web-spacing-3);
  border-radius: var(--sn-web-radius-sm);
  cursor: pointer;
}

.sn-pro-notice__item:hover {
  background-color: var(--sn-web-color-background-subtle);
}

.sn-pro-notice__item-main {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.sn-pro-notice__item-label {
  overflow: hidden;
  font-size: var(--sn-web-font-size-sm);
  color: var(--sn-web-color-text-primary);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sn-pro-notice__item-desc,
.sn-pro-notice__item-time {
  font-size: var(--sn-web-font-size-xs);
  color: var(--sn-web-color-text-tertiary);
}

.sn-pro-notice__item-time {
  flex-shrink: 0;
}

.sn-pro-notice__empty {
  margin: 0;
  padding: var(--sn-web-spacing-3);
  font-size: var(--sn-web-font-size-sm);
  color: var(--sn-web-color-text-tertiary);
  text-align: center;
}
</style>
