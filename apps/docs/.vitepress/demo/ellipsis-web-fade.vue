<script setup lang="ts">
/** Demo: SnEllipsis — fade smoke mask on the truncated edge. */
import { SnEllipsis } from '@snui/vue-web';

const paragraph =
  '蜗牛 AUI 的文本省略组件会把内容截断在指定的行数内。' +
  '开启 fade 后，截断边缘的文字会以烟雾渐隐的方式过渡，而不是生硬的省略号切断。';
</script>

<template>
  <div class="ellipsis-fade-demo">
    <section class="ellipsis-fade-demo__block">
      <h4>底部烟雾渐隐（fade）</h4>
      <SnEllipsis :width="360" :line-clamp="3" fade>{{ paragraph }}</SnEllipsis>
    </section>
  </div>
</template>

<style scoped>
.ellipsis-fade-demo {
  display: grid;
  gap: 18px;
}
.ellipsis-fade-demo__block {
  display: grid;
  gap: 10px;
}
.ellipsis-fade-demo__block h4 {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary, #888);
}
</style>
