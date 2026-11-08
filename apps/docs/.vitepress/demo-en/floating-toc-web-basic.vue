<script setup lang="ts">
/**
 * floating-toc-web-basic — the rail tracks the scroll position of the demo's
 * own scroll container; hovering it expands the section list.
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
    href: '#ftoc-basic-intro',
    title: 'Intro',
    summary: 'What the component solves and where it fits.',
  },
  {
    href: '#ftoc-basic-install',
    title: 'Install',
    summary: 'Pull @snui/vue-web in with one command and import the styles.',
  },
  {
    href: '#ftoc-basic-usage',
    title: 'Usage',
    summary: 'Composing Trigger + Bar + Content + Item.',
  },
  {
    href: '#ftoc-basic-faq',
    title: 'FAQ',
    summary: 'Scroll containers, nesting depth and theming.',
  },
];
</script>

<template>
  <div class="ftoc-demo">
    <div ref="scrollRef" class="ftoc-demo__scroller">
      <section
        v-for="section in sections"
        :id="section.href.slice(1)"
        :key="section.href"
        class="ftoc-demo__section"
      >
        <h4>{{ section.title }}</h4>
        <p v-for="n in 5" :key="n">
          Paragraph {{ n }} of “{{ section.title }}” — scroll the container on the right and watch
          the rail follow.
        </p>
      </section>
    </div>

    <SnFloatingToc
      class="ftoc-demo__toc"
      :scroll-container="scrollRef as HTMLElement"
      placement="right"
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
.ftoc-demo {
  position: relative;
  width: 100%;
}
.ftoc-demo__scroller {
  position: relative;
  height: 300px;
  overflow-y: auto;
  padding: 0 20px 0 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
}
/* The component is `position: fixed` by default; inside a docs demo it is
 * re-anchored to the demo card so it does not float over the whole page. */
.ftoc-demo__toc {
  position: absolute;
  top: 50%;
  right: 4px;
}
.ftoc-demo__section h4 {
  margin: 16px 0 8px;
  font-size: 14px;
}
.ftoc-demo__section p {
  margin: 0 0 8px;
  font-size: 13px;
  line-height: 1.8;
  color: var(--vp-c-text-2);
}
</style>
