---
outline: false
aside: false
prev: false
next: false
---

<script setup lang="ts">
import SnDocPage from '../../../.vitepress/components/doc-page/SnDocPage.vue';
import { switchDocPageEn } from '../../../.vitepress/utils/doc-pages/en/uni/switch';
</script>

<SnDocPage :doc="switchDocPageEn" />
