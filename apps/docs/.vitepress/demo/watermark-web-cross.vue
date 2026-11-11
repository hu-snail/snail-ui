<script setup lang="ts">
/** Demo: SnWatermark — cross stagger mode (adjacent tiles offset by half a gap). */
import { SnWatermark } from '@snui/vue-web';
</script>

<template>
  <div class="watermark-cross-demo">
    <section class="watermark-cross-demo__block">
      <h4>交错瓦片（cross = true，相邻瓦片错开半个间距）</h4>
      <SnWatermark
        :content="['蜗牛 AUI 平台', '内部资料', '请勿外传']"
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
          <h5>同一份文案的交错排布</h5>
          <p>
            打开 cross 后，同一行的相邻瓦片在垂直方向偏移半个瓦片高度，
            视觉上更密集，也更难被裁剪规避。
          </p>
          <p>content / 旋转 / 透明度与多行 demo 完全一致，只有 cross 不同。</p>
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
