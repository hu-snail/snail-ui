---
outline: false
aside: false
prev: false
next: false
---

<script setup lang="ts">
import SnDocPage from '../../.vitepress/components/doc-page/SnDocPage.vue';
import { selectDocPage } from '../../.vitepress/utils/doc-pages/select';
</script>

<SnDocPage :doc="selectDocPage" />
