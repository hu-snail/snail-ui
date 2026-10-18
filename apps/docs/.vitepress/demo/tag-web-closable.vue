<script setup lang="ts">
/** Demo: SnTag — closable. */
import { ref } from 'vue'
const visible = ref(true)
</script>

<template>
  <div class="demo-row">
    <SnTag v-if="visible" closable @close="visible = false">可关闭标签</SnTag>
    <SnTag v-if="!visible" size="small" @click="visible = true" style="cursor: pointer;">已关闭，点此恢复</SnTag>
    <SnTag closable type="primary">任务</SnTag>
    <SnTag closable type="success" disabled>禁用关闭</SnTag>
  </div>
</template>

<style scoped>
.demo-row { display: flex; gap: 8px; align-items: center; }
</style>
