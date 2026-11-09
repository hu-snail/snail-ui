---
outline: false
aside: false
prev: false
next: false
---

<script setup lang="ts">
import SnDocPage from '../../.vitepress/components/doc-page/SnDocPage.vue';
import { collapseDocPage } from '../../.vitepress/utils/doc-pages/collapse';
</script>

<SnDocPage :doc="collapseDocPage" />
