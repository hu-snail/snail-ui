---
outline: false
aside: false
prev: false
next: false
---

<script setup lang="ts">
import SnDocPage from '../../.vitepress/components/doc-page/SnDocPage.vue';
import { paginationDocPage } from '../../.vitepress/utils/doc-pages/uni/pagination';
</script>

<SnDocPage :doc="paginationDocPage" />
