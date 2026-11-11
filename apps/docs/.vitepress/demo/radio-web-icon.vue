<script setup lang="ts">
/** Demo: SnRadio — 图标卡片（card 变体 + 图标内容，选中为右上角勾图标）。 */
import { ref } from 'vue';
import { SnRadio, SnRadioGroup } from '@snui/vue-web';
import { Sun, Moon, Cloud, Zap } from 'lucide-vue-next';

const picked = ref('sun');

const options = [
  { value: 'sun', label: '晴天', icon: Sun },
  { value: 'moon', label: '夜间', icon: Moon },
  { value: 'cloud', label: '多云', icon: Cloud },
  { value: 'zap', label: '雷暴', icon: Zap },
];
</script>

<template>
  <SnRadioGroup v-model="picked" variant="card" class="demo-tiles">
    <SnRadio
      v-for="option in options"
      :key="option.value"
      :checked-value="option.value"
      :aria-label="option.label"
    >
      <template #card>
        <component :is="option.icon" :size="22" class="demo-tile__glyph" />
        <span class="demo-tile__label">{{ option.label }}</span>
      </template>
    </SnRadio>
  </SnRadioGroup>
  <p class="demo-log">picked = {{ picked }}</p>
</template>

<style scoped>
.demo-tiles {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.demo-tiles :deep(.sn-radio--variant-card) {
  width: 96px;
  align-items: center;
}
.demo-tile__glyph {
  color: var(--sn-web-color-text-secondary);
}
.demo-tiles :deep(.sn-radio--checked) .demo-tile__glyph {
  color: var(--sn-web-color-action-primary);
}
.demo-tile__label {
  margin-top: 6px;
  font-size: 12px;
  color: var(--sn-web-color-text-secondary);
}
.demo-log {
  margin: 12px 0 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>
