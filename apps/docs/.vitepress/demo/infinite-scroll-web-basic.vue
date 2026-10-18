<script setup lang="ts">
/** Demo: SnInfiniteScroll — basic container with distance + load. */
import { ref } from 'vue'
import { SnInfiniteScroll } from '@snui/vue-web'

const count = ref(6)

function handleLoad(): void {
  count.value += 3
}
</script>

<template>
  <div class="sn-demo">
    <SnInfiniteScroll
      style="height: 240px"
      :distance="10"
      :load="handleLoad"
    >
      <div v-for="i in count" :key="i" class="sn-demo__item">
        {{ i }}
      </div>
    </SnInfiniteScroll>
  </div>
</template>

<style scoped>
.sn-demo { max-width: 320px; }
.sn-demo__item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 46px;
  margin-bottom: 10px;
  background: color-mix(in srgb, var(--sn-web-color-action-primary) 8%, transparent);
  border-radius: 3px;
}
.sn-demo__item:last-child { margin-bottom: 0; }
</style>
