<script setup lang="ts">
/**
 * anchor-web-ignore-gap — `ignoreGap` decides how the active link is picked.
 *
 * Shows: two anchors over the same sections. Without `ignoreGap` the
 * highlight waits until a section crosses the top boundary; with it, the
 * highlight follows the exact href region the reader is inside.
 */
import { ref } from 'vue';
import { SnAnchor, SnAnchorLink } from '@snui/vue-web';

const gapRef = ref<HTMLElement | null>(null);
const exactRef = ref<HTMLElement | null>(null);

const sections = [
  { id: 'gap-a', title: '第一章' },
  { id: 'gap-b', title: '第二章' },
  { id: 'gap-c', title: '第三章' },
];
</script>

<template>
  <div class="anchor-gap">
    <div class="anchor-gap__col">
      <span class="anchor-gap__cap">ignoreGap=false（默认）</span>
      <SnAnchor :offset-target="() => gapRef as HTMLElement" :bound="12">
        <SnAnchorLink v-for="s in sections" :key="s.id" :title="s.title" :href="`#${s.id}`" />
      </SnAnchor>
      <div ref="gapRef" class="anchor-gap__scroller">
        <section v-for="s in sections" :id="s.id" :key="s.id" class="anchor-gap__section">
          <h4>{{ s.title }}</h4>
          <p v-for="n in 4" :key="n">段落 {{ n }}</p>
        </section>
      </div>
    </div>

    <div class="anchor-gap__col">
      <span class="anchor-gap__cap">ignoreGap=true</span>
      <SnAnchor :offset-target="() => exactRef as HTMLElement" :bound="12" ignore-gap>
        <SnAnchorLink v-for="s in sections" :key="s.id" :title="s.title" :href="`#${s.id}`" />
      </SnAnchor>
      <div ref="exactRef" class="anchor-gap__scroller">
        <section v-for="s in sections" :id="s.id" :key="s.id" class="anchor-gap__section">
          <h4>{{ s.title }}</h4>
          <p v-for="n in 4" :key="n">段落 {{ n }}</p>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.anchor-gap {
  display: flex;
  gap: 24px;
  width: 100%;
}
.anchor-gap__col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.anchor-gap__cap {
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
.anchor-gap__scroller {
  height: 220px;
  overflow-y: auto;
  padding: 0 12px;
  border: 1px solid var(--sn-web-color-border);
  border-radius: 6px;
  background: var(--sn-web-color-background-subtle);
}
.anchor-gap__section h4 {
  margin: 14px 0 6px;
  font-size: 14px;
}
.anchor-gap__section p {
  margin: 0 0 6px;
  font-size: 13px;
  line-height: 1.7;
  color: var(--sn-web-color-text-secondary);
}
</style>
