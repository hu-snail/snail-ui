---
outline: false
aside: false
prev: false
next: false
---

<script setup lang="ts">
import SnDocPage from '../../.vitepress/components/doc-page/SnDocPage.vue';
import { floatingTocDocPage } from '../../.vitepress/utils/doc-pages/floating-toc';
</script>

<SnDocPage :doc="floatingTocDocPage" />
