<script setup lang="ts">
/**
 * anchor-web-scrollto — programmatic scrolling into a scroll container.
 *
 * Shows: host-driven jumps that mirror what a link click does, so the
 * anchor's active tracking and the manual scroll stay in sync.
 */
import { ref } from 'vue'
import { SnAnchor, SnAnchorLink, SnButton } from '@snui/vue-web'

const scrollRef = ref<HTMLElement | null>(null)
const lastJump = ref('—')

const sections = [
  { id: 'sto-a', title: 'Node A' },
  { id: 'sto-b', title: 'Node B' },
  { id: 'sto-c', title: 'Node C' },
]

function jumpTo(id: string): void {
  lastJump.value = `#${id}`
  const el = scrollRef.value?.querySelector(`#${id}`)
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div class="anchor-sto">
    <div class="anchor-sto__bar">
      <SnButton
        v-for="s in sections"
        :key="s.id"
        size="small"
        @click="jumpTo(s.id)"
      >
        Jump to {{ s.title }}
      </SnButton>
      <span class="anchor-sto__log">Last jump:<code>{{ lastJump }}</code></span>
    </div>

    <div class="anchor-sto__body">
      <SnAnchor :offset-target="() => scrollRef as HTMLElement" :bound="12">
        <SnAnchorLink
          v-for="s in sections"
          :key="s.id"
          :title="s.title"
          :href="`#${s.id}`"
        />
      </SnAnchor>

      <div ref="scrollRef" class="anchor-sto__scroller">
        <section v-for="s in sections" :id="s.id" :key="s.id" class="anchor-sto__section">
          <h4>{{ s.title }}</h4>
          <p v-for="n in 5" :key="n">Section {{ n }} of {{ s.title }}.</p>
        </section>
      </div>
    </div>

    <p class="anchor-sto__hint">
      The button above calls <code>scrollIntoView</code>; links in the left nav use the built-in scroll logic — both paths keep the anchor highlight in sync.
    </p>
  </div>
</template>

<style scoped>
.anchor-sto {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
}
.anchor-sto__bar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.anchor-sto__log {
  margin-left: auto;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
.anchor-sto__body {
  display: flex;
  gap: 20px;
}
.anchor-sto__scroller {
  flex: 1;
  min-width: 0;
  height: 240px;
  overflow-y: auto;
  padding: 0 12px;
  border: 1px solid var(--sn-web-color-border);
  border-radius: 6px;
  background: var(--sn-web-color-background-subtle);
}
.anchor-sto__section h4 {
  margin: 14px 0 6px;
  font-size: 14px;
}
.anchor-sto__section p {
  margin: 0 0 6px;
  font-size: 13px;
  line-height: 1.7;
  color: var(--sn-web-color-text-secondary);
}
.anchor-sto__hint {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--sn-web-color-text-secondary);
}
</style>
