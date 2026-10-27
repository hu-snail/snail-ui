<script setup lang="ts">
/** Demo: SnTag — checkable with per-type checked colors. */
import { ref } from 'vue';
import { SnTag } from '@snui/vue-web';

const picked = ref(true);
</script>

<template>
  <div class="demo-col">
    <div class="demo-row">
      <SnTag v-model:checked="picked" checkable>可选中：{{ picked }}</SnTag>
      <SnTag :checked="false" checkable>未选中</SnTag>
      <SnTag :checked="true" checkable type="primary">选中态</SnTag>
    </div>
    <div class="demo-row">
      <SnTag :checked="true" checkable type="success">成功</SnTag>
      <SnTag :checked="true" checkable type="warning">警告</SnTag>
      <SnTag :checked="true" checkable type="error">错误</SnTag>
      <SnTag :checked="true" checkable round type="info">胶囊选中</SnTag>
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
