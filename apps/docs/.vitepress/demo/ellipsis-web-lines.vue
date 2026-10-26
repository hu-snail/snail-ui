<script setup lang="ts">
/** Demo: SnEllipsis — single-line vs multi-line clamping with the same text and width. */
import { SnEllipsis } from '@snui/vue-web';

const paragraph =
  '蜗牛 AUI 的文本省略组件会把内容截断在指定的行数内，' +
  '并在溢出时通过气泡展示完整文本。同一段文字在相同宽度下，' +
  'lineClamp 决定它保留几行：1 行为单行省略，2 行及以上为多行省略，' +
  '溢出检测基于容器实际高度自动计算。';

const clamps = [
  { value: 1, label: 'lineClamp = 1（单行省略）' },
  { value: 2, label: 'lineClamp = 2（两行后省略）' },
  { value: 3, label: 'lineClamp = 3（三行后省略）' },
];
</script>

<template>
  <div class="ellipsis-lines-demo">
    <section v-for="item in clamps" :key="item.value" class="ellipsis-lines-demo__block">
      <h4>{{ item.label }}</h4>
      <SnEllipsis :width="360" :line-clamp="item.value">{{ paragraph }}</SnEllipsis>
    </section>

    <section class="ellipsis-lines-demo__block">
      <h4>未溢出时不弹气泡</h4>
      <SnEllipsis :width="360" :line-clamp="3">短语不会触发省略。</SnEllipsis>
    </section>
  </div>
</template>

<style scoped>
.ellipsis-lines-demo {
  display: grid;
  gap: 20px;
}
.ellipsis-lines-demo__block {
  display: grid;
  gap: 8px;
}
.ellipsis-lines-demo__block h4 {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
