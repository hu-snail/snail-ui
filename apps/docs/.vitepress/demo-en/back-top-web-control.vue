<script setup lang="ts">
/**
 * back-top-web-control — custom slot content, a controlled `show`, and
 * different right/bottom offsets.
 */
import { ref } from 'vue'
import { SnBackTop, SnButton } from '@snui/vue-web'
import { ChevronsUp, ArrowUpCircle } from 'lucide-vue-next'

const controlledShow = ref(false)
const scrollRef = ref<HTMLElement | null>(null)
</script>

<template>
  <div class="back-top-demo">
    <div class="back-top-demo__actions">
      <SnButton size="small" @click="controlledShow = !controlledShow">
        Toggle controlled visibility (currently {{ controlledShow ? 'visible' : 'hidden' }})
      </SnButton>
    </div>

    <div ref="scrollRef" class="back-top-demo__scroller">
      <p v-for="n in 20" :key="n" class="back-top-demo__line">
        Line {{ n }} — the button on the right uses a custom slot icon.
      </p>
    </div>

    <!-- Uncontrolled, custom slot content. -->
    <SnBackTop
      :listen-to="() => scrollRef as HTMLElement"
      :visibility-height="120"
      :right="70"
      :bottom="16"
    >
      <span class="back-top-demo__slot">
        <ArrowUpCircle :size="18" />
        top
      </span>
    </SnBackTop>

    <!-- Controlled: ignores the scroll position. -->
    <SnBackTop :show="controlledShow" :right="16" :bottom="16">
      <ChevronsUp :size="18" />
    </SnBackTop>
  </div>
</template>

<style scoped>
.back-top-demo {
  position: relative;
  width: 100%;
}
.back-top-demo__actions {
  margin-bottom: 10px;
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
