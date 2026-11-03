<script setup lang="ts">
/**
 * Admin header controls: language dropdown and the user session dropdown.
 * Theme mode + primary color live in the layout settings drawer
 * (SnProLayout showSettings); logout flow stays in AdminLayout via the
 * `logout` event.
 */
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { LogOut, Languages } from 'lucide-vue-next';
import { useAppStore } from '@/stores/app';
import { useAuthStore } from '@/stores/auth';

const emit = defineEmits<{ logout: [] }>();

const appStore = useAppStore();
const authStore = useAuthStore();
const { t } = useI18n();

const localeOptions = [
  { key: 'zh-CN', label: '中文' },
  { key: 'en-US', label: 'English' },
];

const userOptions = computed(() => [
  { key: 'logout', label: t('common.logout'), icon: LogOut },
]);

function onSelectLocale(key: string | number): void {
  appStore.setLocale(key === 'en-US' ? 'en-US' : 'zh-CN');
}

function onSelectUser(key: string | number): void {
  if (key === 'logout') emit('logout');
}
</script>

<template>
  <div class="header-controls">
    <SnDropdown
      :options="localeOptions"
      trigger="click"
      placement="bottom-end"
      @select="onSelectLocale"
    >
      <SnButton size="small" text>
        <template #icon>
          <Languages :size="16" />
        </template>
        {{ appStore.locale === 'zh-CN' ? '中文' : 'English' }}
      </SnButton>
    </SnDropdown>

    <SnDropdown
      :options="userOptions"
      trigger="hover"
      placement="bottom-end"
      @select="onSelectUser"
    >
      <button class="header-controls__user">
        <SnAvatar :size="28" round>{{ authStore.user?.nickname.slice(0, 1) ?? '?' }}</SnAvatar>
        <span class="header-controls__username">{{ authStore.user?.nickname }}</span>
      </button>
    </SnDropdown>
  </div>
</template>

<style scoped>
.header-controls {
  display: flex;
  align-items: center;
  gap: var(--sn-web-spacing-4);
  margin-left: auto;
}

.header-controls__user {
  display: inline-flex;
  align-items: center;
  gap: var(--sn-web-spacing-2);
  padding: var(--sn-web-spacing-1);
  border: none;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.header-controls__username {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--sn-web-color-text-primary);
}
</style>
