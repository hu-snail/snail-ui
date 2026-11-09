---
outline: false
aside: false
prev: false
next: false
---

<script setup lang="ts">
import SnDocPage from '../../.vitepress/components/doc-page/SnDocPage.vue';
import { treeSelectDocPage } from '../../.vitepress/utils/doc-pages/tree-select';
</script>

<SnDocPage :doc="treeSelectDocPage" />
