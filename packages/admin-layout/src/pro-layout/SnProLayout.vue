<script setup lang="ts">
/**
 * SnProLayout — admin shell orchestrator (main component of @snui/admin-layout).
 *
 * Layout-only by design (ADR-0006 + README 职责边界): area composition,
 * shape switching, collapse state, breadcrumb display. No auth, no requests,
 * no store, no route registration — menus come in as `SnMenuOption[]`
 * (static-route derived via `routesToMenuOptions`, or host-mapped backend
 * data) and a click only emits `select(key)`; the host navigates.
 *
 * Modes (README「布局形态」):
 *   side — sider(brand + vertical menu) + header(toggle/breadcrumb/actions)
 *   top  — header(brand + horizontal menu + actions) + content
 *   mix  — header(brand + horizontal top-level menu) + sider(active top's
 *          children, brandless) + content strip(toggle/breadcrumb)
 *   dual — icon rail(top-level, brand mark) + secondary menu column +
 *          content strip; collapse folds the secondary column
 *
 * Breadcrumb: explicit `breadcrumb` prop wins; otherwise auto-derived from
 * the menu path of `activeKey` (`menuPathTo`).
 *
 * Usage (drop-in replacement of a host layout.vue):
 *   <SnProLayout v-model:layout="mode" :menus="menus" :active-key="route.name"
 *                @select="(key) => router.push({ name: key })">
 *     <RouterView />
 *   </SnProLayout>
 */
import { computed, ref } from 'vue';
import type { SnMenuOption } from '@snui/vue-web';
import SnProSider from '../pro-sider/SnProSider.vue';
import SnProHeader from '../pro-header/SnProHeader.vue';
import SnProLayoutStrip from './SnProLayoutStrip.vue';
import SnProTabbar from '../pro-tabbar/SnProTabbar.vue';
import SnProSettings from '../pro-settings/SnProSettings.vue';
import {
  findTopAncestorKey,
  menuChildrenOf,
  menuPathTo,
  stripMenuChildren,
} from '../menu/sn-admin-menu';
import type {
  SnProLayoutMode,
  SnProPrimaryColor,
  SnProSettingsLabels,
  SnProTabItem,
  SnProTabType,
} from './sn-pro-layout-types';

defineOptions({ name: 'SnProLayout' });

