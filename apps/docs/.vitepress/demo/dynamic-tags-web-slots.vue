<script setup lang="ts">
/** Demo: SnDynamicTags — custom tag / trigger slots. */
import { ref } from 'vue'
import { SnDynamicTags } from '@snui/vue-web'
const tags = ref(['设计', '开发', '测试'])
const picked = ref('')
</script>

<template>
  <div class="demo-col">
    <SnDynamicTags v-model="tags" placeholder="添加">
      <template #tag="{ label }">
        <span class="custom-tag" @click="picked = String(label)">{{ label }} ✓</span>
      </template>
    </SnDynamicTags>
    <span class="demo-log">点了：{{ picked || '（点一个 tag 试试）' }}</span>
  </div>
</template>

<style scoped>
.demo-col { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
.custom-tag {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 2px 10px; border-radius: 999px; cursor: pointer;
  background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1);
  font-size: 13px;
}
.demo-log { font-size: 13px; color: var(--vp-c-text-2); }
</style>
