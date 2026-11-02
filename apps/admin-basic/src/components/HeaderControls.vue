<script setup lang="ts">
/**
 * Admin header controls: dark-mode switch, primary-color picker, language
 * dropdown and the user session dropdown. Reads/writes the app + auth
 * stores; page logout flow stays in AdminLayout via the `logout` event.
 */
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { Languages, LogOut, Moon, Sun } from 'lucide-vue-next';
import { useAppStore } from '@/stores/app';
import { useAuthStore } from '@/stores/auth';
import { PRIMARY_PRESETS } from '@/theme/presets';

const emit = defineEmits<{ logout: [] }>();

const appStore = useAppStore();
const authStore = useAuthStore();
const { t } = useI18n();
const { mode, primaryId, locale, primaryPreset } = storeToRefs(appStore);

const isDark = computed(() => mode.value === 'dark');

const localeOptions = [
  { key: 'zh-CN', label: '中文' },
  { key: 'en-US', label: 'English' },
];

const userOptions = computed(() => [
  { key: 'logout', label: t('common.logout'), icon: LogOut },
]);

function onModeChange(value: boolean | string | number): void {
  appStore.setMode(value === 'dark' ? 'dark' : 'light');
}

function onSelectLocale(key: string | number): void {
  appStore.setLocale(key === 'en-US' ? 'en-US' : 'zh-CN');
}

function onSelectUser(key: string | number): void {
  if (key === 'logout') emit('logout');
}
</script>

<template>
  <div class="header-controls">
    <label class="header-controls__theme" :title="t('header.theme')">
      <Sun v-if="isDark" class="header-controls__theme-icon" :size="16" />
      <Moon v-else class="header-controls__theme-icon" :size="16" />
      <SnSwitch
        size="small"
        :model-value="isDark"
        :aria-label="t('header.theme')"
        @update:model-value="onModeChange"
      />
    </label>

    <SnPopover trigger="click" placement="bottom-end">
      <button
        class="header-controls__swatch-trigger"
        :style="{ backgroundColor: primaryPreset.primary }"
        :aria-label="t('header.primaryColor')"
      />
      <template #content>
        <div class="header-controls__palette" role="listbox" :aria-label="t('header.primaryColor')">
          <button
            v-for="preset in PRIMARY_PRESETS"
            :key="preset.id"
            class="header-controls__swatch"
            :class="{ 'header-controls__swatch--active': primaryId === preset.id }"
            :style="{ backgroundColor: preset.primary }"
            role="option"
            :aria-selected="primaryId === preset.id"
            :aria-label="preset.id"
            @click="appStore.setPrimary(preset.id)"
          />
        </div>
      </template>
    </SnPopover>

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
        {{ locale === 'zh-CN' ? '中文' : 'English' }}
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

.header-controls__theme {
  display: inline-flex;
  align-items: center;
  gap: var(--sn-web-spacing-2);
  cursor: pointer;
  color: var(--sn-web-color-text-secondary);
}

.header-controls__theme-icon {
  display: block;
}

.header-controls__swatch-trigger {
  width: 20px;
  height: 20px;
  padding: 0;
  border: 2px solid var(--sn-web-color-background-surface);
  border-radius: var(--sn-web-radius-full);
  box-shadow: 0 0 0 1px var(--sn-web-color-border-default);
  cursor: pointer;
}

.header-controls__palette {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--sn-web-spacing-2);
  padding: var(--sn-web-spacing-2);
}

.header-controls__swatch {
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: var(--sn-web-radius-full);
  cursor: pointer;
  transition: transform 120ms ease;
}

.header-controls__swatch:hover {
  transform: scale(1.1);
}

.header-controls__swatch--active {
  outline: 2px solid var(--sn-web-color-text-primary);
  outline-offset: 2px;
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
