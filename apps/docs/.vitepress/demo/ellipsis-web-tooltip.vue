<script setup lang="ts">
/** Demo: SnEllipsis — overflow tooltip (default bubble + custom placement). */
import { SnEllipsis } from '@snui/vue-web';

const longText =
  '这是一段很长很长的说明文本，用于演示文本截断：当容器宽度不足以容纳全部内容时，' +
  '将鼠标悬浮在文本上即可通过 Tooltip 查看完整内容，气泡方位可配置。';
</script>

<template>
  <div class="ellipsis-demo">
    <section class="ellipsis-demo__block">
      <h4>溢出 Tooltip（默认气泡）</h4>
      <SnEllipsis :width="320">{{ longText }}</SnEllipsis>
    </section>

    <section class="ellipsis-demo__block">
      <h4>tooltip placement="bottom"</h4>
      <SnEllipsis :width="320" :tooltip="{ placement: 'bottom' }">{{ longText }}</SnEllipsis>
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
