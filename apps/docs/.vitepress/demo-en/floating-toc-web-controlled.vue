<script setup lang="ts">
/**
 * floating-toc-web-controlled — `open` fully controls the panel and
 * `open-change` reports every change.
 */
import { ref } from 'vue';
import { SnButton } from '@snui/vue-web';
import {
  SnFloatingToc,
  SnFloatingTocTrigger,
  SnFloatingTocBar,
  SnFloatingTocContent,
  SnFloatingTocItem,
} from '@snui/vue-web';

const isOpen = ref(false);
const scrollRef = ref<HTMLElement | null>(null);

const sections = [
  { href: '#ftoc-ctrl-a', title: 'First' },
  { href: '#ftoc-ctrl-b', title: 'Second' },
];
</script>

<template>
  <div class="ftoc-ctrl">
    <div class="ftoc-ctrl__bar">
      <SnButton size="small" @click="isOpen = !isOpen">
        {{ isOpen ? 'Collapse TOC' : 'Expand TOC' }}
      </SnButton>
      <span class="ftoc-ctrl__state">open: {{ isOpen }}</span>
    </div>

    <div ref="scrollRef" class="ftoc-ctrl__scroller">
      <section id="ftoc-ctrl-a">
        <h4>First section</h4>
        <p v-for="n in 4" :key="n">Paragraph {{ n }} of the first section.</p>
      </section>
      <section id="ftoc-ctrl-b">
        <h4>Second section</h4>
        <p v-for="n in 4" :key="n">Paragraph {{ n }} of the second section.</p>
      </section>
    </div>

    <SnFloatingToc
      class="ftoc-ctrl__toc"
      :scroll-container="scrollRef as HTMLElement"
      :open="isOpen"
      @open-change="isOpen = $event"
    >
      <SnFloatingTocTrigger>
        <SnFloatingTocBar
          v-for="section in sections"
          :key="section.href"
          :href="section.href"
          :title="section.title"
        />
      </SnFloatingTocTrigger>
      <SnFloatingTocContent aria-label="Controlled TOC">
        <SnFloatingTocItem v-for="section in sections" :key="section.href" :href="section.href" />
      </SnFloatingTocContent>
    </SnFloatingToc>
  </div>
</template>

<style scoped>
.ftoc-ctrl {
  position: relative;
  width: 100%;
}
.ftoc-ctrl__bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.ftoc-ctrl__state {
  font-size: 12px;
  color: var(--vp-c-text-3);
}
.ftoc-ctrl__scroller {
  height: 220px;
  overflow-y: auto;
  padding: 0 24px 0 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
}
.ftoc-ctrl__toc {
  position: absolute;
  top: 55%;
  right: 4px;
}
.ftoc-ctrl__scroller h4 {
  margin: 12px 0 6px;
  font-size: 13px;
}
.ftoc-ctrl__scroller p {
  margin: 0 0 6px;
  font-size: 12px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}
</style>
