---
outline: false
aside: false
prev: false
next: false
---

<script setup lang="ts">
import SnDocPage from '../../../.vitepress/components/doc-page/SnDocPage.vue';
import { selectDocPageEn } from '../../../.vitepress/utils/doc-pages/en/select';
</script>

<SnDocPage :doc="selectDocPageEn" />
