<script setup lang="ts">
import { computed, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { enUS, zhCN } from '@snui/vue-web';
import { useAppStore } from '@/stores/app';
import { applyPrimaryColor, applyThemeMode } from '@/theme/apply';
import { i18n } from '@/i18n';

// Shell preferences → DOM side effects. This is the only place that touches
// documentElement; everything else stays declarative on the app store.
const appStore = useAppStore();
const { mode, primaryPreset, locale } = storeToRefs(appStore);
const { t } = useI18n();

watchEffect(() => {
  applyThemeMode(document.documentElement, mode.value);
  applyPrimaryColor(document.documentElement, primaryPreset.value, mode.value);
});

watchEffect(() => {
  i18n.global.locale.value = locale.value;
  document.documentElement.lang = locale.value;
  document.title = t('app.title');
});

// Component-internal strings (SnConfigProvider locale) follow the app locale.
const componentLocale = computed(() => (locale.value === 'zh-CN' ? zhCN : enUS));
</script>

<template>
  <SnConfigProvider :locale="componentLocale">
    <RouterView />
  </SnConfigProvider>
</template>
