---
outline: false
aside: false
prev: false
next: false
---

<script setup lang="ts">
import SnDocPage from '../../.vitepress/components/doc-page/SnDocPage.vue';
import { switchDocPage } from '../../.vitepress/utils/doc-pages/uni/switch';
</script>

<SnDocPage :doc="switchDocPage" />