const props = withDefaults(
  defineProps<{
    /** Layout shape. `v-model:layout`. Default 'side'. */
    layout?: SnProLayoutMode | undefined;
    /** Brand image URL (through to SnProLogo). */
    logo?: string | undefined;
    /** Brand title. */
    title?: string | undefined;
    /** Fallback brand letter. */
    mark?: string | undefined;
    /** Menu tree — static-route derived or backend-mapped (see README). */
    menus?: SnMenuOption[] | undefined;
    /** Selected menu key (controlled; usually `route.name`). */
    activeKey?: string | number | null | undefined;
    /** Single-open submenus. Default false. */
    accordion?: boolean | undefined;
    /** Expanded submenu keys (controlled passthrough; uncontrolled when omitted). */
    expandedKeys?: Array<string | number> | undefined;
    /** Sider collapsed state. `v-model:collapsed`; uncontrolled when omitted. */
    collapsed?: boolean | undefined;
    /** Sider expanded width (px). Default 224. */
    siderWidth?: number | undefined;
    /** Sider collapsed width (px). Default 56. */
    siderCollapsedWidth?: number | undefined;
    /** Pin the shell to the viewport (height 100vh, internal scrolling);
     * false → height 100% for embedding. Default true. */
    fixed?: boolean | undefined;
    /** Show the sider collapse toggle. Default true. */
    showCollapse?: boolean | undefined;
    /** Dark admin surface on the sider. Default false. */
    invertedSider?: boolean | undefined;
    /** Accessible label for the collapse toggles (header button + strip
     * button). Default '折叠侧边栏'. */
    collapseLabel?: string | undefined;
    /** Breadcrumb labels. Omit → auto-derived from the active menu path. */
    breadcrumb?: string[] | undefined;
    /** Show the settings gear in the header (opens the preferences drawer).
     * Default false. */
    showSettings?: boolean | undefined;
    /** Accessible label for the settings gear. Default '布局设置'. */
    settingsLabel?: string | undefined;
    /** Localized copy for the settings panel; unspecified keys fall back to
     * the built-in defaults. */
    settingsLabels?: Partial<SnProSettingsLabels> | undefined;
    /** Theme mode forwarded to the settings panel. Absent → its section
     * hides. `v-model:mode`. */
    mode?: 'light' | 'dark' | undefined;
    /** Selected primary color id forwarded to the settings panel. Absent →
     * its section hides. `v-model:primaryId`. */
    primaryId?: string | undefined;
    /** Swatches offered by the settings panel. */
    primaryColors?: SnProPrimaryColor[] | undefined;
    /** Show the visited-route tab bar under the header. Default false. */
    showTabs?: boolean | undefined;
    /** Tab bar entries (host-tracked visited routes). */
    tabs?: SnProTabItem[] | undefined;
    /** Tab strip style, switchable from the settings panel.
     * `v-model:tabType`. Default 'chrome'. */
    tabType?: SnProTabType | undefined;
  }>(),
  {
    layout: 'side',
    logo: '',
    title: '',
    mark: 'S',
    menus: () => [],
    activeKey: null,
    accordion: false,
    siderWidth: 224,
    siderCollapsedWidth: 56,
    fixed: true,
    showCollapse: true,
    invertedSider: false,
    collapseLabel: '折叠侧边栏',
    // Boolean casting would turn an omitted prop into `false` and silently
    // force controlled mode. Explicit undefined keeps it uncontrolled
    // (same trick as @snui/vue-web SnLayoutSider, mirroring naive-ui).
    collapsed: undefined,
    showSettings: false,
    settingsLabel: '布局设置',
    primaryColors: () => [],
    showTabs: false,
    tabs: () => [],
    tabType: 'chrome',
  },
);
const emit = defineEmits<{
  (e: 'update:layout', mode: SnProLayoutMode): void;
  (e: 'update:collapsed', collapsed: boolean): void;
  (e: 'update:expandedKeys', keys: Array<string | number>): void;
  /** Menu click — the HOST navigates (router.push / perm check / …). */
  (e: 'select', key: string | number | null, item: SnMenuOption): void;
  (e: 'update:mode', mode: 'light' | 'dark'): void;
  (e: 'update:primaryId', id: string): void;
  (e: 'update:tabType', type: SnProTabType): void;
  /** Tab-bar click — the HOST navigates. */
  (e: 'tab-select', key: string): void;
  /** Tab close click — the HOST decides what closing means. */
  (e: 'tab-close', key: string): void;
}>();

defineSlots<{
  /** Routed content (usually `<RouterView />`). */
  default?(): unknown;
  /** Right-hand header actions area (user menu, theme switch, …). */
  actions?(): unknown;
  /** Brand content replacement (forwarded to SnProLogo default slot). */
  logo?(): unknown;
  /** Optional footer under the content area. */
  footer?(): unknown;
}>();

// ── Collapse: v-model:collapsed with an uncontrolled fallback ────────────
const innerCollapsed = ref(false);
const isCollapsed = computed(() => props.collapsed ?? innerCollapsed.value);
function toggleCollapsed(): void {
  const next = !isCollapsed.value;
  innerCollapsed.value = next;
  emit('update:collapsed', next);
}

// ── Menu derivation per mode ──────────────────────────────────────────────
/** Top-level ancestor of the active key — drives mix/dual sub-menus. */
const activeTopKey = computed(() => findTopAncestorKey(props.menus, props.activeKey));

/** Vertical menu content: full tree in side mode, active top's children in
 * mix/dual (empty → the secondary sider disappears, vben-style). */
const siderMenus = computed(() =>
  props.layout === 'side' ? props.menus : menuChildrenOf(props.menus, activeTopKey.value),
);

/** Icon rail never shows flyouts — its children live in the second column. */
const railMenus = computed(() => stripMenuChildren(props.menus));

const hasSiderMenu = computed(() => siderMenus.value.length > 0);
/** Typed conditional bind for the siders' controlled expandedKeys: the prop
 * must be omitted (not `undefined`) to keep SnMenu uncontrolled. */
const expandedKeysProps = computed<Record<string, never> | { expandedKeys: Array<string | number> }>(() =>
  props.expandedKeys !== undefined ? { expandedKeys: props.expandedKeys } : {},
);

