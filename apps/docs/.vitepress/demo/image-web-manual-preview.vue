<script setup lang="ts">
/** Demo: SnImage — open the preview manually through the showPreview method. */
import { ref } from 'vue'
import { SnButton, SnImage } from '@snui/vue-web'

const imageRef = ref<{ showPreview: () => void } | null>(null)

function openPreview(): void {
  imageRef.value?.showPreview()
}
</script>

<template>
  <div class="demo-col">
    <SnButton type="primary" size="small" @click="openPreview">展示图片预览</SnButton>
    <SnImage ref="imageRef" width="120" src="https://picsum.photos/id/1043/1200/800" alt="手动预览" />
  </div>
</template>

<style scoped>
.demo-col { display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
</style>
