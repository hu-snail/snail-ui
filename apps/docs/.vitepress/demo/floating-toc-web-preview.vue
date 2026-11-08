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
    title: '章节 A',
    summary: '介绍组件的适用场景与不适用场景。',
  },
  {
    href: '#ftoc-preview-b',
    title: '章节 B',
    summary: '一条命令完成安装，并引入组件样式。',
  },
  {
    href: '#ftoc-preview-c',
    title: '章节 C',
    summary: 'Trigger + Bar + Content + Item 的组合写法。',
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
        <p v-for="n in 5" :key="n">{{ section.title }} 段落 {{ n }}。</p>
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
      <SnFloatingTocContent aria-label="单条预览模式目录">
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
