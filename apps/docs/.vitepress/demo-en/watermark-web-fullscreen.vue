<script setup lang="ts">
/** Demo: SnWatermark — fullscreen coverage toggled from the page. */
import { ref } from 'vue'
import { SnButton, SnWatermark } from '@snui/vue-web'

const fullscreen = ref(false)
</script>

<template>
  <div class="watermark-fullscreen-demo">
    <SnButton type="primary" @click="fullscreen = !fullscreen">
      {{ fullscreen ? 'Hide fullscreen watermark' : 'Show fullscreen watermark' }}
    </SnButton>

    <p class="watermark-fullscreen-demo__hint">
      The fullscreen watermark covers the whole viewport via a fixed layer (zIndex 1000) without wrapping the page content.
    </p>

    <SnWatermark
      v-if="fullscreen"
      content="Preview mode"
      fullscreen
      :z-index="1000"
      :rotate="-24"
      :opacity="0.35"
      font-color="rgba(120, 120, 140, 0.5)"
    />
  </div>
</template>

<style scoped>
.watermark-fullscreen-demo {
  display: grid;
  gap: 12px;
  justify-items: start;
}
.watermark-fullscreen-demo__hint {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary, #888);
}
</style>
