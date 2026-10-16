<script setup lang="ts">
/**
 * back-top-web-change-position — repositioning the floating button.
 *
 * Shows: the `right` / `bottom` offsets. The columns share one scroll
 * container so the four corners are directly comparable.
 */
import { ref } from 'vue'
import { SnBackTop } from '@snui/vue-web'

const scrollRef = ref<HTMLElement | null>(null)
</script>

<template>
  <div class="bt-pos">
    <div ref="scrollRef" class="bt-pos__scroller">
      <p v-for="n in 30" :key="n" class="bt-pos__line">
        第 {{ n }} 行 —— 四个角落各挂一个按钮，滚动超过 80px 后同时出现。
      </p>

      <SnBackTop
        :listen-to="() => scrollRef as HTMLElement"
        :visibility-height="80"
        :right="12"
        :bottom="12"
      />
      <SnBackTop
        :listen-to="() => scrollRef as HTMLElement"
        :visibility-height="80"
        :right="64"
        :bottom="12"
      />
      <SnBackTop
        :listen-to="() => scrollRef as HTMLElement"
        :visibility-height="80"
        :right="12"
        :bottom="64"
      />
      <SnBackTop
        :listen-to="() => scrollRef as HTMLElement"
        :visibility-height="80"
        :right="64"
        :bottom="64"
      />
    </div>
  </div>
</template>

<style scoped>
.bt-pos {
  position: relative;
  width: 100%;
}
.bt-pos__scroller {
  height: 280px;
  overflow-y: auto;
  padding: 0 12px;
  border: 1px solid var(--sn-web-color-border);
  border-radius: 6px;
  background: var(--sn-web-color-background-subtle);
}
.bt-pos__line {
  margin: 0 0 10px;
  font-size: 13px;
  line-height: 1.8;
  color: var(--sn-web-color-text-secondary);
}
</style>
