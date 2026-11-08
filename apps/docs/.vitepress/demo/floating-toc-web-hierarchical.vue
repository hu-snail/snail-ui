<script setup lang="ts">
/**
 * floating-toc-web-hierarchical — nested `level` shrinks the bars and indents
 * the panel entries.
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
  { href: '#ftoc-hier-overview', title: '概览', level: 1 },
  { href: '#ftoc-hier-feature-a', title: '特性 A', level: 2 },
  { href: '#ftoc-hier-feature-b', title: '特性 B', level: 2 },
  { href: '#ftoc-hier-detail', title: '实现细节', level: 3 },
  { href: '#ftoc-hier-api', title: 'API', level: 1 },
];
</script>

<template>
  <div class="ftoc-hier">
    <div ref="scrollRef" class="ftoc-hier__scroller">
      <section
        v-for="section in sections"
        :id="section.href.slice(1)"
        :key="section.href"
        class="ftoc-hier__section"
      >
        <h4>{{ section.title }}</h4>
        <p v-for="n in 4" :key="n">{{ section.title }} 段落 {{ n }}。</p>
      </section>
    </div>

    <SnFloatingToc
      class="ftoc-hier__toc"
      :scroll-container="scrollRef as HTMLElement"
      placement="right"
    >
      <SnFloatingTocTrigger>
        <SnFloatingTocBar
          v-for="section in sections"
          :key="section.href"
          :href="section.href"
          :title="section.title"
          :level="section.level"
        />
      </SnFloatingTocTrigger>
      <SnFloatingTocContent aria-label="分层目录">
        <SnFloatingTocItem
          v-for="section in sections"
          :key="section.href"
          :href="section.href"
          :level="section.level"
        />
      </SnFloatingTocContent>
    </SnFloatingToc>
  </div>
</template>

<style scoped>
.ftoc-hier {
  position: relative;
  width: 100%;
}
.ftoc-hier__scroller {
  height: 260px;
  overflow-y: auto;
  padding: 0 24px 0 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
}
.ftoc-hier__toc {
  position: absolute;
  top: 50%;
  right: 4px;
}
.ftoc-hier__section h4 {
  margin: 12px 0 6px;
  font-size: 13px;
}
.ftoc-hier__section p {
  margin: 0 0 6px;
  font-size: 12px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}
</style>
