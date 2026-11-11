<script setup lang="ts">
/** Demo: SnBackTop — custom slot content. */
import { ref } from 'vue';
import { SnBackTop } from '@snui/vue-web';
import { ArrowUpCircle } from 'lucide-vue-next';

const scrollRef = ref<HTMLElement | null>(null);
</script>

<template>
  <div class="back-top-demo">
    <div ref="scrollRef" class="back-top-demo__scroller">
      <p v-for="n in 20" :key="n" class="back-top-demo__line">
        第 {{ n }} 行 —— 右侧按钮使用自定义插槽图标。
      </p>
    </div>

    <SnBackTop
      :listen-to="() => scrollRef as HTMLElement"
      :visibility-height="120"
      :right="70"
      :bottom="16"
    >
      <span class="back-top-demo__slot">
        <ArrowUpCircle :size="18" />
        顶部
      </span>
    </SnBackTop>
  </div>
</template>

<style scoped>
.back-top-demo {
  position: relative;
  width: 100%;
}
.back-top-demo__scroller {
  height: 240px;
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
.back-top-demo__slot {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0 10px;
  font-size: 12px;
}
</style>
