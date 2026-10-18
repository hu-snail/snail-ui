<script setup lang="ts">
/** Demo: SnDataTable — loading state dims the body and shows a spinner. */
import { ref } from 'vue'
import { SnDataTable } from '@snui/vue-web'
const columns = [
  { title: 'Name', key: 'name' },
  { title: 'Age', key: 'age' },
]

const data = [
  { key: 0, name: 'John Brown', age: 32 },
  { key: 1, name: 'Jim Green', age: 42 },
  { key: 2, name: 'Joe Black', age: 32 },
]

const loading = ref(true)

function toggleLoading(): void {
  loading.value = !loading.value
}
</script>

<template>
  <div class="sn-demo">
    <button class="sn-demo-btn" type="button" @click="toggleLoading">
      {{ loading ? '停止加载' : '开始加载' }}
    </button>
    <SnDataTable :columns="columns" :data="data" :loading="loading" />
  </div>
</template>

<style scoped>
.sn-demo { max-width: 560px; }
.sn-demo-btn {
  margin-bottom: 12px;
  padding: 0 12px;
  height: 28px;
  border: 1px solid var(--sn-web-color-border-default);
  border-radius: 3px;
  background: var(--sn-web-color-background-surface);
  color: var(--sn-web-color-text-secondary);
  font-size: 13px;
  cursor: pointer;
}
.sn-demo-btn:hover { color: var(--sn-web-color-action-primary); border-color: var(--sn-web-color-action-primary); }
</style>
