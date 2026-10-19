<script setup lang="ts">
/** Demo: SnWatermark — tiled text watermark over wrapped content with cross / rotate / opacity. */
import { SnWatermark } from '@snui/vue-web'
</script>

<template>
  <div class="watermark-demo">
    <SnWatermark
      :content="['AUI 平台', '内部资料']"
      :rotate="-22"
      :opacity="0.6"
      :width="140"
      :height="72"
      :font-size="14"
      font-color="rgba(100, 100, 120, 0.35)"
    >
      <div class="watermark-demo__content">
        <h4>季度经营分析报告</h4>
        <p>
          本页面内容仅限授权人员查阅。水印层为纯装饰元素，不影响正文的
          选择、复制与交互；多行文案以数组形式传入，相邻瓦片默认按
          width / height 网格平铺。
        </p>
        <p>设置 cross 后，相邻瓦片会错开半个瓦片，形成交错布局。</p>
      </div>
    </SnWatermark>

    <SnWatermark content="CROSS" :cross="true" :rotate="-30" :opacity="0.4" font-color="rgba(14, 128, 235, 0.3)">
      <div class="watermark-demo__content watermark-demo__content--short">
        <h4>交错瓦片</h4>
        <p>cross = true：同一行的相邻水印错开半个间距。</p>
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
