<script setup lang="ts">
/** Demo: SnSliderBar — range dual handles (price range with a custom read-out). */
import { ref, computed } from 'vue';
import { SnSliderBar } from '@snui/vue-web';

const price = ref<[number, number]>([120, 480]);
const priceLabel = computed(() => `¥${price.value[0]} – ¥${price.value[1]}`);
</script>

<template>
  <div class="demo-col">
    <span class="demo-label">价格区间（range 双柄，手柄互不交叉）</span>
    <SnSliderBar
      v-model="price"
      range
      :min="0"
      :max="1000"
      :step="10"
      show-value
      :format-value="() => priceLabel"
      aria-label="Price range"
    />
    <span class="demo-log">{{ priceLabel }}</span>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 420px;
  padding: 12px 0;
}
.demo-label {
  font-size: 12px;
  color: var(--vp-c-text-2);
}
.demo-log {
  margin-top: 4px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>
