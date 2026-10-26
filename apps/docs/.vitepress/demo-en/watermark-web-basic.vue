<script setup lang="ts">
/** Demo: SnWatermark — tiled text watermark over wrapped content with cross / rotate / opacity. */
import { SnWatermark } from '@snui/vue-web';
</script>

<template>
  <div class="watermark-demo">
    <SnWatermark
      :content="['AUI Platform', 'Internal docs']"
      :rotate="-22"
      :opacity="0.6"
      :width="140"
      :height="72"
      :font-size="14"
      font-color="rgba(100, 100, 120, 0.35)"
    >
      <div class="watermark-demo__content">
        <h4>Quarterly business analysis</h4>
        <p>
          This page is for authorized personnel only. The watermark layer is purely decorative and
          does not affect content selection, copying or interaction; multi-line copy is passed as an
          array, tiles laid out on a width / height grid by default.
        </p>
        <p>
          With cross enabled, adjacent tiles are offset by half a tile, creating a staggered layout.
        </p>
      </div>
    </SnWatermark>

    <SnWatermark
      content="CROSS"
      :cross="true"
      :rotate="-30"
      :opacity="0.4"
      font-color="rgba(14, 128, 235, 0.3)"
    >
      <div class="watermark-demo__content watermark-demo__content--short">
        <h4>Staggered tiles</h4>
        <p>cross = true: adjacent watermarks in the same row are offset by half a tile.</p>
      </div>
    </SnWatermark>
  </div>
</template>

<style scoped>
.watermark-demo {
  display: grid;
  gap: 16px;
}
.watermark-demo__content {
  border: 1px solid var(--sn-web-color-border-subtle, #e5e5e5);
  border-radius: var(--sn-web-card-radius, 10px);
  background: var(--sn-web-color-background-surface, #fff);
  padding: 20px 24px;
  min-height: 220px;
}
.watermark-demo__content--short {
  min-height: 120px;
}
.watermark-demo__content h4 {
  margin: 0 0 10px;
}
.watermark-demo__content p {
  margin: 0 0 8px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--sn-web-color-text-secondary, #555);
}
</style>
