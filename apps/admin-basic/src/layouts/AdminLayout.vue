<script setup lang="ts">
/**
 * Authenticated shell.
 *
 * Layout geometry (brand / sider / header / collapse / breadcrumb strip)
 * comes from @snui/admin-layout's SnProLayout — this file keeps only the
 * host wiring that is business: menu mapping from the backend tree,
 * select → router navigation, i18n labels, breadcrumb from route meta, and
 * the header session controls (logout flow).
 */
import { computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { SnProLayout } from '@snui/admin-layout';
import { useAppStore } from '@/stores/app';
import { useAuthStore } from '@/stores/auth';
import { menuToNavOptions } from '@/router/dynamic';
import { resetDynamicRoutes } from '@/router/guard';
import HeaderControls from '@/components/HeaderControls.vue';

const appStore = useAppStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const { siderCollapsed } = storeToRefs(appStore);

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
    expandedKeys.value = menu.filter((node) => (node.children?.length ?? 0) > 0).map((node) => node.key);
  },
  { immediate: true },
);

const breadcrumbItems = computed(() => {
  const items: string[] = [];
  if (typeof route.meta.parentI18nKey === 'string') items.push(t(route.meta.parentI18nKey));
  if (typeof route.meta.i18nKey === 'string') items.push(t(route.meta.i18nKey));
  return items;
});

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
  resetDynamicRoutes(router);
  await router.push({ name: 'login' });
}
</script>

<template>
  <SnProLayout
    v-model:collapsed="siderCollapsed"
    :title="t('app.title')"
    :menus="menuOptions"
    :active-key="activeKey"
    :expanded-keys="expandedKeys"
    :breadcrumb="breadcrumbItems"
    :collapse-label="siderCollapsed ? t('header.expand') : t('header.collapse')"
    @select="onSelect"
    @update:expanded-keys="onExpandedChange"
  >
    <template #actions>
      <HeaderControls @logout="handleLogout" />
    </template>

    <RouterView />
  </SnProLayout>
</template>
