<script setup lang="ts">
/** Demo: SnWatermark — cross stagger mode (adjacent tiles offset by half a gap). */
import { SnWatermark } from '@snui/vue-web';
</script>

<template>
  <div class="watermark-cross-demo">
    <section class="watermark-cross-demo__block">
      <h4>Staggered tiles (cross = true, adjacent tiles offset by half a gap)</h4>
      <SnWatermark
        :content="['Snail AUI platform', 'Internal docs', 'Internal use only']"
        :cross="true"
        :rotate="-24"
        :opacity="0.5"
        :width="180"
        :height="110"
        :font-size="14"
        :line-height="22"
        font-color="rgba(96, 98, 122, 0.34)"
      >
        <div class="watermark-cross-demo__panel">
          <h5>Staggered layout of the same copy</h5>
          <p>
            With cross on, adjacent tiles in a row are offset vertically by half a tile height —
            denser visually and harder to crop out.
          </p>
          <p>Content / rotation / opacity match the multi-line demo; only cross differs.</p>
        </div>
      </SnWatermark>
    </section>
  </div>
</template>

<style scoped>
.watermark-cross-demo {
  display: grid;
  gap: 20px;
}
.watermark-cross-demo__block h4 {
  margin: 0 0 10px;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}
.watermark-cross-demo__panel {
  border: 1px solid var(--sn-web-color-border-subtle);
  border-radius: var(--sn-web-card-radius);
  background: var(--sn-web-color-background-surface);
  padding: 20px 24px;
  min-height: 180px;
}
.watermark-cross-demo__panel h5 {
  margin: 0 0 10px;
  font-size: 15px;
  color: var(--sn-web-color-text-primary);
}
.watermark-cross-demo__panel p {
  margin: 0 0 8px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--sn-web-color-text-secondary);
}
</style>
