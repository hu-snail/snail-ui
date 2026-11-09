---
outline: false
aside: false
prev: false
next: false
---

<script setup lang="ts">
import SnDocPage from '../../.vitepress/components/doc-page/SnDocPage.vue';
import { popselectDocPage } from '../../.vitepress/utils/doc-pages/popselect';
</script>

<SnDocPage :doc="popselectDocPage" />
