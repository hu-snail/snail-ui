---
outline: false
aside: false
prev: false
next: false
---

<script setup lang="ts">
import SnDocPage from '../../.vitepress/components/doc-page/SnDocPage.vue';
import { countDownDocPage } from '../../.vitepress/utils/doc-pages/uni/count-down';
</script>

<SnDocPage :doc="countDownDocPage" />
