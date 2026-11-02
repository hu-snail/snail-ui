<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t } = useI18n();
</script>

<template>
  <div class="not-found">
    <SnEmpty :description="t('notFound.description')" size="large" />
    <SnButton type="primary" @click="router.push('/home')">
      {{ t('common.backHome') }}
    </SnButton>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sn-web-spacing-6);
  padding-top: 15vh;
}
</style>
