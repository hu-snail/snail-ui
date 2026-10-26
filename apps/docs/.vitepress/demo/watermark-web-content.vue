<script setup lang="ts">
/**
 * Demo: SnWatermark — multi-line text content next to the `cross` stagger mode.
 *
 * Note: `fontColor` is painted into a canvas tile, so it must be a real CSS
 * colour value (a `var(--sn-web-*)` string cannot be resolved by canvas).
 */
import { SnWatermark } from '@snui/vue-web';
</script>

<template>
  <div class="watermark-content-demo">
    <section class="watermark-content-demo__block">
      <h4>多行文案（content 数组，按 width / height 网格平铺）</h4>
      <SnWatermark
        :content="['蜗牛 AUI 平台', '内部资料', '请勿外传']"
        :rotate="-24"
        :opacity="0.5"
        :width="180"
        :height="110"
        :font-size="14"
        :line-height="22"
        font-color="rgba(96, 98, 122, 0.34)"
      >
        <div class="watermark-content-demo__panel">
          <h5>季度经营分析报告</h5>
          <p>
            content 传入数组时，每一项渲染为一行，行距由 lineHeight 控制； 瓦片按 width / height
            组成网格平铺，默认不交错。
          </p>
          <p>水印层为纯装饰元素，不影响正文的选择、复制与点击交互。</p>
        </div>
      </SnWatermark>
    </section>

    <section class="watermark-content-demo__block">
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
        <div class="watermark-content-demo__panel">
          <h5>同一份文案的交错排布</h5>
          <p>
            打开 cross 后，同一行的相邻瓦片在垂直方向偏移半个瓦片高度，
            视觉上更密集，也更难被裁剪规避。
          </p>
          <p>两块的 content / 旋转 / 透明度完全一致，只有 cross 不同。</p>
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
