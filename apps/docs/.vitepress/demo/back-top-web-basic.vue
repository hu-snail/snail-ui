<script setup lang="ts">
/**
 * back-top-web-basic — the floating button appearing after 200px of scroll.
 */
import { ref } from 'vue';
import { SnBackTop } from '@snui/vue-web';

const scrollRef = ref<HTMLElement | null>(null);
</script>

<template>
  <div class="back-top-demo">
    <div ref="scrollRef" class="back-top-demo__scroller">
      <p v-for="n in 30" :key="n" class="back-top-demo__line">
        第 {{ n }} 行 —— 滚动超过 200px 后，右下角出现回到顶部按钮。
      </p>
    </div>

    <SnBackTop
      :listen-to="() => scrollRef as HTMLElement"
      :visibility-height="200"
      :right="16"
      :bottom="16"
    />
  </div>
</template>

<style scoped>
.back-top-demo {
  position: relative;
  width: 100%;
}
.back-top-demo__scroller {
  height: 260px;
  overflow-y: auto;
  padding: 0 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
}
.back-top-demo__line {
  margin: 0 0 10px;
  font-size: 13px;
  line-height: 1.8;
  color: var(--vp-c-text-2);
}
</style>
