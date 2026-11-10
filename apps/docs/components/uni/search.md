---
outline: false
aside: false
prev: false
next: false
---

<script setup lang="ts">
import SnDocPage from '../../.vitepress/components/doc-page/SnDocPage.vue';
import { searchDocPage } from '../../.vitepress/utils/doc-pages/uni/search';
</script>

<SnDocPage :doc="searchDocPage" />
