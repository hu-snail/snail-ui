---
outline: false
aside: false
prev: false
next: false
---

<script setup lang="ts">
import SnDocPage from '../../.vitepress/components/doc-page/SnDocPage.vue';
import { autoCompleteDocPage } from '../../.vitepress/utils/doc-pages/auto-complete';
</script>

<SnDocPage :doc="autoCompleteDocPage" />
