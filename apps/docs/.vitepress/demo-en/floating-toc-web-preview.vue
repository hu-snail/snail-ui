<script setup lang="ts">
/**
 * floating-toc-web-preview — `hover-action="preview"`: hovering a single bar
 * shows that section's title and summary, while the full list stays behind a
 * click (or keyboard focus).
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
  {
    href: '#ftoc-preview-a',
    title: 'Chapter A',
    summary: 'Where the component fits, and where it does not.',
  },
  {
    href: '#ftoc-preview-b',
    title: 'Chapter B',
    summary: 'Install with one command and pull in the styles.',
  },
  {
    href: '#ftoc-preview-c',
    title: 'Chapter C',
    summary: 'Composing Trigger + Bar + Content + Item.',
  },
];
</script>

<template>
  <div class="ftoc-preview">
    <div ref="scrollRef" class="ftoc-preview__scroller">
      <section
        v-for="section in sections"
        :id="section.href.slice(1)"
        :key="section.href"
        class="ftoc-preview__section"
      >
        <h4>{{ section.title }}</h4>
        <p v-for="n in 5" :key="n">Paragraph {{ n }} of {{ section.title }}.</p>
      </section>
    </div>

    <SnFloatingToc
      class="ftoc-preview__toc"
      :scroll-container="scrollRef as HTMLElement"
      hover-action="preview"
      placement="right"
    >
      <SnFloatingTocTrigger>
        <SnFloatingTocBar
          v-for="section in sections"
          :key="section.href"
          :href="section.href"
          :title="section.title"
          :summary="section.summary"
        />
      </SnFloatingTocTrigger>
      <SnFloatingTocContent aria-label="Single-section preview TOC">
        <SnFloatingTocItem v-for="section in sections" :key="section.href" :href="section.href" />
      </SnFloatingTocContent>
    </SnFloatingToc>
  </div>
</template>

<style scoped>
.ftoc-preview {
  position: relative;
  width: 100%;
}
.ftoc-preview__scroller {
  height: 260px;
  overflow-y: auto;
  padding: 0 40px 0 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
}
.ftoc-preview__toc {
  position: absolute;
  top: 50%;
  right: 10px;
}
.ftoc-preview__section h4 {
  margin: 12px 0 6px;
  font-size: 13px;
}
.ftoc-preview__section p {
  margin: 0 0 6px;
  font-size: 12px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}
</style>
