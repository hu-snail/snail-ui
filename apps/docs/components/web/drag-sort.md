---
outline: false
aside: false
prev: false
next: false
---

<script setup lang="ts">
import SnDocPage from '../../.vitepress/components/doc-page/SnDocPage.vue';
import { dragSortDocPage } from '../../.vitepress/utils/doc-pages/drag-sort';
</script>

<SnDocPage :doc="dragSortDocPage" />
