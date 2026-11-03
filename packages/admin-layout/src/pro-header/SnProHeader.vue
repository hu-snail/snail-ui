<script setup lang="ts">
/**
 * SnProHeader — admin top bar (top navigation component of @snui/admin-layout).
 *
 * One row, three roles depending on the layout mode the parent orchestrates:
 *   - side:  collapse toggle + breadcrumb + actions slot
 *   - top:   brand + horizontal menu + actions slot
 *   - mix:   brand + horizontal (top-level) menu + actions slot
 *            (the sider below shows the active top item's children)
 *
 * Brand area (logo + title) is opt-in via `showBrand` — side mode keeps the
 * brand in the sider instead. When `menus` is present the horizontal menu
 * wins the middle column; otherwise the breadcrumb renders (top/mix breadcrumb
 * lives in the layout's content strip instead).
 */
import { PanelLeft } from 'lucide-vue-next';
import { SnBreadcrumb, SnBreadcrumbItem, SnMenu } from '@snui/vue-web';
import type { SnMenuOption } from '@snui/vue-web';
import SnProLogo from '../pro-logo/SnProLogo.vue';

defineOptions({ name: 'SnProHeader' });

const props = withDefaults(
  defineProps<{
    /** Render the brand area (top / mix modes). Default false. */
    showBrand?: boolean | undefined;
    /** Brand image URL (through to SnProLogo). */
    logo?: string | undefined;
    /** Brand title. */
    title?: string | undefined;
    /** Fallback brand letter. */
    mark?: string | undefined;
    /** Show the sider collapse toggle (side mode; mix/dual use the content
     * strip's toggle instead). Default true. */
    showCollapse?: boolean | undefined;
    /** Accessible label for the collapse toggle. Default '折叠侧边栏'. */
    collapseLabel?: string | undefined;
    /** Horizontal menu options (top / mix). Absent → breadcrumb column. */
    menus?: SnMenuOption[] | undefined;
    /** Selected menu key (controlled). */
    activeKey?: string | number | null | undefined;
    /** Breadcrumb labels (side mode; ignored while menus are shown). */
    breadcrumb?: string[] | undefined;
  }>(),
  {
    showBrand: false,
    logo: '',
    title: '',
    mark: 'S',
    showCollapse: true,
    collapseLabel: '折叠侧边栏',
    menus: () => [],
    activeKey: null,
    breadcrumb: () => [],
  },
);

const emit = defineEmits<{
  (e: 'select', key: string | number | null, item: SnMenuOption): void;
  (e: 'toggle-collapse'): void;
}>();

defineSlots<{
  /** Right-hand actions area (user dropdown, theme switch, …). */
  default?(): unknown;
  /** Middle column replacement (instead of menu / breadcrumb). */
  center?(): unknown;
  /** Brand content replacement (forwarded to SnProLogo default slot). */
  logo?(): unknown;
}>();
</script>

<template>
  <header class="sn-pro-header">
    <div v-if="showBrand" class="sn-pro-header__brand">
      <SnProLogo :logo="logo" :title="title" :mark="mark">
        <slot name="logo" />
      </SnProLogo>
    </div>

    <button
      v-if="showCollapse"
      type="button"
      class="sn-pro-header__toggle"
      :aria-label="collapseLabel"
      :title="collapseLabel"
      @click="emit('toggle-collapse')"
    >
      <PanelLeft :size="18" aria-hidden="true" />
    </button>

    <SnMenu
      v-if="props.menus.length > 0"
      class="sn-pro-header__menu"
      mode="horizontal"
      :options="props.menus"
      :value="props.activeKey"
      @select="(key, item) => emit('select', key, item)"
    />

    <div v-else class="sn-pro-header__center">
      <slot name="center">
        <SnBreadcrumb v-if="props.breadcrumb.length > 0" class="sn-pro-header__breadcrumb">
          <SnBreadcrumbItem v-for="item in props.breadcrumb" :key="item" :clickable="false">
            {{ item }}
          </SnBreadcrumbItem>
        </SnBreadcrumb>
      </slot>
    </div>

    <div class="sn-pro-header__actions">
      <slot />
    </div>
  </header>
</template>

<style scoped>
.sn-pro-header {
  display: flex;
  align-items: center;
  gap: var(--sn-web-spacing-4);
  box-sizing: border-box;
  height: 56px;
  padding: 0 var(--sn-web-spacing-6);
  border-bottom: 1px solid var(--sn-web-color-border-subtle);
  background-color: var(--sn-web-color-background-elevated);
}

.sn-pro-header__brand {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.sn-pro-header__toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: var(--sn-web-radius-md);
  background: transparent;
  color: var(--sn-web-color-text-secondary);
  cursor: pointer;
}

.sn-pro-header__toggle:hover {
  background-color: var(--sn-web-color-background-subtle);
}

.sn-pro-header__menu {
  flex: 1;
  min-width: 0;
}

.sn-pro-header__center {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.sn-pro-header__breadcrumb {
  color: var(--sn-web-color-text-tertiary);
}

.sn-pro-header__actions {
  display: flex;
  align-items: center;
  gap: var(--sn-web-spacing-3);
  flex-shrink: 0;
  margin-left: auto;
}
</style>
