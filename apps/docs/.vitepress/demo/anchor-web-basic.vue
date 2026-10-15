<script setup lang="ts">
/**
 * anchor-web-basic — a rail anchor tracking three sections in a scroll
 * container. Clicking a link scrolls to its section.
 */
import { ref } from 'vue'
import { SnAnchor, SnAnchorLink } from '@snui/vue-web'

const scrollRef = ref<HTMLElement | null>(null)
</script>

<template>
  <div class="anchor-demo">
    <SnAnchor
      class="anchor-demo__nav"
      :bound="12"
      :offset-target="() => scrollRef as HTMLElement"
    >
      <SnAnchorLink title="简介" href="#anchor-demo-intro" />
      <SnAnchorLink title="安装" href="#anchor-demo-install" />
      <SnAnchorLink title="用法" href="#anchor-demo-usage" />
    </SnAnchor>

    <div ref="scrollRef" class="anchor-demo__scroller">
      <section id="anchor-demo-intro" class="anchor-demo__section">
        <h4>简介</h4>
        <p v-for="n in 6" :key="n">简介段落 {{ n }} —— 滚动以观察左侧高亮跟随。</p>
      </section>
      <section id="anchor-demo-install" class="anchor-demo__section">
        <h4>安装</h4>
        <p v-for="n in 6" :key="n">安装说明 {{ n }}。</p>
      </section>
      <section id="anchor-demo-usage" class="anchor-demo__section">
        <h4>用法</h4>
        <p v-for="n in 6" :key="n">用法示例 {{ n }}。</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.anchor-demo {
  display: flex;
  gap: 20px;
  width: 100%;
}
.anchor-demo__nav {
  flex: none;
  width: 140px;
}
.anchor-demo__scroller {
  flex: 1;
  min-width: 0;
  height: 260px;
  overflow-y: auto;
  padding: 0 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
}
.anchor-demo__section h4 {
  margin: 16px 0 8px;
  font-size: 14px;
}
.anchor-demo__section p {
  margin: 0 0 8px;
  font-size: 13px;
  line-height: 1.8;
  color: var(--vp-c-text-2);
}
</style>
