---
outline: false
aside: false
prev: false
next: false
---

<script setup lang="ts">
import SnDocPage from '../../.vitepress/components/doc-page/SnDocPage.vue';
import { dynamicTagsDocPage } from '../../.vitepress/utils/doc-pages/dynamic-tags';
</script>

<SnDocPage :doc="dynamicTagsDocPage" />
