<script setup lang="ts">
/** Demo: SnLink — link-like interaction on a non-anchor tag. */
import { ref } from 'vue';
import { SnLink } from '@snui/vue-web';

const clickCount = ref(0);
</script>

<template>
  <div class="link-state-demo">
    <div class="link-state-demo__row">
      <SnLink tag="span" type="primary" @click="clickCount += 1">span 伪链接</SnLink>
      <span class="link-state-demo__hint">已触发 {{ clickCount }} 次</span>
    </div>
  </div>
</template>

<style scoped>
.link-state-demo {
  display: grid;
  gap: 20px;
}
.link-state-demo__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
}
.link-state-demo__hint {
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
</style>
