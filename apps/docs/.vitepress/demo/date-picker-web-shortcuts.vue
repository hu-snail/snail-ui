<script setup lang="ts">
/** Demo: SnDatePicker — shortcuts + shortcuts-position. */
import { ref } from 'vue';
import { SnDatePicker } from '@snui/vue-web';
const range = ref<[number, number] | null>(null);
</script>

<template>
  <div class="demo-col">
    <div class="demo-row">
      <SnDatePicker
        v-model="range"
        type="datetimerange"
        :placeholder="['开始日期', '结束日期']"
        :shortcuts="[
          { label: '此刻', value: () => Date.now() },
          { label: '一周后', value: () => Date.now() + 7 * 86400000 },
        ]"
        shortcuts-position="left"
        clearable
        style="width: 380px"
      />
    </div>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}
.demo-row {
  display: flex;
  gap: 16px;
  align-items: center;
}
</style>
