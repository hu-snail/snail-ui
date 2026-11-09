---
outline: false
aside: false
prev: false
next: false
---

<script setup lang="ts">
import SnDocPage from '../../.vitepress/components/doc-page/SnDocPage.vue';
import { breadcrumbDocPage } from '../../.vitepress/utils/doc-pages/breadcrumb';
</script>

<SnDocPage :doc="breadcrumbDocPage" />
