<script setup lang="ts">
/**
 * Demo: SnWatermark — multi-line text content next to the `cross` stagger mode.
 *
 * Note: `fontColor` is painted into a canvas tile, so it must be a real CSS
 * colour value (a `var(--sn-web-*)` string cannot be resolved by canvas).
 */
import { SnWatermark } from '@snui/vue-web'
</script>

<template>
  <div class="watermark-content-demo">
    <section class="watermark-content-demo__block">
      <h4>Multi-line copy (content array, tiled on a width / height grid)</h4>
      <SnWatermark
        :content="['Snail AUI platform', 'Internal docs', 'Internal use only']"
        :rotate="-24"
        :opacity="0.5"
        :width="180"
        :height="110"
        :font-size="14"
        :line-height="22"
        font-color="rgba(96, 98, 122, 0.34)"
      >
        <div class="watermark-content-demo__panel">
          <h5>Quarterly business analysis</h5>
          <p>
            When content is an array, each item renders as one line with lineHeight controlling the spacing; tiles form a width / height grid, not interleaved by default.
          </p>
          <p>The watermark layer is purely decorative and does not affect selecting, copying, or clicking the body content.</p>
        </div>
      </SnWatermark>
    </section>

    <section class="watermark-content-demo__block">
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
        <div class="watermark-content-demo__panel">
          <h5>Staggered layout of the same copy</h5>
          <p>
            With cross on, adjacent tiles in a row are offset vertically by half a tile height — denser visually and harder to crop out.
          </p>
          <p>Both blocks have identical content / rotation / opacity; only cross differs.</p>
        </div>
      </SnWatermark>
    </section>
  </div>
</template>

<style scoped>
.watermark-content-demo {
  display: grid;
  gap: 20px;
}
.watermark-content-demo__block h4 {
  margin: 0 0 10px;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}
.watermark-content-demo__panel {
  border: 1px solid var(--sn-web-color-border-subtle);
  border-radius: var(--sn-web-card-radius);
  background: var(--sn-web-color-background-surface);
  padding: 20px 24px;
  min-height: 180px;
}
.watermark-content-demo__panel h5 {
  margin: 0 0 10px;
  font-size: 15px;
  color: var(--sn-web-color-text-primary);
}
.watermark-content-demo__panel p {
  margin: 0 0 8px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--sn-web-color-text-secondary);
}
</style>
