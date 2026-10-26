<script setup lang="ts">
/** Demo: SnEllipsis — single / multi-line clamping with overflow tooltip and click expand. */
import { SnEllipsis } from '@snui/vue-web'

const longText =
  '这是一段很长很长的说明文本，用于演示文本截断：当容器宽度不足以容纳全部内容时，' +
  '超出部分会被省略号替代；将鼠标悬浮在文本上即可通过 Tooltip 查看完整内容，' +
  '溢出检测基于容器的实际尺寸自动计算，不会对未溢出的文本弹出气泡。'
</script>

<template>
  <div class="ellipsis-demo">
    <section class="ellipsis-demo__block">
      <h4>单行省略 + 溢出 Tooltip</h4>
      <SnEllipsis :width="320">{{ longText }}</SnEllipsis>
      <SnEllipsis :width="320" :tooltip="{ placement: 'bottom' }">{{ longText }}</SnEllipsis>
    </section>

    <section class="ellipsis-demo__block">
      <h4>多行截断（lineClamp）</h4>
      <SnEllipsis :width="360" :line-clamp="2">{{ longText }}</SnEllipsis>
    </section>

    <section class="ellipsis-demo__block">
      <h4>点击展开（expandTrigger）</h4>
      <SnEllipsis :width="360" :line-clamp="2" expand-trigger="click">
        {{ longText }}
      </SnEllipsis>
    </section>

    <section class="ellipsis-demo__block">
      <h4>未溢出的短文本（不弹气泡）</h4>
      <SnEllipsis :width="320">短文本不会弹出 Tooltip。</SnEllipsis>
    </section>
  </div>
</template>

<style scoped>
.ellipsis-demo {
  display: grid;
  gap: 18px;
}
.ellipsis-demo__block {
  display: grid;
  gap: 10px;
}
.ellipsis-demo__block h4 {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary, #888);
}
</style>
