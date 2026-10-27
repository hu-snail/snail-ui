<script setup lang="ts">
/** Demo: SnTag — closable + custom close-icon slot. */
import { ref } from 'vue';
import { CircleX } from 'lucide-vue-next';
import { SnIcon, SnTag } from '@snui/vue-web';

const visible = ref(true);
</script>

<template>
  <div class="demo-col">
    <div class="demo-row">
      <SnTag v-if="visible" closable @close="visible = false">可关闭标签</SnTag>
      <SnTag v-if="!visible" size="small" style="cursor: pointer" @click="visible = true"
        >已关闭，点此恢复</SnTag
      >
      <SnTag closable type="primary">任务</SnTag>
      <SnTag closable disabled type="success">禁用关闭</SnTag>
      <SnTag closable loading>加载中不可关闭</SnTag>
    </div>
    <div class="demo-row">
      <SnTag closable round type="info">
        <template #close-icon><SnIcon :icon="CircleX" /></template>
        自定义关闭图标
      </SnTag>
    </div>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}
.demo-row {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
