<script setup lang="ts">
/** Demo: SnSelect — clearable / disabled / loading. */
import { ref } from 'vue';
import { SnSelect } from '@snui/vue-web';
const a = ref<string | null>('上海');
const b = ref<string | null>('北京');
const cities = ['北京', '上海', '广州'];
</script>

<template>
  <div class="demo-row">
    <SnSelect v-model="a" :options="cities" clearable style="width: 200px" />
    <SnSelect v-model="b" :options="cities" disabled style="width: 200px" />
    <SnSelect :options="cities" loading placeholder="加载中…" style="width: 200px" />
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}
</style>
