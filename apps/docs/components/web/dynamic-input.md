---
outline: false
aside: false
prev: false
next: false
---

<script setup lang="ts">
import SnDocPage from '../../.vitepress/components/doc-page/SnDocPage.vue';
import { dynamicInputDocPage } from '../../.vitepress/utils/doc-pages/dynamic-input';
</script>

<SnDocPage :doc="dynamicInputDocPage" />
