<script setup lang="ts">
/**
 * affix-web-basic — a toolbar pinned to the top of a scrollable container.
 */
import { ref } from 'vue'
import { SnAffix, SnButton } from '@snui/vue-web'

const scrollRef = ref<HTMLElement | null>(null)
</script>

<template>
  <div class="affix-demo">
    <div ref="scrollRef" class="affix-demo__scroller">
      <SnAffix :listen-to="() => scrollRef as HTMLElement" :trigger-top="0" :top="0">
        <div class="affix-demo__toolbar">
          <span class="affix-demo__toolbar-title">Toolbar</span>
          <SnButton size="tiny" type="primary">Save</SnButton>
        </div>
      </SnAffix>

      <div class="affix-demo__body">
        <p v-for="n in 24" :key="n" class="affix-demo__line">
          Line {{ n }} — scroll down and the toolbar sticks to the top of the container.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.affix-demo {
  width: 100%;
}
.affix-demo__scroller {
  position: relative;
  height: 260px;
  overflow-y: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
}
.affix-demo__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 12px;
  background: var(--vp-c-bg);
  border-bottom: 1px solid var(--vp-c-divider);
}
.affix-demo__toolbar-title {
  font-size: 13px;
  font-weight: 600;
}
.affix-demo__body {
  padding: 12px;
}
.affix-demo__line {
  margin: 0 0 10px;
  font-size: 13px;
  line-height: 1.8;
  color: var(--vp-c-text-2);
}
</style>
