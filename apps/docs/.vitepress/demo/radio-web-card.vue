<script setup lang="ts">
/** Demo: SnRadio — card variant with custom card content + corner tick. */
import { ref } from 'vue';
import { SnRadio, SnRadioGroup } from '@snui/vue-web';

const plan = ref('pro');
</script>

<template>
  <SnRadioGroup v-model="plan" variant="card" class="demo-cards">
    <SnRadio checked-value="basic">
      <template #card="{ checked }">
        <span class="demo-card__title">基础版</span>
        <span class="demo-card__price">¥0</span>
        <span class="demo-card__desc">个人项目 · 1 个空间</span>
        <span v-if="checked" class="demo-card__hint">已选择</span>
      </template>
    </SnRadio>
    <SnRadio checked-value="pro">
      <template #card>
        <span class="demo-card__title">专业版</span>
        <span class="demo-card__price">¥99</span>
        <span class="demo-card__desc">团队协作 · 10 个空间</span>
      </template>
    </SnRadio>
    <SnRadio checked-value="enterprise">
      <template #card>
        <span class="demo-card__title">企业版</span>
        <span class="demo-card__price">按需</span>
        <span class="demo-card__desc">私有部署 · 专属支持</span>
      </template>
    </SnRadio>
  </SnRadioGroup>
</template>

<style scoped>
.demo-cards {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  width: 100%;
}
.demo-cards :deep(.sn-radio--variant-card) {
  flex: 1 1 180px;
  min-width: 180px;
}
.demo-card__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--sn-web-color-text-primary);
}
.demo-card__price {
  margin-top: 6px;
  font-size: 20px;
  font-weight: 700;
  color: var(--sn-web-color-action-primary);
}
.demo-card__desc {
  margin-top: 4px;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
.demo-card__hint {
  margin-top: 6px;
  font-size: 12px;
  color: var(--sn-web-color-action-primary);
}
</style>
