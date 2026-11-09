---
outline: false
aside: false
prev: false
next: false
---

<script setup lang="ts">
import SnDocPage from '../../../.vitepress/components/doc-page/SnDocPage.vue';
import { splitDocPageEn } from '../../../.vitepress/utils/doc-pages/en/split';
</script>

<SnDocPage :doc="splitDocPageEn" />
