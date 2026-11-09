---
outline: false
aside: false
prev: false
next: false
---

<script setup lang="ts">
import SnDocPage from '../../.vitepress/components/doc-page/SnDocPage.vue';
import { pagingDocPage } from '../../.vitepress/utils/doc-pages/uni/paging';
</script>

<SnDocPage :doc="pagingDocPage" />
