<script setup lang="ts">
/**
 * Authenticated shell: fixed sidebar (brand + SnMenu from the backend menu
 * tree), header (collapse toggle + breadcrumb + HeaderControls), routed
 * content. Menu labels re-resolve through i18n on every language switch.
 */
import { computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { PanelLeft } from 'lucide-vue-next';
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
const activeKey = computed(() => (typeof route.name === 'string' ? route.name : ''));

/** Flat key → path map from the menu tree, for SnMenu selection → navigation. */
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

const expandedKeys = ref<string[]>([]);
watch(
  () => authStore.menu,
  (menu) => {
    expandedKeys.value = menu.filter((node) => (node.children?.length ?? 0) > 0).map((node) => node.key);
  },
  { immediate: true },
);

function onExpandedChange(keys: Array<string | number>): void {
  expandedKeys.value = keys.map(String);
}

const breadcrumbItems = computed(() => {
  const items: string[] = [];
  if (typeof route.meta.parentI18nKey === 'string') items.push(t(route.meta.parentI18nKey));
  if (typeof route.meta.i18nKey === 'string') items.push(t(route.meta.i18nKey));
  return items;
});

function onMenuSelect(key: string | number | null): void {
  if (typeof key !== 'string') return;
  const path = pathByKey.value.get(key);
  if (path !== undefined && path !== route.path) void router.push(path);
}

async function handleLogout(): Promise<void> {
  await authStore.logout();
  resetDynamicRoutes(router);
  await router.push({ name: 'login' });
}
</script>

<template>
  <div class="admin-shell">
    <aside class="admin-sider" :class="{ 'admin-sider--collapsed': siderCollapsed }">
      <div class="admin-sider__brand">
        <span class="admin-sider__logo" aria-hidden="true">S</span>
        <span v-if="!siderCollapsed" class="admin-sider__title">{{ t('app.title') }}</span>
      </div>
      <SnMenu
        class="admin-sider__menu"
        mode="vertical"
        :options="menuOptions"
        :value="activeKey"
        :collapsed="siderCollapsed"
        @update:value="onMenuSelect"
        @update:expanded-keys="onExpandedChange"
      />
    </aside>

    <div class="admin-body">
      <header class="admin-header">
        <button
          class="admin-header__collapse"
          :aria-label="siderCollapsed ? t('header.expand') : t('header.collapse')"
          @click="appStore.toggleSider()"
        >
          <PanelLeft :size="18" />
        </button>
        <SnBreadcrumb class="admin-header__breadcrumb">
          <SnBreadcrumbItem
            v-for="item in breadcrumbItems"
            :key="item"
            :clickable="false"
          >
            {{ item }}
          </SnBreadcrumbItem>
        </SnBreadcrumb>
        <HeaderControls @logout="handleLogout" />
      </header>

      <main class="admin-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.admin-shell {
  display: flex;
  height: 100%;
}

.admin-sider {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 240px;
  border-right: 1px solid var(--sn-web-color-border-subtle);
  background-color: var(--sn-web-color-background-elevated);
  transition: width 180ms ease;
  overflow: hidden;
}

.admin-sider--collapsed {
  width: 64px;
}

.admin-sider__brand {
  display: flex;
  align-items: center;
  gap: var(--sn-web-spacing-3);
  height: 56px;
  padding: 0 var(--sn-web-spacing-4);
  border-bottom: 1px solid var(--sn-web-color-border-subtle);
  white-space: nowrap;
}

.admin-sider__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: var(--sn-web-radius-md);
  background-color: var(--sn-web-color-action-primary);
  color: var(--sn-web-color-text-on-primary);
  font-weight: var(--sn-web-font-weight-bold);
}

.admin-sider__title {
  font-size: var(--sn-web-font-size-lg);
  font-weight: var(--sn-web-font-weight-semibold);
  color: var(--sn-web-color-text-primary);
}

.admin-sider__menu {
  flex: 1;
  overflow-y: auto;
}

.admin-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.admin-header {
  display: flex;
  align-items: center;
  gap: var(--sn-web-spacing-4);
  height: 56px;
  padding: 0 var(--sn-web-spacing-6);
  border-bottom: 1px solid var(--sn-web-color-border-subtle);
  background-color: var(--sn-web-color-background-elevated);
}

.admin-header__collapse {
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

.admin-header__collapse:hover {
  background-color: var(--sn-web-color-background-subtle);
}

.admin-header__breadcrumb {
  color: var(--sn-web-color-text-tertiary);
}

.admin-content {
  flex: 1;
  padding: var(--sn-web-spacing-6);
  overflow-y: auto;
  background-color: var(--sn-web-color-background-surface);
}
</style>
