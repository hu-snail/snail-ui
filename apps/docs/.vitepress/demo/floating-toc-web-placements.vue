<script setup lang="ts">
/**
 * floating-toc-web-placements — the same rail on the left and on the right.
 */
import { ref } from 'vue';
import {
  SnFloatingToc,
  SnFloatingTocTrigger,
  SnFloatingTocBar,
  SnFloatingTocContent,
  SnFloatingTocItem,
} from '@snui/vue-web';

const leftScrollRef = ref<HTMLElement | null>(null);
const rightScrollRef = ref<HTMLElement | null>(null);

const sections = [
  { href: '#ftoc-place-left-a', title: '章节 A' },
  { href: '#ftoc-place-left-b', title: '章节 B' },
];

const rightSections = [
  { href: '#ftoc-place-right-a', title: '章节 A' },
  { href: '#ftoc-place-right-b', title: '章节 B' },
];
</script>

<template>
  <div class="ftoc-place">
    <div class="ftoc-place__pane">
      <span class="ftoc-place__label">placement="left"</span>
      <div ref="leftScrollRef" class="ftoc-place__scroller">
        <section id="ftoc-place-left-a">
          <h4>章节 A</h4>
          <p v-for="n in 4" :key="n">章节 A 段落 {{ n }}。</p>
        </section>
        <section id="ftoc-place-left-b">
          <h4>章节 B</h4>
          <p v-for="n in 4" :key="n">章节 B 段落 {{ n }}。</p>
        </section>
      </div>
      <SnFloatingToc
        class="ftoc-place__toc ftoc-place__toc--left"
        :scroll-container="leftScrollRef as HTMLElement"
        placement="left"
      >
        <SnFloatingTocTrigger>
          <SnFloatingTocBar
            v-for="section in sections"
            :key="section.href"
            :href="section.href"
            :title="section.title"
          />
        </SnFloatingTocTrigger>
        <SnFloatingTocContent aria-label="文章目录">
          <SnFloatingTocItem v-for="section in sections" :key="section.href" :href="section.href" />
        </SnFloatingTocContent>
      </SnFloatingToc>
    </div>

    <div class="ftoc-place__pane">
      <span class="ftoc-place__label">placement="right"</span>
      <div ref="rightScrollRef" class="ftoc-place__scroller ftoc-place__scroller--right">
        <section id="ftoc-place-right-a">
          <h4>章节 A</h4>
          <p v-for="n in 4" :key="n">章节 A 段落 {{ n }}。</p>
        </section>
        <section id="ftoc-place-right-b">
          <h4>章节 B</h4>
          <p v-for="n in 4" :key="n">章节 B 段落 {{ n }}。</p>
        </section>
      </div>
      <SnFloatingToc
        class="ftoc-place__toc ftoc-place__toc--right"
        :scroll-container="rightScrollRef as HTMLElement"
        placement="right"
      >
        <SnFloatingTocTrigger>
          <SnFloatingTocBar
            v-for="section in rightSections"
            :key="section.href"
            :href="section.href"
            :title="section.title"
          />
        </SnFloatingTocTrigger>
        <SnFloatingTocContent aria-label="文章目录">
          <SnFloatingTocItem
            v-for="section in rightSections"
            :key="section.href"
            :href="section.href"
          />
        </SnFloatingTocContent>
      </SnFloatingToc>
    </div>
  </div>
</template>

<style scoped>
.ftoc-place {
  display: flex;
  gap: 12px;
  width: 100%;
}
.ftoc-place__pane {
  position: relative;
  flex: 1;
  min-width: 0;
}
.ftoc-place__label {
  display: block;
  margin-bottom: 6px;
  font-size: 12px;
  color: var(--vp-c-text-3);
}
/* Both scrollers reserve a gutter wide enough for the rail (bar width +
 * focus ring offset), so the indicator never overlaps the body text. */
.ftoc-place__scroller {
  height: 200px;
  overflow-y: auto;
  padding: 0 20px 0 40px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
}
.ftoc-place__scroller--right {
  padding: 0 40px 0 20px;
}
.ftoc-place__scroller h4 {
  margin: 12px 0 6px;
  font-size: 13px;
}
.ftoc-place__scroller p {
  margin: 0 0 6px;
  font-size: 12px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}
.ftoc-place__toc {
  position: absolute;
  top: 50%;
}
.ftoc-place__toc--left {
  left: 10px;
}
.ftoc-place__toc--right {
  right: 10px;
}
</style>
