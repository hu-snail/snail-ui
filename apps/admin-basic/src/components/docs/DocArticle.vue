<script setup lang="ts">
import type { DocSection } from './doc-article-types';

defineProps<{ sections: DocSection[] }>();
</script>

<template>
  <article class="doc-article">
    <section v-for="section in sections" :key="section.heading" class="doc-article__section">
      <h2 class="doc-article__heading">{{ section.heading }}</h2>
      <p
        v-for="paragraph in section.paragraphs ?? []"
        :key="paragraph"
        class="doc-article__paragraph"
      >
        {{ paragraph }}
      </p>
      <ul v-if="section.list !== undefined" class="doc-article__list">
        <li v-for="item in section.list" :key="item">{{ item }}</li>
      </ul>
      <SnCode
        v-if="section.code !== undefined"
        class="doc-article__code"
        :code="section.code"
        :language="section.codeLanguage"
        word-wrap
        show-line-numbers
      />
    </section>
  </article>
</template>

<style scoped>
.doc-article {
  max-width: 860px;
}

.doc-article__section {
  margin-bottom: var(--sn-web-spacing-8);
}

.doc-article__heading {
  margin: 0 0 var(--sn-web-spacing-3);
  font-size: var(--sn-web-font-size-lg);
  font-weight: var(--sn-web-font-weight-semibold);
  color: var(--sn-web-color-text-primary);
}

.doc-article__paragraph {
  margin: 0 0 var(--sn-web-spacing-2);
  line-height: var(--sn-web-font-line-height-normal);
  color: var(--sn-web-color-text-secondary);
}

.doc-article__list {
  margin: 0 0 var(--sn-web-spacing-2);
  padding-left: var(--sn-web-spacing-6);
  color: var(--sn-web-color-text-secondary);
}

.doc-article__list li {
  margin-bottom: var(--sn-web-spacing-1);
  line-height: var(--sn-web-font-line-height-normal);
}

.doc-article__code {
  margin: var(--sn-web-spacing-3) 0;
}
</style>
