<script setup lang="ts">
/** Demo: SnCheckbox — indeterminate select-all pattern. */
import { computed, ref } from 'vue';
import { SnCheckbox } from '@snui/vue-web';

const picked = ref<string[]>([]);
const all = ['a', 'b', 'c'];
const allChecked = computed(() => picked.value.length === all.length);
const indeterminate = computed(() => picked.value.length > 0 && !allChecked.value);

function toggleAll(): void {
  picked.value = allChecked.value ? [] : [...all];
}
</script>

<template>
  <div class="demo-col">
    <SnCheckbox
      :model-value="allChecked"
      :indeterminate="indeterminate"
      label="全选"
      @update:model-value="toggleAll"
    />
    <SnCheckbox
      v-model="picked"
      v-for="item in all"
      :key="item"
      :value="item"
      :label="item"
      style="margin-left: 24px"
    />
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}
</style>
