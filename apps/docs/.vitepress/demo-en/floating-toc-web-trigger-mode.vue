<script setup lang="ts">
/**
 * floating-toc-web-trigger-mode — trigger-mode="press" opens the rail on
 * press instead of hover.
 */
import { ref } from 'vue';
import {
  SnFloatingToc,
  SnFloatingTocTrigger,
  SnFloatingTocBar,
  SnFloatingTocContent,
  SnFloatingTocItem,
} from '@snui/vue-web';

const scrollRef = ref<HTMLElement | null>(null);

const sections = [
  { href: '#ftoc-press-a', title: 'Chapter A' },
  { href: '#ftoc-press-b', title: 'Chapter B' },
];
</script>

<template>
  <div class="ftoc-press">
    <span class="ftoc-press__label">trigger-mode="press" (open the rail on press)</span>
    <div ref="scrollRef" class="ftoc-press__scroller">
      <section id="ftoc-press-a">
        <h4>Chapter A</h4>
        <p v-for="n in 4" :key="n">Paragraph {{ n }} of chapter A.</p>
      </section>
      <section id="ftoc-press-b">
        <h4>Chapter B</h4>
        <p v-for="n in 4" :key="n">Paragraph {{ n }} of chapter B.</p>
      </section>
    </div>
    <SnFloatingToc
      class="ftoc-press__toc"
      :scroll-container="scrollRef as HTMLElement"
      trigger-mode="press"
    >
      <SnFloatingTocTrigger>
        <SnFloatingTocBar
          v-for="section in sections"
          :key="section.href"
          :href="section.href"
          :title="section.title"
        />
      </SnFloatingTocTrigger>
      <SnFloatingTocContent aria-label="On this page">
        <SnFloatingTocItem v-for="section in sections" :key="section.href" :href="section.href" />
      </SnFloatingTocContent>
    </SnFloatingToc>
  </div>
</template>

<style scoped>
.ftoc-press {
  position: relative;
  width: 100%;
}
.ftoc-press__label {
  display: block;
  margin-bottom: 6px;
  font-size: 12px;
  color: var(--vp-c-text-3);
}
/* The scroller reserves a gutter wide enough for the rail (bar width +
 * focus ring offset), so the indicator never overlaps the body text. */
.ftoc-press__scroller {
  height: 200px;
  overflow-y: auto;
  padding: 0 40px 0 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
}
.ftoc-press__scroller h4 {
  margin: 12px 0 6px;
  font-size: 13px;
}
.ftoc-press__scroller p {
  margin: 0 0 6px;
  font-size: 12px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}
.ftoc-press__toc {
  position: absolute;
  top: 50%;
  right: 10px;
}
</style>
