<script setup lang="ts">
/**
 * Authenticated shell.
 *
 * Layout geometry (brand / sider / header / collapse / breadcrumb strip),
 * the layout-shape settings drawer and the visited-route tab bar all come
 * from @snui/admin-layout's SnProLayout — this file keeps only the host
 * wiring that is business: menu mapping from the backend tree, select →
 * router navigation, i18n labels, the visited-tab list and the header
 * session controls (logout flow).
 */
import { computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import {
  SnProLayout,
  type SnProPrimaryColor,
  type SnProSettingsLabels,
  type SnProTabItem,
} from '@snui/admin-layout';
import { useAppStore, AFFIX_TAB_KEY } from '@/stores/app';
import { useAuthStore } from '@/stores/auth';
import { menuToNavOptions } from '@/router/dynamic';
import { resetDynamicRoutes } from '@/router/guard';
import { PRIMARY_PRESETS } from '@/theme/presets';
import HeaderControls from '@/components/HeaderControls.vue';

const appStore = useAppStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const { siderCollapsed, visitedKeys } = storeToRefs(appStore);

const menuOptions = computed(() => menuToNavOptions(authStore.menu, (key) => t(key)));
const activeKey = computed(() => (typeof route.name === 'string' ? route.name : null));

/** Flat key → path map from the menu tree, for SnProLayout select → navigation. */
const pathByKey = computed(() => {
  const map = new Map<string, string>();
  const walk = (nodes: typeof authStore.menu): void => {
    for (const node of nodes) {
      if (node.path !== undefined) map.set(node.key, node.path);
      if (node.children !== undefined) walk(node.children);
    }
  };
  walk(authStore.menu);
  return map;
});

/** Top-level groups start expanded; SnProLayout forwards the state to SnMenu. */
const expandedKeys = ref<string[]>([]);
watch(
  () => authStore.menu,
  (menu) => {
    expandedKeys.value = menu
      .filter((node) => (node.children?.length ?? 0) > 0)
      .map((node) => node.key);
  },
  { immediate: true },
);

const breadcrumbItems = computed(() => {
  const items: string[] = [];
  if (typeof route.meta.parentI18nKey === 'string') items.push(t(route.meta.parentI18nKey));
  if (typeof route.meta.i18nKey === 'string') items.push(t(route.meta.i18nKey));
  return items;
});

// ── Visited-route tab bar ─────────────────────────────────────────────────
/** Live-localized labels for every menu key (persisted keys carry no copy). */
const labelByKey = computed(() => {
  const map = new Map<string, string>();
  const walk = (nodes: typeof authStore.menu): void => {
    for (const node of nodes) {
      map.set(node.key, t(node.i18nKey));
      if (node.children !== undefined) walk(node.children);
    }
  };
  walk(authStore.menu);
  return map;
});

const tabs = computed<SnProTabItem[]>(() =>
  visitedKeys.value
    .filter((key) => labelByKey.value.has(key))
    .map((key) => ({ key, label: labelByKey.value.get(key)!, closable: key !== AFFIX_TAB_KEY })),
);

/** Only menu routes become tabs (login/register never enter the shell). */
watch(
  () => route.name,
  (name) => {
    if (typeof name === 'string' && route.meta.i18nKey !== undefined) appStore.addVisited(name);
  },
  { immediate: true },
);

function onTabSelect(key: string): void {
  const path = pathByKey.value.get(key);
  if (path !== undefined && path !== route.path) void router.push(path);
}

function onTabClose(key: string): void {
  const index = visitedKeys.value.indexOf(key);
  appStore.removeVisited(key);
  if (route.name !== key) return;
  const neighbor = visitedKeys.value[index - 1] ?? visitedKeys.value[index] ?? AFFIX_TAB_KEY;
  const path = pathByKey.value.get(neighbor);
  if (path !== undefined) void router.push(path);
}

// ── Settings drawer (persisted through store actions) ────────────────────
const layoutModel = computed({
  get: () => appStore.layout,
  set: (mode) => appStore.setLayout(mode),
});
const modeModel = computed({
  get: () => appStore.mode,
  set: (mode) => appStore.setMode(mode),
});
const primaryIdModel = computed({
  get: () => appStore.primaryId,
  set: (id) => appStore.setPrimary(id),
});
const tabTypeModel = computed({
  get: () => appStore.tabType,
  set: (type) => appStore.setTabType(type),
});

const primaryColors = computed<SnProPrimaryColor[]>(() =>
  PRIMARY_PRESETS.map((preset) => ({ id: preset.id, color: preset.primary })),
);

const settingsLabels = computed<SnProSettingsLabels>(() => ({
  title: t('settings.title'),
  layout: t('settings.layout'),
  layoutSide: t('settings.layoutSide'),
  layoutTop: t('settings.layoutTop'),
  layoutMix: t('settings.layoutMix'),
  layoutDual: t('settings.layoutDual'),
  mode: t('settings.mode'),
  light: t('settings.light'),
  dark: t('settings.dark'),
  primary: t('settings.primary'),
  tabStyle: t('settings.tabStyle'),
  tabLine: t('settings.tabLine'),
  tabCard: t('settings.tabCard'),
  tabBar: t('settings.tabBar'),
  tabSegment: t('settings.tabSegment'),
  tabChrome: t('settings.tabChrome'),
}));

function onSelect(key: string | number | null): void {
  if (typeof key !== 'string') return;
  const path = pathByKey.value.get(key);
  if (path !== undefined && path !== route.path) void router.push(path);
}

function onExpandedChange(keys: Array<string | number>): void {
  expandedKeys.value = keys.map(String);
}

async function handleLogout(): Promise<void> {
  await authStore.logout();
  appStore.clearVisited();
  resetDynamicRoutes(router);
  await router.push({ name: 'login' });
}
</script>

<template>
  <SnProLayout
    v-model:layout="layoutModel"
    v-model:collapsed="siderCollapsed"
    v-model:mode="modeModel"
    v-model:primary-id="primaryIdModel"
    v-model:tab-type="tabTypeModel"
    :title="t('app.title')"
    :menus="menuOptions"
    :active-key="activeKey"
    :expanded-keys="expandedKeys"
    :breadcrumb="breadcrumbItems"
    :collapse-label="siderCollapsed ? t('header.expand') : t('header.collapse')"
    show-settings
    :settings-label="t('settings.title')"
    :settings-labels="settingsLabels"
    :primary-colors="primaryColors"
    show-tabs
    :tabs="tabs"
    @select="onSelect"
    @update:expanded-keys="onExpandedChange"
    @tab-select="onTabSelect"
    @tab-close="onTabClose"
  >
    <template #actions>
      <HeaderControls @logout="handleLogout" />
    </template>

    <RouterView />
  </SnProLayout>
</template>