// ── Breadcrumb: explicit prop wins, else derive from the menu path ───────
const breadcrumbItems = computed<string[]>(() => {
  if (props.breadcrumb !== undefined) return props.breadcrumb;
  return menuPathTo(props.menus, props.activeKey).map((node) => node.label);
});

// ── Content strip (top/mix/dual): toggle + breadcrumb above the content ──
const stripToggleVisible = computed(
  () => props.showCollapse && (props.layout === 'mix' || props.layout === 'dual') && hasSiderMenu.value,
);
const showStrip = computed(
  () => props.layout !== 'side' && (stripToggleVisible.value || breadcrumbItems.value.length > 0),
);

function onSelect(key: string | number | null, item: SnMenuOption): void {
  emit('select', key, item);
}

// ── Settings drawer + tab bar forwards ────────────────────────────────────
const settingsVisible = ref(false);
function onTabSelect(key: string): void {
  emit('tab-select', key);
}
function onTabClose(key: string): void {
  emit('tab-close', key);
}
</script>

<template>
  <div
    class="sn-pro-layout"
    :class="[`sn-pro-layout--${layout}`, { 'sn-pro-layout--fixed': fixed }]"
  >
    <!-- ══ side: sider + header stack ══ -->
    <template v-if="layout === 'side'">
      <SnProSider
        :menus="menus"
        :active-key="activeKey"
        :accordion="accordion"
        v-bind="expandedKeysProps"
        :collapsed="isCollapsed"
        :width="siderWidth"
        :collapsed-width="siderCollapsedWidth"
        :inverted="invertedSider"
        :logo="logo"
        :title="title"
        :mark="mark"
        @select="onSelect"
        @update:expanded-keys="(keys) => emit('update:expandedKeys', keys)"
      >
        <slot name="logo" />
      </SnProSider>

      <section class="sn-pro-layout__body">
        <SnProHeader
          :show-collapse="showCollapse"
          :collapse-label="collapseLabel"
          :breadcrumb="breadcrumbItems"
          :show-settings="showSettings"
          :settings-label="settingsLabel"
          @toggle-collapse="toggleCollapsed"
          @select="onSelect"
          @open-settings="settingsVisible = true"
        >
          <slot name="actions" />
        </SnProHeader>
        <SnProTabbar
          v-if="showTabs"
          :tabs="tabs"
          :active-key="activeKey"
          :type="tabType"
          @update:active-key="onTabSelect"
          @close="onTabClose"
        />
        <div class="sn-pro-layout__content">
          <slot />
        </div>
        <footer v-if="$slots.footer" class="sn-pro-layout__footer">
          <slot name="footer" />
        </footer>
      </section>
    </template>

    <!-- ══ top: brand + horizontal menu header ══ -->
    <template v-else-if="layout === 'top'">
      <SnProHeader
        show-brand
        :logo="logo"
        :title="title"
        :mark="mark"
        :show-collapse="false"
        :menus="menus"
        :active-key="activeKey"
        :show-settings="showSettings"
        :settings-label="settingsLabel"
        @select="onSelect"
        @open-settings="settingsVisible = true"
      >
        <slot name="actions" />
        <template #logo><slot name="logo" /></template>
      </SnProHeader>
      <section class="sn-pro-layout__body">
        <SnProLayoutStrip v-if="showStrip" :breadcrumb="breadcrumbItems" />
        <SnProTabbar
          v-if="showTabs"
          :tabs="tabs"
          :active-key="activeKey"
          :type="tabType"
          @update:active-key="onTabSelect"
          @close="onTabClose"
        />
        <div class="sn-pro-layout__content">
          <slot />
        </div>
        <footer v-if="$slots.footer" class="sn-pro-layout__footer">
          <slot name="footer" />
        </footer>
      </section>
    </template>

    <!-- ══ mix: horizontal top menu + children sider ══ -->
    <template v-else-if="layout === 'mix'">
      <SnProHeader
        show-brand
        :logo="logo"
        :title="title"
        :mark="mark"
        :show-collapse="false"
        :menus="menus"
        :active-key="activeKey"
        :show-settings="showSettings"
        :settings-label="settingsLabel"
        @select="onSelect"
        @open-settings="settingsVisible = true"
      >
        <slot name="actions" />
        <template #logo><slot name="logo" /></template>
      </SnProHeader>
      <div class="sn-pro-layout__row">
        <SnProSider
          v-if="hasSiderMenu"
          :show-brand="false"
          :menus="siderMenus"
          :active-key="activeKey"
          :accordion="accordion"
          v-bind="expandedKeysProps"
          :collapsed="isCollapsed"
          :width="siderWidth"
          :collapsed-width="siderCollapsedWidth"
          :inverted="invertedSider"
          @select="onSelect"
          @update:expanded-keys="(keys) => emit('update:expandedKeys', keys)"
        />
        <section class="sn-pro-layout__body">
          <SnProLayoutStrip
            v-if="showStrip"
            :show-toggle="stripToggleVisible"
            :toggle-label="collapseLabel"
            :breadcrumb="breadcrumbItems"
            @toggle-collapse="toggleCollapsed"
          />
          <SnProTabbar
            v-if="showTabs"
            :tabs="tabs"
            :active-key="activeKey"
            :type="tabType"
            @update:active-key="onTabSelect"
            @close="onTabClose"
          />
          <div class="sn-pro-layout__content">
            <slot />
          </div>
          <footer v-if="$slots.footer" class="sn-pro-layout__footer">
            <slot name="footer" />
          </footer>
        </section>
      </div>
    </template>

    <!-- ══ dual: icon rail + secondary column ══ -->
    <template v-else>
      <SnProSider
        class="sn-pro-layout__rail"
        :menus="railMenus"
        :active-key="activeTopKey"
        :collapsed="true"
        :collapsed-width="siderCollapsedWidth"
        :inverted="invertedSider"
        :logo="logo"
        :title="title"
        :mark="mark"
        @select="onSelect"
      >
        <slot name="logo" />
      </SnProSider>
      <SnProSider
        v-if="hasSiderMenu"
        :show-brand="false"
        :menus="siderMenus"
        :active-key="activeKey"
        :accordion="accordion"
        v-bind="expandedKeysProps"
        :collapsed="isCollapsed"
        :width="siderWidth"
        :collapsed-width="siderCollapsedWidth"
        :inverted="invertedSider"
        @select="onSelect"
        @update:expanded-keys="(keys) => emit('update:expandedKeys', keys)"
      />
      <section class="sn-pro-layout__body">
        <SnProLayoutStrip
          v-if="showStrip"
          :show-toggle="stripToggleVisible"
          :toggle-label="collapseLabel"
          :breadcrumb="breadcrumbItems"
          @toggle-collapse="toggleCollapsed"
        />
        <SnProTabbar
          v-if="showTabs"
          :tabs="tabs"
          :active-key="activeKey"
          :type="tabType"
          @update:active-key="onTabSelect"
          @close="onTabClose"
        />
        <div class="sn-pro-layout__content">
          <slot />
        </div>
        <footer v-if="$slots.footer" class="sn-pro-layout__footer">
          <slot name="footer" />
        </footer>
      </section>
    </template>

    <!-- ══ preferences drawer (shared across every shape) ══ -->
    <SnProSettings
      v-model:show="settingsVisible"
      :layout="layout"
      :mode="mode"
      :primary-id="primaryId"
      :primary-colors="primaryColors"
      :tab-type="showTabs ? tabType : undefined"
      :labels="settingsLabels"
      @update:layout="(mode) => emit('update:layout', mode)"
      @update:mode="(mode) => emit('update:mode', mode)"
      @update:primary-id="(id) => emit('update:primaryId', id)"
      @update:tab-type="(type) => emit('update:tabType', type)"
    />
  </div>
</template>

<style scoped>
.sn-pro-layout {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  min-height: 0;
}

/* Fixed = a full-viewport app shell; unset = embeddable (height: 100%). */
.sn-pro-layout--fixed {
  height: 100vh;
}

.sn-pro-layout--top,
.sn-pro-layout--mix {
  flex-direction: column;
}

.sn-pro-layout__row {
  display: flex;
  flex: 1;
  min-height: 0;
}

.sn-pro-layout__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  min-height: 0;
}

.sn-pro-layout__content {
  flex: 1;
  overflow-y: auto;
  padding: var(--sn-web-spacing-6);
  background-color: var(--sn-web-color-background-surface);
}

.sn-pro-layout__footer {
  flex-shrink: 0;
  box-sizing: border-box;
  padding: var(--sn-web-spacing-4) var(--sn-web-spacing-6);
  border-top: 1px solid var(--sn-web-color-border-subtle);
  background-color: var(--sn-web-color-background-elevated);
}
</style>
